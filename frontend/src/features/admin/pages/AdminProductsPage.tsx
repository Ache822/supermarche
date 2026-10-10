import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Stack,
  FormControlLabel,
  Switch,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import api from '../../../api/client';
import type { ProductItem } from '../../../context/CartContext';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    category: 'Fresh Produce',
    stockQuantity: '20',
    imageUrl: '',
    sku: '',
    featured: false
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res: any = await api.products.list();
      if (res?.success) {
        setProducts(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      price: '',
      compareAtPrice: '',
      category: 'Fresh Produce',
      stockQuantity: '20',
      imageUrl: '',
      sku: '',
      featured: false
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingId(product._id);
    setFormData({
      title: product.title,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
      category: product.category,
      stockQuantity: String(product.stockQuantity),
      imageUrl: product.images?.[0] || '',
      sku: product.sku || '',
      featured: Boolean(product.attributes?.featured || false)
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.products.delete(id);
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        category: formData.category,
        stockQuantity: Number(formData.stockQuantity),
        images: formData.imageUrl ? [formData.imageUrl] : [],
        sku: formData.sku,
        featured: formData.featured
      };

      if (editingId) {
        await api.products.update(editingId, payload);
      } else {
        await api.products.create(payload);
      }

      setOpenModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Save product error:', err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Inventory2OutlinedIcon color="primary" fontSize="large" /> Store Product Catalog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage store inventory, update prices, stock levels, and add new items.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
          Add New Product
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock Level</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod) => (
                <TableRow key={prod._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Box
                        component="img"
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                        alt={prod.title}
                        sx={{ width: 48, height: 48, borderRadius: 2, objectFit: 'cover' }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {prod.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SKU: {prod.sku || 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Chip label={prod.category} size="small" variant="outlined" />
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700 }}>
                      ${prod.price.toFixed(2)}
                    </Typography>
                    {prod.compareAtPrice && (
                      <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        ${prod.compareAtPrice.toFixed(2)}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={`${prod.stockQuantity} units`}
                      size="small"
                      color={prod.stockQuantity > 10 ? 'success' : prod.stockQuantity > 0 ? 'warning' : 'error'}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={prod.inStock ? 'Available' : 'Sold Out'}
                      color={prod.inStock ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(prod)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(prod._id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Product Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSaveProduct}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <TextField
                  required
                  fullWidth
                  label="Product Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Box>

              <TextField
                select
                required
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {['Fresh Produce', 'Bakery', 'Dairy & Eggs', 'Pantry', 'Snacks & Sweets', 'Beverages'].map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                fullWidth
                type="number"
                label="Stock Quantity"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              />

              <TextField
                required
                fullWidth
                type="number"
                label="Price ($)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />

              <TextField
                fullWidth
                type="number"
                label="Original / Compare Price ($)"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
              />

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                  }
                  label="Feature this product on homepage"
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save Product
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
