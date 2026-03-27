interface Env {
  NEWS_CACHE: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
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

  // Global trending topics
  const trending = [
    { id: '1', title: 'Climate Summit 2026', articleCount: 156, category: 'world' },
    { id: '2', title: 'AI Regulation', articleCount: 132, category: 'technology' },
    { id: '3', title: 'Global Markets Rally', articleCount: 98, category: 'business' },
    { id: '4', title: 'Champions League', articleCount: 87, category: 'sports' },
    { id: '5', title: 'India Green Energy', articleCount: 76, category: 'india' },
    { id: '6', title: 'SpaceX Launch', articleCount: 68, category: 'science' },
    { id: '7', title: 'WHO Health Alert', articleCount: 54, category: 'health' },
    { id: '8', title: 'Oscar Nominations', articleCount: 49, category: 'entertainment' },
  ];

  const json = JSON.stringify(trending);

  try {
    await context.env.NEWS_CACHE.put('trending', json, { expirationTtl: 900 });
  } catch {
    // Non-critical
  }

  return new Response(json, {
    headers: { 'Content-Type': 'application/json' },
  });
};
