export function MovieCardSkeleton() {
  return (
    <div className="w-full">
      {/* Match MovieCard rounded-lg */}
      <div className="skeleton-gradient aspect-2/3 w-full animate-pulse rounded-lg" />
      <div className="mt-2 space-y-1">
        <div className="skeleton-gradient h-[20px] w-full animate-pulse rounded" />
        <div className="skeleton-gradient h-[16px] w-20 animate-pulse rounded" />
      </div>
    </div>
  );
}

