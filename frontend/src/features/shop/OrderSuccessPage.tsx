import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  Avatar,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../api/client';

const orderSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(Boolean(orderNumber));
  const [searchInput, setSearchInput] = useState(orderNumber || '');

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (orderNumber.toUpperCase().includes('DEMO')) {
      setOrder({
        orderNumber: orderNumber.toUpperCase(),
        orderStatus: 'shipped',
        customer: {
          name: 'Sandrine Ngono',
          email: 'sandrine.ngono@gmail.com',
          phone: '+237 677 822 100',
        },
        shippingAddress: {
          street: 'Avenue de Gaulle, Bonapriso',
          city: 'Douala',
          postalCode: 'BP 1024',
          country: 'Cameroon',
        },
        items: [
          {
            title: 'Retro High Urban Streetwear Sneakers (Size 42)',
            price: 42.0,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80',
          },
          {
            title: 'Hydrating Botanical Glow Facial Cleanser',
            price: 18.0,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
          },
        ],
        subtotal: 78.0,
        shippingFee: 0,
        totalAmount: 78.0,
        paymentMethod: 'mtn_momo',
        paymentStatus: 'paid',
        notes: 'Express courier runner Jean-Paul assigned (Motorbike CM-LT-842)',
      });
      setLoading(false);
      return;
    }

    api.orders
      .track<{ success: boolean; data: any }>(orderNumber)
      .then((res) => {
        if (res?.success && res.data) {
          setOrder(res.data);
        } else {
          setOrder(null);
        }
      })
      .catch(() => {
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const getActiveStep = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A110A' : '#FFFFFF'),
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: 'rgba(255, 107, 0, 0.12)',
              color: '#FF6B00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <LocalShippingOutlinedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
            Live Order & Runner Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {orderNumber
              ? `Order "${orderNumber}" was not found. Please double-check your order number or try the demo.`
              : 'Enter your Kim’s Store order number to track your express courier runner in real-time.'}
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim()) {
                navigate(`/order-status/${encodeURIComponent(searchInput.trim())}`);
              }
            }}
            sx={{ display: 'flex', gap: 1.5, mb: 2 }}
          >
            <TextField
              fullWidth
              size="medium"
              placeholder="e.g. ORD-984210 or ORD-DEMO-2026"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#FF6B00' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!searchInput.trim()}
              sx={{
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                fontWeight: 700,
                borderRadius: '12px',
                px: 3,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#E05D00' },
              }}
            >
              Track
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Try Demo:
            </Typography>
            <Chip
              label="ORD-DEMO-2026"
              size="small"
              onClick={() => navigate('/order-status/ORD-DEMO-2026')}
              sx={{
                bgcolor: 'rgba(255, 107, 0, 0.1)',
                color: '#FF6B00',
                fontWeight: 700,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.2)' },
              }}
            />
          </Box>

          <Button
            variant="outlined"
            onClick={() => navigate('/shop')}
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
            }}
          >
            ← Back to Shop
          </Button>
        </Paper>
      </Container>
    );
  }

  const activeStep = getActiveStep(order.orderStatus);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'var(--bg-paper, #121827)'
        }}
      >
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Thank You For Your Order!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your order has been placed and is currently being processed.
          </Typography>
          <Chip
            icon={<ShoppingBagOutlinedIcon />}
            label={`Order #: ${order.orderNumber}`}
            color="primary"
            sx={{ mt: 2, px: 1, py: 2, fontWeight: 700, fontSize: '0.95rem' }}
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Order Status Stepper */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Order Tracking Status
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {orderSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Order Summary Details */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4, mb: 4 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Customer Info
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {order.customer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.customer.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.customer.phone}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Delivery Shipping Address
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {order.shippingAddress.street}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.country}
            </Typography>
          </Box>
        </Box>

        {/* Purchased Items List */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Items Purchased ({order.items.length})
        </Typography>
        <List disablePadding sx={{ mb: 4 }}>
          {order.items.map((item: any, idx: number) => (
            <ListItem key={idx} disableGutters sx={{ py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Avatar variant="rounded" src={item.image} alt={item.title} sx={{ width: 48, height: 48, mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>

        {/* Pricing Totals */}
        <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', mb: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
              ${order.subtotal.toFixed(2)}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Shipping Fee:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
              {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
            </Typography>

            <Box sx={{ gridColumn: 'span 2', my: 1 }}>
              <Divider />
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Total Paid / Due:
            </Typography>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, textAlign: 'right' }}>
              ${order.totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LocalShippingOutlinedIcon />}
            onClick={() => navigate('/shop')}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
