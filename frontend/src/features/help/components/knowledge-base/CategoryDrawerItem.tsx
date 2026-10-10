import React from 'react';
import { Box } from '@mui/material';
import type { KBCategory } from '../../types/knowledgeBase.types';
import { CategoryAccordionHeader } from './CategoryAccordionHeader';
import { ArticleSubList } from './ArticleSubList';

interface CategoryDrawerItemProps {
  category: KBCategory;
  isOpen: boolean;
  onToggleCategory: (categoryId: string) => void;
  selectedArticleId: string;
  onSelectArticle: (articleId: string) => void;
}

export const CategoryDrawerItem: React.FC<CategoryDrawerItemProps> = ({
  category,
  isOpen,
  onToggleCategory,
  selectedArticleId,
  onSelectArticle,
}) => {
  return (
    <Box sx={{ borderRadius: '12px', overflow: 'hidden', mb: 1.5 }}>
      <CategoryAccordionHeader
        category={category}
        isOpen={isOpen}
        onToggle={onToggleCategory}
      />
      {isOpen && (
        <ArticleSubList
          articles={category.articles}
          selectedArticleId={selectedArticleId}
          onSelectArticle={onSelectArticle}
        />
      )}
    </Box>
  );
};
