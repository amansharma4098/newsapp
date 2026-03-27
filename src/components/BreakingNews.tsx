import { Radio } from 'lucide-react';
import type { Article } from '@/types';
import { Link } from 'react-router-dom';
import { timeAgo } from '@/utils/timeAgo';

interface Props {
  articles: Article[];
}

export default function BreakingNews({ articles }: Props) {
  const breaking = articles.filter((a) => a.isBreaking).slice(0, 5);
  if (breaking.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-900 dark:to-red-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            <Radio size={16} className="text-white animate-pulse" />
            <span className="text-xs font-extrabold text-white uppercase tracking-widest">Breaking</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Link
              to={`/article/${breaking[0].id}`}
              className="text-sm font-semibold text-white hover:text-white/90 transition-colors"
            >
              {breaking[0].title}
              <span className="text-white/60 text-xs ml-2">{timeAgo(breaking[0].publishedAt)}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
