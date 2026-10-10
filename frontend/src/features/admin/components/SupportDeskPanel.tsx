import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Chip,
  TextField,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
  Button,
  Skeleton,
  Tooltip,
} from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import { api } from '../../../api/client';
import adminService from '../../../services/adminService';
import { socketClient } from '../../../api/socketClient';
import type { ChatMessagePayload, ChatSessionPayload } from '../../../api/socketClient';
import { HasPermission } from '../../../components/ui/HasPermission';
import { formatShortId } from '../../../utils/idHelper';
import { useToast } from '../../../context/useToast';

interface ChatAttachment {
  name: string;
  size: string;
  url?: string;
  type?: string;
}

interface MessageItem {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
  time: string;
  attachment?: ChatAttachment;
  quotedText?: string;
  status?: 'sending' | 'sent' | 'failed';
}

interface ChatSessionItem {
  id: string;
  customerName: string;
  city: string;
  topic: string;
  lastMsg: string;
  timestamp: string;
  unread: boolean;
  status: 'open' | 'closed';
  priority?: 'normal' | 'urgent' | 'escalated';
  assignedAgent?: string;
}

export function SupportDeskPanel() {
  const { t } = useTranslation();
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [activeChatId, setActiveChatId] = useState<string>(() => {
    try {
      const stored: Partial<ChatSessionPayload>[] = JSON.parse(localStorage.getItem('bb_chat_sessions_store') || '[]');
      if (stored.length > 0 && stored[0].sessionId) {
        return stored[0].sessionId;
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [replyInput, setReplyInput] = useState('');
  const [draftsBySession, setDraftsBySession] = useState<Record<string, string>>({});
  const [quotedAttachment, setQuotedAttachment] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [agentAttachment, setAgentAttachment] = useState<{ file: File; previewUrl: string } | null>(null);
  const [queueFilter, setQueueFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load Active Support Sessions
  const [activeChats, setActiveChats] = useState<ChatSessionItem[]>(() => {
    try {
      const stored: Partial<ChatSessionPayload>[] = JSON.parse(localStorage.getItem('bb_chat_sessions_store') || '[]');
      if (stored.length > 0) {
        const uniqueMap = new Map<string, Partial<ChatSessionPayload>>();
        stored.forEach((s) => {
          if (s.sessionId && !uniqueMap.has(s.sessionId)) {
            uniqueMap.set(s.sessionId, s);
          }
        });
        const uniqueList = Array.from(uniqueMap.values());
        return uniqueList.map((s) => ({
          id: s.sessionId || `sess_${Math.random()}`,
          customerName: s.customerName
            ? (s.customerName.includes('(')
                ? s.customerName.replace(/\(([^)]+)\)/, (_, idStr) => `(${formatShortId(idStr, 'TKT')})`)
                : s.customerName)
            : `Customer (${formatShortId(s.sessionId || '', 'TKT')})`,
          city: s.city || 'Yaoundé Hub',
          topic: s.topic || 'Live Customer Support',
          lastMsg: s.lastMsg || 'Chat session active',
          timestamp: s.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: s.unread ?? false,
          status: (() => {
            try {
              const closedList: string[] = JSON.parse(localStorage.getItem('bb_closed_sessions') || '[]');
              return closedList.includes(s.sessionId || '') ? 'closed' : 'open';
            } catch {
              return 'open';
            }
          })(),
          priority: 'normal',
        }));
      }
    } catch {
      // fallback
    }
    return [];
  });

  const openCount = useMemo(() => activeChats.filter((c) => c.status === 'open').length, [activeChats]);
  const closedCount = useMemo(() => activeChats.filter((c) => c.status === 'closed').length, [activeChats]);
  const allCount = activeChats.length;

  // Filtered & sorted chats list (unread & active sessions prioritized)
  const filteredChats = useMemo(() => {
    let list = activeChats;
    if (queueFilter === 'open') list = activeChats.filter((c) => c.status === 'open');
    if (queueFilter === 'closed') list = activeChats.filter((c) => c.status === 'closed');

    return [...list].sort((a, b) => {
      if (a.unread && !b.unread) return -1;
      if (!a.unread && b.unread) return 1;
      return 0;
    });
  }, [activeChats, queueFilter]);

  const rawCurrentChat = activeChats.find((c) => c.id === activeChatId) || activeChats[0];
  const currentChat: ChatSessionItem | null = rawCurrentChat
    ? {
        id: rawCurrentChat.id || '',
        customerName: rawCurrentChat.customerName || 'Customer',
        city: rawCurrentChat.city || 'Yaoundé Hub',
        topic: rawCurrentChat.topic || 'Live Customer Support',
        lastMsg: rawCurrentChat.lastMsg || 'Chat session active',
        timestamp: rawCurrentChat.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: Boolean(rawCurrentChat.unread),
        status: rawCurrentChat.status || 'open',
        priority: rawCurrentChat.priority || 'normal',
        assignedAgent: rawCurrentChat.assignedAgent,
      }
    : null;

  const [chatStore, setChatStore] = useState<Record<string, MessageItem[]>>(() => {
    const store: Record<string, MessageItem[]> = {};
    try {
      const storedSessions: Partial<ChatSessionPayload>[] = JSON.parse(localStorage.getItem('bb_chat_sessions_store') || '[]');
      storedSessions.forEach((s) => {
        if (!s.sessionId) return;
        const msgs: ChatMessagePayload[] = JSON.parse(localStorage.getItem(`bb_chat_msgs_${s.sessionId}`) || '[]');
        if (msgs.length > 0) {
          store[s.sessionId] = msgs.map((m) => ({
            id: m.id || `msg_${Math.random()}`,
            sender: (m.sender === 'admin' ? 'agent' : 'customer') as 'customer' | 'agent',
            text: m.message || m.text || m.body || '',
            time: m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachment: m.attachment,
            status: 'sent',
          }));
        }
      });
    } catch {
      // ignore
    }
    return store;
  });

  // Switch Active Session without Draft Loss
  const handleSelectChat = useCallback(
    (targetSessionId: string) => {
      if (targetSessionId === activeChatId) return;

      // Save draft text for previous session
      if (activeChatId) {
        setDraftsBySession((prev) => ({
          ...prev,
          [activeChatId]: replyInput,
        }));
      }

      setActiveChatId(targetSessionId);
      setQuotedAttachment(null);
      setAgentAttachment(null);

      // Restore draft for target session
      setReplyInput(draftsBySession[targetSessionId] || '');

      // Mark unread as false for target session
      setActiveChats((prev) =>
        prev.map((c) => (c.id === targetSessionId ? { ...c, unread: false } : c))
      );
    },
    [activeChatId, replyInput, draftsBySession]
  );

  const handleQuickReplyAttachment = (fileName: string) => {
    setQuotedAttachment(fileName);
    setReplyInput(`Re: [${fileName}] — `);
  };

  // Auto-scroll handler: Only scrolls if user is already near bottom or forced
  const scrollToBottom = useCallback((smooth = true, force = false) => {
    const container = chatScrollContainerRef.current;
    if (!container) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 160;
    if (force || isNearBottom) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
      }
    }
  }, []);

  // Sync Messages from Local Storage & REST API
  useEffect(() => {
    if (!activeChatId) return;

    const loadLocalMsgs = () => {
      try {
        const raw = localStorage.getItem(`bb_chat_msgs_${activeChatId}`);
        if (raw) {
          const parsed: ChatMessagePayload[] = JSON.parse(raw);
          if (parsed.length > 0) {
            const formatted: MessageItem[] = parsed.map((m) => ({
              id: m.id || `msg_${Math.random()}`,
              sender: (m.sender === 'admin' ? 'agent' : 'customer') as 'customer' | 'agent',
              text: m.message || m.text || m.body || '',
              time: m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              attachment: m.attachment,
              status: 'sent',
            }));
            setChatStore((prev) => {
              const current = prev[activeChatId] || [];
              const ids = new Set(current.map((m) => m.id));
              const missing = formatted.filter((m) => !ids.has(m.id));
              if (missing.length === 0) return prev;
              return {
                ...prev,
                [activeChatId]: [...current, ...missing],
              };
            });
          }
        }
      } catch {
        // ignore
      }
    };

    loadLocalMsgs();

    let isMounted = true;
    api.support
      .getMessages(activeChatId)
      .then((res: unknown) => {
        if (!isMounted) return;
        const data = (Array.isArray(res) ? res : (res as { data?: Array<{ message_id?: string; body?: string; text?: string; message?: string; sender?: string; sent_at?: string }> })?.data || []);
        if (data.length > 0) {
          const apiFormatted: MessageItem[] = data.map((m, idx) => ({
            id: m.message_id || `msg_api_${idx}_${m.sent_at || Date.now()}`,
            sender: (m.sender === 'ADMIN' ? 'agent' : 'customer') as 'customer' | 'agent',
            text: m.body || m.message || m.text || '',
            time: m.sent_at ? new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
          }));
          setChatStore((prev) => {
            const current = prev[activeChatId] || [];
            const ids = new Set(current.map((m) => m.id));
            const missing = apiFormatted.filter((m) => !ids.has(m.id));
            if (missing.length === 0) return prev;
            return {
              ...prev,
              [activeChatId]: [...missing, ...current],
            };
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [activeChatId]);

  // Fetch Live Backend Support Sessions on Mount
  useEffect(() => {
    let isMounted = true;

    adminService
      .getActiveChats()
      .then((res: unknown) => {
        if (!isMounted) return;
        const data = (Array.isArray(res) ? res : (res as { data?: Record<string, unknown>[] })?.data || []) as Record<string, unknown>[];
        if (data.length > 0) {
          const formatted: ChatSessionItem[] = data.map((item, idx) => ({
            id: String(item.sessionId || item.session_id || item.id || item._id || `sess_${idx}`),
            customerName: (() => {
              const rawName = String(item.customerName || item.customer_name || item.userName || item.user_name || item.customer || `Customer (${formatShortId(String(item.sessionId || item.session_id || item.id || item._id || ''), 'TKT')})`);
              return rawName.includes('(') ? rawName.replace(/\(([^)]+)\)/, (_, idStr) => `(${formatShortId(idStr, 'TKT')})`) : rawName;
            })(),
            city: String(item.city || item.location || 'Yaoundé Hub'),
            topic: String(item.topic || item.subject || item.category || 'Live Customer Support'),
            lastMsg: String(item.lastMsg || item.last_msg || item.lastMessage || item.last_message || item.message || 'Chat session active'),
            timestamp: item.timestamp
              ? String(item.timestamp)
              : item.createdAt
              ? new Date(String(item.createdAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: Boolean(item.unread),
            status: (() => {
              try {
                const closedList: string[] = JSON.parse(localStorage.getItem('bb_closed_sessions') || '[]');
                const sid = String(item.sessionId || item.session_id || item.id || item._id || `sess_${idx}`);
                return closedList.includes(sid) ? 'closed' : 'open';
              } catch {
                return 'open';
              }
            })(),
            priority: (item.priority as ChatSessionItem['priority']) || 'normal',
            assignedAgent: item.assignedAgent ? String(item.assignedAgent) : undefined,
          }));

          setActiveChats((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const newItems = formatted.filter((c) => !existingIds.has(c.id));
            return [...prev, ...newItems];
          });
          setActiveChatId((curr) => curr || (formatted[0]?.id ? formatted[0].id : ''));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoadingChats(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // WebSockets Real-time Customer Event Subscriptions
  useEffect(() => {
    const unsubscribeJoin = socketClient.on<Partial<ChatSessionPayload>>('join_chat', (session) => {
      const sId = session.sessionId;
      if (!sId) return;
      const cName = session.customerName || `Customer (${sId.slice(-4)})`;
      const cCity = session.city || 'Yaoundé Hub';
      const cTopic = session.topic || 'Live Support Request';

      setActiveChats((prev) => {
        const exists = prev.find((c) => c.id === sId);
        if (exists) return prev;
        return [
          {
            id: sId,
            customerName: cName,
            city: cCity,
            topic: cTopic,
            lastMsg: 'Chat room connected',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: true,
            status: 'open',
            priority: 'normal',
          },
          ...prev,
        ];
      });

      setActiveChatId((curr) => curr || sId);
    });

    const unsubscribeMsg = socketClient.on<ChatMessagePayload>('receive_message', (payload) => {
      if (!payload.sessionId || payload.sender === 'admin') return;

      const msgId = payload.id || `m_${Date.now()}_${Math.random()}`;
      const msgText = payload.message || payload.text || payload.body || '';
      if (!msgText && !payload.attachment) return;

      setChatStore((prev) => {
        const existingList = prev[payload.sessionId] || [];
        const isDuplicate = existingList.some((m) => m.id === msgId);
        if (isDuplicate) return prev;
        const newMsg: MessageItem = {
          id: msgId,
          sender: 'customer',
          text: msgText,
          time: payload.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachment: payload.attachment,
          status: 'sent',
        };
        return {
          ...prev,
          [payload.sessionId]: [...existingList, newMsg],
        };
      });

      const timeString = payload.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setActiveChats((prev) => {
        const idx = prev.findIndex((c) => c.id === payload.sessionId);
        if (idx === -1) {
          return [
            {
              id: payload.sessionId,
              customerName: payload.senderName || `Customer (${payload.sessionId.slice(-4)})`,
              city: 'Yaoundé (Bastos)',
              topic: payload.topic || 'Live Customer Support',
              lastMsg: msgText,
              timestamp: timeString,
              unread: payload.sessionId !== activeChatId,
              status: 'open',
              priority: 'normal',
            },
            ...prev,
          ];
        }

        const updated = [...prev];
        const [movedItem] = updated.splice(idx, 1);
        movedItem.lastMsg = msgText;
        movedItem.timestamp = timeString;
        movedItem.unread = payload.sessionId !== activeChatId;
        return [movedItem, ...updated];
      });

      // Scroll to bottom if current active chat receives message
      if (payload.sessionId === activeChatId) {
        setTimeout(() => scrollToBottom(true, false), 50);
      }
    });

    return () => {
      unsubscribeJoin();
      unsubscribeMsg();
    };
  }, [activeChatId, scrollToBottom]);

  const activeMessages = useMemo(() => chatStore[activeChatId] || [], [chatStore, activeChatId]);

  // Auto-scroll anchor effect on active message updates
  useEffect(() => {
    scrollToBottom(true, false);
  }, [activeMessages.length, activeChatId, scrollToBottom]);

  // Local Storage Persistence Hooks
  useEffect(() => {
    if (activeChats.length > 0) {
      try {
        localStorage.setItem('bb_chat_sessions_store', JSON.stringify(activeChats));
      } catch {
        // ignore
      }
    }
  }, [activeChats]);

  useEffect(() => {
    if (!activeChatId) return;
    const msgs = chatStore[activeChatId];
    if (msgs && msgs.length > 0) {
      try {
        const payloadFormatted: ChatMessagePayload[] = msgs.map((m) => ({
          id: m.id,
          sessionId: activeChatId,
          sender: m.sender === 'agent' ? 'admin' : 'customer',
          senderName: m.sender === 'agent' ? 'Supermarche Support Agent' : 'Customer',
          message: m.text,
          text: m.text,
          timestamp: m.time,
          attachment: m.attachment,
        }));
        localStorage.setItem(`bb_chat_msgs_${activeChatId}`, JSON.stringify(payloadFormatted));
      } catch {
        // ignore
      }
    }
  }, [chatStore, activeChatId]);

  const handleInputChange = (val: string) => {
    setReplyInput(val);
    if (activeChatId) {
      setDraftsBySession((prev) => ({
        ...prev,
        [activeChatId]: val,
      }));
      socketClient.sendTyping(activeChatId, 'admin', val.length > 0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith('image/');
      setAgentAttachment({
        file,
        previewUrl: isImg ? URL.createObjectURL(file) : '',
      });
    }
  };

  // Optimistic Send Reply Handler with Retry & Status Confirmation
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() && !agentAttachment) return;
    if (!activeChatId || currentChat?.status === 'closed' || isSubmitting) return;

    setIsSubmitting(true);
    const tempId = `m_opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const textContent = replyInput.trim() || 'Attached file for customer inspection.';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const optimisticMsg: MessageItem = {
      id: tempId,
      sender: 'agent',
      text: textContent,
      time: timeNow,
      quotedText: quotedAttachment ? `Replying to attachment: ${quotedAttachment}` : undefined,
      attachment: agentAttachment
        ? {
            name: agentAttachment.file.name,
            size: `${(agentAttachment.file.size / 1024).toFixed(0)} KB`,
            url: agentAttachment.previewUrl,
          }
        : undefined,
      status: 'sending',
    };

    // 1. Immediate Optimistic UI Append
    setChatStore((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), optimisticMsg],
    }));

    setActiveChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, lastMsg: `You: ${textContent}`, timestamp: timeNow, unread: false }
          : c
      )
    );

    // 2. Clear input & saved draft immediately
    setReplyInput('');
    setQuotedAttachment(null);
    setAgentAttachment(null);
    setDraftsBySession((prev) => ({ ...prev, [activeChatId]: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Scroll to bottom immediately on send
    setTimeout(() => scrollToBottom(true, true), 30);

    // 3. Asynchronous Dispatch to WebSocket & REST API
    try {
      const payload: ChatMessagePayload = {
        id: tempId,
        sessionId: activeChatId,
        sender: 'admin',
        senderName: 'Supermarche Support Agent',
        text: optimisticMsg.text,
        message: optimisticMsg.text,
        timestamp: optimisticMsg.time,
        attachment: optimisticMsg.attachment,
      };

      socketClient.sendMessage(payload);
      socketClient.sendTyping(activeChatId, 'admin', false);

      // Async REST API confirmation (non-blocking fallback)
      api.support.sendMessage(activeChatId, payload).catch(() => {});

      // Confirm Optimistic Status to 'sent'
      setChatStore((prev) => {
        const msgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: msgs.map((m) => (m.id === tempId ? { ...m, status: 'sent' } : m)),
        };
      });
    } catch {
      // Mark as failed if dispatch crashed
      setChatStore((prev) => {
        const msgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: msgs.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m)),
        };
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry Failed Message Dispatch
  const handleRetryMessage = (failedMsg: MessageItem) => {
    if (!activeChatId) return;

    // Update status back to 'sending'
    setChatStore((prev) => {
      const msgs = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: msgs.map((m) => (m.id === failedMsg.id ? { ...m, status: 'sending' } : m)),
      };
    });

    const payload: ChatMessagePayload = {
      id: failedMsg.id,
      sessionId: activeChatId,
      sender: 'admin',
      senderName: 'Supermarche Support Agent',
      text: failedMsg.text,
      message: failedMsg.text,
      timestamp: failedMsg.time,
      attachment: failedMsg.attachment,
    };

    socketClient.sendMessage(payload);

    setTimeout(() => {
      setChatStore((prev) => {
        const msgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: msgs.map((m) => (m.id === failedMsg.id ? { ...m, status: 'sent' } : m)),
        };
      });
    }, 400);
  };



  const toast = useToast();

  // Close / Resolve Session Mutation — Completely deletes chat session
  const handleCloseChat = async (sessionId: string) => {
    setActiveChats((prev) => {
      const updated = prev.filter((c) => c.id !== sessionId);
      if (activeChatId === sessionId) {
        setActiveChatId(updated[0]?.id || '');
      }
      return updated;
    });

    setChatStore((prev) => {
      const next = { ...prev };
      delete next[sessionId];
      return next;
    });

    try {
      const closedList: string[] = JSON.parse(localStorage.getItem('bb_closed_sessions') || '[]');
      const updatedClosed = closedList.filter((id) => id !== sessionId);
      localStorage.setItem('bb_closed_sessions', JSON.stringify(updatedClosed));

      const storedSessions: Record<string, unknown>[] = JSON.parse(localStorage.getItem('bb_chat_sessions_store') || '[]');
      const updatedSessions = storedSessions.filter((s) => s.sessionId !== sessionId && s.id !== sessionId);
      localStorage.setItem('bb_chat_sessions_store', JSON.stringify(updatedSessions));

      localStorage.removeItem(`bb_chat_msgs_${sessionId}`);
    } catch (e) {
      console.warn('LocalStorage session store remove error:', e);
    }

    try {
      await api.support.deleteSession(sessionId);
    } catch (error) {
      console.warn('Backend delete session API error:', error);
    }

    toast.success('Support desk session closed and deleted.');
  };

  // Reopen Session Mutation
  const handleReopenChat = (sessionId: string) => {
    setActiveChats((prev) =>
      prev.map((c) => (c.id === sessionId ? { ...c, status: 'open' } : c))
    );

    try {
      const closedList: string[] = JSON.parse(localStorage.getItem('bb_closed_sessions') || '[]');
      const updated = closedList.filter((id) => id !== sessionId);
      localStorage.setItem('bb_closed_sessions', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage session store remove fallback:', e);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', flex: 1, minHeight: 0, width: '100%', overflow: 'hidden' }}>
      {/* Header Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          flexShrink: 0,
          borderRadius: '16px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'rgba(255, 107, 0, 0.12)',
              color: '#FF6B00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SupportAgentIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('admin.supportDeskTitle', 'Customer Live Support Console & Attachment Hub')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }}>
              {t('admin.supportDeskSub', 'Real-time human support takeover, photo verification & attachment thread replies')}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Grid: Left Conversation Queue & Right Active Chat Stream */}
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0, height: '100%' }}>
        {/* Left Column: Conversation Queue */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexShrink: 0 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace' }}>
              {t('admin.conversationQueueHeader', 'CONVERSATION QUEUE:')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Chip
                label={t('admin.filterAll', 'All ({{count}})', { count: allCount })}
                size="small"
                variant={queueFilter === 'all' ? 'filled' : 'outlined'}
                color={queueFilter === 'all' ? 'success' : 'default'}
                onClick={() => setQueueFilter('all')}
                sx={{ fontSize: 10, fontWeight: 700, height: 22, cursor: 'pointer' }}
              />
              <Chip
                label={t('admin.filterOpen', 'Open ({{count}})', { count: openCount })}
                size="small"
                variant={queueFilter === 'open' ? 'filled' : 'outlined'}
                color={queueFilter === 'open' ? 'success' : 'default'}
                onClick={() => setQueueFilter('open')}
                sx={{ fontSize: 10, fontWeight: 700, height: 22, cursor: 'pointer' }}
              />
              <Chip
                label={t('admin.filterClosed', 'Closed ({{count}})', { count: closedCount })}
                size="small"
                variant={queueFilter === 'closed' ? 'filled' : 'outlined'}
                color={queueFilter === 'closed' ? 'default' : 'default'}
                onClick={() => setQueueFilter('closed')}
                sx={{ fontSize: 10, fontWeight: 700, height: 22, cursor: 'pointer' }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 107, 0,0.3)', borderRadius: '4px' },
            }}
          >
            {isLoadingChats ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton
                  key={`skel_${idx}`}
                  variant="rectangular"
                  height={80}
                  sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.04)' }}
                />
              ))
            ) : filteredChats.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: '12px',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFF4ED'),
                  border: '1px dashed',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                }}
              >
                <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 600 }}>
                  {t('admin.noActiveConversations', 'No active support conversations')}
                </Typography>
              </Paper>
            ) : (
              filteredChats.map((chat) => (
                <Box
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    bgcolor: (theme) =>
                      chat.id === activeChatId
                        ? theme.palette.mode === 'dark'
                          ? 'rgba(255, 107, 0,0.18)'
                          : '#FFF4ED'
                        : theme.palette.mode === 'dark'
                        ? '#140C07'
                        : '#FFF4ED',
                    border: '1px solid',
                    borderColor: chat.id === activeChatId ? '#FF6B00' : (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                    position: 'relative',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0, mr: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 13 }} noWrap>
                        {chat.customerName.startsWith('Customer')
                          ? chat.customerName.replace('Customer', t('admin.customerLabel', 'Customer'))
                          : chat.customerName}
                      </Typography>
                      <Chip
                        label={chat.status === 'open' ? t('admin.statusOpen', 'OPEN') : t('admin.statusClosed', 'CLOSED')}
                        size="small"
                        color={chat.status === 'open' ? 'success' : 'default'}
                        sx={{ fontSize: 9, fontWeight: 700, height: 18 }}
                      />
                      {chat.priority && chat.priority !== 'normal' && (
                        <Chip
                          label={chat.priority.toUpperCase()}
                          size="small"
                          color={chat.priority === 'escalated' ? 'error' : 'warning'}
                          sx={{ fontSize: 8, fontWeight: 800, height: 16 }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                      {chat.unread && chat.id !== activeChatId && (
                        <Chip
                          label={t('admin.badgeNew', 'NEW')}
                          size="small"
                          sx={{
                            bgcolor: '#FF6B00',
                            color: '#FFF',
                            fontSize: 9,
                            fontWeight: 800,
                            height: 18,
                            boxShadow: '0 0 8px rgba(255, 107, 0,0.5)',
                          }}
                        />
                      )}
                      <Typography sx={{ fontSize: 10, color: 'text.disabled', fontFamily: 'IBM Plex Mono, monospace' }}>
                        {chat.timestamp}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: 11, color: '#FF6B00', fontWeight: 600, mb: 0.5 }}>
                    {chat.topic === 'Live Customer Inquiry'
                      ? t('admin.topicLiveCustomerInquiry', 'Live Customer Inquiry')
                      : chat.topic === 'Live Support Request'
                      ? t('admin.topicLiveSupportRequest', 'Live Support Request')
                      : chat.topic === 'Live Customer Support'
                      ? t('admin.topicLiveCustomerSupport', 'Live Customer Support')
                      : chat.topic}
                  </Typography>

                  <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {chat.lastMsg === 'Chat room connected'
                      ? t('admin.lastMsgConnected', 'Chat room connected')
                      : chat.lastMsg === 'Chat session active'
                      ? t('admin.lastMsgActive', 'Chat session active')
                      : chat.lastMsg}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Grid>

        {/* Right Column: Interactive Chat Thread & Reply Console */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ height: '100%', minHeight: 0 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: '14px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFF4ED'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Active Chat Bar */}
            {currentChat ? (
              <Box
                sx={{
                  pb: 1.5,
                  flexShrink: 0,
                  borderBottom: '1px solid',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{currentChat.customerName}</Typography>
                    {currentChat.assignedAgent && (
                      <Chip
                        icon={<PersonAddIcon sx={{ fontSize: '11px !important' }} />}
                        label={currentChat.assignedAgent}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontSize: 9, fontWeight: 700, height: 18 }}
                      />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                    {currentChat.city} • {currentChat.topic}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    label={currentChat.status === 'open' ? t('admin.openChatBadge', 'Active Chat') : t('admin.chatClosedBadge', 'Closed Session')}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: 11,
                      bgcolor: currentChat.status === 'open' ? 'rgba(255, 107, 0, 0.18)' : 'rgba(148, 163, 184, 0.18)',
                      color: currentChat.status === 'open' ? '#FF6B00' : '#94A3B8',
                      border: '1px solid',
                      borderColor: currentChat.status === 'open' ? 'rgba(255, 107, 0, 0.35)' : 'rgba(148, 163, 184, 0.35)',
                      px: 0.5,
                    }}
                  />

                  <HasPermission permission="SUPPORT_DESK">
                    {currentChat.status === 'open' ? (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                        onClick={() => handleCloseChat(currentChat.id)}
                        sx={{
                          fontWeight: 700,
                          fontSize: 12,
                          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.12)' : '#FFF4ED'),
                          color: (theme) => (theme.palette.mode === 'dark' ? '#FF6B00' : '#B84A00'),
                          border: '1px solid',
                          borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.3)' : '#CBD5E1'),
                          borderRadius: '8px',
                          px: 2,
                          py: 0.5,
                          textTransform: 'none',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.24)' : '#DCFCE7'),
                            borderColor: '#FF6B00',
                            color: '#FF6B00',
                          },
                        }}
                      >
                        {t('admin.closeBtn', 'Close Chat')}
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<LockOpenIcon sx={{ fontSize: 14 }} />}
                        onClick={() => handleReopenChat(currentChat.id)}
                        sx={{
                          fontWeight: 700,
                          fontSize: 12,
                          bgcolor: '#FF6B00',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          px: 2,
                          py: 0.5,
                          textTransform: 'none',
                          boxShadow: '0 2px 8px rgba(255, 107, 0, 0.3)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#E05D00',
                          },
                        }}
                      >
                        {t('admin.reopenBtn', 'Reopen Chat Session')}
                      </Button>
                    )}
                  </HasPermission>
                </Box>
              </Box>
            ) : (
              <Box sx={{ pb: 1.5, flexShrink: 0, borderBottom: '1px solid #3A2316' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{t('admin.selectConversationText', 'Select a Conversation')}</Typography>
              </Box>
            )}

            {/* Chronological Message Stream */}
            <Box
              ref={chatScrollContainerRef}
              sx={{
                flex: 1,
                minHeight: 0,
                py: 1.5,
                px: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              {activeMessages.length === 0 ? (
                <Box sx={{ my: 'auto', textAlign: 'center', py: 4 }}>
                  <SupportAgentIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 600 }}>
                    {t('admin.noMessagesText', 'No messages in this chat thread yet.')}
                  </Typography>
                </Box>
              ) : (
                activeMessages.map((msg, idx) => (
                  <Box
                    key={msg.id || `msg_${idx}`}
                    sx={{
                      alignSelf: msg.sender === 'agent' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}
                  >
                    {/* Quoted Header */}
                    {msg.quotedText && (
                      <Box
                        sx={{
                          p: 1,
                          mb: 0.5,
                          borderRadius: '6px',
                          bgcolor: 'rgba(0,0,0,0.2)',
                          borderLeft: '3px solid #FF6B00',
                          fontSize: 11,
                          color: 'text.secondary',
                        }}
                      >
                        {msg.quotedText}
                      </Box>
                    )}

                    {/* Message Card Bubble */}
                    <Box
                      sx={{
                        p: 1.75,
                        borderRadius:
                          msg.sender === 'agent'
                            ? '14px 14px 2px 14px'
                            : '14px 14px 14px 2px',
                        bgcolor:
                          msg.sender === 'agent'
                            ? '#FF6B00'
                            : (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                        color: msg.sender === 'agent' ? '#FFFFFF' : 'text.primary',
                        border: msg.sender === 'agent' ? 'none' : '1px solid',
                        borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Typography sx={{ fontSize: 13, lineHeight: 1.5, whitespace: 'pre-wrap' }}>
                        {msg.text}
                      </Typography>

                      {/* Render File / Image Attachment */}
                      {msg.attachment && (
                        <Box
                          sx={{
                            mt: 1.5,
                            p: 1.25,
                            borderRadius: '8px',
                            bgcolor: msg.sender === 'agent' ? 'rgba(0,0,0,0.15)' : 'rgba(255, 107, 0,0.1)',
                            border: '1px solid',
                            borderColor: msg.sender === 'agent' ? 'rgba(255,255,255,0.2)' : '#FF6B00',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {msg.attachment.url ? (
                              <Box
                                component="img"
                                src={msg.attachment.url}
                                alt={msg.attachment.name}
                                onClick={() => setPreviewImageUrl(msg.attachment?.url || null)}
                                sx={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: '6px',
                                  objectFit: 'cover',
                                  cursor: 'pointer',
                                  border: '1px solid rgba(255,255,255,0.3)',
                                }}
                              />
                            ) : (
                              <AttachFileIcon sx={{ fontSize: 20 }} />
                            )}
                            <Box>
                              <Typography sx={{ fontSize: 12, fontWeight: 700 }} noWrap>
                                {msg.attachment.name}
                              </Typography>
                              <Typography sx={{ fontSize: 10, opacity: 0.8 }}>
                                {msg.attachment.size}
                              </Typography>
                            </Box>
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => handleQuickReplyAttachment(msg.attachment!.name)}
                            sx={{ color: msg.sender === 'agent' ? '#FFF' : '#FF6B00' }}
                          >
                            <Tooltip title="Quote in reply">
                              <AttachFileIcon fontSize="small" />
                            </Tooltip>
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    {/* Sender Label, Time & Status Confirmation Indicator */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: msg.sender === 'agent' ? 'flex-end' : 'flex-start',
                        gap: 0.75,
                        mt: 0.5,
                        px: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: 10, color: 'text.disabled', fontFamily: 'IBM Plex Mono, monospace' }}>
                        {msg.sender === 'agent' ? t('admin.operatorLabel', 'Operator') : currentChat?.customerName || t('admin.customerLabel', 'Customer')} • {msg.time}
                      </Typography>

                      {/* Status Indicator for Agent Messages */}
                      {msg.sender === 'agent' && (
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          {msg.status === 'sending' ? (
                            <AccessTimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                          ) : msg.status === 'failed' ? (
                            <Tooltip title="Failed to send. Click to retry.">
                              <IconButton size="small" onClick={() => handleRetryMessage(msg)} sx={{ p: 0 }}>
                                <ErrorIcon sx={{ fontSize: 13, color: 'error.main' }} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <DoneAllIcon sx={{ fontSize: 13, color: '#FF6B00' }} />
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Quoted Attachment Preview Banner */}
            {quotedAttachment && (
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  flexShrink: 0,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                  borderLeft: '4px solid #FF6B00',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography sx={{ fontSize: 12, color: '#FF6B00', fontWeight: 600 }}>
                  Replying to attachment: {quotedAttachment}
                </Typography>
                <IconButton size="small" onClick={() => setQuotedAttachment(null)}>
                  <CloseIcon fontSize="small" sx={{ color: '#FF6B00' }} />
                </IconButton>
              </Box>
            )}

            {/* Pre-send Agent Attachment Bar */}
            {agentAttachment && (
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  flexShrink: 0,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                  border: '1px solid #FF6B00',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography sx={{ fontSize: 12, color: '#FF6B00', fontWeight: 600 }}>
                  📎 Attached for customer: {agentAttachment.file.name} ({(agentAttachment.file.size / 1024).toFixed(0)} KB)
                </Typography>
                <IconButton size="small" onClick={() => setAgentAttachment(null)}>
                  <CloseIcon fontSize="small" sx={{ color: '#FF6B00' }} />
                </IconButton>
              </Box>
            )}

            {/* Quick Canned Responses Toolbar */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexShrink: 0, py: 1, borderTop: '1px solid', borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0') }}>
              <Chip
                label={t('admin.macroGasEnRoute', '🔥 Gas technician en route (25-30m)')}
                size="small"
                onClick={() => handleInputChange('Your gas refill technician has been dispatched and will arrive in 25-30 minutes.')}
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0,0.18)' : '#FFF4ED'),
                  color: '#FF6B00',
                  border: '1px solid rgba(255, 107, 0,0.3)',
                  '&:hover': { bgcolor: 'rgba(255, 107, 0,0.3)' },
                }}
              />
              <Chip
                label={t('admin.macroSandagaVerified', '🥗 Sandaga order verified')}
                size="small"
                onClick={() => handleInputChange('Your fresh food order is being packed at Marché Sandaga. Our runner will contact you shortly.')}
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0,0.18)' : '#FFF4ED'),
                  color: '#FF6B00',
                  border: '1px solid rgba(255, 107, 0,0.3)',
                  '&:hover': { bgcolor: 'rgba(255, 107, 0,0.3)' },
                }}
              />
              <Chip
                label={t('admin.macroRequestPhoto', '📑 Request photo/receipt')}
                size="small"
                onClick={() => handleInputChange('Could you please upload a photo or receipt so our operator team can verify your request?')}
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#F1F5F9'),
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : '#CBD5E1'),
                  '&:hover': { bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : '#E2E8F0') },
                }}
              />
            </Box>

            {/* Operator Reply Input Box or Closed Banner */}
            {currentChat?.status === 'closed' ? (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
                  {t('admin.chatClosedNotice', '🔒 This chat session is closed. Reopen the session to send new messages.')}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => handleReopenChat(currentChat.id)}
                  sx={{ textTransform: 'none', fontSize: 11, fontWeight: 700, borderRadius: '6px' }}
                >
                  {t('admin.reopenBtn', 'Reopen Chat')}
                </Button>
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={handleSendReply}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pt: 1.5,
                  flexShrink: 0,
                  borderTop: '1px solid',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />

                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ color: '#FF6B00', bgcolor: 'rgba(255, 107, 0,0.15)', '&:hover': { bgcolor: 'rgba(255, 107, 0,0.25)' } }}
                >
                  <AttachFileIcon fontSize="small" />
                </IconButton>

                <TextField
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                  placeholder={t('admin.typeResponsePlaceholder', 'Type response to customer...')}
                  value={replyInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  slotProps={{
                    htmlInput: {
                      autoComplete: 'off',
                      autoCorrect: 'off',
                      autoCapitalize: 'off',
                      spellCheck: 'false',
                    },
                  }}
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      fontSize: '0.8125rem !important',
                      fontWeight: '400 !important',
                      opacity: '0.7 !important',
                    },
                  }}
                />

                <IconButton
                  type="submit"
                  disabled={isSubmitting || (!replyInput.trim() && !agentAttachment)}
                  sx={{
                    bgcolor: '#FF6B00',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: '#E05D00' },
                    '&.Mui-disabled': { bgcolor: 'rgba(255, 107, 0,0.3)', color: 'rgba(255,255,255,0.5)' },
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Attachment Fullscreen Modal Preview */}
      <Dialog open={Boolean(previewImageUrl)} onClose={() => setPreviewImageUrl(null)} disableRestoreFocus maxWidth="md">
        <DialogContent sx={{ p: 1, bgcolor: '#140C07', textAlign: 'center' }}>
          {previewImageUrl && (
            <Box component="img" src={previewImageUrl} alt="Attachment Preview" sx={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default SupportDeskPanel;
