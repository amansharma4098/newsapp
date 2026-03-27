/**
 * News Fetcher Script
 *
 * Run this as a Cloudflare Cron Trigger or manually:
 *   npm run fetch-news
 *
 * This script fetches news from NewsAPI and stores in D1 database.
 * Set up as a Cloudflare Worker Cron to run every 15 minutes.
 *
 * For Cloudflare Worker Cron, create a separate worker:
 *
 * export default {
 *   async scheduled(event, env, ctx) {
 *     await fetchAndStoreNews(env);
 *   }
 * }
 */

const NEWS_API_BASE = 'https://newsapi.org/v2';

const CATEGORIES = [
  'general',
  'business',
  'technology',
  'sports',
  'entertainment',
  'health',
  'science',
];

interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

function generateId(title: string): string {
  // Simple hash-based ID
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

async function fetchCategory(apiKey: string, category: string): Promise<NewsApiArticle[]> {
  const url = `${NEWS_API_BASE}/top-headlines?country=in&category=${category}&pageSize=20`;

  const response = await fetch(url, {
    headers: { 'X-Api-Key': apiKey },
  });

  if (!response.ok) {
    console.error(`Failed to fetch ${category}: ${response.status}`);
    return [];
  }

  const data = (await response.json()) as { articles: NewsApiArticle[] };
  return data.articles || [];
}

// Main fetch function — call this from a Cloudflare Cron Worker
export async function fetchAndStoreNews(env: {
  DB: D1Database;
  NEWS_CACHE: KVNamespace;
  NEWS_API_KEY: string;
}) {
  console.log('Starting news fetch...');

  for (const category of CATEGORIES) {
    try {
      const articles = await fetchCategory(env.NEWS_API_KEY, category);
      const validArticles = articles.filter(
        (a) => a.title && a.title !== '[Removed]'
      );

      console.log(`Fetched ${validArticles.length} articles for ${category}`);

      // Insert into D1
      for (const article of validArticles) {
        const id = generateId(article.title);
        try {
          await env.DB.prepare(
            `INSERT OR REPLACE INTO articles
             (id, title, description, content, url, image_url, source, author, category, published_at, is_breaking, read_time)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
            .bind(
              id,
              article.title,
              article.description || '',
              article.content || '',
              article.url,
              article.urlToImage || '',
              article.source?.name || 'Unknown',
              article.author || '',
              category === 'general' ? 'top' : category,
              article.publishedAt,
              0,
              Math.max(1, Math.ceil((article.content?.split(/\s+/).length || 0) / 200))
            )
            .run();
        } catch (e) {
          console.error(`Failed to insert article: ${article.title}`, e);
        }
      }

      // Invalidate cache for this category
      try {
        await env.NEWS_CACHE.delete(`news:${category === 'general' ? 'top' : category}:1`);
      } catch {
        // Non-critical
      }
    } catch (e) {
      console.error(`Error fetching category ${category}:`, e);
    }
  }

  console.log('News fetch completed.');
}

// For local testing
console.log(`
=== NewsFlash News Fetcher ===

This script is designed to run as a Cloudflare Worker Cron Trigger.

To set up automatic fetching:

1. Create a Cron Worker (workers/cron-fetcher.ts):
   export default {
     async scheduled(event, env, ctx) {
       const { fetchAndStoreNews } = await import('../scripts/fetch-news');
       await fetchAndStoreNews(env);
     }
   }

2. Add to wrangler.toml:
   [triggers]
   crons = ["*/15 * * * *"]   # Every 15 minutes

3. Deploy:
   wrangler deploy workers/cron-fetcher.ts
`);
