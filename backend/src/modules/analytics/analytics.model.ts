import { Schema, model, Document } from "mongoose";

export interface IVisitorLog extends Document {
  sessionId: string;
  path: string;
  deviceType: "mobile" | "desktop" | "tablet";
  referrer: string;
  timestamp: Date;
}

export interface IDailyAnalytics extends Document {
  date: string; // 'YYYY-MM-DD'
  totalViews: number;
  uniqueVisitors: number;
  topPages: Array<{
    path: string;
    pageName?: string;
    views: number;
  }>;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 1. Raw Page View Hit Log Schema
const visitorLogSchema = new Schema<IVisitorLog>(
  {
    sessionId: { type: String, required: true, index: true },
    path: { type: String, required: true, index: true },
    deviceType: {
      type: String,
      enum: ["mobile", "desktop", "tablet"],
      default: "desktop"
    },
    referrer: { type: String, default: "direct" },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

export const VisitorLog = model<IVisitorLog>("VisitorLog", visitorLogSchema);

// 2. Pre-calculated Daily Analytics Summary Schema
const dailyAnalyticsSchema = new Schema<IDailyAnalytics>(
  {
    date: { type: String, required: true, unique: true, index: true },
    totalViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    topPages: [
      {
        path: { type: String, required: true },
        pageName: { type: String },
        views: { type: Number, default: 0 }
      }
    ],
    deviceStats: {
      mobile: { type: Number, default: 0 },
      desktop: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export const DailyAnalytics = model<IDailyAnalytics>("DailyAnalytics", dailyAnalyticsSchema);
