import React, { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { Lock, FileEdit, Users, LayoutDashboard, LogOut, TrendingUp, Eye, Clock, Plus, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../components/ToastContext';
import PanelHeader from '../components/PanelHeader';
import { fetchProfiles, createProfile, updateProfile, deleteProfile, fetchDuties } from '../lib/data-service';
import EmptyState from '../components/EmptyState';
import type { Profile, DutyFaction } from '../types';

const AdminActivityChart = lazy(() => import('../components/AdminActivityChart'));
const AdminDutyEditor = lazy(() => import('../components/AdminDutyEditor'));

type DraftStatus = 'draft' | 'review' | 'published';

const statusLabels: Record<DraftStatus, string> = {
  draft: 'Draf',
  review: 'Siap Ditinjau',
  published: 'Dipublikasikan'
};

const statusColors: Record<DraftStatus, string> = {
  draft: 'text-slate-400 bg-slate-800',
  review: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  published: 'text-green-400 bg-green-500/10 border-green-500/30'
};

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'duty' | 'members'>('dashboard');
  const { addToast } = useToast();

  // Draft workflow state
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('draft');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [duties, setDuties] = useState<DutyFaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({ full_name: '', rank: '', email: '', role: 'analyst' as Profile['role'], codename: '' });

  // Auto-save indicator
  const updateSaved = useCallback(() => {
    setLastSaved(new Date());
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(updateSaved, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, updateSaved]);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchProfiles().then(setProfiles);
    fetchDuties().then(setDuties);
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
      setError('');
      addToast('Autentikasi berhasil. Selamat datang di Command Center.', 'success');
    } else {
      setError('Password salah. (Hint: admin123)');
      addToast('Akses ditolak. Kredensial tidak valid.', 'error');
    }
  };

  const handlePublish = () => {
    if (draftStatus === 'draft') {
      setDraftStatus('review');
      addToast('Laporan dipindahkan ke status tinjauan.', 'success');
    } else if (draftStatus === 'review') {
      setDraftStatus('published');
      addToast('Laporan berhasil dipublikasikan.', 'success');
    }
  };

  const handleRevert = () => {
    if (draftStatus === 'published') {
      setDraftStatus('draft');
      addToast('Laporan dikembalikan ke draf.', 'success');
    } else if (draftStatus === 'review') {
      setDraftStatus('draft');
      addToast('Laporan dikembalikan ke draf.', 'success');
    }
  };

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20 border border-slate-800 bg-slate-900 p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-950 border border-slate-800 flex items-center justify-center mb-6">
            <Lock className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-2xl font-display font-bold uppercase text-slate-50 mb-2">Akses Admin</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">LVPD Secure Portal Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Security Credential</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-sm text-slate-50 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-700"
              placeholder="ENTER PASSWORD..."
            />
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    );
  }

  const currentDuty = duties[0];
  const activeMembersCount = profiles.filter(p => p.status === 'active' || p.status === 'deployed').length;

  const handleCreate = async () => {
    if (!newMember.full_name || !newMember.rank || !newMember.email) {
      addToast('Nama, pangkat, dan email wajib diisi.', 'error');
      return;
    }
    const created = await createProfile(newMember);
    if (created) {
      setProfiles(prev => [...prev, created]);
      setNewMember({ full_name: '', rank: '', email: '', role: 'analyst', codename: '' });
      addToast('Personil baru berhasil ditambahkan.', 'success');
    } else {
      addToast('Gagal menambahkan personil.', 'error');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Profile>) => {
    const updated = await updateProfile(id, updates);
    if (updated) {
      setProfiles(prev => prev.map(p => p.id === id ? updated : p));
      setEditingId(null);
      addToast('Data personil diperbarui.', 'success');
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteProfile(id);
    if (ok) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      addToast('Personil dihapus dari sistem.', 'success');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Admin Sidebar */}
      <div className="w-full md:w-56 shrink-0 space-y-1">
        <div className="mb-6 px-4 border-b border-slate-800 pb-5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Command Center</h2>
          <p className="text-xl font-display font-bold uppercase text-slate-50">Admin Panel</p>
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
            activeTab === 'dashboard' ? 'bg-blue-600/10 border-l-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-900 border-l-2 border-transparent'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => setActiveTab('duty')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
            activeTab === 'duty' ? 'bg-blue-600/10 border-l-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-900 border-l-2 border-transparent'
          }`}
        >
          <FileEdit className="w-4 h-4" /> Kelola Duty
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
            activeTab === 'members' ? 'bg-blue-600/10 border-l-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-900 border-l-2 border-transparent'
          }`}
        >
          <Users className="w-4 h-4" /> Kelola Anggota
        </button>

        <div className="pt-6 mt-6 border-t border-slate-800">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors border-l-2 border-transparent"
          >
            <LogOut className="w-4 h-4" /> Disconnect
          </button>
        </div>
      </div>

      {/* Admin Content */}
      <div className="flex-1 border border-slate-800 p-6 bg-slate-950/80 relative overflow-hidden min-w-0">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-display font-bold uppercase text-slate-50 mb-4">Ringkasan Sistem</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2 p-5 bg-slate-900/80 border border-slate-800">
                  <PanelHeader icon={TrendingUp} title="Aktivitas Laporan" status="Mingguan" />
                  <div className="h-40 w-full">
                    <Suspense fallback={<div className="h-full w-full animate-pulse bg-slate-950/60" />}>
                      <AdminActivityChart />
                    </Suspense>
                  </div>
                </div>

                <div className="col-span-1 flex flex-col gap-4">
                  <div className="flex-1 p-5 bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <PanelHeader icon={FileEdit} title="Status Terkini" />
                    <p className="text-xl font-display font-bold uppercase text-slate-50">{currentDuty?.status ?? '—'}</p>
                  </div>
                  <div className="flex-1 p-5 bg-slate-900/80 border border-slate-800">
                    <PanelHeader icon={Users} title="Anggota Aktif" />
                    <p className="text-2xl font-display font-bold text-slate-50">{activeMembersCount}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Personil</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border border-slate-800 bg-slate-900/50">
                <h3 className="font-display font-bold text-base uppercase text-slate-50 mb-3">Aksi Cepat</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('duty')} className="px-5 py-2.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors">Buat Laporan</button>
                  <button onClick={() => setActiveTab('members')} className="px-5 py-2.5 border border-slate-700 bg-slate-900 text-slate-300 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-colors">Tambah Anggota</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'duty' && (
            <motion.div
              key="duty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Draft Status Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border ${statusColors[draftStatus]}`}>
                      {statusLabels[draftStatus]}
                    </span>
                  </div>
                  {lastSaved && (
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      Tersimpan {lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-3 py-2 border border-slate-700 bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> {showPreview ? 'Sembunyikan' : 'Preview'}
                  </button>
                  {draftStatus !== 'published' && (
                    <button
                      onClick={handlePublish}
                      className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors"
                    >
                      {draftStatus === 'draft' ? 'Kirim untuk Ditinjau' : 'Publikasikan'}
                    </button>
                  )}
                  {draftStatus !== 'draft' && (
                    <button
                      onClick={handleRevert}
                      className="px-3 py-2 border border-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                    >
                      Kembalikan ke Draf
                    </button>
                  )}
                </div>
              </div>

              {/* Preview */}
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-6 bg-slate-900/40 border border-slate-800 space-y-4"
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Preview Laporan</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500">Judul</span>
                      <span className="text-slate-200 font-semibold">{currentDuty?.title ?? '—'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500">Status</span>
                      <span className="text-cyan-400 font-semibold">{currentDuty?.status ?? '—'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500">Periode</span>
                      <span className="text-slate-300">{currentDuty?.startDate ?? '—'} — {currentDuty?.endDate ?? '—'}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed pt-2">{currentDuty?.description ?? '—'}</p>
                  </div>
                </motion.div>
              )}

              <Suspense fallback={<div className="min-h-[24rem] animate-pulse bg-slate-950/60" />}>
                <AdminDutyEditor />
              </Suspense>
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-2xl font-display font-bold uppercase text-slate-50 mb-2">Kelola Anggota</h1>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Tambah, edit, atau nonaktifkan anggota LVPD.</p>

              <div className="p-5 bg-slate-900/80 border border-slate-800">
                <h3 className="font-display font-bold text-base uppercase text-slate-50 mb-4">Registrasi Personil</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="NAMA LENGKAP" value={newMember.full_name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, full_name: e.target.value }))}
                    className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-50 focus:outline-none focus:border-blue-500 placeholder:text-slate-700" />
                  <input type="text" placeholder="PANGKAT (E.G. IPDA)" value={newMember.rank}
                    onChange={(e) => setNewMember(prev => ({ ...prev, rank: e.target.value }))}
                    className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-50 focus:outline-none focus:border-blue-500 placeholder:text-slate-700" />
                  <input type="email" placeholder="EMAIL" value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-50 focus:outline-none focus:border-blue-500 placeholder:text-slate-700" />
                  <input type="text" placeholder="CODENAME (OPTIONAL)" value={newMember.codename}
                    onChange={(e) => setNewMember(prev => ({ ...prev, codename: e.target.value }))}
                    className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-50 focus:outline-none focus:border-blue-500 placeholder:text-slate-700" />
                  <select value={newMember.role}
                    onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as Profile['role'] }))}
                    className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-50 focus:outline-none focus:border-blue-500">
                    <option value="admin">Admin</option>
                    <option value="commander">Commander</option>
                    <option value="analyst">Analyst</option>
                    <option value="cadet">Cadet</option>
                  </select>
                  <button onClick={handleCreate}
                    className="px-5 py-2.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-500 shrink-0 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-3.5 h-3.5" /> Tambahkan
                  </button>
                </div>
              </div>

              <div className="border border-slate-800">
                <div className="grid grid-cols-[1fr_100px_100px_80px_100px] gap-4 px-6 py-3 bg-slate-950 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  <span>Nama</span>
                  <span>Pangkat</span>
                  <span>Codename</span>
                  <span>Role</span>
                  <span className="text-right">Aksi</span>
                </div>
                {profiles.length === 0 ? (
                  <EmptyState icon={Users} title="Belum ada data" description="Tambahkan personil menggunakan form di atas." />
                ) : (
                  profiles.map(p => (
                    <div key={p.id} className="grid grid-cols-[1fr_100px_100px_80px_100px] gap-4 px-6 py-3 border-b border-slate-800/60 last:border-b-0 hover:bg-slate-800/20 transition-colors items-center">
                      {editingId === p.id ? (
                        <input type="text" defaultValue={p.full_name}
                          onBlur={(e) => handleUpdate(p.id, { full_name: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdate(p.id, { full_name: (e.target as HTMLInputElement).value })}
                          className="px-2 py-1 bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500" autoFocus />
                      ) : (
                        <span className="text-sm font-semibold text-slate-200 self-center truncate">{p.full_name}</span>
                      )}
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 self-center">{p.rank}</span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 self-center">{p.codename ?? '—'}</span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 self-center">{p.role}</span>
                      <div className="text-right self-center flex justify-end gap-2">
                        <button onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                          className="p-1.5 border border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors">
                          <FileEdit className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="p-1.5 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
