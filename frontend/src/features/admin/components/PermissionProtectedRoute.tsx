import { Outlet } from 'react-router-dom';
import { usePermission } from '../../../hooks/usePermission';
import { Box, Typography, Button, Paper } from '@mui/material';
import LockPatternIcon from '@mui/icons-material/Lock';

interface PermissionProtectedRouteProps {
  requiredPermission?: string;
  children?: React.ReactNode;
}

/**
 * Route & Feature Guard Component (`PermissionProtectedRoute`)
 * Protects routes and dashboard panels. If user lacks required PBAC permission,
 * renders an Unauthorized Access notice or redirects.
 */
export function PermissionProtectedRoute({ requiredPermission, children }: PermissionProtectedRouteProps) {
  const { hasPermission } = usePermission();

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '16px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F8FAFC'),
          border: '1px solid #E2E8F0',
          my: 4,
          mx: 'auto',
          maxWidth: 540,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'rgba(239, 68, 68, 0.15)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <LockPatternIcon fontSize="large" />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', mb: 1 }}>
          Access Denied
        </Typography>

        <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
          You do not have the required operational permission (<strong>{requiredPermission}</strong>) 
          assigned to your admin account to view or modify this feature.
        </Typography>

        <Button
          variant="contained"
          onClick={() => (window.location.href = '/admin')}
          sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' }, fontWeight: 700, textTransform: 'none' }}
        >
          Return to Admin Overview
        </Button>
      </Paper>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}

export default PermissionProtectedRoute;
