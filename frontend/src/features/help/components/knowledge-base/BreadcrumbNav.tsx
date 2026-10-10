import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography, useTheme } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useTranslation } from 'react-i18next';

interface BreadcrumbNavProps {
  activeCategoryName?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ activeCategoryName }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        bgcolor: isDark ? '#0d1510' : '#ffffff',
        border: '1px solid',
        borderColor: isDark ? '#1e2a22' : '#e2e8f0',
        borderRadius: '12px',
        py: 1.5,
        px: 2.5,
        mb: 3,
        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <Breadcrumbs
        separator={<ChevronRightIcon sx={{ fontSize: 16, color: isDark ? '#64748b' : '#94a3b8' }} />}
        aria-label="breadcrumb"
      >
        <Link
          component={RouterLink}
          to="/help"
          underline="hover"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            fontSize: 14,
            fontWeight: 600,
            color: isDark ? '#cbd5e1' : '#475569',
            '&:hover': { color: '#16a34a' },
          }}
        >
          <MenuBookIcon sx={{ fontSize: 18, color: '#16a34a' }} />
          {t('help.breadcrumbs.help_center', 'Help Center')}
        </Link>

        <Link
          component={RouterLink}
          to="/help/articles"
          underline="hover"
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: isDark ? '#cbd5e1' : '#475569',
            '&:hover': { color: '#16a34a' },
          }}
        >
          {t('help.breadcrumbs.knowledge_base', 'Knowledge Base')}
        </Link>

        {activeCategoryName && (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: '#16a34a',
            }}
          >
            {activeCategoryName}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
};
