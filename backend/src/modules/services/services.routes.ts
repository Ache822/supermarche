import { Router } from "express";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";
import {
  getCategoriesHandler,
  createCategoryHandler,
  updateCategoryHandler,
  getServicesHandler,
  getServiceByIdHandler,
  createServiceHandler,
  updateServiceHandler,
  batchToggleVisibilityHandler,
  deleteServiceHandler,
  uploadServiceImageHandler
} from "./services.controller";

export const servicesRouter = Router();

// Service Image Upload route (Accessible via /api/v1/services/upload and /api/v1/admin/services/upload)
servicesRouter.post("/upload", authenticate, requirePermission("pages:edit"), uploadServiceImageHandler);

// Category routes
servicesRouter.get("/categories", getCategoriesHandler);
servicesRouter.post("/categories", authenticate, requirePermission("pages:edit"), createCategoryHandler);
servicesRouter.patch("/categories/:id", authenticate, requirePermission("pages:edit"), updateCategoryHandler);

// Batch service visibility toggle route
servicesRouter.patch("/visibility", authenticate, requirePermission("pages:edit"), batchToggleVisibilityHandler);

// Single service item routes
servicesRouter.get("/", getServicesHandler);
servicesRouter.get("/:id", getServiceByIdHandler);
servicesRouter.post("/", authenticate, requirePermission("pages:edit"), createServiceHandler);
servicesRouter.patch("/:id", authenticate, requirePermission("pages:edit"), updateServiceHandler);
servicesRouter.delete("/:id", authenticate, requirePermission("pages:edit"), deleteServiceHandler);

