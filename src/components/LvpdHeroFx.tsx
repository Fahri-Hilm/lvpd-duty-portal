import { useEffect, useRef, useState } from 'react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

export function FogCanvas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const coarse = window.matchMedia('(hover: none)').matches;
    const blobs = Array.from({ length: coarse ? 5 : 9 }, (_, i) => ({
      x: Math.random(),
      y: 0.25 + Math.random() * 0.6,
      r: 0.18 + Math.random() * 0.28,
      vx: (0.008 + Math.random() * 0.02) * (i % 2 === 0 ? 1 : -1),
      hue: i % 3 === 0 ? '37,99,235' : i % 3 === 1 ? '34,211,238' : '224,35,28',
      a: 0.05 + Math.random() * 0.07,
    }));
    const embers = Array.from({ length: coarse ? 14 : 30 }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: 0.6 + Math.random() * 1.8,
      vy: 0.0004 + Math.random() * 0.0012,
      ph: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width * dpr));
      h = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener('resize', resize);

    let visible = true;
    const onVis = () => {
      visible = !document.hidden;
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    let last = performance.now();
    let t = 0;
    const tick = (now: number) => {
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      ctx.clearRect(0, 0, w, h);

      for (const b of blobs) {
        b.x += b.vx * dt;
        if (b.x > 1.35) b.x = -0.35;
        if (b.x < -0.35) b.x = 1.35;
        const bx = b.x * w;
        const by = (b.y + Math.sin(t * 0.3 + b.r * 10) * 0.02) * h;
        const br = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, `rgba(${b.hue},${b.a})`);
        g.addColorStop(1, `rgba(${b.hue},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      for (const e of embers) {
        e.y -= e.vy;
        if (e.y < -0.02) {
          e.y = 1.02;
          e.x = Math.random();
        }
        const ex = (e.x + Math.sin(t * 0.8 + e.ph) * 0.008) * w;
        const ey = e.y * h;
        const tw = 0.5 + 0.5 * Math.sin(t * 2 + e.ph);
        ctx.fillStyle = `rgba(148,197,255,${0.12 + tw * 0.22})`;
        ctx.beginPath();
        ctx.arc(ex, ey, e.s * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}

export function ForegroundSilhouette() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-36">
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full text-slate-950"
        viewBox="0 0 1200 140"
        preserveAspectRatio="none"
      >
        <path
          d="M0 140 V96 H60 V78 H96 V92 H150 V64 H176 V88 H240 V72 H286 V94 H340 V58 H368 V84 H430 V70 H480 V92 H540 V66 H570 V88 H630 V74 H690 V94 H750 V62 H782 V86 H850 V72 H910 V94 H970 V68 H1000 V88 H1060 V74 H1120 V92 H1200 V80 V140 Z"
          fill="currentColor"
          opacity="0.92"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 to-transparent" />
      <div className="absolute left-[12%] top-2 h-1.5 w-1.5 rounded-full bg-red-500/80 blur-[1px]" />
      <div className="absolute left-[14%] top-3 h-1 w-1 rounded-full bg-blue-400/80 blur-[1px]" />
      <div className="absolute right-[18%] top-1 h-1.5 w-1.5 rounded-full bg-blue-400/70 blur-[1px]" />
    </div>
  );
}

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-16 z-40 h-px bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 transition-[width] duration-150"
        style={{ width: `${p * 100}%` }}
      />
    </div>
  );
}
