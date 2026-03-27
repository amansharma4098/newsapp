export function CardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[16/10] skeleton rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-3 w-16 skeleton" />
          <div className="h-3 w-12 skeleton" />
        </div>
        <div className="h-5 w-full skeleton" />
        <div className="h-5 w-3/4 skeleton" />
        <div className="h-3 w-full skeleton" />
        <div className="h-3 w-20 skeleton" />
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden h-64 sm:h-72 md:h-96 skeleton" />
  );
}

export function CompactSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-slate-100/80 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-full skeleton" />
      </div>
      <div className="w-24 h-24 rounded-xl skeleton flex-shrink-0" />
    </div>
  );
}

export function FeedLoader() {
  return (
    <div className="space-y-5">
      <FeaturedSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      {[...Array(3)].map((_, i) => (
        <CompactSkeleton key={i} />
      ))}
    </div>
  );
}
