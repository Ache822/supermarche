export interface VisitorLogPayload {
  sessionId: string;
  ipHash?: string;
  path: string;
  device: 'mobile' | 'desktop' | 'tablet';
  referrer: string;
  timestamp: string;
}

export interface TopPageMetric {
  path: string;
  pageName: string;
  views: number;
  uniqueVisitors: number;
  bounceRate: string;
}

export interface DeviceBreakdown {
  device: 'mobile' | 'desktop' | 'tablet';
  percentage: number;
  count: number;
}

export interface ReferrerBreakdown {
  source: string;
  percentage: number;
  count: number;
}

export interface TrafficTrendDataPoint {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
}

export interface AnalyticsOverviewMetrics {
  timeframe: 'today' | 'last7days' | 'last30days';
  totalPageViews: number;
  totalPageViewsChange: number;
  uniqueVisitors: number;
  uniqueVisitorsChange: number;
  topPerformingPage: {
    path: string;
    views: number;
  };
  liveActiveUsers: number;
  totalSubscribers?: number;
  subscriberCount?: number;
  totalVisitors?: number;
  activeSessions?: number;
  pendingTestimonials?: number;
  trafficTrend: TrafficTrendDataPoint[];
  topPages: TopPageMetric[];
  deviceBreakdown: DeviceBreakdown[];
  referrerBreakdown: ReferrerBreakdown[];
}
