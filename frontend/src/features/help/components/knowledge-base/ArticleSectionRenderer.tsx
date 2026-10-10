import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ArticleSection } from '../../types/knowledgeBase.types';
import { SectionBlock } from './SectionBlock';

interface ArticleSectionRendererProps {
  sections: ArticleSection[];
}

export const ArticleSectionRenderer: React.FC<ArticleSectionRendererProps> = ({ sections }) => {
  const { t } = useTranslation();

  if (!sections || sections.length === 0) {
    return (
      <Typography sx={{ py: 3, color: '#94a3b8', fontSize: 14, fontStyle: 'italic' }}>
        {t('help.article.no_sections', 'No additional section details available for this article.')}
      </Typography>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {sections.map((section, idx) => (
        <SectionBlock key={section.id || idx} section={section} index={idx} />
      ))}
    </Box>
  );
};
