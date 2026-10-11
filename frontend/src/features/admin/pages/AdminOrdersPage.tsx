import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  List,
  ListItem,
  Avatar,
  Divider,
  TextField
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../../api/client';
import { ReusableDataTable, type ColumnDef } from '../../../components/ui/ReusableDataTable';

const ORDER_STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [newStatus, setNewStatus] = useState<string>('pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>('pending');
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res: any = await api.orders.getAdminList();
      if (res?.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setTrackingNumber(order.trackingNumber || '');
    setOpenModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      await api.orders.updateStatus(selectedOrder._id, {
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus,
        trackingNumber
      });
      setOpenModal(false);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (selectedStatus === 'all') return true;
    return ord.orderStatus?.toLowerCase() === selectedStatus.toLowerCase();
  });

  const columns: ColumnDef<any>[] = [
    {
      id: 'orderNumber',
      label: 'ORDER #',
      minWidth: 160,
      render: (ord) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace' }}>
            {ord.orderNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {ord.items?.length || 0} items
          </Typography>
        </Box>
      ),
    },
    {
      id: 'customer',
      label: 'CUSTOMER',
      minWidth: 200,
      render: (ord) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{ord.customer?.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {ord.customer?.email}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'date',
      label: 'DATE',
      minWidth: 130,
      render: (ord) => (
        <Typography variant="body2" color="text.secondary">
          {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'N/A'}
        </Typography>
      ),
    },
    {
      id: 'total',
      label: 'TOTAL',
      minWidth: 140,
      render: (ord) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FF6B00' }}>
          XAF {(ord.totalAmount || 0).toLocaleString()}
        </Typography>
      ),
    },
    {
      id: 'payment',
      label: 'PAYMENT',
      minWidth: 160,
      render: (ord) => {
        const methodLabels: Record<string, { label: string; bg: string; color: string }> = {
          orange_money: { label: 'Orange Money', bg: 'rgba(255, 121, 0, 0.12)', color: '#FF7900' },
          mtn_momo: { label: 'MTN MoMo', bg: 'rgba(255, 204, 0, 0.18)', color: '#B38600' },
          card: { label: 'Card Online', bg: 'rgba(37, 99, 235, 0.12)', color: '#2563EB' },
          cash_on_delivery: { label: 'COD (Doorstep)', bg: 'rgba(255, 107, 0, 0.12)', color: '#FF6B00' },
        };
        const m = methodLabels[ord.paymentMethod] || {
          label: (ord.paymentMethod || 'COD').replace(/_/g, ' '),
          bg: 'rgba(100, 116, 139, 0.12)',
          color: 'text.primary',
        };
        const isPaid = ord.paymentStatus === 'paid';

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
            <Chip
              label={m.label}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: 10,
                bgcolor: m.bg,
                color: m.color,
                border: '1px solid',
                borderColor: m.color,
                height: 20,
              }}
            />
            <Chip
              label={isPaid ? 'PAID' : 'PENDING'}
              size="small"
              color={isPaid ? 'success' : 'warning'}
              sx={{ fontWeight: 800, fontSize: 10, height: 18 }}
            />
            {ord.transactionReference && (
              <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary', fontFamily: 'monospace' }}>
                {ord.transactionReference}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      id: 'status',
      label: 'STATUS',
      minWidth: 120,
      render: (ord) => (
        <Chip
          label={(ord.orderStatus || 'pending').toUpperCase()}
          size="small"
          color={getStatusChipColor(ord.orderStatus) as any}
          sx={{ fontWeight: 700, fontSize: 11 }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'ACTIONS',
      align: 'right',
      minWidth: 110,
      render: (ord) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={() => handleOpenDetail(ord)}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 700,
            borderColor: 'rgba(255, 107, 0, 0.4)',
            color: '#FF6B00',
            '&:hover': {
              borderColor: '#FF6B00',
              bgcolor: 'rgba(255, 107, 0, 0.08)',
            },
          }}
        >
          Manage
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
      {/* Status Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mr: 0.5, fontFamily: 'IBM Plex Mono, monospace' }}>
          FILTER STATUS:
        </Typography>
        {ORDER_STATUSES.map((st) => (
          <Chip
            key={st}
            label={st === 'all' ? `All (${orders.length})` : st.toUpperCase()}
            onClick={() => setSelectedStatus(st)}
            color={selectedStatus === st ? 'primary' : 'default'}
            variant={selectedStatus === st ? 'filled' : 'outlined'}
            sx={{
              fontWeight: selectedStatus === st ? 700 : 500,
              cursor: 'pointer',
              bgcolor: selectedStatus === st ? '#FF6B00' : undefined,
              '&:hover': { bgcolor: selectedStatus === st ? '#E05D00' : 'rgba(255, 107, 0, 0.08)' },
            }}
          />
        ))}
      </Box>

      {/* Infinite Scroll Reusable Data Table */}
      <ReusableDataTable
        title="Store Customer Orders"
        subtitle="View incoming purchase orders, update shipping status, and manage payments."
        columns={columns}
        data={filteredOrders}
        keyExtractor={(ord) => ord._id}
        searchPlaceholder="Search orders by order #, customer name, email, tracking..."
        enableInfiniteScroll={true}
        isLoading={loading}
      />

      {/* Order Details & Status Modal */}
      {selectedOrder && (
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Manage Order: {selectedOrder.orderNumber}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Customer Information
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {selectedOrder.customer.name} ({selectedOrder.customer.phone})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedOrder.customer.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Shipping: {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},{' '}
                  {selectedOrder.shippingAddress.postalCode}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Purchased Items
                </Typography>
                <List disablePadding>
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <ListItem key={idx} disableGutters sx={{ py: 1 }}>
                      <Avatar variant="rounded" src={item.image} alt={item.title} sx={{ width: 40, height: 40, mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.quantity} × XAF {(item.price || 0).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF6B00' }}>
                        XAF {((item.price || 0) * item.quantity).toLocaleString()}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Order Fulfillment Status</InputLabel>
                  <Select
                    value={newStatus}
                    label="Order Fulfillment Status"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={newPaymentStatus}
                    label="Payment Status"
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="refunded">Refunded</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <TextField
                fullWidth
                label="Tracking Number (Optional)"
                placeholder="e.g. TRK-99201920"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateStatus}>
              Save Status Updates
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
