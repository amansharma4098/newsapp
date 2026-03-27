import { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useNews';
import NewsCard from './NewsCard';
import { CompactSkeleton } from './Loader';

const trendingSearches = ['World News', 'Technology', 'Stock Market', 'Sports', 'Climate Change', 'Elections'];

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
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-white sticky top-0 z-50 border-b border-brand-100/60">
        <div className="max-w-3xl mx-auto flex items-center gap-2 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-brand-50"
          >
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search global news..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-brand-50 text-sm border border-brand-100
                         outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100
                         placeholder:text-slate-400 transition-all"
            />
            {input && (
              <button onClick={() => setInput('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        {input.length >= 2 ? (
          <div>
            {loading ? (
              <div className="space-y-1">
                {[...Array(5)].map((_, i) => <CompactSkeleton key={i} />)}
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="text-xs text-slate-400 mb-4 font-medium">{results.length} results for "{input}"</p>
                {results.map((article) => (
                  <NewsCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search size={40} className="mx-auto text-brand-200 mb-3" />
                <p className="text-slate-500 font-medium">No results for "{input}"</p>
                <p className="text-sm text-slate-400 mt-1">Try different keywords</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setInput(term)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium
                             bg-brand-50 text-brand-700 border border-brand-100
                             hover:bg-brand-100 hover:border-brand-200 transition-colors"
                >
                  <TrendingUp size={12} />
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
