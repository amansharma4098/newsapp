import { Radio } from 'lucide-react';
import type { Article } from '@/types';
import { Link } from 'react-router-dom';
import { timeAgo } from '@/utils/timeAgo';

interface Props {
  articles: Article[];
}

export default function BreakingNews({ articles }: Props) {
  const breaking = articles.filter((a) => a.isBreaking).slice(0, 3);
  if (breaking.length === 0) return null;

  return (
    <div className="bg-red-50 border-b border-red-100">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Radio size={14} className="text-red-500 animate-pulse" />
            <span className="text-[11px] font-extrabold text-red-600 uppercase tracking-widest">Breaking</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Link
              to={`/article/${breaking[0].id}`}
              className="text-sm font-medium text-red-800 hover:text-red-600 transition-colors"
            >
              {breaking[0].title}
              <span className="text-red-400 text-xs ml-2">{timeAgo(breaking[0].publishedAt)}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
