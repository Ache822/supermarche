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

export const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

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
      if (response?.success) {
        setProducts(response.data || []);
        if (response.categories && response.categories.length > 0) {
          setCategories(['All', ...response.categories]);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
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
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Chip
            icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
            label="Supermarche Marketplace"
            color="primary"
            size="small"
            sx={{ mb: 2, fontWeight: 700 }}
          />
          <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800, mb: 2 }}>
            Fresh Groceries & Everyday Essentials
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Discover high-quality organic produce, artisanal bakery goods, pantry staples, and daily necessities delivered fast.
          </Typography>

          {/* Search bar */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ maxWidth: 540, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search products, groceries, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button variant="contained" type="submit" sx={{ borderRadius: 2 }}>
                        Search
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
          {(categories.length > 0 ? categories : ['All', 'Fresh Produce', 'Bakery', 'Dairy & Eggs', 'Pantry', 'Snacks & Sweets']).map(
            (cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                color={selectedCategory === cat ? 'primary' : 'default'}
                variant={selectedCategory === cat ? 'filled' : 'outlined'}
                onClick={() => setSelectedCategory(cat)}
                sx={{ fontWeight: 600, py: 2, px: 1, borderRadius: 2 }}
              />
            )
          )}
        </Stack>

        {/* Product Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products found matching your search.
            </Typography>
            <Button sx={{ mt: 2 }} onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
              Reset Filters
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
            {products.map((product) => (
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
                    alt={product.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Chip
                    label={typeof product.category === 'object' && product.category !== null ? (product.category as any).name : String(product.category || 'Groceries')}
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
                      label="SALE"
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
                    {product.title}
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
                    {product.shortDescription || product.description}
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
                        {product.price > 100 ? `${product.price.toLocaleString()} FCFA` : `$${product.price.toFixed(2)}`}
                      </Typography>
                      {product.compareAtPrice && (
                        <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {product.compareAtPrice > 100 ? `${product.compareAtPrice.toLocaleString()} FCFA` : `$${product.compareAtPrice.toFixed(2)}`}
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Quick View">
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
                        Add
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};
