import api from '../api/client';
import { getServiceCategoryLabel } from '../types';
import type { ServiceItem } from '../types';
import type {
  SystemUser,
  ContentCategory,
  MarketingCampaign,
  ProviderApplication,
  Testimonial,
  AdminKPI,
  DispatchedTicket,
} from '../features/admin/types/admin.types';

export interface TimeseriesDataPoint {
  date: string;
  tickets: number;
  revenue: number;
  visitors: number;
}

export interface ActiveChatSession {
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
 * Centralized Admin API Service (`adminService`)
 * Dedicated API handler targeting Supermarche backend routes for Operator Console
 */
export const adminService = {
  // 1. Overview KPIs & Timeseries Analytics
  getOverviewKPIs: async (): Promise<AdminKPI | null> => {
    const res = await api.get<AdminKPI>('/admin/analytics/overview');
    return res;
  },

  getTimeseriesData: async (): Promise<TimeseriesDataPoint[]> => {
    const res = await api.get<{ data?: TimeseriesDataPoint[] }>('/admin/analytics/timeseries');
    return Array.isArray(res) ? res : res?.data || [];
  },

  // 2. Users & Permissions
  getUsers: async (): Promise<SystemUser[]> => {
    const res = await api.get<SystemUser[]>('/admin/users');
    return Array.isArray(res) ? res : (res as { data?: SystemUser[] })?.data || [];
  },

  updateUserRole: async (id: string, role: string): Promise<unknown> => {
    return await api.patch(`/admin/users/${id}/role`, { role });
  },

  inviteUser: async (payload: { email: string; permissions: string[]; expires_in_minutes?: number }): Promise<unknown> => {
    return await api.users.invite(payload);
  },

  deleteUser: async (id: string): Promise<unknown> => {
    return await api.users.delete(id);
  },

  // 3. Content & Categories
  getServices: async (): Promise<unknown[]> => {
    const res = await api.get('/services');
    const items = (Array.isArray(res) ? res : (res as { data?: unknown[] })?.data || []) as Record<string, unknown>[];
    return items.map((item) => ({
      ...item,
      categoryLabel: getServiceCategoryLabel(item as unknown as Partial<ServiceItem>),
    }));
  },

  createCategory: async (categoryData: Partial<ContentCategory>): Promise<unknown> => {
    return await api.post('/services/categories', categoryData);
  },

  toggleServiceStatus: async (id: string, isLive: boolean): Promise<unknown> => {
    return await api.patch(`/services/${id}`, { isLive });
  },

  // 4. Marketing Campaigns
  getCampaigns: async (): Promise<MarketingCampaign[]> => {
    const res = await api.get<MarketingCampaign[]>('/admin/campaigns');
    return Array.isArray(res) ? res : (res as { data?: MarketingCampaign[] })?.data || [];
  },

  sendBroadcastCampaign: async (payload: {
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
  }): Promise<unknown> => {
    return await api.campaigns.broadcast(payload);
  },

  // 5. Pro Applications (Obsolete)
  getProApplications: async (): Promise<ProviderApplication[]> => {
    return [];
  },

  updateProApplicationStatus: async (_id: string, _status: 'approved' | 'rejected'): Promise<unknown> => {
    return { success: true };
  },

  // 6. Support Desk Chats
  getActiveChats: async (): Promise<ActiveChatSession[]> => {
    try {
      const res = await api.get<ActiveChatSession[]>('/admin/chat/active');
      return Array.isArray(res) ? res : (res as { data?: ActiveChatSession[] })?.data || [];
    } catch {
      try {
        const res = await api.support.getChats<ActiveChatSession[]>();
        return Array.isArray(res) ? res : (res as { data?: ActiveChatSession[] })?.data || [];
      } catch {
        return [];
      }
    }
  },

  replyToChatSession: async (sessionId: string, text: string): Promise<unknown> => {
    return await api.post('/admin/chat/reply', { sessionId, message: text });
  },

  // 7. Testimonials Moderation
  getTestimonials: async (status?: string): Promise<Testimonial[]> => {
    const res = await api.testimonials.getAdminList<Testimonial[]>(status);
    return Array.isArray(res) ? res : (res as { data?: Testimonial[] })?.data || [];
  },

  updateTestimonialStatus: async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<unknown> => {
    return await api.testimonials.updateStatus(id, status);
  },

  toggleTestimonialFeatured: async (id: string, isFeatured: boolean): Promise<unknown> => {
    return await api.patch(`/admin/testimonials/${id}/feature`, { isFeatured });
  },

  deleteTestimonial: async (id: string): Promise<unknown> => {
    return await api.testimonials.delete(id);
  },

  // 8. Tickets Dispatch
  getDispatchedTickets: async (): Promise<DispatchedTicket[]> => {
    const res = await api.get<DispatchedTicket[]>('/admin/tickets');
    return Array.isArray(res) ? res : (res as { data?: DispatchedTicket[] })?.data || [];
  },
};

export default adminService;
