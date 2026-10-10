import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Skeleton } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export interface SubscriberMetricCardProps {
  count: number;
  growthRate?: string;
  isLoading?: boolean;
}

export const SubscriberMetricCard: React.FC<SubscriberMetricCardProps> = ({
  count,
  growthRate,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
        border: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
        borderRadius: '12px',
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
        width: '100%',
        transition: 'all 0.25s ease',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'text.secondary',
          }}
        >
          {t('admin.newsletterAudience', 'Newsletter Audience')}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            letterSpacing: '-0.02em',
            fontSize: 24,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          {isLoading ? (
            <Skeleton variant="rounded" width={80} height={32} />
          ) : (
            (count || 0).toLocaleString()
          )}
        </Typography>
        {growthRate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#FF6B00', fontSize: 12 }}>
            <TrendingUpIcon sx={{ fontSize: 13 }} />
            <Typography component="span" sx={{ fontSize: 12, color: '#FF6B00', fontWeight: 600 }}>
              {growthRate}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '10px',
          bgcolor: 'rgba(255, 107, 0, 0.12)',
          border: '1px solid rgba(255, 107, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FF6B00',
          flexShrink: 0,
        }}
      >
        <MailIcon sx={{ fontSize: 22 }} />
      </Box>
    </Box>
  );
};
