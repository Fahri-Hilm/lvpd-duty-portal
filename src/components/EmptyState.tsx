import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center border border-slate-800 bg-slate-900">
        <Icon className="h-7 w-7 text-slate-600" />
      </div>
      <h3 className="mb-2 text-sm font-semibold text-slate-300">{title}</h3>
      <p className="mb-6 max-w-sm text-xs text-slate-500 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
