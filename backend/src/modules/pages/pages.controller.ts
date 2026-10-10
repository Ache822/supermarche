import { Request, Response } from "express";
import { pageSectionSchema } from "./pages.schema";
import { Page, PageSection } from "./pages.model";

export const getPublicPageHandler = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const page = await Page.findOne({ slug, is_published: true }).lean();

    if (!page) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Page not found or not published.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const sections = await PageSection.find({ page_id: page._id.toString() })
      .sort({ display_order: 1 })
      .lean();

    const payload = {
      slug: page.slug,
      meta_title: page.meta_title,
      sections
    };

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch page.",
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }
};

export const createPageSectionHandler = async (req: Request, res: Response) => {
  try {
    const parseResult = pageSectionSchema.safeParse({ ...req.body, page_id: req.params.page_id });

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Page section validation failed.",
          details: parseResult.error.errors.map((error) => ({
            field: error.path.join("."),
            issue: error.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const newSection = await PageSection.create(parseResult.data as any);

    res.status(201).json({ id: newSection._id });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create page section.",
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }
};

export const updatePageSectionHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parseResult = pageSectionSchema.partial().safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Page section update validation failed.",
          details: parseResult.error.errors.map((error) => ({
            field: error.path.join("."),
            issue: error.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const updatedSection = await PageSection.findByIdAndUpdate(id, parseResult.data, { new: true });

    if (!updatedSection) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Page section not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to update page section.",
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }
};
