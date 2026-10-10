import { useAppSelector } from '../store/hooks';

/**
 * Granular Permission-Based Access Control (PBAC) Hook
 * Evaluates whether the currently logged-in admin user has permission to access a feature or route.
 */
export function usePermission() {
  const { user, isAuthenticated } = useAppSelector((state) => state.admin);
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const isAuthorizedAdmin = isAuthenticated || !!storedToken;

  const permissions: string[] = user?.permissions || [];

  /**
   * Check if user has explicit permission key or superadmin override
   */
  const hasPermission = (requiredPermission?: string): boolean => {
    if (!isAuthorizedAdmin) return false;
    if (!requiredPermission) return true;

    // SUPER_ADMIN Access Bypass (matching backend requirePermission guard)
    if (
      user?.access === 'SUPER_ADMIN' ||
      user?.role === 'SUPER_ADMIN' ||
      permissions.length === 0 || // Defaults to full access for super admin sessions when permissions array is omitted
      permissions.includes('ALL_OPERATIONS_ACCESS') ||
      permissions.includes('SUPER_ADMIN') ||
      permissions.includes('*') ||
      permissions.includes('all_access') ||
      user?.role === 'admin'
    ) {
      return true;
    }

    const normalizedReq = requiredPermission.toUpperCase();
    return permissions.some(
      (p) => p.toUpperCase() === normalizedReq || p.toLowerCase() === requiredPermission.toLowerCase()
    );
  };

  return {
    hasPermission,
    permissions,
    user,
    isAuthorizedAdmin,
  };
}

export default usePermission;
