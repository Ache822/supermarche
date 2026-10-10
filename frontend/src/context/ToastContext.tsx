import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

import { ToastContext } from './ToastContextDef';
import type { ToastType, ToastItem, ConfirmOptions, ToastContextValue } from './ToastContextDef';
export type { ToastType, ToastItem, ConfirmOptions, ToastContextValue };

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmOptions | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmDialog(options);
  }, []);

  const handleConfirmAction = async () => {
    if (confirmDialog?.onConfirm) {
      await confirmDialog.onConfirm();
    }
    setConfirmDialog(null);
  };

  const value: ToastContextValue = {
    toast: addToast,
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
    warning: (msg: string) => addToast(msg, 'warning'),
    confirm,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Floating Toast Notification Container */}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          maxWidth: 380,
          width: 'calc(100vw - 40px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <Box
            key={t.id}
            sx={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              p: 2,
              borderRadius: '14px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(20, 12, 7, 0.95)'
                  : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid',
              borderColor: (theme) =>
                t.type === 'success'
                  ? 'rgba(255, 107, 0, 0.4)'
                  : t.type === 'error'
                  ? 'rgba(239, 68, 68, 0.4)'
                  : t.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.4)'
                  : theme.palette.mode === 'dark'
                  ? 'rgba(59, 130, 246, 0.4)'
                  : '#CBD5E1',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              animation: 'bb-hero-fade-up 0.25s ease-out both',
            }}
          >
            <Box sx={{ mt: 0.25, flexShrink: 0 }}>
              {t.type === 'success' && <CheckCircleIcon sx={{ color: '#FF6B00', fontSize: 20 }} />}
              {t.type === 'error' && <ErrorIcon sx={{ color: '#EF4444', fontSize: 20 }} />}
              {t.type === 'warning' && <WarningAmberIcon sx={{ color: '#F59E0B', fontSize: 20 }} />}
              {t.type === 'info' && <InfoIcon sx={{ color: '#3B82F6', fontSize: 20 }} />}
            </Box>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: 'text.primary',
                flex: 1,
                lineHeight: 1.5,
              }}
            >
              {t.message}
            </Typography>

            <IconButton
              size="small"
              onClick={() => removeToast(t.id)}
              sx={{ color: 'text.disabled', p: 0.25, '&:hover': { color: 'text.primary' } }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Dark Theme Custom Confirmation Dialog */}
      {confirmDialog && (
        <Dialog
          open={Boolean(confirmDialog)}
          onClose={() => setConfirmDialog(null)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: '16px',
                p: 1,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                border: '1px solid',
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                maxWidth: 420,
                width: '100%',
              },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', pb: 1 }}>
            {confirmDialog.title || 'Confirm Action'}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
              {confirmDialog.message}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setConfirmDialog(null)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '10px',
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#CBD5E1'),
                color: 'text.secondary',
              }}
            >
              {confirmDialog.cancelText || 'Cancel'}
            </Button>
            <Button
              variant="contained"
              color={confirmDialog.color || 'error'}
              onClick={handleConfirmAction}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '10px',
                px: 2.5,
              }}
            >
              {confirmDialog.confirmText || 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ToastContext.Provider>
  );
};
