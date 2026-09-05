import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Archive, Calendar, CheckCircle, FileText, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import Breadcrumb from '../components/Breadcrumb';
import EmptyState from '../components/EmptyState';
import { PanelSkeleton } from '../components/Skeleton';
import { fetchDuties } from '../lib/data-service';
import type { DutyFaction, DutyStatus } from '../types';

type StatusFilter = 'semua' | 'dipublikasikan' | 'diarsipkan';
type PeriodFilter = 'semua' | '30' | '90' | '365';

function parseStatus(value: string | null): StatusFilter {
  if (value === 'dipublikasikan' || value === 'diarsipkan') return value;
  return 'semua';
}

function parsePeriod(value: string | null): PeriodFilter {
  if (value === '30' || value === '90' || value === '365') return value;
  return 'semua';
}

function statusStyle(status: DutyStatus) {
  if (status === 'DIPUBLIKASIKAN') return 'border-green-500/30 bg-green-500/10 text-green-400';
  if (status === 'DIARSIPKAN') return 'border-slate-600 bg-slate-800/50 text-slate-400';
  return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
}

export default function Duty() {
  const [duties, setDuties] = useState<DutyFaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const status = parseStatus(params.get('status'));
  const period = parsePeriod(params.get('periode'));

  useEffect(() => {
    fetchDuties().then(rows => {
      setDuties(rows);
      setLoading(false);
    });
  }, []);

  const publicDuties = duties.filter(duty => duty.status !== 'DRAF');
  const filteredDuties = publicDuties.filter(duty => {
    const statusMatches = status === 'semua'
      || (status === 'dipublikasikan' && duty.status === 'DIPUBLIKASIKAN')
      || (status === 'diarsipkan' && duty.status === 'DIARSIPKAN');
    if (!statusMatches || period === 'semua') return statusMatches;
    const age = Date.now() - new Date(duty.endDate).getTime();
    return age <= Number(period) * 24 * 60 * 60 * 1000;
  });
  const selectedDuty = filteredDuties.find(duty => duty.id === params.get('id')) ?? filteredDuties[0] ?? null;

  const updateFilter = (key: 'status' | 'periode', value: string) => {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (value === 'semua') next.delete(key);
      else next.set(key, value);
      next.delete('id');
      return next;
    }, { replace: true });
  };

  const selectDuty = (dutyId: string) => {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      next.set('id', dutyId);
      return next;
    }, { replace: true });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl space-y-8">
      <Breadcrumb />
      <header className="border-b border-slate-800 pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-400">Catatan operasional</p>
            <h1 className="mb-3 font-display text-4xl font-bold uppercase text-slate-50 md:text-5xl">Timeline Duty</h1>
            <p className="max-w-2xl text-sm font-medium text-slate-400 md:text-base">Riwayat laporan resmi LVPD berdasarkan waktu, status publikasi, dan periode operasi.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <FileText className="h-4 w-4" /> {publicDuties.length} laporan publik
          </div>
        </div>
      </header>

      <div className="grid gap-3 border border-slate-800 bg-slate-900/60 p-4 sm:grid-cols-[auto_1fr_1fr] sm:items-end">
        <div className="hidden h-10 w-10 items-center justify-center border border-slate-800 bg-slate-950 text-slate-500 sm:flex"><SlidersHorizontal className="h-4 w-4" /></div>
        <label className="grid gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Status
          <select value={status} onChange={event => updateFilter('status', event.target.value)} className="border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none">
            <option value="semua">Semua status</option>
            <option value="dipublikasikan">Dipublikasikan</option>
            <option value="diarsipkan">Diarsipkan</option>
          </select>
        </label>
        <label className="grid gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Periode
          <select value={period} onChange={event => updateFilter('periode', event.target.value)} className="border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none">
            <option value="semua">Semua periode</option>
            <option value="30">30 hari terakhir</option>
            <option value="90">90 hari terakhir</option>
            <option value="365">1 tahun terakhir</option>
          </select>
        </label>
      </div>

      {loading ? (
        <PanelSkeleton />
      ) : filteredDuties.length === 0 ? (
        <EmptyState icon={Archive} title="Laporan tidak ditemukan" description="Ubah status atau periode untuk melihat laporan lain." />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside aria-label="Daftar laporan" className="order-2 space-y-2 lg:order-1">
            {filteredDuties.map((duty, index) => (
              <button key={duty.id} type="button" onClick={() => selectDuty(duty.id)} aria-pressed={selectedDuty?.id === duty.id}
                className={`relative w-full border p-4 text-left transition-colors before:absolute before:-left-[5px] before:top-6 before:h-2 before:w-2 before:bg-slate-600 ${selectedDuty?.id === duty.id ? 'border-blue-500/50 bg-blue-500/10 before:bg-blue-400' : 'border-slate-800 bg-slate-950/70 hover:border-slate-600'}`}>
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-slate-600">Laporan {String(index + 1).padStart(2, '0')}</span>
                <span className="block text-sm font-semibold text-slate-200">{format(new Date(duty.startDate), 'dd MMM yyyy', { locale: id })}</span>
                <span className="mt-2 block truncate text-[10px] text-slate-500">{duty.description}</span>
              </button>
            ))}
          </aside>

          {selectedDuty && (
            <article className="order-1 overflow-hidden border border-slate-800 bg-slate-900 lg:order-2">
              {selectedDuty.photoUrl && <img src={selectedDuty.photoUrl} alt={`Bukti ${selectedDuty.title}`} width={1200} height={675} className="aspect-video w-full object-cover" />}
              <div className="p-6">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className={`border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusStyle(selectedDuty.status)}`}><CheckCircle className="mr-1.5 inline h-3 w-3" />{selectedDuty.status}</span>
                  <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500"><Calendar className="h-3.5 w-3.5" />{format(new Date(selectedDuty.startDate), 'dd MMM', { locale: id })} - {format(new Date(selectedDuty.endDate), 'dd MMM yyyy', { locale: id })}</span>
                </div>
                <h2 className="mb-5 font-display text-3xl font-bold uppercase text-slate-50">{selectedDuty.title}</h2>
                <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-300 md:text-base">{selectedDuty.description}</p>
              </div>
            </article>
          )}
        </div>
      )}
    </motion.div>
  );
}
