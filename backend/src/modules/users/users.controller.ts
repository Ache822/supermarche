import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { createUserSchema, inviteUserSchema, acceptInviteSchema } from "./users.schema";
import { hashPassword } from "../../common/utils/password";
import { User, Invitation } from "./users.model";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { getPaginatedData } from "../../common/utils/pagination";
import { sendEmail } from "../../common/services/email.service";
import { renderSupermarcheEmailHtml } from "../../common/templates/emailTemplateRenderer";
import { config } from "../../config/env";

export const listUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPaginatedData(req, User, {}, { select: "-password_hash", sort: "-createdAt" });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "User validation failed.",
          details: parseResult.error.errors.map(e => ({ field: e.path.join('.'), issue: e.message })),
          timestamp: new Date().toISOString(),
          request_id: req.headers['x-request-id'] || null
        }
      });
    }

    const { email, password, fullName, permissions } = parseResult.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: {
          code: "CONFLICT",
          message: "A user with this email address already exists.",
          timestamp: new Date().toISOString(),
          request_id: req.headers['x-request-id'] || null
        }
      });
    }

    const password_hash = await hashPassword(password);
    const authId = `usr_${uuidv4().replace(/-/g, "").substring(0, 16)}`;

    const user = await User.create({
      authId,
      email,
      password_hash,
      fullName,
      permissions: permissions || []
    });

    res.status(201).json({
      id: user._id,
      authId: user.authId,
      email: user.email,
      fullName: user.fullName
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await User.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await User.findOneAndDelete({
        $or: [{ id }, { authId: id }]
      });
    }

    if (!deleted) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "User record not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers['x-request-id'] || null
        }
      });
    }

    res.status(200).json({ success: true, message: "User account deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const inviteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = inviteUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Invitation validation failed.",
          details: parseResult.error.errors.map(e => ({ field: e.path.join('.'), issue: e.message })),
          timestamp: new Date().toISOString(),
          request_id: req.headers['x-request-id'] || null
        }
      });
    }

    const token = uuidv4();
    const token_hash = await bcrypt.hash(token, 12);
    const expires_at = new Date(Date.now() + (parseResult.data.expires_in_minutes || 1440) * 60 * 1000);

    await Invitation.create({
      email: parseResult.data.email,
      permissions: parseResult.data.permissions,
      token_hash,
      expires_at
    });

    const primaryFrontendUrl = config.corsOrigin.split(",")[0].trim();
    const inviteUrl = `${primaryFrontendUrl}/accept-invite?token=${token}`;

    // Render branded HTML onboarding invitation email
    const emailHtml = await renderSupermarcheEmailHtml({
      title: "You're Invited to Join Supermarche Admin Console",
      badgeText: "TEAM ONBOARDING",
      subHeaderBadge: "ADMIN CONSOLE",
      body: `<p>You have been invited by an administrator to join the Supermarche Admin Operations team.</p><p>Please click the button below to set up your password and activate your account access.</p>`,
      highlightBoxText: "This invitation link is single-use and will expire in 24 hours.",
      ctaText: "Accept Invite & Set Password",
      ctaUrl: inviteUrl
    });

    // Automatically send invitation email to target address
    await sendEmail({
      to: parseResult.data.email,
      subject: "Invitation to Join Supermarche Admin Console",
      text: `You are invited to join Supermarche Admin Console. Accept your invite here: ${inviteUrl}`,
      html: emailHtml
    });

    res.status(201).json({
      success: true,
      message: `Invitation email dispatched to ${parseResult.data.email}`,
      invite_token: token,
      invite_url: inviteUrl,
      expires_at
    });
  } catch (error) {
    next(error);
  }
};

export const acceptInviteHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = acceptInviteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Accept invitation validation failed.",
          details: parseResult.error.errors.map(e => ({ field: e.path.join('.'), issue: e.message })),
          timestamp: new Date().toISOString(),
          request_id: req.headers['x-request-id'] || null
        }
      });
    }

    const { token, fullName, password } = parseResult.data;

    // Retrieve active non-expired invitations
    const invitations = await Invitation.find({
      expires_at: { $gt: new Date() }
    });

    let matchedInvite = null;
    for (const inv of invitations) {
      const isMatch = await bcrypt.compare(token, inv.token_hash);
      if (isMatch) {
        matchedInvite = inv;
        break;
      }
    }

    if (!matchedInvite) {
      return res.status(400).json({
        error: {
          code: "INVALID_TOKEN",
          message: "Invitation token is invalid or has expired.",
          timestamp: new Date().toISOString(),
          request_id: req.headers['x-request-id'] || null
        }
      });
    }

    const password_hash = await hashPassword(password);
    const authId = `usr_${uuidv4().replace(/-/g, "").substring(0, 16)}`;

    // Upsert User profile with invited email and assigned permissions
    const user = await User.findOneAndUpdate(
      { email: matchedInvite.email },
      {
        authId,
        email: matchedInvite.email,
        password_hash,
        fullName,
        access: "ADMIN",
        permissions: matchedInvite.permissions,
        is_active: true
      },
      { upsert: true, returnDocument: "after" }
    );

    // Consume invitation token so it cannot be reused
    await Invitation.findByIdAndDelete(matchedInvite._id);

    console.log(`[NOTIFICATION] Invited Team Member Account created for ${user.fullName} (${user.email})`);

    res.status(201).json({
      success: true,
      message: "Account created and activated successfully.",
      user: {
        id: user._id,
        authId: user.authId,
        email: user.email,
        fullName: user.fullName,
        access: user.access,
        permissions: user.permissions
      }
    });
  } catch (error) {
    next(error);
  }
};
