import React from 'react';
import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { KBCategory } from '../../types/knowledgeBase.types';
import { CategoryDrawerItem } from './CategoryDrawerItem';

interface CategoryAccordionListProps {
  categories: KBCategory[];
  openCategories: Record<string, boolean>;
  onToggleCategory: (categoryId: string) => void;
  selectedArticleId: string;
  onSelectArticle: (articleId: string) => void;
}

export const CategoryAccordionList: React.FC<CategoryAccordionListProps> = ({
  categories,
  openCategories,
  onToggleCategory,
  selectedArticleId,
  onSelectArticle,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  if (!categories || categories.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderRadius: '12px',
          bgcolor: isDark ? '#1F140C' : '#ffffff',
          border: '1px solid',
          borderColor: isDark ? '#3A2316' : '#e2e8f0',
          color: isDark ? '#94a3b8' : '#64748b',
          fontSize: '14px',
        }}
      >
        {t('help.sidebar.no_categories_matching', 'No categories found matching filter.')}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {categories.map((category) => (
        <CategoryDrawerItem
          key={category.id}
          category={category}
          isOpen={Boolean(openCategories[category.id])}
          onToggleCategory={onToggleCategory}
          selectedArticleId={selectedArticleId}
          onSelectArticle={onSelectArticle}
        />
      ))}
    </Box>
  );
};
