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
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

export const OrderSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();

  const orderSteps = [
    t('orderSuccess.stepsPlaced'),
    t('orderSuccess.stepsProcessing'),
    t('orderSuccess.stepsShipped'),
    t('orderSuccess.stepsDelivered'),
  ];

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(Boolean(orderNumber));
  const [searchInput, setSearchInput] = useState(orderNumber || '');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [copyNotice, setCopyNotice] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kim_recent_orders') || '[]');
      if (Array.isArray(stored)) {
        setRecentOrders(stored);
      }
    } catch {}
  }, []);

  const fetchOrderData = (num: string) => {
    if (!num) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (num.toUpperCase().includes('DEMO')) {
      setOrder({
        orderNumber: num.toUpperCase(),
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
            price: 42000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80',
          },
          {
            title: 'Hydrating Botanical Glow Facial Cleanser',
            price: 18000,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
          },
        ],
        subtotal: 78000,
        shippingFee: 0,
        totalAmount: 78000,
        paymentMethod: 'mtn_momo',
        paymentStatus: 'paid',
        notes: 'Express courier runner Jean-Paul assigned (Motorbike CM-LT-842)',
      });
      setLoading(false);
      return;
    }

    api.orders
      .track<{ success: boolean; data: any }>(num)
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
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrderData(orderNumber);
    } else {
      setOrder(null);
      setLoading(false);
    }
  }, [orderNumber]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!order) return;
    const itemList = order.items?.map((it: any) => `• ${it.title} (x${it.quantity})`).join('\n') || '';
    const text = `🛍️ *KIM'S STORE EXPRESS MARKET*\n*Commande:* ${order.orderNumber}\n*Statut:* ${order.orderStatus?.toUpperCase()} (${order.paymentStatus?.toUpperCase()})\n*Total:* XAF ${(order.totalAmount || 0).toLocaleString()}\n*Articles:*\n${itemList}\n*Livraison:* ${order.shippingAddress?.street}, ${order.shippingAddress?.city}\n\nSuivi en direct: ${window.location.origin}/order-status/${order.orderNumber}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyOrderRef = () => {
    if (!order?.orderNumber) return;
    navigator.clipboard?.writeText(order.orderNumber);
    setCopyNotice(true);
  };

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
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A110A' : '#FFFFFF'),
            textAlign: 'center',
            mb: 4,
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
            {t('orderSuccess.trackOtherOrder')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {orderNumber
              ? t('orderSuccess.orderNotFoundSub')
              : t('orderSuccess.subtitle')}
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim()) {
                navigate(`/order-status/${encodeURIComponent(searchInput.trim())}`);
              }
            }}
            sx={{ display: 'flex', gap: 1.5, mb: 2, maxWidth: 540, mx: 'auto' }}
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
              {t('orderSuccess.trackOrderBtn')}
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

          {/* Recent Orders List if available */}
          {recentOrders.length > 0 && (
            <Box sx={{ mt: 5, textAlign: 'left', borderTop: '1px solid', borderColor: 'divider', pt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <HistoryIcon sx={{ color: '#FF6B00' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {t('orderSuccess.recentOrdersTitle', 'My Recent Orders')}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                {t('orderSuccess.recentOrdersSub', 'Quickly access and track orders placed on this device')}
              </Typography>

              <Stack spacing={1.5}>
                {recentOrders.map((ro) => (
                  <Paper
                    key={ro.orderNumber}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: '#FF6B00',
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.08)' : 'rgba(255, 107, 0, 0.03)')
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: 'IBM Plex Mono, monospace', color: 'primary.main' }}>
                        {ro.orderNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {ro.date ? new Date(ro.date).toLocaleDateString() : ''} • {ro.itemCount || 1} items • XAF {(ro.total || 0).toLocaleString()}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Chip
                        label={ro.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                        size="small"
                        color={ro.paymentStatus === 'paid' ? 'success' : 'warning'}
                        sx={{ fontWeight: 700, fontSize: 10, height: 20 }}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/order-status/${ro.orderNumber}`)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 700,
                          bgcolor: '#FF6B00',
                          '&:hover': { bgcolor: '#E05D00' }
                        }}
                      >
                        {t('orderSuccess.viewOrder', 'Track Order')}
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
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
              ← {t('checkout.browseCatalog')}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const activeStep = getActiveStep(order.orderStatus);

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'mtn_momo':
        return { label: t('checkout.mtnMomo'), badgeBg: '#FFCC00', badgeColor: '#000000' };
      case 'orange_money':
        return { label: t('checkout.orangeMoney'), badgeBg: '#FF7900', badgeColor: '#FFFFFF' };
      case 'card':
        return { label: t('checkout.card'), badgeBg: '#1E293B', badgeColor: '#FFFFFF' };
      case 'cash_on_delivery':
      default:
        return { label: t('checkout.cod'), badgeBg: '#FF6B00', badgeColor: '#FFFFFF' };
    }
  };

  const paymentInfo = getPaymentMethodDisplay(order.paymentMethod);

  return (
    <Container maxWidth="md" sx={{ py: 6 }} className="print-area">
      {/* Print media stylesheet */}
      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              header, nav, footer, .print-hide, .MuiButton-root { display: none !important; }
              body { background: #FFFFFF !important; color: #000000 !important; }
              .print-area { padding: 0 !important; max-width: 100% !important; }
            }
          `
        }}
      />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A110A' : '#FFFFFF'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.5)'
              : '0 8px 32px rgba(255, 107, 0, 0.08)',
        }}
      >
        {/* Simulated SMS Notification Alert */}
        <Box
          className="print-hide"
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2.5,
            bgcolor: 'rgba(22, 163, 74, 0.08)',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <CheckCircleIcon sx={{ color: '#16A34A', fontSize: 24, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: '#16A34A', fontWeight: 600 }}>
            {t('orderSuccess.smsSentNotice', { phone: order.customer?.phone || '+237 6xx xxx xxx' })}
          </Typography>
        </Box>

        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 68, color: '#16A34A', mb: 1.5 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Space Grotesk, sans-serif', color: 'text.primary' }}>
            {t('orderSuccess.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('orderSuccess.subtitle')}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <Chip
              icon={<ShoppingBagOutlinedIcon sx={{ color: '#FFFFFF !important' }} />}
              label={`${t('orderSuccess.orderRef')}: ${order.orderNumber}`}
              onClick={handleCopyOrderRef}
              sx={{
                px: 1.5,
                py: 2.2,
                fontWeight: 700,
                fontSize: '0.95rem',
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)',
                cursor: 'pointer',
              }}
            />
            <Chip
              icon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
              label="Copy"
              size="small"
              onClick={handleCopyOrderRef}
              className="print-hide"
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            />
          </Stack>
        </Box>

        {/* Action Bar (Print, WhatsApp Share, Refresh Status) */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          className="print-hide"
          sx={{ justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}
        >
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrintReceipt}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { borderColor: '#FF6B00' }
            }}
          >
            {t('orderSuccess.printReceipt', 'Print / Download Receipt')}
          </Button>

          <Button
            variant="outlined"
            startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
            onClick={handleShareWhatsApp}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              borderColor: 'rgba(37, 211, 102, 0.4)',
              color: '#25D366',
              '&:hover': { borderColor: '#25D366', bgcolor: 'rgba(37, 211, 102, 0.08)' }
            }}
          >
            {t('orderSuccess.shareWhatsApp', 'Share on WhatsApp')}
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => fetchOrderData(order.orderNumber)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': { borderColor: 'text.primary' }
            }}
          >
            {t('orderSuccess.refreshStatus', 'Refresh Status')}
          </Button>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Order Status Stepper */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontFamily: 'Space Grotesk, sans-serif', color: 'text.primary' }}>
            {t('orderSuccess.orderStatus')}
          </Typography>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: 13,
                '&.Mui-active': { color: '#FF6B00', fontWeight: 700 },
                '&.Mui-completed': { color: '#16A34A', fontWeight: 700 },
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255, 107, 0, 0.25)',
                '&.Mui-active': { color: '#FF6B00' },
                '&.Mui-completed': { color: '#16A34A' },
              },
            }}
          >
            {orderSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Order Summary Details: 3 Columns on sm+ */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF6B00', mb: 1, textTransform: 'uppercase', fontSize: 12 }}>
              {t('orderSuccess.customerInfo')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
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
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF6B00', mb: 1, textTransform: 'uppercase', fontSize: 12 }}>
              {t('orderSuccess.deliveryAddress')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {order.shippingAddress.street}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.country}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF6B00', mb: 1, textTransform: 'uppercase', fontSize: 12 }}>
              {t('orderSuccess.paymentChannel')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              {paymentInfo.label}
            </Typography>
            <Chip
              label={order.paymentStatus === 'paid' ? t('orderSuccess.paid') : t('orderSuccess.pending')}
              size="small"
              sx={{
                bgcolor: order.paymentStatus === 'paid' ? '#16A34A' : '#FF6B00',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 10,
                height: 22,
                mb: 0.5,
              }}
            />
            {order.transactionReference && (
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontFamily: 'monospace', fontSize: 11 }}>
                TxRef: {order.transactionReference}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Purchased Items List */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          {t('orderSuccess.purchasedItems')} ({order.items.length})
        </Typography>
        <List disablePadding sx={{ mb: 4 }}>
          {order.items.map((item: any, idx: number) => (
            <ListItem key={idx} disableGutters sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Avatar variant="rounded" src={item.image} alt={item.title} sx={{ width: 48, height: 48, mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('checkout.qty')}: {item.quantity} × XAF {item.price.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                XAF {(item.price * item.quantity).toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>

        {/* Pricing Totals */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.08)' : '#FFF7F2'),
            border: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#FFE4D4'),
            mb: 4,
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('orderSuccess.subtotal')}:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', color: 'text.primary' }}>
              XAF {order.subtotal.toLocaleString()}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t('orderSuccess.shipping')}:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', color: order.shippingFee === 0 ? 'success.main' : 'text.primary' }}>
              {order.shippingFee === 0 ? t('orderSuccess.free') : `XAF ${order.shippingFee.toLocaleString()}`}
            </Typography>

            <Box sx={{ gridColumn: 'span 2', my: 1 }}>
              <Divider />
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {t('orderSuccess.totalAmount')}:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, textAlign: 'right', color: '#FF6B00' }}>
              XAF {order.totalAmount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center' }} className="print-hide">
          <Button
            variant="contained"
            size="large"
            startIcon={<LocalShippingOutlinedIcon />}
            onClick={() => navigate('/shop')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              '&:hover': { bgcolor: '#E05D00' },
            }}
          >
            {t('orderSuccess.continueShopping')}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={copyNotice}
        autoHideDuration={2500}
        onClose={() => setCopyNotice(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', fontWeight: 600 }}>
          Order reference copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};
