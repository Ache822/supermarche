import { Router } from "express";
import { authenticate } from "../../common/middleware/authMiddleware";
import { requirePermission } from "../../common/guards/requirePermission";
import {
  getPublicArticlesHandler,
  getPublicArticleBySlugHandler,
  voteArticleHandler,
  toggleVerifiedHandler,
  listAllArticlesHandler,
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler
} from "./articles.controller";

export const articlesRouter = Router();

// Public routes for visitors
articlesRouter.get("/", getPublicArticlesHandler);
articlesRouter.post("/:id/vote", voteArticleHandler);

// Admin dashboard routes (secured)
articlesRouter.get("/admin/list", authenticate, requirePermission("articles:manage"), listAllArticlesHandler);
articlesRouter.get("/admin", authenticate, requirePermission("articles:manage"), listAllArticlesHandler);
articlesRouter.post("/admin", authenticate, requirePermission("articles:manage"), createArticleHandler);
articlesRouter.put("/admin/:id", authenticate, requirePermission("articles:manage"), updateArticleHandler);
articlesRouter.patch("/admin/:id/verified", authenticate, requirePermission("articles:manage"), toggleVerifiedHandler);
articlesRouter.patch("/admin/:id", authenticate, requirePermission("articles:manage"), updateArticleHandler);
articlesRouter.delete("/admin/:id", authenticate, requirePermission("articles:manage"), deleteArticleHandler);

// Direct aliases for non-prefixed calls & help route contracts
articlesRouter.patch("/:id/verified", toggleVerifiedHandler);
articlesRouter.get("/:slug", getPublicArticleBySlugHandler);
articlesRouter.post("/", authenticate, requirePermission("articles:manage"), createArticleHandler);
articlesRouter.put("/:id", authenticate, requirePermission("articles:manage"), updateArticleHandler);
articlesRouter.patch("/:id", authenticate, requirePermission("articles:manage"), updateArticleHandler);
articlesRouter.delete("/:id", authenticate, requirePermission("articles:manage"), deleteArticleHandler);
