import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchProfiles } from '../lib/data-service';
import type { Profile } from '../types';

const statusColor: Record<string, string> = {
  active: 'text-green-400 bg-green-500/10 border-green-500/20',
  deployed: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  standby: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  offline: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

export default function Members() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProfiles().then(setProfiles);
  }, []);

  const filtered = profiles.filter(m =>
    !search || m.full_name.toLowerCase().includes(search.toLowerCase()) || m.rank.toLowerCase().includes(search.toLowerCase()) || m.codename?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="border-b border-slate-800 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase text-slate-50 mb-4">Personil Aktif</h1>
          <p className="text-sm md:text-base text-slate-400 font-medium">Direktori resmi personil Kepolisian Futuristic Daerah Las Venturas.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, pangkat, atau codename..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 text-[11px] font-bold tracking-widest uppercase text-slate-50 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600" />
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Codename</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Pangkat</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((member) => (
              <tr key={member.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-50">{member.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-cyan-400">{member.codename ?? '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-slate-400">{member.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-slate-500">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold uppercase tracking-widest ${statusColor[member.status] ?? statusColor.offline}`}>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-[11px] font-bold uppercase tracking-widest text-slate-600">Tidak ada personil ditemukan</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
