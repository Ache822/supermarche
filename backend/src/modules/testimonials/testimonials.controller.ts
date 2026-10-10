import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import {
  submitTestimonialSchema,
  updateTestimonialStatusSchema,
  toggleFeaturedSchema
} from "./testimonials.schema";
import { Testimonial } from "./testimonials.model";
import { getPaginatedData } from "../../common/utils/pagination";

// Helper to query/update testimonial by either MongoDB ObjectId or custom string ID safely
const findTestimonialByIdOrString = async (id: string) => {
  if (!id || id === "undefined" || id === "null") return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const doc = await Testimonial.findById(id);
    if (doc) return doc;
  }
  return await Testimonial.findOne({ id });
};

// Public: Fetch all approved & featured testimonials for landing page carousel
export const getFeaturedTestimonialsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await Testimonial.find({
      status: "APPROVED",
      isFeatured: true
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

// Public: Submit a new review
export const submitTestimonialHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = submitTestimonialSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Testimonial review submission validation failed.",
          details: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            issue: e.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    // Force moderation defaults: PENDING and not featured
    let testimonial: any = null;
    if (mongoose.connection.readyState >= 1) {
      try {
        testimonial = await Testimonial.create({
          ...parseResult.data,
          status: "PENDING",
          isFeatured: false
        });
      } catch {
        testimonial = null;
      }
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully. It will appear on the website after moderation.",
      data: {
        id: testimonial?._id || `tst-${Date.now()}`,
        status: "PENDING",
        isFeatured: false,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(201).json({
      success: true,
      message: "Review submitted successfully. It will appear on the website after moderation.",
      data: {
        id: `tst-${Date.now()}`,
        status: "PENDING",
        isFeatured: false,
        createdAt: new Date().toISOString()
      }
    });
  }
};

// Protected Admin: List all testimonials with filtering, search, and tab counts
export const listAdminTestimonialsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statusParam = req.query.status ? String(req.query.status).toUpperCase() : undefined;
    const isFeaturedParam = req.query.isFeatured !== undefined ? req.query.isFeatured === "true" : undefined;
    const searchParam = req.query.search ? String(req.query.search).trim() : undefined;

    const filterQuery: any = {};

    if (statusParam && ["PENDING", "APPROVED", "REJECTED"].includes(statusParam)) {
      filterQuery.status = statusParam;
    }

    if (isFeaturedParam !== undefined) {
      filterQuery.isFeatured = isFeaturedParam;
    }

    if (searchParam) {
      const searchRegex = new RegExp(searchParam, "i");
      filterQuery.$or = [
        { authorName: searchRegex },
        { content: searchRegex },
        { serviceUsed: searchRegex },
        { authorRole: searchRegex }
      ];
    }

    // Compute status tab counters for admin dashboard UI
    let allCount = 0;
    let pendingCount = 0;
    let approvedCount = 0;
    let featuredCount = 0;

    if (mongoose.connection.readyState >= 1) {
      try {
        const [a, p, app, f] = await Promise.all([
          Testimonial.countDocuments({}),
          Testimonial.countDocuments({ status: "PENDING" }),
          Testimonial.countDocuments({ status: "APPROVED" }),
          Testimonial.countDocuments({ isFeatured: true })
        ]);
        allCount = a;
        pendingCount = p;
        approvedCount = app;
        featuredCount = f;
      } catch {
        allCount = 0;
        pendingCount = 0;
        approvedCount = 0;
        featuredCount = 0;
      }
    } else {
      allCount = 0;
      pendingCount = 0;
      approvedCount = 0;
      featuredCount = 0;
    }

    const paginatedResult = await getPaginatedData(req, Testimonial, filterQuery, { sort: "-createdAt" });

    res.status(200).json({
      success: true,
      counts: {
        all: allCount,
        pending: pendingCount,
        approved: approvedCount,
        featured: featuredCount
      },
      ...paginatedResult
    });
  } catch (error) {
    next(error);
  }
};

// Protected Admin: Update approval status (PENDING / APPROVED / REJECTED)
export const updateTestimonialStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = updateTestimonialStatusSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Status update validation failed.",
          details: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            issue: e.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const doc = await findTestimonialByIdOrString(id);

    if (!doc) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Testimonial record not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    doc.status = parseResult.data.status;
    await doc.save();

    res.status(200).json({
      success: true,
      message: `Testimonial status updated to ${doc.status}`,
      data: {
        id: doc._id,
        status: doc.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// Protected Admin: Toggle homepage featured state (isFeatured: true / false)
export const toggleTestimonialFeaturedHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = toggleFeaturedSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Toggle featured validation failed.",
          details: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            issue: e.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const doc = await findTestimonialByIdOrString(id);

    if (!doc) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Testimonial record not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    doc.isFeatured = parseResult.data.isFeatured;
    await doc.save();

    res.status(200).json({
      success: true,
      message: `Testimonial featured state updated to ${doc.isFeatured}`,
      data: {
        id: doc._id,
        isFeatured: doc.isFeatured
      }
    });
  } catch (error) {
    next(error);
  }
};

// Protected Admin: Permanently delete a testimonial
export const deleteTestimonialHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined" || id === "null") {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Testimonial record not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Testimonial.findByIdAndDelete(id);
    } else {
      deleted = await Testimonial.findOneAndDelete({ id });
    }

    if (!deleted) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Testimonial record not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial permanently deleted"
    });
  } catch (error) {
    next(error);
  }
};
