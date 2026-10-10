// Supermarche design tokens
// Single source of truth — theme.ts, components, and CSS read from here.

export const brand = {
  50: '#FFF4ED',
  100: '#FFE4D4',
  200: '#FFC4A8',
  300: '#FFA27B',
  400: '#FF814D',
  500: '#FF6B00', // base brand vibrant orange
  600: '#E05D00',
  700: '#B84A00',
  800: '#8F3800',
  900: '#662600',
} as const;

// Fresh Produce Accent
export const freshProduce = {
  500: '#10B981',
  600: '#059669',
} as const;

// Reserved strictly for "action_needed" / urgent states
export const rust = {
  100: '#F6E4D3',
  400: '#D98F52',
  500: '#C97B3D',
  700: '#8F5424',
} as const;

export const surface = {
  light: {
    page: '#FFFFFF',
    card: '#FFFFFF',
    cardAlt: '#FFF8F4',
    border: '#E2E8F0',
  },
  dark: {
    page: '#120E16', // Sleek dark charcoal slate with warm undertone
    card: '#1C1724', // Ultra-clean dark card
    cardAlt: '#251F30',
    border: '#362C44',
  },
} as const;

export const text = {
  light: {
    primary: '#2D1500',
    secondary: '#8F3800',
    muted: '#7A5A4A',
  },
  dark: {
    primary: '#FFFFFF',
    secondary: '#FFC4A8',
    muted: '#B0A4B8',
  },
} as const;

export const fonts = {
  display: `'Space Grotesk', sans-serif`, // headings — technical, engineered
  body: `'Inter', sans-serif`,             // UI text, forms, descriptions
  mono: `'IBM Plex Mono', monospace`,      // job IDs, ETAs, prices, timestamps
} as const;

export const radius = {
  control: '8px',
  card: '4px',
} as const;
