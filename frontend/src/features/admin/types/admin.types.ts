export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'admin';
  access?: 'SUPER_ADMIN' | 'ADMIN';
  permissions?: string[];
}

export interface AdminAuthResponse {
  token: string;
  user: AdminUser;
}

export interface AdminKPI {
  grossRevenueXAF: number;
  activeDispatches: number;
  avgEtaMins: number;
  totalAppDownloads: number;
  activeRunnersOnDuty: number;
  completedJobsToday: number;
  momoPayoutBalanceXAF: number;
  subscriberCount?: number;
  totalVisitors?: number;
  activeSessions?: number;
  pendingTestimonials?: number;
}

export interface FieldRunner {
  id: string;
  name: string;
  phone: string;
  city: 'Yaoundé' | 'Douala' | 'Bamenda' | 'Buea' | 'Kribi' | 'Bafoussam';
  district: string;
  vehicle: 'Motorbike' | 'Van' | 'Bicycle' | 'On Foot';
  kycStatus: 'verified' | 'pending' | 'suspended';
  rating: number;
  completedJobs: number;
  activeJobId?: string;
  cashOnHandXAF: number;
  avatarUrl?: string;
}

export interface DispatchedTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceCategory: 'gas' | 'market' | 'school' | 'cleaning' | 'security' | 'auto';
  serviceTitle: string;
  city: string;
  district: string;
  addressDetails: string;
  status: 'pending' | 'dispatched' | 'arrived' | 'in_progress' | 'action_needed' | 'completed' | 'cancelled';
  priceXAF: number;
  technicianId?: string;
  technicianName?: string;
  channel: 'mobile_app' | 'web';
  createdAt: string;
  proofPhotoUrl?: string;
  notes?: string;
}

export interface MoMoTransaction {
  id: string;
  ticketId: string;
  provider: 'MTN MoMo' | 'Orange Money';
  senderNumber: string;
  amountXAF: number;
  commissionXAF: number;
  runnerPayoutXAF: number;
  status: 'successful' | 'processing' | 'failed';
  timestamp: string;
}

export interface AppPushNotification {
  id: string;
  title: string;
  message: string;
  targetRegion: string;
  sentAt: string;
  recipientsCount: number;
}

export type BackendPermission =
  | '*'
  | 'pages:read'
  | 'pages:edit'
  | 'users:manage'
  | 'users:read'
  | 'support:chat'
  | 'campaigns:manage'
  | 'faqs:manage'
  | 'articles:manage'
  | 'applications:read'
  | 'applications:manage';

export const AVAILABLE_BACKEND_PERMISSIONS: { id: string; label: string; module: string }[] = [
  { id: '*', label: 'Super Admin Full Access (*)', module: 'system' },
  { id: 'pages:read', label: 'View Pages & Service Catalog (pages:read)', module: 'pages' },
  { id: 'pages:edit', label: 'Manage Services & Categories (pages:edit)', module: 'pages' },
  { id: 'users:read', label: 'View System Users & Team (users:read)', module: 'users' },
  { id: 'users:manage', label: 'Manage Users & Permissions (users:manage)', module: 'users' },
  { id: 'support:chat', label: 'Live Support & Customer Dispatch (support:chat)', module: 'support' },
  { id: 'campaigns:manage', label: 'Campaigns & Push Notifications (campaigns:manage)', module: 'campaigns' },
  { id: 'faqs:manage', label: 'Manage System FAQs (faqs:manage)', module: 'faqs' },
  { id: 'articles:manage', label: 'Publish Blog & News Articles (articles:manage)', module: 'articles' },
  { id: 'applications:read', label: 'View Provider Applications (applications:read)', module: 'applications' },
  { id: 'applications:manage', label: 'Approve & Manage Applications (applications:manage)', module: 'applications' },
];

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'admin' | 'operator' | 'dispatcher' | 'support';
  access?: 'SUPER_ADMIN' | 'ADMIN';
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  serviceCount: number;
  active: boolean;
  iconName?: string;
  display_order?: number;
  parent?: string | null;
}

export interface ContentArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  status: 'published' | 'draft';
  reads: number;
  updatedAt: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  subject?: string;
  code?: string;
  discountPercent?: number;
  targetCity: string;
  audience?: string;
  contentHtml?: string;
  recipientCount?: number;
  startDate: string;
  endDate: string;
  sentAt?: string;
  status: 'active' | 'scheduled' | 'ended' | 'draft' | 'sending' | 'sent' | 'failed';
  maxRedemptions?: number;
  currentRedemptions?: number;
}

export interface ProviderApplication {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  category: string;
  experienceYears: string;
  confirmationMethod: 'email' | 'whatsapp';
  status: 'pending' | 'approved' | 'rejected';
  cniNumber?: string;
  submittedAt: string;
  notes?: string;
}

export interface HelpArticleItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  views: number;
  helpfulCount: number;
  featured: boolean;
  slug?: string;
  author?: string;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  rating: number; // 1 to 5 stars
  content: string;
  serviceUsed?: string;
  consentToPublish: boolean; // Records user consent for public display on website
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isFeatured: boolean; // Controls rendering on public landing page
  createdAt: string;
}


