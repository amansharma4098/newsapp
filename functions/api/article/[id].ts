interface Env {
  DB: D1Database;
  NEWS_CACHE: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Article ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Try KV cache for the article
  try {
    const cached = await context.env.NEWS_CACHE.get(`article:${id}`);
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    // Cache miss
  }

  // Try D1 database
  try {
    const article = await context.env.DB.prepare(
      'SELECT * FROM articles WHERE id = ?'
    )
      .bind(id)
      .first();

    if (article) {
      const json = JSON.stringify(article);
      // Cache for next time
      try {
        await context.env.NEWS_CACHE.put(`article:${id}`, json, {
          expirationTtl: 3600,
        });
      } catch {
        // Non-critical
      }
      return new Response(json, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    // DB error, return demo article
  }

  // Return a demo article as fallback
  const demoArticle = {
    id,
    title: 'Breaking: Major Tech Company Announces Revolutionary AI Platform',
    description:
      'The new platform promises to transform how businesses operate with advanced AI capabilities.',
    content:
      'In a groundbreaking announcement today, a major technology company unveiled its latest AI platform that experts say could revolutionize the industry.\n\nThe platform features advanced natural language processing, computer vision, and predictive analytics capabilities that can be integrated into existing business workflows with minimal technical overhead.\n\nIndustry analysts have praised the move, noting that it could set a new standard for enterprise AI solutions. The platform is expected to be available to developers starting next quarter.\n\n"This represents a significant leap forward in making AI accessible to businesses of all sizes," said the company\'s CEO during the keynote presentation. "We believe every organization should have access to cutting-edge AI tools."\n\nThe announcement also included details about a new developer program that will provide free access to the platform\'s core features for startups and educational institutions.\n\nMarket reactions have been overwhelmingly positive, with the company\'s stock rising 5% in after-hours trading following the announcement.',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    source: 'TechDaily',
    author: 'Sarah Johnson',
    category: 'technology',
    publishedAt: new Date().toISOString(),
    isBreaking: false,
    readTime: 4,
  };

  return new Response(JSON.stringify(demoArticle), {
    headers: { 'Content-Type': 'application/json' },
  });
};
