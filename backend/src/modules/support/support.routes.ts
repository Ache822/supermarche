import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";
import {
  getSupportChatsHandler,
  getSupportMessagesHandler,
  updateSupportMessageHandler,
  archiveSupportChatHandler,
  assignSupportChatHandler,
  postSupportMessageHandler,
  uploadSupportAttachmentHandler,
  resolveSupportSessionHandler,
  reopenSupportSessionHandler
} from "./support.controller";

export const supportRouter = Router();

// Staff Support Desk Chat Listing (Requires authentication & support:chat permission)
supportRouter.get("/chats", authenticate, requirePermission("support:chat"), getSupportChatsHandler);
supportRouter.get("/active", authenticate, requirePermission("support:chat"), getSupportChatsHandler);
supportRouter.get("/admin/chat/active", authenticate, requirePermission("support:chat"), getSupportChatsHandler);

// Public & Agent Session Chat Messages (Accessible to visitors with session_id as well as logged in staff)
supportRouter.get("/chats/:session_id/messages", optionalAuthenticate, getSupportMessagesHandler);
supportRouter.get("/:session_id/messages", optionalAuthenticate, getSupportMessagesHandler);
supportRouter.post("/chats/:session_id/messages", optionalAuthenticate, postSupportMessageHandler);
supportRouter.post("/uploads", optionalAuthenticate, uploadSupportAttachmentHandler);

// Admin / Staff Actions on specific chats
supportRouter.patch("/messages/:message_id", authenticate, requirePermission("support:chat"), updateSupportMessageHandler);
supportRouter.patch("/chats/:session_id/archive", authenticate, requirePermission("support:chat"), archiveSupportChatHandler);
supportRouter.patch("/chats/:session_id/assign", authenticate, requirePermission("support:chat"), assignSupportChatHandler);
supportRouter.post("/chats/:session_id/resolve", authenticate, requirePermission("support:chat"), resolveSupportSessionHandler);
supportRouter.post("/chats/:session_id/reopen", authenticate, requirePermission("support:chat"), reopenSupportSessionHandler);

