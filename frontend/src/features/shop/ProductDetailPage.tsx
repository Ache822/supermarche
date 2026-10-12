import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Rating,
  Divider,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import type { ProductItem } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { HtmlContent } from '../../components/ui/HtmlContent';

export const ProductDetailPage: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const getLocalizedCategoryName = (cat: string) => {
    switch (cat) {
      case 'All':
      case 'Tout':
        return t('shop.categories.all', 'All');
      case 'Apparel & Fashion':
      case 'Vêtements & Mode':
        return t('shop.categories.apparel', 'Apparel & Fashion');
      case 'Footwear & Shoes':
      case 'Chaussures & Baskets':
        return t('shop.categories.footwear', 'Footwear & Shoes');
      case 'Cosmetics & Beauty':
      case 'Cosmétiques & Beauté':
        return t('shop.categories.cosmetics', 'Cosmetics & Beauty');
      case 'Electronics & Tech':
      case 'Électronique & High-Tech':
        return t('shop.categories.electronics', 'Electronics & Tech');
      case 'Fresh Produce & Snacks':
      case 'Produits Frais & Snacks':
        return t('shop.categories.fresh', 'Fresh Produce & Snacks');
      default:
        return cat;
    }
  };

  const getLocalizedProduct = (p: ProductItem) => {
    const titleKey = `shop.products.${p._id}.title`;
    const descKey = `shop.products.${p._id}.desc`;
    const hasTranslation = i18n.exists(titleKey);
    return {
      title: hasTranslation ? t(titleKey) : p.title,
      description: hasTranslation ? t(descKey) : p.description,
    };
  };

  useEffect(() => {
    if (!identifier) return;
    setLoading(true);
    api.products
      .getByIdOrSlug<{ success: boolean; data: ProductItem }>(identifier)
      .then((res) => {
        if (res?.success && res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.images?.[0] || '');
        }
      })
      .catch((err) => {
        console.error('Error fetching product detail:', err);
      })
      .finally(() => setLoading(false));
  }, [identifier]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t('productDetail.notFound', 'Product Not Found')}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/shop')}>
          {t('productDetail.backToStore', 'Back to Store')}
        </Button>
      </Container>
    );
  }

  const localized = getLocalizedProduct(product);
  const localizedCat = getLocalizedCategoryName(product.category);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4, color: 'text.secondary' }}>
        <MuiLink color="inherit" underline="hover" sx={{ cursor: 'pointer' }} onClick={() => navigate('/shop')}>
          {t('productDetail.store', 'Store')}
        </MuiLink>
        <MuiLink color="inherit" underline="hover" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/shop?category=${product.category}`)}>
          {localizedCat}
        </MuiLink>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          {localized.title}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 5 }}>
        {/* Gallery */}
        <Box>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              bgcolor: 'background.paper',
              mb: 2
            }}
          >
            <Box
              component="img"
              src={selectedImage || product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
              alt={localized.title}
              sx={{ width: '100%', height: 420, objectFit: 'cover' }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </Paper>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <Stack direction="row" spacing={1.5}>
              {product.images.map((img, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                  }}
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 2,
                    cursor: 'pointer',
                    objectFit: 'cover',
                    border: selectedImage === img ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)'
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Product Information */}
        <Box>
          <Chip label={localizedCat} color="primary" size="small" sx={{ mb: 1.5, fontWeight: 700 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            {localized.title}
          </Typography>

          <Stack direction="row" sx={{ alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating value={4.5} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {t('productDetail.reviews', '4.5 (28 customer reviews)')}
            </Typography>
            <Chip
              label={product.inStock ? t('productDetail.inStock', 'In Stock') : t('productDetail.outOfStock', 'Out of Stock')}
              color={product.inStock ? 'success' : 'error'}
              size="small"
              variant="outlined"
            />
          </Stack>

          <Stack direction="row" sx={{ alignItems: 'baseline', gap: 2, mb: 3 }}>
            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
              XAF {product.price.toLocaleString()}
            </Typography>
            {product.compareAtPrice && (
              <Typography variant="h5" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                XAF {product.compareAtPrice.toLocaleString()}
              </Typography>
            )}
          </Stack>

          <HtmlContent content={localized.description} variant="body1" sx={{ lineHeight: 1.7, mb: 4 }} />

          <Divider sx={{ my: 3 }} />

          {/* Quantity Selector & Add to Cart */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                px: 1,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <IconButton onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 700, px: 3 }}>
                {quantity}
              </Typography>
              <IconButton onClick={() => setQuantity((q) => q + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCartIcon />}
              onClick={() => addToCart(product, quantity)}
              sx={{
                flex: 1,
                borderRadius: 2,
                py: 1.5,
                fontSize: '1.05rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
              }}
            >
              {t('productDetail.addToCart', 'Add to Shopping Cart')}
            </Button>
          </Stack>

          {/* Guarantee Badges */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <LocalShippingOutlinedIcon color="primary" />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                    {t('productDetail.freeShippingTitle', 'Free Shipping')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('productDetail.freeShippingSub', 'On orders over XAF 25,000')}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <VerifiedUserOutlinedIcon color="primary" />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                    {t('productDetail.qualityTitle', 'Quality Guaranteed')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('productDetail.qualitySub', '100% Authentic & Verified')}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <ReplayOutlinedIcon color="primary" />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                    {t('productDetail.returnsTitle', 'Easy Returns')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('productDetail.returnsSub', '7-day exchange guarantee')}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};
