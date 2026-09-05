import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { fetchDuties } from '../lib/data-service';
import type { DutyFaction } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { TableSkeleton } from '../components/Skeleton';

export default function Archive() {
  const [archivedDuties, setArchivedDuties] = useState<DutyFaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDuties().then(duties => {
      setArchivedDuties(duties.filter(d => d.status === 'DIARSIPKAN' || d.status === 'DIPUBLIKASIKAN'));
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumb />
      <header className="border-b border-slate-800 pb-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase text-slate-50 mb-4">Arsip Laporan</h1>
        <p className="text-sm md:text-base text-slate-400 font-medium">Dokumentasi historis kegiatan Duty Faction LVPD dari minggu-minggu sebelumnya.</p>
      </header>

      {loading ? (
        <TableSkeleton rows={3} />
      ) : archivedDuties.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-400">Belum ada arsip laporan.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {archivedDuties.map((duty) => (
            <Link
              key={duty.id}
              to={`/duty?id=${encodeURIComponent(duty.id)}`}
              className="group block bg-slate-900 border border-slate-800 p-6 md:p-8 hover:border-blue-500/50 transition-colors relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="inline-block px-2.5 py-1 bg-slate-950 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {duty.status}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      {format(new Date(duty.startDate), 'dd MMM yyyy', { locale: id })} - {format(new Date(duty.endDate), 'dd MMM yyyy', { locale: id })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold uppercase text-slate-100 group-hover:text-blue-400 transition-colors">
                    {duty.title}
                  </h3>
                  <p className="font-medium text-slate-400 line-clamp-3 text-sm leading-relaxed">
                    {duty.description}
                  </p>
                </div>

                {duty.photoUrl && (
                  <div className="w-full md:w-56 h-36 shrink-0 border border-slate-800 overflow-hidden bg-slate-950">
                    <img src={duty.photoUrl} alt={`Foto ${duty.title}`} width={1200} height={675} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  </div>
                )}

                <div className="hidden md:flex shrink-0 items-center justify-center w-12 h-12 border border-slate-800 text-slate-500 group-hover:border-blue-500 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
