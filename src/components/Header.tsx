import { Search, Bell } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-brand-100/60">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm shadow-brand-500/20">
            <span className="text-white font-display font-extrabold text-xs">N</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-display font-extrabold text-lg text-brand-600">News</span>
            <span className="font-display font-extrabold text-lg text-slate-800">Flash</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Home', to: '/' },
            { label: 'World', to: '/category/world' },
            { label: 'India', to: '/category/india' },
            { label: 'Business', to: '/category/business' },
            { label: 'Tech', to: '/category/technology' },
            { label: 'Sports', to: '/category/sports' },
            { label: 'Health', to: '/category/health' },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="px-3 py-1.5 text-sm font-medium text-slate-500
                         hover:text-brand-600 rounded-lg
                         hover:bg-brand-50 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/search')}
            className="p-2 rounded-xl hover:bg-brand-50 transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-slate-500" />
          </button>
          <button
            className="p-2 rounded-xl hover:bg-brand-50 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
