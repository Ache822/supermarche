import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Grid } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CategoryIcon from '@mui/icons-material/Category';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useAppSelector } from '../../../store/hooks';
import adminService from '../../../services/adminService';
import api from '../../../api/client';
import type { ServiceItem } from '../../../types';

export function AdminOverviewStats() {
  const { t } = useTranslation();
  const { applications } = useAppSelector((state) => state.admin);
  const [servicesCount, setServicesCount] = useState<number>(0);
  const [activeChatsCount, setActiveChatsCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    api.services.getPaginatedServices(1, 100).then((res: unknown) => {
      if (!isMounted) return;
      const list = (Array.isArray(res) ? res : (res as { data?: ServiceItem[] })?.data || []) as ServiceItem[];
      setServicesCount(list.length);
    }).catch(() => {});

    adminService.getActiveChats().then((chats) => {
      if (!isMounted) return;
      setActiveChatsCount(chats.length);
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);

  const statCards = [
    {
      title: t('admin.proApplications', 'Pro Provider Applications'),
      value: `${applications.length} ${applications.length === 1 ? t('admin.applicationUnit', 'Application') : t('admin.applicationsUnit', 'Applications')}`,
      subtext: t('admin.vettingQueue', 'Vetting & Identity Check Queue'),
      icon: <AssignmentIndIcon sx={{ fontSize: 26, color: '#FF6B00' }} />,
      bgColor: 'rgba(255, 107, 0, 0.12)',
    },
    {
      title: t('admin.serviceCatalogItems', 'Service Catalog Items'),
      value: `${servicesCount} ${servicesCount === 1 ? t('admin.activeServiceUnit', 'Active Service') : t('admin.activeServicesUnit', 'Active Services')}`,
      subtext: t('admin.acrossCities', 'Across Douala, Yaoundé, Bamenda & Buea'),
      icon: <CategoryIcon sx={{ fontSize: 26, color: '#2563EB' }} />,
      bgColor: 'rgba(37, 99, 235, 0.12)',
    },
    {
      title: t('admin.supportDeskTickets', 'Support Desk Tickets'),
      value: `${activeChatsCount} ${activeChatsCount === 1 ? t('admin.liveChatActive', 'Live Chat Active') : t('admin.liveChatsActive', 'Live Chats Active')}`,
      subtext: t('admin.supportInquiriesSub', 'User & Provider Support Inquiries'),
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
