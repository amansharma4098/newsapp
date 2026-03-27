import { useState, useEffect, useCallback } from 'react';
import type { Article } from '@/types';

const STORAGE_KEY = 'newsflash_bookmarks';

function loadBookmarks(): Article[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>(loadBookmarks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const add = useCallback((article: Article) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === article.id)) return prev;
      return [article, ...prev];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  return { bookmarks, add, remove, isBookmarked };
}
