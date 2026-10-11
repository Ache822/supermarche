import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import { useTranslation } from 'react-i18next';

interface ArticleFooterActionProps {
  onOpenSupport?: () => void;
}

export const ArticleFooterAction: React.FC<ArticleFooterActionProps> = ({ onOpenSupport }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        mt: 4,
        pt: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        p: 2.5,
        borderRadius: '16px',
        bgcolor: isDark ? '#070b09' : '#f8fafc',
        border: '1px solid',
        borderColor: isDark ? '#1e2a22' : '#e2e8f0',
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: '15px', color: isDark ? '#f8fafc' : '#0f172a' }}>
          {t('help.footer.still_need_assistance', 'Still need assistance?')}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', mt: 0.5 }}>
          {t('help.footer.support_availability', "Our Kim's Store support team is ready 24/7 to help resolve your inquiry.")}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Button
          component="a"
          href="mailto:support@kimsstore.cm"
          variant="outlined"
          startIcon={<EmailIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderColor: isDark ? '#1e2a22' : '#cbd5e1',
            bgcolor: isDark ? '#0d1510' : '#ffffff',
            color: isDark ? '#cbd5e1' : '#334155',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '10px',
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: isDark ? '#1e2a22' : '#f1f5f9',
              borderColor: '#16a34a',
              color: isDark ? '#FFFFFF' : '#0f172a',
            },
          }}
        >
          {t('help.footer.email_support', 'Email Support')}
        </Button>

        <Button
          variant="contained"
          onClick={onOpenSupport}
          startIcon={<ChatIcon sx={{ fontSize: 18 }} />}
          sx={{
            bgcolor: '#16a34a',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '10px',
            px: 2.5,
            py: 1,
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
            '&:hover': {
              bgcolor: '#15803d',
            },
          }}
        >
          {t('help.footer.contact_support', 'Contact Support')}
        </Button>
      </Box>
    </Box>
  );
};
