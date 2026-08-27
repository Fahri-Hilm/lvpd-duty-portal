import { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { Shield, UserCheck, LayoutGrid, List, ChevronDown, Search } from 'lucide-react';
import { mockMembers, ranks } from '../data';
import SpotlightPanel from '../components/SpotlightPanel';
import PanelHeader from '../components/PanelHeader';
import EmptyState from '../components/EmptyState';

const occupiedRanks = ranks
  .map((rank) => ({
    ...rank,
    members: mockMembers.filter((m) => m.rank === rank.name && m.status === 'Aktif'),
  }))
  .filter((r) => r.members.length > 0)
  .sort((a, b) => a.level - b.level);

const vacantRanks = ranks.filter((r) => !occupiedRanks.some((o) => o.id === r.id));
const totalActive = mockMembers.filter((m) => m.status === 'Aktif').length;

type ViewMode = 'bagan' | 'list';

function CommandConnector() {
  return (
    <div className="relative mx-auto h-10 w-px bg-gradient-to-b from-slate-700/60 via-slate-800 to-slate-800" aria-hidden="true">
      <span className="command-pulse absolute left-[calc(50%-3px)] top-0 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_1px_rgba(34,211,238,0.5)]" />
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function Structure() {
  const reducedMotion = useReducedMotion();
  const [view, setView] = useState<ViewMode>('bagan');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredMembers = mockMembers.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.rank.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const selectedMember = selectedId ? mockMembers.find(m => m.id === selectedId) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <header className="border-b border-slate-800 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="mb-2 font-display text-3xl font-bold uppercase text-slate-50 md:text-4xl">Struktur Hierarki</h1>
            <p className="text-sm font-medium text-slate-400">
              Susunan hierarki kepemimpinan dan perwira Kepolisian Futuristic Daerah Las Venturas.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 shrink-0">
            <span className="flex items-center gap-2">
              <UserCheck className="h-3.5 w-3.5 text-cyan-400" /> {totalActive} Aktif
            </span>
            <span className="h-3 w-px bg-slate-800"></span>
            <span>{occupiedRanks.length} Tingkat</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau pangkat..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* View toggle */}
          <div className="flex border border-slate-800 bg-slate-900">
            <button
              onClick={() => setView('bagan')}
              className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                view === 'bagan' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Bagan
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors border-l border-slate-800 ${
                view === 'list' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Daftar
            </button>
          </div>
        </div>
      </header>

      {/* Bagan View */}
      {view === 'bagan' && (
        <div className="space-y-0">
          {occupiedRanks.map((rankGroup, index) => (
            <div key={rankGroup.id}>
              {index > 0 && <CommandConnector />}
              <motion.section
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
                  <span className="text-[10px] font-bold tracking-[0.28em] text-slate-600">LEVEL {String(rankGroup.level).padStart(2, '0')}</span>
                  <div className="border border-slate-700 bg-slate-950 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-blue-400">
                    {rankGroup.name}
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.28em] text-slate-600">
                    {rankGroup.members.length} Perwira
                  </span>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {rankGroup.members.map((member) => (
                    <SpotlightPanel
                      key={member.id}
                      className={`w-full border bg-slate-900 transition-all cursor-pointer md:w-64 ${
                        rankGroup.level === 1 ? 'border-cyan-400/30 md:w-80' : 'border-slate-800 hover:border-blue-500/40'
                      } ${selectedId === member.id ? 'ring-1 ring-blue-500/50' : ''}`}
                    >
                      <motion.div
                        variants={cardVariants}
                        className="group relative p-5 text-center"
                        onClick={() => setSelectedId(selectedId === member.id ? null : member.id)}
                      >
                        <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center border bg-slate-950 transition-colors border-slate-800 group-hover:border-blue-500/30">
                          {rankGroup.level === 1 && <Shield className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 bg-slate-950 p-0.5 text-cyan-400" />}
                          <span className={`font-display text-lg font-bold uppercase ${rankGroup.level === 1 ? 'text-cyan-300' : 'text-slate-400 group-hover:text-blue-300'}`}>
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="mb-1 text-sm font-semibold text-slate-50">{member.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{member.rank}</p>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Aktif</span>
                        </div>
                        <ChevronDown className={`mx-auto mt-2 w-3.5 h-3.5 text-slate-600 transition-transform ${selectedId === member.id ? 'rotate-180' : ''}`} />

                        {/* Inline Detail */}
                        <AnimatePresence>
                          {selectedId === member.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-slate-800 text-left space-y-2 overflow-hidden"
                            >
                              <div className="text-[10px] space-y-1.5">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Pangkat</span>
                                  <span className="text-slate-300 font-semibold">{member.rank}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Status</span>
                                  <span className="text-green-400 font-semibold">{member.status}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Level</span>
                                  <span className="text-slate-300 font-semibold">{rankGroup.level}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </SpotlightPanel>
                  ))}
                </div>
              </motion.section>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="border border-slate-800 bg-slate-950/80">
          <div className="grid grid-cols-[1fr_120px_80px] gap-4 px-6 py-3 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <span>Nama</span>
            <span>Pangkat</span>
            <span className="text-right">Level</span>
          </div>
          {filteredMembers.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Tidak ditemukan"
              description="Tidak ada anggota yang cocok dengan pencarian Anda."
            />
          ) : (
            filteredMembers.map(m => {
              const rankGroup = occupiedRanks.find(r => r.members.some(mem => mem.id === m.id));
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}
                  className={`w-full grid grid-cols-[1fr_120px_80px] gap-4 px-6 py-4 text-left border-b border-slate-800/60 last:border-b-0 transition-colors ${
                    selectedId === m.id ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{m.name}</p>
                    <AnimatePresence>
                      {selectedId === m.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 text-[10px] text-slate-500 space-y-1 overflow-hidden"
                        >
                          <p>Status: <span className="text-green-400">{m.status}</span></p>
                          <p>Level komando: {rankGroup?.level ?? '-'}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 self-center">{m.rank}</span>
                  <span className="text-[11px] font-bold text-slate-500 text-right self-center">{rankGroup?.level ?? '-'}</span>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Vacant Ranks */}
      {vacantRanks.length > 0 && view === 'bagan' && (
        <motion.section
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center"
        >
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-600">Jabatan belum terisi</p>
          <div className="flex flex-wrap justify-center gap-3">
            {vacantRanks.map((r) => (
              <span key={r.id} className="border border-dashed border-slate-800 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {r.name} — level {r.level}
              </span>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
