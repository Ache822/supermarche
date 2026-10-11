import React from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface HtmlContentProps {
  content?: string | null;
  sx?: SxProps<Theme>;
  className?: string;
  variant?: 'body1' | 'body2' | 'caption';
  color?: string;
}

/**
 * HtmlContent Component
 * Safely renders HTML formatted strings (from Admin CMS or rich text inputs)
 * or falls back to regular text with line breaks preserved.
 */
export const HtmlContent: React.FC<HtmlContentProps> = ({
  content,
  sx,
  className,
  variant = 'body2',
  color = 'text.secondary',
}) => {
  if (!content) return null;

  const hasHtml = /<[a-z][\s\S]*>/i.test(content);

  if (hasHtml) {
    return (
      <Box
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
        sx={{
          color,
          fontSize: variant === 'body1' ? '1rem' : variant === 'caption' ? '0.75rem' : '0.875rem',
          lineHeight: 1.6,
          '& p': { m: 0, mb: 1, '&:last-child': { mb: 0 } },
          '& strong, & b': { fontWeight: 700, color: 'text.primary' },
          '& em, & i': { fontStyle: 'italic' },
          '& ul, & ol': { m: 0, pl: 2.5, mb: 1 },
          '& li': { mb: 0.5 },
          '& a': { color: '#FF6B00', textDecoration: 'underline', '&:hover': { color: '#E05D00' } },
          '& h3, & h4, & h5': { fontWeight: 700, mt: 1, mb: 0.5, color: 'text.primary' },
          ...sx,
        }}
      />
    );
  }

  return (
    <Typography
      variant={variant}
      className={className}
      sx={{
        color,
        whiteSpace: 'pre-line',
        ...sx,
      }}
    >
      {content}
    </Typography>
  );
};

export default HtmlContent;
