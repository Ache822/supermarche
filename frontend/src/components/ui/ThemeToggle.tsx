import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface ThemeToggleProps {
  mode: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  const isDark = mode === 'dark';

  return (
    <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}>
      <IconButton
        onClick={onToggle}
        sx={{
          color: isDark ? '#FF6B00' : '#B84A00',
          bgcolor: isDark ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255, 107, 0, 0.10)',
          border: `1px solid ${isDark ? 'rgba(255, 107, 0, 0.4)' : '#E2E8F0'}`,
          borderRadius: '10px',
          padding: '8px',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255, 107, 0, 0.35)' : 'rgba(255, 107, 0, 0.18)',
            borderColor: '#FF6B00',
            transform: 'scale(1.05)',
          },
        }}
      >
        {isDark ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
