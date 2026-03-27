export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  source: string;
  sourceIcon?: string;
  author: string;
  category: Category;
  publishedAt: string;
  isBreaking?: boolean;
  readTime?: number;
}

export type Category =
  | 'top'
  | 'trending'
  | 'india'
  | 'world'
  | 'business'
  | 'technology'
  | 'sports'
  | 'entertainment'
  | 'health'
  | 'science';

export interface NewsResponse {
  articles: Article[];
  totalResults: number;
  page: number;
  hasMore: boolean;
}

export interface TrendingTopic {
  id: string;
  title: string;
  articleCount: number;
  category: Category;
}

export interface ApiError {
  error: string;
  message: string;
}

export interface BookmarkState {
  bookmarks: Article[];
  add: (article: Article) => void;
  remove: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}
