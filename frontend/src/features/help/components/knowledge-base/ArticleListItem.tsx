import React from 'react';
import { Button, Box, Typography, useTheme } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedIcon from '@mui/icons-material/Verified';
import type { KBArticle } from '../../types/knowledgeBase.types';

interface ArticleListItemProps {
  article: KBArticle;
  isSelected: boolean;
  onSelect: (articleId: string) => void;
}

export const ArticleListItem: React.FC<ArticleListItemProps> = ({
  article,
  isSelected,
  onSelect,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Button
      fullWidth
      onClick={() => onSelect(article.id)}
      sx={{
        justifyContent: 'space-between',
        textAlign: 'left',
        py: 1.2,
        px: 1.5,
        borderRadius: '8px',
        textTransform: 'none',
        bgcolor: isSelected ? '#FF6B00 !important' : 'transparent',
        color: isSelected ? '#FFFFFF !important' : isDark ? '#cbd5e1' : '#334155',
        fontWeight: isSelected ? 700 : 500,
        boxShadow: isSelected ? '0 4px 12px rgba(255, 107, 0, 0.35)' : 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: isSelected ? '#FF6B00' : isDark ? 'rgba(255, 107, 0, 0.15)' : 'rgba(255, 107, 0, 0.08)',
          color: isSelected ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0f172a',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
        <DescriptionIcon
          sx={{
            fontSize: 18,
            color: isSelected ? '#FFFFFF' : isDark ? '#94a3b8' : '#64748b',
            flexShrink: 0,
          }}
        />
        <Typography
          noWrap
          sx={{
            fontSize: '13.5px',
            color: 'inherit',
            fontWeight: 'inherit',
          }}
        >
          {article.title}
        </Typography>
      </Box>

      {article.verified && (
        <VerifiedIcon
          sx={{
            fontSize: 16,
            color: isSelected ? '#FFFFFF' : '#FF6B00',
            flexShrink: 0,
            ml: 1,
          }}
        />
      )}
    </Button>
  );
};
