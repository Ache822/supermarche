import { Box, Typography, Avatar, Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

export interface VerifiedBadgeProps {
  size?: number;
  title?: string;
  showTooltip?: boolean;
  sx?: object;
  // Optional Technician / Operator Profile Props
  name?: string;
  role?: string;
  verified?: boolean;
  avatarUrl?: string;
}

/**
 * MUI VerifiedIcon Badge styled with Yellow Gold Seal (#FFC72C) and Green Checkmark (#15803D).
 * Inherits project design tokens, high-contrast light/dark mode, inline-flex layout, and accessibility.
 */
export function VerifiedBadge({
  size = 18,
  title = 'Verified Operator / Provider',
  showTooltip = true,
  sx = {},
  name,
  role,
  verified = true,
  avatarUrl,
}: VerifiedBadgeProps) {
  // MUI Verified Icon with Yellow Gold Seal & Green Checkmark
  const badgeIcon = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        verticalAlign: 'middle',
        cursor: showTooltip ? 'help' : 'default',
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'scale(1.15)' },
        ...sx,
      }}
    >
      {/* Outer MUI Verified Badge Seal (Yellow Gold) */}
      <VerifiedIcon
        role="img"
        aria-label={title || 'Verified'}
        sx={{
          fontSize: size,
          color: '#FFC72C',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))',
        }}
      />
      {/* Inner Checkmark Overlay (Vibrant Deep Green) */}
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          pointerEvents: 'none',
        }}
      >
        <path
          d="M10.09 16.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"
          fill="#15803D"
        />
      </Box>
    </Box>
  );

  // If a technician name is passed, render full profile layout with avatar and name + gold tick badge
  if (name) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          src={avatarUrl}
          alt={name}
          sx={{
            width: 38,
            height: 38,
            bgcolor: '#FF6B00',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 14,
            border: '2px solid #FF6B00',
          }}
        >
          {name.charAt(0)}
        </Avatar>
        <Box>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: 'text.primary', lineHeight: 1.2 }}>
              {name}
            </Typography>
            {verified && (
              showTooltip ? (
                <Tooltip title={title} arrow placement="top">
                  {badgeIcon}
                </Tooltip>
              ) : (
                badgeIcon
              )
            )}
          </Box>
          {role && (
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.2 }}>
              {role}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  // Standalone Icon Badge
  if (showTooltip && title) {
    return (
      <Tooltip title={title} arrow placement="top">
        {badgeIcon}
      </Tooltip>
    );
  }

  return badgeIcon;
}

export default VerifiedBadge;
