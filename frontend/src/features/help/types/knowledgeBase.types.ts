export interface ArticleSection {
  id: string;
  subheading: string;
  body: string;
}

export interface KBArticle {
  id: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  title: string;
  summary: string;
  icon?: string;
  verified?: boolean;
  content: ArticleSection[];
  views?: number;
  helpfulCount?: number;
}

export interface KBCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  articles: KBArticle[];
}
