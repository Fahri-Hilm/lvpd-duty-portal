import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const TacticalMap = lazy(() => import('./TacticalMap'));

export default function LazyTacticalMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[20rem]">
      {isVisible ? (
        <Suspense fallback={<div className="min-h-[20rem] animate-pulse border border-slate-800 bg-slate-950/80" aria-label="Memuat peta taktis" />}>
          <TacticalMap />
        </Suspense>
      ) : (
        <div className="min-h-[20rem] border border-slate-800 bg-slate-950/80" aria-hidden="true" />
      )}
    </div>
  );
}
