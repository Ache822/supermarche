import { Schema, model, Document } from "mongoose";
import { translationSchema } from "../../common/schema/translation.schema";

export interface IFaq extends Document {
  id: string;
  page: string;
  category: string;
  subCategory?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  question: string;
  answer: string;
  articleSlug?: string | null;
  anchorId?: string | null;
  display_order: number;
  is_published: boolean;
  is_featured: boolean;
  defaultLanguage?: string;
  translationFields?: string[];
  translations?: Record<string, any>;
}

const faqSchema = new Schema<IFaq>(
  {
    id: { type: String },
    page: { type: String, required: true, default: "help", index: true },
    category: { type: String, required: true, index: true },
    subCategory: { type: String, default: "General" },
    sectionTitle: { type: String, default: "" },
    sectionDescription: { type: String, default: "" },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    articleSlug: { type: String, default: null },
    anchorId: { type: String, default: null },
    display_order: { type: Number, default: 0 },
    is_published: { type: Boolean, default: true, index: true },
    is_featured: { type: Boolean, default: false },
    translationFields: { type: [String], default: ["question", "answer", "sectionTitle", "sectionDescription"] },
    ...translationSchema
  },
  { timestamps: true }
);

faqSchema.index({ page: 1, is_published: 1, display_order: 1 });
faqSchema.index({ category: 1, is_published: 1 });

export const Faq = model<IFaq>("Faq", faqSchema);
