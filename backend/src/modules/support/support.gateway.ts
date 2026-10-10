import { Server, Socket } from "socket.io";
import { SupportSession, SupportMessage } from "./support.model";

let ioInstance: Server | null = null;

/**
 * Broadcast an event payload to all clients connected to a specific chat session room.
 */
export const broadcastToSession = (sessionId: string, event: string, data: any) => {
  if (ioInstance) {
    ioInstance.to(sessionId).emit(event, data);
    // Also emit globally so administrative desk lists receive live status updates
    ioInstance.emit(event, data);
  }
};

/**
 * Broadcast an event payload globally to all connected socket clients.
 */
export const broadcastGlobal = (event: string, data: any) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};

/**
 * Initialize Socket.IO server event handlers for real-time live support chat and system events.
 */
export const initializeSupportSocketIO = (io: Server) => {
  ioInstance = io;

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on("join_chat", async (payload: {
      sessionId?: string;
      customerName?: string;
      userName?: string;
      city?: string;
      topic?: string;
      status?: string;
    }) => {
      try {
        const sessionId = payload.sessionId || `sess_${Math.random().toString(36).substring(2, 9)}`;
        socket.join(sessionId);

        let session = await SupportSession.findOne({ session_id: sessionId });

        if (!session) {
          session = await SupportSession.create({
            session_id: sessionId,
            user_name: payload.customerName || payload.userName || "Website Visitor",
            status: "OPEN",
            last_activity_at: new Date(),
            started_at: new Date()
          });
        }

        const historyMessages = await SupportMessage.find({ session_id: sessionId })
          .sort({ sent_at: 1 })
          .lean();

        socket.emit("join_chat:ack", {
          success: true,
          sessionId: session.session_id,
          customerName: session.user_name,
          status: session.status,
          history: historyMessages
        });

        io.emit("session_updated", {
          sessionId: session.session_id,
          customerName: session.user_name,
          status: session.status,
          unreadCount: 0
        });
      } catch (error) {
        socket.emit("chat_error", { message: "Failed to join chat session" });
      }
    });

    socket.on("send_message", async (payload: {
      sessionId: string;
      sender: "CUSTOMER" | "AGENT" | "BOT";
      message?: string;
      body?: string;
      attachment?: { name: string; url: string; mimeType?: string };
    }) => {
      try {
        if (!payload.sessionId) return;
        const msgText = payload.message || payload.body || "";

        const messageDoc = await SupportMessage.create({
          message_id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          session_id: payload.sessionId,
          sender: payload.sender || "CUSTOMER",
          body: msgText,
          attachment_url: payload.attachment?.url || null,
          sent_at: new Date()
        });

        await SupportSession.updateOne(
          { session_id: payload.sessionId },
          { $set: { last_activity_at: new Date() } }
        );

        broadcastToSession(payload.sessionId, "receive_message", {
          id: messageDoc._id,
          sessionId: messageDoc.session_id,
          sender: messageDoc.sender,
          message: messageDoc.body,
          body: messageDoc.body,
          attachment: payload.attachment || null,
          timestamp: messageDoc.sent_at
        });
      } catch (error) {
        socket.emit("chat_error", { message: "Failed to process chat message" });
      }
    });

    socket.on("typing_indicator", (payload: { sessionId: string; sender: string; isTyping: boolean }) => {
      if (payload.sessionId) {
        socket.to(payload.sessionId).emit("typing_indicator", payload);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};
