import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ServiceItem } from '../types';

interface ServicesState {
  items: ServiceItem[];
  selectedCategory: string;
  searchQuery: string;
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-clothes',
    title: 'Trending Campus Apparel & Streetwear',
    category: 'Campus Apparel',
    categoryLabel: 'Campus Apparel',
    description: 'Premium oversized hoodies, graphic vintage tees, denim jackets, and varsity gear styled for campus life.',
    priceRange: 'XAF 8,500 – 22,000',
    estimatedTime: '15–30 mins campus delivery',
    iconName: 'ShoppingBag',
    isLive: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'srv-shoes',
    title: 'Urban Sneakers & Campus Kicks',
    category: 'Footwear & Shoes',
    categoryLabel: 'Footwear & Shoes',
    description: 'High-top retro sneakers, breathable running shoes, slide sandals, and casual everyday kicks.',
    priceRange: 'XAF 14,000 – 45,000',
    estimatedTime: 'Same-day express',
    iconName: 'Footprints',
    isLive: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'srv-cosmetics',
    title: 'Glow Skincare & Beauty Essentials',
    category: 'Cosmetics & Beauty',
    categoryLabel: 'Cosmetics & Beauty',
    description: 'Hydrating face serums, SPF sunscreens, lip tints, body mists, and daily hygiene essentials.',
    priceRange: 'XAF 3,500 – 18,000',
    estimatedTime: '20–40 mins',
    iconName: 'Sparkles',
    isLive: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'srv-tech',
    title: 'Wireless Earbuds & Power Accessories',
    category: 'Tech Accessories',
    categoryLabel: 'Tech Accessories',
    description: 'Noise-canceling ANC earbuds, 20,000mAh fast-charge power banks, desk lamps, and cables.',
    priceRange: 'XAF 6,000 – 32,000',
    estimatedTime: 'Express 30 mins',
    iconName: 'Headphones',
    isLive: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'srv-snacks',
    title: 'Dorm Snacks, Instant Meals & Drinks',
    category: 'Snacks & Drinks',
    categoryLabel: 'Snacks & Drinks',
    description: 'Quick-prep ramen packs, energy drinks, imported chocolates, and late-night study study bites.',
    priceRange: 'XAF 1,000 – 8,000',
    estimatedTime: '15 mins express',
    iconName: 'Utensils',
    isLive: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
  },
];

const initialState: ServicesState = {
  items: DEFAULT_SERVICES,
  selectedCategory: 'all',
  searchQuery: '',
};

export const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setServices: (state, action: PayloadAction<ServiceItem[]>) => {
      state.items = action.payload;
    },
    addServiceItem: (state, action: PayloadAction<ServiceItem>) => {
      const idx = state.items.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      } else {
        state.items.unshift(action.payload);
      }
    },
    deleteServiceItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((s) => s.id !== action.payload);
    },
  },
});

export const { setSelectedCategory, setSearchQuery, setServices, addServiceItem, deleteServiceItem } = servicesSlice.actions;
export default servicesSlice.reducer;
