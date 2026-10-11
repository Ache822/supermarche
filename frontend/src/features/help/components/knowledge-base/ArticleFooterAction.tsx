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
        bgcolor: isDark ? '#140C07' : '#FFF4ED',
        border: '1px solid',
        borderColor: isDark ? '#3A2316' : '#FFE4D4',
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
            borderColor: isDark ? '#3A2316' : '#E2E8F0',
            bgcolor: isDark ? '#1F140C' : '#ffffff',
            color: isDark ? '#cbd5e1' : '#334155',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '10px',
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: isDark ? '#2D1A10' : '#f1f5f9',
              borderColor: '#FF6B00',
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
            bgcolor: '#FF6B00',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '10px',
            px: 2.5,
            py: 1,
            boxShadow: '0 4px 14px rgba(255, 107, 0, 0.4)',
            '&:hover': {
              bgcolor: '#E05D00',
            },
          }}
        >
          {t('help.footer.contact_support', 'Contact Support')}
        </Button>
      </Box>
    </Box>
  );
};
