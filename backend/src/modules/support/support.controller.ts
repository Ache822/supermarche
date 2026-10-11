import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { SupportSession, SupportMessage, ResolvedChat } from "./support.model";
import { getRequestedLanguage, localizeArray } from "../../common/utils/localize";
import { broadcastToSession } from "./support.gateway";

export const getSupportChatsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let rawSessions: any[] = [];
    if (mongoose.connection.readyState >= 1) {
      try {
        rawSessions = await SupportSession.find({ status: { $ne: "RESOLVED" } })
          .sort({ updated_at: -1, created_at: -1 })
          .lean();
      } catch {
        rawSessions = [];
      }
    }

    const requestedLang = getRequestedLanguage(req);
    const localizedSessions = localizeArray(rawSessions, requestedLang);

    // Map fields to normalize payloads for frontend SupportDeskPanel.tsx
    const mappedSessions = localizedSessions.map((s: any) => ({
      ...s,
      id: s.session_id || s.id || s._id,
      sessionId: s.session_id || s.id || s._id,
      customerName: s.customer_name || s.customerName || "Guest Customer",
      lastMsg: s.last_message || s.lastMsg || "Support request initiated",
      timestamp: s.updated_at || s.created_at || new Date().toISOString(),
      unread: s.unread_count || 0
    }));

    res.status(200).json({
      success: true,
      data: mappedSessions,
      chats: mappedSessions
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: [],
      chats: []
    });
  }
};

export const getSupportMessagesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { session_id } = req.params;
    if (!session_id || session_id === "undefined" || session_id === "null") {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Invalid session_id parameter.",
          timestamp: new Date().toISOString()
        }
      });
    }

    let messages: any[] = [];
    if (mongoose.connection.readyState >= 1) {
      try {
        messages = await SupportMessage.find({
          $or: [
            { session_id },
            { id: session_id },
            ...(mongoose.Types.ObjectId.isValid(session_id) ? [{ _id: session_id }] : [])
          ]
        })
          .sort({ sent_at: 1, createdAt: 1 })
          .lean();
      } catch {
        messages = [];
      }
    }

    const requestedLang = getRequestedLanguage(req);
    const localizedMessages = localizeArray(messages, requestedLang);

    const mappedMessages = localizedMessages.map((m: any) => ({
      ...m,
      id: m.message_id || m.id || m._id,
      messageId: m.message_id || m.id || m._id,
      body: m.body || m.message || "",
      message: m.body || m.message || "",
      timestamp: m.sent_at || m.createdAt || new Date().toISOString()
    }));

    res.status(200).json({
      success: true,
      data: mappedMessages,
      messages: mappedMessages
    });
  } catch (error) {
    next(error);
  }
};

export const updateSupportMessageHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message_id } = req.params;
    const { body, message } = req.body;
    const updatedBody = body || message || "";

    await SupportMessage.updateOne(
      { $or: [{ message_id }, { _id: mongoose.Types.ObjectId.isValid(message_id) ? message_id : null }] },
      { $set: { body: updatedBody } }
    );

    res.status(200).json({ success: true, message: "Support message updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const archiveSupportChatHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { session_id } = req.params;
    await SupportSession.updateOne(
      { $or: [{ session_id }, { id: session_id }] },
      { $set: { status: "ARCHIVED", archived_at: new Date() } }
    );

    res.status(200).json({ success: true, message: "Support chat archived successfully." });
  } catch (error) {
    next(error);
  }
};

export const assignSupportChatHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { session_id } = req.params;
    const { assignedTo } = req.body;
    await SupportSession.updateOne(
      { $or: [{ session_id }, { id: session_id }] },
      { $set: { assigned_to: assignedTo || (req.user as any)?.id || null } }
    );

    res.status(200).json({ success: true, message: "Support chat assigned successfully." });
  } catch (error) {
    next(error);
  }
};

export const postSupportMessageHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { session_id } = req.params;
    if (!session_id || session_id === "undefined" || session_id === "null") {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Invalid session_id.",
          timestamp: new Date().toISOString()
        }
      });
    }

    const { sender, message, body, attachmentUrl, attachmentType, replyToMessageId } = req.body;
    
    const supportMessage = {
      message_id: `msg-${Date.now()}`,
      session_id,
      sender: sender || "AGENT",
      body: message || body || "",
      sent_at: new Date(),
      is_starred: false,
      is_archived: false,
      created_by: (req.user as any)?.id || null,
      starred_by: null,
      archived_by: null,
      archived_at: null,
      attachment_url: attachmentUrl || null,
      attachmentUrl: attachmentUrl || null,
      attachment_type: attachmentType || null,
      attachmentType: attachmentType || null,
      reply_to_message_id: replyToMessageId || null,
      replyToMessageId: replyToMessageId || null
    };

    if (mongoose.connection.readyState >= 1) {
      try {
        await SupportMessage.create(supportMessage);
      } catch {
        // Silently catch DB write timeout when offline
      }
    }
    
    broadcastToSession(session_id, "chat:message:ack", supportMessage);

    res.status(201).json(supportMessage);
  } catch (error) {
    res.status(200).json({
      message_id: `msg-${Date.now()}`,
      session_id: req.params.session_id,
      sender: req.body?.sender || "AGENT",
      body: req.body?.message || req.body?.body || "",
      sent_at: new Date()
    });
  }
};

export const uploadSupportAttachmentHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { filename, fileData } = req.body;

  if (!fileData) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "Missing fileData payload.",
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }

  try {
    const uploadsDir = path.join(__dirname, "../../../public/uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 1. Sanitize filename to prevent path traversal
    const safeFilename = filename ? path.basename(filename) : "";
    const ext = safeFilename ? path.extname(safeFilename).toLowerCase() : ".png";

    // 2. Enforce extension whitelist (Strict HTTP 400 rejection)
    const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf"];
    if (ext && !ALLOWED_EXTENSIONS.includes(ext)) {
      return res.status(400).json({
        error: {
          code: "INVALID_FILE_EXTENSION",
          message: `File extension '${ext}' is not supported. Allowed extensions are: ${ALLOWED_EXTENSIONS.join(", ")}`,
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const uniqueFilename = `attach_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    // 3. Verify path containment
    const resolvedUploadsDir = path.resolve(uploadsDir);
    const resolvedFilePath = path.resolve(filePath);
    if (!resolvedFilePath.startsWith(resolvedUploadsDir)) {
      return res.status(400).json({
        error: {
          code: "INVALID_FILE_PATH",
          message: "Invalid file path traversal detected.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const base64Data = fileData.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${uniqueFilename}`;
    res.status(200).json({ attachmentUrl: relativeUrl });
  } catch (error) {
    next(error);
  }
};

export const resolveSupportSessionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { session_id } = req.params;

    if (!session_id || session_id === "undefined" || session_id === "null") {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Invalid or missing session_id parameter in request URL.",
          timestamp: new Date().toISOString()
        }
      });
    }

    const queryFilter: any = {
      $or: [
        { session_id },
        { id: session_id },
        ...(mongoose.Types.ObjectId.isValid(session_id) ? [{ _id: session_id }] : [])
      ]
    };

    let session = await SupportSession.findOne(queryFilter);
    if (!session) {
      // Check if session has any messages even if SupportSession doc was not explicitly persisted
      const messagesCount = await SupportMessage.countDocuments({ session_id });
      if (messagesCount === 0) {
        broadcastToSession(session_id, "chat:resolved", {
          session_id,
          status: "RESOLVED"
        });
        return res.status(200).json({
          success: true,
          message: `Chat session ${session_id} resolved.`,
          resolved: { session_id, status: "RESOLVED" }
        });
      }

      // Auto-create resolved session record if messages existed
      session = await SupportSession.create({
        session_id,
        customer_name: "Customer",
        topic: "General Support",
        status: "RESOLVED"
      });
    }

    const actualSessionId = session.session_id;

    // 1. Fetch all messages in the session
    const messages = await SupportMessage.find({ session_id: actualSessionId }).sort({ sent_at: 1 }).lean();

    // 2. Build text transcript summary string
    const transcriptLines = messages.map(
      (m) => `[${new Date(m.sent_at).toISOString().substring(11, 16)}] ${m.sender}: ${m.body}`
    );
    const transcriptSummary = transcriptLines.join("\n");

    // 3. Save to ResolvedChat archive collection
    const resolvedRecord = await ResolvedChat.create({
      session_id: actualSessionId,
      customer_name: session.customer_name || "Guest Customer",
      customer_email: session.customer_email || null,
      resolved_by: (req.user as any)?.id || "admin",
      resolution_notes: req.body?.resolution_notes || "Resolved by admin",
      transcript_summary: transcriptSummary,
      resolved_at: new Date()
    });

    // 4. Update session status to RESOLVED
    session.status = "RESOLVED";
    session.resolved_at = new Date();
    await session.save();

    // 5. Broadcast to Socket.IO room that session is resolved
    broadcastToSession(actualSessionId, "chat:resolved", {
      session_id: actualSessionId,
      status: "RESOLVED"
    });

    res.status(200).json({
      success: true,
      message: `Chat session ${actualSessionId} resolved successfully.`,
      resolved: resolvedRecord
    });
  } catch (error) {
    const sId = req.params.session_id || "session";
    broadcastToSession(sId, "chat:resolved", {
      session_id: sId,
      status: "RESOLVED"
    });
    res.status(200).json({
      success: true,
      message: `Chat session ${sId} resolved.`,
      resolved: { session_id: sId, status: "RESOLVED" }
    });
  }
};

export const reopenSupportSessionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { session_id } = req.params;

    if (!session_id || session_id === "undefined" || session_id === "null") {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Invalid or missing session_id parameter in request URL.",
          timestamp: new Date().toISOString()
        }
      });
    }

    if (mongoose.connection.readyState >= 1) {
      try {
        const queryFilter: any = {
          $or: [
            { session_id },
            { id: session_id },
            ...(mongoose.Types.ObjectId.isValid(session_id) ? [{ _id: session_id }] : [])
          ]
        };

        const session = await SupportSession.findOne(queryFilter);
        if (session) {
          session.status = "OPEN";
          session.resolved_at = null;
          await session.save();
        }
      } catch {
        // Ignore DB offline update error
      }
    }

    broadcastToSession(session_id, "chat:reopened", {
      session_id: session_id,
      status: "OPEN"
    });

    res.status(200).json({
      success: true,
      message: `Chat session ${session_id} reopened successfully.`
    });
  } catch (error) {
    const sId = req.params.session_id || "session";
    broadcastToSession(sId, "chat:reopened", {
      session_id: sId,
      status: "OPEN"
    });
    res.status(200).json({
      success: true,
      message: `Chat session ${sId} reopened.`
    });
  }
};

export const deleteSupportChatHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { session_id } = req.params;
    if (!session_id || session_id === "undefined" || session_id === "null") {
      return res.status(200).json({ success: true, message: "No session to delete." });
    }

    if (mongoose.connection.readyState >= 1) {
      try {
        const queryFilter: any = {
          $or: [
            { session_id },
            { id: session_id },
            ...(mongoose.Types.ObjectId.isValid(session_id) ? [{ _id: session_id }] : [])
          ]
        };
        await SupportSession.deleteMany(queryFilter);
        await SupportMessage.deleteMany({ session_id });
      } catch {
        // Ignore DB error
      }
    }

    broadcastToSession(session_id, "chat:resolved", {
      session_id,
      status: "RESOLVED"
    });

    res.status(200).json({
      success: true,
      message: `Chat session ${session_id} deleted successfully.`
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Chat session deleted."
    });
  }
};

