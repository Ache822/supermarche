import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageToggle } from '../ui/LanguageToggle';
import { SupermarcheLogo } from '../ui/SupermarcheLogo';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Badge from '@mui/material/Badge';
import { useCart } from '../../context/CartContext';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface NavbarProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenBooking?: () => void;
}

export function Navbar({ mode, onToggleTheme, onOpenBooking: _onOpenBooking }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const isDark = mode === 'dark';
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: t('navbar.home'), path: '/', icon: <HomeIcon fontSize="small" /> },
    { label: 'Products', path: '/shop', icon: <ShoppingBagIcon fontSize="small" /> },
    { label: t('navbar.aboutUs'), path: '/about', icon: <InfoIcon fontSize="small" /> },
    { label: t('navbar.helpCenter'), path: '/help', icon: <HelpIcon fontSize="small" /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        transition:
          'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, padding 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        bgcolor: isDark
          ? isScrolled
            ? 'rgba(10, 18, 14, 0.92)'
            : 'rgba(10, 18, 14, 0.75)'
          : isScrolled
          ? 'rgba(255, 255, 255, 0.96)'
          : 'rgba(255, 255, 255, 0.90)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid',
        borderColor: isDark
          ? 'rgba(255, 107, 0, 0.3)'
          : 'rgba(226, 232, 240, 0.8)',
        boxShadow: isScrolled
          ? isDark
            ? '0 12px 36px rgba(0, 0, 0, 0.55)'
            : '0 6px 24px rgba(0, 0, 0, 0.08)'
          : '0 2px 12px rgba(0, 0, 0, 0.04)',
        py: isScrolled ? 1.25 : 1.75,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          {/* Logo Branding */}
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexShrink: 0 }}>
            <SupermarcheLogo showText={true} />
          </Box>

          {/* Desktop Navigation Links (Visible on md 900px+) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: { md: 0.5, lg: 1 } }}>
            {navItems.map((item) => {
              const active = isActive(item.path);

              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={
                    <Box
                      sx={{
                        color: active
                          ? isDark ? '#FF6B00' : '#B84A00'
                          : isDark ? '#FF6B00' : '#E05D00',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {item.icon}
                    </Box>
                  }
                  sx={{
                    color: active
                      ? isDark ? '#FF6B00' : '#B84A00'
                      : isDark ? '#FFF4ED' : '#662600',
                    fontWeight: active ? 700 : 600,
                    bgcolor: active
                      ? isDark ? 'rgba(255, 107, 0, 0.28)' : 'rgba(255, 107, 0, 0.16)'
                      : 'transparent',
                    border: '1px solid',
                    borderColor: active
                      ? isDark ? '#FF6B00' : '#FF6B00'
                      : 'transparent',
                    px: { md: 1.25, lg: 1.75 },
                    py: 0.8,
                    borderRadius: '10px',
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    fontSize: { md: 13, lg: 14 },
                    boxShadow: active
                      ? isDark ? '0 2px 10px rgba(255, 107, 0, 0.25)' : '0 2px 8px rgba(255, 107, 0, 0.15)'
                      : 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      color: isDark ? '#FFFFFF' : '#B84A00',
                      bgcolor: isDark ? 'rgba(255, 107, 0, 0.20)' : 'rgba(255, 107, 0, 0.10)',
                      borderColor: isDark ? '#FF6B00' : '#FF6B00',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Actions: Segmented Language Switch + Theme Toggle + Download App + Mobile Menu Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.5 }, flexShrink: 0 }}>
            {/* EN / FR Language Switch Toggle */}
            <Box sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              <LanguageToggle isDark={isDark} />
            </Box>

            <ThemeToggle mode={mode} onToggle={onToggleTheme} />

            {/* Cart Icon Button with Badge */}
            <IconButton
              onClick={() => setIsCartOpen(true)}
              aria-label="shopping cart"
              sx={{
                color: isDark ? '#FFF4ED' : '#FF6B00',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 107, 0, 0.4)' : 'rgba(255, 107, 0, 0.2)',
                borderRadius: '10px',
                p: 0.8,
                bgcolor: isDark ? 'rgba(255, 107, 0, 0.15)' : 'rgba(255, 107, 0, 0.08)',
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 0, 0.25)',
                  borderColor: '#FF6B00',
                },
              }}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartOutlinedIcon fontSize="small" sx={{ color: '#FF6B00' }} />
              </Badge>
            </IconButton>

            {/* Shop Store Button (Visible on desktop md 900px+) */}
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              startIcon={<ShoppingBagIcon />}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 13.5,
                px: 2,
                py: 0.8,
                borderRadius: '10px',
                whiteSpace: 'nowrap',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(255, 107, 0, 0.28)',
                '&:hover': {
                  bgcolor: '#E05D00',
                  boxShadow: '0 6px 18px rgba(255, 107, 0, 0.38)',
                },
              }}
            >
              Order Now
            </Button>

            {/* Mobile / Tablet Hamburger Toggle Button (Visible on < 900px) */}
            <IconButton
              onClick={handleDrawerToggle}
              aria-label="open drawer"
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: isDark ? '#FFF4ED' : '#662600',
                border: '1px solid',
                borderColor: isDark ? '#3A2316' : '#E2E8F0',
                borderRadius: '10px',
                p: 0.8,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>

      {/* Mobile / Tablet Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              width: { xs: '90vw', sm: 340 },
              maxWidth: 360,
              bgcolor: isDark ? '#140C07' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#662600',
              p: 2.5,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Drawer Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <SupermarcheLogo size={36} showText={true} />

            <IconButton onClick={handleDrawerToggle} sx={{ color: isDark ? '#FFF4ED' : '#662600' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Vertical Nav List */}
          <List sx={{ flex: 1, p: 0 }}>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: active
                        ? isDark
                          ? 'rgba(255, 107, 0, 0.15)'
                          : 'rgba(255, 107, 0, 0.12)'
                        : 'transparent',
                      color: active ? '#FF6B00' : 'inherit',
                      '&:hover': {
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: active ? '#FF6B00' : isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        minWidth: 36,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 14.5,
                            fontWeight: active ? 700 : 500,
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 2, borderColor: isDark ? '#3A2316' : '#E2E8F0' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography sx={{ fontSize: 13, color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
              {t('navbar.language', 'Language')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                bgcolor: isDark ? '#1F140C' : '#F1F5F9',
                p: 0.5,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: isDark ? '#3A2316' : '#E2E8F0',
              }}
            >
              <Box
                component="button"
                onClick={() => i18n.changeLanguage('en')}
                sx={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  px: 1.5,
                  py: 0.4,
                  borderRadius: '14px',
                  bgcolor: i18n.language === 'en' ? '#FF6B00' : 'transparent',
                  color: i18n.language === 'en' ? '#FFFFFF' : isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                }}
              >
                EN
              </Box>
              <Box
                component="button"
                onClick={() => i18n.changeLanguage('fr')}
                sx={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  px: 1.5,
                  py: 0.4,
                  borderRadius: '14px',
                  bgcolor: i18n.language === 'fr' ? '#FF6B00' : 'transparent',
                  color: i18n.language === 'fr' ? '#FFFFFF' : isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                }}
              >
                FR
              </Box>
            </Box>
          </Box>

          <Button
            component={Link}
            to="/shop"
            variant="contained"
            fullWidth
            size="large"
            onClick={() => setMobileOpen(false)}
            startIcon={<ShoppingBagIcon />}
            sx={{
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 15,
              py: 1.3,
              borderRadius: '10px',
              boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
              textTransform: 'none',
            }}
          >
            Order Now
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
