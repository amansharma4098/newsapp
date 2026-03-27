import { useState, useEffect } from 'react';
import {
  TrendingUp, Globe, Cpu, Trophy,
  Briefcase, Heart, Clapperboard, FlaskConical, MapPin, Newspaper
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TrendingTopic } from '@/types';
import { getTrending } from '@/utils/api';
import AdBanner from '@/components/AdBanner';

const categoryCards = [
  { key: 'world', label: 'World', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  { key: 'india', label: 'India', icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
  { key: 'technology', label: 'Technology', icon: Cpu, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100' },
  { key: 'business', label: 'Business', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { key: 'sports', label: 'Sports', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  { key: 'entertainment', label: 'Entertainment', icon: Clapperboard, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-100' },
  { key: 'health', label: 'Health', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
  { key: 'science', label: 'Science', icon: FlaskConical, color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100' },
];

export default function ExplorePage() {
  const [trending, setTrending] = useState<TrendingTopic[]>([]);

  useEffect(() => {
    getTrending()
      .then(setTrending)
      .catch(() =>
        setTrending([
          { id: '1', title: 'Climate Summit', articleCount: 120, category: 'world' },
          { id: '2', title: 'AI Regulation', articleCount: 95, category: 'technology' },
          { id: '3', title: 'Global Markets', articleCount: 80, category: 'business' },
          { id: '4', title: 'Champions League', articleCount: 70, category: 'sports' },
          { id: '5', title: 'India Elections', articleCount: 55, category: 'india' },
          { id: '6', title: 'SpaceX Launch', articleCount: 45, category: 'science' },
        ])
      );
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Categories */}
      <div>
        <h2 className="font-display font-extrabold text-xl text-slate-800 mb-4">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoryCards.map(({ key, label, icon: Icon, color, bg, border }) => (
            <Link
              key={key}
              to={`/category/${key}`}
              className={`${bg} border ${border} rounded-2xl p-4 flex flex-col items-center gap-2.5
                         hover:scale-[1.03] active:scale-[0.97] transition-transform`}
            >
              <Icon size={26} className={color} />
              <span className="text-sm font-semibold text-slate-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <AdBanner slot="explore-mid" format="leaderboard" />

      {/* Trending */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-brand-500" />
          <h2 className="font-display font-extrabold text-xl text-slate-800">Trending Now</h2>
        </div>
        <div className="space-y-2">
          {trending.map((topic, index) => (
            <div
              key={topic.id}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-white border border-brand-100/50
                         hover:border-brand-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <span className="text-2xl font-extrabold text-brand-200 w-8 text-center">
                {index + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-slate-700">{topic.title}</h3>
                <p className="text-xs text-slate-400 capitalize">{topic.category}</p>
              </div>
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                {topic.articleCount} stories
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
