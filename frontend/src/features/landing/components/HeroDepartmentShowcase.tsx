import React, { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/useToast';

interface FeaturedDepartmentProduct {
  id: string;
  department: string;
  tabLabel: string;
  tag: string;
  title: string;
  brand: string;
  price: number;
  compareAtPrice: number;
  imageUrl: string;
  stockNote: string;
}

const FEATURED_ITEMS: FeaturedDepartmentProduct[] = [
  {
    id: 'prod-showcase-shoes',
    department: 'Footwear',
    tabLabel: 'FOOTWEAR',
    tag: 'LIMITED RUN',
    title: 'Air Jordan 1 Retro High OG "Lost & Found"',
    brand: 'NIKE SPORTSWEAR',
    price: 48000,
    compareAtPrice: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    stockNote: '3 pairs remaining in Douala Hub',
  },
  {
    id: 'prod-showcase-hoodie',
    department: 'Streetwear',
    tabLabel: 'APPAREL',
    tag: 'NEW DROP',
    title: 'Oversized Heavyweight Acid-Wash Hoodie',
    brand: "KIM'S ATELIER",
    price: 24500,
    compareAtPrice: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    stockNote: 'Sizes S – XL in stock • 100% Cotton',
  },
  {
    id: 'prod-showcase-skincare',
    department: 'Cosmetics',
    tabLabel: 'BEAUTY',
    tag: 'DERM TESTED',
    title: 'Hydrating Daily B5 Barrier Repair Serum',
    brand: 'CERAVE DERMATOLOGY',
    price: 16500,
    compareAtPrice: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    stockNote: 'Sealed authentic batch • Douala dispatch',
  },
  {
    id: 'prod-showcase-tech',
    department: 'Electronics',
    tabLabel: 'TECH',
    tag: 'SPATIAL AUDIO',
    title: 'Pro ANC Wireless Earbuds with MagSafe Case',
    brand: 'APPLE ARCHIVE',
    price: 29000,
    compareAtPrice: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    stockNote: 'Official 1-Year Warranty Included',
  },
  {
    id: 'prod-showcase-snacks',
    department: 'Pantry',
    tabLabel: 'PANTRY',
    tag: 'SAME-DAY CHILL',
    title: 'Artisan Gourmet Snack & Beverage Pack',
    brand: "KIM'S PANTRY",
    price: 6500,
    compareAtPrice: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
    stockNote: 'Fresh daily batch • Campus express delivery',
  },
];

export const HeroDepartmentShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const { addToCart } = useCart();
  const toast = useToast();

  const activeItem = FEATURED_ITEMS[activeIdx];
  const discountPercent = Math.round(
    ((activeItem.compareAtPrice - activeItem.price) / activeItem.compareAtPrice) * 100
  );

  const handleQuickAdd = () => {
    addToCart({
      _id: activeItem.id,
      title: activeItem.title,
      description: `${activeItem.department} - ${activeItem.brand}`,
      price: activeItem.price,
      compareAtPrice: activeItem.compareAtPrice,
      images: [activeItem.imageUrl],
      category: activeItem.department,
      stockQuantity: 10,
      inStock: true,
      sku: `KS-DROP-${activeIdx + 1}`,
      slug: activeItem.id,
    });
    toast.success(`Added "${activeItem.title}" to bag`);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Minimalist Editorial Category Switcher (Zero Emojis) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          p: 0.5,
          borderRadius: '12px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.15)' : 'rgba(0, 0, 0, 0.06)'),
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {FEATURED_ITEMS.map((item, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <Box
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              sx={{
                flex: 1,
                py: 0.85,
                px: 1.5,
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                bgcolor: isSelected
                  ? (theme) => (theme.palette.mode === 'dark' ? '#FF6B00' : '#140C07')
                  : 'transparent',
                color: isSelected
                  ? '#FFFFFF'
                  : 'text.secondary',
                '&:hover': {
                  color: isSelected ? '#FFFFFF' : 'text.primary',
                  bgcolor: isSelected
                    ? (theme) => (theme.palette.mode === 'dark' ? '#FF6B00' : '#140C07')
                    : (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'),
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: '0.72rem',
                  fontWeight: isSelected ? 800 : 600,
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                }}
              >
                {item.tabLabel}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Flagship Product Showcase Card (Clean, Studio Editorial) */}
      <Box
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFFFFF'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.22)' : 'rgba(0, 0, 0, 0.08)'),
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0, 0, 0, 0.5)'
              : '0 16px 36px rgba(0, 0, 0, 0.06)',
          transition: 'border-color 0.2s ease',
        }}
      >
        {/* Studio Product Photo Frame */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: 220, sm: 260 },
            width: '100%',
            overflow: 'hidden',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0A0604' : '#F8FAFC'),
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
              transition: 'transform 0.4s ease',
              '&:hover': {
                transform: 'scale(1.03)',
              },
            }}
          />

          {/* Minimalist Status Tag */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              py: 0.35,
              px: 1,
              borderRadius: '6px',
              bgcolor: 'rgba(0, 0, 0, 0.72)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {activeItem.tag}
          </Box>
        </Box>

        {/* Product Details & Action Tray */}
        <Box sx={{ p: 2.5 }}>
          {/* Brand & Title */}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              sx={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#FF6B00',
                textTransform: 'uppercase',
                mb: 0.5,
              }}
            >
              {activeItem.brand}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                fontSize: '1.05rem',
                lineHeight: 1.3,
                color: 'text.primary',
              }}
              noWrap
            >
              {activeItem.title}
            </Typography>
          </Box>

          {/* Price & Discount Lockup */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.25, mb: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.25rem',
                color: 'text.primary',
                letterSpacing: '-0.02em',
              }}
            >
              XAF {activeItem.price.toLocaleString()}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              XAF {activeItem.compareAtPrice.toLocaleString()}
            </Typography>
            <Box
              sx={{
                py: 0.2,
                px: 0.7,
                borderRadius: '4px',
                bgcolor: 'rgba(255, 107, 0, 0.12)',
                color: '#FF6B00',
                fontSize: '0.65rem',
                fontWeight: 800,
                fontFamily: "'Space Grotesk', monospace",
              }}
            >
              -{discountPercent}%
            </Box>
          </Box>

          {/* Availability & Delivery Indicator */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: '#22C55E',
                boxShadow: '0 0 6px #22C55E',
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>
              {activeItem.stockNote}
            </Typography>
          </Stack>

          {/* High-Conviction CTA Button */}
          <Button
            fullWidth
            onClick={handleQuickAdd}
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              py: 1.25,
              borderRadius: '10px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'none',
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)',
              '&:hover': {
                bgcolor: '#E05D00',
                boxShadow: '0 6px 18px rgba(255, 107, 0, 0.4)',
              },
            }}
          >
            Add to Shopping Bag
          </Button>

          {/* Micro Payment Rails Trustline */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              mt: 1.5,
              pt: 1.25,
              borderTop: (theme) =>
                `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '0.62rem',
                color: 'text.disabled',
                letterSpacing: '0.04em',
              }}
            >
              MTN MOMO • ORANGE MONEY • CASH ON DELIVERY
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroDepartmentShowcase;
