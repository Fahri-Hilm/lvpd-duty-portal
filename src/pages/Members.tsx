import { useDeferredValue, useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router';
import Breadcrumb from '../components/Breadcrumb';
import { MemberDrawer } from '../components/MemberDrawer';
import { MemberCardSkeleton } from '../components/Skeleton';
import { fetchProfiles } from '../lib/data-service';
import type { Profile } from '../types';

const statusColor: Record<Profile['status'], string> = {
  active: 'text-green-400 bg-green-500/10 border-green-500/20',
  deployed: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  standby: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  offline: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const statusLabel: Record<Profile['status'], string> = {
  active: 'Aktif',
  deployed: 'Bertugas',
  standby: 'Siaga',
  offline: 'Tidak aktif',
};

function parseStatus(value: string | null): Profile['status'] | 'semua' {
  if (value === 'active' || value === 'deployed' || value === 'standby' || value === 'offline') return value;
  return 'semua';
}

export default function Members() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const deferredSearch = useDeferredValue(search.toLowerCase());
  const rank = params.get('pangkat') ?? 'semua';
  const status = parseStatus(params.get('status'));

  useEffect(() => {
    fetchProfiles().then(rows => {
      setProfiles(rows);
      setLoading(false);
    });
  }, []);

  const ranks = Array.from(new Set<string>(profiles.map(profile => profile.rank))).sort((a, b) => a.localeCompare(b, 'id'));
  const filtered = profiles.filter(member => {
    const queryMatches = !deferredSearch
      || member.full_name.toLowerCase().includes(deferredSearch)
      || member.rank.toLowerCase().includes(deferredSearch)
      || member.codename?.toLowerCase().includes(deferredSearch);
    return queryMatches && (rank === 'semua' || member.rank === rank) && (status === 'semua' || member.status === status);
  });
  const selectedMember = profiles.find(profile => profile.id === params.get('member')) ?? null;

  const updateParam = (key: 'q' | 'pangkat' | 'status' | 'member', value: string) => {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (!value || value === 'semua') next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Breadcrumb />
      <header className="border-b border-slate-800 pb-8">
        <h1 className="mb-4 font-display text-4xl font-bold uppercase text-slate-50 md:text-5xl">Personil Aktif</h1>
        <p className="text-sm font-medium text-slate-400 md:text-base">Direktori resmi personil Kepolisian Futuristic Daerah Las Venturas.</p>
      </header>

      <div className="grid gap-3 border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-[minmax(0,1fr)_12rem_10rem]">
        <label className="relative grid gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Cari personil
          <Search className="absolute bottom-3 left-3 h-4 w-4 text-slate-600" />
          <input type="search" value={search} onChange={event => updateParam('q', event.target.value)} placeholder="Nama, pangkat, codename..." className="w-full border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-xs font-semibold normal-case tracking-normal text-slate-50 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none" />
        </label>
        <label className="grid gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Pangkat
          <select value={rank} onChange={event => updateParam('pangkat', event.target.value)} className="border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none">
            <option value="semua">Semua pangkat</option>
            {ranks.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Status
          <select value={status} onChange={event => updateParam('status', event.target.value)} className="border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none">
            <option value="semua">Semua status</option>
            <option value="active">Aktif</option>
            <option value="deployed">Bertugas</option>
            <option value="standby">Siaga</option>
            <option value="offline">Tidak aktif</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>{filtered.length} dari {profiles.length} personil</span>
        <span className="flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" /> Filter tersimpan di URL</span>
      </div>

      {loading ? (
        <MemberCardSkeleton count={9} />
      ) : (
        <>
          <div className="hidden overflow-x-auto border border-slate-800 bg-slate-900 md:block">
            <table className="w-full border-collapse text-left">
              <thead><tr className="border-b border-slate-800 bg-slate-950">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Codename</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Pangkat</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(member => (
                  <tr key={member.id} className="transition-colors hover:bg-slate-800/50">
                    <td className="px-6 py-4"><button type="button" onClick={() => updateParam('member', member.id)} className="text-sm font-semibold text-slate-50 underline-offset-4 hover:text-blue-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">{member.full_name}</button></td>
                    <td className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-cyan-400">{member.codename ?? '—'}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">{member.rank}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right"><span className={`inline-flex border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusColor[member.status]}`}>{statusLabel[member.status]}</span></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center text-[11px] font-bold uppercase tracking-widest text-slate-600">Tidak ada personil ditemukan</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filtered.length === 0 ? <div className="py-12 text-center text-[11px] font-bold uppercase tracking-widest text-slate-600">Tidak ada personil ditemukan</div> : filtered.map(member => (
              <button key={member.id} type="button" onClick={() => updateParam('member', member.id)} className="flex w-full items-center gap-3 border border-slate-800 bg-slate-900 p-4 text-left transition-colors hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-slate-800 bg-slate-950">
                  {member.portrait_url ? <img src={member.portrait_url} alt="" className="h-full w-full object-cover" /> : <span className="text-sm font-bold text-slate-500">{member.full_name.charAt(0)}</span>}
                </div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-50">{member.full_name}</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{member.rank}</p>{member.codename && <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">{member.codename}</p>}</div>
                <span className={`shrink-0 border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${statusColor[member.status]}`}>{statusLabel[member.status]}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <MemberDrawer member={selectedMember} onClose={() => updateParam('member', '')} />
    </div>
  );
}
