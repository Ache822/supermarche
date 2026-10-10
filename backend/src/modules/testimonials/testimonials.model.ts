import { Schema, model, Document } from "mongoose";

export interface ITestimonial extends Document {
  authorName: string;
  authorRole?: string;
  avatarUrl?: string | null;
  rating: number;
  content: string;
  serviceUsed?: string | null;
  consentToPublish: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    authorName: { type: String, required: true, trim: true },
    authorRole: { type: String, default: "Verified Client", trim: true },
    avatarUrl: { type: String, default: null },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    content: { type: String, required: true, trim: true },
    serviceUsed: { type: String, default: null, trim: true },
    consentToPublish: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true
    },
    isFeatured: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

testimonialSchema.index({ status: 1, isFeatured: 1 });
testimonialSchema.index({ createdAt: -1 });

export const Testimonial = model<ITestimonial>("Testimonial", testimonialSchema);
