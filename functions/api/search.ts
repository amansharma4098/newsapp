interface Env {
  NEWS_CACHE: KVNamespace;
  NEWS_API_KEY: string;
}

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
  return btoa(title).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const query = url.searchParams.get('q') || '';

  if (!query || query.length < 2) {
    return new Response(
      JSON.stringify({ articles: [], totalResults: 0, page: 1, hasMore: false }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  const cacheKey = `search:${query.toLowerCase().trim()}`;

  // Check cache
  try {
    const cached = await context.env.NEWS_CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    // Cache miss
  }

  // Search via NewsAPI
  try {
    const apiResponse = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20`,
      { headers: { 'X-Api-Key': context.env.NEWS_API_KEY || '' } }
    );

    if (!apiResponse.ok) {
      return jsonResponse(getDemoSearchResults(query));
    }

    const data = await apiResponse.json() as { articles: NewsApiArticle[]; totalResults: number };

    const articles = (data.articles || [])
      .filter((a: NewsApiArticle) => a.title && a.title !== '[Removed]')
      .map((a: NewsApiArticle) => ({
        id: generateId(a.title),
        title: a.title,
        description: a.description || '',
        content: a.content || '',
        url: a.url,
        imageUrl: a.urlToImage || '',
        source: a.source?.name || 'Unknown',
        author: a.author || '',
        category: 'top',
        publishedAt: a.publishedAt,
        isBreaking: false,
        readTime: Math.max(1, Math.ceil((a.content?.split(/\s+/).length || 0) / 200)),
      }));

    const result = {
      articles,
      totalResults: data.totalResults,
      page: 1,
      hasMore: false,
    };

    // Cache search results for 10 minutes
    try {
      await context.env.NEWS_CACHE.put(cacheKey, JSON.stringify(result), {
        expirationTtl: 600,
      });
    } catch {
      // Non-critical
    }

    return jsonResponse(result);
  } catch {
    return jsonResponse(getDemoSearchResults(query));
  }
};

function jsonResponse(data: unknown) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function getDemoSearchResults(query: string) {
  return {
    articles: [
      {
        id: 'search1',
        title: `Latest updates on "${query}" — Everything you need to know`,
        description: `Comprehensive coverage of ${query} with the latest developments, expert analysis, and what it means for you.`,
        content: `Here is the latest coverage on ${query}. Our team of journalists has been tracking this story closely.`,
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=800&q=80',
        source: 'NewsFlash',
        author: 'Editorial Team',
        category: 'top',
        publishedAt: new Date().toISOString(),
        isBreaking: false,
        readTime: 3,
      },
      {
        id: 'search2',
        title: `Expert Analysis: How "${query}" is shaping the future`,
        description: `Industry experts weigh in on the implications of ${query} and what to expect in the coming months.`,
        content: `Experts have been analyzing the impact of ${query} on various sectors.`,
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        source: 'NewsFlash',
        author: 'Research Desk',
        category: 'top',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        isBreaking: false,
        readTime: 5,
      },
    ],
    totalResults: 2,
    page: 1,
    hasMore: false,
  };
}
