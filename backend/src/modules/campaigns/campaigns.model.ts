import { Schema, model, Document } from "mongoose";

export interface ICampaignSubscriber extends Document {
  email: string;
  source: string;
  is_active: boolean;
  subscribed_at: Date;
}

export interface ICampaignBroadcast extends Document {
  subject: string;
  body: string;
  recipientName?: string;
  highlightBoxText?: string;
  ctaText?: string;
  ctaUrl?: string;
  segment?: string;
  recipients_count: number;
  recipients: string[];
  sent_by: string;
  sent_at: Date;
}

const subscriberSchema = new Schema<ICampaignSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    source: { type: String, default: "website_organic" },
    is_active: { type: Boolean, default: true },
    subscribed_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const broadcastSchema = new Schema<ICampaignBroadcast>(
  {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    recipientName: { type: String },
    highlightBoxText: { type: String },
    ctaText: { type: String, default: "Claim Discount Now" },
    ctaUrl: { type: String, default: "https://supermarche.cm/services" },
    segment: { type: String, default: "all" },
    recipients_count: { type: Number, default: 0 },
    recipients: [{ type: String }],
    sent_by: { type: String, required: true },
    sent_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const CampaignSubscriber = model<ICampaignSubscriber>("CampaignSubscriber", subscriberSchema);
export const CampaignBroadcast = model<ICampaignBroadcast>("CampaignBroadcast", broadcastSchema);
