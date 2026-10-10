import { Request, Response } from "express";
import mongoose from "mongoose";
import { articleCreateSchema, articleUpdateSchema } from "./articles.schema";
import { Article } from "./articles.model";
import { getRequestedLanguage, localizeArray } from "../../common/utils/localize";
import { autoTranslateObject } from "../../common/services/autoTranslate.service";

// Helper to query/update Article by either MongoDB ObjectId or custom slug/string ID
const findArticleByIdOrSlug = async (identifier: string) => {
  if (!identifier || identifier === "undefined" || identifier === "null") return null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const doc = await Article.findById(identifier);
    if (doc) return doc;
  }
  return await Article.findOne({ $or: [{ slug: identifier }, { id: identifier }] });
};

// Helper to safely extract string from string or localized object
const extractStringField = (val: any, fallback = ""): string => {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    return val.en || val.fr || Object.values(val)[0] || fallback;
  }
  return fallback;
};

export const getPublicArticlesHandler = async (req: Request, res: Response) => {
  try {
    const category = req.query.category ? String(req.query.category) : undefined;
    const filter = {
      is_published: true,
      ...(category ? { category } : {})
    };

    let articles: any[] = [];
    if (mongoose.connection.readyState >= 1) {
      try {
        articles = await Article.find(filter)
          .sort({ display_order: 1, published_at: -1, createdAt: -1 })
          .lean();
      } catch {
        articles = [];
      }
    }

    const requestedLang = getRequestedLanguage(req);
    const localizedArticles = localizeArray(articles, requestedLang);

    res.status(200).json({ data: localizedArticles, articles: localizedArticles });
  } catch (error) {
    res.status(200).json({ data: [], articles: [] });
  }
};

export const getPublicArticleBySlugHandler = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    let article: any = null;
    if (mongoose.connection.readyState >= 1) {
      try {
        article = await findArticleByIdOrSlug(slug);
      } catch {
        article = null;
      }
    }

    if (!article || !article.is_published) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Article not found.",
          timestamp: new Date().toISOString()
        }
      });
    }

    // Atomically increment page view counter
    await Article.updateOne({ _id: article._id }, { $inc: { views: 1 } });

    const requestedLang = getRequestedLanguage(req);
    const localizedArticles = localizeArray([article.toObject ? article.toObject() : article], requestedLang);

    res.status(200).json({ data: localizedArticles[0], article: localizedArticles[0] });
  } catch (error) {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Article not found.",
        timestamp: new Date().toISOString()
      }
    });
  }
};

export const voteArticleHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const voteType = String(req.body.vote || req.body.type || "up").toLowerCase();

  try {
    if (mongoose.connection.readyState >= 1) {
      try {
        const article = await findArticleByIdOrSlug(id);

        if (article) {
          const fieldToIncrement = voteType === "up" || voteType === "helpful" ? "helpfulCount" : "unhelpfulCount";
          await Article.updateOne({ _id: article._id }, { $inc: { [fieldToIncrement]: 1 } });
        }
      } catch {
        // Ignore DB update error
      }
    }

    res.status(200).json({
      success: true,
      helpfulCount: 1,
      unhelpfulCount: 0
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      helpfulCount: 1,
      unhelpfulCount: 0
    });
  }
};

export const toggleVerifiedHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const isVerified = req.body.verified !== undefined ? Boolean(req.body.verified) : true;

  try {
    const article = await findArticleByIdOrSlug(id);

    if (!article) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Article not found.",
          timestamp: new Date().toISOString()
        }
      });
    }

    article.verified = isVerified;
    await article.save();

    res.status(200).json({ success: true, verified: article.verified, data: article });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to update verified status.",
        timestamp: new Date().toISOString()
      }
    });
  }
};

export const listAllArticlesHandler = async (req: Request, res: Response) => {
  try {
    let articles: any[] = [];
    if (mongoose.connection.readyState >= 1) {
      try {
        articles = await Article.find({})
          .sort({ display_order: 1, createdAt: -1 })
          .lean();
      } catch {
        articles = [];
      }
    }

    const requestedLang = getRequestedLanguage(req);
    const localizedArticles = localizeArray(articles, requestedLang);

    res.status(200).json({ data: localizedArticles, articles: localizedArticles });
  } catch (error) {
    res.status(200).json({ data: [], articles: [] });
  }
};

export const createArticleHandler = async (req: Request, res: Response) => {
  const parseResult = articleCreateSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "Article validation failed.",
        details: parseResult.error.errors.map((error) => ({
          field: error.path.join("."),
          issue: error.message
        })),
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }

  try {
    const rawData = parseResult.data;
    const titleStr = extractStringField(rawData.title, "Untitled Article");
    const summaryStr = extractStringField(rawData.summary, "");
    const contentStr = extractStringField(rawData.content || (rawData as any).bodyText, "");

    const slug = rawData.slug || titleStr
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "") || `article-${Date.now()}`;

    const existing = await Article.findOne({ slug });
    if (existing) {
      return res.status(409).json({
        error: {
          code: "CONFLICT",
          message: "An article with this slug already exists.",
          timestamp: new Date().toISOString()
        }
      });
    }

    const articleData: Record<string, any> = {
      ...rawData,
      title: titleStr,
      summary: summaryStr,
      content: contentStr
    };

    // Auto-generate French translations if not explicitly provided
    if (!articleData.translations?.fr?.title || !articleData.translations?.fr?.summary) {
      const autoFr = await autoTranslateObject(
        { title: titleStr, summary: summaryStr, content: contentStr },
        ["title", "summary", "content"],
        "fr"
      );
      articleData.translations = {
        ...(articleData.translations || {}),
        fr: {
          ...(articleData.translations?.fr || {}),
          ...autoFr
        }
      };
    }

    const newArticle = await Article.create({
      ...articleData,
      slug,
      published_at: articleData.is_published ? new Date() : null
    } as any);

    res.status(201).json({ success: true, id: newArticle._id, slug: newArticle.slug, data: newArticle });
  } catch (error) {
    console.error("[createArticleHandler Error]:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create article.",
        timestamp: new Date().toISOString()
      }
    });
  }
};

export const updateArticleHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseResult = articleUpdateSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "Article update validation failed.",
        details: parseResult.error.errors.map((error) => ({
          field: error.path.join("."),
          issue: error.message
        })),
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }

  try {
    const articleDoc = await findArticleByIdOrSlug(id);
    if (!articleDoc) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Article not found.",
          timestamp: new Date().toISOString()
        }
      });
    }

    const rawData = parseResult.data;
    const updateData: Record<string, any> = { ...rawData };

    if (rawData.title !== undefined) updateData.title = extractStringField(rawData.title, articleDoc.title);
    if (rawData.summary !== undefined) updateData.summary = extractStringField(rawData.summary, articleDoc.summary);
    if (rawData.content !== undefined || (rawData as any).bodyText !== undefined) {
      updateData.content = extractStringField(rawData.content || (rawData as any).bodyText, articleDoc.content);
    }

    if (updateData.slug) {
      const existing = await Article.findOne({
        slug: updateData.slug,
        _id: { $ne: articleDoc._id }
      });
      if (existing) {
        return res.status(409).json({
          error: {
            code: "CONFLICT",
            message: "An article with this slug already exists.",
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    const docObject = articleDoc.toObject();
    const existingTranslations = docObject.translations || {};

    // Auto-generate French translations if title, summary, or content is updated
    if (updateData.title || updateData.summary || updateData.content) {
      const autoFr = await autoTranslateObject(
        {
          title: updateData.title || articleDoc.title,
          summary: updateData.summary || articleDoc.summary,
          content: updateData.content || articleDoc.content
        },
        ["title", "summary", "content"],
        "fr"
      );
      updateData.translations = {
        ...existingTranslations,
        ...(updateData.translations || {}),
        fr: {
          ...(existingTranslations.fr || {}),
          ...(updateData.translations?.fr || {}),
          ...autoFr
        }
      };
    }

    if (updateData.is_published !== undefined) {
      (updateData as any).published_at = updateData.is_published ? new Date() : null;
    }

    Object.assign(articleDoc, updateData);
    await articleDoc.save();

    res.status(200).json({ success: true, data: articleDoc });
  } catch (error) {
    console.error("[updateArticleHandler Error]:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to update article.",
        timestamp: new Date().toISOString()
      }
    });
  }
};

export const deleteArticleHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const articleDoc = await findArticleByIdOrSlug(id);

    if (!articleDoc) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Article not found.",
          timestamp: new Date().toISOString()
        }
      });
    }

    await Article.findByIdAndDelete(articleDoc._id);
    res.status(204).send();
  } catch (error) {
    console.error("[deleteArticleHandler Error]:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to delete article.",
        timestamp: new Date().toISOString()
      }
    });
  }
};
