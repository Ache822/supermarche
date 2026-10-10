import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import type { Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAppSelector } from '../../store/hooks';
import { PlayStorePrompt } from '../../components/ui/PlayStorePrompt';

interface BookingWizardModalProps {
  open: boolean;
  onClose: () => void;
  preselectedServiceId?: string | null;
  onOpenLiveChat?: () => void;
}

export function BookingWizardModal({ open, onClose, preselectedServiceId, onOpenLiveChat }: BookingWizardModalProps) {
  const { t } = useTranslation();
  const services = useAppSelector((state) => state.services.items);
  const [copied, setCopied] = useState(false);

  const selectedServiceId = preselectedServiceId || services[0]?.id || '';
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  const getLocalizedServiceTitle = (srvId?: string, defaultTitle?: string) => {
    switch (srvId) {
      case 'srv-gas': return t('services.gasTitle', defaultTitle || '');
      case 'srv-market': return t('services.marketTitle', defaultTitle || '');
      case 'srv-school': return t('services.schoolTitle', defaultTitle || '');
      case 'srv-cleaning': return t('services.cleaningTitle', defaultTitle || '');
      case 'srv-security': return t('services.securityTitle', defaultTitle || '');
      default: return defaultTitle;
    }
  };

  const getLocalizedServiceDesc = (srvId?: string, defaultDesc?: string) => {
    switch (srvId) {
      case 'srv-gas': return t('services.gasDesc', defaultDesc || '');
      case 'srv-market': return t('services.marketDesc', defaultDesc || '');
      case 'srv-school': return t('services.schoolDesc', defaultDesc || '');
      case 'srv-cleaning': return t('services.cleaningDesc', defaultDesc || '');
      case 'srv-security': return t('services.securityDesc', defaultDesc || '');
      default: return defaultDesc;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://play.google.com/store/apps/details?id=com.supermarche.app');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableRestoreFocus
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: '16px', sm: '24px' },
            mx: { xs: 1.5, sm: 'auto' },
            width: { xs: 'calc(100% - 24px)', sm: '100%' },
            bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
            backgroundImage: 'none',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          },
        },
      }}
    >
      {/* Modal Top Bar */}
      <Box
        sx={{
          px: { xs: 1.75, sm: 3, md: 4 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)'),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: '#FF6B00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(255, 107, 0, 0.35)',
              flexShrink: 0,
            }}
          >
            <SmartphoneIcon />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: 15, sm: 18 }, fontFamily: 'Space Grotesk, sans-serif' }}>
                {t('bookingModal.title', 'Download Supermarche App to Order')}
              </Typography>
              <Chip label={t('bookingModal.verifiedBadge', 'Verified App Only')} size="small" sx={{ bgcolor: '#FF6B00', color: '#FFFFFF', fontWeight: 700, fontSize: 10 }} />
            </Box>
            <Typography variant="body2" sx={{ fontSize: 12, color: 'text.secondary' }}>
              {t('bookingModal.subtitle', 'Orders, live GPS tracking & Mobile Money payouts are exclusive to the Mobile App')}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Modal Main Content */}
      <DialogContent sx={{ p: { xs: 1.75, sm: 3, md: 4 } }}>
        <PlayStorePrompt
          serviceTitle={getLocalizedServiceTitle(currentService?.id, currentService?.title)}
          serviceDescription={getLocalizedServiceDesc(currentService?.id, currentService?.description)}
          onContinueWebBooking={onClose}
          onOpenLiveChat={() => {
            onClose();
            onOpenLiveChat?.();
          }}
        />

        {/* Additional App Exclusives Callout */}
        <Box
          sx={{
            p: 3,
            borderRadius: '16px',
            bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F4FBF5'),
            border: '1px solid',
            borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#D4EED8'),
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, fontFamily: 'Space Grotesk, sans-serif', color: '#FF6B00', mb: 0.5 }}>
              {t('bookingModal.shareTitle', 'Share Supermarche App with Friends or Family')}
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
              {t('bookingModal.shareSub', 'Copy the direct download link or scan with any smartphone camera across Yaoundé, Douala, Bamenda & Buea.')}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={handleCopyLink}
            startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
            sx={{
              borderColor: '#FF6B00',
              color: '#FF6B00',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              px: 2.5,
              py: 1,
              '&:hover': {
                bgcolor: 'rgba(255, 107, 0, 0.08)',
                borderColor: '#E05D00',
              },
            }}
          >
            {copied ? t('bookingModal.copied', 'Link Copied!') : t('bookingModal.copyLink', 'Copy App Link')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default BookingWizardModal;
