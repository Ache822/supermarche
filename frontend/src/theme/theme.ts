import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { brand, rust, surface, text, fonts, radius } from './tokens';

const base: ThemeOptions = {
  typography: {
    fontFamily: fonts.body,
    h1: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.01em' },
    h2: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.01em' },
    h3: { fontFamily: fonts.display, fontWeight: 500 },
    h4: { fontFamily: fonts.display, fontWeight: 500 },
    button: { fontFamily: fonts.body, fontWeight: 500, textTransform: 'none' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: radius.control, padding: '8px 20px' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem !important',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem !important',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem !important',
        },
        input: {
          fontSize: '0.8125rem !important',
          '&::placeholder': {
            fontSize: '0.8125rem !important',
            fontWeight: '400 !important',
            opacity: '0.7 !important',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem !important',
        },
        input: {
          fontSize: '0.8125rem !important',
          '&::placeholder': {
            fontSize: '0.8125rem !important',
            fontWeight: '400 !important',
            opacity: '0.7 !important',
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...base,
  palette: {
    mode: 'light',
    primary: { main: brand[500], dark: brand[600], light: brand[300], contrastText: '#FFFFFF' },
    error: { main: rust[500] },
    background: { default: surface.light.page, paper: surface.light.card },
    text: {
      primary: text.light.primary,
      secondary: text.light.secondary,
      disabled: text.light.muted,
    },
  },
});

export const darkTheme = createTheme({
  ...base,
  palette: {
    mode: 'dark',
    primary: { main: brand[400], dark: brand[500], light: brand[300], contrastText: brand[900] },
    error: { main: rust[400] },
    background: { default: surface.dark.page, paper: surface.dark.card },
    text: {
      primary: text.dark.primary,
      secondary: text.dark.secondary,
      disabled: text.dark.muted,
    },
  },
});
