interface Props {
  slot?: string;
  format?: 'banner' | 'rectangle' | 'leaderboard';
  className?: string;
}

export default function AdBanner({ slot = 'default', format = 'banner', className = '' }: Props) {
  const sizeClasses = {
    banner: 'h-16',
    rectangle: 'h-60',
    leaderboard: 'h-20',
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`${sizeClasses[format]} bg-brand-50 rounded-xl
                     flex items-center justify-center border border-dashed border-brand-200`}
        data-ad-slot={slot}
        data-ad-format={format}
      >
        <p className="text-[11px] text-brand-300 font-medium tracking-wide">
          Advertisement
        </p>
      </div>
    </div>
  );
}
