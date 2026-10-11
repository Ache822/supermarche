import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Grid } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import adminService from '../../../services/adminService';
import api from '../../../api/client';

export function AdminOverviewStats() {
  const { t } = useTranslation();
  const [productsCount, setProductsCount] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [activeChatsCount, setActiveChatsCount] = useState<number>(0);

  const loadData = () => {
    api.products.list().then((res: any) => {
      const list = res?.data || (Array.isArray(res) ? res : []);
      setProductsCount(list.length);
    }).catch(() => {});

    api.orders.getAdminList().then((res: any) => {
      const list = res?.data || (Array.isArray(res) ? res : []);
      setOrdersCount(list.length);
    }).catch(() => {});

    adminService.getActiveChats().then((chats) => {
      setActiveChatsCount(chats.length);
    }).catch(() => {});
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 20 seconds for real-time dashboard accuracy
    const timer = setInterval(loadData, 20000);
    return () => clearInterval(timer);
  }, []);

  const statCards = [
    {
      title: "Store Catalog Products",
      value: `${productsCount} ${productsCount === 1 ? 'Live Product' : 'Live Products'}`,
      subtext: 'Across 5 Departments • Kim\'s Store Catalog',
      icon: <Inventory2Icon sx={{ fontSize: 26, color: '#FF6B00' }} />,
      bgColor: 'rgba(255, 107, 0, 0.12)',
    },
    {
      title: "Customer Purchase Orders",
      value: `${ordersCount} ${ordersCount === 1 ? 'Order Placed' : 'Orders Placed'}`,
      subtext: 'Purchases, Shipping & Delivery Pipeline',
      icon: <LocalShippingIcon sx={{ fontSize: 26, color: '#2563EB' }} />,
      bgColor: 'rgba(37, 99, 235, 0.12)',
    },
    {
      title: t('admin.supportDeskTickets', 'Support Desk Tickets'),
      value: `${activeChatsCount} ${activeChatsCount === 1 ? 'Live Chat Active' : 'Live Chats Active'}`,
      subtext: 'Real-time Customer Care & Inquiries',
      icon: <SupportAgentIcon sx={{ fontSize: 26, color: '#D97706' }} />,
      bgColor: 'rgba(217, 119, 6, 0.12)',
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {statCards.map((card, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: '#FF6B00',
                boxShadow: '0 8px 24px rgba(255, 107, 0, 0.15)',
              },
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>
                {card.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontFamily: 'Space Grotesk, sans-serif',
                  color: 'text.primary',
                  lineHeight: 1.1,
                  mb: 0.5,
                }}
              >
                {card.value}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'IBM Plex Mono, monospace' }}>
                {card.subtext}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
