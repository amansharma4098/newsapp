// Cloudflare Pages Function middleware — runs before all /api/* handlers
export const onRequest: PagesFunction<Env> = async (context) => {
  // CORS headers
  const response = await context.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Cache-Control', 'public, max-age=300');
  return response;
};

interface Env {
  DB: D1Database;
  NEWS_CACHE: KVNamespace;
  NEWS_API_KEY: string;
  ENVIRONMENT: string;
  CACHE_TTL: string;
}
