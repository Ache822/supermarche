import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { KBCategory, KBArticle } from '../../types/knowledgeBase.types';
import { BreadcrumbNav } from './BreadcrumbNav';
import { KnowledgeBaseSidebar } from './KnowledgeBaseSidebar';
import { ArticleReaderPane } from './ArticleReaderPane';
import { useAppSelector } from '../../../../store/hooks';
import api from '../../../../api/client';

interface KnowledgeBaseViewProps {
  categories?: KBCategory[];
  initialSelectedArticleId?: string;
  onOpenSupport?: () => void;
}

const DEFAULT_KB_CATEGORIES: KBCategory[] = [
  {
    id: 'cat-gas-safety',
    name: 'Gas Refills & Kitchen Safety',
    icon: 'flame',
    description: 'Guidelines on cylinder safety, regulator checks, and 30-minute delivery dispatch.',
    articles: [
      {
        id: 'art-gas-101',
        slug: 'gas-safety-guide',
        categoryId: 'cat-gas-safety',
        categoryName: 'Gas Refills & Kitchen Safety',
        title: 'Cooking Gas Cylinder Inspection & Safety Guide',
        summary: 'How Supermarche runners inspect cylinder valves, seals, and regulators before delivery.',
        verified: true,
        content: [
          {
            id: 'sec-1',
            subheading: 'Valve & Seal Integrity Inspection',
            body: 'Every cooking gas cylinder dispatched through Supermarche undergoes a mandatory 5-point leak check before delivery to your residence.',
          },
          {
            id: 'sec-2',
            subheading: 'Delivery & Setup Window',
            body: 'Runners arrive within 30–45 minutes of order confirmation and can assist with safe regulator connection upon request.',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-orders-delivery',
    name: 'Orders, Market & Delivery',
    icon: 'shopping_cart',
    description: 'How express market runs, prepped produce, and dispatch tracking work.',
    articles: [
      {
        id: 'art-market-101',
        slug: 'market-shopping-guide',
        categoryId: 'cat-orders-delivery',
        categoryName: 'Orders, Market & Delivery',
        title: 'How Fresh Market Shopping Runs Work',
        summary: 'Understanding produce selection, weight verification, and runner dispatch.',
        verified: true,
        content: [
          {
            id: 'sec-1',
            subheading: 'Fresh Produce Selection',
            body: 'Our trained market runners purchase fresh farm produce directly from verified local markets based on your item checklist.',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-payments-momo',
    name: 'Payments & Mobile Money Escrow',
    icon: 'payments',
    description: 'MTN MoMo, Orange Money, receipting, and cash-on-delivery payments.',
    articles: [
      {
        id: 'art-momo-101',
        slug: 'momo-payment-guide',
        categoryId: 'cat-payments-momo',
        categoryName: 'Payments & Mobile Money Escrow',
        title: 'Mobile Money Payment Security & Receipts',
        summary: 'How Mobile Money payments are secured during dispatch and delivery.',
        verified: true,
        content: [
          {
            id: 'sec-1',
            subheading: 'Payment Verification',
            body: 'You can pay via MTN MoMo, Orange Money, or Cash on Delivery. All digital payments issue an instant digital receipt in your app.',
          },
        ],
      },
    ],
  },
];

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  categories: propCategories,
  initialSelectedArticleId,
  onOpenSupport,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { i18n } = useTranslation();

  const reduxKbCategories = useAppSelector((state) => state.admin.kbCategories);
  const [dynamicCategories, setDynamicCategories] = useState<KBCategory[]>([]);

  useEffect(() => {
    const currentLang = i18n.language || 'en';
    api.articles
      .list<{ data?: Record<string, unknown>[]; articles?: Record<string, unknown>[] }>({ lang: currentLang })
      .then((res) => {
        const rawList = res?.data || res?.articles || (Array.isArray(res) ? res : []);
        if (rawList && rawList.length > 0) {
          const categoryMap: Record<string, KBArticle[]> = {};
          rawList.forEach((item: Record<string, unknown>) => {
            const catName = String(item.category || 'General');
            if (!categoryMap[catName]) {
              categoryMap[catName] = [];
            }
            const itemId = String(item.slug || item._id || item.id || '');
            const itemTitle = typeof item.title === 'string' ? item.title : String((item.title as Record<string, unknown>)?.[currentLang] || (item.title as Record<string, unknown>)?.en || '');
            const itemSummary = typeof item.summary === 'string' ? item.summary : String((item.summary as Record<string, unknown>)?.[currentLang] || (item.summary as Record<string, unknown>)?.en || '');
            const rawContent = typeof item.content === 'string' ? item.content : String((item.content as Record<string, unknown>)?.[currentLang] || (item.content as Record<string, unknown>)?.en || JSON.stringify(item.content || ''));

            categoryMap[catName].push({
              id: itemId,
              slug: itemId,
              categoryId: catName.toLowerCase().replace(/\s+/g, '-'),
              categoryName: catName,
              title: itemTitle,
              summary: itemSummary,
              content: [
                {
                  id: `sec-${itemId}`,
                  subheading: itemTitle,
                  body: rawContent,
                },
              ],
            });
          });

          const fetchedCategories: KBCategory[] = Object.entries(categoryMap).map(([name, articles], idx) => ({
            id: `cat-backend-${idx}`,
            name,
            icon: 'menu_book',
            articles,
          }));

          setDynamicCategories(fetchedCategories);
        }
      })
      .catch(() => {});
  }, [i18n.language]);

  const categories = useMemo(() => {
    if (propCategories && propCategories.length > 0) return propCategories;
    if (dynamicCategories.length > 0) return dynamicCategories;
    if (reduxKbCategories && reduxKbCategories.length > 0) return reduxKbCategories;
    return DEFAULT_KB_CATEGORIES;
  }, [propCategories, dynamicCategories, reduxKbCategories]);

  // State 1: Independent category drawer visibility state
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initialMap: Record<string, boolean> = {};
    if (categories.length > 0) {
      initialMap[categories[0].id] = true;
    }
    return initialMap;
  });

  // State 2: Independent selected article ID state
  const [selectedArticleId, setSelectedArticleId] = useState<string>(() => {
    if (initialSelectedArticleId) return initialSelectedArticleId;
    return categories[0]?.articles[0]?.id || '';
  });

  // Search filter query state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Explicit drawer toggle interaction — strictly isolated from article selection
  const toggleCategory = useCallback((categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  // Article selection — strictly isolated from category drawer expansion
  const selectArticle = useCallback((articleId: string) => {
    setSelectedArticleId(articleId);
  }, []);

  // Filtered categories based on real-time search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase().trim();
    return categories
      .map((cat) => {
        const categoryMatches = cat.name.toLowerCase().includes(query);
        const matchingArticles = cat.articles.filter(
          (art) =>
            art.title.toLowerCase().includes(query) ||
            art.summary.toLowerCase().includes(query) ||
            art.content.some(
              (sec) =>
                sec.subheading.toLowerCase().includes(query) ||
                sec.body.toLowerCase().includes(query)
            )
        );

        if (categoryMatches || matchingArticles.length > 0) {
          return {
            ...cat,
            articles: categoryMatches ? cat.articles : matchingArticles,
          };
        }
        return null;
      })
      .filter((cat): cat is KBCategory => cat !== null);
  }, [categories, searchQuery]);

  // Derived effective open categories — auto-expands on active search
  const effectiveOpenCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return openCategories;
    }
    const autoExpanded: Record<string, boolean> = { ...openCategories };
    filteredCategories.forEach((cat) => {
      if (cat.articles.length > 0) {
        autoExpanded[cat.id] = true;
      }
    });
    return autoExpanded;
  }, [searchQuery, openCategories, filteredCategories]);

  // Derived current article using useMemo
  const currentArticle = useMemo<KBArticle | null>(() => {
    for (const cat of categories) {
      const found = cat.articles.find((art) => art.id === selectedArticleId);
      if (found) return found;
    }
    return categories[0]?.articles[0] || null;
  }, [categories, selectedArticleId]);

  // Derived active category name for breadcrumb
  const currentCategory = useMemo<KBCategory | null>(() => {
    if (!currentArticle) return categories[0] || null;
    return categories.find((cat) => cat.id === currentArticle.categoryId) || null;
  }, [categories, currentArticle]);

  return (
    <Box
      sx={{
        pt: { xs: 12, md: 14 },
        pb: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
        bgcolor: isDark ? '#070b09' : '#f8fafc',
        color: isDark ? '#f8fafc' : '#0f172a',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <Container maxWidth="xl" disableGutters>
        {/* Dynamic Route Breadcrumb Navigation */}
        <BreadcrumbNav activeCategoryName={currentCategory?.name} />

        {/* 12-Column Responsive Layout Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' },
            gap: 3.5,
            alignItems: 'start',
          }}
        >
          {/* Left Column: Knowledge Base Sidebar (4 Columns on Desktop) */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 4' } }}>
            <KnowledgeBaseSidebar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={filteredCategories}
              openCategories={effectiveOpenCategories}
              onToggleCategory={toggleCategory}
              selectedArticleId={selectedArticleId}
              onSelectArticle={selectArticle}
            />
          </Box>

          {/* Right Column: Article Reader Pane (8 Columns on Desktop) */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 8' } }}>
            <ArticleReaderPane
              article={currentArticle}
              onOpenSupport={onOpenSupport}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
