import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { KBCategory } from '../../types/knowledgeBase.types';
import { SearchFilterInput } from './SearchFilterInput';
import { CategoryAccordionList } from './CategoryAccordionList';

interface KnowledgeBaseSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: KBCategory[];
  openCategories: Record<string, boolean>;
  onToggleCategory: (categoryId: string) => void;
  selectedArticleId: string;
  onSelectArticle: (articleId: string) => void;
}

export const KnowledgeBaseSidebar: React.FC<KnowledgeBaseSidebarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  openCategories,
  onToggleCategory,
  selectedArticleId,
  onSelectArticle,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        bgcolor: isDark ? '#0d1510' : '#ffffff',
        p: 2.5,
        borderRadius: '18px',
        border: '1px solid',
        borderColor: isDark ? '#1e2a22' : '#e2e8f0',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: isDark ? '#94a3b8' : '#64748b',
          textTransform: 'uppercase',
          display: 'block',
          mb: 1.5,
          fontFamily: 'monospace',
        }}
      >
        {t('help.sidebar.navigation_topics', 'Navigation & Topics')}
      </Typography>

      <SearchFilterInput
        value={searchQuery}
        onChange={onSearchChange}
      />

      <CategoryAccordionList
        categories={categories}
        openCategories={openCategories}
        onToggleCategory={onToggleCategory}
        selectedArticleId={selectedArticleId}
        onSelectArticle={onSelectArticle}
      />
    </Box>
  );
};
