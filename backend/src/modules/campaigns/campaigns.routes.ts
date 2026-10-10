import { Router } from "express";
import {
  subscribeCampaignHandler,
  getSubscribersHandler,
  broadcastCampaignHandler,
  getCampaignsHandler
} from "./campaigns.controller";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";

export const campaignsRouter = Router();

// Public footer opt-in
campaignsRouter.post("/subscribe", subscribeCampaignHandler);

// Public campaign announcements listing (allows landing page & visitors to view campaigns without 401)
campaignsRouter.get("/", getCampaignsHandler);

// Admin campaign management & subscriber list (protected)
campaignsRouter.get(
  "/subscribers",
  authenticate,
  requirePermission("campaigns:manage"),
  getSubscribersHandler
);

campaignsRouter.post(
  "/broadcast",
  authenticate,
  requirePermission("campaigns:manage"),
  broadcastCampaignHandler
);
