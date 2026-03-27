interface Props {
  slot?: string;
  format?: 'banner' | 'rectangle' | 'leaderboard';
  className?: string;
}

export default function AdBanner({ slot = 'default', format = 'banner', className = '' }: Props) {
  const sizeClasses = {
    banner: 'h-16 sm:h-20',
    rectangle: 'h-64',
    leaderboard: 'h-24',
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`${sizeClasses[format]} bg-gradient-to-br from-slate-100 to-slate-200
                     dark:from-slate-800 dark:to-slate-700 rounded-xl
                     flex items-center justify-center border border-dashed
                     border-slate-300 dark:border-slate-600`}
        data-ad-slot={slot}
        data-ad-format={format}
      >
        <div className="text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Advertisement
          </p>
          {/*
            Replace this div with actual ad code:
            Google AdSense: <ins class="adsbygoogle" ... />
            Or any ad network script
          */}
        </div>
      </div>
    </div>
  );
}
