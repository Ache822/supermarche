import { Router } from "express";
import {
  getFeaturedTestimonialsHandler,
  submitTestimonialHandler,
  listAdminTestimonialsHandler,
  updateTestimonialStatusHandler,
  toggleTestimonialFeaturedHandler,
  deleteTestimonialHandler
} from "./testimonials.controller";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";
import { publicSubmissionRateLimiter } from "../../common/middleware/rateLimiter";

export const testimonialsRouter = Router();
export const adminTestimonialsRouter = Router();

// Public Visitor Endpoints
testimonialsRouter.get("/featured", getFeaturedTestimonialsHandler);
testimonialsRouter.post("/", publicSubmissionRateLimiter, submitTestimonialHandler);

// Protected Admin Moderation Endpoints (Accessible at /api/v1/admin/testimonials)
adminTestimonialsRouter.get(
  "/",
  authenticate,
  requirePermission("testimonials:manage"),
  listAdminTestimonialsHandler
);

adminTestimonialsRouter.patch(
  "/:id/status",
  authenticate,
  requirePermission("testimonials:manage"),
  updateTestimonialStatusHandler
);

adminTestimonialsRouter.patch(
  "/:id/toggle-featured",
  authenticate,
  requirePermission("testimonials:manage"),
  toggleTestimonialFeaturedHandler
);

adminTestimonialsRouter.delete(
  "/:id",
  authenticate,
  requirePermission("testimonials:manage"),
  deleteTestimonialHandler
);
