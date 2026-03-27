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

const categoryMap: Record<string, string> = {
  top: 'general',
  trending: 'general',
  india: 'general',
  world: 'general',
  business: 'business',
  technology: 'technology',
  sports: 'sports',
  entertainment: 'entertainment',
  health: 'health',
  science: 'science',
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
    // Cache miss or error, continue to API
  }

  // Fetch from NewsAPI
  const apiCategory = categoryMap[category] || 'general';
  const country = category === 'india' ? '&country=in' : category === 'world' ? '' : '&country=in';
  const endpoint = category === 'world'
    ? `https://newsapi.org/v2/top-headlines?language=en&page=${page}&pageSize=${pageSize}&category=${apiCategory}`
    : `https://newsapi.org/v2/top-headlines?${country}&page=${page}&pageSize=${pageSize}&category=${apiCategory}`;

  try {
    const apiResponse = await fetch(endpoint, {
      headers: { 'X-Api-Key': context.env.NEWS_API_KEY || '' },
    });

    if (!apiResponse.ok) {
      // Return demo data if API fails
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

    // Cache the result
    try {
      await context.env.NEWS_CACHE.put(cacheKey, JSON.stringify(result), {
        expirationTtl: cacheTtl,
      });
    } catch {
      // Caching failed, not critical
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
  const demoArticles = [
    {
      id: 'demo1',
      title: 'Breaking: Major Tech Company Announces Revolutionary AI Platform',
      description: 'The new platform promises to transform how businesses operate with advanced AI capabilities that integrate seamlessly with existing workflows.',
      content: 'In a groundbreaking announcement today, a major technology company unveiled its latest AI platform that experts say could revolutionize the industry. The platform features advanced natural language processing, computer vision, and predictive analytics capabilities.\n\nIndustry analysts have praised the move, noting that it could set a new standard for enterprise AI solutions. The platform is expected to be available to developers starting next quarter.\n\n"This represents a significant leap forward in making AI accessible to businesses of all sizes," said the company\'s CEO during the keynote presentation.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      source: 'TechDaily',
      author: 'Sarah Johnson',
      category,
      publishedAt: new Date(Date.now() - 1800000).toISOString(),
      isBreaking: true,
      readTime: 3,
    },
    {
      id: 'demo2',
      title: 'Stock Markets Rally as Economic Indicators Show Strong Growth',
      description: 'Major indices hit record highs following positive GDP data and strong corporate earnings reports.',
      content: 'Stock markets around the world surged to record highs today as new economic data painted an optimistic picture of global growth. The rally was driven by stronger-than-expected GDP numbers and impressive corporate earnings.\n\nInvestors responded positively to the news, with the benchmark index gaining over 2% in a single session. Technology and financial sectors led the gains.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      source: 'FinanceWatch',
      author: 'Michael Chen',
      category,
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      isBreaking: false,
      readTime: 4,
    },
    {
      id: 'demo3',
      title: 'India Launches Ambitious Green Energy Initiative Worth $50 Billion',
      description: 'The government unveils a comprehensive plan to accelerate the transition to renewable energy sources.',
      content: 'India has announced a massive $50 billion green energy initiative aimed at transforming the country\'s energy landscape. The plan includes investments in solar, wind, and hydrogen energy, along with a nationwide EV charging network.\n\nThe initiative is expected to create millions of jobs and significantly reduce carbon emissions over the next decade.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
      source: 'India Today',
      author: 'Priya Sharma',
      category,
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      isBreaking: false,
      readTime: 5,
    },
    {
      id: 'demo4',
      title: 'Cricket: India Wins Thrilling Test Match in Final Over',
      description: 'A stunning last-over victory secures the series for India as fans celebrate across the nation.',
      content: 'In one of the most exciting finishes in Test cricket history, India clinched a dramatic victory in the final over of the match. The win secured the series for India and sent fans into a frenzy of celebration.\n\nThe match hero scored a brilliant century under pressure, guiding the team to an improbable chase.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
      source: 'CricketBuzz',
      author: 'Raj Patel',
      category,
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      isBreaking: false,
      readTime: 3,
    },
    {
      id: 'demo5',
      title: 'Scientists Discover New Method to Capture Carbon Dioxide from Atmosphere',
      description: 'Breakthrough research could provide a cost-effective solution to reduce greenhouse gases.',
      content: 'A team of international scientists has developed a revolutionary method for capturing carbon dioxide directly from the atmosphere. The new technique is reportedly 10 times more efficient than existing methods and could be scaled up for industrial use.\n\nThe research, published in a leading scientific journal, has been hailed as a potential game-changer in the fight against climate change.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80',
      source: 'ScienceDaily',
      author: 'Dr. Emily Watson',
      category,
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      isBreaking: false,
      readTime: 6,
    },
    {
      id: 'demo6',
      title: 'New Smartphone Launch Breaks Pre-Order Records Worldwide',
      description: 'The latest flagship device features groundbreaking camera technology and all-day battery life.',
      content: 'The latest smartphone from a leading manufacturer has shattered pre-order records within just 24 hours of going live. The device features a revolutionary camera system with AI-enhanced photography.\n\nTech reviewers have praised the device for its exceptional build quality and performance.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      source: 'GadgetPro',
      author: 'Alex Rivera',
      category,
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      isBreaking: false,
      readTime: 3,
    },
    {
      id: 'demo7',
      title: 'Bollywood Blockbuster Crosses 500 Crore Mark in Just Two Weeks',
      description: 'The action thriller becomes the fastest Indian film to reach the milestone at the domestic box office.',
      content: 'The latest Bollywood action thriller has crossed the massive 500 crore mark at the domestic box office in just two weeks of release. The film has been praised for its stunning visuals and gripping storyline.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      source: 'BollywoodLife',
      author: 'Neha Kapoor',
      category,
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      isBreaking: false,
      readTime: 2,
    },
    {
      id: 'demo8',
      title: 'Government Announces New Healthcare Scheme Covering 100 Million Families',
      description: 'The expanded coverage will provide free treatment for critical illnesses at empaneled hospitals.',
      content: 'The government today announced a significant expansion of its flagship healthcare scheme, extending coverage to 100 million families across the country. The scheme will cover treatment costs for over 1,500 medical procedures.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
      source: 'HealthLine India',
      author: 'Dr. Amit Kumar',
      category,
      publishedAt: new Date(Date.now() - 25200000).toISOString(),
      isBreaking: false,
      readTime: 4,
    },
    {
      id: 'demo9',
      title: 'Electric Vehicle Sales in India Surge 60% Year-Over-Year',
      description: 'Growing infrastructure and government incentives drive unprecedented adoption of electric vehicles.',
      content: 'Electric vehicle sales in India have surged by 60% compared to last year, driven by expanding charging infrastructure and attractive government subsidies. Both two-wheeler and four-wheeler EV segments showed strong growth.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
      source: 'AutoCar India',
      author: 'Vikram Singh',
      category,
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      isBreaking: false,
      readTime: 3,
    },
    {
      id: 'demo10',
      title: 'Space Agency Successfully Tests Next-Generation Rocket Engine',
      description: 'The new engine will power future missions to the Moon and Mars with improved efficiency.',
      content: 'India\'s space agency has successfully tested a next-generation rocket engine that will be used for upcoming deep space missions. The engine demonstrated 30% more thrust while consuming less fuel than its predecessor.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80',
      source: 'Space Today',
      author: 'Dr. Kavita Rao',
      category,
      publishedAt: new Date(Date.now() - 32400000).toISOString(),
      isBreaking: false,
      readTime: 5,
    },
  ];

  return {
    articles: demoArticles,
    totalResults: demoArticles.length,
    page,
    hasMore: page < 2,
  };
}
