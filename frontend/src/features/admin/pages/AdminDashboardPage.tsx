import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedIcon from '@mui/icons-material/Verified';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import CampaignIcon from '@mui/icons-material/Campaign';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { AdminProductsPage } from './AdminProductsPage';
import { AdminOrdersPage } from './AdminOrdersPage';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { logoutAdmin, setActiveTab } from '../store/adminSlice';
import { AdminOverviewStats } from '../components/AdminOverviewStats';
import { VisitorAnalyticsOverview } from '../components/VisitorAnalyticsOverview';
import { SupportDeskPanel } from '../components/SupportDeskPanel';
import { UserPermissionPanel } from '../components/UserPermissionPanel';
import { ContentManagementPanel } from '../components/ContentManagementPanel';
import { MarketingCampaignsPanel } from '../components/MarketingCampaignsPanel';
import { TestimonialModerationPanel } from '../components/TestimonialModerationPanel';
import { SupermarcheLogo } from '../../../components/ui/SupermarcheLogo';
import { ThemeToggle } from '../../../components/ui/ThemeToggle';
import { LanguageToggle } from '../../../components/ui/LanguageToggle';
import { usePermission } from '../../../hooks/usePermission';
import { PermissionProtectedRoute } from '../components/PermissionProtectedRoute';
import { VerifiedBadge } from '../../../components/ui/VerifiedBadge';
import { BackendErrorModal, type BackendErrorDetails } from '../../../components/ui/BackendErrorModal';
import { subscribeBackendError } from '../../../api/client';

const SIDEBAR_WIDTH = 270;

export interface AdminDashboardPageProps {
  mode?: 'light' | 'dark';
  onToggleTheme?: () => void;
  initialTab?: number;
}

export function AdminDashboardPage({ mode = 'dark', onToggleTheme, initialTab }: AdminDashboardPageProps = {}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasPermission } = usePermission();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeBackendError, setActiveBackendError] = useState<BackendErrorDetails | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeBackendError((err) => {
      setActiveBackendError(err);
    });
    return unsubscribe;
  }, []);

  const menuItems = [
    { id: 0, path: '/admin/dashboard', label: t('admin.tabOverview'), icon: <DashboardIcon fontSize="small" />, permission: '' },
    { id: 7, path: '/admin/products', label: 'Store Products', icon: <Inventory2Icon fontSize="small" />, permission: '' },
    { id: 8, path: '/admin/orders', label: 'Customer Orders', icon: <LocalShippingIcon fontSize="small" />, permission: '' },
    { id: 1, path: '/admin/users', label: t('admin.tabUsers'), icon: <AdminPanelSettingsIcon fontSize="small" />, permission: 'users:manage' },
    { id: 2, path: '/admin/content', label: t('admin.tabContent'), icon: <CategoryIcon fontSize="small" />, permission: 'pages:edit' },
    { id: 3, path: '/admin/campaigns', label: t('admin.tabCampaigns'), icon: <CampaignIcon fontSize="small" />, permission: 'campaigns:manage' },
    { id: 5, path: '/admin/support', label: t('admin.tabSupport'), icon: <SupportAgentIcon fontSize="small" />, permission: 'support:chat' },
    { id: 6, path: '/admin/testimonials', label: t('admin.tabTestimonials'), icon: <RateReviewIcon fontSize="small" />, permission: 'pages:edit' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (initialTab !== undefined) {
      dispatch(setActiveTab(initialTab));
    }
  }, [initialTab, dispatch]);

  const { activeTab, user } = useAppSelector((state) => state.admin);

  // Dynamic PBAC Sidebar Filtering: Only show items user has permission to access
  const visibleMenuItems = menuItems.filter((item) => !item.permission || hasPermission(item.permission));
  const currentTab = activeTab;

  const handleSelectTab = (tabIndex: number, path?: string) => {
    dispatch(setActiveTab(tabIndex));
    setMobileOpen(false);
    if (path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#111B15' : '#FFFFFF'),
        borderRight: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
        p: { xs: 2, sm: 2.5 },
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
          width: '5px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.3)' : 'rgba(255, 107, 0, 0.4)'),
          borderRadius: '4px',
          '&:hover': {
            background: '#FF6B00',
          },
        },
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ mb: 2.5, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SupermarcheLogo size={36} showText={true} />
          <Chip
            icon={<VerifiedIcon sx={{ color: '#FF6B00 !important', fontSize: '13px !important' }} />}
            label={t('admin.operatorConsole', 'OPERATOR CONSOLE')}
            size="small"
            sx={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              fontWeight: 700,
              bgcolor: 'rgba(255, 107, 0, 0.15)',
              color: '#FF6B00',
              alignSelf: 'flex-start',
            }}
          />
        </Box>
        {onToggleTheme && (
          <ThemeToggle mode={mode} onToggle={onToggleTheme} />
        )}
      </Box>

      {/* Navigation List */}
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontFamily: 'IBM Plex Mono, monospace',
          mb: 1.5,
          px: 1,
          flexShrink: 0,
        }}
      >
        {t('admin.managementMenu', 'MANAGEMENT MENU')}
      </Typography>

      <List
        disablePadding
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.8,
          overflowY: 'auto',
          overflowX: 'hidden',
          pr: 0.5,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 107, 0, 0.25)', borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb:hover': { bgcolor: '#FF6B00' },
        }}
      >
        {visibleMenuItems.map((item) => {
          const isSelected = currentTab === item.id;
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleSelectTab(item.id, item.path)}
                sx={{
                  borderRadius: '12px',
                  py: 1.2,
                  px: 2,
                  bgcolor: isSelected ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                  color: isSelected ? '#FF6B00' : 'text.primary',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.12)' : 'rgba(255, 107, 0, 0.08)',
                    color: '#FF6B00',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isSelected ? '#FF6B00' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        fontWeight: isSelected ? 700 : 500,
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Sidebar Footer: User Card & Logout */}
      <Box sx={{ pt: 2, mt: 'auto', flexShrink: 0, borderTop: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: '14px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#F1F5F9'),
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PersonIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }}>
                {user?.name || t('admin.systemAdmin')}
              </Typography>
              <VerifiedBadge size={15} title="Verified Admin / System Operator" />
            </Box>
            <Typography noWrap sx={{ fontSize: 10.5, color: 'text.secondary', fontFamily: 'IBM Plex Mono, monospace' }}>
              {user?.email || 'admin@kimsstore.cm'}
            </Typography>
          </Box>
        </Paper>

        <Button
          fullWidth
          variant="outlined"
          color="error"
          size="small"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            py: 1,
            fontSize: 13,
          }}
        >
          {t('admin.logout')}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Desktop Fixed / Permanent Sidebar */}
      <Box
        component="aside"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          height: '100%',
          display: { xs: 'none', lg: 'block' },
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content Area Container (Independent Vertical Scroll) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Top Operational Header (Fixed / Sticky at Top) */}
        <Box
          component="header"
          sx={{
            flexShrink: 0,
            p: { xs: 2, sm: 3 },
            borderBottom: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#E2E8F0'),
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { lg: 'none' }, border: '1px solid', borderColor: 'divider', p: 1 }}
            >
              <MenuIcon />
            </IconButton>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                {menuItems.find((item) => item.id === Number(currentTab))?.label || menuItems[0]?.label}
              </Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                {t('admin.headerSub')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LanguageToggle isDark={mode === 'dark'} />
          </Box>
        </Box>

        {/* Scrollable Main Body (Independent Scroll Area) */}
        <Box
          component="main"
          id="admin-main-scroll-container"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'hidden',
            p: { xs: 2, md: 3 },
            minHeight: 0,
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#F8FAFC'),
            },
            '&::-webkit-scrollbar-thumb': {
              background: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.4)' : 'rgba(255, 107, 0, 0.6)'),
              borderRadius: '4px',
              '&:hover': {
                background: '#FF6B00',
              },
            },
          }}
        >
          <Box
            key={`panel-tab-${currentTab}`}
            className="bb-panel-enter"
            sx={{
              flex: 1,
              minHeight: 'min-content',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'visible',
              pb: 4,
            }}
          >
            {currentTab === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 2 }}>
                <AdminOverviewStats />
                <VisitorAnalyticsOverview />
              </Box>
            )}
            {currentTab === 1 && (
              <PermissionProtectedRoute requiredPermission="users:manage">
                <UserPermissionPanel />
              </PermissionProtectedRoute>
            )}
            {currentTab === 2 && (
              <PermissionProtectedRoute requiredPermission="pages:edit">
                <ContentManagementPanel />
              </PermissionProtectedRoute>
            )}
            {currentTab === 3 && (
              <PermissionProtectedRoute requiredPermission="campaigns:manage">
                <MarketingCampaignsPanel />
              </PermissionProtectedRoute>
            )}
            {currentTab === 5 && (
              <PermissionProtectedRoute requiredPermission="support:chat">
                <SupportDeskPanel />
              </PermissionProtectedRoute>
            )}
            {currentTab === 6 && (
              <PermissionProtectedRoute requiredPermission="pages:edit">
                <TestimonialModerationPanel />
              </PermissionProtectedRoute>
            )}
            {currentTab === 7 && <AdminProductsPage />}
            {currentTab === 8 && <AdminOrdersPage />}
          </Box>
        </Box>
      </Box>

      {/* Global Backend Error & Diagnostic Notification Modal */}
      <BackendErrorModal error={activeBackendError} onClose={() => setActiveBackendError(null)} />
    </Box>
  );
}

export default AdminDashboardPage;
