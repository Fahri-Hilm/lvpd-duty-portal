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
