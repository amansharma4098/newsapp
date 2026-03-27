import { Bookmark, Trash2 } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import NewsCard from '@/components/NewsCard';

export default function BookmarksPage() {
  const { bookmarks, remove, isBookmarked } = useBookmarks();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl">Saved Articles</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {bookmarks.length} article{bookmarks.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Bookmark size={28} className="text-slate-400" />
          </div>
          <p className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-1">
            No saved articles yet
          </p>
          <p className="text-sm text-slate-400 max-w-xs">
            Tap the bookmark icon on any article to save it here for later reading
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((article) => (
            <div key={article.id} className="relative group">
              <NewsCard
                article={article}
                variant="compact"
                isBookmarked={isBookmarked(article.id)}
                onBookmark={() => remove(article.id)}
              />
              <button
                onClick={() => remove(article.id)}
                className="absolute right-0 top-3 p-2 rounded-lg text-slate-400 hover:text-red-500
                           hover:bg-red-50 dark:hover:bg-red-900/20 transition-all
                           opacity-0 group-hover:opacity-100"
                title="Remove bookmark"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
