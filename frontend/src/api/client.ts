/**
 * Supermarche API Client
 * Configured with HTTP-Only Cookie Handling (`credentials: 'include'`)
 * As documented in Docs/frontend_auth_implementation_guide.md & Docs/frontend_concepts_integration_guide.md
 */

const envObj = (import.meta as unknown as { env?: Record<string, string> }).env;
const API_BASE_URL =
  envObj?.VITE_API_BASE_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:3001/api/v1`
    : 'http://localhost:3001/api/v1');

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | null | undefined>;
}

export interface BackendErrorDetails {
  id: string;
  statusCode?: number;
  endpoint?: string;
  message: string;
  rawDetails?: unknown;
  timestamp: string;
}

type BackendErrorListener = (error: BackendErrorDetails) => void;
const errorListeners = new Set<BackendErrorListener>();

export const subscribeBackendError = (listener: BackendErrorListener) => {
  errorListeners.add(listener);
  return () => {
    errorListeners.delete(listener);
  };
};

export const dispatchBackendError = (error: BackendErrorDetails) => {
  errorListeners.forEach((fn) => fn(error));
};

async function request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const rawToken = typeof window !== 'undefined' ? (localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('jwt')) : null;
  const validBearerToken = rawToken && rawToken !== 'cookie_authenticated' && rawToken.length > 5 ? rawToken : null;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(validBearerToken ? { Authorization: `Bearer ${validBearerToken}`, 'x-access-token': validBearerToken } : {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      credentials: 'include', // CRITICAL: Sends & receives HTTP-Only cookies (__Secure-api-token)
    });
  } catch (netErr: unknown) {
    const netMsg = (netErr as Error)?.message || 'Failed to connect to backend server';
    dispatchBackendError({
      id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      statusCode: 0,
      endpoint: `${options.method || 'GET'} ${endpoint}`,
      message: netMsg,
      rawDetails: { error: netMsg, url },
      timestamp: new Date().toISOString(),
    });
    throw netErr;
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: { code?: string; message?: string; details?: unknown[] } | string;
      status?: string;
    };

    const serverMessage =
      (typeof errorData.error === 'object' && errorData.error?.message) ||
      errorData.message ||
      (typeof errorData.error === 'string' ? errorData.error : null) ||
      `Server Error (HTTP ${response.status})`;

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('token');
        localStorage.removeItem('jwt');
      }
      if (serverMessage.toLowerCase().includes('jwt') || serverMessage.toLowerCase().includes('signature')) {
        throw new Error('JWT Authentication Failed: Your session token is invalid or expired. Please sign in again.');
      }
      throw new Error(serverMessage || 'Invalid email or password. Please check your credentials.');
    }

    dispatchBackendError({
      id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      statusCode: response.status,
      endpoint: `${options.method || 'GET'} ${endpoint}`,
      message: serverMessage,
      rawDetails: errorData,
      timestamp: new Date().toISOString(),
    });
    if (response.status === 429) {
      throw new Error(serverMessage || 'Too many attempts. Rate limit exceeded by backend security. Please wait a moment.');
    }
    if (response.status === 404) {
      throw new Error(serverMessage || 'Requested API resource not found (404).');
    }

    throw new Error(serverMessage);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T = unknown>(endpoint: string, params?: Record<string, string | number | boolean | null | undefined>, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'GET', params, ...options }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),

  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),

  // Auth API
  auth: {
    login: <T = unknown>(credentials: { email?: string; password?: string }) =>
      api.post<T>('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    me: <T = unknown>() => api.get<T>('/auth/me'),
  },

  // Testimonials & Moderation Pipeline
  testimonials: {
    getFeatured: <T = unknown>() => api.get<T>('/testimonials/featured'),
    submit: <T = unknown>(review: unknown) => api.post<T>('/testimonials', review),
    getAdminList: <T = unknown>(status?: string) => api.get<T>('/admin/testimonials', { status }),
    updateStatus: <T = unknown>(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') =>
      api.patch<T>(`/admin/testimonials/${id}/status`, { status }),
    toggleFeatured: <T = unknown>(id: string, isFeatured: boolean) =>
      api.patch<T>(`/admin/testimonials/${id}/toggle-featured`, { isFeatured }),
    delete: <T = unknown>(id: string) => api.delete<T>(`/admin/testimonials/${id}`),
  },

  // Team & User Management
  users: {
    list: <T = unknown>() => api.get<T>('/users'),
    invite: async <T = unknown>(payload: { email: string; permissions: string[]; expires_in_minutes?: number }) => {
      try {
        return await api.post<T>('/users/invite', payload);
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        if (errorObj.message?.includes('404')) {
          return await api.post<T>('/users', payload);
        }
        throw err;
      }
    },
    acceptInvite: <T = unknown>(payload: { token: string; fullName: string; password?: string }) =>
      api.post<T>('/users/accept-invite', payload),
    delete: <T = unknown>(id: string) => api.delete<T>(`/users/${id}`),
  },

  // Domain-specific Concept Helpers from Docs/
  services: {
    // Concept 1: Self-Referencing Category Tree
    getMainHubs: (lang?: string) => api.get('/services/categories', { parent: 'null', lang }),
    getSubCategories: (hubObjectId: string, lang?: string) => api.get('/services/categories', { parent: hubObjectId, lang }),

    // Concept 4: Featured Items vs Pagination
    getFeaturedServices: (lang?: string) => api.get('/services', { featured: true, lang }),
    getPaginatedServices: <T = unknown>(page = 1, limit = 20, lang?: string) =>
      api.get<T>('/services', { page, limit, lang }),
  },

  // Email Broadcast Campaigns Specs from Admin Spec
  campaigns: {
    broadcast: (payload: {
      title?: string;
      subject: string;
      audience?: string;
      contentHtml?: string;
      code?: string;
      discountPercent?: number;
      targetCity?: string;
      isDraft?: boolean;
      isTest?: boolean;
      testEmail?: string;
    }) => api.post('/campaigns/broadcast', payload),
    sendTestEmail: (payload: { subject: string; contentHtml: string; testEmail: string }) =>
      api.post('/campaigns/broadcast', { ...payload, isTest: true }),
    getSubscribers: <T = unknown>() => api.get<T>('/campaigns/subscribers'),
  },

  // Concept 5: Support Chat Resolution & Management
  support: {
    getChats: <T = unknown>() => api.get<T>('/support/chats'),
    getMessages: <T = unknown>(sessionId: string) => api.get<T>(`/support/chats/${sessionId}/messages`),
    sendMessage: <T = unknown>(sessionId: string, payload: unknown) =>
      api.post<T>(`/support/chats/${sessionId}/messages`, payload),
    uploadAttachment: <T = unknown>(formData: FormData) =>
      api.post<T>('/support/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    resolveSession: (sessionId: string, notes: string) =>
      api.post(`/support/chats/${sessionId}/resolve`, { resolution_notes: notes }),
    deleteSession: (sessionId: string) =>
      api.delete(`/support/chats/${sessionId}`).catch(() => ({ success: true })),
  },

  // Website Visitor Tracking & Analytics Engine
  analytics: {
    trackHit: async (payload: unknown) => {
      // Buffer hit payload locally for offline / standalone frontend mode
      try {
        const existing = JSON.parse(localStorage.getItem('bb_local_visitor_logs') || '[]');
        existing.push(payload);
        localStorage.setItem('bb_local_visitor_logs', JSON.stringify(existing.slice(-100)));
      } catch {
        // Ignore storage errors
      }

      // Fire fetch request, catching connection refused gracefully when backend is offline
      try {
        return await api.post('/analytics/track', payload);
      } catch {
        return { success: true, bufferedLocally: true };
      }
    },
    getOverview: <T = unknown>(timeframe = 'last7days') =>
      api.get<T>('/admin/analytics/overview', { timeframe }).catch(() => {
        return null as unknown as T;
      }),
  },

  // Dynamic FAQs API
  faqs: {
    list: <T = unknown>(params?: Record<string, string | number | boolean | null | undefined>) =>
      api.get<T>('/faqs', params),
    create: <T = unknown>(data: unknown) => api.post<T>('/faqs', data),
    update: <T = unknown>(id: string, data: unknown) => api.patch<T>(`/faqs/${id}`, data),
    delete: <T = unknown>(id: string) => api.delete<T>(`/faqs/${id}`),
  },

  // E-Commerce Products API
  products: {
    list: <T = unknown>(params?: Record<string, string | number | boolean | null | undefined>) =>
      api.get<T>('/products', params),
    getByIdOrSlug: <T = unknown>(identifier: string) =>
      api.get<T>(`/products/${identifier}`),
    create: <T = unknown>(data: unknown) =>
      api.post<T>('/products', data),
    update: <T = unknown>(id: string, data: unknown) =>
      request<T>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: <T = unknown>(id: string) =>
      api.delete<T>(`/products/${id}`),
    uploadImage: <T = unknown>(data: { filename: string; fileData: string }) =>
      api.post<T>('/products/upload-image', data),
  },

  // E-Commerce Orders API
  orders: {
    create: <T = unknown>(data: unknown) =>
      api.post<T>('/orders', data),
    track: <T = unknown>(identifier: string) =>
      api.get<T>(`/orders/track/${identifier}`),
    getAdminList: <T = unknown>(params?: Record<string, string | number | boolean | null | undefined>) =>
      api.get<T>('/orders/admin/list', params),
    updateStatus: <T = unknown>(id: string, data: { orderStatus?: string; paymentStatus?: string; trackingNumber?: string }) =>
      api.patch<T>(`/orders/admin/${id}/status`, data),
  },

  // Dynamic Knowledge Base Articles API
  articles: {
    list: <T = unknown>(params?: Record<string, string | number | boolean | null | undefined>) =>
      api.get<T>('/articles', params),
    getBySlug: <T = unknown>(slug: string) => api.get<T>(`/articles/${slug}`),
    create: <T = unknown>(data: unknown) => api.post<T>('/articles', data),
    update: <T = unknown>(id: string, data: unknown) => api.patch<T>(`/articles/${id}`, data),
    delete: <T = unknown>(id: string) => api.delete<T>(`/articles/${id}`),
  },
};

export default api;
