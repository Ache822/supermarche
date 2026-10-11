import { Schema, model, Document } from "mongoose";
import { translationSchema } from "../../common/schema/translation.schema";

export interface IArticle extends Document {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  author?: string;
  category: string;
  categoryId?: string;
  categoryName?: string;
  verified: boolean;
  views: number;
  helpfulCount: number;
  unhelpfulCount: number;
  display_order: number;
  is_published: boolean;
  published_at?: Date | null;
  defaultLanguage?: string;
  translationFields?: string[];
  translations?: Record<string, any>;
}

const articleSchema = new Schema<IArticle>(
  {
    id: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Kim's Store Team" },
    category: { type: String, required: true, default: "General", index: true },
    categoryId: { type: String },
    categoryName: { type: String },
    verified: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    helpfulCount: { type: Number, default: 0 },
    unhelpfulCount: { type: Number, default: 0 },
    display_order: { type: Number, default: 0 },
    is_published: { type: Boolean, default: true, index: true },
    published_at: { type: Date, default: Date.now },
    translationFields: { type: [String], default: ["title", "summary", "content"] },
    ...translationSchema
  },
  { timestamps: true }
);

// Automatic Fail-Safe Slug Generator Pre-Validate Hook
articleSchema.pre<IArticle>("validate", function (this: any) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

articleSchema.index({ category: 1, is_published: 1, display_order: 1 });

export const Article = model<IArticle>("Article", articleSchema);
