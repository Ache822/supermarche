import { Router } from "express";
import {
  submitApplicationHandler,
  listApplicationsHandler,
  getApplicationByIdHandler,
  updateApplicationStatusHandler,
  sendApplicationEmailHandler
} from "./applications.controller";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";
import { publicSubmissionRateLimiter } from "../../common/middleware/rateLimiter";

export const applicationsRouter = Router();

// Public onboarding form submission
applicationsRouter.post("/", publicSubmissionRateLimiter, submitApplicationHandler);

// Admin protected endpoints
applicationsRouter.get(
  "/",
  authenticate,
  requirePermission("applications:read"),
  listApplicationsHandler
);

applicationsRouter.get(
  "/:id",
  authenticate,
  requirePermission("applications:read"),
  getApplicationByIdHandler
);

applicationsRouter.patch(
  "/:id/status",
  authenticate,
  requirePermission("applications:manage"),
  updateApplicationStatusHandler
);

applicationsRouter.post(
  "/:id/email",
  authenticate,
  requirePermission("applications:manage"),
  sendApplicationEmailHandler
);

applicationsRouter.post(
  "/:id/custom-email",
  authenticate,
  requirePermission("applications:manage"),
  sendApplicationEmailHandler
);
