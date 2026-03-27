import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Share2, Bookmark, BookmarkCheck,
  ExternalLink, ThumbsUp, MessageCircle
} from 'lucide-react';
import type { Article as ArticleType } from '@/types';
import { getArticle } from '@/utils/api';
import { formatDate, timeAgo } from '@/utils/timeAgo';
import { useBookmarks } from '@/hooks/useBookmarks';
import AdBanner from '@/components/AdBanner';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const { add, remove, isBookmarked } = useBookmarks();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getArticle(id)
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    if (!article) return;
    if (navigator.share) {
      await navigator.share({ title: article.title, url: article.url });
    } else {
      await navigator.clipboard.writeText(article.url);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="rounded-2xl h-64 skeleton" />
        <div className="space-y-3">
          <div className="h-8 w-3/4 skeleton" />
          <div className="h-4 w-1/3 skeleton" />
          <div className="h-4 w-full skeleton" />
          <div className="h-4 w-full skeleton" />
          <div className="h-4 w-2/3 skeleton" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <p className="text-lg font-semibold text-slate-600 mb-2">Article not found</p>
        <button onClick={() => navigate('/')} className="text-brand-600 text-sm font-medium hover:underline">
          Back to home
        </button>
      </div>
    );
  }

  const bookmarked = isBookmarked(article.id);

  return (
    <article className="max-w-3xl mx-auto bg-white">
      {/* Hero */}
      {article.imageUrl && (
        <div className="relative aspect-video sm:aspect-[21/9] overflow-hidden">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2.5 rounded-full bg-white/90 text-slate-700 hover:bg-white shadow-sm transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => bookmarked ? remove(article.id) : add(article)}
              className="p-2.5 rounded-full bg-white/90 text-slate-700 hover:bg-white shadow-sm transition-colors"
            >
              {bookmarked ? <BookmarkCheck size={18} className="text-brand-600" /> : <Bookmark size={18} />}
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 text-slate-700 hover:bg-white shadow-sm transition-colors"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="px-5 sm:px-8 py-6">
        {/* Category */}
        <div className="flex items-center gap-2 mb-4">
          <span className="badge-category uppercase">{article.category}</span>
          {article.isBreaking && (
            <span className="badge-breaking">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              BREAKING
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight text-slate-900 mb-5">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-6 pb-6 border-b border-slate-100">
          <span className="font-semibold text-brand-600">{article.source}</span>
          {article.author && <span>by {article.author}</span>}
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {timeAgo(article.publishedAt)}
          </span>
          {article.readTime && <span>{article.readTime} min read</span>}
        </div>

        <AdBanner slot="article-top" format="leaderboard" className="mb-6" />

        {/* Content */}
        <div className="mb-8">
          <p className="text-lg font-medium text-slate-700 leading-relaxed mb-5">
            {article.description}
          </p>
          <div className="text-base leading-relaxed text-slate-600 whitespace-pre-line">
            {article.content}
          </div>
        </div>

        {/* Read full article */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-brand-500 text-white text-sm font-semibold
                     hover:bg-brand-600 transition-colors shadow-sm shadow-brand-500/20"
        >
          Read full article
          <ExternalLink size={14} />
        </a>

        <AdBanner slot="article-bottom" format="rectangle" className="my-8 max-w-md mx-auto" />

        {/* Actions */}
        <div className="flex items-center justify-between py-4 border-t border-slate-100">
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-600 transition-colors">
              <ThumbsUp size={16} />
              Helpful
            </button>
            <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-600 transition-colors">
              <MessageCircle size={16} />
              Comment
            </button>
          </div>
          <button onClick={handleShare} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-600 transition-colors">
            <Share2 size={16} />
            Share
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-4">{formatDate(article.publishedAt)}</p>
      </div>
    </article>
  );
}
