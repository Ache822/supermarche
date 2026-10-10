import { Box, Typography, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

export interface ServiceTicketCardProps {
  jobId: string;
  service: string;
  status: 'pending' | 'in_progress' | 'completed' | 'action_needed';
  eta?: string;
  price?: string;
  technician?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
}

const statusLabelMap: Record<ServiceTicketCardProps['status'], { key: string; defaultText: string }> = {
  pending: { key: 'status.pending', defaultText: 'Pending' },
  in_progress: { key: 'status.inProgress', defaultText: 'In progress' },
  completed: { key: 'status.completed', defaultText: 'Completed' },
  action_needed: { key: 'status.actionNeeded', defaultText: 'Action needed' },
};

/**
 * Signature component. Corner brackets instead of a full border — evokes a
 * blueprint registration mark / measured work order.
 */
export function ServiceTicketCard({
  jobId,
  service,
  status,
  eta,
  price,
  technician,
  children,
  onClick,
}: ServiceTicketCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const statusInfo = statusLabelMap[status] || { key: 'status.inProgress', defaultText: 'In progress' };
  const localizedStatus = t(statusInfo.key, { defaultValue: statusInfo.defaultText });

  const accent = status === 'action_needed'
    ? (isDark ? '#D98F52' : '#C97B3D')
    : theme.palette.primary.main;

  const bracketSize = 18;
  const bracketThickness = 2;

  const bracket = (top: boolean, left: boolean) => ({
    position: 'absolute' as const,
    width: bracketSize,
    height: bracketSize,
    top: top ? 0 : 'auto',
    bottom: top ? 'auto' : 0,
    left: left ? 0 : 'auto',
    right: left ? 'auto' : 0,
    borderTop: top ? `${bracketThickness}px solid ${accent}` : 'none',
    borderBottom: top ? 'none' : `${bracketThickness}px solid ${accent}`,
    borderLeft: left ? `${bracketThickness}px solid ${accent}` : 'none',
    borderRight: left ? 'none' : `${bracketThickness}px solid ${accent}`,
    pointerEvents: 'none' as const,
  });

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        padding: '20px 24px',
        bgcolor: isDark ? '#1F140C' : '#FFFFFF',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: isDark
                ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                : '0 8px 24px rgba(255, 107, 0, 0.12)',
            }
          : undefined,
      }}
    >
      {/* 4 blueprint bracket corners */}
      <Box sx={bracket(true, true)} />
      <Box sx={bracket(true, false)} />
      <Box sx={bracket(false, true)} />
      <Box sx={bracket(false, false)} />

      {/* Header row: Job ID + Status Label */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          sx={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 12,
            color: 'text.disabled',
            letterSpacing: '0.04em',
          }}
        >
          {jobId}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarIcon
            sx={{
              fontSize: 13,
              color: accent,
              filter: `drop-shadow(0 0 6px ${accent})`,
            }}
          />
          <Typography
            sx={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              fontWeight: 500,
              color: accent,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {localizedStatus}
          </Typography>
        </Box>
      </Box>

      {/* Service Name */}
      <Typography
        variant="h3"
        sx={{
          fontSize: 18,
          fontWeight: 600,
          color: 'text.primary',
          mb: 2,
        }}
      >
        {service}
      </Typography>

      {/* Dashed blueprint divider */}
      <Box
        sx={{
          borderBottom: `1px dashed ${isDark ? '#3A2316' : '#E2E8F0'}`,
          my: 2,
        }}
      />

      {/* Metadata grid: ETA + Price */}
      {(eta || price) && (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: technician ? 2 : 0 }}>
          {eta && (
            <Box>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', mb: 0.5 }}>
                {t('hero.previewEta')}
              </Typography>
              <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
                {eta}
              </Typography>
            </Box>
          )}

          {price && (
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', mb: 0.5 }}>
                {t('hero.previewCost')}
              </Typography>
              <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 600, color: accent }}>
                {price}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Technician stamp row */}
      {technician && (
        <Box sx={{ pt: 1 }}>
          {technician}
        </Box>
      )}

      {children}
    </Box>
  );
}
