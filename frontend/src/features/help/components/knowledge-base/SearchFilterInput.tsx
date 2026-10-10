import React from 'react';
import { TextField, InputAdornment, IconButton, Box, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface SearchFilterInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchFilterInput: React.FC<SearchFilterInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  const defaultPlaceholder = t('help.sidebar.search_placeholder', 'Search articles or topics...');

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || defaultPlaceholder}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#16a34a', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onChange('')} sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: {
              bgcolor: isDark ? '#070b09' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#0f172a',
              borderRadius: '10px',
              fontSize: '14px',
              '& fieldset': { borderColor: isDark ? '#1e2a22' : '#cbd5e1' },
              '&:hover fieldset': { borderColor: '#16a34a' },
              '&.Mui-focused fieldset': { borderColor: '#16a34a' },
            },
          },
        }}
      />
    </Box>
  );
};
