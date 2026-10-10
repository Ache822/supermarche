export interface FAQItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  question: string;
  answer: string;
  isPublished: boolean;
  orderIndex: number;
  targetRole?: 'ALL' | 'CUSTOMER' | 'PRO';
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
}
