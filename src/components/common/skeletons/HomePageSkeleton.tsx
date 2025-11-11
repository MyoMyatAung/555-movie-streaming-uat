function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141416] to-[#1F1F1F] pb-6">
      {/* Content Filters Skeleton - match ContentFilter rounded-full buttons */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Movies", "TV Series", "Animations"].map((item, idx) => (
            <div
              key={idx}
              className="h-10 animate-pulse rounded-full bg-white/10 px-4"
              style={{ width: `${item.length * 10 + 30}px` }}
            />
          ))}
        </div>
      </div>

      {/* Hero Banner Skeleton - match HeroBanner h-[220px] and rounded-xl */}
      <div className="px-4 pt-4">
        <div className="relative h-[220px] w-full animate-pulse overflow-hidden rounded-xl bg-white/10"></div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="mt-6 space-y-8">
        {/* Section 1 - Continue Watching */}
        <div>
          <div className="mb-4 flex items-center justify-between px-4">
            <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
            <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
          </div>
          <div className="flex gap-3 overflow-hidden px-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-[157px] w-[280px] flex-shrink-0 animate-pulse rounded-lg bg-white/10"
              />
            ))}
          </div>
        </div>

        {/* Section 2 - Regular Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between px-4">
            <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
          </div>
          <div className="flex gap-3 overflow-hidden px-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-[140px] flex-shrink-0">
                {/* Match MovieCard rounded-lg */}
                <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-white/10" />
                <div className="mt-2 space-y-1">
                  <div className="h-[20px] w-full animate-pulse rounded bg-white/10" />
                  <div className="h-[16px] w-20 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 - Regular Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between px-4">
            <div className="h-6 w-36 animate-pulse rounded bg-white/10" />
            <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
          </div>
          <div className="flex gap-3 overflow-hidden px-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-[140px] flex-shrink-0">
                {/* Match MovieCard rounded-lg */}
                <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-white/10" />
                <div className="mt-2 space-y-1">
                  <div className="h-[20px] w-full animate-pulse rounded bg-white/10" />
                  <div className="h-[16px] w-20 animate-pulse rounded bg-white/10" />
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
