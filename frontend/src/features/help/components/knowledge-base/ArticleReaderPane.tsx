import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, useTheme } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import type { KBArticle } from '../../types/knowledgeBase.types';
import { ArticleHeader } from './ArticleHeader';
import { ArticleSectionRenderer } from './ArticleSectionRenderer';
import { ArticleFooterAction } from './ArticleFooterAction';

interface ArticleReaderPaneProps {
  article: KBArticle | null;
  onOpenSupport?: () => void;
}

export const ArticleReaderPane: React.FC<ArticleReaderPaneProps> = ({
  article,
  onOpenSupport,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        bgcolor: isDark ? '#0d1510' : '#ffffff',
        p: { xs: 3, md: 4 },
        borderRadius: '18px',
        border: '1px solid',
        borderColor: isDark ? '#1e2a22' : '#e2e8f0',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
        minHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {article ? (
        <Box>
          <ArticleHeader article={article} />
          <ArticleSectionRenderer sections={article.content} />
          <ArticleFooterAction onOpenSupport={onOpenSupport} />
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 6,
            textAlign: 'center',
            my: 'auto',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              bgcolor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              color: '#16a34a',
              mb: 2,
            }}
          >
            <HelpIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', mb: 1 }}>
            {t('help.article.no_article_selected', 'No Article Selected')}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', maxWidth: 380, mb: 3 }}>
            {t('help.article.select_article_prompt', 'Please choose a category drawer from the sidebar and select an article to read its guide.')}
          </Typography>

          <Button
            component={RouterLink}
            to="/help"
            startIcon={<ArrowBackIcon />}
            variant="contained"
            sx={{
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              py: 1.2,
              fontSize: 14,
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#E05D00',
                boxShadow: '0 6px 18px rgba(255, 107, 0, 0.4)',
              },
            }}
          >
            {t('help.back_to_help_center', '← Return to Help Center Main')}
          </Button>
        </Box>
      )}
    </Box>
  );
};
