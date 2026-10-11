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
  CircularProgress,
  Chip,
  InputAdornment,
} from '@mui/material';
import type { Theme } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'Brenda T.',
    email: 'brenda@example.com',
    phone: '670123456',
    street: 'Akwa, Boulevard de la Liberté',
    city: 'Douala',
    state: 'Littoral',
    postalCode: 'BP 1024',
    country: 'Cameroon',
    paymentMethod: 'mtn_momo' as 'mtn_momo' | 'orange_money' | 'card' | 'cash_on_delivery',
    notes: '',
    // Specialized payment inputs
    momoPhone: '670123456',
    orangePhone: '690123456',
    cardHolder: 'Brenda T.',
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '12/28',
    cardCvv: '888',
  });

  // Gateway Simulation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setFormData({ ...formData, cardNumber: parts.join(' ') });
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/gi, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setFormData({ ...formData, cardExpiry: raw });
  };

  const shippingFee = cartTotal >= 25000 ? 0 : 1500;
  const grandTotal = cartTotal + shippingFee;

  const handleExecuteOrder = async (transactionRef?: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
        transactionReference: transactionRef,
        notes: formData.notes,
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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Add products before checking out.');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Please complete all contact details (Name, Email, and Phone number).');
      return;
    }

    if (!formData.street || !formData.city) {
      setErrorMsg('Please complete delivery street address and city.');
      return;
    }

    // If online automated payment is chosen, trigger simulation modal
    if (formData.paymentMethod === 'mtn_momo' || formData.paymentMethod === 'orange_money' || formData.paymentMethod === 'card') {
      setIsModalOpen(true);
      return;
    }

    // Cash on delivery: submit immediately
    handleExecuteOrder();
  };

  const handlePaymentSuccess = (txRef: string) => {
    setIsModalOpen(false);
    handleExecuteOrder(txRef);
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
        <Button
          variant="contained"
          onClick={() => navigate('/shop')}
          sx={{ bgcolor: '#FF6B00', color: '#FFFFFF', fontWeight: 700, px: 4, py: 1.5, borderRadius: 2 }}
        >
          Return to Store
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
        Checkout & Complete Order
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Fast, secure delivery across Cameroon with automated Mobile Money & Card checkouts.
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmitOrder}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 4 }}>
          {/* Customer & Shipping & Payment details */}
          <Stack spacing={3}>
            {/* Contact Information */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockOutlinedIcon sx={{ color: '#FF6B00' }} /> Contact Details
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
                    placeholder="e.g. Brenda Tanyi"
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
                  placeholder="name@example.com"
                />
                <TextField
                  required
                  fullWidth
                  label="Phone / WhatsApp Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +237 670 123 456"
                  helperText="Primary contact for runner dispatch"
                />
              </Box>
            </Paper>

            {/* Shipping Address */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingOutlinedIcon sx={{ color: '#FF6B00' }} /> Delivery Shipping Address
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <TextField
                    required
                    fullWidth
                    label="Street / Quarter / Landmark"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g. Akwa, Behind Super U / Bastos Rue 1204"
                  />
                </Box>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Douala or Yaoundé"
                />
                <TextField
                  fullWidth
                  label="Region / Province"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Littoral, Centre, South-West..."
                />
                <TextField
                  required
                  fullWidth
                  label="Postal / Quarter Code"
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

            {/* Payment Method Section */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentOutlinedIcon sx={{ color: '#FF6B00' }} /> Choose Payment Method
                </Typography>
                <Chip
                  icon={<SecurityIcon sx={{ fontSize: '14px !important', color: '#16A34A !important' }} />}
                  label="Automated & Secure"
                  size="small"
                  sx={{ bgcolor: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', fontWeight: 700, fontSize: 11 }}
                />
              </Box>
              <Divider sx={{ mb: 2.5 }} />

              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 1, fontSize: 13, fontWeight: 600 }}>
                  Select your preferred payment channel:
                </FormLabel>
                <RadioGroup name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  {/* 1. MTN Mobile Money */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2.5,
                      borderColor: formData.paymentMethod === 'mtn_momo' ? '#E5A800' : 'divider',
                      bgcolor: (theme: Theme) =>
                        formData.paymentMethod === 'mtn_momo'
                          ? theme.palette.mode === 'dark'
                            ? 'rgba(255, 204, 0, 0.08)'
                            : '#FFFDF0'
                          : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <FormControlLabel
                      value="mtn_momo"
                      control={<Radio sx={{ color: '#E5A800', '&.Mui-checked': { color: '#E5A800' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '8px',
                              bgcolor: '#FFCC00',
                              color: '#000000',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <PhoneAndroidIcon sx={{ fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                MTN Mobile Money (MoMo)
                              </Typography>
                              <Chip
                                label="Instant USSD Push"
                                size="small"
                                sx={{ bgcolor: '#FFCC00', color: '#000000', fontWeight: 800, fontSize: 10, height: 18 }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Automated prompt sent directly to your MTN phone for PIN approval.
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />

                    {formData.paymentMethod === 'mtn_momo' && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(229, 168, 0, 0.4)' }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="MTN Phone Number"
                          name="momoPhone"
                          value={formData.momoPhone || formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. 670 123 456 (or 650-654, 68)"
                          slotProps={{
                            input: {
                              startAdornment: <InputAdornment position="start">+237</InputAdornment>,
                            },
                          }}
                          helperText="A USSD push notification will be sent to this number to enter your PIN"
                        />
                      </Box>
                    )}
                  </Paper>

                  {/* 2. Orange Money */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2.5,
                      borderColor: formData.paymentMethod === 'orange_money' ? '#FF7900' : 'divider',
                      bgcolor: (theme: Theme) =>
                        formData.paymentMethod === 'orange_money'
                          ? theme.palette.mode === 'dark'
                            ? 'rgba(255, 121, 0, 0.08)'
                            : '#FFF7ED'
                          : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <FormControlLabel
                      value="orange_money"
                      control={<Radio sx={{ color: '#FF7900', '&.Mui-checked': { color: '#FF7900' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '8px',
                              bgcolor: '#FF7900',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <PhoneAndroidIcon sx={{ fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                Orange Money (OM)
                              </Typography>
                              <Chip
                                label="Instant Authorization"
                                size="small"
                                sx={{ bgcolor: '#FF7900', color: '#FFFFFF', fontWeight: 800, fontSize: 10, height: 18 }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Automated prompt or code generation via #150# on your Orange phone.
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />

                    {formData.paymentMethod === 'orange_money' && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(255, 121, 0, 0.4)' }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Orange Phone Number"
                          name="orangePhone"
                          value={formData.orangePhone || formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. 690 123 456 (or 655-659)"
                          slotProps={{
                            input: {
                              startAdornment: <InputAdornment position="start">+237</InputAdornment>,
                            },
                          }}
                          helperText="An authorization prompt will be triggered for this Orange number"
                        />
                      </Box>
                    )}
                  </Paper>

                  {/* 3. Credit / Debit Card (Visa / Mastercard) */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2.5,
                      borderColor: formData.paymentMethod === 'card' ? '#2563EB' : 'divider',
                      bgcolor: (theme: Theme) =>
                        formData.paymentMethod === 'card'
                          ? theme.palette.mode === 'dark'
                            ? 'rgba(37, 99, 235, 0.08)'
                            : '#EFF6FF'
                          : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <FormControlLabel
                      value="card"
                      control={<Radio sx={{ color: '#2563EB', '&.Mui-checked': { color: '#2563EB' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '8px',
                              bgcolor: '#1E293B',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CreditCardIcon sx={{ fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                Credit / Debit Card
                              </Typography>
                              <Chip
                                label="Visa & Mastercard"
                                size="small"
                                sx={{ bgcolor: '#1E293B', color: '#FFFFFF', fontWeight: 800, fontSize: 10, height: 18 }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Instant card checkout with 3D Secure bank SMS verification.
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />

                    {formData.paymentMethod === 'card' && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(37, 99, 235, 0.4)' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Cardholder Name"
                            name="cardHolder"
                            value={formData.cardHolder || formData.name}
                            onChange={handleChange}
                            placeholder="Full name as printed on card"
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Card Number"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4242 •••• •••• 4242"
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CreditCardIcon sx={{ color: 'text.secondary' }} />
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                            <TextField
                              size="small"
                              label="Expires (MM/YY)"
                              value={formData.cardExpiry}
                              onChange={handleCardExpiryChange}
                              placeholder="12/28"
                            />
                            <TextField
                              size="small"
                              label="CVV / CVC"
                              name="cardCvv"
                              type="password"
                              value={formData.cardCvv}
                              onChange={handleChange}
                              placeholder="•••"
                              slotProps={{
                                htmlInput: { maxLength: 4 },
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Paper>

                  {/* 4. Cash on Delivery (COD) */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      borderColor: formData.paymentMethod === 'cash_on_delivery' ? '#FF6B00' : 'divider',
                      bgcolor: (theme: Theme) =>
                        formData.paymentMethod === 'cash_on_delivery'
                          ? theme.palette.mode === 'dark'
                            ? 'rgba(255, 107, 0, 0.08)'
                            : '#FFF7F2'
                          : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <FormControlLabel
                      value="cash_on_delivery"
                      control={<Radio sx={{ color: '#FF6B00', '&.Mui-checked': { color: '#FF6B00' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '8px',
                              bgcolor: '#FF6B00',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              Cash on Delivery (Doorstep Payment)
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pay cash directly to the runner when your package arrives at your doorstep.
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Paper>
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
                  <ListItem key={product._id} disableGutters sx={{ py: 1.5, alignItems: 'center' }}>
                    <Avatar
                      variant="rounded"
                      src={product.images?.[0]}
                      alt={product.title}
                      sx={{ width: 48, height: 48, mr: 1.5, flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0, mr: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {product.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qty: {quantity} × XAF {product.price.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      XAF {(product.price * quantity).toLocaleString()}
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
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    XAF {cartTotal.toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Delivery Shipping
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                    {shippingFee === 0 ? 'FREE' : `XAF ${shippingFee.toLocaleString()}`}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Total Amount
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#FF6B00' }}>
                    XAF {grandTotal.toLocaleString()}
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
                  bgcolor: '#FF6B00',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(255, 107, 0, 0.4)',
                  '&:hover': { bgcolor: '#E05D00' },
                }}
              >
                {loading
                  ? 'Processing Order...'
                  : formData.paymentMethod === 'cash_on_delivery'
                  ? `Place Order (COD - XAF ${grandTotal.toLocaleString()})`
                  : `Pay XAF ${grandTotal.toLocaleString()} Now`}
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Automated Payment Gateway Simulation Modal */}
      {isModalOpen && formData.paymentMethod !== 'cash_on_delivery' && (
        <PaymentGatewayModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          paymentMethod={formData.paymentMethod}
          amount={grandTotal}
          phone={
            formData.paymentMethod === 'mtn_momo'
              ? formData.momoPhone || formData.phone
              : formData.paymentMethod === 'orange_money'
              ? formData.orangePhone || formData.phone
              : formData.phone
          }
          customerName={formData.name}
          cardLast4={formData.cardNumber.replace(/\s+/g, '').slice(-4) || '4242'}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </Container>
  );
};
