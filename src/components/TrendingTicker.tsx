import { TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { TrendingTopic } from '@/types';
import { getTrending } from '@/utils/api';

export default function TrendingTicker() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);

  useEffect(() => {
    getTrending()
      .then(setTopics)
      .catch(() => {
        // Fallback trending topics
        setTopics([
          { id: '1', title: 'IPL 2026 Auction', articleCount: 120, category: 'sports' },
          { id: '2', title: 'Union Budget 2026', articleCount: 95, category: 'business' },
          { id: '3', title: 'AI Revolution', articleCount: 80, category: 'technology' },
          { id: '4', title: 'Stock Market Rally', articleCount: 70, category: 'business' },
          { id: '5', title: 'Climate Summit', articleCount: 55, category: 'world' },
        ]);
      });
  }, []);

  if (topics.length === 0) return null;

  return (
    <div className="bg-primary-600 dark:bg-primary-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-700 dark:bg-primary-950 flex-shrink-0">
          <TrendingUp size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Trending</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-6 animate-slide-left whitespace-nowrap py-1.5 px-4">
            {[...topics, ...topics].map((topic, i) => (
              <span key={`${topic.id}-${i}`} className="text-sm font-medium text-white/90 hover:text-white cursor-pointer">
                #{topic.title}
                <span className="text-white/50 text-xs ml-1">({topic.articleCount})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
