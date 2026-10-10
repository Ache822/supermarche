import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  isDark?: boolean;
}

export function LanguageToggle({ isDark = true }: LanguageToggleProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Box
      onClick={toggleLanguage}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        bgcolor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)',
        p: '3px',
        borderRadius: '20px',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 107, 0, 0.4)' : '#E2E8F0',
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 11,
        fontWeight: 700,
        userSelect: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#FF6B00',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.3,
          borderRadius: '14px',
          bgcolor: currentLang !== 'fr' ? '#FF6B00' : 'transparent',
          color: currentLang !== 'fr' ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1E293B',
          opacity: currentLang !== 'fr' ? 1 : isDark ? 0.9 : 0.7,
          transition: 'all 0.2s ease',
        }}
      >
        <Typography component="span" sx={{ fontSize: 12 }}>🇬🇧</Typography>
        <Typography component="span" sx={{ fontSize: 11, fontWeight: 700 }}>EN</Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.3,
          borderRadius: '14px',
          bgcolor: currentLang === 'fr' ? '#FF6B00' : 'transparent',
          color: currentLang === 'fr' ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1E293B',
          opacity: currentLang === 'fr' ? 1 : isDark ? 0.9 : 0.7,
          transition: 'all 0.2s ease',
        }}
      >
        <Typography component="span" sx={{ fontSize: 12 }}>🇫🇷</Typography>
        <Typography component="span" sx={{ fontSize: 11, fontWeight: 700 }}>FR</Typography>
      </Box>
    </Box>
  );
}
