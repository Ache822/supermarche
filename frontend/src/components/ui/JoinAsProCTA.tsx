import { useRef } from 'react';
import { Box, Container, Typography, Chip, Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HelpIcon from '@mui/icons-material/Help';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * JoinAsProCTA Component — Partner & Service Provider Recruiting CTA Section
 * Clean 3-card benefit grid with glowing glassmorphic ambient blur background
 */
export function JoinAsProCTA() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.firstElementChild as HTMLElement;
      const scrollAmount = firstCard ? firstCard.clientWidth + 24 : 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box
      component="section"
      id="join-as-pro"
      sx={{
        position: 'relative',
        py: { xs: 8, md: 11 },
        overflow: 'hidden',
        backgroundImage:
          'linear-gradient(135deg, rgba(20, 12, 7, 0.94) 0%, rgba(35, 110, 50, 0.88) 100%), url("/images/pro_partner_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255, 107, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 107, 0, 0.3)',
      }}
    >
      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 4 }}>
          {/* Header Badge */}
          <Chip
            icon={<WorkIcon sx={{ color: '#FF6B00 !important', fontSize: '15px !important' }} />}
            label={t('pro.ctaChip', 'JOIN AS A SERVICE PROVIDER')}
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              bgcolor: 'rgba(255, 107, 0, 0.25)',
              color: '#FF6B00',
              border: '1px solid rgba(255, 107, 0, 0.4)',
              mb: 2,
              px: 0.5,
              py: 0.25,
            }}
          />

          {/* Heading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 30, sm: 40, md: 46 },
              fontWeight: 800,
              fontFamily: 'Space Grotesk, sans-serif',
              lineHeight: 1.15,
              color: '#FFFFFF',
              mb: 2,
              maxWidth: 760,
            }}
          >
            {t('pro.ctaTitle', 'Earn Steady Income as a Verified Service Provider')}
          </Typography>

          {/* Subtitle Description */}
          <Typography
            sx={{
              fontSize: { xs: 15, md: 17 },
              color: 'rgba(255, 255, 255, 0.88)',
              maxWidth: 640,
              lineHeight: 1.6,
            }}
          >
            {t('pro.ctaSubtitle', 'Are you a skilled technician, market procurement agent, or gas delivery expert in Cameroon? Join hundreds of active service providers getting daily dispatched jobs.')}
          </Typography>
        </Box>

        {/* Direction Arrows Bar (Visible on mobile view only when carousel is active) */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end', gap: 1, mb: 2.5 }}>
          <IconButton
            onClick={() => handleScroll('left')}
            aria-label="Scroll Carousel Left"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              '&:hover': { bgcolor: '#FF6B00', borderColor: '#FF6B00' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => handleScroll('right')}
            aria-label="Scroll Carousel Right"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              '&:hover': { bgcolor: '#FF6B00', borderColor: '#FF6B00' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Benefits Grid / Mobile Touch Carousel Container */}
        <Box
          ref={scrollRef}
          sx={{
            display: { xs: 'flex', sm: 'grid' },
            gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            overflowX: { xs: 'auto', sm: 'visible' },
            scrollSnapType: { xs: 'x mandatory', sm: 'none' },
            scrollPadding: '0 16px',
            pb: { xs: 2, sm: 0 },
            mb: 6,
            mx: { xs: -2, sm: 0 },
            px: { xs: 2, sm: 0 },
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {/* Benefit Card 1 */}
          <Box
            sx={{
              flex: { xs: '0 0 85%', sm: 'none' },
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always',
              minWidth: 0,
              p: 3.5,
              borderRadius: '20px',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: '#FF6B00',
                bgcolor: 'rgba(255, 255, 255, 0.12)',
              },
            }}
          >
            {/* Icon Wrapper */}
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                bgcolor: 'rgba(255, 107, 0, 0.2)',
                color: '#FF6B00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
              }}
            >
              <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
            </Box>
            {/* Benefit Title */}
            <Typography
              variant="h3"
              sx={{
                fontSize: 19,
                fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif',
                mb: 1,
                color: '#FFFFFF',
              }}
            >
              {t('pro.card1Title', 'Guaranteed Daily Payouts')}
            </Typography>
            {/* Benefit Description */}
            <Typography sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.55 }}>
              {t('pro.card1Desc', 'Receive instant transfers to your MTN Mobile Money or Orange Money account immediately after completing client jobs.')}
            </Typography>
          </Box>

          {/* Benefit Card 2 */}
          <Box
            sx={{
              flex: { xs: '0 0 85%', sm: 'none' },
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always',
              minWidth: 0,
              p: 3.5,
              borderRadius: '20px',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: '#FF6B00',
                bgcolor: 'rgba(255, 255, 255, 0.12)',
              },
            }}
          >
            {/* Icon Wrapper */}
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                bgcolor: 'rgba(255, 107, 0, 0.2)',
                color: '#FF6B00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 26 }} />
            </Box>
            {/* Benefit Title */}
            <Typography
              variant="h3"
              sx={{
                fontSize: 19,
                fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif',
                mb: 1,
                color: '#FFFFFF',
              }}
            >
              {t('pro.card2Title', 'Work on Your Schedule')}
            </Typography>
            {/* Benefit Description */}
            <Typography sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.55 }}>
              {t('pro.card2Desc', 'Choose your active availability hours and accept job dispatches in Bastos, Bonapriso, Molyko & Nkwen.')}
            </Typography>
          </Box>

          {/* Benefit Card 3 */}
          <Box
            sx={{
              flex: { xs: '0 0 85%', sm: 'none' },
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always',
              minWidth: 0,
              p: 3.5,
              borderRadius: '20px',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: '#FF6B00',
                bgcolor: 'rgba(255, 255, 255, 0.12)',
              },
            }}
          >
            {/* Icon Wrapper */}
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                bgcolor: 'rgba(255, 107, 0, 0.2)',
                color: '#FF6B00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 26 }} />
            </Box>
            {/* Benefit Title */}
            <Typography
              variant="h3"
              sx={{
                fontSize: 19,
                fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif',
                mb: 1,
                color: '#FFFFFF',
              }}
            >
              {t('pro.card3Title', 'Verified Provider Status')}
            </Typography>
            {/* Benefit Description */}
            <Typography sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.55 }}>
              {t('pro.card3Desc', 'Gain client trust with verified Supermarche provider badges, safety insurance coverage, and priority dispatch queues.')}
            </Typography>
          </Box>
        </Box>

        {/* Call-To-Action Group */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Primary CTA Link [Apply as Service Provider] */}
          <Button
            component={Link}
            to="/become-a-provider"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 15,
              px: 4,
              py: 1.4,
              borderRadius: '10px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#E05D00',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {t('pro.becomeProviderBtn', 'Become a Service Provider →')}
          </Button>

          {/* Secondary CTA Link [Provider Guide & FAQs] */}
          <Button
            component={Link}
            to="/become-a-provider"
            variant="outlined"
            size="large"
            startIcon={<HelpIcon />}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.4)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: 15,
              px: 3.5,
              py: 1.4,
              borderRadius: '10px',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#FF6B00',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {t('pro.guideFaqBtn', 'Provider Guide & FAQs')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
