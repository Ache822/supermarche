import { io, Socket } from 'socket.io-client';

type EventCallback = (data: unknown) => void;

export interface ChatMessagePayload {
  id: string;
  sessionId: string;
  sender: 'customer' | 'admin' | 'supermarche';
  senderName?: string;
  text?: string;
  message?: string;
  body?: string;
  timestamp: string;
  topic?: string;
  attachment?: {
    name: string;
    size: string;
    type?: string;
    url?: string;
  };
}

export interface ChatSessionPayload {
  sessionId: string;
  customerName: string;
  city: string;
  topic: string;
  lastMsg: string;
  timestamp: string;
  unread: boolean;
  status: 'open' | 'active' | 'resolved';
}

/**
 * Socket / Real-Time Event Hub (`BamboSocketClient`)
 * Manages WebSocket connection via socket.io-client & BroadcastChannel fallback
 * for instant two-way customer-to-admin live support desk chat.
 */
class BamboSocketClient {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private channel: BroadcastChannel | null = null;
  private currentSessionId: string = '';
  private instanceId: string = `inst_${Math.random().toString(36).substring(2, 9)}`;
  public socket: Socket | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const envObj = (import.meta as { env?: { VITE_SOCKET_URL?: string } }).env;
      const socketUrl = envObj?.VITE_SOCKET_URL || 'http://192.168.100.125:3000';

      try {
        this.socket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
        });

        // Listen for real server socket events and dispatch locally
        this.socket.on('receive_message', (data: ChatMessagePayload) => {
          this.emitLocal('receive_message', data);
        });

        this.socket.on('join_chat:ack', (data: unknown) => {
          this.emitLocal('join_chat:ack', data);
        });

        this.socket.on('typing_indicator', (data: unknown) => {
          this.emitLocal('typing_indicator', data);
        });
      } catch (err) {
        console.warn('Socket.IO connection warning:', err);
      }

      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('supermarche_live_support_channel');
        this.channel.onmessage = (event) => {
          const { eventName, data, instanceId } = event.data || {};
          if (eventName && instanceId !== this.instanceId) {
            this.emitLocal(eventName, data);
          }
        };
      }
    }
  }

  /**
   * Register Event Listener (e.g., 'receive_message', 'typing_indicator', 'session_updated')
   */
  on<T = unknown>(eventName: string, callback: (data: T) => void): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    const cb = callback as EventCallback;
    this.listeners.get(eventName)!.add(cb);

    return () => {
      this.off(eventName, cb);
    };
  }

  off(eventName: string, callback: EventCallback) {
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private emitLocal(eventName: string, data: unknown) {
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for ${eventName}:`, e);
        }
      });
    }
  }

  /**
   * Emit Event over real Socket.IO WebSocket connection and broadcast locally
   */
  emit(eventName: string, data: unknown) {
    this.emitLocal(eventName, data);

    if (this.socket && this.socket.connected) {
      this.socket.emit(eventName, data);
    }

    const payload = { eventName, data, instanceId: this.instanceId };
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch {
        // ignore
      }
    }
  }

  /**
   * Save session to localStorage store
   */
  saveSession(session: Partial<ChatSessionPayload>) {
    if (!session.sessionId) return;
    try {
      const existing: Partial<ChatSessionPayload>[] = JSON.parse(localStorage.getItem('bb_chat_sessions_store') || '[]');
      const idx = existing.findIndex((s) => s.sessionId === session.sessionId);
      if (idx !== -1) {
        existing[idx] = { ...existing[idx], ...session };
      } else {
        existing.unshift(session);
      }
      localStorage.setItem('bb_chat_sessions_store', JSON.stringify(existing));
    } catch {
      // ignore
    }
  }

  /**
   * Save message to localStorage store per session
   */
  saveMessage(msg: ChatMessagePayload) {
    if (!msg.sessionId) return;
    try {
      const existing: ChatMessagePayload[] = JSON.parse(localStorage.getItem(`bb_chat_msgs_${msg.sessionId}`) || '[]');
      const isDup = existing.some((m) => m.id === msg.id);
      if (!isDup) {
        const normalizedMsg = {
          ...msg,
          text: msg.message || msg.text || msg.body || '',
          message: msg.message || msg.text || msg.body || '',
        };
        existing.push(normalizedMsg);
        localStorage.setItem(`bb_chat_msgs_${msg.sessionId}`, JSON.stringify(existing));
      }
    } catch {
      // ignore
    }
  }

  /**
   * Join a chat session room
   */
  joinChat(session: Partial<ChatSessionPayload>) {
    const sessionId = session.sessionId || this.getOrCreateSessionId();
    this.currentSessionId = sessionId;
    const fullSession = { ...session, sessionId };
    this.saveSession(fullSession);
    this.emit('join_chat', fullSession);
  }

  getCurrentSessionId(): string {
    return this.currentSessionId || this.getOrCreateSessionId();
  }

  /**
   * Send a real-time message
   */
  sendMessage(payload: ChatMessagePayload) {
    this.saveMessage(payload);
    this.saveSession({
      sessionId: payload.sessionId,
      lastMsg: payload.text || payload.message || payload.body || '',
      timestamp: payload.timestamp,
    });
    this.emit('send_message', payload);
    this.emit('receive_message', payload);
  }

  /**
   * Send typing status
   */
  sendTyping(sessionId: string, sender: 'customer' | 'admin', isTyping: boolean) {
    this.emit('typing_indicator', { sessionId, sender, isTyping });
  }

  /**
   * Utility to get or create persistent customer sessionId
   */
  getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'sess_default';
    let sid = localStorage.getItem('supermarche_chat_session_id');
    if (!sid) {
      sid = `sess_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('supermarche_chat_session_id', sid);
    }
    return sid;
  }
}

export const socketClient = new BamboSocketClient();
export default socketClient;
