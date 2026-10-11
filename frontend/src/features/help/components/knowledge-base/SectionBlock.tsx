import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import type { ArticleSection } from '../../types/knowledgeBase.types';

interface SectionBlockProps {
  section: ArticleSection;
  index: number;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({ section }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ mb: 3 }}>
      {/* SectionSubheading: H3 with orange accent dot */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#FF6B00',
            boxShadow: '0 0 8px rgba(255, 107, 0, 0.6)',
            flexShrink: 0,
          }}
        />
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: '17px',
            color: isDark ? '#f8fafc' : '#0f172a',
            letterSpacing: '-0.01em',
          }}
        >
          {section.subheading}
        </Typography>
      </Box>

      {/* SectionBody: Paragraph with border-left accent */}
      <Box
        sx={{
          ml: 0.5,
          pl: 2,
          borderLeft: '2px solid #FF6B00',
        }}
      >
        <Typography
          sx={{
            fontSize: '14.5px',
            color: isDark ? '#cbd5e1' : '#334155',
            lineHeight: 1.7,
          }}
        >
          {section.body}
        </Typography>
      </Box>
    </Box>
  );
};
