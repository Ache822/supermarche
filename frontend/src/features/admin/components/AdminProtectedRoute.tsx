import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';

interface AdminProtectedRouteProps {
  children?: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.admin);
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const isAuthorized = isAuthenticated || (!!storedToken && !!user);

  if (!isAuthorized) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default AdminProtectedRoute;
