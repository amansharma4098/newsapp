import type { Category } from '@/types';

const categories: { key: Category; label: string; emoji: string }[] = [
  { key: 'top', label: 'Top Stories', emoji: '🔥' },
  { key: 'trending', label: 'Trending', emoji: '📈' },
  { key: 'india', label: 'India', emoji: '🇮🇳' },
  { key: 'world', label: 'World', emoji: '🌍' },
  { key: 'business', label: 'Business', emoji: '💼' },
  { key: 'technology', label: 'Tech', emoji: '💻' },
  { key: 'sports', label: 'Sports', emoji: '🏏' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { key: 'health', label: 'Health', emoji: '🏥' },
  { key: 'science', label: 'Science', emoji: '🔬' },
];

interface Props {
  active: Category;
  onChange: (category: Category) => void;
}

export default function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="sticky top-14 z-40 glass border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto hide-scrollbar">
          {categories.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`category-chip ${
                active === key ? 'category-chip-active' : 'category-chip-inactive'
              }`}
            >
              <span className="mr-1">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
