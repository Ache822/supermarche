import { Box, Typography, Button, Chip } from '@mui/material';
import type { Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { GooglePlayBadge, AppStoreBadge } from './StoreBadges';
import { SupermarcheQRCode } from './SupermarcheQRCode';

interface PlayStorePromptProps {
  serviceTitle?: string;
  serviceDescription?: string;
  onContinueWebBooking?: () => void;
  onOpenServiceDetails?: () => void;
  onOpenLiveChat?: () => void;
  compact?: boolean;
}

export function PlayStorePrompt({
  serviceTitle,
  serviceDescription,
  onContinueWebBooking,
  onOpenServiceDetails,
  onOpenLiveChat,
  compact = false,
}: PlayStorePromptProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: '16px',
        bgcolor: (theme: Theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1F140C 0%, #291A10 100%)'
            : 'linear-gradient(135deg, #FFF4ED 0%, #FFF4ED 100%)',
        background: (theme: Theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1F140C 0%, #1F140C 100%)'
            : 'linear-gradient(135deg, #FFF4ED 0%, #FFFFFF 100%)',
        border: '1px solid',
        borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#C4E8C9'),
        boxShadow: (theme: Theme) =>
          theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0, 0, 0, 0.4)'
            : '0 8px 24px rgba(255, 107, 0, 0.12)',
        mb: compact ? 2 : 3,
      }}
    >
      {/* Service Info Banner */}
      {serviceTitle && (
        <Box sx={{ pb: 2, mb: 2.5, borderBottom: '1px dashed', borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0') }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
            <Chip
              label={t('download.chip', 'Selected Work Order')}
              size="small"
              sx={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 10,
                fontWeight: 700,
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
              }}
            />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Space Grotesk, sans-serif' }}>
            {serviceTitle}
          </Typography>

          {serviceDescription && (
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
              {serviceDescription}
            </Typography>
          )}
        </Box>
      )}

      {/* App Download Callout Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, alignItems: 'center', mb: 2.5 }}>
        {/* Smartphone Icon */}
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: '14px',
            bgcolor: '#FF6B00',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)',
          }}
        >
          <SmartphoneIcon sx={{ fontSize: 30 }} />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('download.title', 'Get Supermarche Mobile on iOS & Android')}
            </Typography>
            <Chip
              label={t('download.officialApp', 'OFFICIAL APP')}
              size="small"
              sx={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                fontWeight: 700,
                bgcolor: 'rgba(255, 107, 0, 0.15)',
                color: '#FF6B00',
                height: 18,
              }}
            />
          </Box>

          <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.4, mb: 1 }}>
            {t('download.subtitle', 'Book service dispatches, chat directly with safety providers, and get instant status push alerts.')}
          </Typography>

          {/* Key Mobile Features */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, fontSize: 11, color: 'text.primary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 14, color: '#FF6B00' }} /> {t('download.directDispatch', 'Direct Service Dispatch')}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 14, color: '#FF6B00' }} /> {t('download.pushUpdates', 'Instant Push Ticket Updates')}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 14, color: '#FF6B00' }} /> {t('download.verifiedMoMo', 'Verified Mobile Money')}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Official Store Badges & Artistic BB Monogram QR Code */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <GooglePlayBadge size={compact ? 'small' : 'medium'} />
          <AppStoreBadge size={compact ? 'small' : 'medium'} />
        </Box>

        <SupermarcheQRCode size={compact ? 120 : 140} showLabel={!compact} />
      </Box>

      {/* Secondary Actions */}
      {(onOpenServiceDetails || onContinueWebBooking || onOpenLiveChat) && (
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', pt: 2, borderTop: '1px solid', borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') }}>
          {onOpenLiveChat && (
            <Button
              variant="contained"
              onClick={onOpenLiveChat}
              startIcon={<SupportAgentIcon fontSize="small" />}
              sx={{
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '8px',
                px: 2.5,
                py: 0.9,
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                '&:hover': { bgcolor: '#E05D00' },
              }}
            >
              {t('download.chatSupport', 'Chat with Live Support')}
            </Button>
          )}

          {onOpenServiceDetails && (
            <Button
              variant="outlined"
              onClick={onOpenServiceDetails}
              startIcon={<InfoOutlinedIcon fontSize="small" />}
              sx={{
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#C4E8C9'),
                color: 'text.primary',
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
              }}
            >
              {t('download.safetyGuarantee', 'Learn Service Safety Guarantee')}
            </Button>
          )}

          {onContinueWebBooking && (
            <Button
              variant="text"
              onClick={onContinueWebBooking}
              sx={{
                color: '#FF6B00',
                fontWeight: 600,
                fontSize: 13,
                textTransform: 'none',
                ml: 'auto',
              }}
            >
              {t('download.backToCatalog', 'Back to Web Catalog →')}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
