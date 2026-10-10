import { Box, Typography, Chip } from '@mui/material';
import type { Theme } from '@mui/material';
import { BamboMascot } from '../../assets/BamboMascot';
import SouthIcon from '@mui/icons-material/South';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import NorthIcon from '@mui/icons-material/North';

export interface BamboGuideProps {
  pointingDirection?: 'down' | 'right' | 'left' | 'up';
  text: string;
  subtext?: string;
  height?: number;
  width?: number;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
}

export function BamboGuide({
  pointingDirection = 'down',
  text,
  subtext,
  height = 160,
  width = 130,
  flexDirection = 'row',
}: BamboGuideProps) {
  const getDirectionIcon = () => {
    switch (pointingDirection) {
      case 'right':
        return <EastIcon sx={{ fontSize: 16, color: '#FF6B00' }} />;
      case 'left':
        return <WestIcon sx={{ fontSize: 16, color: '#FF6B00' }} />;
      case 'up':
        return <NorthIcon sx={{ fontSize: 16, color: '#FF6B00' }} />;
      case 'down':
      default:
        return <SouthIcon sx={{ fontSize: 16, color: '#FF6B00' }} />;
    }
  };

  const getTransform = () => {
    switch (pointingDirection) {
      case 'left':
        return 'scaleX(-1)';
      case 'right':
        return 'scaleX(1) rotate(-3deg)';
      case 'down':
        return 'scaleX(1) translateY(4px)';
      case 'up':
        return 'scaleX(1) rotate(-6deg)';
      default:
        return 'none';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection,
        alignItems: 'center',
        gap: 2,
        my: 1,
      }}
    >
      {/* Supermarche Bot Mascot SVG */}
      <Box
        sx={{
          transform: getTransform(),
          transition: 'transform 0.3s ease',
          filter: 'drop-shadow(0 8px 16px rgba(255, 107, 0, 0.25))',
          flexShrink: 0,
        }}
      >
        <BamboMascot width={width} height={height} />
      </Box>

      {/* Pointing Direction Speech Bubble / Badge */}
      <Box
        sx={{
          p: 2,
          borderRadius: '12px',
          bgcolor: (theme: Theme) =>
            theme.palette.mode === 'dark' ? 'rgba(31, 20, 12, 0.95)' : 'rgba(255, 244, 237, 0.95)',
          border: '1px solid',
          borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#C4E8C9'),
          boxShadow: (theme: Theme) =>
            theme.palette.mode === 'dark'
              ? '0 6px 20px rgba(0, 0, 0, 0.4)'
              : '0 6px 20px rgba(255, 107, 0, 0.12)',
          maxWidth: 280,
          position: 'relative',
          animation: 'floatBambo 3s ease-in-out infinite',
          '@keyframes floatBambo': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-4px)' },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: subtext ? 0.5 : 0 }}>
          <Chip
            size="small"
            label="Kimzy Bot Guide"
            sx={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 9,
              fontWeight: 700,
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              height: 18,
            }}
          />
          {getDirectionIcon()}
        </Box>

        <Typography
          sx={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.3,
          }}
        >
          {text}
        </Typography>

        {subtext && (
          <Typography
            sx={{
              fontSize: 11,
              color: 'text.secondary',
              mt: 0.5,
              lineHeight: 1.3,
            }}
          >
            {subtext}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
