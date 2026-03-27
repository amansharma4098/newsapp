import { Bookmark, Trash2 } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import NewsCard from '@/components/NewsCard';

export default function BookmarksPage() {
  const { bookmarks, remove, isBookmarked } = useBookmarks();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl text-slate-800">Saved Articles</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {bookmarks.length} article{bookmarks.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
            <Bookmark size={26} className="text-brand-300" />
          </div>
          <p className="text-lg font-semibold text-slate-500 mb-1">No saved articles</p>
          <p className="text-sm text-slate-400 max-w-xs">
            Tap the bookmark icon on any article to save it for later
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-100/60 p-5">
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
                className="absolute right-0 top-4 p-2 rounded-lg text-slate-300 hover:text-red-500
                           hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
