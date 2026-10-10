export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'action_needed';

export interface JobTicket {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  status: JobStatus;
  eta: string;
  price: string;
  location: string;
  technicianName: string;
  technicianRole: string;
  verified: boolean;
  createdAt: string;
  notes?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  display_order?: number;
  is_active?: boolean;
  parent?: CategoryItem | string | null;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'gas' | 'market' | 'cleaning' | 'security' | 'school' | 'prepped' | 'repair' | 'auto' | CategoryItem | string;
  categoryLabel?: string;
  description: string;
  priceRange: string;
  estimatedTime: string;
  iconName: string;
  isLive: boolean;
  featured?: boolean;
  imageUrl?: string;
}

export const getServiceCategoryLabel = (srv?: Partial<ServiceItem> | null): string => {
  if (!srv) return 'General Service';
  if (srv.categoryLabel && srv.categoryLabel.trim()) return srv.categoryLabel;
  if (typeof srv.category === 'string' && srv.category.trim()) {
    return srv.category
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  if (typeof srv.category === 'object' && srv.category && (srv.category as unknown as Record<string, unknown>).name) {
    return String((srv.category as unknown as Record<string, unknown>).name);
  }
  return 'General Service';
};

export interface Provider {
  id: string;
  name: string;
  role: string;
  rating: number;
  completedJobs: number;
  verified: boolean;
  avatarUrl?: string;
}

export interface LocationItem {
  id: string;
  name: string;
  region: string;
  country: string;
  type?: 'country' | 'state' | 'city' | 'address';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  hasMore: boolean;
}

