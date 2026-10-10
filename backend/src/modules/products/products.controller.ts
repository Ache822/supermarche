import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import {
  createCategorySchema,
  updateCategorySchema,
  createProductSchema,
  updateProductSchema,
  batchVisibilitySchema
} from "./products.schema";
import { Category, Product } from "./products.model";
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

// Helper to query Product by either MongoDB ObjectId or string id
const findProductByIdOrString = async (id: string) => {
  if (!id || id === "undefined" || id === "null") return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const prod = await Product.findById(id);
    if (prod) return prod;
  }
  return await Product.findOne({
    $or: [{ id }, { _id: id }, { slug: id }]
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
          }))
        }
      });
    }

    const categoryData: Record<string, any> = { ...parseResult.data };

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
          message: "Category update validation failed."
        }
      });
    }

    const doc = await findCategoryByIdOrString(id);

    if (!doc) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Category not found." } });
    }

    const updateData: Record<string, any> = { ...parseResult.data };
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
    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Category.findByIdAndDelete(id);
    } else {
      deleted = await Category.findOneAndDelete({ $or: [{ slug: id }, { id }] });
    }

    if (!deleted) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Category not found." } });
    }

    res.status(200).json({ success: true, message: "Category permanently deleted" });
  } catch (error) {
    next(error);
  }
};

export const getProductsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeAll = req.query.includeAll === "true";
    const isFeatured = req.query.featured !== undefined ? req.query.featured === "true" : undefined;
    const categoryId = req.query.category ? String(req.query.category) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    const filter: any = {
      ...(includeAll ? {} : { isLive: true }),
      ...(isFeatured !== undefined ? { featured: isFeatured } : {}),
      ...(categoryId ? { category: categoryId } : {})
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const result = await getPaginatedData(req, Product, filter, { populate: "category" });
    const requestedLang = getRequestedLanguage(req);
    const localizedData = localizeArray(result.data, requestedLang);

    const enrichedData = localizedData.map((item: any) => {
      const catObj = typeof item.category === "object" && item.category !== null ? item.category : null;
      const mainImage = item.imageUrl || item.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
      return {
        ...item,
        images: item.images?.length ? item.images : [mainImage],
        imageUrl: mainImage,
        categoryLabel: catObj?.name || (typeof item.category === "string" ? item.category : "Groceries")
      };
    });

    const categories = await Category.find({ is_active: true }).select("name slug iconName");

    res.status(200).json({
      success: true,
      data: enrichedData,
      categories,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await findProductByIdOrString(id);

    if (!product) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Product item not found." } });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProductHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = createProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_FAILED",
          message: "Product creation validation failed.",
          details: parseResult.error.errors.map((error: any) => ({
            field: error.path.join("."),
            issue: error.message
          }))
        }
      });
    }

    const product = await Product.create(parseResult.data as any);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parseResult = updateProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Product update validation failed." } });
    }

    const doc = await findProductByIdOrString(id);

    if (!doc) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found." } });
    }

    Object.assign(doc, parseResult.data);
    await doc.save();

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Product.findByIdAndDelete(id);
    } else {
      deleted = await Product.findOneAndDelete({ $or: [{ id }, { _id: id }] });
    }

    if (!deleted) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found." } });
    }

    res.status(200).json({ success: true, message: "Product permanently deleted" });
  } catch (error) {
    next(error);
  }
};

export const batchToggleVisibilityHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = batchVisibilitySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Batch update failed." } });
    }

    const { productIds, serviceIds, isLive } = parseResult.data;
    const ids = productIds || serviceIds || [];

    await Product.updateMany(
      {
        $or: [
          { _id: { $in: ids.filter((id: string) => mongoose.Types.ObjectId.isValid(id)) } },
          { id: { $in: ids } }
        ]
      },
      { $set: { isLive } }
    );

    res.status(200).json({ success: true, message: `Updated visibility for ${ids.length} products` });
  } catch (error) {
    next(error);
  }
};

export const uploadProductImageHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { filename, fileData } = req.body;

  if (!fileData) {
    return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Missing fileData payload." } });
  }

  try {
    const uploadsDir = path.join(__dirname, "../../../public/uploads/products");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeFilename = filename ? path.basename(filename) : "";
    let ext = safeFilename ? path.extname(safeFilename).toLowerCase() : ".png";

    const uniqueFilename = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    const base64Data = fileData.replace(/^data:[^;]+;base64,/, "");
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

    const relativeUrl = `/uploads/products/${uniqueFilename}`;
    res.status(200).json({ success: true, imageUrl: relativeUrl, url: relativeUrl });
  } catch (error) {
    next(error);
  }
};

// Seed store default products and categories if DB is empty
export const seedProductsIfEmpty = async () => {
  try {
    const catCount = await Category.countDocuments();
    let apparelCat;
    if (catCount === 0) {
      apparelCat = await Category.create({
        name: "Apparel & Fashion",
        slug: "apparel-fashion",
        description: "Trendsetting apparel, hoodies, and fashion items.",
        is_active: true
      });
      await Category.create([
        { name: "Footwear & Shoes", slug: "footwear-shoes", description: "Sneakers, running shoes, and footwear.", is_active: true },
        { name: "Cosmetics & Beauty", slug: "cosmetics-beauty", description: "Skincare, serums, and beauty essentials.", is_active: true },
        { name: "Electronics & Tech", slug: "electronics-tech", description: "Earbuds, power banks, and tech accessories.", is_active: true },
        { name: "Fresh Produce & Snacks", slug: "fresh-produce-snacks", description: "Fresh fruits, organic snacks, and beverages.", is_active: true }
      ]);
    } else {
      apparelCat = await Category.findOne({ slug: "apparel-fashion" });
    }

    const prodCount = await Product.countDocuments();
    if (prodCount === 0 && apparelCat) {
      await Product.create([
        {
          id: "prod-hoodie-01",
          title: "Oversized Vintage Graphic Hoodie",
          category: apparelCat._id,
          description: "Heavyweight premium cotton oversized hoodie with vintage graphic print.",
          shortDescription: "Heavyweight cotton oversized hoodie.",
          price: 18500,
          priceRange: "18,500 FCFA",
          estimatedTime: "Same day express delivery",
          imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
          images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"],
          stockQuantity: 45,
          inStock: true,
          isLive: true,
          featured: true
        },
        {
          id: "prod-sneakers-01",
          title: "Retro High-Top Campus Kicks",
          category: apparelCat._id,
          description: "Classic high-top retro basketball sneakers with cushioned insoles.",
          shortDescription: "Classic high-top retro sneakers.",
          price: 28000,
          priceRange: "28,000 FCFA",
          estimatedTime: "Same day express delivery",
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"],
          stockQuantity: 30,
          inStock: true,
          isLive: true,
          featured: true
        }
      ]);
      console.log("Successfully seeded default store categories & products");
    }
  } catch (err) {
    console.warn("Product seeder warning:", err);
  }
};
