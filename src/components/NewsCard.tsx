import { Bookmark, BookmarkCheck, Share2, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article } from '@/types';
import { timeAgo } from '@/utils/timeAgo';

interface Props {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
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

  if (variant === 'featured') {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <article className="relative rounded-2xl overflow-hidden h-72 sm:h-80 md:h-96 animate-fade-in">
          <img
            src={article.imageUrl || '/placeholder.svg'}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            {article.isBreaking && (
              <span className="breaking-badge mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                BREAKING
              </span>
            )}
            <h2 className="text-white font-display font-bold text-lg sm:text-xl md:text-2xl leading-tight mb-2 line-clamp-3">
              {article.title}
            </h2>
            <div className="flex items-center gap-3 text-white/70 text-xs sm:text-sm">
              <span className="font-medium text-white/90">{article.source}</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {timeAgo(article.publishedAt)}
              </span>
              {article.readTime && <span>{article.readTime} min read</span>}
            </div>
          </div>
          {/* Actions overlay */}
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleBookmark}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
            >
              {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
            >
              <Share2 size={16} />
            </button>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <article className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 animate-fade-in">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                {article.source}
              </span>
              {article.isBreaking && <span className="breaking-badge text-[10px]">LIVE</span>}
            </div>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {article.title}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <Clock size={10} />
              {timeAgo(article.publishedAt)}
            </span>
          </div>
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt=""
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              loading="lazy"
            />
          )}
        </article>
      </Link>
    );
  }

  // Default card
  return (
    <Link to={`/article/${article.id}`} className="block group">
      <article className="glass-card overflow-hidden animate-slide-up">
        {article.imageUrl && (
          <div className="relative overflow-hidden aspect-video">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {article.isBreaking && (
              <span className="absolute top-3 left-3 breaking-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                BREAKING
              </span>
            )}
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleBookmark}
                className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
              >
                {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              {article.source}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {article.category}
            </span>
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg leading-snug mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
            {article.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {timeAgo(article.publishedAt)}
              </span>
              {article.readTime && <span>{article.readTime} min read</span>}
            </div>
            <ExternalLink size={14} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </div>
      </article>
    </Link>
  );
}
