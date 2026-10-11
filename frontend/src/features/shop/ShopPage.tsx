import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Chip,
  InputAdornment,
  Stack,
  Rating,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import type { ProductItem } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DEFAULT_STORE_PRODUCTS: ProductItem[] = [
  {
    _id: 'prod-hoodie-01',
    title: 'Oversized Vintage Graphic Hoodie',
    slug: 'oversized-vintage-graphic-hoodie',
    description: 'Heavyweight premium cotton oversized hoodie with vintage graphic print. Ultra-comfortable for campus and everyday wear.',
    shortDescription: 'Heavyweight cotton oversized hoodie with vintage print.',
    price: 18500,
    compareAtPrice: 22000,
    category: 'Apparel & Fashion',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 45,
    inStock: true,
    sku: 'APP-HD-001',
  },
  {
    _id: 'prod-tee-02',
    title: 'Minimalist Streetwear Heavyweight Tee',
    slug: 'minimalist-streetwear-heavyweight-tee',
    description: 'Relaxed fit 240GSM cotton graphic t-shirt. Breathable, durable, and stylish.',
    shortDescription: 'Relaxed fit 240GSM cotton streetwear t-shirt.',
    price: 8500,
    compareAtPrice: 10500,
    category: 'Apparel & Fashion',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 60,
    inStock: true,
    sku: 'APP-TE-002',
  },
  {
    _id: 'prod-sneakers-01',
    title: 'Retro High-Top Campus Kicks',
    slug: 'retro-high-top-campus-kicks',
    description: 'Classic high-top retro basketball sneakers with cushioned insoles and durable rubber outsole.',
    shortDescription: 'Classic high-top retro sneakers with cushioned insoles.',
    price: 28000,
    compareAtPrice: 35000,
    category: 'Footwear & Shoes',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 30,
    inStock: true,
    sku: 'FTW-SNK-001',
  },
  {
    _id: 'prod-running-02',
    title: 'Breathable Lightweight Running Shoes',
    slug: 'breathable-lightweight-running-shoes',
    description: 'Mesh upper sports running shoes designed for ultimate comfort during long walks or campus commutes.',
    shortDescription: 'Lightweight mesh sports running shoes for daily wear.',
    price: 22000,
    compareAtPrice: 26500,
    category: 'Footwear & Shoes',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 25,
    inStock: true,
    sku: 'FTW-RUN-002',
  },
  {
    _id: 'prod-serum-01',
    title: 'Hydrating Glow Vitamin C Face Serum',
    slug: 'hydrating-glow-vitamin-c-serum',
    description: 'Nourishing facial serum infused with Hyaluronic Acid and Vitamin C for glowing, hydrated skin.',
    shortDescription: 'Nourishing facial serum for bright, hydrated skin.',
    price: 6500,
    compareAtPrice: 8500,
    category: 'Cosmetics & Beauty',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 50,
    inStock: true,
    sku: 'COS-SRM-001',
  },
  {
    _id: 'prod-sunscreen-02',
    title: 'SPF 50+ Invisible Shield Sunscreen',
    slug: 'spf-50-invisible-shield-sunscreen',
    description: 'Non-greasy, zero white-cast broad-spectrum SPF 50+ facial sunscreen lotion.',
    shortDescription: 'Broad-spectrum SPF 50+ facial sunscreen lotion.',
    price: 4500,
    compareAtPrice: 6000,
    category: 'Cosmetics & Beauty',
    images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 70,
    inStock: true,
    sku: 'COS-SUN-002',
  },
  {
    _id: 'prod-earbuds-01',
    title: 'Pro ANC Wireless Bluetooth Earbuds',
    slug: 'pro-anc-wireless-bluetooth-earbuds',
    description: 'Active Noise-Canceling wireless earbuds with 30-hour total battery life and deep bass HD audio.',
    shortDescription: 'ANC wireless earbuds with 30h battery and HD audio.',
    price: 19500,
    compareAtPrice: 24500,
    category: 'Electronics & Tech',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 35,
    inStock: true,
    sku: 'TEC-EAR-001',
  },
  {
    _id: 'prod-powerbank-02',
    title: '20,000mAh Ultra Fast Power Bank',
    slug: '20000mah-ultra-fast-power-bank',
    description: '22.5W dual USB-C fast charging powerbank. Compact power unit for phones, tablets, and laptops.',
    shortDescription: '22.5W fast-charging 20,000mAh portable powerbank.',
    price: 14000,
    compareAtPrice: 17500,
    category: 'Electronics & Tech',
    images: ['https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 40,
    inStock: true,
    sku: 'TEC-PWR-002',
  },
  {
    _id: 'prod-fruits-01',
    title: 'Fresh Organic Fruit & Grocery Basket',
    slug: 'fresh-organic-fruit-grocery-basket',
    description: 'Hand-picked organic apples, bananas, oranges, and fresh market produce delivered to your doorstep.',
    shortDescription: 'Organic fresh fruit basket delivered to your door.',
    price: 5500,
    compareAtPrice: 7000,
    category: 'Fresh Produce & Snacks',
    images: ['https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 80,
    inStock: true,
    sku: 'PRD-FRT-001',
  },
  {
    _id: 'prod-snacks-02',
    title: 'Artisan Chocolates & Dorm Snack Pack',
    slug: 'artisan-chocolates-dorm-snack-pack',
    description: 'Curated mix of imported chocolates, crunchy biscuits, wafer sticks, and late-night snacks.',
    shortDescription: 'Curated mix of chocolates, biscuits, and snacks.',
    price: 3500,
    compareAtPrice: 4500,
    category: 'Fresh Produce & Snacks',
    images: ['https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80'],
    stockQuantity: 100,
    inStock: true,
    sku: 'PRD-SNK-002',
  },
];

export const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const STORE_CATEGORIES = [
    'All',
    'Apparel & Fashion',
    'Footwear & Shoes',
    'Cosmetics & Beauty',
    'Electronics & Tech',
    'Fresh Produce & Snacks',
  ];

  const getLocalizedCategoryName = (cat: string) => {
    switch (cat) {
      case 'All':
      case 'Tout':
      case 'Tous':
        return t('shop.categories.all');
      case 'Apparel & Fashion':
      case 'Vêtements & Mode':
      case 'Mode & Vêtements':
        return t('shop.categories.apparel');
      case 'Footwear & Shoes':
      case 'Chaussures & Baskets':
        return t('shop.categories.footwear');
      case 'Cosmetics & Beauty':
      case 'Cosmétiques & Beauté':
        return t('shop.categories.cosmetics');
      case 'Electronics & Tech':
      case 'Électronique & High-Tech':
        return t('shop.categories.electronics');
      case 'Fresh Produce & Snacks':
      case 'Produits Frais & Snacks':
        return t('shop.categories.fresh');
      default:
        return cat;
    }
  };

  const getLocalizedProduct = (product: ProductItem) => {
    const titleKey = `shop.products.${product._id}.title`;
    const descKey = `shop.products.${product._id}.desc`;
    const hasTranslation = i18n.exists(titleKey);
    return {
      title: hasTranslation ? t(titleKey) : product.title,
      description: hasTranslation ? t(descKey) : product.shortDescription || product.description,
    };
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response: any = await api.products.list(params);
      let items: ProductItem[] = response?.data || [];
      
      // Fallback seed products if database returns empty
      if (!items || items.length === 0) {
        items = DEFAULT_STORE_PRODUCTS;
      }

      // Filter locally if search or category active on seed
      if (selectedCategory !== 'All') {
        items = items.filter((p) => {
          const cat = typeof p.category === 'object' && p.category !== null ? (p.category as any).name : String(p.category || '');
          return cat.toLowerCase().includes(selectedCategory.toLowerCase());
        });
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        items = items.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            String(p.category).toLowerCase().includes(q)
        );
      }

      setProducts(items);
      setCategories(STORE_CATEGORIES);
    } catch (err) {
      console.error('Failed to load products:', err);
      // Use fallback seed products on network failure
      let items = DEFAULT_STORE_PRODUCTS;
      if (selectedCategory !== 'All') {
        items = items.filter((p) => String(p.category).toLowerCase().includes(selectedCategory.toLowerCase()));
      }
      setProducts(items);
      setCategories(STORE_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <Box sx={{ py: 6, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        {/* Banner */}
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            mb: 5,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15) 0%, rgba(224, 93, 0, 0.08) 100%)',
            border: '1px solid rgba(255, 107, 0, 0.2)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Chip
            icon={<LocalOfferIcon sx={{ fontSize: 16, color: '#FF6B00 !important' }} />}
            label={t('shop.marketplaceChip', "Kim's Store Marketplace")}
            size="small"
            sx={{ mb: 2, fontWeight: 700, bgcolor: 'rgba(255, 107, 0, 0.15)', color: '#FF6B00', border: '1px solid #FF6B00' }}
          />
          <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800, mb: 2 }}>
            {t('shop.heroTitle', 'Trending Fashion, Footwear, Beauty & Everyday Essentials')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', mb: 4 }}>
            {t('shop.heroSubtitle', 'Discover high-quality apparel, sneakers, cosmetics glow kits, electronics, fresh produce, and dorm snacks delivered fast.')}
          </Typography>

          {/* Search bar */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ maxWidth: 540, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder={t('shop.searchPlaceholder', 'Search fashion, sneakers, skincare, electronics, snacks...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#FF6B00' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button variant="contained" type="submit" sx={{ borderRadius: 2, bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}>
                        {t('shop.searchBtn', 'Search')}
                      </Button>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, bgcolor: 'background.paper' }
                }
              }}
            />
          </Box>
        </Box>

        {/* Category Filter Pills */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 4, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}
        >
          {(categories.length > 0 ? categories : STORE_CATEGORIES).map((cat) => (
            <Chip
              key={cat}
              label={getLocalizedCategoryName(cat)}
              clickable
              onClick={() => setSelectedCategory(cat)}
              sx={{
                fontWeight: 700,
                py: 2.2,
                px: 1.5,
                borderRadius: 2,
                bgcolor: selectedCategory === cat ? '#FF6B00' : 'background.paper',
                color: selectedCategory === cat ? '#FFFFFF' : 'text.primary',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#FF6B00' : 'rgba(255, 107, 0, 0.2)',
                '&:hover': {
                  bgcolor: selectedCategory === cat ? '#E05D00' : 'rgba(255, 107, 0, 0.1)',
                },
              }}
            />
          ))}
        </Stack>

        {/* Product Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('shop.noProducts', 'No products found matching your search.')}
            </Typography>
            <Button sx={{ mt: 2 }} onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
              {t('shop.resetFilters', 'Reset Filters')}
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3
            }}
          >
            {products.map((product) => {
              const localized = getLocalizedProduct(product);
              const catRaw = typeof product.category === 'object' && product.category !== null ? (product.category as any).name : String(product.category || 'Groceries');
              const localizedCategory = getLocalizedCategoryName(catRaw);

              return (
                <Card
                  key={product._id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                      alt={localized.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Chip
                      label={localizedCategory}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        backdropFilter: 'blur(4px)',
                        fontSize: '0.75rem'
                      }}
                    />
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <Chip
                        label={t('shop.sale', 'SALE')}
                        size="small"
                        color="error"
                        sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h6"
                      onClick={() => navigate(`/shop/product/${product.slug || product._id}`)}
                      sx={{ fontWeight: 700, mb: 1, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    >
                      {localized.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {localized.description}
                    </Typography>

                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating value={4.8} precision={0.5} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary">
                        (4.8)
                      </Typography>
                    </Stack>

                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                      <Box>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                          XAF {product.price.toLocaleString()}
                        </Typography>
                        {product.compareAtPrice && (
                          <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            XAF {product.compareAtPrice.toLocaleString()}
                          </Typography>
                        )}
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Tooltip title={t('shop.quickView', 'Quick View')}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/shop/product/${product.slug || product._id}`)}
                            sx={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => addToCart(product)}
                          sx={{ borderRadius: 2, px: 2, fontWeight: 600 }}
                        >
                          {t('shop.add', 'Add')}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};
