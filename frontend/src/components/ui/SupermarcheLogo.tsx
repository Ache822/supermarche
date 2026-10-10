import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

interface LogoProps {
  size?: number;
  showText?: boolean;
  sx?: SxProps<Theme>;
}

export function SupermarcheIcon({ size = 42, sx }: { size?: number; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #FF6B00 0%, #E05D00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        boxShadow: '0 4px 14px rgba(255, 107, 0, 0.4)',
        flexShrink: 0,
        ...sx,
      }}
    >
      <ShoppingBagIcon sx={{ fontSize: size * 0.55 }} />
    </Box>
  );
}

export function SupermarcheLogo({ size = 42, showText = true, sx }: LogoProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ...sx }}>
      <SupermarcheIcon size={size} />
      {showText && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #FF6B00 0%, #FFA27B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.25rem',
            }}
          >
            SUPERMARCHÉ
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Store Platform
          </Typography>
        </Box>
      )}
    </Box>
  );
}
