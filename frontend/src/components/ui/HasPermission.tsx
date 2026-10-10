import React from 'react';
import { usePermission } from '../../hooks/usePermission';

interface HasPermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Frontend Permission Guard Component (`HasPermission`)
 * Conditionally renders UI components based on the logged-in user's PBAC permissions array.
 */
export const HasPermission: React.FC<HasPermissionProps> = ({ permission, children, fallback = null }) => {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default HasPermission;
