import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShieldIcon from '@mui/icons-material/Shield';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LockIcon from '@mui/icons-material/Lock';
import FolderIcon from '@mui/icons-material/Folder';
import type { KBCategory } from '../../types/knowledgeBase.types';

interface CategoryAccordionHeaderProps {
  category: KBCategory;
  isOpen: boolean;
  onToggle: (categoryId: string) => void;
}

const renderCategoryIcon = (iconName?: string) => {
  const iconSx = { fontSize: 20, color: '#FF6B00' };
  switch (iconName) {
    case 'Assignment':
      return <AssignmentIcon sx={iconSx} />;
    case 'Shield':
      return <ShieldIcon sx={iconSx} />;
    case 'AccountBalanceWallet':
      return <AccountBalanceWalletIcon sx={iconSx} />;
    case 'Engineering':
      return <EngineeringIcon sx={iconSx} />;
    case 'Lock':
      return <LockIcon sx={iconSx} />;
    default:
      return <FolderIcon sx={iconSx} />;
  }
};

export const CategoryAccordionHeader: React.FC<CategoryAccordionHeaderProps> = ({
  category,
  isOpen,
  onToggle,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(category.id);
  };

  return (
    <Button
      fullWidth
      onClick={handleClick}
      sx={{
        justifyContent: 'space-between',
        textAlign: 'left',
        p: 1.5,
        borderRadius: '12px',
        bgcolor: isDark ? '#1F140C' : '#ffffff',
        border: '1px solid',
        borderColor: isDark ? '#3A2316' : '#e2e8f0',
        textTransform: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: isDark ? 'rgba(255, 107, 0, 0.15)' : 'rgba(255, 107, 0, 0.05)',
          borderColor: '#FF6B00',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: '8px',
            bgcolor: 'rgba(255, 107, 0, 0.1)',
            border: '1px solid rgba(255, 107, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {renderCategoryIcon(category.icon)}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            noWrap
            sx={{
              fontWeight: 700,
              fontSize: '14px',
              color: isDark ? '#f8fafc' : '#0f172a',
              lineHeight: 1.2,
            }}
          >
            {category.name}
          </Typography>
          {category.description && (
            <Typography
              noWrap
              sx={{
                fontSize: '12px',
                color: isDark ? '#94a3b8' : '#64748b',
                fontWeight: 400,
                mt: 0.25,
              }}
            >
              {category.description}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: 1 }}>
        <Typography
          component="span"
          sx={{
            fontSize: '11px',
            fontWeight: 700,
            px: 1,
            py: 0.25,
            borderRadius: '999px',
            bgcolor: isDark ? '#2D1A10' : '#FFF4ED',
            color: isDark ? '#FFA27B' : '#C74A00',
            border: '1px solid',
            borderColor: isDark ? '#3A2316' : '#FFE4D4',
          }}
        >
          {category.articles.length}
        </Typography>
        <ExpandMoreIcon
          sx={{
            fontSize: 20,
            color: isOpen ? '#FF6B00' : isDark ? '#94a3b8' : '#64748b',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </Box>
    </Button>
  );
};
