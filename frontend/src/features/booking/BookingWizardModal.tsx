import { useState, useId } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  TextField,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import type { Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { useAppSelector } from '../../store/hooks';

interface BookingWizardModalProps {
  open: boolean;
  onClose: () => void;
  preselectedServiceId?: string | null;
  onOpenLiveChat?: () => void;
}

const CAMEROON_CITIES = [
  'Douala',
  'Yaoundé',
  'Buea',
  'Bamenda',
  'Bafoussam',
  'Limbe',
  'Kribi',
  'Garoua',
];

export function BookingWizardModal({ open, onClose, preselectedServiceId, onOpenLiveChat }: BookingWizardModalProps) {
  const { t, i18n } = useTranslation();
  const services = useAppSelector((state) => state.services.items);
  const citySelectId = useId();

  const selectedServiceId = preselectedServiceId || services[0]?.id || '';
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Douala');
  const [quarter, setQuarter] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getLocalizedServiceTitle = (srvId?: string, defaultTitle?: string) => {
    if (srvId && i18n.exists(`shop.products.${srvId}.title`)) {
      return t(`shop.products.${srvId}.title`);
    }
    switch (srvId) {
      case 'srv-clothes': return t('services.clothesTitle', defaultTitle || 'Express Clothing & Tailoring Delivery');
      case 'srv-shoes': return t('services.shoesTitle', defaultTitle || 'Shoes & Footwear Courier');
      case 'srv-cosmetics': return t('services.cosmeticsTitle', defaultTitle || 'Cosmetics & Beauty Dispatch');
      case 'srv-tech': return t('services.techTitle', defaultTitle || 'Tech, Gadgets & Phone Accessories');
      case 'srv-snacks': return t('services.snacksTitle', defaultTitle || 'Snacks, Groceries & Market Essentials');
      default: return defaultTitle || 'Doorstep Delivery Service';
    }
  };

  const getLocalizedServiceDesc = (srvId?: string, defaultDesc?: string) => {
    const clean = (text?: string) => (text ? text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : '');
    if (srvId && i18n.exists(`shop.products.${srvId}.desc`)) {
      return clean(t(`shop.products.${srvId}.desc`));
    }
    switch (srvId) {
      case 'srv-clothes': return clean(t('services.clothesDesc', defaultDesc || ''));
      case 'srv-shoes': return clean(t('services.shoesDesc', defaultDesc || ''));
      case 'srv-cosmetics': return clean(t('services.cosmeticsDesc', defaultDesc || ''));
      case 'srv-tech': return clean(t('services.techDesc', defaultDesc || ''));
      case 'srv-snacks': return clean(t('services.snacksDesc', defaultDesc || ''));
      default: return clean(currentService?.shortDescription || defaultDesc) || 'Fast, reliable runner and doorstep delivery across Cameroon.';
    }
  };

  const handleReset = () => {
    setBookingRef(null);
    setErrorMsg(null);
    setFullName('');
    setPhone('');
    setQuarter('');
    setNotes('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg(t('bookingModal.errorName'));
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg(t('bookingModal.errorPhone'));
      return;
    }
    if (!quarter.trim()) {
      setErrorMsg(t('bookingModal.quarterPlaceholder'));
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    // Generate random reference code
    setTimeout(() => {
      const generatedRef = `BKG-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(generatedRef);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <Dialog
      open={open}
      onClose={handleReset}
      disableRestoreFocus
      maxWidth="sm"
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
          px: { xs: 2, sm: 3 },
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
            <LocalShippingOutlinedIcon />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: 15, sm: 17 }, fontFamily: 'Space Grotesk, sans-serif' }}>
                {bookingRef ? t('bookingModal.placedTitle') : t('bookingModal.title')}
              </Typography>
              <Chip
                label={t('bookingModal.verifiedBadge')}
                size="small"
                sx={{ bgcolor: '#FF6B00', color: '#FFFFFF', fontWeight: 700, fontSize: 10, height: 20 }}
              />
            </Box>
            <Typography variant="body2" sx={{ fontSize: 12, color: 'text.secondary' }}>
              {bookingRef
                ? t('bookingModal.dispatchDetails')
                : t('bookingModal.subtitle')}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={handleReset} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Modal Main Content */}
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {bookingRef ? (
          /* Confirmation Success State */
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'rgba(22, 163, 74, 0.12)',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 44 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', mb: 1, color: 'text.primary' }}>
              {t('bookingModal.placedTitle')}
            </Typography>

            <Chip
              label={t('bookingModal.refLabel', { ref: bookingRef })}
              sx={{
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 13,
                px: 1,
                py: 2,
                borderRadius: 2,
                mb: 3,
              }}
            />

            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF7F2'),
                border: '1px solid',
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#FFE4D4'),
                textAlign: 'left',
                mb: 3,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF6B00', mb: 1 }}>
                {t('bookingModal.dispatchDetails')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
                <strong>{t('bookingModal.serviceLabel')}:</strong> {getLocalizedServiceTitle(currentService?.id, currentService?.title)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
                <strong>{t('bookingModal.recipientLabel')}:</strong> {fullName} ({phone})
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
                <strong>{t('bookingModal.destinationLabel')}:</strong> {quarter}, {city}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13, mt: 1 }}>
                {t('bookingModal.runnerContactNotice', { phone })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{
                  bgcolor: '#FF6B00',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#E05D00' },
                }}
              >
                {t('bookingModal.doneBtn')}
              </Button>
              {onOpenLiveChat && (
                <Button
                  variant="outlined"
                  startIcon={<ChatBubbleOutlineOutlinedIcon />}
                  onClick={() => {
                    handleReset();
                    onOpenLiveChat();
                  }}
                  sx={{
                    borderColor: '#FF6B00',
                    color: '#FF6B00',
                    fontWeight: 700,
                    px: 3,
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.08)' },
                  }}
                >
                  {t('bookingModal.liveChatBtn')}
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          /* Direct Web Booking Form */
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Service Banner */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF7F2'),
                border: '1px solid',
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#FFE4D4'),
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <StorefrontOutlinedIcon sx={{ color: '#FF6B00', fontSize: 28 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {getLocalizedServiceTitle(currentService?.id, currentService?.title)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  {getLocalizedServiceDesc(currentService?.id, currentService?.description)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#FF6B00', fontWeight: 700, display: 'block', mt: 0.5 }}>
                  {t('bookingModal.runnerFeeNotice')}
                </Typography>
              </Box>
            </Box>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label={t('bookingModal.fullName')}
                placeholder={t('bookingModal.fullNamePlaceholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                fullWidth
                size="small"
              />

              <TextField
                label={t('bookingModal.phone')}
                placeholder={t('bookingModal.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                fullWidth
                size="small"
                helperText={t('bookingModal.phoneHelper')}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  id={citySelectId}
                  select
                  label={t('bookingModal.city')}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
                  size="small"
                >
                  {CAMEROON_CITIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label={t('bookingModal.quarter')}
                  placeholder={t('bookingModal.quarterPlaceholder')}
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Box>

              <TextField
                label={t('bookingModal.instructions')}
                placeholder={t('bookingModal.instructionsPlaceholder')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={3}
                fullWidth
                size="small"
              />
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('bookingModal.payNotice')}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleReset} sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {t('bookingModal.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={<LocalShippingOutlinedIcon />}
                  sx={{
                    bgcolor: '#FF6B00',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    px: 3,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(255, 107, 0, 0.4)',
                    '&:hover': { bgcolor: '#E05D00' },
                  }}
                >
                  {isSubmitting ? t('bookingModal.booking') : t('bookingModal.bookNow')}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BookingWizardModal;
