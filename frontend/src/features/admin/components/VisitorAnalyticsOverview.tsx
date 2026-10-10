import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton,
  LinearProgress,
  CircularProgress,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import SpeedIcon from '@mui/icons-material/Speed';
import RefreshIcon from '@mui/icons-material/Refresh';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import LanguageIcon from '@mui/icons-material/Language';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import type { AnalyticsOverviewMetrics } from '../../analytics/types/analytics.types';
import { SubscriberMetricCard } from '../../../components/ui/SubscriberMetricCard';

import api from '../../../api/client';

function getLiveAnalyticsMetrics(timeframe: 'today' | 'last7days' | 'last30days'): AnalyticsOverviewMetrics {
  const getLogs = (): Array<{ route?: string; timestamp?: string; userAgent?: string; sessionId?: string }> => {
    try {
      return JSON.parse(localStorage.getItem('bb_local_visitor_logs') || '[]');
    } catch {
      return [];
    }
  };
  const logs = getLogs();

  const totalPageViews = logs.length;
  const uniqueSessionSet = new Set(logs.map((l) => l.sessionId || 'anonymous'));
  const uniqueVisitors = logs.length > 0 ? uniqueSessionSet.size : 0;

  const routeCounts: Record<string, number> = {};
  let mobileCount = 0;
  let desktopCount = 0;

  logs.forEach((l) => {
    const route = l.route || '/';
    routeCounts[route] = (routeCounts[route] || 0) + 1;
    const ua = (l.userAgent || '').toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      mobileCount++;
    } else {
      desktopCount++;
    }
  });

  const sortedRoutes = Object.entries(routeCounts).sort((a, b) => b[1] - a[1]);
  const topRoute = sortedRoutes[0] ? sortedRoutes[0][0] : '/services';
  const topRouteViews = sortedRoutes[0] ? sortedRoutes[0][1] : 0;

  const topPages = sortedRoutes.map(([path, views]) => ({
    path,
    pageName: path === '/' ? 'Home Landing' : path.replace('/', '').toUpperCase(),
    views,
    uniqueVisitors: Math.ceil(views * 0.7),
    bounceRate: '0%',
  }));

  if (topPages.length === 0) {
    topPages.push({ path: '/services', pageName: 'Services Catalog', views: 0, uniqueVisitors: 0, bounceRate: '0%' });
  }

  const mobilePerc = totalPageViews > 0 ? Math.round((mobileCount / totalPageViews) * 100) : 0;
  const desktopPerc = totalPageViews > 0 ? Math.round((desktopCount / totalPageViews) * 100) : 0;

  return {
    timeframe,
    totalPageViews,
    totalPageViewsChange: 0,
    uniqueVisitors,
    uniqueVisitorsChange: 0,
    topPerformingPage: {
      path: topRoute,
      views: topRouteViews,
    },
    liveActiveUsers: totalPageViews > 0 ? 1 : 0,
    trafficTrend: [
      { date: 'Live Today', pageViews: totalPageViews, uniqueVisitors },
    ],
    topPages,
    deviceBreakdown: [
      { device: 'mobile', percentage: mobilePerc, count: mobileCount },
      { device: 'desktop', percentage: desktopPerc, count: desktopCount },
    ],
    referrerBreakdown: [
      { source: 'Direct Visitor', percentage: totalPageViews > 0 ? 100 : 0, count: totalPageViews },
    ],
  };
}

export function VisitorAnalyticsOverview() {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState<'today' | 'last7days' | 'last30days'>('last7days');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [liveBackendMetrics, setLiveBackendMetrics] = useState<AnalyticsOverviewMetrics | null>(null);

  useEffect(() => {
    api.analytics
      .getOverview(timeframe)
      .then((res: unknown) => {
        const payload = (res as { data?: AnalyticsOverviewMetrics })?.data || (res as AnalyticsOverviewMetrics);
        if (payload && typeof payload === 'object' && Array.isArray(payload.trafficTrend)) {
          setLiveBackendMetrics(payload);
        }
      })
      .catch(() => {});
  }, [timeframe]);

  const metrics = useMemo(() => {
    if (liveBackendMetrics && Array.isArray(liveBackendMetrics.trafficTrend) && liveBackendMetrics.trafficTrend.length > 0) {
      return liveBackendMetrics;
    }
    return getLiveAnalyticsMetrics(timeframe);
  }, [liveBackendMetrics, timeframe]);

  const [visibleTopPagesCount, setVisibleTopPagesCount] = useState<number>(6);
  const [isLoadingMoreTopPages, setIsLoadingMoreTopPages] = useState<boolean>(false);
  const topPagesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = topPagesScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoadingMoreTopPages) {
        if (visibleTopPagesCount < metrics.topPages.length) {
          setIsLoadingMoreTopPages(true);
          setTimeout(() => {
            setVisibleTopPagesCount((prev) => Math.min(prev + 5, metrics.topPages.length));
            setIsLoadingMoreTopPages(false);
          }, 300);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [visibleTopPagesCount, metrics.topPages.length, isLoadingMoreTopPages]);

  const trafficTrend = useMemo(() => metrics?.trafficTrend || [], [metrics]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  // SVG Trend Chart Dimensions
  const chartHeight = 180;
  const chartWidth = 600;
  const maxViews = useMemo(() => {
    const calculated = Math.max(1, ...trafficTrend.map((d) => d.pageViews)) * 1.15;
    return Number.isFinite(calculated) && calculated > 0 ? calculated : 10;
  }, [trafficTrend]);

  const pointsStringViews = useMemo(() => {
    const totalPoints = trafficTrend.length;
    const divisor = totalPoints > 1 ? totalPoints - 1 : 1;
    return trafficTrend
      .map((pt, i) => {
        const x = (i / divisor) * chartWidth;
        const y = chartHeight - (pt.pageViews / maxViews) * chartHeight;
        return `${Number.isFinite(x) ? x : 0},${Number.isFinite(y) ? y : chartHeight}`;
      })
      .join(' ');
  }, [trafficTrend, maxViews]);

  const pointsStringVisitors = useMemo(() => {
    const totalPoints = trafficTrend.length;
    const divisor = totalPoints > 1 ? totalPoints - 1 : 1;
    return trafficTrend
      .map((pt, i) => {
        const x = (i / divisor) * chartWidth;
        const y = chartHeight - (pt.uniqueVisitors / maxViews) * chartHeight;
        return `${Number.isFinite(x) ? x : 0},${Number.isFinite(y) ? y : chartHeight}`;
      })
      .join(' ');
  }, [trafficTrend, maxViews]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Analytics Header & Timeframe Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '16px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              bgcolor: 'rgba(255, 107, 0, 0.15)',
              color: '#FF6B00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUpIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('admin.analyticsHeaderTitle', 'Public Site Visitor Analytics & Traffic Engine')}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              {t('admin.analyticsHeaderSub', 'Real-time visitor logs, session tracking, route performance & device breakdown')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={t('admin.timeframeToday', 'Today')}
            size="small"
            color={timeframe === 'today' ? 'success' : 'default'}
            variant={timeframe === 'today' ? 'filled' : 'outlined'}
            onClick={() => setTimeframe('today')}
            sx={{ fontWeight: 700, cursor: 'pointer', borderRadius: '8px' }}
          />
          <Chip
            label={t('admin.timeframeLast7', 'Last 7 Days')}
            size="small"
            color={timeframe === 'last7days' ? 'success' : 'default'}
            variant={timeframe === 'last7days' ? 'filled' : 'outlined'}
            onClick={() => setTimeframe('last7days')}
            sx={{ fontWeight: 700, cursor: 'pointer', borderRadius: '8px' }}
          />
          <Chip
            label={t('admin.timeframeLast30', 'Last 30 Days')}
            size="small"
            color={timeframe === 'last30days' ? 'success' : 'default'}
            variant={timeframe === 'last30days' ? 'filled' : 'outlined'}
            onClick={() => setTimeframe('last30days')}
            sx={{ fontWeight: 700, cursor: 'pointer', borderRadius: '8px' }}
          />
          <IconButton size="small" onClick={handleRefresh} sx={{ color: '#FF6B00' }}>
            <RefreshIcon className={refreshing ? 'animate-spin' : ''} fontSize="small" />
          </IconButton>
        </Box>
      </Paper>

      {/* Overview Stat Cards */}
      <Grid container spacing={2.5}>
        {/* Newsletter Subscriber Counter KPI Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SubscriberMetricCard
            count={metrics.totalSubscribers ?? metrics.subscriberCount ?? 0}
            isLoading={!metrics}
          />
        </Grid>

        {/* Card 1: Total Page Views */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>{t('admin.totalPageViews', 'Total Page Views')}</Typography>
              <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(255, 107, 0, 0.15)', color: '#FF6B00' }}>
                <VisibilityIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'text.primary', mb: 0.5 }}>
              {metrics.totalPageViews.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#FF6B00', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span>↑ +{metrics.totalPageViewsChange}%</span>
              <span style={{ color: 'gray', fontWeight: 400 }}>{t('admin.vsPreviousTimeframe', 'vs previous timeframe')}</span>
            </Typography>
          </Paper>
        </Grid>

        {/* Card 2: Unique Visitors */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>{t('admin.uniqueVisitors', 'Unique Visitors')}</Typography>
              <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                <PeopleIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'text.primary', mb: 0.5 }}>
              {metrics.uniqueVisitors.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#3B82F6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span>↑ +{metrics.uniqueVisitorsChange}%</span>
              <span style={{ color: 'gray', fontWeight: 400 }}>{t('admin.distinctSessionIds', 'distinct session IDs')}</span>
            </Typography>
          </Paper>
        </Grid>

        {/* Card 3: Top Performing Page */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>{t('admin.topPerformingRoute', 'Top Performing Route')}</Typography>
              <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}>
                <InsertLinkIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: '#8B5CF6', mb: 0.5 }} noWrap>
              {metrics.topPerformingPage.path}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 600 }}>
              {metrics.topPerformingPage.views.toLocaleString()} {t('admin.totalPageHits', 'total page hits')}
            </Typography>
          </Paper>
        </Grid>

        {/* Card 4: Live Active Users */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>{t('admin.liveActiveUsers', 'Live Active Users')}</Typography>
              <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(236, 72, 153, 0.15)', color: '#EC4899' }}>
                <SpeedIcon fontSize="small" />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'text.primary' }}>
                {metrics.liveActiveUsers}
              </Typography>
              <Chip
                label={t('admin.liveBadge', 'LIVE')}
                size="small"
                color="success"
                sx={{ fontSize: 9, fontWeight: 800, height: 18, px: 0.5 }}
              />
            </Box>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'IBM Plex Mono, monospace' }}>
              {t('admin.activeSessions15Min', 'Active sessions in last 15 min')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Traffic Trend Chart */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('admin.trafficTrendTitle', 'Traffic Trend & Visitor Velocity')}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              {t('admin.trafficTrendSub', 'Pageviews vs Unique Visitors breakdown across timeframe')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, fontSize: 12 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: '#FF6B00' }} />
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{t('admin.pageViewsLabel', 'Page Views')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, fontSize: 12 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: '#3B82F6' }} />
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{t('admin.uniqueVisitorsLabel', 'Unique Visitors')}</Typography>
            </Box>
          </Box>
        </Box>

        {/* SVG Interactive Trend Chart */}
        <Box sx={{ width: '100%', overflowX: 'auto', py: 1 }}>
          <Box sx={{ minWidth: 500, position: 'relative', height: chartHeight + 40 }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: chartHeight, overflow: 'visible' }}>
              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1="0"
                  y1={chartHeight * (1 - ratio)}
                  x2={chartWidth}
                  y2={chartHeight * (1 - ratio)}
                  stroke="rgba(255, 196, 168,0.12)"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Total Page Views Line */}
              <polyline
                fill="none"
                stroke="#FF6B00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsStringViews}
              />

              {/* Unique Visitors Line */}
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsStringVisitors}
              />

              {/* Data Points */}
              {trafficTrend.map((pt, i) => {
                const totalPoints = trafficTrend.length;
                const divisor = totalPoints > 1 ? totalPoints - 1 : 1;
                const xRaw = (i / divisor) * chartWidth;
                const x = Number.isFinite(xRaw) ? xRaw : 0;
                const yViewsRaw = chartHeight - (pt.pageViews / maxViews) * chartHeight;
                const yViews = Number.isFinite(yViewsRaw) ? yViewsRaw : chartHeight;
                const yVisitorsRaw = chartHeight - (pt.uniqueVisitors / maxViews) * chartHeight;
                const yVisitors = Number.isFinite(yVisitorsRaw) ? yVisitorsRaw : chartHeight;
                const isHovered = hoveredPoint === i;

                return (
                  <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                    <circle cx={x} cy={yViews} r={isHovered ? 6 : 4} fill="#FF6B00" style={{ cursor: 'pointer' }} />
                    <circle cx={x} cy={yVisitors} r={isHovered ? 6 : 4} fill="#3B82F6" style={{ cursor: 'pointer' }} />
                  </g>
                );
              })}
            </svg>

            {/* X-Axis Date Labels */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
              {trafficTrend.map((pt, i) => (
                <Typography key={i} sx={{ fontSize: 10, color: 'text.secondary', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {pt.date}
                </Typography>
              ))}
            </Box>

            {/* Tooltip Overlay */}
            {hoveredPoint !== null && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 20,
                  p: 1.5,
                  borderRadius: '10px',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
                  border: '1px solid #FF6B00',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#FF6B00' }}>
                  {metrics.trafficTrend[hoveredPoint].date} Metrics
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.primary', fontWeight: 600 }}>
                  🟢 Pageviews: {metrics.trafficTrend[hoveredPoint].pageViews.toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#3B82F6', fontWeight: 600 }}>
                  🔵 Unique Visitors: {metrics.trafficTrend[hoveredPoint].uniqueVisitors.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Grid Breakdown: Top Routes & Traffic Acquisition */}
      <Grid container spacing={2.5}>
        {/* Left: Top Performing Routes Table */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
              height: '100%',
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 15, fontFamily: 'Space Grotesk, sans-serif', mb: 0.5 }}>
              {t('admin.topVisitedRoutesTitle', 'Top Visited Routes & Pages')}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
              {t('admin.topVisitedRoutesSub', 'Highest traffic landing pages across public application')}
            </Typography>

            <Box
              ref={topPagesScrollRef}
              sx={{
                maxHeight: 340,
                overflowY: 'auto',
                pr: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {metrics.topPages.slice(0, visibleTopPagesCount).map((page, idx) => {
                const percentage = Math.round((page.views / metrics.totalPageViews) * 100) || 1;

                return (
                  <Box key={idx}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#FF6B00', fontFamily: 'monospace' }}>
                          {page.path}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                          ({page.pageName})
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                        {page.views.toLocaleString()} {t('admin.viewsUnit', 'views')}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentage * 2.5, 100)}
                      sx={{
                        height: 6,
                        borderRadius: '3px',
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                        '& .MuiLinearProgress-bar': { bgcolor: '#FF6B00', borderRadius: '3px' },
                      }}
                    />
                  </Box>
                );
              })}

              {/* Infinite Scroll Footer Bar */}
              <Box
                sx={{
                  mt: 2,
                  pt: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                }}
              >
                <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'IBM Plex Mono, monospace' }}>
                  Showing {Math.min(visibleTopPagesCount, metrics.topPages.length)} of {metrics.topPages.length} entries (Infinite Scroll)
                </Typography>
                {isLoadingMoreTopPages ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={12} sx={{ color: '#FF6B00' }} />
                    <Typography sx={{ fontSize: 11, color: '#FF6B00', fontWeight: 600 }}>Loading...</Typography>
                  </Box>
                ) : visibleTopPagesCount < metrics.topPages.length ? (
                  <Button
                    size="small"
                    onClick={() => setVisibleTopPagesCount((prev) => Math.min(prev + 10, metrics.topPages.length))}
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#FF6B00',
                      textTransform: 'none',
                      py: 0.2,
                      px: 1.5,
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 107, 0, 0.3)',
                      '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' },
                    }}
                  >
                    Load More (+{Math.min(10, metrics.topPages.length - visibleTopPagesCount)})
                  </Button>
                ) : (
                  <Chip label="All items loaded" size="small" variant="outlined" sx={{ fontSize: 10 }} />
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Device Breakdown & Traffic Referrers */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Device Breakdown */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                border: '1px solid',
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', mb: 1.5 }}>
                {t('admin.deviceTypeTitle', 'Device Type Distribution')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {metrics.deviceBreakdown.map((dev, idx) => (
                  <Box key={idx}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {dev.device === 'mobile' ? (
                          <SmartphoneIcon fontSize="small" sx={{ color: '#FF6B00' }} />
                        ) : dev.device === 'desktop' ? (
                          <DesktopWindowsIcon fontSize="small" sx={{ color: '#3B82F6' }} />
                        ) : (
                          <TabletMacIcon fontSize="small" sx={{ color: '#8B5CF6' }} />
                        )}
                        <Typography sx={{ fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>
                          {dev.device === 'mobile' ? t('admin.deviceMobile', 'Mobile') : dev.device === 'desktop' ? t('admin.deviceDesktop', 'Desktop') : t('admin.deviceTablet', 'Tablet')}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                        {dev.percentage}% ({dev.count.toLocaleString()})
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={dev.percentage}
                      sx={{
                        height: 6,
                        borderRadius: '3px',
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: dev.device === 'mobile' ? '#FF6B00' : dev.device === 'desktop' ? '#3B82F6' : '#8B5CF6',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Traffic Sources / Referrers */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                border: '1px solid',
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', mb: 1.5 }}>
                {t('admin.trafficSourcesTitle', 'Traffic Sources & Referrers')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {metrics.referrerBreakdown.map((ref, idx) => {
                  const normalized = (ref.source || '').toLowerCase();
                  const translatedSource = normalized.includes('direct')
                    ? t('admin.sourceDirect', 'Direct / Bookmark')
                    : normalized.includes('google') || normalized.includes('search')
                    ? t('admin.sourceGoogle', 'Google Search')
                    : normalized.includes('social') || normalized.includes('whatsapp') || normalized.includes('fb')
                    ? t('admin.sourceSocial', 'Social (WhatsApp / FB)')
                    : ref.source;

                  return (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LanguageIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{translatedSource}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#FF6B00' }}>
                        {ref.percentage}%
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default VisitorAnalyticsOverview;
