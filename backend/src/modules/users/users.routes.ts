import { Router } from "express";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";
import {
  createUserHandler,
  listUsersHandler,
  deleteUserHandler,
  inviteUserHandler,
  acceptInviteHandler
} from "./users.controller";

export const usersRouter = Router();

usersRouter.get("/", authenticate, requirePermission("users:read"), listUsersHandler);
usersRouter.post("/", authenticate, requirePermission("users:manage"), createUserHandler);
usersRouter.delete("/:id", authenticate, requirePermission("users:manage"), deleteUserHandler);

// Invitation endpoints consolidated under users
usersRouter.post("/invite", authenticate, requirePermission("users:manage"), inviteUserHandler);
usersRouter.post("/accept-invite", acceptInviteHandler); // Public endpoint for token redemption
