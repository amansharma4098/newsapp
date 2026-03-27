import {
  Bell, Moon, Globe, Shield, Info, ExternalLink,
  ChevronRight, Smartphone, Mail
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingItemProps {
  icon: typeof Bell;
  label: string;
  description?: string;
  toggle?: boolean;
  value?: boolean;
  onChange?: (v: boolean) => void;
  onClick?: () => void;
}

function SettingItem({ icon: Icon, label, description, toggle, value, onChange, onClick }: SettingItemProps) {
  return (
    <button
      onClick={toggle ? () => onChange?.(!value) : onClick}
      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
    >
      <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-primary-600 dark:text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      {toggle ? (
        <div
          className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${
            value ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
              value ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
      ) : (
        <ChevronRight size={16} className="text-slate-400" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const [breakingAlerts, setBreakingAlerts] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Settings</h1>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 pt-2 pb-1">
          Notifications
        </p>
        <SettingItem
          icon={Bell}
          label="Push Notifications"
          description="Get notified about latest news"
          toggle
          value={notifications}
          onChange={setNotifications}
        />
        <SettingItem
          icon={Bell}
          label="Breaking News Alerts"
          description="Instant alerts for breaking stories"
          toggle
          value={breakingAlerts}
          onChange={setBreakingAlerts}
        />
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 pt-2 pb-1">
          Appearance
        </p>
        <SettingItem
          icon={Moon}
          label="Dark Mode"
          description="Easier on your eyes at night"
          toggle
          value={darkMode}
          onChange={setDarkMode}
        />
        <SettingItem
          icon={Globe}
          label="Language"
          description="English"
        />
      </div>

      {/* About */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 pt-2 pb-1">
          About
        </p>
        <SettingItem icon={Shield} label="Privacy Policy" />
        <SettingItem icon={Info} label="Terms of Service" />
        <SettingItem icon={Mail} label="Contact Us" />
        <SettingItem icon={Smartphone} label="Install App" description="Add to home screen for app-like experience" />
      </div>

      {/* Version */}
      <p className="text-center text-xs text-slate-400 pt-4">
        NewsFlash v1.0.0 &middot; Powered by Cloudflare
      </p>
    </div>
  );
}
