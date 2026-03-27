import { Bell, Globe, Shield, Info, ChevronRight, Smartphone, Mail } from 'lucide-react';

interface SettingItemProps {
  icon: typeof Bell;
  label: string;
  description?: string;
  toggle?: boolean;
  value?: boolean;
  onChange?: (v: boolean) => void;
}

function SettingItem({ icon: Icon, label, description, toggle, value, onChange }: SettingItemProps) {
  return (
    <button
      onClick={toggle ? () => onChange?.(!value) : undefined}
      className="flex items-center gap-3 w-full p-3.5 rounded-xl hover:bg-brand-50/50 transition-colors text-left"
    >
      <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-brand-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      {toggle ? (
        <div
          className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${
            value ? 'bg-brand-500' : 'bg-slate-200'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
              value ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
      ) : (
        <ChevronRight size={15} className="text-slate-300" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <h1 className="font-display font-extrabold text-2xl text-slate-800">Settings</h1>

      <div className="bg-white rounded-2xl border border-brand-100/60 p-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-2 pb-1">
          Notifications
        </p>
        <SettingItem icon={Bell} label="Push Notifications" description="Get notified about breaking news" toggle value={true} onChange={() => {}} />
        <SettingItem icon={Bell} label="Breaking Alerts" description="Instant alerts for major stories" toggle value={true} onChange={() => {}} />
      </div>

      <div className="bg-white rounded-2xl border border-brand-100/60 p-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-2 pb-1">
          Preferences
        </p>
        <SettingItem icon={Globe} label="Region" description="Global" />
        <SettingItem icon={Globe} label="Language" description="English" />
      </div>

      <div className="bg-white rounded-2xl border border-brand-100/60 p-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-2 pb-1">
          About
        </p>
        <SettingItem icon={Shield} label="Privacy Policy" />
        <SettingItem icon={Info} label="Terms of Service" />
        <SettingItem icon={Mail} label="Contact Us" />
        <SettingItem icon={Smartphone} label="Install App" description="Add to home screen" />
      </div>

      <p className="text-center text-xs text-slate-300 pt-4">
        NewsFlash v1.0.0 &middot; Global News
      </p>
    </div>
  );
}
