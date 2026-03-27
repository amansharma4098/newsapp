interface Env {
  DB: D1Database;
  NEWS_CACHE: KVNamespace;
  NEWS_API_KEY: string;
  CACHE_TTL: string;
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

// Global news — no country restriction by default
const categoryMap: Record<string, { apiCategory: string; country?: string }> = {
  top: { apiCategory: 'general' },
  trending: { apiCategory: 'general' },
  india: { apiCategory: 'general', country: 'in' },
  world: { apiCategory: 'general' },
  business: { apiCategory: 'business' },
  technology: { apiCategory: 'technology' },
  sports: { apiCategory: 'sports' },
  entertainment: { apiCategory: 'entertainment' },
  health: { apiCategory: 'health' },
  science: { apiCategory: 'science' },
};

function generateId(title: string): string {
  return btoa(title).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
}

function estimateReadTime(content: string | null): number {
  if (!content) return 2;
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const category = url.searchParams.get('category') || 'top';
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = 20;
  const cacheTtl = parseInt(context.env.CACHE_TTL || '900');

  const cacheKey = `news:${category}:${page}`;

  // Try KV cache first
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

  // Fetch from NewsAPI — GLOBAL by default, India only for india category
  const config = categoryMap[category] || { apiCategory: 'general' };
  let endpoint: string;

  if (config.country) {
    // Country-specific (India)
    endpoint = `https://newsapi.org/v2/top-headlines?country=${config.country}&category=${config.apiCategory}&page=${page}&pageSize=${pageSize}`;
  } else {
    // Global news — use top-headlines with language=en for broader global coverage
    endpoint = `https://newsapi.org/v2/top-headlines?language=en&category=${config.apiCategory}&page=${page}&pageSize=${pageSize}`;
  }

  try {
    const apiResponse = await fetch(endpoint, {
      headers: { 'X-Api-Key': context.env.NEWS_API_KEY || '' },
    });

    if (!apiResponse.ok) {
      return jsonResponse(getDemoData(category, page));
    }

    const data = await apiResponse.json() as { articles: NewsApiArticle[]; totalResults: number };

    const articles = (data.articles || [])
      .filter((a: NewsApiArticle) => a.title && a.title !== '[Removed]')
      .map((a: NewsApiArticle, i: number) => ({
        id: generateId(a.title),
        title: a.title,
        description: a.description || a.title,
        content: a.content || a.description || '',
        url: a.url,
        imageUrl: a.urlToImage || '',
        source: a.source?.name || 'Unknown',
        author: a.author || '',
        category,
        publishedAt: a.publishedAt,
        isBreaking: i === 0 && page === 1,
        readTime: estimateReadTime(a.content),
      }));

    const result = {
      articles,
      totalResults: data.totalResults || articles.length,
      page,
      hasMore: articles.length === pageSize,
    };

    try {
      await context.env.NEWS_CACHE.put(cacheKey, JSON.stringify(result), {
        expirationTtl: cacheTtl,
      });
    } catch {
      // Non-critical
    }

    return jsonResponse(result);
  } catch {
    return jsonResponse(getDemoData(category, page));
  }
};

function jsonResponse(data: unknown) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function getDemoData(category: string, page: number) {
  const now = Date.now();
  const demoArticles = [
    {
      id: 'g1',
      title: 'UN Climate Summit Reaches Historic Agreement on Carbon Emissions',
      description: 'World leaders agree on binding targets to reduce carbon emissions by 50% before 2035, marking a turning point in global climate policy.',
      content: 'In a landmark decision at the UN Climate Summit, over 190 nations have agreed to binding carbon emission reduction targets. The agreement, which took two weeks of intense negotiations, commits countries to reducing emissions by 50% from 2020 levels by 2035.\n\nThe deal includes a $200 billion annual climate finance fund for developing nations and a new mechanism for monitoring compliance. Environmental groups have cautiously welcomed the agreement while noting the challenges of implementation.\n\n"This is a historic moment for our planet," said the UN Secretary-General. "But the real work begins now with implementation."',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
      source: 'Reuters',
      author: 'James Mitchell',
      category,
      publishedAt: new Date(now - 1200000).toISOString(),
      isBreaking: true,
      readTime: 4,
    },
    {
      id: 'g2',
      title: 'Wall Street Hits Record High as Tech Giants Report Strong Earnings',
      description: 'Major US indices surge past previous records driven by exceptional quarterly results from leading technology companies.',
      content: 'Wall Street reached new all-time highs today as major tech companies reported earnings that exceeded analyst expectations. The S&P 500 gained 2.3%, while the Nasdaq rose 3.1%.\n\nThe rally was led by strong performances across the semiconductor and AI sectors, with several companies reporting revenue growth above 40% year-over-year.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      source: 'Bloomberg',
      author: 'Sarah Chen',
      category,
      publishedAt: new Date(now - 3600000).toISOString(),
      isBreaking: false,
      readTime: 3,
    },
    {
      id: 'g3',
      title: 'India Launches $50 Billion Green Energy Initiative, Targets 500GW Renewable Capacity',
      description: 'Indian government unveils ambitious plan to transform the country into a global clean energy leader by 2030.',
      content: 'India has announced a massive green energy initiative worth $50 billion, aiming to achieve 500 gigawatts of renewable energy capacity by 2030. The plan includes investments in solar, wind, green hydrogen, and battery storage.\n\nThe initiative is expected to create over 10 million new jobs and reduce India\'s carbon footprint by 35%. International investors have shown strong interest in participating.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
      source: 'The Hindu',
      author: 'Priya Sharma',
      category,
      publishedAt: new Date(now - 5400000).toISOString(),
      isBreaking: false,
      readTime: 5,
    },
    {
      id: 'g4',
      title: 'Champions League: Stunning Upset as Underdogs Reach Semi-Finals',
      description: 'In one of the biggest shocks in Champions League history, a dramatic last-minute goal sends the underdog team through.',
      content: 'Football fans witnessed one of the greatest Champions League upsets as a dramatic injury-time goal sealed a remarkable comeback victory. The underdog side, playing in Europe\'s elite competition for only the second time, defeated the defending champions 3-2 on aggregate.\n\nThe atmosphere at the stadium was electric as 60,000 fans celebrated the historic achievement.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      source: 'BBC Sport',
      author: 'Mark Williams',
      category,
      publishedAt: new Date(now - 7200000).toISOString(),
      isBreaking: false,
      readTime: 3,
    },
    {
      id: 'g5',
      title: 'Scientists Achieve Major Breakthrough in Quantum Computing',
      description: 'New quantum processor solves complex problems millions of times faster than traditional supercomputers.',
      content: 'A team of researchers has achieved a significant milestone in quantum computing, demonstrating a processor that can solve certain complex problems millions of times faster than the world\'s most powerful classical supercomputers.\n\nThe breakthrough could have profound implications for drug discovery, materials science, cryptography, and artificial intelligence.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
      source: 'Nature',
      author: 'Dr. Emily Zhang',
      category,
      publishedAt: new Date(now - 10800000).toISOString(),
      isBreaking: false,
      readTime: 6,
    },
    {
      id: 'g6',
      title: 'European Central Bank Signals Rate Cut Amid Slowing Inflation',
      description: 'ECB hints at upcoming interest rate reduction as eurozone inflation drops to lowest level in two years.',
      content: 'The European Central Bank has signaled a potential interest rate cut at its next meeting, as inflation across the eurozone has fallen to its lowest level in two years. Markets responded positively to the announcement.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
      source: 'Financial Times',
      author: 'Hans Mueller',
      category,
      publishedAt: new Date(now - 14400000).toISOString(),
      isBreaking: false,
      readTime: 4,
    },
    {
      id: 'g7',
      title: 'SpaceX Successfully Launches Largest Satellite Constellation Mission',
      description: '60 next-generation satellites deployed in a single launch, expanding global internet coverage.',
      content: 'SpaceX has successfully deployed 60 next-generation internet satellites in a single launch, bringing the total constellation to over 6,000 satellites. The mission aims to provide high-speed internet to underserved regions worldwide.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80',
      source: 'Space.com',
      author: 'Alex Rivera',
      category,
      publishedAt: new Date(now - 18000000).toISOString(),
      isBreaking: false,
      readTime: 3,
    },
    {
      id: 'g8',
      title: 'WHO Declares New Treatment as Game-Changer for Malaria Prevention',
      description: 'A breakthrough vaccine achieves 80% efficacy in large-scale trials across sub-Saharan Africa.',
      content: 'The World Health Organization has endorsed a new malaria treatment that showed 80% efficacy in preventing the disease during large-scale clinical trials. The treatment could save hundreds of thousands of lives annually in malaria-endemic regions.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
      source: 'WHO',
      author: 'Dr. Amara Osei',
      category,
      publishedAt: new Date(now - 21600000).toISOString(),
      isBreaking: false,
      readTime: 5,
    },
    {
      id: 'g9',
      title: 'Japan\'s New Bullet Train Breaks Speed Record at 603 km/h',
      description: 'The next-generation maglev train completes its first test run, setting a new world speed record.',
      content: 'Japan\'s next-generation magnetic levitation bullet train has set a new world speed record during its inaugural test run, reaching 603 km/h. The train is expected to begin commercial service connecting Tokyo to Osaka in under an hour.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      source: 'Nikkei Asia',
      author: 'Yuki Tanaka',
      category,
      publishedAt: new Date(now - 25200000).toISOString(),
      isBreaking: false,
      readTime: 3,
    },
    {
      id: 'g10',
      title: 'Oscar-Winning Director Announces Epic New Film Starring Global Cast',
      description: 'The highly anticipated production brings together stars from Hollywood, Bollywood, and Korean cinema.',
      content: 'An Oscar-winning director has announced a new epic film featuring an unprecedented international cast spanning Hollywood, Bollywood, and Korean cinema. The film is expected to be the most expensive production in history with a budget exceeding $400 million.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      source: 'Variety',
      author: 'Lisa Park',
      category,
      publishedAt: new Date(now - 28800000).toISOString(),
      isBreaking: false,
      readTime: 2,
    },
  ];

  return {
    articles: demoArticles,
    totalResults: demoArticles.length,
    page,
    hasMore: page < 2,
  };
}
