import { Route } from 'react-router-dom';
import { AdminProtectedRoute } from '../features/admin/components/AdminProtectedRoute';
import { AdminLayout } from '../features/admin/components/AdminLayout';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminProductsPage } from '../features/admin/pages/AdminProductsPage';
import { AdminOrdersPage } from '../features/admin/pages/AdminOrdersPage';

interface ProtectedRoutesProps {
  mode?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

/**
 * Protected Routes Component
 * Guarded by AdminProtectedRoute and wrapped in AdminLayout
 */
export function ProtectedRoutes({ mode = 'dark', onToggleTheme }: ProtectedRoutesProps = {}) {
  return (
    <Route element={<AdminProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage mode={mode} onToggleTheme={onToggleTheme} initialTab={0} />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage mode={mode} onToggleTheme={onToggleTheme} initialTab={0} />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/users" element={<AdminDashboardPage mode={mode} onToggleTheme={onToggleTheme} initialTab={1} />} />
        <Route path="/admin/content" element={<AdminDashboardPage mode={mode} onToggleTheme={onToggleTheme} initialTab={2} />} />
        <Route path="/admin/campaigns" element={<AdminDashboardPage mode={mode} onToggleTheme={onToggleTheme} initialTab={3} />} />
        <Route path="/admin/support" element={<AdminDashboardPage mode={mode} onToggleTheme={onToggleTheme} initialTab={5} />} />
        <Route path="/admin/testimonials" element={<AdminDashboardPage mode={mode} onToggleTheme={onToggleTheme} initialTab={6} />} />
      </Route>
    </Route>
  );
}
