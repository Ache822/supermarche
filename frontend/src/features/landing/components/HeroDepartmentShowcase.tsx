import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Chip } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/useToast';

interface FeaturedDepartmentProduct {
  id: string;
  department: string;
  tabLabel: string;
  emoji: string;
  title: string;
  brand: string;
  price: number;
  compareAtPrice: number;
  imageUrl: string;
  stockNote: string;
  badgeText: string;
}

const FEATURED_ITEMS: FeaturedDepartmentProduct[] = [
  {
    id: 'prod-showcase-shoes',
    department: 'Footwear & Kicks',
    tabLabel: 'Kicks',
    emoji: '👟',
    title: 'Air Jordan 1 Retro High "Lost & Found"',
    brand: 'NIKE // VINTAGE SERIES',
    price: 48000,
    compareAtPrice: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    stockNote: '3 Pairs Remaining in Douala Hub',
    badgeText: 'Trending #1 This Week',
  },
  {
    id: 'prod-showcase-hoodie',
    department: 'Apparel & Fashion',
    tabLabel: 'Streetwear',
    emoji: '👕',
    title: 'Oversized Heavyweight Acid-Wash Hoodie',
    brand: "KIM'S ESSENTIALS // DROP 04",
    price: 24500,
    compareAtPrice: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    stockNote: 'Selling Fast • Sizes S-XL In Stock',
    badgeText: 'Gen-Z Best Seller',
  },
  {
    id: 'prod-showcase-skincare',
    department: 'Cosmetics & Beauty',
    tabLabel: 'Glow Care',
    emoji: '✨',
    title: 'Advanced Hydration B5 Glow Repair Serum',
    brand: 'CERAVE // DERMA LABS',
    price: 16500,
    compareAtPrice: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    stockNote: '100% Authentic Sealed Batch',
    badgeText: 'Dermatologist Pick',
  },
  {
    id: 'prod-showcase-tech',
    department: 'Electronics & Tech',
    tabLabel: 'Tech Gear',
    emoji: '🎧',
    title: 'Pro ANC Wireless Earbuds with Spatial Audio',
    brand: 'SOUNDCORE // ULTRA TECH',
    price: 29000,
    compareAtPrice: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    stockNote: 'Official 1-Year Warranty Included',
    badgeText: 'Top Tech Drop',
  },
  {
    id: 'prod-showcase-snacks',
    department: 'Fresh Produce & Snacks',
    tabLabel: 'Snacks & Sips',
    emoji: '🍿',
    title: 'Artisan Crispy Gourmet Treat Bundle',
    brand: "KIM'S PANTRY // DELIGHTS",
    price: 6500,
    compareAtPrice: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
    stockNote: 'Fresh Batch Delivered Same-Day',
    badgeText: 'Campus Favorite',
  },
];

export const HeroDepartmentShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const { addToCart } = useCart();
  const toast = useToast();

  const activeItem = FEATURED_ITEMS[activeIdx];

  const handleQuickAdd = () => {
    addToCart({
      _id: activeItem.id,
      title: activeItem.title,
      description: `${activeItem.department} - ${activeItem.badgeText}`,
      price: activeItem.price,
      compareAtPrice: activeItem.compareAtPrice,
      images: [activeItem.imageUrl],
      category: activeItem.department,
      stockQuantity: 10,
      inStock: true,
      sku: `KS-DROP-${activeIdx + 1}`,
      slug: activeItem.id,
    });
    toast.success(`Added "${activeItem.title}" to your shopping bag!`);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative',
      }}
    >
      {/* Department Selector Pills */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          overflowX: 'auto',
          pb: 0.5,
          width: '100%',
          '&::-webkit-scrollbar': { height: '3px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 107, 0, 0.3)', borderRadius: '3px' },
        }}
      >
        {FEATURED_ITEMS.map((item, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <Chip
              key={item.id}
              label={`${item.emoji} ${item.tabLabel}`}
              onClick={() => setActiveIdx(idx)}
              clickable
              size="small"
              sx={{
                fontSize: 12,
                fontWeight: isSelected ? 800 : 600,
                fontFamily: 'Space Grotesk, sans-serif',
                borderRadius: '8px',
                py: 1.8,
                px: 0.8,
                cursor: 'pointer',
                bgcolor: isSelected
                  ? '#FF6B00'
                  : (theme) => (theme.palette.mode === 'dark' ? 'rgba(31, 20, 12, 0.7)' : 'rgba(255, 255, 255, 0.8)'),
                color: isSelected ? '#FFFFFF' : 'text.primary',
                border: '1px solid',
                borderColor: isSelected
                  ? '#FF6B00'
                  : (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255, 107, 0, 0.15)'),
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isSelected ? '#E05D00' : 'rgba(255, 107, 0, 0.12)',
                  transform: 'translateY(-1px)',
                },
              }}
            />
          );
        })}
      </Stack>

      {/* Main Interactive Showcase Card */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1B1109' : '#FFFFFF'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.25)' : 'rgba(255, 107, 0, 0.18)'),
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 107, 0, 0.1)'
              : '0 20px 45px rgba(255, 107, 0, 0.12), 0 0 20px rgba(255, 107, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Visual Frame */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: 240, sm: 280 },
            width: '100%',
            overflow: 'hidden',
            bgcolor: '#0E0804',
          }}
        >
          <Box
            component="img"
            key={activeItem.imageUrl}
            src={activeItem.imageUrl}
            alt={activeItem.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'fadeInImage 0.4s ease-out',
              '@keyframes fadeInImage': {
                '0%': { opacity: 0, transform: 'scale(1.05)' },
                '100%': { opacity: 1, transform: 'scale(1)' },
              },
              '&:hover': {
                transform: 'scale(1.06)',
              },
            }}
          />

          {/* Vignette Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(20, 12, 7, 0.85) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Left Floating Tag */}
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              left: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              py: 0.5,
              px: 1.25,
              borderRadius: '9999px',
              bgcolor: 'rgba(20, 12, 7, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 107, 0, 0.35)',
              color: '#FF6B00',
            }}
          >
            <LocalFireDepartmentIcon sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              {activeItem.badgeText}
            </Typography>
          </Box>

          {/* Top Right Department Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              py: 0.4,
              px: 1.2,
              borderRadius: '8px',
              bgcolor: 'rgba(255, 107, 0, 0.9)',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 800,
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.05em',
            }}
          >
            {activeItem.department.toUpperCase()}
          </Box>

          {/* Bottom Overlaid Delivery Indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 14,
              right: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}
          >
            <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
              <BoltIcon sx={{ color: '#FFB800', fontSize: 16 }} />
              <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>
                30-Min Campus & Doorstep Dispatch
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 10.5, fontFamily: 'IBM Plex Mono, monospace', color: '#FFB28A' }}>
              DOUALA & YAOUNDÉ
            </Typography>
          </Box>
        </Box>

        {/* Content & Action Tray */}
        <Box sx={{ p: { xs: 2.2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 800,
                  fontFamily: 'IBM Plex Mono, monospace',
                  letterSpacing: '0.1em',
                  color: '#FF6B00',
                  mb: 0.3,
                }}
              >
                {activeItem.brand}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: { xs: 15, sm: 17 },
                  lineHeight: 1.25,
                  color: 'text.primary',
                }}
                noWrap
              >
                {activeItem.title}
              </Typography>
            </Box>

            {/* Price Block */}
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: { xs: 18, sm: 20 },
                  color: '#FF6B00',
                  lineHeight: 1,
                }}
              >
                XAF {activeItem.price.toLocaleString()}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  color: 'text.secondary',
                  textDecoration: 'line-through',
                  mt: 0.3,
                }}
              >
                XAF {activeItem.compareAtPrice.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Stock Availability Indicator */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.8,
              px: 1.4,
              borderRadius: '10px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.1)' : '#F0FDF4'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.25)' : '#BBF7D0'),
              mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 14, color: '#16A34A' }} />
            <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: (theme) => (theme.palette.mode === 'dark' ? '#86EFAC' : '#15803D') }}>
              {activeItem.stockNote}
            </Typography>
          </Box>

          {/* CTA Action Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleQuickAdd}
            startIcon={<ShoppingBagIcon />}
            sx={{
              borderRadius: '14px',
              py: 1.3,
              fontWeight: 800,
              fontSize: 14,
              fontFamily: 'Space Grotesk, sans-serif',
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(255, 107, 0, 0.35)',
              transition: 'all 0.25s ease',
              '&:hover': {
                bgcolor: '#E05D00',
                boxShadow: '0 12px 28px rgba(255, 107, 0, 0.5)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Add to Shopping Bag
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroDepartmentShowcase;
