import { useState, useEffect, useCallback } from 'react';
import type { Article, Category, NewsResponse } from '@/types';
import { getNews, searchNews } from '@/utils/api';

export function useNews(category: Category = 'top') {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = useCallback(
    async (pageNum: number, append: boolean = false) => {
      try {
        setLoading(true);
        setError(null);
        const data: NewsResponse = await getNews(category, pageNum);
        setArticles((prev) => (append ? [...prev, ...data.articles] : data.articles));
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  useEffect(() => {
    setPage(1);
    setArticles([]);
    fetchArticles(1);
  }, [fetchArticles]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage, true);
    }
  }, [loading, hasMore, page, fetchArticles]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchArticles(1);
  }, [fetchArticles]);

  return { articles, loading, error, hasMore, loadMore, refresh };
}

export function useSearch() {
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setQuery(q);
    setLoading(true);
    try {
      const data = await searchNews(q);
      setResults(data.articles);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, query, search };
}
