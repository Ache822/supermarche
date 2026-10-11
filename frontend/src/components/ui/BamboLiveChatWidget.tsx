import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Fab,
  Paper,
  Tooltip,
} from '@mui/material';
import type { Theme } from '@mui/material';
import { BamboMascot } from '../../assets/BamboMascot';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import StarIcon from '@mui/icons-material/Star';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { socketClient } from '../../api/socketClient';
import type { ChatMessagePayload } from '../../api/socketClient';
import { VerifiedBadge } from './VerifiedBadge';

import api from '../../api/client';

interface Message {
  id: string;
  sender: 'supermarche' | 'user';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
    type?: string;
    url?: string;
  };
  action?: {
    label: string;
    actionType: 'open_booking' | 'open_tracking' | 'call_support';
    serviceId?: string;
  };
}

interface BamboLiveChatWidgetProps {
  onOpenBooking?: (serviceId?: string) => void;
  onOpenTracking?: () => void;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

let msgSequence = 0;
const generateMsgId = (prefix: string) => {
  msgSequence += 1;
  return `msg-${prefix}-${msgSequence}`;
};

export function BamboLiveChatWidget({
  onOpenBooking,
  onOpenTracking,
  isOpen: externalIsOpen,
  onToggleOpen,
}: BamboLiveChatWidgetProps) {
  const { t } = useTranslation();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ file: File; previewUrl?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const setIsOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isOpen) : val;
    setInternalIsOpen(nextVal);
    onToggleOpen?.(nextVal);
  };

  const quickTopics = [
    { id: 'apparel', key: 'chatWidget.topicApparel', serviceId: 'apparel', icon: <ShoppingBagIcon sx={{ fontSize: '15px !important', color: '#FF6B00 !important' }} /> },
    { id: 'footwear', key: 'chatWidget.topicFootwear', serviceId: 'footwear', icon: <ShoppingBagIcon sx={{ fontSize: '15px !important', color: '#FF6B00 !important' }} /> },
    { id: 'cosmetics', key: 'chatWidget.topicCosmetics', serviceId: 'cosmetics', icon: <StarIcon sx={{ fontSize: '15px !important', color: '#FF6B00 !important' }} /> },
    { id: 'tech', key: 'chatWidget.topicTech', serviceId: 'tech', icon: <SmartphoneIcon sx={{ fontSize: '15px !important', color: '#FF6B00 !important' }} /> },
    { id: 'produce', key: 'chatWidget.topicProduce', serviceId: 'produce', icon: <ShoppingBagIcon sx={{ fontSize: '15px !important', color: '#FF6B00 !important' }} /> },
    { id: 'track', key: 'chatWidget.topicTrack', actionType: 'open_tracking', icon: <ConfirmationNumberIcon sx={{ fontSize: '15px !important', color: '#FF6B00 !important' }} /> },
    { id: 'human_agent', key: 'chatWidget.topicHumanAgent', serviceId: 'human_agent', icon: <SupportAgentIcon sx={{ fontSize: '15px !important', color: '#FF6B00 !important' }} /> },
  ];

  const [sessionId] = useState(() => socketClient.getOrCreateSessionId());
  const [isAdminTyping, setIsAdminTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'supermarche',
      text: t('chatWidget.welcomeMsg'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatScrollBoxRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time socket events for two-way messaging with Admin Support Desk
  useEffect(() => {
    if (isOpen) {
      socketClient.joinChat({
        sessionId,
        customerName: `Customer (${sessionId.slice(-4)})`,
        city: 'Yaoundé (Bastos)',
        topic: 'Live Customer Inquiry',
        status: 'open',
      });
    }

    // Load history from Backend REST API per Integration Spec
    api.support
      .getMessages(sessionId)
      .then((res: unknown) => {
        const data = (Array.isArray(res) ? res : (res as { data?: Array<{ message_id?: string; body?: string; text?: string; sender?: string; sent_at?: string }> })?.data || []);
        if (data.length > 0) {
          const loadedMsgs: Message[] = data.map((m, idx) => ({
            id: m.message_id || `hist-${idx}`,
            sender: m.sender === 'CUSTOMER' ? 'user' : 'supermarche',
            text: m.body || m.text || '',
            timestamp: m.sent_at ? new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setMessages(loadedMsgs);
        }
      })
      .catch(() => {});

    const unsubscribeMessage = socketClient.on<ChatMessagePayload>('receive_message', (payload) => {
      if (payload.sessionId === sessionId && (payload.sender === 'admin' || payload.sender === 'supermarche')) {
        const msgId = payload.id || `msg-admin-${Date.now()}`;
        const msgText = payload.message || payload.text || payload.body || '';
        setMessages((prev) => {
          const isDuplicate = prev.some((m) => m.id === msgId);
          if (isDuplicate) return prev;

          const newMsg: Message = {
            id: msgId,
            sender: 'supermarche',
            text: msgText,
            timestamp: payload.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachment: payload.attachment,
          };
          return [...prev, newMsg];
        });
        setIsAdminTyping(false);
      }
    });

    const unsubscribeTyping = socketClient.on<{ sessionId: string; sender: string; isTyping: boolean }>(
      'typing_indicator',
      (payload) => {
        if (payload.sessionId === sessionId && payload.sender === 'admin') {
          setIsAdminTyping(payload.isTyping);
        }
      }
    );

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
    };
  }, [sessionId, isOpen]);

  const scrollToBottom = () => {
    if (chatScrollBoxRef.current) {
      chatScrollBoxRef.current.scrollTo({
        top: chatScrollBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isAdminTyping]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      setSelectedFile({
        file,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = (customText?: string, serviceId?: string) => {
    const textToSend = customText || input.trim();
    if (!textToSend && !selectedFile) return;

    let attachmentObj;
    if (selectedFile) {
      attachmentObj = {
        name: selectedFile.file.name,
        size: formatFileSize(selectedFile.file.size),
        type: selectedFile.file.type,
        url: selectedFile.previewUrl,
      };
    }

    const messageId = generateMsgId('user');
    const userMsg: Message = {
      id: messageId,
      sender: 'user',
      text: textToSend || (attachmentObj ? `Sent attachment: ${attachmentObj.name}` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachmentObj,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');

    // Emit message to Socket Event Hub for Admin Support Desk
    const payload: ChatMessagePayload = {
      id: messageId,
      sessionId,
      sender: 'customer',
      senderName: 'Customer',
      text: userMsg.text,
      message: userMsg.text,
      body: userMsg.text,
      timestamp: userMsg.timestamp,
      topic: serviceId || 'Live Customer Support',
      attachment: userMsg.attachment,
    };

    socketClient.sendMessage(payload);

    // Call Backend API Endpoint directly
    api.support.sendMessage(sessionId, payload).catch(() => {});

    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleActionClick = (action: Message['action']) => {
    if (!action) return;
    if (action.actionType === 'open_booking' && onOpenBooking) {
      onOpenBooking(action.serviceId);
    } else if (action.actionType === 'open_tracking' && onOpenTracking) {
      onOpenTracking();
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <Tooltip title={t('chatWidget.fabTooltip', "Chat with Kimzy Customer Service")} placement="left" arrow>
          <Fab
            onClick={() => setIsOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1400,
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              width: 60,
              height: 60,
              boxShadow: '0 8px 24px rgba(255, 107, 0, 0.45)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#E05D00',
                transform: 'scale(1.08)',
                boxShadow: '0 12px 28px rgba(255, 107, 0, 0.6)',
              },
            }}
          >
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChatIcon sx={{ fontSize: 28 }} />
              {/* Online Indicator Green Star */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: '#10B981',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StarIcon sx={{ fontSize: 8, color: '#FFFFFF' }} />
              </Box>
            </Box>
          </Fab>
        </Tooltip>
      )}

      {/* Pop-up Live Chat Panel */}
      {isOpen && (
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: { xs: 12, sm: 24 },
            right: { xs: 12, sm: 24 },
            width: { xs: 'calc(100vw - 24px)', sm: 380 },
            height: { xs: '80vh', sm: 540 },
            maxHeight: 600,
            zIndex: 1400,
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
            border: '2px solid',
            borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#C4E8C9'),
            boxShadow: (theme: Theme) =>
              theme.palette.mode === 'dark'
                ? '0 16px 40px rgba(0, 0, 0, 0.7)'
                : '0 16px 40px rgba(255, 107, 0, 0.25)',
            animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '@keyframes slideUp': {
              '0%': { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
              '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
            },
          }}
        >
          {/* Header Banner with Supermarche Bot Mascot */}
          <Box
            sx={{
              p: 2,
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '2px solid #FFFFFF',
                  bgcolor: '#1F140C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  flexShrink: 0,
                }}
              >
                <Box sx={{ pt: 0.75 }}>
                  <BamboMascot width={38} height={48} />
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 15, fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {t('chatWidget.headerTitle')} <VerifiedBadge size={16} title="Verified Support Operator" />
                </Typography>
                <Typography sx={{ fontSize: 11, opacity: 0.9, fontFamily: 'Inter, sans-serif' }}>
                  {t('chatWidget.headerSub')}
                </Typography>
              </Box>
            </Box>

            <Tooltip title={t('chatWidget.closeTooltip', 'Close Chat Window')} arrow>
              <IconButton onClick={() => setIsOpen(false)} sx={{ color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Quick Suggestion Chips Carousel */}
          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
              borderBottom: '1px solid',
              borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#FFF4ED'),
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#FF6B00', borderRadius: 2 },
            }}
          >
            {quickTopics.map((topic) => (
              <Chip
                key={topic.id}
                icon={topic.icon}
                label={t(topic.key)}
                size="small"
                onClick={() => handleSendMessage(t(topic.key), topic.serviceId)}
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                  color: '#FF6B00',
                  border: '1px solid rgba(255, 107, 0, 0.4)',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#FF6B00',
                    color: '#FFFFFF',
                  },
                }}
              />
            ))}
          </Box>

          {/* Messages Container */}
          <Box
            ref={chatScrollBoxRef}
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FAFAFA'),
            }}
          >
            {messages.map((msg) => {
              const isBambo = msg.sender === 'supermarche';
              return (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isBambo ? 'flex-start' : 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '85%',
                      p: 1.75,
                      borderRadius: isBambo ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                      bgcolor: isBambo
                        ? (theme: Theme) => (theme.palette.mode === 'dark' ? '#291A10' : '#FFF4ED')
                        : '#FF6B00',
                      color: isBambo ? 'text.primary' : '#FFFFFF',
                      border: isBambo ? '1px solid rgba(255, 107, 0, 0.25)' : 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    {msg.text && (
                      <Typography sx={{ fontSize: 13, lineHeight: 1.45, fontFamily: 'Inter, sans-serif' }}>
                        {msg.id === 'welcome-1'
                          ? t('chatWidget.welcomeMsg')
                          : msg.text
                              .replace(/Supermarche Bot|Kimzy Bot/gi, 'Kimzy')
                              .replace(/Supermarche/gi, "Kim's Store")}
                      </Typography>
                    )}

                    {/* Attachment Render */}
                    {msg.attachment && (
                      <Box sx={{ mt: msg.text ? 1 : 0 }}>
                        {msg.attachment.url ? (
                          <Box
                            component="img"
                            src={msg.attachment.url}
                            alt={msg.attachment.name}
                            sx={{
                              maxWidth: '100%',
                              maxHeight: 180,
                              borderRadius: '10px',
                              objectFit: 'cover',
                              display: 'block',
                              border: '1px solid rgba(255,255,255,0.3)',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              borderRadius: '8px',
                              bgcolor: isBambo ? 'rgba(255, 107, 0,0.15)' : 'rgba(255,255,255,0.2)',
                            }}
                          >
                            <InsertDriveFileIcon fontSize="small" />
                            <Box>
                              <Typography sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>
                                {msg.attachment.name}
                              </Typography>
                              <Typography sx={{ fontSize: 10, opacity: 0.8 }}>
                                {msg.attachment.size}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Interactive Action Button inside Supermarche Bot's Message */}
                    {msg.action && (
                      <Chip
                        label={msg.action.label}
                        onClick={() => handleActionClick(msg.action)}
                        size="small"
                        sx={{
                          mt: 1.25,
                          fontWeight: 700,
                          fontSize: 11,
                          fontFamily: 'Inter, sans-serif',
                          bgcolor: '#FF6B00',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#E05D00' },
                        }}
                      />
                    )}
                  </Box>

                  <Typography sx={{ fontSize: 10, color: 'text.disabled', mt: 0.5, px: 0.5, fontFamily: 'IBM Plex Mono, monospace' }}>
                    {msg.timestamp}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Hidden HTML File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          {/* Input Area */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              borderTop: '1px solid',
              borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#E2E8F0'),
            }}
          >
            {/* File Attachment Preview Bar */}
            {selectedFile && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  icon={<AttachFileIcon sx={{ fontSize: '14px !important', color: '#FFFFFF !important' }} />}
                  label={`${selectedFile.file.name} (${formatFileSize(selectedFile.file.size)})`}
                  onDelete={handleRemoveFile}
                  size="small"
                  sx={{
                    bgcolor: '#FF6B00',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: 11,
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255,255,255,0.8)',
                      '&:hover': { color: '#FFFFFF' },
                    },
                  }}
                />
              </Box>
            )}

            <TextField
              fullWidth
              size="small"
              placeholder={t('chatWidget.inputPlaceholder', "Type your message to Kimzy...")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              slotProps={{
                htmlInput: {
                  autoComplete: 'off',
                  autoCorrect: 'off',
                  autoCapitalize: 'off',
                  spellCheck: 'false',
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title={t('chatWidget.attachTooltip', 'Attach photo or document')} arrow>
                        <IconButton
                          onClick={() => fileInputRef.current?.click()}
                          size="small"
                          sx={{
                            color: selectedFile ? '#FF6B00' : 'text.secondary',
                            '&:hover': { color: '#FF6B00', bgcolor: 'rgba(255, 107, 0,0.1)' },
                          }}
                        >
                          <AttachFileIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleSendMessage()} sx={{ color: '#FF6B00', '&:hover': { bgcolor: 'rgba(255, 107, 0,0.1)' } }}>
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  fontSize: '0.8125rem !important',
                  fontWeight: '400 !important',
                  opacity: '0.7 !important',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFF4ED'),
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                  '& fieldset': {
                    borderColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#E2E8F0'),
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF6B00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF6B00',
                  },
                },
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
}
