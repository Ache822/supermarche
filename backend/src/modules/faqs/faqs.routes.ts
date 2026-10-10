import { Router } from "express";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";
import {
  getPublicFaqsHandler,
  searchFaqsHandler,
  listAllFaqsHandler,
  createFaqHandler,
  updateFaqHandler,
  deleteFaqHandler
} from "./faqs.controller";

export const faqsRouter = Router();

// Public routes for FAQs & Instant Search
faqsRouter.get("/", getPublicFaqsHandler);
faqsRouter.get("/search", searchFaqsHandler);

// Admin dashboard routes (secured)
faqsRouter.get("/admin", authenticate, requirePermission("faqs:manage"), listAllFaqsHandler);
faqsRouter.post("/admin", authenticate, requirePermission("faqs:manage"), createFaqHandler);
faqsRouter.put("/admin/:id", authenticate, requirePermission("faqs:manage"), updateFaqHandler);
faqsRouter.patch("/admin/:id", authenticate, requirePermission("faqs:manage"), updateFaqHandler);
faqsRouter.delete("/admin/:id", authenticate, requirePermission("faqs:manage"), deleteFaqHandler);

// Direct aliases for non-prefixed calls
faqsRouter.post("/", authenticate, requirePermission("faqs:manage"), createFaqHandler);
faqsRouter.put("/:id", authenticate, requirePermission("faqs:manage"), updateFaqHandler);
faqsRouter.patch("/:id", authenticate, requirePermission("faqs:manage"), updateFaqHandler);
faqsRouter.delete("/:id", authenticate, requirePermission("faqs:manage"), deleteFaqHandler);
