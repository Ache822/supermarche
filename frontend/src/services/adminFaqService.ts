import { api } from '../api/client';
import type { FAQItem } from '../types/faq';

export const DEFAULT_FAQ_CATEGORIES = [
  { id: 'cat-general', name: 'General Information', slug: 'general' },
  { id: 'cat-booking', name: 'Booking & Service Requests', slug: 'booking' },
  { id: 'cat-payments', name: 'Payments & Mobile Money', slug: 'payments' },
  { id: 'cat-dispatch', name: 'Dispatch & Gas Refills', slug: 'dispatch' },
  { id: 'cat-pro', name: 'Pro Partner & Fleet Onboarding', slug: 'pro' },
];

export const adminFaqService = {
  getAdminFaqs: async (): Promise<FAQItem[]> => {
    try {
      const res = await api.faqs.list<FAQItem[] | { data: FAQItem[] }>();
      const data = Array.isArray(res) ? res : res?.data || [];
      return data;
    } catch {
      return [];
    }
  },

  getPublicFaqs: async (role?: 'ALL' | 'CUSTOMER' | 'PRO'): Promise<FAQItem[]> => {
    try {
      const res = await api.faqs.list<FAQItem[] | { data: FAQItem[] }>({ targetRole: role });
      const items = Array.isArray(res) ? res : res?.data || [];
      return items.filter((f) => f.isPublished);
    } catch {
      return [];
    }
  },

  createFaq: async (payload: Partial<FAQItem>): Promise<FAQItem> => {
    try {
      const res = await api.faqs.create<FAQItem | { data: FAQItem }>(payload);
      return (res as { data: FAQItem }).data || (res as FAQItem);
    } catch {
      return {
        id: `faq_${Date.now()}`,
        categoryId: payload.categoryId || 'cat-general',
        categoryName: payload.categoryName || 'General Information',
        question: payload.question || '',
        answer: payload.answer || '',
        isPublished: payload.isPublished ?? true,
        orderIndex: payload.orderIndex || 1,
        targetRole: payload.targetRole || 'ALL',
      };
    }
  },

  updateFaq: async (id: string, payload: Partial<FAQItem>): Promise<FAQItem> => {
    try {
      const res = await api.faqs.update<FAQItem | { data: FAQItem }>(id, payload);
      return (res as { data: FAQItem }).data || (res as FAQItem);
    } catch {
      return {
        id,
        categoryId: payload.categoryId || 'cat-general',
        question: payload.question || '',
        answer: payload.answer || '',
        isPublished: payload.isPublished ?? true,
        orderIndex: payload.orderIndex || 1,
        targetRole: payload.targetRole || 'ALL',
      };
    }
  },

  toggleFaqPublishStatus: async (id: string, isPublished: boolean): Promise<FAQItem> => {
    return adminFaqService.updateFaq(id, { isPublished });
  },

  deleteFaq: async (id: string): Promise<void> => {
    try {
      await api.faqs.delete(id);
    } catch {
      // Ignore
    }
  },
};

export default adminFaqService;
