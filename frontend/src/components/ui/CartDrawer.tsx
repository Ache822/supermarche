import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  Avatar,
  Stack,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const getProductTitle = (product: any) => {
    const key = `shop.products.${product._id}.title`;
    return i18n.exists(key) ? t(key) : product.title;
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 420 },
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A110A' : '#FFFFFF'),
            color: 'text.primary',
            borderLeft: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            display: 'flex',
            flexDirection: 'column'
          }
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0')
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <ShoppingBagOutlinedIcon sx={{ color: '#FF6B00' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
            {t('cartDrawer.title', 'Shopping Cart')}
          </Typography>
          <Chip
            label={t('cartDrawer.itemCount', { count: cart.length, defaultValue: `${cart.length} items` })}
            size="small"
            sx={{ height: 22, fontSize: '0.75rem', bgcolor: '#FF6B00', color: '#FFFFFF', fontWeight: 700 }}
          />
        </Stack>
        <IconButton onClick={() => setIsCartOpen(false)} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Items List */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {cart.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.4, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {t('cartDrawer.emptyTitle', 'Your cart is empty')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('cartDrawer.emptySub', 'Browse our fresh products and add your favorite items to get started!')}
            </Typography>
            <Button variant="contained" onClick={() => setIsCartOpen(false)}>
              {t('cartDrawer.startShopping', 'Start Shopping')}
            </Button>
          </Box>
        ) : (
          <List disablePadding>
            {cart.map(({ product, quantity }) => (
              <ListItem
                key={product._id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  py: 2,
                  px: 1,
                  borderBottom: '1px solid',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#2A180E' : '#F1F5F9')
                }}
              >
                <Avatar
                  variant="rounded"
                  src={product.images?.[0]}
                  alt={getProductTitle(product)}
                  sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: 'background.neutral' }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
                    {getProductTitle(product)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    XAF {product.price.toLocaleString()} {t('cartDrawer.each', 'each')}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#CBD5E1'),
                        borderRadius: 1.5,
                        px: 0.5
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        sx={{ p: 0.25 }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ fontWeight: 600, px: 1 }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        sx={{ p: 0.25 }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <IconButton size="small" color="error" onClick={() => removeFromCart(product._id)}>
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, alignSelf: 'flex-start', mt: 0.5 }}>
                  XAF {(product.price * quantity).toLocaleString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Footer / Summary */}
      {cart.length > 0 && (
        <Box
          sx={{
            p: 2.5,
            borderTop: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#F8FAFC')
          }}
        >
          <Stack spacing={1} sx={{ mb: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('cartDrawer.subtotal', 'Subtotal')}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                XAF {cartTotal.toLocaleString()}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('cartDrawer.estimatedShipping', 'Estimated Shipping')}
              </Typography>
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                {cartTotal >= 25000 ? t('cartDrawer.free', 'FREE') : 'XAF 1,500'}
              </Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t('cartDrawer.total', 'Total')}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#FF6B00' }}>
                XAF {(cartTotal + (cartTotal >= 25000 ? 0 : 1500)).toLocaleString()}
              </Typography>
            </Stack>
          </Stack>

          <Button
            variant="contained"
            size="large"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            onClick={handleCheckout}
            sx={{
              py: 1.5,
              borderRadius: 2,
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(255, 107, 0, 0.4)',
              '&:hover': {
                bgcolor: '#E05D00'
              }
            }}
          >
            {t('cartDrawer.checkoutNow', 'Checkout Now')}
          </Button>
        </Box>
      )}
    </Drawer>
  );
};
