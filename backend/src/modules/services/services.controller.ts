import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import {
  createCategorySchema,
  updateCategorySchema,
  createServiceSchema,
  updateServiceSchema,
  batchVisibilitySchema
} from "./services.schema";
import { Category, Service } from "./services.model";
import { getPaginatedData } from "../../common/utils/pagination";
import { getRequestedLanguage, localizeArray } from "../../common/utils/localize";
import { autoTranslateObject } from "../../common/services/autoTranslate.service";

// Helper to query Category by either MongoDB ObjectId or string slug/id
const findCategoryByIdOrString = async (id: string) => {
  if (!id || id === "undefined" || id === "null") return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const cat = await Category.findById(id);
    if (cat) return cat;
  }
  return await Category.findOne({
    $or: [{ slug: id }, { id }]
  });
};

// Helper to query Service by either MongoDB ObjectId or string id
const findServiceByIdOrString = async (id: string) => {
  if (!id || id === "undefined" || id === "null") return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const srv = await Service.findById(id);
    if (srv) return srv;
  }
  return await Service.findOne({
    $or: [{ id }, { _id: id }]
  });
};

export const getCategoriesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parentParam = req.query.parent;
    let filter: any = { is_active: true };

    if (parentParam === "null" || parentParam === "none") {
      filter.parent = null;
    } else if (parentParam && typeof parentParam === "string" && parentParam !== "all") {
      filter.parent = parentParam;
    }

    const result = await getPaginatedData(req, Category, filter, { populate: "parent", sort: "display_order" });
    const requestedLang = getRequestedLanguage(req);
    const localizedData = localizeArray(result.data, requestedLang);

    res.status(200).json({
      data: localizedData,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const createCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = createCategorySchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Category creation validation failed.",
          details: parseResult.error.errors.map((error: any) => ({
            field: error.path.join("."),
            issue: error.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const categoryData: Record<string, any> = { ...parseResult.data };

    // Auto-generate French translations if not provided
    if (!categoryData.translations?.fr?.name) {
      const autoFr = await autoTranslateObject(categoryData, ["name", "description"], "fr");
      categoryData.translations = {
        ...(categoryData.translations || {}),
        fr: {
          ...(categoryData.translations?.fr || {}),
          ...autoFr
        }
      };
    }

    const category = await Category.create(categoryData as any);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = updateCategorySchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Category update validation failed.",
          details: parseResult.error.errors.map((error: any) => ({
            field: error.path.join("."),
            issue: error.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const doc = await findCategoryByIdOrString(id);

    if (!doc) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Category not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const updateData: Record<string, any> = { ...parseResult.data };

    // Auto-generate French translations if name or description is updated
    if (updateData.name || updateData.description) {
      const autoFr = await autoTranslateObject(
        {
          name: updateData.name || doc.name,
          description: updateData.description || doc.description
        },
        ["name", "description"],
        "fr"
      );
      updateData.translations = {
        ...(doc.translations || {}),
        ...(updateData.translations || {}),
        fr: {
          ...(doc.translations?.fr || {}),
          ...(updateData.translations?.fr || {}),
          ...autoFr
        }
      };
    }

    Object.assign(doc, updateData);
    await doc.save();

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined" || id === "null") {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Category not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Category.findByIdAndDelete(id);
    } else {
      deleted = await Category.findOneAndDelete({ $or: [{ slug: id }, { id }] });
    }

    if (!deleted) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Category not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    res.status(200).json({ success: true, message: "Category permanently deleted" });
  } catch (error) {
    next(error);
  }
};

export const getServicesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeAll = req.query.includeAll === "true";
    const isFeatured = req.query.featured !== undefined ? req.query.featured === "true" : undefined;
    const categoryId = req.query.category ? String(req.query.category) : undefined;
    
    const filter: any = {
      ...(includeAll ? {} : { isLive: true }),
      ...(isFeatured !== undefined ? { featured: isFeatured } : {}),
      ...(categoryId ? { category: categoryId } : {})
    };
    
    const result = await getPaginatedData(req, Service, filter, { populate: "category" });
    const requestedLang = getRequestedLanguage(req);
    const localizedData = localizeArray(result.data, requestedLang);

    // Enrich each service item with categoryLabel so the frontend landing page displays category badges seamlessly
    const enrichedData = localizedData.map((item: any) => {
      const catObj = typeof item.category === "object" && item.category !== null ? item.category : null;
      return {
        ...item,
        categoryLabel: catObj?.name || (typeof item.category === "string" ? item.category : "General")
      };
    });

    res.status(200).json({
      data: enrichedData,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const service = await findServiceByIdOrString(id);

    if (!service) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Service item not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const createServiceHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = createServiceSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Service item creation validation failed.",
          details: parseResult.error.errors.map((error: any) => ({
            field: error.path.join("."),
            issue: error.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const serviceData: Record<string, any> = { ...parseResult.data };

    // Auto-generate French translations if not provided
    if (!serviceData.translations?.fr?.title) {
      const autoFr = await autoTranslateObject(serviceData, ["title", "description", "estimatedTime"], "fr");
      serviceData.translations = {
        ...(serviceData.translations || {}),
        fr: {
          ...(serviceData.translations?.fr || {}),
          ...autoFr
        }
      };
    }

    const service = await Service.create(serviceData as any);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const updateServiceHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = updateServiceSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Service item update validation failed.",
          details: parseResult.error.errors.map((error: any) => ({
            field: error.path.join("."),
            issue: error.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const doc = await findServiceByIdOrString(id);

    if (!doc) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Service item not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const updateData: Record<string, any> = { ...parseResult.data };

    // Auto-generate French translations if title, description, or estimatedTime is updated
    if (updateData.title || updateData.description || updateData.estimatedTime) {
      const autoFr = await autoTranslateObject(
        {
          title: updateData.title || doc.title,
          description: updateData.description || doc.description,
          estimatedTime: updateData.estimatedTime || doc.estimatedTime
        },
        ["title", "description", "estimatedTime"],
        "fr"
      );
      updateData.translations = {
        ...(doc.translations || {}),
        ...(updateData.translations || {}),
        fr: {
          ...(doc.translations?.fr || {}),
          ...(updateData.translations?.fr || {}),
          ...autoFr
        }
      };
    }

    Object.assign(doc, updateData);
    await doc.save();

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const deleteServiceHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined" || id === "null") {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Service item not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Service.findByIdAndDelete(id);
    } else {
      deleted = await Service.findOneAndDelete({ $or: [{ id }, { _id: id }] });
    }

    if (!deleted) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Service item not found.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    res.status(200).json({ success: true, message: "Service item permanently deleted" });
  } catch (error) {
    next(error);
  }
};

export const batchUpdateServiceVisibilityHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = batchVisibilitySchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Batch visibility update validation failed.",
          details: parseResult.error.errors.map((error: any) => ({
            field: error.path.join("."),
            issue: error.message
          })),
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const { serviceIds, isLive } = parseResult.data;

    await Service.updateMany(
      {
        $or: [
          { _id: { $in: serviceIds.filter((id: string) => mongoose.Types.ObjectId.isValid(id)) } },
          { id: { $in: serviceIds } }
        ]
      },
      { $set: { isLive } }
    );

    res.status(200).json({
      success: true,
      message: `Batch visibility updated to isLive = ${isLive} for ${serviceIds.length} services`
    });
  } catch (error) {
    next(error);
  }
};

export const batchToggleVisibilityHandler = batchUpdateServiceVisibilityHandler;

export const uploadServiceImageHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { filename, fileData } = req.body;

  if (!fileData) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "Missing fileData payload in base64 format.",
        timestamp: new Date().toISOString(),
        request_id: req.headers["x-request-id"] || null
      }
    });
  }

  try {
    const uploadsDir = path.join(__dirname, "../../../public/uploads/services");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 1. Sanitize filename to prevent path traversal
    const safeFilename = filename ? path.basename(filename) : "";
    let ext = safeFilename ? path.extname(safeFilename).toLowerCase() : "";

    // If extension wasn't in filename, detect from data URI
    if (!ext && typeof fileData === "string" && fileData.startsWith("data:image/")) {
      const mimeMatch = fileData.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/);
      if (mimeMatch && mimeMatch[1]) {
        const mimeSub = mimeMatch[1].toLowerCase();
        ext = mimeSub === "svg+xml" ? ".svg" : `.${mimeSub}`;
      }
    }
    if (!ext) ext = ".png";

    // 2. Enforce extension whitelist
    const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return res.status(400).json({
        error: {
          code: "INVALID_FILE_EXTENSION",
          message: `File extension '${ext}' is not supported. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}`,
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const uniqueFilename = `service_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    // 3. Verify path containment
    const resolvedUploadsDir = path.resolve(uploadsDir);
    const resolvedFilePath = path.resolve(filePath);
    if (!resolvedFilePath.startsWith(resolvedUploadsDir)) {
      return res.status(400).json({
        error: {
          code: "INVALID_FILE_PATH",
          message: "Invalid file path traversal detected.",
          timestamp: new Date().toISOString(),
          request_id: req.headers["x-request-id"] || null
        }
      });
    }

    const base64Data = fileData.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/services/${uniqueFilename}`;
    res.status(200).json({
      success: true,
      imageUrl: relativeUrl,
      url: relativeUrl
    });
  } catch (error) {
    next(error);
  }
};
