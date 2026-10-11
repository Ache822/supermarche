import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  TextField,
} from '@mui/material';
import type { Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useTranslation } from 'react-i18next';

/**
 * ============================================================================
 * PAYMENT GATEWAY INTEGRATION HOOK
 * ============================================================================
 * When live API credentials are ready, replace the simulation timers below with:
 *
 * 1. CAMPAY (MTN MoMo & Orange Money Cameroon):
 *    Endpoint: POST https://www.campay.net/api/collect/
 *    Headers: { Authorization: `Token ${CAMPAY_APP_TOKEN}` }
 *    Body: { amount, currency: "XAF", from: "2376XXXXXXXX", description: "Order Payment" }
 *
 * 2. FLUTTERWAVE (Pan-African MoMo & Cards):
 *    Endpoint: POST https://api.flutterwave.com/v3/charges?type=mobile_money_franco
 *    Headers: { Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}` }
 *
 * 3. STRIPE (International Visa / Mastercard):
 *    Use Stripe Elements / stripe.confirmCardPayment(clientSecret)
 * ============================================================================
 */

export interface PaymentGatewayModalProps {
  open: boolean;
  onClose: () => void;
  paymentMethod: 'mtn_momo' | 'orange_money' | 'card';
  amount: number;
  phone: string;
  customerName: string;
  cardLast4?: string;
  onPaymentSuccess: (transactionReference: string) => void;
  onPaymentFailure?: (errorMessage: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  open,
  onClose,
  paymentMethod,
  amount,
  phone,
  customerName,
  cardLast4 = '4242',
  onPaymentSuccess,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'initiating' | 'waiting_auth' | 'processing' | 'success'>('initiating');
  const [countdown, setCountdown] = useState(25);
  const [pinInput] = useState('••••');
  const [otpInput, setOtpInput] = useState('849201');
  const [transactionRef, setTransactionRef] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep('initiating');
      setCountdown(25);
      const prefix = paymentMethod === 'mtn_momo' ? 'MOMO' : paymentMethod === 'orange_money' ? 'OM' : 'CARD';
      const ref = `${prefix}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setTransactionRef(ref);

      // Transition from initiating to waiting_auth after 1.2s
      const timer = setTimeout(() => {
        setStep('waiting_auth');
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [open, paymentMethod]);

  // Countdown timer during authorization wait
  useEffect(() => {
    if (open && step === 'waiting_auth' && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open, step, countdown]);

  const handleApprove = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess(transactionRef);
      }, 1400);
    }, 1000);
  };

  const getBrandDetails = () => {
    switch (paymentMethod) {
      case 'mtn_momo':
        return {
          title: t('paymentModal.mtnTitle'),
          badgeText: t('paymentModal.mtnBadge'),
          badgeBg: '#FFCC00',
          badgeColor: '#000000',
          accentColor: '#E5A800',
          phoneLabel: t('paymentModal.numberLabel', { provider: 'MTN', phone: phone || '670 000 000' }),
          authInstruction: t('paymentModal.mtnAuthInstruction'),
          promptScreenMsg: t('paymentModal.mtnPromptMsg', { amount: amount.toLocaleString() }),
          icon: <PhoneAndroidIcon sx={{ fontSize: 24, color: '#000000' }} />,
        };
      case 'orange_money':
        return {
          title: t('paymentModal.orangeTitle'),
          badgeText: t('paymentModal.orangeBadge'),
          badgeBg: '#FF7900',
          badgeColor: '#FFFFFF',
          accentColor: '#FF7900',
          phoneLabel: t('paymentModal.numberLabel', { provider: 'Orange', phone: phone || '690 000 000' }),
          authInstruction: t('paymentModal.orangeAuthInstruction'),
          promptScreenMsg: t('paymentModal.orangePromptMsg', { amount: amount.toLocaleString() }),
          icon: <PhoneAndroidIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />,
        };
      case 'card':
      default:
        return {
          title: t('paymentModal.cardTitle'),
          badgeText: t('paymentModal.cardBadge'),
          badgeBg: '#1E293B',
          badgeColor: '#FFFFFF',
          accentColor: '#2563EB',
          phoneLabel: t('paymentModal.cardEnding', { last4: cardLast4 }),
          authInstruction: t('paymentModal.cardAuthInstruction'),
          promptScreenMsg: t('paymentModal.cardPromptMsg', { amount: amount.toLocaleString() }),
          icon: <CreditCardIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />,
        };
    }
  };

  const brand = getBrandDetails();

  return (
    <Dialog
      open={open}
      onClose={step === 'processing' || step === 'success' ? undefined : onClose}
      disableRestoreFocus
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
            border: '1px solid',
            borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Top Banner */}
      <Box
        sx={{
          p: 2.5,
          bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F8FAFC'),
          borderBottom: '1px solid',
          borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: brand.badgeBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {brand.icon}
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
              {brand.title}
            </Typography>
            <Chip
              label={brand.badgeText}
              size="small"
              sx={{
                bgcolor: brand.badgeBg,
                color: brand.badgeColor,
                fontWeight: 700,
                fontSize: 10,
                height: 20,
              }}
            />
          </Box>
        </Box>

        {step !== 'processing' && step !== 'success' && (
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        {/* Step: Initiating */}
        {step === 'initiating' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ color: brand.accentColor, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {t('paymentModal.connecting')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('paymentModal.transmitting', { amount: amount.toLocaleString() })}
            </Typography>
          </Box>
        )}

        {/* Step: Waiting for Authorization */}
        {step === 'waiting_auth' && (
          <Box>
            {/* Amount Callout */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF7F2'),
                border: '1px solid',
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#FFE4D4'),
                mb: 2.5,
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                {t('paymentModal.totalDue')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FF6B00', my: 0.5 }}>
                XAF {amount.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {t('paymentModal.account')}: <strong>{customerName || t('paymentModal.customer')}</strong> ({brand.phoneLabel})
              </Typography>
            </Box>

            {/* Simulated Phone Prompt Frame */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#0F0905' : '#0F172A'),
                color: '#FFFFFF',
                border: '1px solid',
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#334155'),
                mb: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <VpnKeyIcon sx={{ fontSize: 14, color: brand.accentColor }} />
                  {paymentMethod === 'card' ? t('paymentModal.cardPrompt') : t('paymentModal.ussdPrompt')}
                </Typography>
                <Chip
                  label={`${countdown}s`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', height: 20, fontSize: 11 }}
                />
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#F8FAFC', fontSize: 13 }}>
                "{brand.promptScreenMsg}"
              </Typography>

              {paymentMethod === 'card' ? (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder={t('paymentModal.otpPlaceholder')}
                    sx={{
                      bgcolor: '#1E293B',
                      borderRadius: 1.5,
                      input: { color: '#FFFFFF', letterSpacing: 2, fontWeight: 700, fontSize: 14, py: 1 },
                      flex: 1,
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 0.5, gap: 1.5 }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    {t('paymentModal.pin')}:
                  </Typography>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 1,
                      fontWeight: 800,
                      letterSpacing: 4,
                      color: brand.badgeBg,
                      fontSize: 16,
                    }}
                  >
                    {pinInput}
                  </Box>
                </Box>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 2, textAlign: 'center' }}>
              {brand.authInstruction}
            </Typography>

            {/* Simulation Action Button */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleApprove}
              sx={{
                bgcolor: brand.badgeBg,
                color: brand.badgeColor,
                fontWeight: 800,
                py: 1.3,
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                '&:hover': {
                  bgcolor: brand.accentColor,
                  color: brand.badgeColor,
                },
              }}
            >
              {paymentMethod === 'card'
                ? t('paymentModal.simulateCard')
                : t('paymentModal.simulateMtnOrange')}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1.5 }}>
              <SecurityIcon sx={{ fontSize: 13, color: '#16A34A' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {t('paymentModal.encryptionNotice')}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#16A34A', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {t('paymentModal.verifying')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('paymentModal.confirmingSwitch')}
            </Typography>
          </Box>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
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

            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', mb: 0.5 }}>
              {t('paymentModal.approved')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              XAF {amount.toLocaleString()}
            </Typography>

            <Chip
              label={`${t('paymentModal.ref')}: ${transactionRef}`}
              size="small"
              sx={{
                bgcolor: '#16A34A',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 12,
                mb: 2,
              }}
            />

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {t('paymentModal.finalizing')}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
