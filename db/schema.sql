-- NewsFlash D1 Database Schema

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  source TEXT NOT NULL,
  author TEXT,
  category TEXT NOT NULL DEFAULT 'top',
  published_at TEXT NOT NULL,
  is_breaking INTEGER DEFAULT 0,
  read_time INTEGER DEFAULT 2,
  fetched_at TEXT DEFAULT (datetime('now')),
  UNIQUE(url)
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);

CREATE TABLE IF NOT EXISTS trending_topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  article_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Full-text search support
CREATE VIRTUAL TABLE IF NOT EXISTS articles_fts USING fts5(
  title,
  description,
  content,
  source,
  content='articles',
  content_rowid='rowid'
);

-- Trigger to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS articles_ai AFTER INSERT ON articles BEGIN
  INSERT INTO articles_fts(rowid, title, description, content, source)
  VALUES (new.rowid, new.title, new.description, new.content, new.source);
END;
