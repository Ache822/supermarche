import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack,
  Divider,
  List,
  ListItem,
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: 'cash_on_delivery',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const shippingFee = cartTotal > 50 ? 0 : 5.99;
  const grandTotal = cartTotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Add products before checking out.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const res: any = await api.orders.create(orderPayload);
      if (res?.success && res.data) {
        clearCart();
        navigate(`/order-status/${res.data.orderNumber}`);
      } else {
        setErrorMsg(res?.message || 'Failed to submit order. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You must have items in your shopping cart to complete checkout.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/shop')}>
          Return to Store
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Checkout & Complete Order
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmitOrder}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 4 }}>
          {/* Customer & Shipping details */}
          <Stack spacing={3}>
            {/* Contact Information */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockOutlinedIcon color="primary" /> Contact Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Box>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Box>
            </Paper>

            {/* Shipping Address */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingOutlinedIcon color="primary" /> Delivery Shipping Address
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <TextField
                    required
                    fullWidth
                    label="Street Address"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                  />
                </Box>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="State / Province"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
                <TextField
                  required
                  fullWidth
                  label="Postal / ZIP Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
                <TextField
                  required
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </Box>
            </Paper>

            {/* Payment Method */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentOutlinedIcon color="primary" /> Payment Method
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <FormControl component="fieldset">
                <FormLabel component="legend">Choose payment option</FormLabel>
                <RadioGroup name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  <FormControlLabel
                    value="cash_on_delivery"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Cash on Delivery (COD)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Pay with cash or card upon package delivery to your doorstep.
                        </Typography>
                      </Box>
                    }
                    sx={{ py: 1 }}
                  />
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Credit / Debit Card (Online)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Secure instant card payment.
                        </Typography>
                      </Box>
                    }
                    sx={{ py: 1 }}
                  />
                  <FormControlLabel
                    value="bank_transfer"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Direct Bank Transfer
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Transfer directly to our store bank account.
                        </Typography>
                      </Box>
                    }
                    sx={{ py: 1 }}
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
          </Stack>

          {/* Order Summary Sidebar */}
          <Box>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 90 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Order Summary ({cart.length} items)
              </Typography>
              <Divider sx={{ my: 2 }} />

              <List disablePadding sx={{ mb: 2, maxHeight: 280, overflowY: 'auto' }}>
                {cart.map(({ product, quantity }) => (
                  <ListItem key={product._id} disableGutters sx={{ py: 1.5 }}>
                    <Avatar
                      variant="rounded"
                      src={product.images?.[0]}
                      alt={product.title}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {product.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qty: {quantity} × ${product.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      ${(product.price * quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    ${cartTotal.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                  <Typography variant="subtitle2" color={shippingFee === 0 ? 'success.main' : 'text.primary'}>
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Total Amount
                  </Typography>
                  <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                    ${grandTotal.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlinedIcon />}
                sx={{
                  py: 1.75,
                  borderRadius: 2,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                }}
              >
                {loading ? 'Processing Order...' : `Place Order ($${grandTotal.toFixed(2)})`}
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
