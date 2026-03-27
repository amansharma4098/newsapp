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
    <>
      <CategoryTabs active={category} onChange={setCategory} />
      {articles.length > 0 && <BreakingNews articles={articles} />}

      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <WifiOff size={44} className="text-brand-200 mb-3" />
            <p className="text-slate-600 font-semibold mb-1">Unable to load news</p>
            <p className="text-sm text-slate-400 mb-5">{error}</p>
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors shadow-sm shadow-brand-500/20"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && articles.length === 0 && <FeedLoader />}

        {/* Feed */}
        {articles.length > 0 && (
          <div className="space-y-5">
            {/* Featured */}
            <NewsCard
              article={articles[0]}
              variant="featured"
              isBookmarked={isBookmarked(articles[0].id)}
              onBookmark={() => toggleBookmark(articles[0])}
            />

            <AdBanner slot="home-top" format="leaderboard" />

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.slice(1, 7).map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  isBookmarked={isBookmarked(article.id)}
                  onBookmark={() => toggleBookmark(article)}
                />
              ))}
            </div>

            {/* Mid Ad */}
            {articles.length > 7 && (
              <AdBanner slot="home-mid" format="rectangle" className="max-w-lg mx-auto" />
            )}

            {/* More Stories */}
            {articles.length > 7 && (
              <div className="bg-white rounded-2xl border border-brand-100/60 p-5">
                <h2 className="font-display font-bold text-lg text-slate-800 mb-1">More Stories</h2>
                <p className="text-xs text-slate-400 mb-3">Latest from around the world</p>
                {articles.slice(7).map((article, i) => (
                  <div key={article.id}>
                    <NewsCard
                      article={article}
                      variant="compact"
                      isBookmarked={isBookmarked(article.id)}
                      onBookmark={() => toggleBookmark(article)}
                    />
                    {(i + 1) % 5 === 0 && i < articles.length - 8 && (
                      <AdBanner slot={`inline-${i}`} format="banner" className="my-3" />
                    )}
                  </div>
                ))}
              </div>
            )}

            <AdBanner slot="home-bottom" format="leaderboard" />

            {loading && articles.length > 0 && (
              <div className="flex justify-center py-6">
                <RefreshCw size={18} className="animate-spin text-brand-400" />
              </div>
            )}

            <div ref={observerRef} className="h-4" />
          </div>
        )}
      </div>
    </>
  );
}
