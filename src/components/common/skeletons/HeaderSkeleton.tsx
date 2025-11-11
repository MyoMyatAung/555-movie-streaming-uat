function HeaderSkeleton() {
  return (
    <header className="w-full px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar and Welcome */}
        <div className="flex flex-1 items-center gap-3">
          {/* Avatar Skeleton - exact size 48x48 (size-12) with rounded-full */}
          <div className="size-12 flex-shrink-0 animate-pulse rounded-full bg-white/10" />

          {/* Welcome Text Skeleton */}
          <div className="flex flex-col gap-1">
            <div className="h-[20px] w-24 animate-pulse rounded bg-white/10" />
            <div className="h-[24px] w-32 animate-pulse rounded bg-white/10" />
          </div>
        </div>

        {/* Right: Search and Notifications */}
        <div className="flex items-center gap-2">
          {/* Search Button Skeleton - rounded-2xl to match Button */}
          <div className="h-[36px] w-[100px] animate-pulse rounded-2xl bg-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" />

          {/* Notification Bell Skeleton - rounded-full for icon button */}
          <div className="size-[40px] animate-pulse rounded-full bg-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" />
        </div>
      </div>
    </header>
  );
}

export default HeaderSkeleton;
