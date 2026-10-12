import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material';
import type { Theme } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SwipeIcon from '@mui/icons-material/Swipe';
import { InfiniteAutocompleteInput } from '../../components/ui/InfiniteAutocompleteInput';
import { ServiceDetailModal } from '../../components/ui/ServiceDetailModal';
import api from '../../api/client';
import { getServiceCategoryLabel } from '../../types';
import type { ServiceItem, CategoryItem } from '../../types';
import { useTranslation } from 'react-i18next';
import { SEO } from '../../components/seo/SEO';
import { getBreadcrumbSchema, getServiceSchema } from '../../components/seo/schemas';

interface ServicesPageProps {
  onOpenBooking: (serviceId?: string) => void;
}

export function ServicesPage({ onOpenBooking }: ServicesPageProps) {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoriesList, setCategoriesList] = useState<{ id: string; label: string; slug: string }[]>([{ id: 'all', label: 'All Services', slug: 'all' }]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [selectedDetailService, setSelectedDetailService] = useState<ServiceItem | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -290 : 290;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const currentLang = i18n.language || 'en';
    api.services
      .getMainHubs(currentLang)
      .then((res: unknown) => {
        const list = (Array.isArray(res) ? res : (res as { data?: CategoryItem[] })?.data || []) as CategoryItem[];
        if (list.length > 0) {
          const mapped = [
            { id: 'all', label: 'All Services', slug: 'all' },
            ...list.map((c) => ({
              id: c.slug || c.id,
              label: c.name,
              slug: c.slug,
            })),
          ];
          setCategoriesList(mapped);
        }
      })
      .catch(() => {});
  }, [i18n.language]);

  // Fetch Services from Backend API
  useEffect(() => {
    let isMounted = true;
    const currentLang = i18n.language || 'en';

    api.services
      .getPaginatedServices(1, 50, currentLang)
      .then((res: unknown) => {
        if (!isMounted) return;
        const list = (Array.isArray(res) ? res : (res as { data?: ServiceItem[] })?.data || []) as ServiceItem[];
        setServices(list);
        setLoading(false);
        setVisibleCount(6);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory, i18n.language]);

  // Infinite Scroll Trigger
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !isLoadingMore) {
          if (visibleCount < services.length) {
            setIsLoadingMore(true);
            setTimeout(() => {
              setVisibleCount((prev) => Math.min(prev + 6, services.length));
              setIsLoadingMore(false);
            }, 300);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, isLoadingMore, visibleCount, services.length]);

  const displayedServices = services.slice(0, visibleCount);
  const hasMore = visibleCount < services.length;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  const serviceSchemas = services.map((s) => getServiceSchema(s.title, s.description, s.imageUrl));

  return (
    <Box sx={{ pt: { xs: 11, sm: 12, md: 13 }, pb: 10 }}>
      <SEO
        title="Verified Services & Express Errand Catalog"
        description="Browse all on-demand services in Cameroon: cooking gas refill, fresh market soup packs, home deep cleaning, back-to-school supplies & security."
        canonicalPath="/services"
        jsonLd={[breadcrumbSchema, ...serviceSchemas]}
      />
      <Container maxWidth="xl">
        {/* Page Hero Header */}
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 820,
            mx: 'auto',
            mb: 6,
          }}
        >
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#FF6B00 !important' }} />}
            label={t('services.chip')}
            size="small"
            sx={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              fontWeight: 700,
              bgcolor: 'rgba(255, 107, 0, 0.12)',
              color: '#FF6B00',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              mb: 2.5,
              px: 1,
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: 32, sm: 42, md: 52 },
              fontWeight: 800,
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '-0.02em',
              mb: 2,
              lineHeight: 1.15,
            }}
          >
            {t('services.title')}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 15, md: 17 },
              color: 'text.secondary',
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            {t('services.subtitle')}
          </Typography>

          {/* Integrated Search & Filter Controls */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: '20px',
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            {/* Search Input */}
            <Box sx={{ width: '100%' }}>
              <InfiniteAutocompleteInput<ServiceItem>
                placeholder={t('services.searchPlaceholder')}
                fetchOptions={async (q, page) => {
                  const res: unknown = await api.services.getPaginatedServices(page, 10);
                  const rawData = (Array.isArray(res) ? res : (res as { data?: ServiceItem[] })?.data || []) as ServiceItem[];
                  const filtered = q.trim()
                    ? rawData.filter((s) => s.title.toLowerCase().includes(q.toLowerCase()))
                    : rawData;
                  return {
                    data: filtered,
                    total: filtered.length,
                    currentPage: page,
                    hasMore: false,
                  };
                }}
                getOptionLabel={(srv) => srv.title}
                getOptionKey={(srv) => srv.id}
                onInputChange={(newVal) => setSearchQuery(newVal)}
                onSelect={(selectedSrv) => {
                  if (selectedSrv) {
                    setSelectedDetailService(selectedSrv);
                  }
                }}
                startIcon={<SearchIcon sx={{ color: '#FF6B00' }} />}
                renderOption={(srv) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', py: 0.5 }}>
                    <Box>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>{srv.title}</Typography>
                      <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                        {srv.categoryLabel}
                      </Typography>
                    </Box>
                    <Chip
                      label={srv.isLive ? 'LIVE' : 'SOON'}
                      size="small"
                      color={srv.isLive ? 'success' : 'default'}
                      sx={{ fontSize: 10, height: 20 }}
                    />
                  </Box>
                )}
              />
            </Box>

            {/* Category Filter Chips */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                pb: 0.5,
                px: 0.5,
                maxWidth: '100%',
                justifyContent: { xs: 'flex-start', sm: 'center' },
                '&::-webkit-scrollbar': { height: '4px' },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 107, 0, 0.3)', borderRadius: '4px' },
              }}
            >
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
                return (
                  <Chip
                    key={cat.id}
                    label={cat.label}
                    onClick={() => setSelectedCategory(cat.id)}
                    variant={isSelected ? 'filled' : 'outlined'}
                    sx={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600,
                      fontSize: 12.5,
                      py: 2,
                      px: 1.5,
                      borderRadius: '10px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      bgcolor: isSelected ? '#FF6B00' : 'transparent',
                      color: isSelected ? '#FFFFFF' : 'text.primary',
                      borderColor: isSelected ? '#FF6B00' : (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                      '&:hover': {
                        bgcolor: isSelected ? '#E05D00' : (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.12)' : 'rgba(255, 107, 0, 0.06)'),
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Results Header Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, px: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', color: 'text.secondary' }}>
            SHOWING {displayedServices.length} OF {services.length} SERVICES
          </Typography>

          {(searchQuery || selectedCategory !== 'all') && (
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              sx={{ textTransform: 'none', fontSize: 12, color: '#FF6B00' }}
            >
              Reset Filters
            </Button>
          )}
        </Box>

        {/* Services Loading Spinner */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={36} sx={{ color: '#FF6B00' }} />
          </Box>
        ) : displayedServices.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 3,
              borderRadius: '20px',
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F8FAFC'),
              border: '1px dashed',
              borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#CBD5E1'),
            }}
          >
            <TuneIcon sx={{ fontSize: 44, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              No matching services found
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: 'text.secondary', mb: 3 }}>
              Try adjusting your search query or select another category filter.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}
            >
              View All Services
            </Button>
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
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
                  Swipe Services Carousel
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => handleScrollCarousel('left')}
                  sx={{
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                    color: '#FF6B00',
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleScrollCarousel('right')}
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
              ref={carouselRef}
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
              {displayedServices.map((srv) => (
                <Box
                  key={srv.id}
                  sx={{
                    flex: { xs: '0 0 85%', sm: 'auto' },
                    minWidth: { xs: 270, sm: 'auto' },
                    scrollSnapAlign: { xs: 'start', sm: 'none' },
                  }}
                >
                <Box
                  onClick={() => setSelectedDetailService(srv)}
                  sx={{
                    cursor: 'pointer',
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
                          height: 170,
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
                            label={getServiceCategoryLabel(srv)}
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
                              label="COMING SOON"
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
                          label={getServiceCategoryLabel(srv)}
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
                            label="COMING SOON"
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
                      {srv.shortDescription || (srv.description ? srv.description.replace(/<[^>]*>/g, '').trim() : '')}
                    </Typography>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pt: 2, borderTop: (theme: Theme) => `1px dashed ${theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'}` }}>
                      <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 700, color: srv.isLive ? '#FF6B00' : 'text.disabled' }}>
                        {srv.isLive ? '✓ VERIFIED DISPATCH' : 'SOON'}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                        {srv.estimatedTime}
                      </Typography>
                    </Box>

                    <Button
                      variant={srv.isLive ? 'contained' : 'outlined'}
                      fullWidth
                      disabled={!srv.isLive}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBooking(srv.id);
                      }}
                      startIcon={srv.isLive ? <ShoppingBagIcon /> : undefined}
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
                      {srv.isLive ? 'Book Now' : 'Notify Me'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        )}

        {/* Sentinel & Load More Trigger */}
        {hasMore && (
          <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            {isLoadingMore && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: '#FF6B00' }} />
                <Typography sx={{ fontSize: 13, color: '#FF6B00', fontWeight: 600 }}>
                  Loading more services...
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Service Detail Modal Popup */}
      <ServiceDetailModal
        service={selectedDetailService}
        open={Boolean(selectedDetailService)}
        onClose={() => setSelectedDetailService(null)}
        onBookNow={(srv: ServiceItem) => {
          setSelectedDetailService(null);
          onOpenBooking(srv.id);
        }}
      />
    </Box>
  );
}

export default ServicesPage;
