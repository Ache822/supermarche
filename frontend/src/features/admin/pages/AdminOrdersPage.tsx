import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  CircularProgress,
  List,
  ListItem,
  Avatar,
  Divider,
  TextField
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../../api/client';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);

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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <LocalShippingIcon color="primary" fontSize="large" /> Store Customer Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        View incoming purchase orders, update shipping status, and manage payments.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">No customer orders recorded yet.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((ord) => (
                <TableRow key={ord._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {ord.orderNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ord.items?.length || 0} items
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2">{ord.customer?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ord.customer?.email}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700 }}>
                      ${ord.totalAmount?.toFixed(2)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={`${ord.paymentMethod.replace(/_/g, ' ')} (${ord.paymentStatus})`}
                      size="small"
                      color={ord.paymentStatus === 'paid' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={ord.orderStatus.toUpperCase()}
                      size="small"
                      color={getStatusChipColor(ord.orderStatus) as any}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleOpenDetail(ord)}
                      sx={{ borderRadius: 2 }}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
                          {item.quantity} × ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        ${(item.price * item.quantity).toFixed(2)}
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
