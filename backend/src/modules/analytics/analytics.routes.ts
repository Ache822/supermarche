import { Router } from "express";
import { trackVisitorHitHandler, getAnalyticsOverviewHandler } from "./analytics.controller";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";

export const analyticsRouter = Router();

// Public hit tracking ingestion route (POST /api/v1/analytics/track)
analyticsRouter.post("/track", trackVisitorHitHandler);

// Protected admin analytics overview route (GET /api/v1/analytics/overview)
analyticsRouter.get(
  "/overview",
  authenticate,
  requirePermission("analytics:read"),
  getAnalyticsOverviewHandler
);

// Protected admin analytics overview route alias (GET /api/v1/analytics/admin/overview)
analyticsRouter.get(
  "/admin/overview",
  authenticate,
  requirePermission("analytics:read"),
  getAnalyticsOverviewHandler
);

// Additional route alias to support /api/v1/admin/analytics/overview requests from frontend
analyticsRouter.get(
  "/overview",
  authenticate,
  requirePermission("analytics:read"),
  getAnalyticsOverviewHandler
);
