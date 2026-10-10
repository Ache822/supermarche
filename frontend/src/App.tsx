import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';
import { UnprotectedRoutes, ProtectedRoutes } from './routes';
import { useAppDispatch } from './store/hooks';
import { setServices } from './store/servicesSlice';
import type { ServiceItem } from './types';
import api from './api/client';
import { useVisitorTracker } from './hooks/useVisitorTracker';
import { CartProvider } from './context/CartContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function VisitorTrackerRunner() {
  useVisitorTracker();
  return null;
}

export function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('data-mui-color-scheme', mode);
    if (mode === 'light') {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
  }, [mode]);

  // Pull live services catalog from backend API on initial mount
  useEffect(() => {
    api.services.getPaginatedServices<{ data?: ServiceItem[] }>()
      .then((res: { data?: ServiceItem[] }) => {
        const items = res?.data || (Array.isArray(res) ? (res as ServiceItem[]) : []);
        if (items && items.length > 0) {
          dispatch(setServices(items as ServiceItem[]));
        }
      })
      .catch(() => {});
  }, [dispatch]);

  const handleToggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) {
      setPreselectedServiceId(serviceId);
    } else {
      setPreselectedServiceId(null);
    }
    setBookingOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <VisitorTrackerRunner />
          <Routes>
            {/* Unprotected / Public Routes (Landing, About, Help, Become Pro, Download, Admin Login) */}
            {UnprotectedRoutes({
              mode,
              onToggleTheme: handleToggleTheme,
              bookingOpen,
              setBookingOpen,
              preselectedServiceId,
              chatOpen,
              setChatOpen,
              handleOpenBooking,
            })}

            {/* Protected Admin Routes (Guarded by AdminProtectedRoute & AdminLayout) */}
            {ProtectedRoutes({
              mode,
              onToggleTheme: handleToggleTheme,
            })}
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
