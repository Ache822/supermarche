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

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

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
            background: 'var(--bg-paper, #121827)',
            color: 'var(--text-primary, #ffffff)',
            display: 'flex',
            flexDirection: 'column'
          }
        }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <ShoppingBagOutlinedIcon sx={{ color: '#6366f1' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Shopping Cart
          </Typography>
          <Chip label={`${cart.length} items`} size="small" color="primary" sx={{ height: 22, fontSize: '0.75rem' }} />
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
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Browse our fresh products and add your favorite items to get started!
            </Typography>
            <Button variant="contained" onClick={() => setIsCartOpen(false)}>
              Start Shopping
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
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <Avatar
                  variant="rounded"
                  src={product.images?.[0]}
                  alt={product.title}
                  sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: 'background.neutral' }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
                    {product.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    ${product.price.toFixed(2)} each
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
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
                  ${(product.price * quantity).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Footer / Summary */}
      {cart.length > 0 && (
        <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: 'rgba(0, 0, 0, 0.2)' }}>
          <Stack spacing={1} sx={{ mb: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                ${cartTotal.toFixed(2)}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Estimated Shipping
              </Typography>
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                {cartTotal > 50 ? 'FREE' : '$5.99'}
              </Typography>
            </Stack>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Total
              </Typography>
              <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 800, fontSize: '1.25rem' }}>
                ${(cartTotal + (cartTotal > 50 ? 0 : 5.99)).toFixed(2)}
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
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              fontWeight: 700
            }}
          >
            Checkout Now
          </Button>
        </Box>
      )}
    </Drawer>
  );
};
