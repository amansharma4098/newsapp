import { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-display font-extrabold text-xs">N</span>
          </div>
          <h1 className="font-display font-extrabold text-lg">
            <span className="gradient-text">News</span>
            <span className="text-amber-500">Flash</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {['Top', 'India', 'World', 'Business', 'Tech', 'Sports'].map((item) => (
            <Link
              key={item}
              to={item === 'Top' ? '/' : `/category/${item.toLowerCase()}`}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400
                         hover:text-primary-600 dark:hover:text-primary-400 rounded-lg
                         hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/search')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-breaking rounded-full" />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? (
              <X size={20} className="text-slate-600 dark:text-slate-400" />
            ) : (
              <Menu size={20} className="text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-slate-200/50 dark:border-slate-700/50 animate-slide-up">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {['Top', 'India', 'World', 'Business', 'Technology', 'Sports', 'Entertainment', 'Health'].map(
              (item) => (
                <Link
                  key={item}
                  to={item === 'Top' ? '/' : `/category/${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300
                             rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20
                             hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
