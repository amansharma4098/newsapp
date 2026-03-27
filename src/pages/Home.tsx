import { useState, useEffect, useRef, useCallback } from 'react';
import type { Category } from '@/types';
import { useNews } from '@/hooks/useNews';
import { useBookmarks } from '@/hooks/useBookmarks';
import CategoryTabs from '@/components/CategoryTabs';
import NewsCard from '@/components/NewsCard';
import BreakingNews from '@/components/BreakingNews';
import AdBanner from '@/components/AdBanner';
import { FeedLoader } from '@/components/Loader';
import { RefreshCw, WifiOff } from 'lucide-react';

export default function Home() {
  const [category, setCategory] = useState<Category>('top');
  const { articles, loading, error, hasMore, loadMore, refresh } = useNews(category);
  const { add, remove, isBookmarked } = useBookmarks();
  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
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

  return (
    <>
      <CategoryTabs active={category} onChange={setCategory} />

      {/* Breaking News Banner */}
      {articles.length > 0 && <BreakingNews articles={articles} />}

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <WifiOff size={48} className="text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-slate-500 font-medium mb-1">Unable to load news</p>
            <p className="text-sm text-slate-400 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && articles.length === 0 && <FeedLoader />}

        {/* News Feed */}
        {articles.length > 0 && (
          <div className="space-y-4">
            {/* Featured Article */}
            <NewsCard
              article={articles[0]}
              variant="featured"
              isBookmarked={isBookmarked(articles[0].id)}
              onBookmark={() =>
                isBookmarked(articles[0].id)
                  ? remove(articles[0].id)
                  : add(articles[0])
              }
            />

            {/* Ad after featured */}
            <AdBanner slot="home-top" format="leaderboard" />

            {/* Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.slice(1, 7).map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  isBookmarked={isBookmarked(article.id)}
                  onBookmark={() =>
                    isBookmarked(article.id) ? remove(article.id) : add(article)
                  }
                />
              ))}
            </div>

            {/* Mid-feed Ad */}
            {articles.length > 7 && (
              <AdBanner slot="home-mid" format="rectangle" className="max-w-lg mx-auto" />
            )}

            {/* Compact List */}
            {articles.length > 7 && (
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                <h2 className="font-display font-bold text-lg mb-2">More Stories</h2>
                {articles.slice(7).map((article, i) => (
                  <div key={article.id}>
                    <NewsCard
                      article={article}
                      variant="compact"
                      isBookmarked={isBookmarked(article.id)}
                      onBookmark={() =>
                        isBookmarked(article.id) ? remove(article.id) : add(article)
                      }
                    />
                    {/* Ad every 5 compact items */}
                    {(i + 1) % 5 === 0 && i < articles.length - 8 && (
                      <AdBanner
                        slot={`home-inline-${i}`}
                        format="banner"
                        className="my-3"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Ad */}
            <AdBanner slot="home-bottom" format="leaderboard" />

            {/* Loading more indicator */}
            {loading && articles.length > 0 && (
              <div className="flex justify-center py-4">
                <RefreshCw size={20} className="animate-spin text-primary-500" />
              </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className="h-4" />
          </div>
        )}
      </div>
    </>
  );
}
