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
    id: 'cat-about-kims-store',
    name: "About Kim's Store & Collections",
    icon: 'Shield',
    description: "Learn about Kim's Store, our lifestyle departments, quality standards, and mascot Kimzy.",
    articles: [
      {
        id: 'art-about-101',
        slug: 'about-kims-store',
        categoryId: 'cat-about-kims-store',
        categoryName: "About Kim's Store & Collections",
        title: "Welcome to Kim's Store — Modern Lifestyle & Express Shopping",
        summary: "Discover Cameroon's premier multi-department online store offering trending fashion, sneakers, tech, and express supermarket essentials.",
        verified: true,
        content: [
          {
            id: 'sec-1',
            subheading: "Who We Are & What We Curate",
            body: "Kim's Store is Cameroon's modern department store and express supermarket. We offer a handpicked selection of top urban streetwear, trending sneakers, premium cosmetics and skincare, smartphone and tech gadgets, as well as fresh daily groceries.",
          },
          {
            id: 'sec-2',
            subheading: "100% Authentic Quality Guarantee",
            body: "Every single item listed on Kim's Store is thoroughly inspected for authenticity and quality before dispatch. We partner directly with verified distributors and official brand representatives.",
          },
          {
            id: 'sec-3',
            subheading: "Meet Kimzy, Your Virtual Shopping Assistant",
            body: "Kimzy is our stylish mascot and dedicated shopping assistant. Kimzy helps you discover hot drops, check size fits, track your delivery runner, and answers customer care questions 24/7.",
          },
        ],
      },
    ],
  },
  {
    id: 'cat-orders-delivery',
    name: 'Orders, Shipping & Delivery',
    icon: 'Assignment',
    description: 'Delivery timelines, express dispatch, packaging standards, and tracking your order with Kimzy.',
    articles: [
      {
        id: 'art-delivery-101',
        slug: 'kims-store-delivery-guide',
        categoryId: 'cat-orders-delivery',
        categoryName: 'Orders, Shipping & Delivery',
        title: 'Express Doorstep Delivery Across Cameroon — How It Works',
        summary: 'Delivery times, city hub coverage in Douala, Yaoundé, Buea, Bamenda, and real-time order tracking.',
        verified: true,
        content: [
          {
            id: 'sec-1',
            subheading: 'Delivery Times & Coverage Zones',
            body: "We operate dedicated delivery hubs across Douala, Yaoundé, Buea, and Bamenda. Express supermarket items arrive within 45 to 90 minutes, while fashion drops, sneakers, and electronics are delivered same-day or within scheduled morning/evening windows.",
          },
          {
            id: 'sec-2',
            subheading: 'Live Delivery Tracking with Kimzy',
            body: 'Once your order is confirmed, you receive an instant SMS tracking link and can follow your delivery runner on the live web map. You can also ask Kimzy in the bottom-right chat widget for an instant delivery status update.',
          },
          {
            id: 'sec-3',
            subheading: 'Secure Tamper-Evident Packaging',
            body: 'All clothing, footwear, cosmetics, and electronics are packaged in branded protective sleeves to guarantee they reach your doorstep in pristine condition.',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-payments-momo',
    name: 'Payments, Mobile Money & Receipts',
    icon: 'AccountBalanceWallet',
    description: 'MTN Mobile Money, Orange Money, Cash on Delivery, digital receipts, and secure checkout.',
    articles: [
      {
        id: 'art-momo-101',
        slug: 'payment-momo-security-guide',
        categoryId: 'cat-payments-momo',
        categoryName: 'Payments, Mobile Money & Receipts',
        title: 'Mobile Money Payment Security & Instant Receipts',
        summary: 'How payments work with MTN MoMo, Orange Money, Cash on Delivery, and instant invoices.',
        verified: true,
        content: [
          {
            id: 'sec-1',
            subheading: 'Seamless Mobile Money Checkout',
            body: 'Pay instantly using MTN Mobile Money or Orange Money directly at checkout with zero hidden surcharge fees. Simply confirm the USSD prompt on your phone.',
          },
          {
            id: 'sec-2',
            subheading: 'Cash on Delivery (COD)',
            body: 'For eligible items and delivery addresses in Douala and Yaoundé, you may choose Cash on Delivery and pay your runner in cash or via MoMo transfer upon package handoff.',
          },
          {
            id: 'sec-3',
            subheading: 'Instant Digital Invoices',
            body: 'Every completed purchase generates an official PDF invoice accessible in your user dashboard and dispatched to your email address.',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-returns-guarantee',
    name: 'Returns, Exchanges & Size Guide',
    icon: 'Lock',
    description: 'Our 7-day size exchange guarantee, return criteria, and sneaker sizing charts.',
    articles: [
      {
        id: 'art-returns-101',
        slug: 'returns-exchanges-warranty',
        categoryId: 'cat-returns-guarantee',
        categoryName: 'Returns, Exchanges & Size Guide',
        title: '7-Day Easy Size Exchanges & Returns Policy',
        summary: 'Hassle-free size exchanges for shoes and apparel, return instructions, and refund timelines.',
        verified: true,
        content: [
          {
            id: 'sec-1',
            subheading: '7-Day Size Exchange Guarantee',
            body: "If your sneakers, apparel, or clothing items do not fit as expected, you can request an exchange for an alternate size within 7 days of delivery as long as tags and original condition are maintained.",
          },
          {
            id: 'sec-2',
            subheading: 'Free Pick-up for Defective Items',
            body: 'In the rare event that an item arrives damaged or differs from your order, our courier will pick up the item and dispatch a replacement free of charge.',
          },
          {
            id: 'sec-3',
            subheading: 'How to Initiate an Exchange',
            body: 'Simply click "Contact Support" or chat with Kimzy in the live chat widget with your order number. Our support team coordinates the runner pick-up within 24 hours.',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-merchant-partner',
    name: 'Sell on Kim\'s Store & Partnerships',
    icon: 'Engineering',
    description: 'Merchant onboarding for local fashion boutiques, tech retailers, and brand suppliers.',
    articles: [
      {
        id: 'art-seller-101',
        slug: 'sell-on-kims-store',
        categoryId: 'cat-merchant-partner',
        categoryName: 'Sell on Kim\'s Store & Partnerships',
        title: 'How Local Designers & Brands Can Sell on Kim\'s Store',
        summary: 'Join Cameroon\'s premier online lifestyle marketplace and access thousands of shoppers nationwide.',
        verified: true,
        content: [
          {
            id: 'sec-1',
            subheading: 'Why Partner with Kim\'s Store',
            body: "Kim's Store connects local fashion creators, boutique owners, and electronics vendors with high-intent shoppers across Cameroon, backed by our logistics network and Mobile Money payments.",
          },
          {
            id: 'sec-2',
            subheading: 'Quality & Authenticity Vetting',
            body: 'To protect our shoppers, all prospective sellers undergo a quick identity and product sample inspection to ensure verified authentic goods.',
          },
          {
            id: 'sec-3',
            subheading: 'Automated Weekly MoMo Payouts',
            body: 'Vendor balances are automatically settled every Monday directly to your registered MTN Mobile Money or Orange Money account with transparent accounting reports.',
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
