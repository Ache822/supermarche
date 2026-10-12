import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../../components/ui/useReveal';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Paper,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import type { Theme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExploreIcon from '@mui/icons-material/Explore';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SwipeIcon from '@mui/icons-material/Swipe';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Link, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { DEFAULT_SERVICES } from '../../store/servicesSlice';
import { setTestimonials } from '../admin/store/adminSlice';
import type { Testimonial } from '../admin/types/admin.types';
import api from '../../api/client';
import type { ServiceItem } from '../../types';
import socketClient from '../../api/socketClient';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/useToast';
import { BamboGuide } from '../../components/ui/BamboGuide';
import { SupermarcheIcon } from '../../components/ui/SupermarcheLogo';
import { ServiceDetailModal } from '../../components/ui/ServiceDetailModal';
import { SubmitReviewModal } from '../../components/ui/SubmitReviewModal';
import { SEO } from '../../components/seo/SEO';
import { getLocalBusinessSchema, getOrganizationSchema, getWebSiteSchema } from '../../components/seo/schemas';


import { SectionBadge } from '../../components/ui/SectionBadge';
import { HeroDepartmentShowcase } from './components/HeroDepartmentShowcase';

interface LandingPageProps {
  onOpenBookingWithService: (serviceId?: string) => void;
  onOpenLiveChat?: () => void;
}

const partnerLogos = [
  'Nike',
  'Zara',
  'Apple',
  'Samsung',
  'CeraVe',
  "L'Oréal Paris",
  'Adidas',
  'The Ordinary',
  'Sony',
  'MTN MoMo',
  'Orange Money',
  'DHL Express CM',
];

export function LandingPage({ onOpenBookingWithService, onOpenLiveChat }: LandingPageProps) {
  const navigate = useNavigate();
  const [trackOrderModalOpen, setTrackOrderModalOpen] = useState(false);
  const [trackOrderInput, setTrackOrderInput] = useState('');
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { addToCart } = useCart();
  const toast = useToast();
  const { items: services } = useAppSelector((state) => state.services);

  const getCleanPlainText = (text?: string): string => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getLocalizedService = (srv: ServiceItem) => {
    const prodTitleKey = `shop.products.${srv.id}.title`;
    const prodDescKey = `shop.products.${srv.id}.desc`;
    const hasProdTitle = i18n.exists(prodTitleKey);
    const hasProdDesc = i18n.exists(prodDescKey);

    const title = hasProdTitle ? t(prodTitleKey) : srv.title;
    const rawDesc = hasProdDesc
      ? t(prodDescKey)
      : (srv.shortDescription || srv.description || '');
    const cleanDesc = getCleanPlainText(rawDesc);

    switch (srv.id) {
      case 'srv-clothes':
        return {
          ...srv,
          title: t('services.clothesTitle', { defaultValue: title }),
          categoryLabel: t('catalog.filterClothes', { defaultValue: srv.categoryLabel || '' }),
          description: t('services.clothesDesc', { defaultValue: cleanDesc }),
          shortDescription: t('services.clothesDesc', { defaultValue: cleanDesc }),
          estimatedTime: i18n.language === 'fr' ? '15 – 30 min livraison campus' : srv.estimatedTime,
        };
      case 'srv-shoes':
        return {
          ...srv,
          title: t('services.shoesTitle', { defaultValue: title }),
          categoryLabel: t('catalog.filterShoes', { defaultValue: srv.categoryLabel || '' }),
          description: t('services.shoesDesc', { defaultValue: cleanDesc }),
          shortDescription: t('services.shoesDesc', { defaultValue: cleanDesc }),
          estimatedTime: i18n.language === 'fr' ? 'Livraison express le jour même' : srv.estimatedTime,
        };
      case 'srv-cosmetics':
        return {
          ...srv,
          title: t('services.cosmeticsTitle', { defaultValue: title }),
          categoryLabel: t('catalog.filterCosmetics', { defaultValue: srv.categoryLabel || '' }),
          description: t('services.cosmeticsDesc', { defaultValue: cleanDesc }),
          shortDescription: t('services.cosmeticsDesc', { defaultValue: cleanDesc }),
          estimatedTime: i18n.language === 'fr' ? '20 – 40 min' : srv.estimatedTime,
        };
      case 'srv-tech':
        return {
          ...srv,
          title: t('services.techTitle', { defaultValue: title }),
          categoryLabel: t('catalog.filterTech', { defaultValue: srv.categoryLabel || '' }),
          description: t('services.techDesc', { defaultValue: cleanDesc }),
          shortDescription: t('services.techDesc', { defaultValue: cleanDesc }),
          estimatedTime: i18n.language === 'fr' ? '30 min express' : srv.estimatedTime,
        };
      case 'srv-snacks':
        return {
          ...srv,
          title: t('services.snacksTitle', { defaultValue: title }),
          categoryLabel: t('catalog.filterSnacks', { defaultValue: srv.categoryLabel || '' }),
          description: t('services.snacksDesc', { defaultValue: cleanDesc }),
          shortDescription: t('services.snacksDesc', { defaultValue: cleanDesc }),
          estimatedTime: i18n.language === 'fr' ? '15 min express' : srv.estimatedTime,
        };
      default:
        return {
          ...srv,
          title,
          description: cleanDesc,
          shortDescription: cleanDesc,
        };
    }
  };

  const getLocalizedTestimonialBadge = (serviceUsed?: string) => {
    if (!serviceUsed) return t('reviews.serviceGeneral', 'General Support');
    if (serviceUsed.includes('Student') || serviceUsed.includes('School')) {
      return t('reviews.serviceStudentErrand', serviceUsed);
    }
    if (serviceUsed.includes('Gas')) {
      return t('reviews.serviceGasDelivery', serviceUsed);
    }
    if (serviceUsed.includes('Cleaning')) {
      return t('reviews.serviceCleaning', serviceUsed);
    }
    return serviceUsed;
  };

  const regionSlides = [
    {
      id: 'yaounde',
      city: 'Yaoundé',
      hubName: t('regions.yaoundeHub', 'Yaoundé Hub'),
      districts: t('regions.yaoundeDistricts', 'Bastos • Omnisports • Santa Barbara • Central'),
      badge: 'CAPITAL DISPATCH HUB',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      description: 'Ultra-fast cooking gas refills and concierge dispatch across Bastos, Omnisports, and Ndomo.',
      badgeText: t('regions.yaoundeBadge', 'Yaoundé Hub: Bastos & Omnisports Express Coverage'),
      eta: t('regions.averageArrival', '25-30 Mins Average Arrival', { mins: '25-30' }),
    },
    {
      id: 'douala',
      city: 'Douala',
      hubName: t('regions.doualaHub', 'Douala Hub'),
      districts: t('regions.doualaDistricts', 'Bonapriso • Akwa • Bonanjo • Deido'),
      badge: 'ECONOMIC METROPOLIS',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
      description: 'Express port delivery, fresh market errands, and home services in Bonapriso, Akwa, and Deido.',
      badgeText: t('regions.doualaBadge', 'Douala Hub: Bonapriso & Akwa Express Coverage'),
      eta: t('regions.averageArrival', '20-25 Mins Average Arrival', { mins: '20-25' }),
    },
    {
      id: 'bamenda',
      city: 'Bamenda',
      hubName: t('regions.bamendaHub', 'Bamenda Hub'),
      districts: t('regions.bamendaDistricts', 'Commercial Ave • Nkwen • Up Station District'),
      badge: 'NORTHWEST HUB',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
      description: 'Reliable errand runners and logistics support across Commercial Avenue and Nkwen.',
      badgeText: t('regions.bamendaBadge', 'Bamenda Hub: Commercial Ave & Nkwen Coverage'),
      eta: t('regions.averageArrival', '30-35 Mins Average Arrival', { mins: '30-35' }),
    },
    {
      id: 'buea',
      city: 'Buea',
      hubName: t('regions.bueaHub', 'Buea Hub'),
      districts: t('regions.bueaDistricts', 'Clerks Quarters • Molyko • Great Soppo Area'),
      badge: 'SOUTHWEST HUB',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      description: 'Fast student and residential delivery services connecting Molyko and Great Soppo.',
      badgeText: t('regions.bueaBadge', 'Buea Hub: Molyko & Clerks Quarters Coverage'),
      eta: t('regions.averageArrival', '25-30 Mins Average Arrival', { mins: '25-30' }),
    },
  ];

  const [activeRegionIndex, setActiveRegionIndex] = useState(0);
  const [isAutoSwapping, setIsAutoSwapping] = useState(true);
  const testimonialsCarouselRef = useRef<HTMLDivElement>(null);

  const handleTestimonialsScroll = (direction: 'left' | 'right') => {
    if (testimonialsCarouselRef.current) {
      const firstChild = testimonialsCarouselRef.current.firstElementChild as HTMLElement;
      const amount = firstChild ? firstChild.clientWidth + 24 : 320;
      testimonialsCarouselRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  // Scroll to top on mount (fallback for React Router navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Fetch approved customer testimonials on mount + real-time WebSocket / BroadcastChannel sync & polling
  useEffect(() => {
    let isMounted = true;

    const fetchTestimonials = () => {
      api.testimonials
        .getFeatured()
        .then((res: unknown) => {
          if (!isMounted) return;
          const list = (Array.isArray(res) ? res : (res as { data?: Testimonial[] })?.data || []) as Testimonial[];
          if (list.length > 0) {
            dispatch(setTestimonials(list));
          } else {
            api.testimonials.getAdminList('APPROVED').then((adminRes: unknown) => {
              if (!isMounted) return;
              const adminList = (Array.isArray(adminRes) ? adminRes : (adminRes as { data?: Testimonial[] })?.data || []) as Testimonial[];
              if (adminList.length > 0) {
                dispatch(setTestimonials(adminList));
              }
            }).catch(() => {});
          }
        })
        .catch(() => {
          api.testimonials.getAdminList('APPROVED').then((adminRes: unknown) => {
            if (!isMounted) return;
            const adminList = (Array.isArray(adminRes) ? adminRes : (adminRes as { data?: Testimonial[] })?.data || []) as Testimonial[];
            if (adminList.length > 0) {
              dispatch(setTestimonials(adminList));
            }
          }).catch(() => {});
        });
    };

    fetchTestimonials();

    // Listen to real-time events from socketClient / BroadcastChannel across browser tabs
    const unsubscribe = socketClient.on('testimonial_updated', () => {
      fetchTestimonials();
    });

    // 10-second polling fallback
    const interval = setInterval(fetchTestimonials, 10000);

    return () => {
      isMounted = false;
      unsubscribe();
      clearInterval(interval);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isAutoSwapping) return;
    const timer = setInterval(() => {
      setActiveRegionIndex((prev: number) => (prev + 1) % regionSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoSwapping, regionSlides.length]);

  // Scroll-reveal refs for each section below the hero
  const [regionSectionRef, isRegionVisible] = useReveal<HTMLDivElement>(0.1);
  const [logoStripRef, isLogoVisible] = useReveal<HTMLDivElement>(0.15);
  const [phoneShowcaseRef, isShowcaseVisible] = useReveal<HTMLDivElement>(0.1);
  const [servicesCatalogRef, isCatalogVisible] = useReveal<HTMLDivElement>(0.08);
  const [testimonialsRef, isTestimonialsVisible] = useReveal<HTMLDivElement>(0.1);
  const [downloadSectionRef, isDownloadVisible] = useReveal<HTMLDivElement>(0.12);
  const [faqSectionRef, isFaqVisible] = useReveal<HTMLDivElement>(0.1);

  const [selectedDetailService, setSelectedDetailService] = useState<ServiceItem | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const homeServicesCarouselRef = useRef<HTMLDivElement>(null);



  const reduxTestimonials = useAppSelector((state) => state.admin.testimonials || []);

  // Display testimonials where status === 'APPROVED' or isFeatured === true in Redux
  const approvedFeaturedTestimonials = reduxTestimonials.filter(
    (t) => t.status === 'APPROVED' || t.isFeatured === true
  );

  const handleScrollHomeServicesCarousel = (direction: 'left' | 'right') => {
    if (homeServicesCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -290 : 290;
      homeServicesCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const localBusinessSchema = getLocalBusinessSchema();
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();

  return (
    <Box>
      <SEO
        title="On-Demand Express Delivery & Everyday Services in Cameroon"
        description="Order fast cooking gas refills, fresh market shopping, and home services in Yaoundé & Douala with Supermarche. Reliable on-demand express delivery & concierge platform."
        canonicalPath="/"
        jsonLd={[localBusinessSchema, orgSchema, websiteSchema]}
      />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          background: (theme: Theme) =>
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 50% 0%, #291A10 0%, #140C07 70%)'
              : 'radial-gradient(circle at 50% 0%, #FFF4ED 0%, #FFFFFF 70%)',
          borderBottom: (theme: Theme) => `1px solid ${theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'}`,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
              gap: 6,
              alignItems: 'center',
            }}
          >
            {/* Hero Left Column */}
            <Box>
              <Box className="bb-hero-chip" sx={{ mb: 2 }}>
                <SectionBadge label={t('hero.chip')} />
              </Box>

              <Typography
                variant="h1"
                component="h1"
                className="bb-hero-title"
                sx={{
                  fontSize: { xs: 26, sm: 34, md: 40 },
                  fontWeight: 800,
                  fontFamily: 'Space Grotesk, sans-serif',
                  lineHeight: 1.15,
                  mb: 2,
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                }}
              >
                {t('hero.title')}
              </Typography>

              <Typography
                className="bb-hero-subtitle"
                sx={{
                  fontSize: { xs: 14, sm: 15, md: 16 },
                  color: 'text.secondary',
                  mb: 3.5,
                  lineHeight: 1.55,
                  maxWidth: 500,
                }}
              >
                {t('hero.subtitle')}
              </Typography>

              {/* Action Buttons */}
              <Box className="bb-hero-cta" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
                <Button
                  component={Link}
                  to="/shop"
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBagIcon />}
                  sx={{
                    bgcolor: '#FF6B00',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    px: { xs: 2.5, sm: 3.5 },
                    py: 1.5,
                    fontSize: { xs: 15, sm: 16 },
                    borderRadius: '8px',
                    width: { xs: '100%', sm: 'auto' },
                    boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
                    '&:hover': { bgcolor: '#E05D00' },
                  }}
                >
                  Shop Store Catalog
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  href="#services-catalog"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'text.primary',
                    fontWeight: 600,
                    px: { xs: 2.5, sm: 3 },
                    py: 1.5,
                    fontSize: { xs: 14, sm: 15 },
                    borderRadius: '8px',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.12)' : 'rgba(255, 107, 0, 0.06)'),
                    },
                  }}
                >
                  {t('hero.exploreServices')}
                </Button>
              </Box>

              {/* Trust Badge Indicators */}
              <Box className="bb-hero-stats bb-stagger" sx={{ display: 'flex', gap: { xs: 2.5, sm: 4 }, flexWrap: 'wrap', pt: 2, borderTop: (theme: Theme) => `1px dashed ${theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'}` }}>
                <Box>
                  <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: { xs: 18, sm: 20 }, fontWeight: 700, color: '#FF6B00' }}>
                    98%
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{t('hero.statVerified')}</Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: { xs: 18, sm: 20 }, fontWeight: 700, color: '#FF6B00' }}>
                    30 Mins
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{t('hero.statGas')}</Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: { xs: 18, sm: 20 }, fontWeight: 700, color: '#FF6B00' }}>
                    4.8 / 5
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{t('hero.statRating')}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Hero Right Column: Flagship Department Interactive Showcase */}
            <Box className="bb-hero-right" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <HeroDepartmentShowcase />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Partner Logo Continuous Marquee Strip */}
      <Box
        ref={logoStripRef}
        className={`bb-reveal bb-reveal-up ${isLogoVisible ? 'is-visible' : ''}`}
        sx={{
          py: 2.5,
          bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFF4ED'),
          borderBottom: (theme: Theme) => `1px solid ${theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'}`,
          overflow: 'hidden',
          position: 'relative',
          userSelect: 'none',
        }}
      >
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Fixed Label on Left */}
          <Typography
            sx={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 11,
              fontWeight: 700,
              color: 'text.disabled',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              pr: 2.5,
              borderRight: (theme: Theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(58, 35, 22, 0.7)' : '#E2E8F0'}`,
            }}
          >
            Curated Brands & Express Rails:
          </Typography>

          {/* Continuous Moving Infinite Marquee */}
          <Box
            sx={{
              overflow: 'hidden',
              width: '100%',
              position: 'relative',
              maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                width: 'max-content',
                animation: 'bb-marquee 20s linear infinite',
                '&:hover': {
                  animationPlayState: 'paused',
                },
              }}
            >
              {[...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, idx) => (
                <Box
                  key={`${logo}-${idx}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      color: 'text.secondary',
                      letterSpacing: '-0.02em',
                      transition: 'color 0.2s ease',
                      '&:hover': { color: '#FF6B00' },
                    }}
                  >
                    {logo}
                  </Typography>
                  <Typography sx={{ color: '#FF6B00', fontSize: 14, opacity: 0.5 }}>✦</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 30-Second Phone Showcase Interactive Frame Sequence Section ("See it in action") */}
      <Box
        ref={phoneShowcaseRef}
        className={`bb-reveal bb-reveal-up ${isShowcaseVisible ? 'is-visible' : ''}`}
        sx={{
          position: 'relative',
          zIndex: 2,
          py: { xs: 8, md: 11 },
          my: { xs: 0, md: 4 },
          bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
          borderTop: (theme: Theme) => `1px solid ${theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'}`,
          borderBottom: (theme: Theme) => `1px solid ${theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'}`,
          overflow: 'visible',
        }}
      >
        <Container maxWidth="lg" sx={{ overflow: 'visible' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' },
              gap: { xs: 5, md: 6 },
              alignItems: 'center',
              overflow: 'visible',
            }}
          >
            {/* Left Column Copy */}
            <Box sx={{ zIndex: 4, position: 'relative' }}>
              <Box sx={{ mb: 2.5 }}>
                <SectionBadge label={t('showcase.chip')} />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 32, sm: 42, md: 48 },
                  fontWeight: 700,
                  fontFamily: 'Space Grotesk, sans-serif',
                  lineHeight: 1.15,
                  mb: 2.5,
                  color: 'text.primary',
                }}
              >
                {t('showcase.title')}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 16, md: 18 },
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  maxWidth: 520,
                  mb: 4,
                }}
              >
                {t('showcase.subtitle')}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/shop"
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBagIcon />}
                  sx={{
                    bgcolor: '#FF6B00',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.4,
                    fontSize: 15,
                    borderRadius: '10px',
                    boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
                    '&:hover': { bgcolor: '#E05D00' },
                  }}
                >
                  Shop Kim's Store
                </Button>
              </Box>
            </Box>

            {/* Right Column Supermarket Digital Showcase Card */}
            <Box
              sx={{
                display: 'flex',
                justify: 'center',
                position: 'relative',
                zIndex: 3,
                width: '100%',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  width: '100%',
                  maxWidth: 580,
                  borderRadius: '24px',
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1C1724' : '#FFFFFF'),
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#362C44' : '#FFE4D4'),
                  boxShadow: (theme: Theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 107, 0, 0.2)'
                      : '0 16px 40px rgba(255, 107, 0, 0.15), 0 0 0 1px rgba(255, 107, 0, 0.12)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SupermarcheIcon size={36} />
                    <Typography sx={{ fontWeight: 800, fontSize: 16, color: 'text.primary' }}>
                      Kim's Store Express
                    </Typography>
                  </Box>
                  <SectionBadge label="EXPRESS DISPATCH" />
                </Box>

                {/* Showcase Category Pills with Real Photography Images */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                  {[
                    {
                      label: 'Trending Apparel',
                      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
                      desc: 'Hoodies, Denim & Wear'
                    },
                    {
                      label: 'Sneakers & Kicks',
                      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
                      desc: 'Urban Retro Footwear'
                    },
                    {
                      label: 'Cosmetics & Glow',
                      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
                      desc: 'Skincare & Sunscreen'
                    },
                    {
                      label: 'Tech Accessories',
                      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
                      desc: 'ANC Earbuds & Chargers'
                    },
                  ].map((cat, idx) => (
                    <Box
                      key={idx}
                      component={Link}
                      to="/shop"
                      sx={{
                        display: 'block',
                        textDecoration: 'none',
                        p: 1.5,
                        borderRadius: '16px',
                        bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#251F30' : '#FFF9F5'),
                        border: '1px solid',
                        borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#362C44' : '#FFEBE0'),
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          borderColor: '#FF6B00',
                          boxShadow: '0 8px 24px rgba(255, 107, 0, 0.18)',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={cat.image}
                        alt={cat.label}
                        sx={{
                          width: '100%',
                          height: 96,
                          borderRadius: '10px',
                          objectFit: 'cover',
                          mb: 1.25,
                          display: 'block',
                        }}
                      />
                      <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'text.primary', mb: 0.25 }}>
                        {cat.label}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                        {cat.desc}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Live Order Feature Banner */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: 'rgba(255, 107, 0, 0.08)',
                    border: '1px dashed #FF6B00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>
                    ⚡ Instant Mobile Money Payment & Same-Day Dispatch
                  </Typography>
                  <Button
                    component={Link}
                    to="/shop"
                    size="small"
                    sx={{ color: '#FF6B00', fontWeight: 700, textTransform: 'none', fontSize: 12 }}
                  >
                    Browse →
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Active Cameroon Coverage Regions Prominent Section */}
      <Box
        ref={regionSectionRef}
        className={`bb-reveal bb-reveal-up ${isRegionVisible ? 'is-visible' : ''}`}
        sx={{ py: 4, bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFF4ED'), borderTop: '1px solid', borderBottom: '1px solid', borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0') }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: '20px',
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#C4E8C9'),
              boxShadow: (theme: Theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 28px rgba(0, 0, 0, 0.4)'
                  : '0 8px 28px rgba(255, 107, 0, 0.12)',
            }}
          >
            {/* Single Clean Header Banner */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    bgcolor: 'rgba(255, 107, 0, 0.15)',
                    color: '#FF6B00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {t('regions.title')}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {t('regions.subtitle')}
                  </Typography>
                </Box>
              </Box>

              <SectionBadge label={t('regions.chip')} />
            </Box>

            {/* 2-Column Interactive Swapper Layout */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.3fr 1fr' },
                gap: 3.5,
                alignItems: 'center',
              }}
            >
              {/* Left Column: Interactive City Hub Cards */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                {regionSlides.map((slide, idx) => {
                  const isActive = idx === activeRegionIndex;
                  return (
                    <Box
                      key={slide.id}
                      onClick={() => {
                        setActiveRegionIndex(idx);
                        setIsAutoSwapping(false); // Pause auto-rotation on manual user click
                      }}
                      sx={{
                        p: 2.25,
                        borderRadius: '14px',
                        cursor: 'pointer',
                        bgcolor: (theme: Theme) =>
                          isActive
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(255, 107, 0, 0.15)'
                              : '#FFF4ED'
                            : theme.palette.mode === 'dark'
                            ? '#1F140C'
                            : '#FFF4ED',
                        border: '2px solid',
                        borderColor: isActive ? '#FF6B00' : (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#FFF4ED'),
                        boxShadow: isActive ? '0 4px 16px rgba(255, 107, 0, 0.25)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isActive ? 'translateY(-2px)' : 'none',
                        '&:hover': {
                          borderColor: '#FF6B00',
                          bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.12)' : '#FFF4ED'),
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 14.5,
                            fontFamily: 'Space Grotesk, sans-serif',
                            color: isActive ? '#FF6B00' : 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                          }}
                        >
                          <ExploreIcon sx={{ fontSize: 18, color: '#FF6B00' }} /> {slide.hubName}
                        </Typography>
                        {isActive && (
                          <Chip
                            label={t('regions.activeSlide', 'ACTIVE SLIDE')}
                            size="small"
                            sx={{
                              fontFamily: 'IBM Plex Mono, monospace',
                              fontSize: 9,
                              fontWeight: 700,
                              bgcolor: '#FF6B00',
                              color: '#FFFFFF',
                              height: 18,
                            }}
                          />
                        )}
                      </Box>

                      <Typography variant="body2" sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.4 }}>
                        {slide.districts}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              {/* Right Column: Live Swapping Region Photo Carousel Card */}
              <Box
                onMouseEnter={() => setIsAutoSwapping(false)}
                onMouseLeave={() => setIsAutoSwapping(true)}
                sx={{
                  position: 'relative',
                  height: { xs: 270, md: 320 },
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: (theme: Theme) => `2px solid ${theme.palette.mode === 'dark' ? '#4F2D1B' : '#C4E8C9'}`,
                  boxShadow: (theme: Theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 12px 32px rgba(0, 0, 0, 0.6)'
                      : '0 12px 32px rgba(255, 107, 0, 0.2)',
                }}
              >
                {/* Photorealistic Regional Service Photo Image */}
                <Box
                  component="img"
                  key={regionSlides[activeRegionIndex].id}
                  src={regionSlides[activeRegionIndex].image}
                  alt={`Supermarche ${regionSlides[activeRegionIndex].city} Coverage Hub`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    animation: 'fadeIn 0.5s ease-in-out',
                    '@keyframes fadeIn': {
                      '0%': { opacity: 0.4, transform: 'scale(1.03)' },
                      '100%': { opacity: 1, transform: 'scale(1)' },
                    },
                  }}
                />

                {/* Seamless Theme Gradient Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: (theme: Theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(to top, rgba(20, 12, 7, 0.95) 0%, rgba(20, 12, 7, 0.25) 60%, transparent 100%)'
                        : 'linear-gradient(to top, rgba(20, 12, 7, 0.82) 0%, rgba(255, 244, 237, 0.15) 60%, transparent 100%)',
                  }}
                />

                {/* Manual Chevron Navigation Arrows */}
                <IconButton
                  onClick={() => {
                    setActiveRegionIndex((prev: number) => (prev === 0 ? regionSlides.length - 1 : prev - 1));
                    setIsAutoSwapping(false);
                  }}
                  sx={{
                    position: 'absolute',
                    top: '40%',
                    left: 12,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: '#FF6B00' },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setActiveRegionIndex((prev: number) => (prev + 1) % regionSlides.length);
                    setIsAutoSwapping(false);
                  }}
                  sx={{
                    position: 'absolute',
                    top: '40%',
                    right: 12,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: '#FF6B00' },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>

                {/* Floating Glassmorphic Region Badge & Slide Dots */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 14,
                    left: 14,
                    right: 14,
                    p: 1.75,
                    borderRadius: '14px',
                    bgcolor: (theme: Theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(31, 20, 12, 0.94)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 107, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: '#FF6B00',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
                      }}
                    >
                      <LocationOnIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'text.primary', lineHeight: 1.2 }}>
                        {regionSlides[activeRegionIndex].badgeText}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: '#FF6B00', fontWeight: 600, mt: 0.25 }}>
                        ⚡ {regionSlides[activeRegionIndex].eta}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Carousel Slide Indicators */}
                  <Box sx={{ display: 'flex', gap: 0.75 }}>
                    {regionSlides.map((_, dotIdx) => (
                      <Box
                        key={dotIdx}
                        onClick={() => {
                          setActiveRegionIndex(dotIdx);
                          setIsAutoSwapping(false);
                        }}
                        sx={{
                          width: dotIdx === activeRegionIndex ? 18 : 6,
                          height: 6,
                          borderRadius: '3px',
                          bgcolor: dotIdx === activeRegionIndex ? '#FF6B00' : 'rgba(120, 120, 120, 0.4)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Live Services Catalog Section */}
      <Box
        id="services-catalog"
        ref={servicesCatalogRef}
        className={`bb-reveal bb-reveal-up ${isCatalogVisible ? 'is-visible' : ''}`}
        sx={{ py: { xs: 8, md: 10 } }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontSize: 32, fontWeight: 700, mb: 1.5 }}>
              {t('catalog.title', 'Everyday Services Catalog')}
            </Typography>
            <Typography sx={{ fontSize: 16, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              {t('catalog.subtitle', 'Filter by service category or search for cooking gas cylinders, fresh market produce, and villa cleaning across Cameroon.')}
            </Typography>
          </Box>

          {/* Mobile Carousel Swipe Header Badge & Controls */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5,
              px: 0.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#FF6B00' }}>
              <SwipeIcon fontSize="small" />
              <Typography sx={{ fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                Swipe Featured Services
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => handleScrollHomeServicesCarousel('left')}
                sx={{
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                  color: '#FF6B00',
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleScrollHomeServicesCarousel('right')}
                sx={{
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                  color: '#FF6B00',
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box
            ref={homeServicesCarouselRef}
            sx={{
              display: { xs: 'flex', sm: 'grid' },
              gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              overflowX: { xs: 'auto', sm: 'visible' },
              scrollSnapType: { xs: 'x mandatory', sm: 'none' },
              gap: 3,
              pb: { xs: 2, sm: 0 },
              mx: { xs: -2, sm: 0 },
              px: { xs: 2, sm: 0 },
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {(services.length > 0 ? services.filter((srv) => srv.featured !== false) : DEFAULT_SERVICES).slice(0, 3).map((rawSrv) => {
              const srv = getLocalizedService(rawSrv);
              return (
                <Box
                  key={srv.id}
                  sx={{
                    flex: { xs: '0 0 85%', sm: 'auto' },
                    minWidth: { xs: 270, sm: 'auto' },
                    scrollSnapAlign: { xs: 'start', sm: 'none' },
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                    border: '1px solid',
                    borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#FF6B00',
                      transform: 'translateY(-3px)',
                      boxShadow: (theme: Theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 12px 28px rgba(0, 0, 0, 0.5)'
                          : '0 12px 28px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Box>
                    {srv.imageUrl ? (
                      <Box
                        sx={{
                          position: 'relative',
                          height: 160,
                          mx: -3,
                          mt: -3,
                          mb: 2.5,
                          overflow: 'hidden',
                          bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#F1F5F9'),
                        }}
                      >
                        <Box
                          component="img"
                          src={srv.imageUrl}
                          alt={srv.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                            '&:hover': { transform: 'scale(1.06)' },
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            right: 12,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Chip
                            label={srv.categoryLabel}
                            size="small"
                            sx={{
                              fontFamily: 'IBM Plex Mono, monospace',
                              fontSize: 10,
                              fontWeight: 600,
                              bgcolor: (theme: Theme) =>
                                theme.palette.mode === 'dark' ? 'rgba(10, 18, 14, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                              backdropFilter: 'blur(8px)',
                              color: srv.isLive ? '#FF6B00' : '#C97B3D',
                              border: '1px solid rgba(255, 107, 0, 0.3)',
                            }}
                          />
                          {!srv.isLive && (
                            <Chip
                              label={t('catalog.comingSoon', 'COMING SOON')}
                              size="small"
                              sx={{
                                fontFamily: 'IBM Plex Mono, monospace',
                                fontSize: 9,
                                bgcolor: '#C97B3D',
                                color: '#FFFFFF',
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Chip
                          label={srv.categoryLabel}
                          size="small"
                          sx={{
                            fontFamily: 'IBM Plex Mono, monospace',
                            fontSize: 10,
                            fontWeight: 600,
                            bgcolor: srv.isLive
                              ? (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255, 107, 0, 0.1)')
                              : 'rgba(201, 123, 61, 0.15)',
                            color: srv.isLive ? '#FF6B00' : '#C97B3D',
                          }}
                        />
                        {!srv.isLive && (
                          <Chip
                            label={t('catalog.comingSoon', 'COMING SOON')}
                            size="small"
                            sx={{
                              fontFamily: 'IBM Plex Mono, monospace',
                              fontSize: 9,
                              bgcolor: '#C97B3D',
                              color: '#FFFFFF',
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Box>
                    )}

                    <Typography variant="h3" sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
                      {srv.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: 'text.secondary',
                        mb: 3,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 58,
                      }}
                    >
                      {srv.shortDescription || srv.description}
                    </Typography>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pt: 2, borderTop: (theme: Theme) => `1px dashed ${theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'}` }}>
                      <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 700, color: srv.isLive ? '#FF6B00' : 'text.disabled' }}>
                        {srv.isLive ? t('catalog.verifiedDispatch', '✓ VERIFIED DISPATCH') : t('catalog.soon', 'SOON')}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                        {srv.estimatedTime}
                      </Typography>
                    </Box>

                    <Button
                      variant={srv.isLive ? 'contained' : 'outlined'}
                      fullWidth
                      disabled={!srv.isLive}
                      onClick={() => {
                        addToCart({
                          _id: srv.id,
                          title: srv.title,
                          slug: srv.id,
                          description: srv.description,
                          price: srv.id === 'srv-clothes' ? 12500 : srv.id === 'srv-shoes' ? 24000 : srv.id === 'srv-cosmetics' ? 4500 : srv.id === 'srv-tech' ? 15000 : 2500,
                          category: srv.categoryLabel || 'Store',
                          images: srv.imageUrl ? [srv.imageUrl] : ['/images/hero_banner.png'],
                          stockQuantity: 100,
                          inStock: true,
                        });
                        toast.success(`Added "${srv.title}" to shopping cart!`);
                      }}
                      startIcon={srv.isLive ? <AddShoppingCartIcon /> : undefined}
                      sx={{
                        bgcolor: srv.isLive ? '#FF6B00' : 'transparent',
                        color: srv.isLive ? '#FFFFFF' : 'text.disabled',
                        fontWeight: 700,
                        py: 1,
                        textTransform: 'none',
                        borderRadius: '10px',
                        '&:hover': { bgcolor: '#E05D00' },
                      }}
                    >
                      {srv.isLive ? 'Add to Cart' : t('catalog.notify', 'Notify')}
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Action CTA Prompt Section to View All Services */}
          <Box sx={{ textAlign: 'center', mt: 5, pt: 2 }}>
            <Typography sx={{ fontSize: 15, color: 'text.secondary', mb: 2, fontWeight: 500 }}>
              {t('catalog.exploreAllDesc', 'Explore all our available services & detailed offerings')}
            </Typography>
            <Button
              component={Link}
              to="/services"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 4,
                py: 1.4,
                borderRadius: '12px',
                fontSize: 15,
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(255, 107, 0, 0.35)',
                '&:hover': {
                  bgcolor: '#E05D00',
                  boxShadow: '0 12px 32px rgba(255, 107, 0, 0.45)',
                },
              }}
            >
              {t('catalog.viewAllServices', 'View All Services')}
            </Button>
          </Box>
        </Container>
      </Box>


      {/* Customer Testimonials Section */}
      <Box
        ref={testimonialsRef}
        className={`bb-reveal bb-reveal-up ${isTestimonialsVisible ? 'is-visible' : ''}`}
        sx={{ py: 8, bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFF4ED') }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
            <Typography variant="h2" sx={{ fontSize: 28, fontWeight: 700, textAlign: 'center', mb: 1 }}>
              {t('reviews.title')}
            </Typography>

            <BamboGuide
              pointingDirection="right"
              text={t('reviews.guideText', 'Read verified feedback from client work orders in Bastos, Bonapriso & Molyko!')}
              subtext={t('reviews.guideSubtext', '100% verified provider ratings & transparent job tickets')}
              height={125}
              width={95}
            />

            <Button
              variant="outlined"
              startIcon={<RateReviewIcon />}
              onClick={() => setReviewModalOpen(true)}
              sx={{
                mt: 2,
                borderColor: '#FF6B00',
                color: '#FF6B00',
                fontWeight: 700,
                px: 3,
                py: 1,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)', borderColor: '#E05D00' },
              }}
            >
              {t('reviews.leaveReview')}
            </Button>
          </Box>

          {/* Direction Arrows Control Bar (Visible on mobile view) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 13 }}>
              {t('reviews.swipeInstruction', 'Swipe or use arrows to view testimonials')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => handleTestimonialsScroll('left')}
                aria-label="Scroll testimonials left"
                sx={{
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#CBD5E1'),
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#FF6B00' : '#FF6B00'),
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&:hover': { bgcolor: '#FF6B00', color: '#FFFFFF', borderColor: '#FF6B00' },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={() => handleTestimonialsScroll('right')}
                aria-label="Scroll testimonials right"
                sx={{
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#CBD5E1'),
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#FF6B00' : '#FF6B00'),
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&:hover': { bgcolor: '#FF6B00', color: '#FFFFFF', borderColor: '#FF6B00' },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>

          {approvedFeaturedTestimonials.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: '12px',
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                border: '1px dashed',
                borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#CBD5E1'),
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
                {t('reviews.noReviewsTitle', 'No published customer reviews yet')}
              </Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 2 }}>
                {t('reviews.noReviewsSub', 'Be the first client to submit a review about your express delivery or home service experience with Supermarche!')}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setReviewModalOpen(true)}
                sx={{
                  bgcolor: '#FF6B00',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#E05D00' },
                }}
              >
                {t('reviews.writeFirstReview', 'Write the First Review')}
              </Button>
            </Paper>
          ) : (
            <Box
              ref={testimonialsCarouselRef}
              sx={{
                display: { xs: 'flex', md: 'grid' },
                gridTemplateColumns: { md: 'repeat(3, 1fr)' },
                gap: 3,
                overflowX: { xs: 'auto', md: 'visible' },
                scrollSnapType: { xs: 'x mandatory', md: 'none' },
                scrollPadding: '0 16px',
                pb: { xs: 1.5, md: 0 },
                mx: { xs: -2, md: 0 },
                px: { xs: 2, md: 0 },
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {approvedFeaturedTestimonials.map((tItem) => (
                <Box
                  key={tItem.id}
                  sx={{
                    flex: { xs: '0 0 85%', md: 'none' },
                    scrollSnapAlign: 'center',
                    scrollSnapStop: 'always',
                    minWidth: 0,
                    p: 3,
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                    border: '1px solid',
                    borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: '#FF6B00',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Rating value={tItem.rating} readOnly precision={0.5} size="small" />
                      <Chip
                        label={getLocalizedTestimonialBadge(tItem.serviceUsed)}
                        size="small"
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          bgcolor: 'rgba(255, 107, 0, 0.12)',
                          color: '#FF6B00',
                          borderRadius: '6px',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        fontSize: 14,
                        lineHeight: 1.6,
                        mb: 3,
                        fontStyle: 'italic',
                      }}
                    >
                      "{tItem.content}"
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 107, 0, 0.2)',
                        color: '#FF6B00',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      {tItem.authorName.charAt(0)}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.2 }}>
                        {tItem.authorName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                        {tItem.authorRole && tItem.authorRole !== 'Verified Client'
                          ? tItem.authorRole
                          : t('reviews.verifiedClient', 'Verified Client')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Supermarche Bot Live Chat & Customer Support Section (Matching Reference Theme) */}
      <Box sx={{ py: 8, bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'), borderTop: '1px solid', borderBottom: '1px solid', borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#C4E8C9') }}>
        <Container maxWidth="lg">
          {/* Header Banner */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box sx={{ display: 'inline-flex', mb: 1.5 }}>
              <SectionBadge label={t('liveSupport.chip', '24/7 VERIFIED CUSTOMER SERVICE DESK')} />
            </Box>
            <Typography variant="h2" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', mb: 1 }}>
              {t('liveSupport.title', 'Kimzy Live Customer Service')}
            </Typography>
            <Typography sx={{ fontSize: 14, color: 'text.secondary', maxWidth: 620, mx: 'auto' }}>
              {t('liveSupport.subtitle', "Connect directly with Kimzy and our Kim's Store customer service team in Cameroon for 24/7 order updates, styling guidance, and express delivery tracking.")}
            </Typography>
          </Box>

          {/* 2-Column Banner Container */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: 4,
              alignItems: 'center',
              borderRadius: '20px',
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
              p: { xs: 3, md: 4 },
              boxShadow: (theme: Theme) =>
                theme.palette.mode === 'dark'
                  ? '0 12px 36px rgba(0, 0, 0, 0.5)'
                  : '0 12px 36px rgba(255, 107, 0, 0.12)',
            }}
          >
            {/* Left Side: Mascot Kimzy at Dispatch Desk Visual */}
            <Box
              sx={{
                position: 'relative',
                p: 3,
                borderRadius: '16px',
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
                border: '1px solid rgba(255, 107, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Floating Chat Bubble graphic */}
              <Box
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderRadius: '14px 14px 14px 2px',
                  bgcolor: '#FF6B00',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 16px rgba(255, 107, 0, 0.35)',
                  mb: 2,
                  maxWidth: 340,
                }}
              >
                {t('liveSupport.bamboBubble', '"Hello! 👋 Need help with sizes, new collections, or tracking your active order?"')}
              </Box>

              {/* Kimzy Mascot Component */}
              <BamboGuide
                pointingDirection="down"
                text={t('liveSupport.bamboGuideTitle', 'Kimzy is active 24/7 across Cameroon!')}
                subtext={t('liveSupport.bamboGuideSub', 'Instant answers & express order assistance')}
                height={160}
                width={125}
              />
            </Box>

            {/* Right Side: Quick Action Service Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box
                onClick={() => onOpenLiveChat?.()}
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#FFF4ED'),
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: '#FF6B00',
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.15)' : '#FFF4ED'),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Space Grotesk, sans-serif', color: '#FF6B00', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SupportAgentIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
                  {t('liveSupport.chatTitle', 'Start Live Chat Support')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13, lineHeight: 1.45 }}>
                  {t('liveSupport.chatSub', 'Click the floating chat widget on the bottom right to talk with Kimzy in real-time.')}
                </Typography>
              </Box>

              <Box
                onClick={() => navigate('/shop')}
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#FFF4ED'),
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: '#FF6B00',
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.15)' : '#FFF4ED'),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Space Grotesk, sans-serif', color: '#FF6B00', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingBagIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
                  {t('liveSupport.ticketTitle', 'Book a Delivery / Runner Service')} →
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13, lineHeight: 1.45 }}>
                  {t('liveSupport.ticketSub', 'Need trending fashion, skincare, gadgets, or groceries dispatched? Book doorstep runner delivery across Cameroon in minutes.')}
                </Typography>
              </Box>

              <Box
                onClick={() => setTrackOrderModalOpen(true)}
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#FFF4ED'),
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: '#FF6B00',
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.15)' : '#FFF4ED'),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Space Grotesk, sans-serif', color: '#FF6B00', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShippingIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
                  {t('liveSupport.appTitle', 'Live Order Tracking')} →
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13, lineHeight: 1.45 }}>
                  {t('liveSupport.appSub', 'Track your delivery runner status directly on the live web tracking dashboard.')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Call-to-Action Section */}
      <Box
        ref={downloadSectionRef}
        className={`bb-reveal bb-reveal-scale ${isDownloadVisible ? 'is-visible' : ''}`}
        sx={{ py: 10 }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: '16px',
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
              border: (theme: Theme) => `1px solid ${theme.palette.mode === 'dark' ? '#3A2316' : '#FFE4D4'}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="h2" sx={{ fontSize: 30, fontWeight: 700, mb: 2 }}>
              {t('cta.title', 'Ready to elevate your shopping experience?')}
            </Typography>

            <Typography sx={{ fontSize: 16, color: 'text.secondary', mb: 3, maxWidth: 500, mx: 'auto' }}>
              {t('cta.subtitle', 'Discover trending streetwear, sneakers, skincare, tech accessories, and express supermarket essentials.')}
            </Typography>

            {/* Kimzy Mascot Pointing to CTA Action */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <BamboGuide
                pointingDirection="down"
                text={t('cta.bamboTitle', "Explore Kim's Store collections!")}
                subtext={t('cta.bamboSub', 'Fast delivery & instant Mobile Money checkout across Cameroon')}
                height={140}
                width={110}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() => onOpenBookingWithService()}
              startIcon={<SmartphoneIcon />}
              sx={{
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: 16,
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
                '&:hover': { bgcolor: '#E05D00' },
              }}
            >
              {t('cta.installApp', 'Install Supermarche App')}
            </Button>
          </Box>
        </Container>
      </Box>



      {/* FAQ Accordion Section */}
      <Box
        ref={faqSectionRef}
        className={`bb-reveal bb-reveal-up ${isFaqVisible ? 'is-visible' : ''}`}
        sx={{ pb: 8 }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontSize: 28, fontWeight: 700, textAlign: 'center', mb: 4 }}>
            {t('faq.title', 'Frequently Asked Questions')}
          </Typography>

          <Accordion defaultExpanded sx={{ mb: 1.5, bgcolor: 'transparent', border: '1px solid', borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0') }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                {t('faq.q1', 'How does gas cylinder safety inspection work during delivery?')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {t('faq.a1', 'Every Supermarche gas specialist carries a pressure test gauge and soapy leak test equipment. Upon delivery, the technician tests your cylinder head and regulator connection to ensure zero leak risk before departing.')}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 1.5, bgcolor: 'transparent', border: '1px solid', borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0') }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                {t('faq.q2', 'What happens if a market item is out of stock?')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {t('faq.a2', 'Your purchasing lead updates your job ticket status to "Action Needed" with proposed item substitutions. You can approve or modify choices directly from your tracking dashboard.')}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0') }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                {t('faq.q3', 'Which cities and neighborhoods are currently covered in Cameroon?')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {t('faq.a3', 'Currently operating across all districts in Yaoundé, Douala, Buea, and Bamenda. Regional hubs expansion for Kribi and Bafoussam is slated for Q3.')}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>

      {/* Service Detail "Learn More" Modal */}
      <ServiceDetailModal
        open={Boolean(selectedDetailService)}
        onClose={() => setSelectedDetailService(null)}
        service={selectedDetailService}
        onBookNow={(srv) => onOpenBookingWithService(srv.id)}
      />

      {/* Public Review / Testimonial Submission Modal */}
      <SubmitReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />

      {/* Live Order Tracking Modal */}
      <Dialog
        open={trackOrderModalOpen}
        onClose={() => setTrackOrderModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              p: 1,
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1A110A' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#FFD5BD'),
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: 'rgba(255, 107, 0, 0.12)',
                color: '#FF6B00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocalShippingIcon />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, fontFamily: 'Space Grotesk, sans-serif' }}>
                Live Order & Courier Tracking
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }}>
                Real-time express dispatch monitoring • Cameroon Hub
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setTrackOrderModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.6 }}>
            Enter your Kim&apos;s Store Order Number (from your checkout confirmation or SMS receipt) to track runner status and delivery progress.
          </Typography>

          <TextField
            fullWidth
            autoFocus
            label="Order Number"
            placeholder="e.g. ORD-984210 or KS-2026-001"
            value={trackOrderInput}
            onChange={(e) => setTrackOrderInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && trackOrderInput.trim()) {
                setTrackOrderModalOpen(false);
                navigate(`/order-status/${encodeURIComponent(trackOrderInput.trim())}`);
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#FF6B00' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
              },
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Quick Demo:
            </Typography>
            <Chip
              label="ORD-DEMO-2026"
              size="small"
              onClick={() => setTrackOrderInput('ORD-DEMO-2026')}
              sx={{
                bgcolor: 'rgba(255, 107, 0, 0.1)',
                color: '#FF6B00',
                fontWeight: 700,
                fontSize: 11,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.2)' },
              }}
            />
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.08)' : '#FFF7F2'),
              border: '1px dashed rgba(255, 107, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#FF6B00' }}>
                Lost your order number?
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Kimzy can look up orders by your phone number or email in real-time.
              </Typography>
            </Box>
            {onOpenLiveChat && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<SupportAgentIcon fontSize="small" />}
                onClick={() => {
                  setTrackOrderModalOpen(false);
                  onOpenLiveChat();
                }}
                sx={{
                  borderColor: '#FF6B00',
                  color: '#FF6B00',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' },
                }}
              >
                Ask Kimzy
              </Button>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, justifyContent: 'space-between' }}>
          <Button
            onClick={() => setTrackOrderModalOpen(false)}
            sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!trackOrderInput.trim()}
            onClick={() => {
              if (trackOrderInput.trim()) {
                setTrackOrderModalOpen(false);
                navigate(`/order-status/${encodeURIComponent(trackOrderInput.trim())}`);
              }
            }}
            sx={{
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              '&:hover': { bgcolor: '#E05D00' },
            }}
          >
            Track Order Status →
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
