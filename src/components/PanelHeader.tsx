import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface PanelHeaderProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  status?: ReactNode;
  live?: boolean;
}

export default function PanelHeader({ icon: Icon, iconColor = 'text-blue-500', title, status, live }: PanelHeaderProps) {
  return (
    <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
      <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</h3>
      {status && <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-slate-600">{status}</span>}
      {live && <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>}
    </div>
  );
}
