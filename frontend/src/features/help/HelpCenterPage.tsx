import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  InputAdornment,
  TextField,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Autocomplete,
} from '@mui/material';
import type { Theme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SecurityIcon from '@mui/icons-material/Security';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HandymanIcon from '@mui/icons-material/Handyman';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store/hooks';
import type { HelpArticleItem } from '../admin/types/admin.types';
import { SEO } from '../../components/seo/SEO';
import { getBreadcrumbSchema } from '../../components/seo/schemas';
import api from '../../api/client';

interface HelpCenterPageProps {
  onOpenBooking?: () => void;
  onOpenLiveChat?: () => void;
}

interface FAQItem {
  id: string;
  category: 'customers' | 'pros' | 'account';
  subCategory: string;
  question: string;
  answer: string;
  trending?: boolean;
}



export function HelpCenterPage({ onOpenBooking, onOpenLiveChat }: HelpCenterPageProps) {
  const { t, i18n } = useTranslation();
  const reduxHelpArticles = useAppSelector((state) => state.admin.helpArticles || []);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [helpArticles, setHelpArticles] = useState<HelpArticleItem[]>(reduxHelpArticles);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticleItem | null>(null);
  const [activeTab, setActiveTab] = useState<'customers' | 'pros' | 'account'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const featuredTopicsRef = useRef<HTMLDivElement>(null);
  const kbArticlesRef = useRef<HTMLDivElement>(null);

  const handleScrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const firstChild = ref.current.firstElementChild as HTMLElement;
      const amount = firstChild ? firstChild.clientWidth + 20 : 300;
      ref.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const currentLang = i18n.language || 'en';

    // Fetch dynamic FAQs from backend API
    api.faqs
      .list<{ data?: Record<string, unknown>[] }>({ page: 'help', lang: currentLang })
      .then((res) => {
        const rawList = res?.data || (Array.isArray(res) ? res : []);
        const mappedFaqs: FAQItem[] = rawList.map((item: Record<string, unknown>) => ({
          id: String(item._id || item.id || ''),
          category: (item.category === 'pros' || item.category === 'account' ? item.category : 'customers') as 'customers' | 'pros' | 'account',
          subCategory: String(item.subCategory || item.categoryLabel || 'General'),
          question: typeof item.question === 'string' ? item.question : String((item.question as Record<string, unknown>)?.[currentLang] || (item.question as Record<string, unknown>)?.en || ''),
          answer: typeof item.answer === 'string' ? item.answer : String((item.answer as Record<string, unknown>)?.[currentLang] || (item.answer as Record<string, unknown>)?.en || ''),
          trending: Boolean(item.is_featured || item.trending || false),
        }));
        setFaqs(mappedFaqs);
      })
      .catch(() => {
        setFaqs([]);
      });

    // Fetch dynamic Knowledge Base Articles from backend API
    api.articles
      .list<{ data?: Record<string, unknown>[]; articles?: Record<string, unknown>[] }>({ lang: currentLang })
      .then((res) => {
        const rawList = res?.data || res?.articles || (Array.isArray(res) ? res : []);
        const mappedArticles: HelpArticleItem[] = rawList.map((item: Record<string, unknown>) => ({
          id: String(item._id || item.id || ''),
          title: typeof item.title === 'string' ? item.title : String((item.title as Record<string, unknown>)?.[currentLang] || (item.title as Record<string, unknown>)?.en || ''),
          summary: typeof item.summary === 'string' ? item.summary : String((item.summary as Record<string, unknown>)?.[currentLang] || (item.summary as Record<string, unknown>)?.en || ''),
          category: String(item.category || 'General'),
          slug: String(item.slug || item._id || ''),
          content: typeof item.content === 'string' ? item.content : String((item.content as Record<string, unknown>)?.[currentLang] || (item.content as Record<string, unknown>)?.en || JSON.stringify(item.content || '')),
          author: String(item.author || 'Supermarche Team'),
          createdAt: String(item.createdAt || new Date().toISOString()),
          views: typeof item.views === 'number' ? item.views : 0,
          helpfulCount: typeof item.helpfulCount === 'number' ? item.helpfulCount : 0,
          featured: Boolean(item.is_featured || item.featured || false),
        }));
        setHelpArticles(mappedArticles);
      })
      .catch(() => {});
  }, [i18n.language]);

  const filteredFaqs = faqs.filter((faq) => {
    const isSearching = searchQuery.trim() !== '';
    const matchesTab = isSearching ? true : faq.category === activeTab;
    const matchesQuery =
      !isSearching ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const trendingFaqs = faqs.filter((faq) => faq.trending);

  const handleAccordionToggle = (panelId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panelId : false);
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Help Center', path: '/help' },
  ]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.slice(0, 10).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Box sx={{ pb: 10 }}>
      <SEO
        title="Help Center & Customer Support"
        description="Find answers to FAQs about Supermarche express cooking gas delivery, market shopping, payment methods, provider verification, and account support."
        canonicalPath="/help"
        jsonLd={[breadcrumbSchema, faqSchema]}
      />

      {/* 1. Prominent Search Header Hero */}
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(135deg, rgba(20, 12, 7, 0.92) 0%, rgba(224, 93, 0, 0.88) 100%), url("/help_hero_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFFFFF',
          pt: { xs: 12, md: 15 },
          pb: { xs: 10, md: 12 },
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <Chip
            icon={<VerifiedUserIcon sx={{ color: '#FF6B00 !important', fontSize: 16 }} />}
            label={t('help.chip')}
            sx={{
              bgcolor: 'rgba(255, 107, 0, 0.18)',
              color: '#FF6B00',
              fontWeight: 700,
              fontSize: 12,
              mb: 2.5,
              px: 1,
              border: '1px solid rgba(255, 107, 0, 0.35)',
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: 28, sm: 38, md: 46 },
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              mb: 2,
            }}
          >
            {t('help.title')}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 15, md: 17 },
              color: 'rgba(255, 255, 255, 0.85)',
              mb: 4,
              maxWidth: 620,
              mx: 'auto',
            }}
          >
            {t('help.subtitle')}
          </Typography>

          <Autocomplete
            freeSolo
            options={[
              'Cooking Gas Refill & Delivery',
              'Prepped Foods & Market Shopping',
              'Back to School Supplies',
              'Deep Home & Office Cleaning',
              'CCTV & Digital Security',
              '14-Day Service Warranty',
              'How to Become a Service Provider',
              'Payment & Refund Methods',
              'Emergency Dispatch Protocol',
            ]}
            inputValue={searchQuery}
            onInputChange={(_, newValue) => setSearchQuery(newValue)}
            sx={{ maxWidth: 680, mx: 'auto' }}
            renderInput={(params) => {
              const rawParams = params as unknown as {
                InputProps?: {
                  startAdornment?: React.ReactNode;
                  endAdornment?: React.ReactNode;
                };
              };
              const existingStartAdornment = rawParams.InputProps?.startAdornment;
              const existingEndAdornment = rawParams.InputProps?.endAdornment;
              if (rawParams.InputProps) {
                rawParams.InputProps.startAdornment = (
                  <>
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#FF6B00', fontSize: 24 }} />
                    </InputAdornment>
                    {existingStartAdornment}
                  </>
                );
                if (searchQuery) {
                  rawParams.InputProps.endAdornment = (
                    <>
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                      {existingEndAdornment}
                    </>
                  );
                }
              }
              return (
                <TextField
                  {...params}
                  fullWidth
                  placeholder={t('help.searchQuestionsPlaceholder', "Search questions (e.g. 'Gas Refill', 'Refunds', 'Become a Provider', '14-Day Warranty')...")}
                  sx={{
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : '#FFFFFF'),
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover fieldset': {
                        borderColor: '#FF6B00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF6B00',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      fontSize: '0.8125rem !important',
                      fontWeight: '400 !important',
                      opacity: '0.7 !important',
                    },
                  }}
                />
              );
            }}
          />

          {/* Quick Tag Pills */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mt: 2.5 }}>
            {[
              { key: 'help.tagGas', defaultVal: 'Gas Refill' },
              { key: 'help.tagMoMo', defaultVal: 'Mobile Money Payout' },
              { key: 'help.tagWarranty', defaultVal: '14-Day Warranty' },
              { key: 'help.tagBecomePro', defaultVal: 'Become a Provider' },
              { key: 'help.tagDispute', defaultVal: 'Dispute Refund' },
            ].map((tagItem) => {
              const label = t(tagItem.key, tagItem.defaultVal);
              return (
                <Chip
                  key={tagItem.key}
                  label={label}
                  onClick={() => setSearchQuery(label)}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: 12,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.3)', color: '#FF6B00' },
                  }}
                />
              );
            })}
          </Box>

          {/* Prominent Articles Directory Button (Visible from First View) */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/help/articles"
              variant="outlined"
              size="medium"
              startIcon={<MenuBookIcon sx={{ color: '#FF6B00' }} />}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                textTransform: 'none',
                borderColor: '#FF6B00',
                color: '#FFFFFF',
                bgcolor: 'rgba(255, 107, 0, 0.18)',
                backdropFilter: 'blur(8px)',
                px: 3,
                py: 1,
                fontSize: { xs: 13, sm: 14 },
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.25s ease-in-out',
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 0, 0.35)',
                  borderColor: '#FF6B00',
                  color: '#FFFFFF',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255, 107, 0, 0.4)',
                },
              }}
            >
              {t('help.browseArticlesDirectory', 'Browse Complete Articles Directory →')}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
        {/* 2. Role Switcher Segmented Tabs */}
        <Paper
          elevation={4}
          sx={{
            p: 1,
            borderRadius: '16px',
            bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
            border: '1px solid',
            borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            mb: 5,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: { xs: 13, sm: 15 },
                textTransform: 'none',
                py: 1.8,
                color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#FFC4A8' : '#475569'),
                '&.Mui-selected': { color: '#FF6B00' },
              },
            }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label={t('help.tabCustomers', 'For Customers')} value="customers" />
            <Tab icon={<EngineeringIcon />} iconPosition="start" label={t('help.tabPros', 'For Service Providers')} value="pros" />
            <Tab icon={<SecurityIcon />} iconPosition="start" label={t('help.tabAccount', 'Account & Security')} value="account" />
          </Tabs>
        </Paper>

        {/* 3. Featured Topics Cards */}
        {searchQuery.trim() === '' && (
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontFamily: 'Space Grotesk, sans-serif',
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                ⭐ {t('help.featuredTopics', 'Featured Topics')}
              </Typography>
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
                <IconButton
                  onClick={() => handleScrollCarousel(featuredTopicsRef, 'left')}
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                    '&:hover': { bgcolor: '#FF6B00', color: '#FFFFFF', borderColor: '#FF6B00' },
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleScrollCarousel(featuredTopicsRef, 'right')}
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                    '&:hover': { bgcolor: '#FF6B00', color: '#FFFFFF', borderColor: '#FF6B00' },
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box
              ref={featuredTopicsRef}
              sx={{
                display: { xs: 'flex', sm: 'grid' },
                gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2.5,
                overflowX: { xs: 'auto', sm: 'visible' },
                scrollSnapType: { xs: 'x mandatory', sm: 'none' },
                pb: { xs: 1.5, sm: 0 },
                mx: { xs: -2, sm: 0 },
                px: { xs: 2, sm: 0 },
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {trendingFaqs.slice(0, 4).map((faq) => (
                <Box
                  key={`trend-${faq.id}`}
                  sx={{
                    flex: { xs: '0 0 82%', sm: 'none' },
                    scrollSnapAlign: 'center',
                    scrollSnapStop: 'always',
                    minWidth: 0,
                  }}
                >
                  <Paper
                    onClick={() => {
                      setActiveTab(faq.category);
                      setExpandedAccordion(faq.id);
                    }}
                    sx={{
                      p: 2.5,
                      height: '100%',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F8FAFC'),
                      border: '1px solid',
                      borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        borderColor: '#FF6B00',
                        boxShadow: '0 6px 20px rgba(255, 107, 0, 0.15)',
                      },
                    }}
                  >
                    <Chip
                      label={faq.subCategory}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 107, 0, 0.12)',
                        color: '#FF6B00',
                        fontWeight: 700,
                        fontSize: 11,
                        mb: 1.5,
                      }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'text.primary', mb: 1, lineHeight: 1.35 }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12, lineHeight: 1.45 }}>
                      {faq.answer.slice(0, 85)}...
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* 4. Filtered FAQ Accordion List */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              mb: 3,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {activeTab === 'customers' && <PersonIcon sx={{ color: '#FF6B00' }} />}
            {activeTab === 'pros' && <HandymanIcon sx={{ color: '#FF6B00' }} />}
            {activeTab === 'account' && <SecurityIcon sx={{ color: '#FF6B00' }} />}
            {activeTab === 'customers'
              ? t('help.kbCustomersTitle', 'Customer Support Knowledge Base')
              : activeTab === 'pros'
              ? t('help.kbProsTitle', 'Service Professional (Pro) Onboarding & Commission Guide')
              : t('help.kbAccountTitle', 'Account Security & Privacy Center')}
          </Typography>

          {filteredFaqs.length === 0 ? (
            <Paper
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: '16px',
                bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F8FAFC'),
                border: '1px dashed #FF6B00',
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'text.primary', mb: 1 }}>
                {t('help.noResultsFound', 'No matching help articles found for "{{query}}"', { query: searchQuery })}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                {t('help.noResultsSub', 'Try searching with different terms or speak directly with our 24/7 Supermarche Bot Support Desk.')}
              </Typography>
              <Button
                variant="contained"
                onClick={onOpenLiveChat}
                startIcon={<ChatIcon />}
                sx={{ bgcolor: '#FF6B00', color: '#FFFFFF', fontWeight: 700, px: 3, py: 1 }}
              >
                {t('help.chatWithSupportBtn', 'Chat with Supermarche Bot Support')}
              </Button>
            </Paper>
          ) : (
            filteredFaqs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expandedAccordion === faq.id}
                onChange={handleAccordionToggle(faq.id)}
                sx={{
                  mb: 1.5,
                  borderRadius: '12px !important',
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                  border: '1px solid',
                  borderColor: (theme: Theme) =>
                    expandedAccordion === faq.id ? '#FF6B00' : theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0',
                  boxShadow: expandedAccordion === faq.id ? '0 4px 20px rgba(255, 107, 0, 0.12)' : 'none',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FF6B00' }} />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', pr: 1 }}>
                    <Chip
                      label={faq.subCategory}
                      size="small"
                      sx={{
                        bgcolor: (theme: Theme) =>
                          theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.18)' : 'rgba(255, 107, 0, 0.1)',
                        color: '#FF6B00',
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>
                      {faq.question}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2.5, px: 3 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.65, fontSize: 15 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>

        {/* 4. Firebase Documentation Style Featured Knowledge Base Articles */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <MenuBookIcon sx={{ color: '#FF6B00', fontSize: 28 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {t('help.featuredDocsTitle', 'Featured Knowledge Base & Documentation')}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {t('help.featuredDocsSub', 'Firebase-styled official guides, dispatch rules, and emergency protocols')}
                </Typography>
              </Box>
            </Box>
            <Button
              component={RouterLink}
              to="/help/articles"
              variant="outlined"
              color="success"
              size="small"
              startIcon={<MenuBookIcon fontSize="small" />}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                textTransform: 'none',
                borderColor: '#FF6B00',
                color: '#FF6B00',
                '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' },
              }}
            >
              {t('help.browseArticlesDirectory', 'Browse Complete Articles Directory →')}
            </Button>
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
              <IconButton
                onClick={() => handleScrollCarousel(kbArticlesRef, 'left')}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                  '&:hover': { bgcolor: '#FF6B00', color: '#FFFFFF', borderColor: '#FF6B00' },
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => handleScrollCarousel(kbArticlesRef, 'right')}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                  '&:hover': { bgcolor: '#FF6B00', color: '#FFFFFF', borderColor: '#FF6B00' },
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box
            ref={kbArticlesRef}
            sx={{
              display: { xs: 'flex', sm: 'grid' },
              gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2.5,
              overflowX: { xs: 'auto', sm: 'visible' },
              scrollSnapType: { xs: 'x mandatory', sm: 'none' },
              pb: { xs: 1.5, sm: 0 },
              mx: { xs: -2, sm: 0 },
              px: { xs: 2, sm: 0 },
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {helpArticles.map((art) => (
              <Box
                key={art.id}
                sx={{
                  flex: { xs: '0 0 85%', sm: 'none' },
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always',
                  minWidth: 0,
                }}
              >
                <Paper
                  elevation={0}
                  onClick={() => setSelectedArticle(art)}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                    border: '1px solid',
                    borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      borderColor: '#FF6B00',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 24px rgba(255, 107, 0,0.15)',
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Chip
                        label={art.category}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 107, 0, 0.12)',
                          color: '#FF6B00',
                          fontWeight: 700,
                          fontSize: 10,
                        }}
                      />
                      {art.featured && (
                        <Chip label="FEATURED" size="small" color="success" sx={{ fontWeight: 700, fontSize: 9 }} />
                      )}
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 15, mb: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
                      {art.title}
                    </Typography>

                    <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.5, mb: 2 }}>
                      {art.summary}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'IBM Plex Mono, monospace' }}>
                      👁 {art.views} views
                    </Typography>
                    <Button size="small" startIcon={<DescriptionIcon />} sx={{ color: '#FF6B00', fontSize: 11, textTransform: 'none', fontWeight: 700 }}>
                      {t('help.readArticle', 'Read Article')}
                    </Button>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* 5. Contact & Escalation Support CTA Bar */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: '20px',
            bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
            border: '1px solid',
            borderColor: '#FF6B00',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'text.primary', mb: 1 }}>
              {t('help.ctaStillQuestions', 'Still have questions or need instant support?')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600 }}>
              {t('help.ctaDesc', 'Our dedicated Supermarche support team in Douala & Yaoundé is ready to assist you 24/7 with real-time runner dispatch updates.')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
            <Button
              variant="contained"
              onClick={onOpenLiveChat}
              startIcon={<ChatIcon />}
              sx={{
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 3,
                py: 1.2,
                borderRadius: '10px',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)',
                '&:hover': { bgcolor: '#E05D00' },
              }}
            >
              {t('help.chatWithSupport', 'Chat with Support')}
            </Button>

            <Button
              component="a"
              href="mailto:support@kimsstore.cm"
              variant="outlined"
              startIcon={<EmailIcon />}
              sx={{
                borderColor: '#FF6B00',
                color: '#FF6B00',
                fontWeight: 700,
                px: 3,
                py: 1.2,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)', borderColor: '#E05D00' },
              }}
            >
              {t('help.emailUs', 'Email Us: support@kimsstore.cm')}
            </Button>

            <Button
              variant="outlined"
              onClick={onOpenBooking}
              startIcon={<SmartphoneIcon />}
              sx={{
                borderColor: '#FF6B00',
                color: '#FF6B00',
                fontWeight: 700,
                px: 3,
                py: 1.2,
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)', borderColor: '#E05D00' },
              }}
            >
              {t('help.downloadAppBtn', 'Download App')}
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <Dialog open={Boolean(selectedArticle)} onClose={() => setSelectedArticle(null)} disableRestoreFocus maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip label={selectedArticle.category.toUpperCase()} size="small" color="success" sx={{ fontWeight: 700, fontSize: 10 }} />
            <IconButton size="small" onClick={() => setSelectedArticle(null)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', mb: 1.5 }}>
              {selectedArticle.title}
            </Typography>
            <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
              {selectedArticle.content}
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'rgba(255, 107, 0, 0.1)', borderRadius: '10px' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#FF6B00' }}>
                Was this article helpful?
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                {selectedArticle.helpfulCount} users found this guide helpful.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Button
              component={RouterLink}
              to={`/help/articles/${selectedArticle.id}`}
              variant="outlined"
              color="success"
              sx={{ borderColor: '#FF6B00', color: '#FF6B00', fontWeight: 700, borderRadius: '10px' }}
            >
              Open Full Sidebar View →
            </Button>
            <Button variant="contained" onClick={() => setSelectedArticle(null)} sx={{ bgcolor: '#FF6B00', borderRadius: '10px' }}>
              Close Article
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
