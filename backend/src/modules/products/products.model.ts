import { Schema, model, Document, Types } from "mongoose";
import { translationSchema } from "../../common/schema/translation.schema";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  display_order?: number;
  is_active: boolean;
  parent?: Types.ObjectId | null;
  defaultLanguage?: string;
  translationFields?: string[];
  translations?: Record<string, any>;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    iconName: { type: String, default: "Grid" },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    translationFields: { type: [String], default: ["name", "description"] },
    ...translationSchema
  },
  { timestamps: true }
);

categorySchema.index({ is_active: 1, display_order: 1 });
categorySchema.index({ parent: 1 });

export const Category = model<ICategory>("Category", categorySchema);

export interface IProduct extends Document {
  id: string;
  title: string;
  category: Types.ObjectId | string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  priceRange?: string;
  estimatedTime?: string;
  images: string[];
  imageUrl?: string;
  iconName?: string;
  stockQuantity: number;
  inStock: boolean;
  isLive: boolean;
  isActive?: boolean;
  featured?: boolean;
  tags?: string[];
  sku?: string;
  rating?: number;
  reviewCount?: number;
  defaultLanguage?: string;
  translationFields?: string[];
  translations?: Record<string, any>;
}

const productSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    compareAtPrice: { type: Number },
    priceRange: { type: String, default: "$$" },
    estimatedTime: { type: String, default: "Fast Delivery" },
    images: [{ type: String }],
    imageUrl: { type: String, default: "" },
    iconName: { type: String, default: "ShoppingBag" },
    stockQuantity: { type: Number, default: 50 },
    inStock: { type: Boolean, default: true },
    isLive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    sku: { type: String },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 12 },
    translationFields: { type: [String], default: ["title", "description", "shortDescription"] },
    ...translationSchema
  },
  { timestamps: true }
);

productSchema.index({ isLive: 1, featured: 1 });
productSchema.index({ category: 1 });

export const Product = model<IProduct>("Product", productSchema);
export const ProductModel = Product;
// Export Service alias for backwards compatibility
export const Service = Product;
