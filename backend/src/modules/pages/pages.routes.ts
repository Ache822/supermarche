import { Router } from "express";
import { getPublicPageHandler, createPageSectionHandler, updatePageSectionHandler } from "./pages.controller";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";

export const pagesRouter = Router();

pagesRouter.get("/public/:slug", getPublicPageHandler);
pagesRouter.post("/admin/:page_id/sections", authenticate, requirePermission("pages:edit"), createPageSectionHandler);
pagesRouter.put("/admin/sections/:id", authenticate, requirePermission("pages:edit"), updatePageSectionHandler);
