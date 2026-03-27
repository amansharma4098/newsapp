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
import { FeaturedSkeleton } from '@/components/Loader';

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
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <FeaturedSkeleton />
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
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Article not found
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 text-sm font-medium hover:underline"
        >
          Back to home
        </button>
      </div>
    );
  }

  const bookmarked = isBookmarked(article.id);

  return (
    <article className="max-w-3xl mx-auto">
      {/* Hero Image */}
      {article.imageUrl && (
        <div className="relative aspect-video md:aspect-[21/9] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => bookmarked ? remove(article.id) : add(article)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
            >
              {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-5">
        {/* Category & Source */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 uppercase">
            {article.category}
          </span>
          {article.isBreaking && (
            <span className="breaking-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              BREAKING
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{article.source}</span>
          {article.author && <span>by {article.author}</span>}
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {timeAgo(article.publishedAt)}
          </span>
          {article.readTime && <span>{article.readTime} min read</span>}
        </div>

        {/* Ad before content */}
        <AdBanner slot="article-top" format="leaderboard" className="mb-6" />

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {article.description}
          </p>
          <div
            className="text-base leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line"
          >
            {article.content}
          </div>
        </div>

        {/* Read full article */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-primary-600 text-white text-sm font-semibold
                     hover:bg-primary-700 transition-colors mb-6"
        >
          Read full article on {article.source}
          <ExternalLink size={14} />
        </a>

        {/* Ad after content */}
        <AdBanner slot="article-bottom" format="rectangle" className="my-6 max-w-md mx-auto" />

        {/* Engagement bar */}
        <div className="flex items-center justify-between py-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors">
              <ThumbsUp size={18} />
              <span>Helpful</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors">
              <MessageCircle size={18} />
              <span>Comment</span>
            </button>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors"
          >
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>

        {/* Published date */}
        <p className="text-xs text-slate-400 mt-4">
          Published: {formatDate(article.publishedAt)}
        </p>
      </div>
    </article>
  );
}
