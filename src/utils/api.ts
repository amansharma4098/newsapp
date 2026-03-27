import type { Article, NewsResponse, TrendingTopic, Category } from '@/types';

const BASE_URL = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export async function getNews(
  category: Category = 'top',
  page: number = 1
): Promise<NewsResponse> {
  return fetchJson<NewsResponse>(
    `${BASE_URL}/news?category=${category}&page=${page}`
  );
}

export async function getArticle(id: string): Promise<Article> {
  return fetchJson<Article>(`${BASE_URL}/article/${id}`);
}

export async function getTrending(): Promise<TrendingTopic[]> {
  return fetchJson<TrendingTopic[]>(`${BASE_URL}/trending`);
}

export async function searchNews(query: string): Promise<NewsResponse> {
  return fetchJson<NewsResponse>(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}`
  );
}
