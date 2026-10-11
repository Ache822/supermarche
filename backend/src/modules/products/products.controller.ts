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

    const footCat = await Category.findOne({ slug: "footwear-shoes" });
    const cosmCat = await Category.findOne({ slug: "cosmetics-beauty" });
    const techCat = await Category.findOne({ slug: "electronics-tech" });
    const prodCat = await Category.findOne({ slug: "fresh-produce-snacks" });

    const prodCount = await Product.countDocuments();
    if (prodCount <= 2 && apparelCat) {
      await Product.deleteMany({});
      await Product.create([
        {
          id: "prod-kim-hoodie-01",
          title: "Oversized Vintage Graphic Streetwear Hoodie",
          category: apparelCat._id,
          description: "Heavyweight 450GSM cotton fleece hoodie featuring a custom retro puff-print back graphic. Relaxed dropped-shoulder fit tailored for premium comfort.",
          shortDescription: "Heavyweight 450GSM streetwear fleece hoodie.",
          price: 18500,
          compareAtPrice: 22000,
          priceRange: "18,500 FCFA",
          estimatedTime: "Same-Day Express Courier",
          imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"],
          stockQuantity: 45,
          inStock: true,
          isLive: true,
          featured: true,
          tags: ["streetwear", "hoodie", "apparel"],
          sku: "KIM-APP-001"
        },
        {
          id: "prod-kim-denim-02",
          title: "Classic Relaxed Fit Acid-Wash Denim Jacket",
          category: apparelCat._id,
          description: "Vintage-washed sturdy denim jacket with custom brass hardware and dual breast pockets. Premium unisex streetwear staple.",
          shortDescription: "Vintage-washed sturdy denim jacket.",
          price: 24000,
          compareAtPrice: 28000,
          priceRange: "24,000 FCFA",
          estimatedTime: "Same-Day Express Courier",
          imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"],
          stockQuantity: 28,
          inStock: true,
          isLive: true,
          featured: true,
          tags: ["denim", "jacket", "streetwear"],
          sku: "KIM-APP-002"
        },
        {
          id: "prod-kim-kicks-01",
          title: "Retro High-Top Campus Basketball Kicks",
          category: (footCat || apparelCat)._id,
          description: "Genuine leather high-top basketball sneakers with padded collars, reinforced toe caps, and durable vulcanized rubber soles.",
          shortDescription: "High-top authentic leather campus sneakers.",
          price: 32000,
          compareAtPrice: 38000,
          priceRange: "32,000 FCFA",
          estimatedTime: "Same-Day Express Courier",
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
          stockQuantity: 30,
          inStock: true,
          isLive: true,
          featured: true,
          tags: ["sneakers", "shoes", "kicks"],
          sku: "KIM-SHOE-001"
        },
        {
          id: "prod-kim-runners-02",
          title: "Chunky Sole Cloud Cushion Urban Runners",
          category: (footCat || apparelCat)._id,
          description: "Breathable air-mesh upper with high-traction sculpted foam midsole for featherweight all-day stride comfort.",
          shortDescription: "Breathable air-mesh cloud cushion runners.",
          price: 28500,
          compareAtPrice: 34000,
          priceRange: "28,500 FCFA",
          estimatedTime: "Same-Day Express Courier",
          imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"],
          stockQuantity: 25,
          inStock: true,
          isLive: true,
          featured: true,
          tags: ["runners", "shoes", "sneakers"],
          sku: "KIM-SHOE-002"
        },
        {
          id: "prod-kim-serum-01",
          title: "Pure Glow 15% Vitamin C Radiance Serum",
          category: (cosmCat || apparelCat)._id,
          description: "Antioxidant facial serum enriched with Hyaluronic Acid and Ferulic Acid to brighten dark spots and revitalize tired skin.",
          shortDescription: "15% Vitamin C brightening facial serum.",
          price: 12500,
          compareAtPrice: 15000,
          priceRange: "12,500 FCFA",
          estimatedTime: "Same-Day Express Courier",
          imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"],
          stockQuantity: 60,
          inStock: true,
          isLive: true,
          featured: true,
          tags: ["skincare", "beauty", "serum"],
          sku: "KIM-BEA-001"
        },
        {
          id: "prod-kim-earbuds-01",
          title: "ANC True Wireless Bluetooth Earbuds (Spatial Audio)",
          category: (techCat || apparelCat)._id,
          description: "Active noise cancelling wireless earbuds with transparency mode, deep bass drivers, IPX5 sweat resistance, and 36hr charging case.",
          shortDescription: "Active noise-cancelling wireless earbuds.",
          price: 19500,
          compareAtPrice: 24000,
          priceRange: "19,500 FCFA",
          estimatedTime: "Same-Day Express Courier",
          imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"],
          stockQuantity: 40,
          inStock: true,
          isLive: true,
          featured: true,
          tags: ["tech", "earbuds", "audio"],
          sku: "KIM-TEC-001"
        },
        {
          id: "prod-kim-powerbank-02",
          title: "20,000mAh 65W Fast-Charge Dual USB-C Power Bank",
          category: (techCat || apparelCat)._id,
          description: "Ultra-compact heavy-duty power bank with digital LED battery percentage display, capable of charging laptops, tablets, and phones simultaneously.",
          shortDescription: "20,000mAh 65W dual USB-C power bank.",
          price: 17500,
          compareAtPrice: 21000,
          priceRange: "17,500 FCFA",
          estimatedTime: "Same-Day Express Courier",
          imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80"],
          stockQuantity: 35,
          inStock: true,
          isLive: true,
          featured: true,
          tags: ["tech", "powerbank", "fastcharge"],
          sku: "KIM-TEC-002"
        },
        {
          id: "prod-kim-snackcrate-01",
          title: "Artisan Caramelized Cashews & Tropical Dried Mango Pack",
          category: (prodCat || apparelCat)._id,
          description: "Premium sun-dried Cameroon mango slices paired with slow-roasted caramelized cashew nuts. 100% natural with no artificial preservatives.",
          shortDescription: "Gourmet sun-dried mango & roasted cashews.",
          price: 4500,
          compareAtPrice: 5500,
          priceRange: "4,500 FCFA",
          estimatedTime: "45-Minute Supermarket Express",
          imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80"],
          stockQuantity: 80,
          inStock: true,
          isLive: true,
          featured: true,
          tags: ["snacks", "produce", "gourmet"],
          sku: "KIM-SNC-001"
        }
      ]);
      console.log("Successfully seeded 8 curated Kim's Store products across all departments");
    }
  } catch (err) {
    console.warn("Product seeder warning:", err);
  }
};
