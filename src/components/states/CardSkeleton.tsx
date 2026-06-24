// Skeleton placeholder mirroring the card layout while the list loads.
export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="skeleton h-11 w-full" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="skeleton h-6 w-2/3 rounded-md" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-11/12 rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-6 w-24 rounded-md" />
          <div className="skeleton h-6 w-16 rounded-md" />
        </div>
        <div className="mt-auto skeleton h-2 w-full rounded-full" />
        <div className="skeleton h-11 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
