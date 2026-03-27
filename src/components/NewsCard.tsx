import { Bookmark, BookmarkCheck, Share2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article } from '@/types';
import { timeAgo } from '@/utils/timeAgo';

interface Props {
  article: Article;
  variant?: 'default' | 'featured' | 'compact' | 'headline';
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export default function NewsCard({ article, variant = 'default', isBookmarked, onBookmark }: Props) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      await navigator.share({ title: article.title, url: article.url });
    } else {
      await navigator.clipboard.writeText(article.url);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.();
  };

  // Featured — large hero card
  if (variant === 'featured') {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <article className="relative rounded-2xl overflow-hidden h-64 sm:h-72 md:h-96 animate-fade-in shadow-sm">
          <img
            src={article.imageUrl || '/placeholder.svg'}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            {article.isBreaking && (
              <span className="badge-breaking mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                BREAKING
              </span>
            )}
            <h2 className="text-white font-display font-bold text-xl sm:text-2xl md:text-3xl leading-tight mb-3 line-clamp-3 drop-shadow-sm">
              {article.title}
            </h2>
            <p className="text-white/70 text-sm line-clamp-2 mb-3 max-w-2xl">
              {article.description}
            </p>
            <div className="flex items-center gap-3 text-white/60 text-xs">
              <span className="font-semibold text-white/80">{article.source}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {timeAgo(article.publishedAt)}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Headline — text-only prominent
  if (variant === 'headline') {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <article className="py-4 border-b border-slate-100 animate-fade-in">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">{article.source}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-400">{timeAgo(article.publishedAt)}</span>
            {article.isBreaking && <span className="badge-breaking text-[10px] py-0">LIVE</span>}
          </div>
          <h3 className="font-display font-bold text-base leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </article>
      </Link>
    );
  }

  // Compact — horizontal with thumbnail
  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <article className="flex gap-4 py-4 border-b border-slate-100/80 animate-fade-in">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
                {article.source}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-400">{timeAgo(article.publishedAt)}</span>
            </div>
            <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors mb-1.5">
              {article.title}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">{article.description}</p>
          </div>
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt=""
              className="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-brand-50"
              loading="lazy"
            />
          )}
        </article>
      </Link>
    );
  }

  // Default — vertical card
  return (
    <Link to={`/article/${article.id}`} className="block group">
      <article className="card overflow-hidden animate-slide-up">
        {article.imageUrl && (
          <div className="relative overflow-hidden aspect-[16/10]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {article.isBreaking && (
              <span className="absolute top-3 left-3 badge-breaking">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                BREAKING
              </span>
            )}
            {/* Hover actions */}
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleBookmark}
                className="p-1.5 rounded-full bg-white/90 text-slate-600 hover:text-brand-600 shadow-sm transition-colors"
              >
                {isBookmarked ? <BookmarkCheck size={14} className="text-brand-600" /> : <Bookmark size={14} />}
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full bg-white/90 text-slate-600 hover:text-brand-600 shadow-sm transition-colors"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
              {article.source}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-400 capitalize">{article.category}</span>
          </div>
          <h3 className="font-display font-bold text-[15px] sm:text-base leading-snug mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{article.description}</p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock size={12} />
            <span>{timeAgo(article.publishedAt)}</span>
            {article.readTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{article.readTime} min read</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
