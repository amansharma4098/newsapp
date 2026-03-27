import { useState, useEffect } from 'react';
import {
  TrendingUp, Newspaper, Cpu, Trophy,
  Briefcase, Heart, Globe, Clapperboard, FlaskConical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Category, TrendingTopic } from '@/types';
import { getTrending } from '@/utils/api';
import AdBanner from '@/components/AdBanner';

const categoryCards: { key: Category; label: string; icon: typeof Newspaper; color: string; bg: string }[] = [
  { key: 'india', label: 'India', icon: Newspaper, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { key: 'world', label: 'World', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'technology', label: 'Technology', icon: Cpu, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  { key: 'business', label: 'Business', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { key: 'sports', label: 'Sports', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { key: 'entertainment', label: 'Entertainment', icon: Clapperboard, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { key: 'health', label: 'Health', icon: Heart, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  { key: 'science', label: 'Science', icon: FlaskConical, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
];

export default function ExplorePage() {
  const [trending, setTrending] = useState<TrendingTopic[]>([]);

  useEffect(() => {
    getTrending()
      .then(setTrending)
      .catch(() =>
        setTrending([
          { id: '1', title: 'IPL 2026', articleCount: 120, category: 'sports' },
          { id: '2', title: 'Union Budget', articleCount: 95, category: 'business' },
          { id: '3', title: 'AI Revolution', articleCount: 80, category: 'technology' },
          { id: '4', title: 'Election 2026', articleCount: 70, category: 'india' },
          { id: '5', title: 'Climate Change', articleCount: 55, category: 'world' },
          { id: '6', title: 'Startup Funding', articleCount: 45, category: 'business' },
        ])
      );
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Categories Grid */}
      <div>
        <h2 className="font-display font-extrabold text-xl mb-4">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoryCards.map(({ key, label, icon: Icon, color, bg }) => (
            <Link
              key={key}
              to={`/category/${key}`}
              className={`${bg} rounded-2xl p-4 flex flex-col items-center gap-2
                         hover:scale-[1.02] active:scale-[0.98] transition-transform`}
            >
              <Icon size={28} className={color} />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <AdBanner slot="explore-mid" format="leaderboard" />

      {/* Trending Topics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-primary-600" />
          <h2 className="font-display font-extrabold text-xl">Trending Topics</h2>
        </div>
        <div className="space-y-2">
          {trending.map((topic, index) => (
            <div
              key={topic.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-slate-800/50
                         border border-slate-100 dark:border-slate-700/50
                         hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span className="text-2xl font-extrabold text-slate-200 dark:text-slate-700 w-8 text-center">
                {index + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{topic.title}</h3>
                <p className="text-xs text-slate-500 capitalize">{topic.category}</p>
              </div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-full">
                {topic.articleCount} articles
              </span>
            </div>
          ))}
        </div>
      </div>

      <AdBanner slot="explore-bottom" format="rectangle" className="max-w-md mx-auto" />
    </div>
  );
}
