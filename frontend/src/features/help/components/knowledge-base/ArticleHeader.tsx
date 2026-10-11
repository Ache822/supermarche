import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useTranslation } from 'react-i18next';
import type { KBArticle } from '../../types/knowledgeBase.types';

interface ArticleHeaderProps {
  article: KBArticle;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  return (
    <Box sx={{ pb: 3, mb: 3, borderBottom: '1px solid', borderColor: isDark ? '#3A2316' : '#e2e8f0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
        <Chip
          label={article.categoryName.toUpperCase()}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '11px',
            bgcolor: 'rgba(255, 107, 0, 0.15)',
            color: '#FF6B00',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            borderRadius: '999px',
          }}
        />

        {article.verified && (
          <Chip
            icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#FF6B00 !important' }} />}
            label={t('help.article.verified_guide', 'Verified Guide')}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '11px',
              bgcolor: isDark ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255, 107, 0, 0.1)',
              color: '#FF6B00',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255, 107, 0, 0.4)' : 'rgba(255, 107, 0, 0.3)',
              borderRadius: '999px',
            }}
          />
        )}

        {article.views && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
            <VisibilityIcon sx={{ fontSize: 14, color: isDark ? '#64748b' : '#94a3b8' }} />
            <Typography sx={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>
              {t('help.article.views_count', '{{count}} views', { count: article.views })}
            </Typography>
          </Box>
        )}
      </Box>

      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 800,
          color: isDark ? '#f8fafc' : '#0f172a',
          fontSize: { xs: '1.5rem', md: '2rem' },
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          mb: 2,
        }}
      >
        {article.title}
      </Typography>

      {article.summary && (
        <Box
          sx={{
            p: 2.5,
            bgcolor: isDark ? '#140C07' : '#FFF4ED',
            border: '1px solid',
            borderColor: isDark ? '#3A2316' : '#FFE4D4',
            borderRadius: '12px',
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: '14.5px',
              color: isDark ? '#cbd5e1' : '#334155',
              lineHeight: 1.65,
            }}
          >
            {article.summary}
          </Typography>
        </Box>
      )}

      {article.helpfulCount !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThumbUpIcon sx={{ fontSize: 15, color: '#FF6B00' }} />
          <Typography sx={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>
            {t('help.article.helpful_count', '{{count}} people found this guide helpful', { count: article.helpfulCount })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
