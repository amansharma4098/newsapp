interface Env {
  NEWS_CACHE: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // Try cache first
  try {
    const cached = await context.env.NEWS_CACHE.get('trending');
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    // Cache miss
  }

  // Default trending topics (in production, these would be computed from article data)
  const trending = [
    { id: '1', title: 'IPL 2026 Auction', articleCount: 142, category: 'sports' },
    { id: '2', title: 'Union Budget 2026', articleCount: 98, category: 'business' },
    { id: '3', title: 'AI Revolution', articleCount: 87, category: 'technology' },
    { id: '4', title: 'Stock Market Rally', articleCount: 76, category: 'business' },
    { id: '5', title: 'Climate Summit 2026', articleCount: 63, category: 'world' },
    { id: '6', title: 'EV Market Boom', articleCount: 54, category: 'technology' },
    { id: '7', title: 'Startup Unicorns', articleCount: 48, category: 'business' },
    { id: '8', title: 'Space Mission', articleCount: 41, category: 'science' },
  ];

  const json = JSON.stringify(trending);

  // Cache for 15 minutes
  try {
    await context.env.NEWS_CACHE.put('trending', json, { expirationTtl: 900 });
  } catch {
    // Non-critical
  }

  return new Response(json, {
    headers: { 'Content-Type': 'application/json' },
  });
};
