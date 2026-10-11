import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionBadgeProps {
  label: string;
  icon?: React.ReactNode;
  pulse?: boolean;
}

/**
 * Modern, human-crafted section eyebrow badge for Kim's Store.
 * Replaces generic AI pill-badges with chic, editorial micro-tags featuring
 * live glowing accents, tracked typography, and sleek glassmorphism.
 */
export const SectionBadge: React.FC<SectionBadgeProps> = ({
  label,
  icon,
  pulse = true,
}) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        py: 0.65,
        px: 1.75,
        borderRadius: '9999px',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.08)' : 'rgba(255, 107, 0, 0.06)'),
        border: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.28)' : 'rgba(255, 107, 0, 0.22)'),
        backdropFilter: 'blur(8px)',
        mb: 2.5,
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          borderColor: '#FF6B00',
          boxShadow: '0 0 16px rgba(255, 107, 0, 0.22)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {pulse && (
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: '#FF6B00',
            boxShadow: '0 0 8px #FF6B00',
            flexShrink: 0,
            animation: 'bbPulse 2s infinite ease-in-out',
            '@keyframes bbPulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.4)', opacity: 0.55 },
            },
          }}
        />
      )}
      {icon && !pulse && (
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#FF6B00', fontSize: 13, flexShrink: 0 }}>
          {icon}
        </Box>
      )}
      <Typography
        component="span"
        sx={{
          fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: (theme) => (theme.palette.mode === 'dark' ? '#FFB28A' : '#C24A00'),
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default SectionBadge;
