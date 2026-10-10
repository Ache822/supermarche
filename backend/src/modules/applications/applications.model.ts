import { Schema, model, Document } from "mongoose";

export interface IApplication extends Document {
  fullName: string;
  contactType: "whatsapp" | "email";
  contactValue: string;
  location: string;
  serviceType: string;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  submittedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    fullName: { type: String, required: true, trim: true },
    contactType: { type: String, enum: ["whatsapp", "email"], required: true },
    contactValue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"],
      default: "PENDING"
    },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Application = model<IApplication>("Application", applicationSchema);
