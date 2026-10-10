import { Schema, model, Document } from "mongoose";

export interface IPage extends Document {
  slug: string;
  meta_title: string;
  is_published: boolean;
}

export interface IPageSection extends Document {
  page_id: string;
  category: string;
  type: string;
  display_order: number;
  content: Schema.Types.Mixed;
  is_active: boolean;
}

const pageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true },
    meta_title: { type: String, required: true },
    is_published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const pageSectionSchema = new Schema<IPageSection>(
  {
    page_id: { type: String, required: true, index: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    display_order: { type: Number, default: 0 },
    content: { type: Schema.Types.Mixed, required: true },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Page = model<IPage>("Page", pageSchema);
export const PageSection = model<IPageSection>("PageSection", pageSectionSchema);
