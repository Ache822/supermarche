import { Router } from "express";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";
import { listPermissionsHandler } from "./access.controller";

export const accessRouter = Router();

// Secure Access Control Panel endpoint to list available system permissions
accessRouter.get("/permissions", authenticate, requirePermission("users:manage"), listPermissionsHandler);
