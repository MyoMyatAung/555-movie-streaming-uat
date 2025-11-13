function BottomNavbarSkeleton() {
  return (
    <div className="fixed bottom-0 left-1/2 z-[var(--z-nav-layer)] h-[var(--bottom-nav-height)] w-screen max-w-md -translate-x-1/2 bg-gradient-to-t from-[#141416] to-[#1F1F1F] px-5 pt-2.5 pb-4">
      <div className="grid grid-cols-4 items-center gap-x-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex flex-col items-center gap-y-1">
            {/* Only show skeleton for the 4th item (Profile) */}
            {item === 4 ? (
              <>
                {/* Icon Skeleton - size-6 (24x24) with rounded */}
                <div className="skeleton-gradient size-6 animate-pulse rounded" />
                {/* Label Skeleton - text-sm height */}
                <div className="skeleton-gradient h-[20px] w-12 animate-pulse rounded" />
              </>
            ) : (
              <>
                {/* Empty placeholder for other nav items */}
                <div className="size-6" />
                <div className="h-[20px] w-12" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BottomNavbarSkeleton;

