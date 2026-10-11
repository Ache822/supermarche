import { useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import type { Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SEO } from '../../components/seo/SEO';
import { getOrganizationSchema, getBreadcrumbSchema } from '../../components/seo/schemas';

interface AboutPageProps {
  onOpenBooking?: () => void;
}

export function AboutPage({ onOpenBooking }: AboutPageProps) {
  const { t } = useTranslation();
  const principlesScrollRef = useRef<HTMLDivElement>(null);

  const handlePrinciplesScroll = (direction: 'left' | 'right') => {
    if (principlesScrollRef.current) {
      const firstChild = principlesScrollRef.current.firstElementChild as HTMLElement;
      const amount = firstChild ? firstChild.clientWidth + 24 : 300;
      principlesScrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  return (
    <Box sx={{ pb: 8 }}>
      <SEO
        title="About Kim's Store - Online Supermarket & Express Department Store"
        description="Learn about Kim's Store: Cameroon's premier online lifestyle & express department store for trending streetwear, sneakers, beauty cosmetics, electronics, and daily essentials."
        canonicalPath="/about"
        jsonLd={[orgSchema, breadcrumbSchema]}
      />

      {/* 1. Green Hero Banner Header with Background Image */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(135deg, rgba(20, 12, 7, 0.88) 0%, rgba(224, 93, 0, 0.85) 100%), url("/about_hero_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFFFFF',
          pt: { xs: 12, md: 16 },
          pb: { xs: 12, md: 16 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              opacity: 0.9,
              mb: 2,
            }}
          >
            {t('about.tag')}
          </Typography>

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: 30, sm: 42, md: 52 },
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              lineHeight: 1.15,
              maxWidth: 960,
              mb: 3,
              letterSpacing: '-0.02em',
            }}
          >
            {t('about.heroTitle')}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 16, md: 19 },
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.6,
              maxWidth: 780,
              opacity: 0.95,
            }}
          >
            {t('about.heroSubtitle')}
          </Typography>
        </Container>

        {/* Curved bottom transition separator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            height: 32,
            bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
            clipPath: 'ellipse(60% 100% at 50% 100%)',
          }}
        />
      </Box>

      {/* 2. Founding Story 2-Column Layout */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column Heading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 26, sm: 34, md: 38 },
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              lineHeight: 1.25,
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            {t('about.storyLeft')}
          </Typography>

          {/* Right Column Story Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography
              sx={{
                fontSize: 16,
                lineHeight: 1.7,
                color: 'text.secondary',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {t('about.storyP1')}
            </Typography>

            <Typography
              sx={{
                fontSize: 16,
                lineHeight: 1.7,
                color: 'text.secondary',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {t('about.storyP2')}
            </Typography>

            <Typography
              sx={{
                fontSize: 16,
                lineHeight: 1.7,
                color: 'text.secondary',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
              }}
            >
              {t('about.storyP3')}
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* 3. Principles Section ("WHAT WE STAND FOR") */}
      <Box sx={{ bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FAFAFA'), py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#FF6B00',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                {t('about.principlesTag')}
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 28, md: 38 },
                  fontWeight: 700,
                  fontFamily: 'Space Grotesk, sans-serif',
                  color: 'text.primary',
                }}
              >
                {t('about.principlesTitle')}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
              <IconButton
                onClick={() => handlePrinciplesScroll('left')}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
                  '&:hover': { bgcolor: '#FF6B00', color: '#FFFFFF', borderColor: '#FF6B00' },
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => handlePrinciplesScroll('right')}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
                  '&:hover': { bgcolor: '#FF6B00', color: '#FFFFFF', borderColor: '#FF6B00' },
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* 4 Cards Grid with Mobile Touch Carousel */}
          <Box
            ref={principlesScrollRef}
            sx={{
              display: { xs: 'flex', sm: 'grid' },
              gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
              overflowX: { xs: 'auto', sm: 'visible' },
              scrollSnapType: { xs: 'x mandatory', sm: 'none' },
              pb: { xs: 1.5, sm: 0 },
              mx: { xs: -2, sm: 0 },
              px: { xs: 2, sm: 0 },
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {/* 01 Trust First */}
            <Box
              sx={{
                flex: { xs: '0 0 85%', sm: 'none' },
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
                minWidth: 0,
                p: { xs: 3, md: 4 },
                borderRadius: '16px',
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
                border: '1px solid',
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#FFF4ED'),
                boxShadow: (theme: Theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : '0 4px 20px rgba(255, 107, 0, 0.08)',
              }}
            >
              <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 700, color: '#FF6B00', mb: 2 }}>
                01
              </Typography>
              <Typography variant="h3" sx={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', mb: 1.5 }}>
                {t('about.p1Title')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
                {t('about.p1Desc')}
              </Typography>
            </Box>

            {/* 02 No Surprises */}
            <Box
              sx={{
                flex: { xs: '0 0 85%', sm: 'none' },
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
                minWidth: 0,
                p: { xs: 3, md: 4 },
                borderRadius: '16px',
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
                border: '1px solid',
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#FFF4ED'),
                boxShadow: (theme: Theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : '0 4px 20px rgba(255, 107, 0, 0.08)',
              }}
            >
              <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 700, color: '#FF6B00', mb: 2 }}>
                02
              </Typography>
              <Typography variant="h3" sx={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', mb: 1.5 }}>
                {t('about.p2Title')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
                {t('about.p2Desc')}
              </Typography>
            </Box>

            {/* 03 Fair to Providers */}
            <Box
              sx={{
                flex: { xs: '0 0 85%', sm: 'none' },
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
                minWidth: 0,
                p: { xs: 3, md: 4 },
                borderRadius: '16px',
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
                border: '1px solid',
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#FFF4ED'),
                boxShadow: (theme: Theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : '0 4px 20px rgba(255, 107, 0, 0.08)',
              }}
            >
              <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 700, color: '#FF6B00', mb: 2 }}>
                03
              </Typography>
              <Typography variant="h3" sx={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', mb: 1.5 }}>
                {t('about.p3Title')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
                {t('about.p3Desc')}
              </Typography>
            </Box>

            {/* 04 Built for Cameroon */}
            <Box
              sx={{
                flex: { xs: '0 0 85%', sm: 'none' },
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
                minWidth: 0,
                p: { xs: 3, md: 4 },
                borderRadius: '16px',
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
                border: '1px solid',
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#FFF4ED'),
                boxShadow: (theme: Theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : '0 4px 20px rgba(255, 107, 0, 0.08)',
              }}
            >
              <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 700, color: '#FF6B00', mb: 2 }}>
                04
              </Typography>
              <Typography variant="h3" sx={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', mb: 1.5 }}>
                {t('about.p4Title')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
                {t('about.p4Desc')}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 4. Careers Callout Banner Card ("Want to build this with us?") */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box
          sx={{
            p: { xs: 5, md: 8 },
            borderRadius: '24px',
            bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
            border: '1px solid',
            borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#C4E8C9'),
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 26, md: 36 },
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              color: 'text.primary',
            }}
          >
            {t('about.ctaTitle')}
          </Typography>

          <Typography
            sx={{
              fontSize: 16,
              color: 'text.secondary',
              fontFamily: 'Inter, sans-serif',
              maxWidth: 500,
            }}
          >
            {t('about.ctaSubtitle')}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onOpenBooking}
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 2,
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              fontSize: 15,
              borderRadius: '10px',
              boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
              '&:hover': { bgcolor: '#E05D00' },
            }}
          >
            {t('about.ctaBtn')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
