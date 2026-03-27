import { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useNews';
import NewsCard from './NewsCard';
import { CompactSkeleton } from './Loader';

const recentSearches = ['IPL 2026', 'Budget', 'AI news', 'Stock market', 'Weather'];
const trendingSearches = ['Election results', 'Tech layoffs', 'Startup funding', 'Cricket'];

export default function SearchPage() {
  const [input, setInput] = useState('');
  const { results, loading, search } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.length >= 2) search(input);
    }, 400);
    return () => clearTimeout(timer);
  }, [input, search]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Search Header */}
      <div className="glass sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-3xl mx-auto flex items-center gap-2 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search news, topics, sources..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-100 dark:bg-slate-800
                         text-sm border-none outline-none focus:ring-2 focus:ring-primary-500/30
                         placeholder:text-slate-400"
            />
            {input && (
              <button
                onClick={() => { setInput(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Results */}
        {input.length >= 2 ? (
          <div>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <CompactSkeleton key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 mb-3">{results.length} results for "{input}"</p>
                {results.map((article) => (
                  <NewsCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-slate-500">No results found for "{input}"</p>
                <p className="text-sm text-slate-400 mt-1">Try different keywords</p>
              </div>
            )}
          </div>
        ) : (
          /* Suggestions */
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setInput(term)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                               bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300
                               hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                  >
                    <TrendingUp size={12} />
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Recent Searches
              </h3>
              <div className="space-y-1">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setInput(term)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-left
                               text-slate-600 dark:text-slate-400
                               hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Search size={14} className="text-slate-400" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
