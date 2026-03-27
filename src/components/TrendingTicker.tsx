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
        setTopics([
          { id: '1', title: 'Climate Summit 2026', articleCount: 120, category: 'world' },
          { id: '2', title: 'Global Markets', articleCount: 95, category: 'business' },
          { id: '3', title: 'AI Breakthrough', articleCount: 80, category: 'technology' },
          { id: '4', title: 'Champions League', articleCount: 70, category: 'sports' },
          { id: '5', title: 'India Budget 2026', articleCount: 55, category: 'india' },
          { id: '6', title: 'SpaceX Mission', articleCount: 48, category: 'science' },
        ]);
      });
  }, []);

  if (topics.length === 0) return null;

  return (
    <div className="bg-brand-500 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-600 flex-shrink-0">
          <TrendingUp size={13} />
          <span className="text-[11px] font-bold uppercase tracking-widest">Trending</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-8 animate-ticker whitespace-nowrap py-1.5 px-4">
            {[...topics, ...topics].map((topic, i) => (
              <span key={`${topic.id}-${i}`} className="text-sm text-white/90 hover:text-white cursor-pointer transition-colors">
                {topic.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
