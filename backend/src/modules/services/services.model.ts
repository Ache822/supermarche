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

export interface IService extends Document {
  id: string;
  title: string;
  category: Types.ObjectId;
  description: string;
  priceRange: string;
  estimatedTime: string;
  iconName: string;
  isLive: boolean;
  featured?: boolean;
  imageUrl?: string;
  defaultLanguage?: string;
  translationFields?: string[];
  translations?: Record<string, any>;
}

const serviceSchema = new Schema<IService>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    description: { type: String, required: true },
    priceRange: { type: String, required: true },
    estimatedTime: { type: String, required: true },
    iconName: { type: String, required: true },
    isLive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    imageUrl: { type: String },
    translationFields: { type: [String], default: ["title", "description", "estimatedTime"] },
    ...translationSchema
  },
  { timestamps: true }
);

serviceSchema.index({ isLive: 1, featured: 1 });
serviceSchema.index({ category: 1 });

export const Service = model<IService>("Service", serviceSchema);
