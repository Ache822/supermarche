import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  AdminUser,
  AdminKPI,
  FieldRunner,
  DispatchedTicket,
  MoMoTransaction,
  AppPushNotification,
  SystemUser,
  ContentCategory,
  ContentArticle,
  MarketingCampaign,
  ProviderApplication,
  HelpArticleItem,
  Testimonial,
} from '../types/admin.types';
import type { KBCategory, KBArticle } from '../../help/types/knowledgeBase.types';

interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  user: AdminUser | null;
  activeTab: number | string;
  kpis: AdminKPI;
  runners: FieldRunner[];
  tickets: DispatchedTicket[];
  transactions: MoMoTransaction[];
  notifications: AppPushNotification[];
  users: SystemUser[];
  categories: ContentCategory[];
  articles: ContentArticle[];
  campaigns: MarketingCampaign[];
  applications: ProviderApplication[];
  helpArticles: HelpArticleItem[];
  testimonials: Testimonial[];
  kbCategories: KBCategory[];
  selectedCityFilter: string;
  selectedCategoryFilter: string;
  searchQuery: string;
}

const savedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
const savedUserRaw = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;
let initialAdminUser: AdminUser | null = null;
if (savedUserRaw) {
  try {
    initialAdminUser = JSON.parse(savedUserRaw);
  } catch {
    initialAdminUser = null;
  }
}

const initialKbCategories: KBCategory[] = [];

const persistKBCategories = (categories: KBCategory[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bb_kb_categories', JSON.stringify(categories));
    } catch {
      // Ignore quota error
    }
  }
};

export const INITIAL_SYSTEM_USERS: SystemUser[] = [];

const initialState: AdminState = {
  isAuthenticated: !!savedToken && initialAdminUser?.role === 'admin',
  token: savedToken,
  user: initialAdminUser,
  activeTab: 0,
  kpis: {
    grossRevenueXAF: 0,
    activeDispatches: 0,
    avgEtaMins: 0,
    totalAppDownloads: 0,
    activeRunnersOnDuty: 0,
    completedJobsToday: 0,
    momoPayoutBalanceXAF: 0,
  },
  runners: [],
  tickets: [],
  transactions: [],
  notifications: [],
  users: [],
  categories: [],
  articles: [],
  campaigns: [],
  applications: [],
  helpArticles: [],
  testimonials: [],
  kbCategories: initialKbCategories,
  selectedCityFilter: 'all',
  selectedCategoryFilter: 'all',
  searchQuery: '',
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: AdminUser }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', action.payload.token);
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('jwt', action.payload.token);
        localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
      }
    },
    logoutAdmin: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token');
        localStorage.removeItem('jwt');
        localStorage.removeItem('admin_user');
      }
    },
    setActiveTab: (state, action: PayloadAction<number | string>) => {
      state.activeTab = action.payload;
    },
    setAdminKPIs: (state, action: PayloadAction<Partial<AdminKPI>>) => {
      state.kpis = { ...state.kpis, ...action.payload };
    },
    setAdminCampaigns: (state, action: PayloadAction<MarketingCampaign[]>) => {
      state.campaigns = action.payload;
    },
    setAdminCategories: (state, action: PayloadAction<ContentCategory[]>) => {
      state.categories = action.payload;
    },
    setSelectedCityFilter: (state, action: PayloadAction<string>) => {
      state.selectedCityFilter = action.payload;
    },
    setSelectedCategoryFilter: (state, action: PayloadAction<string>) => {
      state.selectedCategoryFilter = action.payload;
    },
    setAdminSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateTicketStatusInAdmin: (
      state,
      action: PayloadAction<{ id: string; status: DispatchedTicket['status']; notes?: string }>
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.status = action.payload.status;
        if (action.payload.notes) ticket.notes = action.payload.notes;
      }
    },
    assignRunnerToTicket: (
      state,
      action: PayloadAction<{ ticketId: string; runnerId: string; runnerName: string }>
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.ticketId);
      if (ticket) {
        ticket.technicianId = action.payload.runnerId;
        ticket.technicianName = action.payload.runnerName;
        ticket.status = 'dispatched';
      }
    },
    updateRunnerKyc: (
      state,
      action: PayloadAction<{ runnerId: string; status: FieldRunner['kycStatus'] }>
    ) => {
      const runner = state.runners.find((r) => r.id === action.payload.runnerId);
      if (runner) {
        runner.kycStatus = action.payload.status;
      }
    },
    addPushNotification: (
      state,
      action: PayloadAction<{ title: string; message: string; targetRegion: string }>
    ) => {
      const newPush: AppPushNotification = {
        id: `PUSH-${Date.now()}`,
        title: action.payload.title,
        message: action.payload.message,
        targetRegion: action.payload.targetRegion,
        sentAt: 'Just now',
        recipientsCount: 2450,
      };
      state.notifications.unshift(newPush);
    },
    setSystemUsers: (state, action: PayloadAction<SystemUser[]>) => {
      state.users = action.payload;
    },
    addSystemUser: (state, action: PayloadAction<Omit<SystemUser, 'id' | 'createdAt'>>) => {
      const newUser: SystemUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        ...action.payload,
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.users.unshift(newUser);
    },
    updateUserPermissions: (
      state,
      action: PayloadAction<{ id: string; role: SystemUser['role']; permissions: string[]; status: SystemUser['status'] }>
    ) => {
      const targetId = action.payload.id;
      const user = state.users.find(
        (u) => u.id === targetId || (u as unknown as Record<string, unknown>)._id === targetId
      );
      if (user) {
        user.role = action.payload.role;
        user.permissions = action.payload.permissions;
        user.status = action.payload.status;
      }
    },
    deleteSystemUser: (state, action: PayloadAction<string>) => {
      const targetId = action.payload;
      state.users = state.users.filter(
        (u) => u.id !== targetId && (u as unknown as Record<string, unknown>)._id !== targetId
      );
    },
    // --- CONTENT MANAGEMENT ---
    addCategory: (state, action: PayloadAction<Omit<ContentCategory, 'id' | 'serviceCount'>>) => {
      const newCat: ContentCategory = {
        id: `CAT-${Date.now().toString().slice(-4)}`,
        ...action.payload,
        serviceCount: 0,
      };
      state.categories.push(newCat);
    },
    toggleCategoryStatus: (state, action: PayloadAction<string>) => {
      const cat = state.categories.find((c) => c.id === action.payload);
      if (cat) cat.active = !cat.active;
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload && c.slug !== action.payload);
    },
    addArticle: (state, action: PayloadAction<Omit<ContentArticle, 'id' | 'reads' | 'updatedAt'>>) => {
      const newArt: ContentArticle = {
        id: `ART-${Date.now().toString().slice(-4)}`,
        ...action.payload,
        reads: 0,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      state.articles.unshift(newArt);
    },
    // --- KNOWLEDGE BASE MANAGEMENT ---
    setKBCategories: (state, action: PayloadAction<KBCategory[]>) => {
      state.kbCategories = action.payload;
      persistKBCategories(action.payload);
    },
    addKBCategory: (state, action: PayloadAction<{ name: string; description?: string; icon?: string }>) => {
      const newId = `cat-${action.payload.name.toLowerCase().replace(/[^\w]/g, '-')}-${Date.now().toString().slice(-4)}`;
      const newCategory: KBCategory = {
        id: newId,
        name: action.payload.name,
        icon: action.payload.icon || 'Assignment',
        description: action.payload.description || '',
        articles: [],
      };
      state.kbCategories.push(newCategory);
      persistKBCategories(state.kbCategories);
    },
    deleteKBCategory: (state, action: PayloadAction<string>) => {
      state.kbCategories = state.kbCategories.filter((c) => c.id !== action.payload);
      persistKBCategories(state.kbCategories);
    },
    addKBArticle: (
      state,
      action: PayloadAction<{
        categoryId: string;
        title: string;
        summary: string;
        bodyText?: string;
        verified?: boolean;
      }>
    ) => {
      const category = state.kbCategories.find((c) => c.id === action.payload.categoryId);
      if (category) {
        const slug = action.payload.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        const newArticle: KBArticle = {
          id: `art-${Date.now().toString().slice(-6)}`,
          slug,
          categoryId: category.id,
          categoryName: category.name,
          title: action.payload.title,
          summary: action.payload.summary,
          verified: action.payload.verified ?? true,
          views: 1,
          helpfulCount: 0,
          content: [
            {
              id: `sec-${Date.now().toString().slice(-4)}`,
              subheading: 'Guide Steps & Instructions',
              body: action.payload.bodyText || action.payload.summary,
            },
          ],
        };
        category.articles.unshift(newArticle);
        persistKBCategories(state.kbCategories);
      }
    },
    updateKBArticle: (
      state,
      action: PayloadAction<{
        articleId: string;
        title: string;
        summary: string;
        bodyText?: string;
        verified?: boolean;
        categoryId?: string;
      }>
    ) => {
      for (const cat of state.kbCategories) {
        const art = cat.articles.find((a) => a.id === action.payload.articleId);
        if (art) {
          art.title = action.payload.title;
          art.summary = action.payload.summary;
          if (action.payload.verified !== undefined) art.verified = action.payload.verified;
          if (action.payload.bodyText && art.content.length > 0) {
            art.content[0].body = action.payload.bodyText;
          }
          break;
        }
      }
      persistKBCategories(state.kbCategories);
    },
    deleteKBArticle: (state, action: PayloadAction<string>) => {
      const targetId = action.payload;
      for (const cat of state.kbCategories) {
        cat.articles = cat.articles.filter((a) => a.id !== targetId);
      }
      persistKBCategories(state.kbCategories);
    },
    toggleKBArticleVerified: (state, action: PayloadAction<string>) => {
      const targetId = action.payload;
      for (const cat of state.kbCategories) {
        const art = cat.articles.find((a) => a.id === targetId);
        if (art) {
          art.verified = !art.verified;
          break;
        }
      }
      persistKBCategories(state.kbCategories);
    },
    // --- CAMPAIGNS ---
    addCampaign: (state, action: PayloadAction<Omit<MarketingCampaign, 'id' | 'currentRedemptions'>>) => {
      const newCamp: MarketingCampaign = {
        id: `CMP-${Date.now().toString().slice(-4)}`,
        ...action.payload,
        currentRedemptions: 0,
      };
      state.campaigns.unshift(newCamp);
    },
    toggleCampaignStatus: (state, action: PayloadAction<string>) => {
      const camp = state.campaigns.find((c) => c.id === action.payload);
      if (camp) {
        camp.status = camp.status === 'active' ? 'ended' : 'active';
      }
    },
    updateCampaignBroadcastStatus: (
      state,
      action: PayloadAction<{ id: string; status: MarketingCampaign['status']; recipientCount?: number; sentAt?: string }>
    ) => {
      const camp = state.campaigns.find((c) => c.id === action.payload.id);
      if (camp) {
        camp.status = action.payload.status;
        if (action.payload.recipientCount !== undefined) camp.recipientCount = action.payload.recipientCount;
        if (action.payload.sentAt !== undefined) camp.sentAt = action.payload.sentAt;
      }
    },
    // --- PROVIDER APPLICATIONS ---
    addProviderApplication: (state, action: PayloadAction<Omit<ProviderApplication, 'id' | 'submittedAt' | 'status'>>) => {
      const newApp: ProviderApplication = {
        id: `APP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        ...action.payload,
        status: 'pending',
        submittedAt: 'Just now',
      };
      state.applications.unshift(newApp);
    },
    setProviderApplications: (state, action: PayloadAction<ProviderApplication[]>) => {
      state.applications = action.payload;
    },
    updateApplicationStatus: (
      state,
      action: PayloadAction<{ id: string; status: ProviderApplication['status']; notes?: string }>
    ) => {
      const targetId = action.payload.id;
      const app = state.applications.find(
        (a) => a.id === targetId || (a as unknown as Record<string, unknown>)._id === targetId
      );
      if (app) {
        app.status = action.payload.status;
        if (action.payload.notes) app.notes = action.payload.notes;
      }
    },
    // --- HELP CENTER ARTICLES ---
    addHelpArticle: (state, action: PayloadAction<Omit<HelpArticleItem, 'id' | 'views' | 'helpfulCount'>>) => {
      const newHelp: HelpArticleItem = {
        id: `HELP-${Date.now().toString().slice(-4)}`,
        ...action.payload,
        views: 1,
        helpfulCount: 0,
      };
      state.helpArticles.unshift(newHelp);
    },
    // --- TESTIMONIALS MODERATION ---
    addTestimonial: (
      state,
      action: PayloadAction<
        Omit<Testimonial, 'id' | 'createdAt' | 'status' | 'isFeatured' | 'consentToPublish'> & {
          consentToPublish?: boolean;
          status?: Testimonial['status'];
          isFeatured?: boolean;
        }
      >
    ) => {
      const newTestimonial: Testimonial = {
        id: `TST-${Date.now().toString().slice(-4)}`,
        authorName: action.payload.authorName,
        authorRole: action.payload.authorRole,
        avatarUrl: action.payload.avatarUrl,
        rating: action.payload.rating,
        content: action.payload.content,
        serviceUsed: action.payload.serviceUsed,
        consentToPublish: action.payload.consentToPublish ?? true,
        status: action.payload.status || 'PENDING',
        isFeatured: action.payload.isFeatured ?? false,
        createdAt: new Date().toISOString(),
      };
      state.testimonials.unshift(newTestimonial);
    },
    setTestimonials: (state, action: PayloadAction<Testimonial[]>) => {
      state.testimonials = action.payload;
    },
    updateTestimonialStatus: (
      state,
      action: PayloadAction<{ id: string; status: Testimonial['status'] }>
    ) => {
      const targetId = action.payload.id;
      const item = state.testimonials.find(
        (t) => t.id === targetId || (t as unknown as Record<string, unknown>)._id === targetId
      );
      if (item) {
        item.status = action.payload.status;
      }
    },
    toggleTestimonialFeatured: (state, action: PayloadAction<string>) => {
      const targetId = action.payload;
      const item = state.testimonials.find(
        (t) => t.id === targetId || (t as unknown as Record<string, unknown>)._id === targetId
      );
      if (item) {
        item.isFeatured = !item.isFeatured;
      }
    },
    deleteTestimonial: (state, action: PayloadAction<string>) => {
      const targetId = action.payload;
      state.testimonials = state.testimonials.filter(
        (t) => t.id !== targetId && (t as unknown as Record<string, unknown>)._id !== targetId
      );
    },
  },
});

export const {
  loginSuccess,
  logoutAdmin,
  setActiveTab,
  setAdminKPIs,
  setAdminCampaigns,
  setAdminCategories,
  setSelectedCityFilter,
  setSelectedCategoryFilter,
  setAdminSearchQuery,
  updateTicketStatusInAdmin,
  assignRunnerToTicket,
  updateRunnerKyc,
  addPushNotification,
  setSystemUsers,
  addSystemUser,
  updateUserPermissions,
  deleteSystemUser,
  addCategory,
  toggleCategoryStatus,
  deleteCategory,
  addArticle,
  setKBCategories,
  addKBCategory,
  deleteKBCategory,
  addKBArticle,
  updateKBArticle,
  deleteKBArticle,
  toggleKBArticleVerified,
  addCampaign,
  toggleCampaignStatus,
  updateCampaignBroadcastStatus,
  addProviderApplication,
  setProviderApplications,
  updateApplicationStatus,
  addHelpArticle,
  addTestimonial,
  setTestimonials,
  updateTestimonialStatus,
  toggleTestimonialFeatured,
  deleteTestimonial,
} = adminSlice.actions;

export default adminSlice.reducer;
