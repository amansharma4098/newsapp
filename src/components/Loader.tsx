export function CardSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="aspect-video skeleton" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-3 w-16 skeleton" />
          <div className="h-3 w-12 skeleton" />
        </div>
        <div className="h-5 w-full skeleton" />
        <div className="h-5 w-3/4 skeleton" />
        <div className="h-3 w-full skeleton" />
        <div className="h-3 w-2/3 skeleton" />
        <div className="flex justify-between">
          <div className="h-3 w-20 skeleton" />
          <div className="h-3 w-16 skeleton" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden h-72 sm:h-80 md:h-96 skeleton" />
  );
}

export function CompactSkeleton() {
  return (
    <div className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-3 w-20 skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-16 skeleton" />
      </div>
      <div className="w-20 h-20 rounded-xl skeleton flex-shrink-0" />
    </div>
  );
}

export function FeedLoader() {
  return (
    <div className="space-y-4">
      <FeaturedSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      {[...Array(3)].map((_, i) => (
        <CompactSkeleton key={i} />
      ))}
    </div>
  );
}
