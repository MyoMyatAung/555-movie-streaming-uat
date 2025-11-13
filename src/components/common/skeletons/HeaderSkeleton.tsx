function HeaderSkeleton() {
  return (
    <header className="w-full px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar and Welcome */}
        <div className="flex flex-1 items-center gap-3">
          {/* Avatar Skeleton - exact size 48x48 (size-12) with rounded-full */}
          <div className="skeleton-gradient size-12 shrink-0 animate-pulse rounded-full" />

          {/* Welcome Text Skeleton */}
          <div className="flex flex-col gap-1.5">
            <div className="skeleton-gradient h-4 w-24 animate-pulse rounded-full" />
            <div className="skeleton-gradient h-5 w-16 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Right: Search and Notifications */}
        <div className="flex items-center gap-2">
          {/* Search Button Skeleton - rounded-2xl to match Button */}
          <div className="skeleton-gradient h-[36px] w-[100px] animate-pulse rounded-md" />

          {/* Notification Bell Skeleton - rounded-full for icon button */}
          <div className="skeleton-gradient size-[40px] animate-pulse rounded-full" />
        </div>
      </div>
    </header>
  );
}

export default HeaderSkeleton;
