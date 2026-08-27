import { Link, useLocation } from 'react-router';
import { ChevronRight } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/': 'Beranda',
  '/duty': 'Duty Faction',
  '/arsip': 'Arsip',
  '/anggota': 'Anggota',
  '/struktur': 'Struktur',
  '/admin': 'Admin',
};

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 mb-6 text-[10px] font-bold uppercase tracking-widest">
      <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">Beranda</Link>
      {segments.map((seg, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const label = routeLabels[path] ?? seg;
        const isLast = i === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-slate-700" />
            {isLast ? (
              <span className="text-slate-300">{label}</span>
            ) : (
              <Link to={path} className="text-slate-500 hover:text-slate-300 transition-colors">{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
