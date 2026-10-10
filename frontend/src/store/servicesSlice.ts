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
    id: 'srv-gas',
    title: 'Cooking Gas Refill & Delivery',
    category: 'Cooking Gas',
    categoryLabel: 'Cooking Gas',
    description: 'Instant delivery and secure installation of your cooking gas cylinders directly to your kitchen.',
    priceRange: 'XAF 6,500 – 14,000',
    estimatedTime: '30–45 mins',
    iconName: 'Flame',
    isLive: true,
    featured: true,
    imageUrl: '/images/gas_delivery.png',
  },
  {
    id: 'srv-market',
    title: 'Prepped Foods & Market Shopping',
    category: 'Market Shop',
    categoryLabel: 'Market Shop',
    description: 'Get fresh, prepped ingredients and complete market runs dispatched by our shopping runners.',
    priceRange: 'XAF 5,000 – 35,000',
    estimatedTime: '60–90 mins',
    iconName: 'ShoppingCart',
    isLive: true,
    featured: true,
    imageUrl: '/images/market_shopping.png',
  },
  {
    id: 'srv-school',
    title: 'Back to School Shopping',
    category: 'School Shop',
    categoryLabel: 'School Shop',
    description: 'Bulk book uniforms, textbooks, and school kits delivered directly to your home before the bells ring.',
    priceRange: 'XAF 15,000 – 85,000',
    estimatedTime: 'Same day',
    iconName: 'GraduationCap',
    isLive: true,
    featured: true,
    imageUrl: '/images/back_to_school.png',
  },
  {
    id: 'srv-cleaning',
    title: 'Deep Home & Office Cleaning',
    category: 'Cleaning',
    categoryLabel: 'Cleaning',
    description: 'Professional cleaning crews equipped to restore homes, offices, or post-construction spaces.',
    priceRange: 'XAF 12,000 – 60,000',
    estimatedTime: '2–4 hours',
    iconName: 'Sparkles',
    isLive: true,
    featured: true,
    imageUrl: '/images/deep_cleaning.png',
  },
  {
    id: 'srv-security',
    title: 'Digital Security & CCTV Install',
    category: 'CCTV & Security',
    categoryLabel: 'CCTV & Security',
    description: 'Request surveys, CCTV security cameras setup, and digital lock installations by verified pros.',
    priceRange: 'XAF 45,000 – 250,000',
    estimatedTime: '24h dispatch',
    iconName: 'ShieldCheck',
    isLive: true,
    featured: true,
    imageUrl: '/images/digital_security.png',
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
