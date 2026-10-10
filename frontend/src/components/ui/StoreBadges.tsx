import { Box, Typography } from '@mui/material';
import type { Theme } from '@mui/material';

interface StoreBadgeProps {
  href?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Official Google Play Store Badge Vector Component
 */
export function GooglePlayBadge({
  href = 'https://play.google.com/store/apps/details?id=com.supermarche.app',
  size = 'medium',
}: StoreBadgeProps) {
  const isSmall = size === 'small';

  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        px: isSmall ? 1.75 : 2.5,
        py: isSmall ? 0.75 : 1,
        borderRadius: '10px',
        bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#000000'),
        color: '#FFFFFF',
        textDecoration: 'none',
        border: '1px solid',
        borderColor: (theme: Theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.4)' : 'rgba(255, 255, 255, 0.15)',
        boxShadow: (theme: Theme) =>
          theme.palette.mode === 'dark'
            ? '0 4px 16px rgba(0,0,0,0.5)'
            : '0 4px 16px rgba(255, 107, 0, 0.2)',
        transition: 'all 0.25s ease',
        '&:hover': {
          bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#291A10'),
          borderColor: '#FF6B00',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
        },
      }}
    >
      {/* Official Google Play Tri-Color Vector Icon */}
      <svg width={isSmall ? 20 : 24} height={isSmall ? 22 : 26} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32.5 12.2A28 28 0 0 0 24 32v448a28 28 0 0 0 8.5 19.8l235.8-243.8L32.5 12.2z"
          fill="#00F0FF"
        />
        <path
          d="M352.4 172.4L268.3 256l84.1 83.6 98.4-56.8a28 28 0 0 0 0-47.6l-98.4-62.8z"
          fill="#FFC700"
        />
        <path
          d="M268.3 256L32.5 499.8a28 28 0 0 0 35.7 3.3l284.2-163.5L268.3 256z"
          fill="#FF004F"
        />
        <path
          d="M268.3 256l84.1-83.6L68.2 8.9A28 28 0 0 0 32.5 12.2L268.3 256z"
          fill="#00E676"
        />
      </svg>

      <Box sx={{ textAlign: 'left', lineHeight: 1 }}>
        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: isSmall ? 9 : 10,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 0.25,
          }}
        >
          GET IT ON
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Google Sans, Space Grotesk, sans-serif',
            fontSize: isSmall ? 14 : 16,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}
        >
          Google Play
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * Official Apple App Store Badge Vector Component
 */
export function AppStoreBadge({
  href = 'https://apps.apple.com/app/supermarche/id123456789',
  size = 'medium',
}: StoreBadgeProps) {
  const isSmall = size === 'small';

  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        px: isSmall ? 1.75 : 2.5,
        py: isSmall ? 0.75 : 1,
        borderRadius: '10px',
        bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#000000'),
        color: '#FFFFFF',
        textDecoration: 'none',
        border: '1px solid',
        borderColor: (theme: Theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.4)' : 'rgba(255, 255, 255, 0.15)',
        boxShadow: (theme: Theme) =>
          theme.palette.mode === 'dark'
            ? '0 4px 16px rgba(0,0,0,0.5)'
            : '0 4px 16px rgba(255, 107, 0, 0.2)',
        transition: 'all 0.25s ease',
        '&:hover': {
          bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#291A10'),
          borderColor: '#FF6B00',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
        },
      }}
    >
      {/* Official Apple Vector Logo */}
      <svg width={isSmall ? 18 : 22} height={isSmall ? 22 : 26} viewBox="0 0 384 512" fill="currentColor">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-92.1zm-56-170.8c27.1-32.8 23.3-62.8 21.6-70.9-23.7 1.4-52.6 16-68.5 34.6-15.7 18-24.8 44.4-21.7 70.9 26.5 2.1 53.6-15.8 68.6-34.6z" />
      </svg>

      <Box sx={{ textAlign: 'left', lineHeight: 1 }}>
        <Typography
          sx={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: isSmall ? 8.5 : 9.5,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 0.25,
          }}
        >
          Download on the
        </Typography>
        <Typography
          sx={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: isSmall ? 14 : 16,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}
        >
          App Store
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * Combined Dual Store Badges Row
 */
export function DualStoreBadges({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
      <GooglePlayBadge size={size} />
      <AppStoreBadge size={size} />
    </Box>
  );
}
