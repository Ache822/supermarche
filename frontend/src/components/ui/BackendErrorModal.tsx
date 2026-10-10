import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Paper, Chip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TerminalIcon from '@mui/icons-material/Terminal';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export interface BackendErrorDetails {
  id: string;
  statusCode?: number;
  endpoint?: string;
  message: string;
  rawDetails?: unknown;
  timestamp: string;
}

interface BackendErrorModalProps {
  error: BackendErrorDetails | null;
  onClose: () => void;
}

export const BackendErrorModal: React.FC<BackendErrorModalProps> = ({ error, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!error) return null;

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(error, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 99999,
        maxWidth: 520,
        width: 'calc(100% - 48px)',
        pointerEvents: 'auto',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          bgcolor: '#140B0D',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '16px',
          overflow: 'hidden',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(239, 68, 68, 0.15)',
        }}
      >
        {/* Top Summary Bar */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.5,
            bgcolor: 'rgba(127, 29, 29, 0.2)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
            <WarningAmberIcon sx={{ color: '#F87171', mt: 0.2, fontSize: 20, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#F87171',
                  }}
                >
                  Backend API Error
                </Typography>
                {error.statusCode !== undefined && (
                  <Chip
                    label={error.statusCode === 0 ? 'OFFLINE' : `HTTP ${error.statusCode}`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: 'IBM Plex Mono, monospace',
                      bgcolor: error.statusCode === 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: error.statusCode === 0 ? '#FCD34D' : '#FCA5A5',
                      border: error.statusCode === 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  />
                )}
              </Box>

              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#F3F4F6',
                  wordBreak: 'break-word',
                  lineHeight: 1.4,
                }}
              >
                {error.message || 'An unexpected backend error occurred.'}
              </Typography>

              {error.endpoint && (
                <Typography
                  sx={{
                    fontSize: 11,
                    fontFamily: 'IBM Plex Mono, monospace',
                    color: '#9CA3AF',
                    mt: 0.5,
                    wordBreak: 'break-all',
                  }}
                >
                  {error.endpoint}
                </Typography>
              )}
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: '#9CA3AF', '&:hover': { color: '#F3F4F6', bgcolor: 'rgba(255,255,255,0.06)' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Diagnostics Toggle Bar */}
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: '#0D0708',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(239, 68, 68, 0.1)',
          }}
        >
          <Button
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            startIcon={<TerminalIcon sx={{ fontSize: 14 }} />}
            endIcon={
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 14,
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease-in-out',
                }}
              />
            }
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: 'rgba(248, 113, 113, 0.9)',
              textTransform: 'none',
              p: 0,
              minWidth: 0,
              '&:hover': { color: '#FCA5A5', bgcolor: 'transparent' },
            }}
          >
            {isExpanded ? 'Hide Technical Diagnostics' : 'View Technical Diagnostics'}
          </Button>

          {isExpanded && (
            <Button
              size="small"
              onClick={handleCopy}
              startIcon={
                copied ? (
                  <CheckIcon sx={{ fontSize: 12, color: '#FF6B00' }} />
                ) : (
                  <ContentCopyIcon sx={{ fontSize: 12 }} />
                )
              }
              sx={{
                fontSize: 10,
                fontFamily: 'IBM Plex Mono, monospace',
                color: copied ? '#FF6B00' : '#9CA3AF',
                textTransform: 'none',
                p: 0,
                minWidth: 0,
                '&:hover': { color: '#FFFFFF', bgcolor: 'transparent' },
              }}
            >
              {copied ? 'Copied' : 'Copy JSON'}
            </Button>
          )}
        </Box>

        {/* Technical Diagnostics Payload View */}
        {isExpanded && (
          <Box
            sx={{
              p: 1.75,
              bgcolor: '#080405',
              maxHeight: 200,
              overflowY: 'auto',
              borderTop: '1px solid rgba(239, 68, 68, 0.1)',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              color: '#D1D5DB',
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-track': { bgcolor: '#080405', borderRadius: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#EF4444 !important', borderRadius: 4, border: 'none' },
              '&::-webkit-scrollbar-thumb:hover': { bgcolor: '#F87171 !important' },
              scrollbarColor: '#EF4444 #080405',
              scrollbarWidth: 'thin',
            }}
          >
            <Typography sx={{ fontSize: 10, color: '#6B7280', mb: 1, fontFamily: 'IBM Plex Mono, monospace' }}>
              Timestamp: {error.timestamp}
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 1.5,
                borderRadius: '8px',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#FCA5A5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                fontSize: 11,
                fontFamily: 'IBM Plex Mono, monospace',
              }}
            >
              {JSON.stringify(error.rawDetails || error, null, 2)}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
