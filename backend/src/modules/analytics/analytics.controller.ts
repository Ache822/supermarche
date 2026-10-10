import { NextFunction, Request, Response } from "express";
import { trackVisitorHitSchema } from "./analytics.schema";
import { VisitorLog, DailyAnalytics } from "./analytics.model";
import { CampaignSubscriber } from "../campaigns/campaigns.model";

// Page Name Mapping Helper
const getPageName = (path: string): string => {
  const cleanPath = path.split("?")[0].toLowerCase();
  switch (cleanPath) {
    case "/":
    case "":
      return "Landing Page & Express Hero";
    case "/services":
      return "Explore All Services Catalog";
    case "/become-a-provider":
    case "/become-pro":
      return "Become a Service Provider (Pro)";
    case "/help":
    case "/support":
      return "Help Center & Support Desk";
    case "/about":
      return "About Supermarche Express";
    case "/privacy":
      return "Privacy Policy & Terms";
    default:
      return cleanPath.substring(1).replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Page View";
  }
};

export const trackVisitorHitHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = trackVisitorHitSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Missing sessionId or path",
        details: parseResult.error.errors
      });
    }

    const { sessionId, path, device, deviceType, referrer, timestamp } = parseResult.data;

    // Resolve device type
    const rawDevice = (device || deviceType || "desktop").toLowerCase();
    let resolvedDevice: "mobile" | "desktop" | "tablet" = "desktop";
    if (rawDevice.includes("mobile") || rawDevice.includes("phone")) {
      resolvedDevice = "mobile";
    } else if (rawDevice.includes("tablet") || rawDevice.includes("ipad")) {
      resolvedDevice = "tablet";
    }

    const hitDate = timestamp ? new Date(timestamp) : new Date();
    const dateStr = hitDate.toISOString().split("T")[0];

    // 1. Asynchronously insert raw hit log into VisitorLog
    await VisitorLog.create({
      sessionId,
      path,
      deviceType: resolvedDevice,
      referrer: referrer || "direct",
      timestamp: hitDate
    });

    // 2. Increment DailyAnalytics totals atomically
    await DailyAnalytics.updateOne(
      { date: dateStr },
      {
        $inc: {
          totalViews: 1,
          [`deviceStats.${resolvedDevice}`]: 1
        }
      },
      { upsert: true }
    );

    return res.status(201).json({ success: true, message: "Hit logged" });
  } catch (error) {
    // Non-blocking fallback response for analytics tracking
    return res.status(200).json({ success: false, message: "Silent tracking fallback" });
  }
};

export const getAnalyticsOverviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timeframeParam = String(req.query.timeframe || req.query.range || "last7days").toLowerCase();
    
    let daysToInclude = 7;
    if (timeframeParam === "today" || timeframeParam === "1d") {
      daysToInclude = 1;
    } else if (timeframeParam === "last30days" || timeframeParam === "30d") {
      daysToInclude = 30;
    }

    const now = new Date();
    const startDate = new Date(now.getTime() - daysToInclude * 24 * 60 * 60 * 1000);
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // 1. Query raw VisitorLogs within timeframe
    let logs: any[] = [];
    let totalSubscribers = 0;
    let liveActiveUsers = 0;

    if (require("mongoose").connection.readyState >= 1) {
      try {
        logs = await VisitorLog.find({ timestamp: { $gte: startDate } }).lean();
        totalSubscribers = await CampaignSubscriber.countDocuments({ is_active: true });
        const liveActiveLogs = await VisitorLog.find({ timestamp: { $gte: fiveMinsAgo } }).distinct("sessionId");
        liveActiveUsers = liveActiveLogs.length;
      } catch {
        logs = [];
      }
    }

    // 4. Compute Aggregated Total Page Views & Unique Visitors
    const totalPageViews = logs.length;
    const uniqueVisitorSet = new Set(logs.map((l) => l.sessionId));
    const uniqueVisitors = uniqueVisitorSet.size;

    // 5. Compute Top Pages & Top Performing Page
    const pageCounts: Record<string, { views: number; uniqueSessions: Set<string> }> = {};
    const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    const referrerCounts: Record<string, number> = {};

    logs.forEach((log) => {
      // Page stats
      if (!pageCounts[log.path]) {
        pageCounts[log.path] = { views: 0, uniqueSessions: new Set() };
      }
      pageCounts[log.path].views += 1;
      pageCounts[log.path].uniqueSessions.add(log.sessionId);

      // Device stats
      const dev = log.deviceType || "desktop";
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;

      // Referrer stats
      const ref = log.referrer || "direct";
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });

    // Format top pages array
    const sortedPages = Object.entries(pageCounts)
      .map(([path, data]) => ({
        path,
        pageName: getPageName(path),
        views: data.views,
        uniqueVisitors: data.uniqueSessions.size,
        bounceRate: "0%"
      }))
      .sort((a, b) => b.views - a.views);

    const topPerformingPage = sortedPages.length > 0
      ? { path: sortedPages[0].path, views: sortedPages[0].views }
      : { path: "/", views: 0 };

    // 6. Build Traffic Trend array per day
    const trendMap: Record<string, { pageViews: number; uniqueSessions: Set<string> }> = {};
    
    // Seed days in timeframe
    for (let i = daysToInclude - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      trendMap[dateLabel] = { pageViews: 0, uniqueSessions: new Set() };
    }

    logs.forEach((log) => {
      const dateLabel = new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      if (trendMap[dateLabel]) {
        trendMap[dateLabel].pageViews += 1;
        trendMap[dateLabel].uniqueSessions.add(log.sessionId);
      }
    });

    const trafficTrend = Object.entries(trendMap).map(([date, data]) => ({
      date,
      pageViews: data.pageViews,
      uniqueVisitors: data.uniqueSessions.size
    }));

    // 7. Device Breakdown calculation (Pure database counts)
    const totalDeviceHits = Object.values(deviceCounts).reduce((a, b) => a + b, 0);
    const deviceBreakdown = [
      {
        device: "mobile",
        percentage: totalDeviceHits > 0 ? Math.round(((deviceCounts.mobile || 0) / totalDeviceHits) * 100) : 0,
        count: deviceCounts.mobile || 0
      },
      {
        device: "desktop",
        percentage: totalDeviceHits > 0 ? Math.round(((deviceCounts.desktop || 0) / totalDeviceHits) * 100) : 0,
        count: deviceCounts.desktop || 0
      },
      {
        device: "tablet",
        percentage: totalDeviceHits > 0 ? Math.round(((deviceCounts.tablet || 0) / totalDeviceHits) * 100) : 0,
        count: deviceCounts.tablet || 0
      }
    ];

    // 8. Referrer Breakdown calculation (Pure database counts)
    const totalReferrerHits = Object.values(referrerCounts).reduce((a, b) => a + b, 0);
    const referrerBreakdown = [
      {
        source: "Direct / Bookmark",
        percentage: totalReferrerHits > 0 ? Math.round(((referrerCounts["direct"] || 0) / totalReferrerHits) * 100) : 0,
        count: referrerCounts["direct"] || 0
      },
      {
        source: "Google Search",
        percentage: totalReferrerHits > 0 ? Math.round(((referrerCounts["google"] || 0) / totalReferrerHits) * 100) : 0,
        count: referrerCounts["google"] || 0
      },
      {
        source: "Social (WhatsApp / FB)",
        percentage: totalReferrerHits > 0 ? Math.round((((referrerCounts["social"] || 0) + (referrerCounts["facebook"] || 0)) / totalReferrerHits) * 100) : 0,
        count: (referrerCounts["social"] || 0) + (referrerCounts["facebook"] || 0)
      }
    ];

    // Response structure strictly matching frontend spec with real-time data
    res.status(200).json({
      success: true,
      data: {
        timeframe: timeframeParam,
        totalPageViews,
        totalPageViewsChange: 0,
        uniqueVisitors,
        uniqueVisitorsChange: 0,
        totalSubscribers,
        subscriberCount: totalSubscribers,
        topPerformingPage,
        liveActiveUsers,
        trafficTrend,
        topPages: sortedPages,
        deviceBreakdown,
        referrerBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};
