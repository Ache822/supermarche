import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { KBArticle } from '../../types/knowledgeBase.types';
import { ArticleListItem } from './ArticleListItem';

interface ArticleSubListProps {
  articles: KBArticle[];
  selectedArticleId: string;
  onSelectArticle: (articleId: string) => void;
}

export const ArticleSubList: React.FC<ArticleSubListProps> = ({
  articles,
  selectedArticleId,
  onSelectArticle,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  if (!articles || articles.length === 0) {
    return (
      <Typography sx={{ px: 2, py: 1, fontSize: 12, color: isDark ? '#64748b' : '#94a3b8', fontStyle: 'italic' }}>
        {t('help.article.no_matching_articles', 'No articles match search query.')}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        mt: 1,
        ml: 2,
        pl: 1.5,
        borderLeft: '1px solid',
        borderColor: isDark ? '#1e2a22' : '#cbd5e1',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        pb: 1,
      }}
    >
      {articles.map((article) => (
        <ArticleListItem
          key={article.id}
          article={article}
          isSelected={selectedArticleId === article.id}
          onSelect={onSelectArticle}
        />
      ))}
    </Box>
  );
};
