import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ArticleIcon from '@mui/icons-material/Article';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import QuizIcon from '@mui/icons-material/Quiz';
import { FaqManagementPanel } from './FaqManagementPanel';
import { RichHtmlEditor } from '../../../components/ui/RichHtmlEditor';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import {
  addCategory,
  deleteCategory,
  setAdminCategories,
  setKBCategories,
  addKBCategory,
  deleteKBCategory,
  addKBArticle,
  updateKBArticle,
  deleteKBArticle,
  toggleKBArticleVerified,
} from '../store/adminSlice';
import { addServiceItem, setServices, deleteServiceItem } from '../../../store/servicesSlice';
import ReusableDataTable from '../../../components/ui/ReusableDataTable';
import type { ColumnDef } from '../../../components/ui/ReusableDataTable';
import { formatShortId } from '../../../utils/idHelper';
import type { ServiceItem } from '../../../types';
import type { KBArticle } from '../../help/types/knowledgeBase.types';
import api from '../../../api/client';
import adminService from '../../../services/adminService';
import { useToast } from '../../../context/useToast';

type FlatKBArticle = KBArticle & { categoryId: string; categoryName: string };

export function ContentManagementPanel() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.admin.categories || []);
  const services = useAppSelector((state) => state.services.items || []);
  const kbCategories = useAppSelector((state) => state.admin.kbCategories || []);

  const getTranslatedCategoryName = (name: string) => {
    const normalized = (name || '').toLowerCase().trim();
    if (i18n.language === 'fr') {
      if (normalized.includes('cooking gas')) return 'Gaz de Cuisine';
      if (normalized.includes('market shop')) return 'Marché & Courses';
      if (normalized.includes('school & market')) return 'Fournitures Scolaires & Marché';
      if (normalized.includes('school shop')) return 'Fournitures Scolaires';
      if (normalized.includes('cleaning')) return 'Nettoyage';
      if (normalized.includes('cctv') || normalized.includes('security')) return 'Caméras & Sécurité';
      if (normalized.includes('home & essential') || normalized.includes('services à domicile')) return 'Services à Domicile & Essentiels';
    }
    if (normalized.includes('safety') || normalized.includes('sécurité') || normalized.includes('regulations'))
      return t('admin.catSafety', 'Safety & Regulations');
    if (normalized.includes('booking') || normalized.includes('réservation') || normalized.includes('requests'))
      return t('admin.catBooking', 'Booking & Requests');
    if (normalized.includes('payment') || normalized.includes('paiement') || normalized.includes('pricing'))
      return t('admin.catPayments', 'Payments & Pricing');
    if (normalized.includes('getting started') || normalized.includes('départ') || normalized.includes('onboarding'))
      return t('admin.catOnboarding', 'Getting Started & Onboarding');
    if (normalized.includes('home & essential') || normalized.includes('domicile'))
      return t('admin.catHomeEssential', 'Home & Essential Services');
    return name;
  };

  useEffect(() => {
    const currentLang = i18n.language || 'en';
    Promise.all([
      adminService.getServices().catch(() => []),
      api.get('/services/categories', { lang: currentLang }).catch(() => []),
      api.articles.list<{ data?: Record<string, unknown>[]; articles?: Record<string, unknown>[] }>({ lang: currentLang }).catch(() => ({ data: [] })),
    ])
      .then(([srvRes, catRes, artRes]: [unknown, unknown, unknown]) => {
        if (Array.isArray(srvRes)) {
          dispatch(setServices(srvRes as ServiceItem[]));
        }
        const data = (Array.isArray(catRes)
          ? catRes
          : (catRes as { data?: unknown[] })?.data || []) as Record<string, unknown>[];
        const formatted = data.map((c, idx) => ({
          id: String(c.id || c._id || `cat-${idx}`),
          name: String(c.name || 'Category'),
          slug: String(c.slug || c.name?.toString().toLowerCase().replace(/\s+/g, '-') || 'cat'),
          description: String(c.description || ''),
          active: c.active !== false,
          serviceCount: Number(c.serviceCount || c.servicesCount || 0),
          iconName: String(c.iconName || 'Grid'),
          display_order: Number(c.display_order || 1),
          parent: c.parent ? String(c.parent) : null,
        }));
        dispatch(setAdminCategories(formatted));

        const rawArticles = (artRes as { data?: Record<string, unknown>[]; articles?: Record<string, unknown>[] })?.data ||
          (artRes as { data?: Record<string, unknown>[]; articles?: Record<string, unknown>[] })?.articles ||
          (Array.isArray(artRes) ? artRes : []);
        
        const categoryMap: Record<string, KBArticle[]> = {};

        // Merge backend articles from MongoDB
        if (Array.isArray(rawArticles) && rawArticles.length > 0) {
          rawArticles.forEach((item: Record<string, unknown>) => {
            const catName = String(item.category || 'Booking & Requests');
            const catId = catName.toLowerCase().replace(/\s+/g, '-');
            if (!categoryMap[catName]) {
              categoryMap[catName] = [];
            }
            const itemId = String(item.slug || item._id || item.id || `art-${Date.now()}`);
            const itemTitle = typeof item.title === 'string' ? item.title : String((item.title as Record<string, unknown>)?.en || (item.title as Record<string, unknown>)?.fr || '');
            const itemSummary = typeof item.summary === 'string' ? item.summary : String((item.summary as Record<string, unknown>)?.en || (item.summary as Record<string, unknown>)?.fr || '');
            const itemContent = typeof item.content === 'string' ? item.content : String((item.content as Record<string, unknown>)?.en || (item.content as Record<string, unknown>)?.fr || JSON.stringify(item.content || ''));

            const existingIdx = categoryMap[catName].findIndex((a) => a.id === itemId || a.slug === itemId);
            const articleObj: KBArticle = {
              id: itemId,
              slug: itemId,
              categoryId: catId,
              categoryName: catName,
              title: itemTitle,
              summary: itemSummary,
              verified: item.verified !== false,
              views: Number(item.views || item.reads || 1),
              helpfulCount: Number(item.helpfulCount || item.helpful_count || 0),
              content: [
                {
                  id: `sec-${itemId}`,
                  subheading: itemTitle,
                  body: itemContent,
                },
              ],
            };

            if (existingIdx >= 0) {
              categoryMap[catName][existingIdx] = articleObj;
            } else {
              categoryMap[catName].push(articleObj);
            }
          });
        }

        const fetchedKbCategories = Object.entries(categoryMap).map(([name, artList]) => ({
          id: name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
          name,
          icon: 'menu_book',
          description: 'System Knowledge Base Drawer',
          articles: artList,
        }));

        dispatch(setKBCategories(fetchedKbCategories));
      })
      .catch(() => {});
  }, [dispatch, i18n.language]);

  const [activeContentTab, setActiveContentTab] = useState(0);
  const [selectedCatId, setSelectedCatId] = useState<string>('all');

  // Infinite Scroll & Search State for Categories Sidebar
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [visibleCatLimit, setVisibleCatLimit] = useState(5);
  const [loadingMoreCats, setLoadingMoreCats] = useState(false);

  // Modals
  const [addCatModalOpen, setAddCatModalOpen] = useState(false);
  const [addKbCatModalOpen, setAddKbCatModalOpen] = useState(false);
  const [addArtModalOpen, setAddArtModalOpen] = useState(false);
  const [editArtModalOpen, setEditArtModalOpen] = useState(false);
  const [addSrvModalOpen, setAddSrvModalOpen] = useState(false);

  // New Category Form
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Grid');

  // KB Category Form
  const [kbCatName, setKbCatName] = useState('');
  const [kbCatDesc, setKbCatDesc] = useState('');

  // Service Form
  const [srvId, setSrvId] = useState('');
  const [srvTitle, setSrvTitle] = useState('');
  const [srvCategoryId, setSrvCategoryId] = useState('');
  const [srvPriceRange, setSrvPriceRange] = useState('6,500 XAF');
  const [srvEstimatedTime, setSrvEstimatedTime] = useState('15 - 30 mins');
  const [srvIconName, setSrvIconName] = useState('Flame');
  const [srvImageUrl, setSrvImageUrl] = useState('');
  const [srvFeatured, setSrvFeatured] = useState(true);
  const [srvIsLive, setSrvIsLive] = useState(true);
  const [srvDescription, setSrvDescription] = useState('');

  // KB Article Form (Add & Edit)
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artCatId, setArtCatId] = useState('');
  const [artSummary, setArtSummary] = useState('');
  const [artBody, setArtBody] = useState('');
  const [artVerified, setArtVerified] = useState(true);

  // Flattened Knowledge Base Articles
  const allKbArticles = useMemo(() => {
    const list: FlatKBArticle[] = [];
    kbCategories.forEach((cat) => {
      cat.articles.forEach((art) => {
        list.push({
          ...art,
          categoryId: cat.id,
          categoryName: cat.name,
        });
      });
    });
    return list;
  }, [kbCategories]);

  // Filtered categories by search query
  const searchedCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(catSearchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(catSearchQuery.toLowerCase()))
  );

  const visibleCategories = searchedCategories.slice(0, visibleCatLimit);
  const hasMoreCategories = visibleCatLimit < searchedCategories.length;

  const handleCatListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 25) {
      if (hasMoreCategories && !loadingMoreCats) {
        setLoadingMoreCats(true);
        setTimeout(() => {
          setVisibleCatLimit((prev) => Math.min(prev + 5, searchedCategories.length));
          setLoadingMoreCats(false);
        }, 350);
      }
    }
  };

  const handleAddCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    const finalSlug = catSlug || catName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const newCat = {
      name: catName,
      slug: finalSlug,
      description: catDesc,
      active: true,
      iconName: catIcon,
      display_order: 1,
      parent: null,
    };
    dispatch(addCategory(newCat));

    try {
      await api.post('/services/categories', newCat);
    } catch {
      // Optimistic UI fallback
    }

    setAddCatModalOpen(false);
    setSelectedCatId(finalSlug);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatIcon('Grid');
  };

  const handleAddKbCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbCatName) return;
    dispatch(addKBCategory({ name: kbCatName, description: kbCatDesc }));
    setAddKbCatModalOpen(false);
    setKbCatName('');
    setKbCatDesc('');
  };

  const handleAddServiceItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvTitle || !srvPriceRange || !srvDescription) return;

    const selectedCategoryObj = categories.find((c) => c.id === srvCategoryId || c.slug === srvCategoryId);

    const payload: ServiceItem = {
      id: srvId || `srv-${Date.now().toString(36)}`,
      title: srvTitle,
      category: srvCategoryId || (categories[0]?.id || 'gas'),
      categoryLabel: selectedCategoryObj?.name || 'General Service',
      description: srvDescription,
      priceRange: srvPriceRange,
      estimatedTime: srvEstimatedTime || '15 - 30 mins',
      iconName: srvIconName || 'Flame',
      isLive: srvIsLive,
      featured: srvFeatured,
      imageUrl: srvImageUrl || '/images/gas_delivery.png',
    };

    dispatch(addServiceItem(payload));
    setAddSrvModalOpen(false);

    try {
      await api.post('/services', payload);
    } catch {
      // Optimistic UI fallback
    }

    setSrvId('');
    setSrvTitle('');
    setSrvPriceRange('6,500 XAF');
    setSrvEstimatedTime('15 - 30 mins');
    setSrvIconName('Flame');
    setSrvImageUrl('');
    setSrvFeatured(true);
    setSrvIsLive(true);
    setSrvDescription('');
  };

  const handleAddKBArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artSummary) return;
    const catId = artCatId || (kbCategories[0]?.id || 'cat-booking');
    const selectedCat = kbCategories.find((c) => c.id === catId);
    const catName = selectedCat?.name || 'General';

    dispatch(
      addKBArticle({
        categoryId: catId,
        title: artTitle,
        summary: artSummary,
        bodyText: artBody || artSummary,
        verified: artVerified,
      })
    );

    setAddArtModalOpen(false);

    try {
      const generatedSlug = artTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-');

      await api.articles.create({
        slug: generatedSlug,
        title: { en: artTitle, fr: artTitle },
        summary: { en: artSummary, fr: artSummary },
        content: { en: artBody || artSummary, fr: artBody || artSummary },
        category: catName,
        author: 'Supermarche Team',
        is_published: true,
      });
    } catch (err: unknown) {
      console.warn('Failed to save article to backend MongoDB:', err);
    }

    setArtTitle('');
    setArtSummary('');
    setArtBody('');
    setArtVerified(true);
  };

  const handleOpenEditArticleModal = (article: FlatKBArticle) => {
    setEditingArticleId(article.id);
    setArtTitle(article.title);
    setArtCatId(article.categoryId);
    setArtSummary(article.summary);
    setArtBody(article.content[0]?.body || article.summary);
    setArtVerified(Boolean(article.verified));
    setEditArtModalOpen(true);
  };

  const handleEditKBArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticleId || !artTitle || !artSummary) return;

    const catId = artCatId || (kbCategories[0]?.id || 'cat-booking');
    const selectedCat = kbCategories.find((c) => c.id === catId);
    const catName = selectedCat?.name || 'General';

    dispatch(
      updateKBArticle({
        articleId: editingArticleId,
        title: artTitle,
        summary: artSummary,
        bodyText: artBody,
        verified: artVerified,
        categoryId: artCatId,
      })
    );

    setEditArtModalOpen(false);

    try {
      await api.articles.update(editingArticleId, {
        title: { en: artTitle, fr: artTitle },
        summary: { en: artSummary, fr: artSummary },
        content: { en: artBody || artSummary, fr: artBody || artSummary },
        category: catName,
        is_published: true,
      });
    } catch (err: unknown) {
      console.warn('Failed to update article in backend MongoDB:', err);
    }

    setEditingArticleId(null);
    setArtTitle('');
    setArtSummary('');
    setArtBody('');
    setArtVerified(true);
  };

  const handleDeleteKBArticle = (artId: string) => {
    toast.confirm({
      title: 'Delete KB Article',
      message: 'Are you sure you want to delete this Knowledge Base article?',
      confirmText: 'Delete Article',
      color: 'error',
      onConfirm: async () => {
        dispatch(deleteKBArticle(artId));
        try {
          await api.articles.delete(artId);
          toast.success('Knowledge Base article deleted.');
        } catch (err: unknown) {
          console.warn('Failed to delete article from backend MongoDB:', err);
        }
      },
    });
  };

  const handleDeleteKBCategory = (catId: string) => {
    toast.confirm({
      title: 'Delete KB Category',
      message: 'Are you sure you want to delete this Knowledge Base category and all its articles?',
      confirmText: 'Delete Category',
      color: 'error',
      onConfirm: async () => {
        const cat = kbCategories.find((c) => c.id === catId);
        dispatch(deleteKBCategory(catId));

        if (cat && cat.articles) {
          try {
            await Promise.all(cat.articles.map((art) => api.articles.delete(art.id).catch(() => {})));
          } catch (err: unknown) {
            console.warn('Failed to delete category articles from backend:', err);
          }
        }
        toast.success('Knowledge Base category purged.');
      },
    });
  };

  const handleDeleteCategory = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.confirm({
      title: 'Delete Service Category',
      message: 'Are you sure you want to delete this service category?',
      confirmText: 'Delete Category',
      color: 'error',
      onConfirm: async () => {
        dispatch(deleteCategory(catId));
        try {
          await api.delete(`/services/categories/${catId}`);
        } catch {
          // Optimistic UI fallback
        }
        toast.success('Service category deleted.');
      },
    });
  };

  const handleDeleteService = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.confirm({
      title: 'Delete Service Item',
      message: 'Are you sure you want to delete this service item?',
      confirmText: 'Delete Service',
      color: 'error',
      onConfirm: async () => {
        dispatch(deleteServiceItem(serviceId));
        try {
          await api.delete(`/services/${serviceId}`);
        } catch {
          // Optimistic UI fallback
        }
        toast.success('Service item deleted.');
      },
    });
  };

  const filteredKBArticles = useMemo(() => {
    if (selectedCatId === 'all') return allKbArticles;
    return allKbArticles.filter(
      (art) =>
        art.categoryId.toLowerCase() === selectedCatId.toLowerCase() ||
        art.categoryName.toLowerCase().includes(selectedCatId.toLowerCase())
    );
  }, [allKbArticles, selectedCatId]);

  const filteredServices = services.filter((srv) => {
    if (selectedCatId === 'all') return true;
    const catStr =
      typeof srv.category === 'string'
        ? srv.category
        : srv.category?.id || srv.category?.slug || srv.category?.name || '';
    return (
      catStr.toLowerCase() === selectedCatId.toLowerCase() ||
      (srv.categoryLabel && srv.categoryLabel.toLowerCase().includes(selectedCatId.toLowerCase()))
    );
  });

  const kbArticleColumns: ColumnDef<FlatKBArticle>[] = [
    {
      id: 'id',
      label: t('admin.colArticleId', 'ARTICLE ID'),
      width: '12%',
      render: (row) => (
        <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 700, color: 'text.secondary' }}>
          {formatShortId(row.id, 'ART')}
        </Typography>
      ),
    },
    {
      id: 'title',
      label: t('admin.colArticleTitleSummary', 'ARTICLE TITLE & SUMMARY'),
      width: '38%',
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }} noWrap>
            {row.title}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
            {row.summary}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'category',
      label: t('admin.colCategoryDrawer', 'CATEGORY DRAWER'),
      width: '18%',
      render: (row) => (
        <Chip
          label={getTranslatedCategoryName(row.categoryName)}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: 10,
            bgcolor: 'rgba(22, 163, 74, 0.15)',
            color: '#16a34a',
          }}
        />
      ),
    },
    {
      id: 'verified',
      label: t('admin.colVerified', 'VERIFIED'),
      width: '12%',
      render: (row) => (
        <Tooltip title="Toggle Verified Guide Badge">
          <Chip
            icon={<VerifiedIcon sx={{ fontSize: '13px !important' }} />}
            label={row.verified ? t('admin.badgeVerified', 'Verified') : t('admin.badgeDraft', 'Draft')}
            size="small"
            clickable
            onClick={() => {
              const nextState = !row.verified;
              dispatch(toggleKBArticleVerified(row.id));
              api.patch(`/articles/${row.id}/verified`, { verified: nextState }).catch(() => {});
            }}
            color={row.verified ? 'success' : 'default'}
            sx={{ fontSize: 10, fontWeight: 700 }}
          />
        </Tooltip>
      ),
    },
    {
      id: 'views',
      label: t('admin.colReads', 'READS'),
      width: '8%',
      render: (row) => (
        <Typography sx={{ fontSize: 11, fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace' }}>
          👁 {row.views}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: t('admin.colActions', 'ACTIONS'),
      width: '12%',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Edit Article">
            <IconButton
              size="small"
              onClick={() => handleOpenEditArticleModal(row)}
              sx={{ color: '#FF6B00', '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' } }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Article">
            <IconButton
              size="small"
              onClick={() => handleDeleteKBArticle(row.id)}
              sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <Grid container spacing={3} sx={{ maxHeight: '100%', flex: 1, minHeight: 0 }}>
        {/* Left Sidebar: Categories Management */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ maxHeight: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              maxHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon sx={{ color: '#FF6B00' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 15, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {t('admin.kbServiceCategoriesTitle', 'KB & Service Categories')}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setAddKbCatModalOpen(true)} sx={{ color: '#FF6B00' }}>
                <AddIcon />
              </IconButton>
            </Box>

            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1.5, flexShrink: 0 }}>
              {t('admin.kbServiceCategoriesSub', 'Manage Knowledge Base drawers and system service categories.')}
            </Typography>

            {/* Quick Search */}
            <TextField
              size="small"
              placeholder={t('admin.searchCategoriesPlaceholder', 'Search categories...')}
              value={catSearchQuery}
              onChange={(e) => {
                setCatSearchQuery(e.target.value);
                setVisibleCatLimit(5);
              }}
              fullWidth
              sx={{
                mb: 1.5,
                flexShrink: 0,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  fontSize: 13,
                  '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Categories List */}
            <Box
              onScroll={handleCatListScroll}
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                pr: 0.5,
                mb: 1.5,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 107, 0, 0.4)', borderRadius: '4px' },
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF6B00', letterSpacing: '0.05em', display: 'block', mb: 1, textTransform: 'uppercase' }}>
                {t('admin.kbDrawersHeader', 'KNOWLEDGE BASE DRAWERS')} ({kbCategories.length})
              </Typography>
              <List disablePadding sx={{ mb: 2 }}>
                <ListItem
                  component="div"
                  onClick={() => setSelectedCatId('all')}
                  sx={{
                    borderRadius: '10px',
                    cursor: 'pointer',
                    mb: 1,
                    bgcolor: selectedCatId === 'all' ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CategoryIcon sx={{ color: selectedCatId === 'all' ? '#FF6B00' : 'text.disabled', fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: selectedCatId === 'all' ? 700 : 500, fontSize: 13 }}>
                        {t('admin.allKbCategories', 'All KB Categories')} ({allKbArticles.length} {t('admin.articlesCountUnit', 'Articles')})
                      </Typography>
                    }
                  />
                </ListItem>

                {kbCategories.map((cat) => (
                  <ListItem
                    key={cat.id}
                    component="div"
                    onClick={() => setSelectedCatId(cat.id)}
                    secondaryAction={
                      <IconButton size="small" onClick={() => handleDeleteKBCategory(cat.id)} sx={{ color: '#ef4444' }}>
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    }
                    sx={{
                      borderRadius: '10px',
                      cursor: 'pointer',
                      mb: 0.5,
                      bgcolor: selectedCatId === cat.id ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.08)' },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: selectedCatId === cat.id ? 700 : 500, fontSize: 13 }} noWrap>
                          {getTranslatedCategoryName(cat.name)} ({cat.articles.length})
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em', display: 'block', mb: 1, textTransform: 'uppercase' }}>
                {t('admin.serviceCategoriesHeader', 'SERVICE CATEGORIES')} ({categories.length})
              </Typography>
              <List disablePadding>
                {visibleCategories.map((cat) => (
                  <ListItem
                    key={cat.id}
                    component="div"
                    onClick={() => setSelectedCatId(cat.slug)}
                    secondaryAction={
                      <IconButton size="small" onClick={(e) => handleDeleteCategory(cat.id, e)} sx={{ color: '#ef4444' }}>
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    }
                    sx={{
                      borderRadius: '10px',
                      cursor: 'pointer',
                      mb: 0.5,
                      bgcolor: selectedCatId === cat.slug ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.08)' },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: selectedCatId === cat.slug ? 700 : 500, fontSize: 13 }} noWrap>
                          {getTranslatedCategoryName(cat.name)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Category action buttons removed */}
          </Paper>
        </Grid>

        {/* Right Area: Knowledge Base Articles & Dynamic Services Tabs */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ maxHeight: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Tabs
              value={activeContentTab}
              onChange={(_, v) => setActiveContentTab(v)}
              sx={{
                '& .Mui-selected': { color: '#FF6B00 !important' },
                '& .MuiTabs-indicator': { bgcolor: '#FF6B00' },
              }}
            >
              <Tab icon={<ArticleIcon fontSize="small" />} iconPosition="start" label={t('admin.tabKbArticles', 'Knowledge Base & Help Articles')} />
              <Tab icon={<DesignServicesIcon fontSize="small" />} iconPosition="start" label={t('admin.tabServicesCatalog', 'Dynamic Services Catalog')} />
              <Tab icon={<QuizIcon fontSize="small" />} iconPosition="start" label={t('admin.tabFaqDirectory', 'FAQ Directory & Accordion')} />
            </Tabs>
          </Box>

          {activeContentTab === 0 && (
            <ReusableDataTable
              title={t('admin.kbArticlesTitle', 'Help Center & Knowledge Articles')}
              subtitle={t('admin.kbArticlesSub', 'Manage articles, user guides, and FAQs displayed on the user Help Center')}
              columns={kbArticleColumns}
              data={filteredKBArticles}
              keyExtractor={(row) => row.id}
              searchPlaceholder={t('admin.searchKbArticlesPlaceholder', 'Search Knowledge Base articles...')}
              enableInfiniteScroll={true}
              headerActions={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    if (selectedCatId && selectedCatId !== 'all') {
                      setArtCatId(selectedCatId);
                    } else if (kbCategories.length > 0) {
                      setArtCatId(kbCategories[0].id);
                    }
                    setAddArtModalOpen(true);
                  }}
                  sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' }, fontWeight: 700, textTransform: 'none', borderRadius: '10px' }}
                >
                  {t('admin.newKbArticleBtn', 'New KB Article')}
                </Button>
              }
            />
          )}

          {activeContentTab === 1 && (
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {t('admin.storedServicesTitle', 'Stored System Services')} ({filteredServices.length})
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {t('admin.storedServicesSub', 'Services stored dynamically in system and rendered on mobile & web app views.')}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    if (selectedCatId && selectedCatId !== 'all') {
                      setSrvCategoryId(selectedCatId);
                    }
                    setAddSrvModalOpen(true);
                  }}
                  sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' }, fontWeight: 700, textTransform: 'none', borderRadius: '10px' }}
                >
                  {t('admin.newServiceBtn', 'New Service Item')}
                </Button>
              </Box>

              <Grid container spacing={2}>
                {filteredServices.map((srv) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={srv.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 1.5,
                      }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{srv.title}</Typography>
                          <IconButton size="small" onClick={(e) => handleDeleteService(srv.id, e)} sx={{ color: '#ef4444' }}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                        <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>
                          {srv.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={
                              typeof srv.categoryLabel === 'string'
                                ? srv.categoryLabel
                                : typeof srv.category === 'string'
                                ? srv.category
                                : 'General Service'
                            }
                            size="small"
                            sx={{ fontSize: 10, fontWeight: 600 }}
                          />
                          <Chip label={srv.priceRange} size="small" color="success" sx={{ fontSize: 10, fontWeight: 700 }} />
                          <Chip label={srv.estimatedTime} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {activeContentTab === 2 && <FaqManagementPanel />}
        </Grid>
      </Grid>

      {/* Modal: Add New KB Category */}
      <Dialog open={addKbCatModalOpen} onClose={() => setAddKbCatModalOpen(false)} disableRestoreFocus maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>New KB Category Drawer</Typography>
          <IconButton size="small" onClick={() => setAddKbCatModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleAddKbCategory}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Category Name"
              required
              fullWidth
              size="small"
              placeholder="e.g. Mobile Money & Refunds"
              value={kbCatName}
              onChange={(e) => setKbCatName(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              size="small"
              placeholder="Brief summary of articles inside this drawer..."
              value={kbCatDesc}
              onChange={(e) => setKbCatDesc(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAddKbCatModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}>
              Create Drawer
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Modal: Add New KB Article */}
      <Dialog open={addArtModalOpen} onClose={() => setAddArtModalOpen(false)} disableRestoreFocus maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>New Knowledge Base Article</Typography>
          <IconButton size="small" onClick={() => setAddArtModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleAddKBArticleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              label="KB Category Drawer"
              required
              fullWidth
              size="small"
              value={artCatId}
              onChange={(e) => setArtCatId(e.target.value)}
            >
              {kbCategories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Article Title"
              required
              fullWidth
              size="small"
              placeholder="e.g. How to Track Runner GPS Location Live"
              value={artTitle}
              onChange={(e) => setArtTitle(e.target.value)}
            />

            <TextField
              label="Article Summary"
              required
              multiline
              rows={2}
              fullWidth
              size="small"
              placeholder="Short summary displayed in lists and search results..."
              value={artSummary}
              onChange={(e) => setArtSummary(e.target.value)}
            />

            <RichHtmlEditor
              label="Detailed Guide Body / Instructions (HTML Supported)"
              value={artBody}
              onChange={setArtBody}
              placeholder="Step-by-step instructions or HTML markup (<p>, <strong>, <ul>, etc.)..."
              minRows={5}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={artVerified}
                  onChange={(e) => setArtVerified(e.target.checked)}
                  sx={{ color: '#FF6B00', '&.Mui-checked': { color: '#FF6B00' } }}
                />
              }
              label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>Mark as Verified Guide</Typography>}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAddArtModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}>
              Publish KB Article
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Modal: Edit KB Article */}
      <Dialog open={editArtModalOpen} onClose={() => setEditArtModalOpen(false)} disableRestoreFocus maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Edit Knowledge Base Article</Typography>
          <IconButton size="small" onClick={() => setEditArtModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleEditKBArticleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              label="KB Category Drawer"
              required
              fullWidth
              size="small"
              value={artCatId}
              onChange={(e) => setArtCatId(e.target.value)}
            >
              {kbCategories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Article Title"
              required
              fullWidth
              size="small"
              value={artTitle}
              onChange={(e) => setArtTitle(e.target.value)}
            />

            <TextField
              label="Article Summary"
              required
              multiline
              rows={2}
              fullWidth
              size="small"
              value={artSummary}
              onChange={(e) => setArtSummary(e.target.value)}
            />

            <RichHtmlEditor
              label="Detailed Guide Body / Instructions (HTML Supported)"
              value={artBody}
              onChange={setArtBody}
              placeholder="Step-by-step instructions or HTML markup (<p>, <strong>, <ul>, etc.)..."
              minRows={5}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={artVerified}
                  onChange={(e) => setArtVerified(e.target.checked)}
                  sx={{ color: '#FF6B00', '&.Mui-checked': { color: '#FF6B00' } }}
                />
              }
              label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>Mark as Verified Guide</Typography>}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditArtModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}>
              Save Article Changes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Modal: Add Service Category */}
      <Dialog open={addCatModalOpen} onClose={() => setAddCatModalOpen(false)} disableRestoreFocus maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>New Service Category</Typography>
          <IconButton size="small" onClick={() => setAddCatModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleAddCat}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Category Name"
              required
              fullWidth
              size="small"
              value={catName}
              onChange={(e) => {
                setCatName(e.target.value);
                setCatSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
              }}
            />
            <TextField
              label="Slug"
              fullWidth
              size="small"
              value={catSlug}
              onChange={(e) => setCatSlug(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              size="small"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAddCatModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}>
              Create Category
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Modal: Add Service Item */}
      <Dialog open={addSrvModalOpen} onClose={() => setAddSrvModalOpen(false)} disableRestoreFocus maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Create Service Item</Typography>
          <IconButton size="small" onClick={() => setAddSrvModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleAddServiceItem}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Unique Service ID"
                required
                fullWidth
                size="small"
                value={srvId}
                onChange={(e) => setSrvId(e.target.value)}
              />
              <TextField
                select
                label="Category"
                required
                fullWidth
                size="small"
                value={srvCategoryId}
                onChange={(e) => setSrvCategoryId(e.target.value)}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              label="Service Title"
              required
              fullWidth
              size="small"
              value={srvTitle}
              onChange={(e) => setSrvTitle(e.target.value)}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Price Rate"
                required
                fullWidth
                size="small"
                value={srvPriceRange}
                onChange={(e) => setSrvPriceRange(e.target.value)}
              />
              <TextField
                label="Estimated Duration"
                required
                fullWidth
                size="small"
                value={srvEstimatedTime}
                onChange={(e) => setSrvEstimatedTime(e.target.value)}
              />
            </Box>

            <RichHtmlEditor
              label="Service Description (HTML Supported)"
              value={srvDescription}
              onChange={setSrvDescription}
              placeholder="Enter service overview or HTML markup (<p>, <strong>, <ul>, etc.)..."
              minRows={3}
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAddSrvModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}>
              Create Service Item
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default ContentManagementPanel;
