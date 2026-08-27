import { useRef } from 'react';
import type { ReactNode, PointerEvent } from 'react';

type SpotlightPanelProps = {
  readonly key?: string;
  readonly children: ReactNode;
  readonly className?: string;
};

export default function SpotlightPanel({ children, className = '' }: SpotlightPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;
    const bounds = panel.getBoundingClientRect();
    panel.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
    panel.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
  };

  return (
    <div ref={panelRef} onPointerMove={handlePointerMove} className={`spotlight-panel ${className}`}>
      {children}
    </div>
  );
}
