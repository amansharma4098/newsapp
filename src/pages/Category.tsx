import { useParams } from 'react-router-dom';
import type { Category as CategoryType } from '@/types';
import { useNews } from '@/hooks/useNews';
import { useBookmarks } from '@/hooks/useBookmarks';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';
import { FeedLoader } from '@/components/Loader';
import { RefreshCw } from 'lucide-react';
import { useEffect, useRef, useCallback } from 'react';

const categoryTitles: Record<string, string> = {
  india: 'India',
  world: 'World News',
  business: 'Business & Finance',
  technology: 'Technology',
  sports: 'Sports',
  entertainment: 'Entertainment',
  health: 'Health & Wellness',
  science: 'Science',
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = (slug || 'top') as CategoryType;
  const { articles, loading, hasMore, loadMore } = useNews(category);
  const { add, remove, isBookmarked } = useBookmarks();
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) loadMore();
    },
    [hasMore, loading, loadMore]
  );

  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [handleObserver]);

  const toggleBookmark = (article: typeof articles[0]) => {
    isBookmarked(article.id) ? remove(article.id) : add(article);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-display font-extrabold text-2xl text-slate-800 mb-1">
        {categoryTitles[category] || category}
      </h1>
      <p className="text-sm text-slate-400 mb-6">Latest stories and updates</p>

      {loading && articles.length === 0 ? (
        <FeedLoader />
      ) : (
        <div className="space-y-4">
          {articles.length > 0 && (
            <NewsCard
              article={articles[0]}
              variant="featured"
              isBookmarked={isBookmarked(articles[0].id)}
              onBookmark={() => toggleBookmark(articles[0])}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.slice(1).map((article, i) => (
              <div key={article.id}>
                <NewsCard
                  article={article}
                  isBookmarked={isBookmarked(article.id)}
                  onBookmark={() => toggleBookmark(article)}
                />
                {i === 3 && <AdBanner slot={`cat-${category}`} format="banner" className="mt-4" />}
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-6">
              <RefreshCw size={18} className="animate-spin text-brand-400" />
            </div>
          )}
          <div ref={observerRef} className="h-4" />
        </div>
      )}
    </div>
  );
}
