import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Chip,
  InputBase,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import type { Theme } from '@mui/material';
import { Link } from 'react-router-dom';
import { SupermarcheLogo } from '../ui/SupermarcheLogo';
import { GooglePlayBadge, AppStoreBadge } from '../ui/StoreBadges';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

interface FooterProps {
  mode: 'light' | 'dark';
  onOpenBooking?: (serviceId?: string) => void;
}

export function Footer({ mode, onOpenBooking }: FooterProps) {
  const { t } = useTranslation();
  const isDark = mode === 'dark';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (cleanEmail && cleanEmail.includes('@')) {
      try {
        await api.post('/newsletter/subscribe', { email: cleanEmail });
      } catch {
        try {
          await api.post('/campaigns/subscribe', { email: cleanEmail });
        } catch {
          // Graceful error handling
        }
      }
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isDark ? '#140C07' : '#662600',
        color: '#FFF4ED',
        pt: 8,
        pb: 4,
        mt: 8,
        borderTop: (theme: Theme) => `1px solid ${theme.palette.mode === 'dark' ? '#3A2316' : '#8F3800'}`,
      }}
    >
      <Container maxWidth="lg">
        {/* Newsletter Subscription Section */}
        <Box
          sx={{
            mb: 6,
            p: { xs: 3, md: 4 },
            borderRadius: '20px',
            background: isDark
              ? 'linear-gradient(135deg, rgba(224, 93, 0, 0.45) 0%, rgba(31, 20, 12, 0.9) 100%)'
              : 'linear-gradient(135deg, #2D1A10 0%, #1A0F09 100%)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 107, 0, 0.35)' : 'rgba(255, 107, 0, 0.45)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Box sx={{ maxWidth: 520 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: '#FF6B00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
                }}
              >
                <EmailIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: 18, md: 22 },
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                }}
              >
                {t('newsletter.title', 'Subscribe to Supermarche Newsletter')}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13.5, color: '#FFC4A8', lineHeight: 1.5 }}>
              {t('newsletter.subtitle', 'Get instant updates on service launches, regional promo codes & exclusive mobile money discounts across Douala, Yaoundé, Bamenda & Buea.')}
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubscribe}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              p: 0.8,
              border: '1px solid',
              borderColor: subscribed ? '#FF6B00' : 'rgba(255, 196, 168, 0.25)',
              transition: 'all 0.3s ease',
              width: { xs: '100%', md: 'auto' },
              minWidth: { md: 400 },
              '&:focus-within': {
                borderColor: '#FF6B00',
                boxShadow: '0 0 0 3px rgba(255, 107, 0, 0.25)',
              },
            }}
          >
            {subscribed ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  color: '#FF6B00',
                  fontWeight: 700,
                  fontSize: 14,
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 20 }} />
                {t('newsletter.success', 'Subscribed successfully! Welcome aboard.')}
              </Box>
            ) : (
              <>
                <InputBase
                  placeholder={t('newsletter.placeholder', 'Enter your email address...')}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    ml: 1.5,
                    flex: 1,
                    color: '#FFFFFF',
                    fontSize: 14,
                    '& input::placeholder': {
                      color: 'rgba(255, 196, 168, 0.65)',
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    bgcolor: '#FF6B00',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 13,
                    px: 3,
                    py: 1.2,
                    borderRadius: '10px',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(255, 107, 0, 0.4)',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: '#E05D00',
                      boxShadow: '0 6px 18px rgba(255, 107, 0, 0.5)',
                    },
                  }}
                >
                  {t('newsletter.button', 'Subscribe')}
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* PRE-SHIPMENT CHECKLIST NOTICE:
             - Support WhatsApp link: Replace REPLACE_WITH_NUMBER with official WhatsApp phone number (e.g. 237670000000)
             - App Store / Google Play links: Replace href="#" with official published store links
             - Legal Links (Terms, Privacy, Cancellation): Replace href="#" with live legal page URLs
             - Social links (Instagram, Facebook, X): Replace href="#" with official social profile handles
        */}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.8fr 1.2fr 1.3fr 1.3fr' },
            gap: 3.5,
            mb: 4,
          }}
        >
          {/* Column 1: Brand Info & App Badges */}
          <Box>
            <Box sx={{ mb: 2 }}>
              <SupermarcheLogo size={44} />
            </Box>
            <Typography sx={{ fontSize: 13, color: '#FFC4A8', mb: 2.5, lineHeight: 1.6, maxWidth: 260 }}>
              {t('footer.description')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#FFA27B', flexWrap: 'wrap', mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 11 }}>
                <ShieldIcon sx={{ fontSize: 14 }} /> {t('footer.insured', '100% Insured')}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 11 }}>
                <VerifiedUserIcon sx={{ fontSize: 14 }} /> {t('footer.vetted', 'Vetted Staff')}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 11 }}>
                <LocalShippingIcon sx={{ fontSize: 14 }} /> {t('footer.express', 'Express Radar')}
              </Box>
            </Box>

            {/* Download Badges (App Store & Google Play) */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* TODO: Add real App Store and Google Play URLs once published */}
              <GooglePlayBadge size="small" />
              <AppStoreBadge size="small" />
            </Box>
          </Box>

          {/* Desktop & Tablet Navigation Columns (Visible on sm 600px+) */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'contents' },
            }}
          >
            {/* Column 2: Company & Navigation */}
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#FFFFFF',
                  mb: 2,
                }}
              >
                {t('footer.colCompany', 'Company')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: 13, color: '#FFC4A8' }}>
                <Box component={Link} to="/shop" sx={{ color: '#FFC4A8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}>
                  Explore Marketplace Store
                </Box>
                <Box component={Link} to="/about" sx={{ color: '#FFC4A8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}>
                  {t('footer.aboutUs', 'About Us')}
                </Box>
                <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}>
                  {t('footer.contact', 'Contact')}
                </Box>
              </Box>
            </Box>

            {/* Column 5: Support & Contact */}
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#FFFFFF',
                  mb: 2,
                }}
              >
                {t('footer.colSupport', 'Support')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: 13, color: '#FFC4A8', mb: 2 }}>
                <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}>
                  {t('footer.helpCenter', 'Help Center')}
                </Box>
                <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}>
                  {t('footer.termsOfService', 'Terms of Service')}
                </Box>
                <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}>
                  {t('footer.privacyPolicy', 'Privacy Policy')}
                </Box>
                <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}>
                  {t('footer.cancellationPolicy', 'Cancellation Policy')}
                </Box>
              </Box>

              {/* Contact Us Phone Hotlines Box */}
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: '12px',
                  bgcolor: isDark ? 'rgba(224, 93, 0, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 107, 0, 0.35)' : 'rgba(255, 196, 168, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#FFA27B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 13 }} /> {t('footer.contactUs', 'Contact Us:')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box
                      component="a"
                      href="mailto:info@supermarche.com"
                      sx={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 700, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      info@supermarche.com
                    </Box>
                    <Box
                      component="a"
                      href="mailto:info@supermarche.com"
                      title="Send Email (info@supermarche.com)"
                      sx={{ color: '#FF6B00', display: 'inline-flex', p: 0.4 }}
                    >
                      <EmailIcon sx={{ fontSize: 15 }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box
                      component="a"
                      href="tel:+237681891467"
                      sx={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 700, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      +237 681 891 467
                    </Box>
                    <Box
                      component="a"
                      href="tel:+237681891467"
                      title="Direct Phone Call (+237 681 891 467)"
                      sx={{ color: '#FF6B00', display: 'inline-flex', p: 0.4 }}
                    >
                      <PhoneIcon sx={{ fontSize: 15 }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box
                      component="a"
                      href="tel:+237697984955"
                      sx={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 700, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      +237 697 984 955
                    </Box>
                    <Box
                      component="a"
                      href="tel:+237697984955"
                      title="Direct Phone Call (+237 697 984 955)"
                      sx={{ color: '#FF6B00', display: 'inline-flex', p: 0.4 }}
                    >
                      <PhoneIcon sx={{ fontSize: 15 }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Mobile Collapsible Dropdown Accordions (Visible ONLY on xs < 600px) */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1, gridColumn: 'span 1' }}>
            {/* Accordion 1: Company */}
            <Accordion
              elevation={0}
              sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 196, 168,0.15)',
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FF6B00' }} />}>
                <Typography sx={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>
                  {t('footer.colCompany', 'Company')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, fontSize: 13, color: '#FFC4A8' }}>
                  <Box onClick={() => onOpenBooking?.()} sx={{ color: '#FFC4A8', cursor: 'pointer' }}>
                    {t('footer.exploreServices', 'Explore All Services')}
                  </Box>
                  <Box component={Link} to="/about" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.aboutUs', 'About Us')}
                  </Box>
                  <Box component={Link} to="/about" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.careers', 'Careers')}
                  </Box>
                  <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.contact', 'Contact')}
                  </Box>
                  <Typography sx={{ color: 'rgba(255, 196, 168, 0.7)', fontSize: 12 }}>
                    {t('footer.blogComingSoon', 'Blog (coming soon)')}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 2: For Service Providers */}
            <Accordion
              elevation={0}
              sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 196, 168,0.15)',
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FF6B00' }} />}>
                <Typography sx={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>
                  {t('footer.colProviders', 'For Service Providers')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, fontSize: 13, color: '#FFC4A8' }}>
                  <Box component={Link} to="/become-a-provider" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.becomeProvider', 'Become a Service Provider')}
                  </Box>
                  <Box component={Link} to="/become-a-provider" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.providerVetting', 'Provider Vetting & ID Check')}
                  </Box>
                  <Box component={Link} to="/become-a-provider" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.providerPayouts', 'Provider Payout Schedules')}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 3: Support & Contact Us */}
            <Accordion
              elevation={0}
              sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 196, 168,0.15)',
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FF6B00' }} />}>
                <Typography sx={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>
                  {t('footer.colSupport', 'Support')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, fontSize: 13, color: '#FFC4A8', mb: 2 }}>
                  <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.helpCenter', 'Help Center')}
                  </Box>
                  <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.termsOfService', 'Terms of Service')}
                  </Box>
                  <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.privacyPolicy', 'Privacy Policy')}
                  </Box>
                  <Box component={Link} to="/help" sx={{ color: '#FFC4A8', textDecoration: 'none' }}>
                    {t('footer.cancellationPolicy', 'Cancellation Policy')}
                  </Box>
                </Box>

                {/* Direct Phone Call Hotlines */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '10px',
                    bgcolor: 'rgba(255, 107, 0, 0.15)',
                    border: '1px solid rgba(255, 107, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#FFA27B', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <PhoneIcon sx={{ fontSize: 13 }} /> {t('footer.contactUs', 'Contact Us:')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box component="a" href="mailto:info@supermarche.com" sx={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}>
                        info@supermarche.com
                      </Box>
                      <Box component="a" href="mailto:info@supermarche.com" sx={{ color: '#FF6B00', display: 'inline-flex' }}>
                        <EmailIcon sx={{ fontSize: 15 }} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box component="a" href="tel:+237681891467" sx={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}>
                        +237 681 891 467
                      </Box>
                      <Box component="a" href="tel:+237681891467" sx={{ color: '#FF6B00', display: 'inline-flex' }}>
                        <PhoneIcon sx={{ fontSize: 15 }} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box component="a" href="tel:+237697984955" sx={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}>
                        +237 697 984 955
                      </Box>
                      <Box component="a" href="tel:+237697984955" sx={{ color: '#FF6B00', display: 'inline-flex' }}>
                        <PhoneIcon sx={{ fontSize: 15 }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>

        {/* Payment Method Badges Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: 13,
            color: '#FFC4A8',
            mb: 3,
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontSize: 13, color: '#FFA27B', fontWeight: 600 }}>{t('footer.weAccept', 'We accept:')}</Typography>
          <Chip
            label="MTN Mobile Money"
            size="small"
            sx={{ bgcolor: '#FFCC00', color: '#000000', fontWeight: 800, fontSize: 11, borderRadius: '12px' }}
          />
          <Chip
            label="Orange Money"
            size="small"
            sx={{ bgcolor: '#FF6600', color: '#FFFFFF', fontWeight: 800, fontSize: 11, borderRadius: '12px' }}
          />
          <Chip
            icon={
              <Box
                component="svg"
                width="22"
                height="15"
                viewBox="0 0 36 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                sx={{ display: 'block', borderRadius: '3px' }}
              >
                <rect width="36" height="24" rx="3" fill="#1A1A1A" />
                <circle cx="13" cy="12" r="7" fill="#EB001B" />
                <circle cx="23" cy="12" r="7" fill="#F79E1B" />
                <path
                  d="M18 6.784A6.974 6.974 0 0 1 20.655 12 6.974 6.974 0 0 1 18 17.216 6.974 6.974 0 0 1 15.345 12 6.974 6.974 0 0 1 18 6.784Z"
                  fill="#FF5F00"
                />
              </Box>
            }
            label="Mastercard"
            size="small"
            sx={{
              bgcolor: '#141414',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 11,
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              pl: 0.5,
              '& .MuiChip-icon': {
                ml: 0.5,
                mr: -0.25,
              },
            }}
          />
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

        {/* Footer Bottom Bar Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 12.5, color: '#FFA27B', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 12.5, color: '#FFA27B' }}>
              © {new Date().getFullYear()} Supermarche. {t('footer.rightsReserved', 'All rights reserved.')}
            </Typography>
            <Typography sx={{ color: '#8F5424' }}>·</Typography>
            {/* TODO: Replace placeholder href="#" links with actual Terms and Privacy pages */}
            <Box component={Link} to="/help" sx={{ color: '#FFA27B', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}>
              {t('footer.terms', 'Terms')}
            </Box>
            <Typography sx={{ color: '#8F5424' }}>·</Typography>
            <Box component={Link} to="/help" sx={{ color: '#FFA27B', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}>
              {t('footer.privacy', 'Privacy')}
            </Box>
            <Typography sx={{ color: '#8F5424' }}>·</Typography>
            <Box component={Link} to="/admin" sx={{ color: '#8F5424', textDecoration: 'none', fontSize: 11, '&:hover': { color: '#FF6B00' } }}>
              {t('footer.operatorPortal', 'Operator Portal')}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#FFC4A8' }}>
              {t('footer.madeInCameroon', 'Made in Cameroon 🇨🇲')}
            </Typography>

            {/* Social Media Icon Links */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#FFA27B' }}>
              <Box
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                sx={{ color: '#FFA27B', display: 'flex', '&:hover': { color: '#FF6B00' } }}
              >
                <InstagramIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                sx={{ color: '#FFA27B', display: 'flex', '&:hover': { color: '#FF6B00' } }}
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                sx={{ color: '#FFA27B', display: 'flex', '&:hover': { color: '#FF6B00' } }}
              >
                <TwitterIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
