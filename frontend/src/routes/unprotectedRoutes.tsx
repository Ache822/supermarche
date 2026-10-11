import { Route, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Navbar } from '../components/views/Navbar';
import { Footer } from '../components/views/Footer';
import { LandingPage } from '../features/landing/LandingPage';
import { AboutPage } from '../features/about/AboutPage';
import { HelpCenterPage } from '../features/help/HelpCenterPage';
import { HelpArticlesDirectoryPage } from '../features/help/HelpArticlesDirectoryPage';
import { AdminLoginPage } from '../features/admin/pages/AdminLoginPage';
import { BookingWizardModal } from '../features/booking/BookingWizardModal';
import { BamboLiveChatWidget } from '../components/ui/BamboLiveChatWidget';
import { SmartDownloadRedirect } from '../components/ui/SmartDownloadRedirect';
import { ServicesPage } from '../features/services/ServicesPage';
import { AcceptInvitePage } from '../features/auth/AcceptInvitePage';
import { ShopPage } from '../features/shop/ShopPage';
import { ProductDetailPage } from '../features/shop/ProductDetailPage';
import { CheckoutPage } from '../features/shop/CheckoutPage';
import { OrderSuccessPage } from '../features/shop/OrderSuccessPage';
import { CartDrawer } from '../components/ui/CartDrawer';

import { PageAnimatedWrapper } from '../components/ui/PageAnimatedWrapper';

interface UnprotectedRoutesProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  bookingOpen: boolean;
  setBookingOpen: (open: boolean) => void;
  preselectedServiceId: string | null;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  handleOpenBooking: (serviceId?: string) => void;
}

/**
 * Public Layout Wrapper for Unprotected Routes
 */
export function UnprotectedLayout({
  mode,
  onToggleTheme,
  bookingOpen,
  setBookingOpen,
  preselectedServiceId,
  chatOpen,
  setChatOpen,
  handleOpenBooking,
}: UnprotectedRoutesProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar mode={mode} onToggleTheme={onToggleTheme} onOpenBooking={() => handleOpenBooking()} />
      <Box component="main" sx={{ flex: 1 }}>
        <PageAnimatedWrapper>
          <Outlet />
        </PageAnimatedWrapper>
      </Box>
      <Footer mode={mode} onOpenBooking={(srvId) => handleOpenBooking(srvId)} />

      <CartDrawer />

      <BookingWizardModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedServiceId={preselectedServiceId}
        onOpenLiveChat={() => {
          setBookingOpen(false);
          setChatOpen(true);
        }}
      />

      <BamboLiveChatWidget
        isOpen={chatOpen}
        onToggleOpen={setChatOpen}
        onOpenBooking={(srvId) => handleOpenBooking(srvId)}
      />
    </Box>
  );
}

/**
 * Unprotected / Public Routes Component
 */
export function UnprotectedRoutes(props: UnprotectedRoutesProps) {
  const { handleOpenBooking, setChatOpen } = props;

  return (
    <>
      {/* Public Site Pages inside Main Layout */}
      <Route element={<UnprotectedLayout {...props} />}>
        <Route
          path="/"
          element={
            <LandingPage
              onOpenBookingWithService={(serviceId) => handleOpenBooking(serviceId)}
              onOpenLiveChat={() => setChatOpen(true)}
            />
          }
        />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/product/:identifier" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-status/:orderNumber" element={<OrderSuccessPage />} />
        <Route path="/track/:orderNumber" element={<OrderSuccessPage />} />
        <Route path="/track" element={<OrderSuccessPage />} />
        <Route path="/about" element={<AboutPage onOpenBooking={() => handleOpenBooking()} />} />
        <Route
          path="/help"
          element={
            <HelpCenterPage
              onOpenBooking={() => handleOpenBooking()}
              onOpenLiveChat={() => setChatOpen(true)}
            />
          }
        />
        <Route path="/help/articles" element={<HelpArticlesDirectoryPage onOpenLiveChat={() => setChatOpen(true)} />} />
        <Route path="/help/articles/:articleSlug" element={<HelpArticlesDirectoryPage onOpenLiveChat={() => setChatOpen(true)} />} />
        <Route path="/services" element={<ServicesPage onOpenBooking={(srvId) => handleOpenBooking(srvId)} />} />
        <Route path="/download" element={<SmartDownloadRedirect />} />
      </Route>

      {/* Unprotected Admin Authentication & Invitation Acceptance Pages */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/accept-invite" element={<AcceptInvitePage />} />
      <Route path="/partner/onboarding" element={<AcceptInvitePage />} />
      <Route path="/partner/verify" element={<AcceptInvitePage />} />
    </>
  );
}
