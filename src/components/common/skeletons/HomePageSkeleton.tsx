function HomePageSkeleton() {
  return (
    <div className="min-h-screen pb-6">
      {/* Content Filters Skeleton - match ContentFilter rounded-full buttons */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Movies", "TV Series", "Animations"].map((item, idx) => (
            <div
              key={idx}
              className="skeleton-gradient h-10 animate-pulse rounded-full px-4"
              style={{ width: `${item.length * 10 + 30}px` }}
            />
          ))}
        </div>
      </div>

      {/* Hero Banner Skeleton - match HeroBanner h-[220px] and rounded-xl */}
      <div className="px-4 pt-4">
        <div className="skeleton-gradient relative h-[220px] w-full animate-pulse overflow-hidden rounded-xl"></div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="mt-6 space-y-8">
        {/* Section 1 - Continue Watching */}
        <div>
          <div className="mb-4 flex items-center justify-between px-4">
            <div className="skeleton-gradient h-6 w-40 animate-pulse rounded" />
            <div className="skeleton-gradient h-5 w-16 animate-pulse rounded" />
          </div>
          <div className="flex gap-3 overflow-hidden px-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="skeleton-gradient h-[157px] w-[280px] shrink-0 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Section 2 - Regular Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between px-4">
            <div className="skeleton-gradient h-6 w-32 animate-pulse rounded" />
            <div className="skeleton-gradient h-5 w-16 animate-pulse rounded" />
          </div>
          <div className="flex gap-3 overflow-hidden px-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-[140px] shrink-0">
                {/* Match MovieCard rounded-lg */}
                <div className="skeleton-gradient aspect-2/3 w-full animate-pulse rounded-lg" />
                <div className="mt-2 space-y-1">
                  <div className="skeleton-gradient h-[20px] w-full animate-pulse rounded" />
                  <div className="skeleton-gradient h-[16px] w-20 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 - Regular Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between px-4">
            <div className="skeleton-gradient h-6 w-36 animate-pulse rounded" />
            <div className="skeleton-gradient h-5 w-16 animate-pulse rounded" />
          </div>
          <div className="flex gap-3 overflow-hidden px-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-[140px] shrink-0">
                {/* Match MovieCard rounded-lg */}
                <div className="skeleton-gradient aspect-2/3 w-full animate-pulse rounded-lg" />
                <div className="mt-2 space-y-1">
                  <div className="skeleton-gradient h-[20px] w-full animate-pulse rounded" />
                  <div className="skeleton-gradient h-[16px] w-20 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageSkeleton;
