import { mockMembers } from '../data';
import { Search } from 'lucide-react';

export default function Members() {
  // Sort members by rank level if we wanted to, but we'll just display them cleanly.
  // For simplicity, we just list them out.
  const activeMembers = mockMembers.filter(m => m.status === 'Aktif');

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="border-b border-slate-800 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase text-slate-50 mb-4">Personil Aktif</h1>
          <p className="text-sm md:text-base text-slate-400 font-medium">Direktori resmi personil Kepolisian Futuristic Daerah Las Venturas.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="CARI NAMA PERSONIL..." 
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 text-[11px] font-bold tracking-widest uppercase text-slate-50 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
          />
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama Anggota</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Pangkat</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {activeMembers.map((member) => (
              <tr key={member.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-8 py-4 whitespace-nowrap text-sm font-semibold text-slate-50">
                  {member.name}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {member.rank}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-right">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
