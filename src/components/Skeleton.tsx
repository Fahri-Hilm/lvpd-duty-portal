interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse bg-slate-800/60 ${className}`} />
      ))}
    </>
  );
}

export function PanelSkeleton() {
  return (
    <div className="bg-slate-950/80 border border-slate-800 p-6 space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-950/80 border border-slate-800 p-6 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="px-6 py-3 bg-slate-950 border-b border-slate-800">
        <Skeleton className="h-3 w-full" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-slate-800/60 flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function MemberCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
