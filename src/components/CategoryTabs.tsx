import type { Category } from '@/types';

const categories: { key: Category; label: string }[] = [
  { key: 'top', label: 'Top Stories' },
  { key: 'world', label: 'World' },
  { key: 'india', label: 'India' },
  { key: 'business', label: 'Business' },
  { key: 'technology', label: 'Technology' },
  { key: 'sports', label: 'Sports' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'health', label: 'Health' },
  { key: 'science', label: 'Science' },
];

interface Props {
  active: Category;
  onChange: (category: Category) => void;
}

export default function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="sticky top-14 z-40 bg-white border-b border-brand-100/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto hide-scrollbar">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`chip ${active === key ? 'chip-active' : 'chip-default'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
