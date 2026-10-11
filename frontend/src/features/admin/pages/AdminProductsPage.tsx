import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../../api/client';
import type { ProductItem } from '../../../context/CartContext';
import { ReusableDataTable, type ColumnDef } from '../../../components/ui/ReusableDataTable';

const STORE_CATEGORIES = [
  'Apparel & Fashion',
  'Footwear & Shoes',
  'Cosmetics & Beauty',
  'Electronics & Tech',
  'Fresh Produce & Snacks'
];

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    category: STORE_CATEGORIES[0],
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
      category: STORE_CATEGORIES[0],
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
      category:
        typeof product.category === 'object' && product.category !== null
          ? (product.category as any).name || STORE_CATEGORIES[0]
          : product.categoryLabel || product.category || STORE_CATEGORIES[0],
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

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res: any = await api.products.uploadImage({
          filename: file.name,
          fileData: base64Data
        });
        const uploadedUrl = res?.imageUrl || res?.data?.imageUrl || res?.url || base64Data;
        setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      } catch (err) {
        console.error('Upload failed, using base64 preview:', err);
        setFormData((prev) => ({ ...prev, imageUrl: base64Data }));
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
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

  const filteredProducts = products.filter((prod) => {
    if (selectedCategory === 'All') return true;
    const catName =
      typeof prod.category === 'object' && prod.category !== null
        ? (prod.category as any).name || ''
        : prod.categoryLabel || prod.category || '';
    return catName.toLowerCase() === selectedCategory.toLowerCase();
  });

  const columns: ColumnDef<ProductItem>[] = [
    {
      id: 'product',
      label: 'PRODUCT',
      minWidth: 260,
      render: (prod) => (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Box
            component="img"
            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
            alt={prod.title}
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              objectFit: 'cover',
              border: '1px solid rgba(255, 107, 0, 0.25)',
              bgcolor: 'background.paper',
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13 }} noWrap>
              {prod.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              SKU: {prod.sku || 'N/A'}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 'category',
      label: 'CATEGORY',
      minWidth: 160,
      render: (prod) => {
        const catLabel =
          typeof prod.category === 'object' && prod.category !== null
            ? (prod.category as any).name || 'General'
            : prod.categoryLabel || prod.category || 'General';
        return (
          <Chip
            label={catLabel}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 11,
              bgcolor: 'rgba(255, 107, 0, 0.1)',
              color: '#FF6B00',
              border: '1px solid rgba(255, 107, 0, 0.25)',
            }}
          />
        );
      },
    },
    {
      id: 'price',
      label: 'PRICE (FCFA)',
      minWidth: 140,
      render: (prod) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FF6B00' }}>
            XAF {prod.price.toLocaleString()}
          </Typography>
          {prod.compareAtPrice && (
            <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', fontSize: 11 }}>
              XAF {prod.compareAtPrice.toLocaleString()}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'stock',
      label: 'STOCK LEVEL',
      minWidth: 130,
      render: (prod) => (
        <Chip
          label={`${prod.stockQuantity} units`}
          size="small"
          color={prod.stockQuantity > 10 ? 'success' : prod.stockQuantity > 0 ? 'warning' : 'error'}
          sx={{ fontWeight: 700, fontSize: 11 }}
        />
      ),
    },
    {
      id: 'status',
      label: 'STATUS',
      minWidth: 110,
      render: (prod) => (
        <Chip
          label={prod.inStock ? 'Available' : 'Sold Out'}
          color={prod.inStock ? 'success' : 'default'}
          variant={prod.inStock ? 'filled' : 'outlined'}
          size="small"
          sx={{ fontWeight: 700, fontSize: 11 }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'ACTIONS',
      align: 'right',
      minWidth: 110,
      render: (prod) => (
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
          <IconButton size="small" onClick={() => handleOpenEdit(prod)} sx={{ color: '#FF6B00' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(prod._id)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
      {/* Category Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mr: 0.5, fontFamily: 'IBM Plex Mono, monospace' }}>
          DEPARTMENTS:
        </Typography>
        {['All', ...STORE_CATEGORIES].map((cat) => (
          <Chip
            key={cat}
            label={cat === 'All' ? `All (${products.length})` : cat}
            onClick={() => setSelectedCategory(cat)}
            color={selectedCategory === cat ? 'primary' : 'default'}
            variant={selectedCategory === cat ? 'filled' : 'outlined'}
            sx={{
              fontWeight: selectedCategory === cat ? 700 : 500,
              cursor: 'pointer',
              bgcolor: selectedCategory === cat ? '#FF6B00' : undefined,
              '&:hover': { bgcolor: selectedCategory === cat ? '#E05D00' : 'rgba(255, 107, 0, 0.08)' },
            }}
          />
        ))}
      </Box>

      {/* Infinite Scroll Reusable Data Table */}
      <ReusableDataTable
        title="Store Product Catalog"
        subtitle="Manage store inventory, update prices (FCFA), stock levels, and upload product images."
        columns={columns}
        data={filteredProducts}
        keyExtractor={(p) => p._id}
        searchPlaceholder="Search products by title, SKU, category, or price..."
        enableInfiniteScroll={true}
        isLoading={loading}
        headerActions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              borderRadius: '10px',
              px: 2.5,
              fontWeight: 700,
              bgcolor: '#FF6B00',
              '&:hover': { bgcolor: '#E05D00' },
              textTransform: 'none',
            }}
          >
            Add New Product
          </Button>
        }
      />

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
                {STORE_CATEGORIES.map((cat) => (
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
                label="Price (FCFA)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />

              <TextField
                fullWidth
                type="number"
                label="Original / Compare Price (FCFA)"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
              />

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label="Image URL or Uploaded Path"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={uploadingImage ? <CircularProgress size={18} /> : <CloudUploadIcon />}
                    disabled={uploadingImage}
                    sx={{ height: 56, whitespace: 'nowrap', px: 3 }}
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" hidden onChange={handleImageFileUpload} />
                  </Button>
                </Stack>
                {formData.imageUrl && (
                  <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={formData.imageUrl}
                      alt="Preview"
                      sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Image Preview
                    </Typography>
                  </Box>
                )}
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

