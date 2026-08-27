import React, { useEffect, useState, useRef } from 'react';
import { useToast } from './ToastContext';
import { supabase } from '../lib/supabase';
import { fetchDutyRows, updateDuty, deleteDuty, uploadDutyPhoto, deleteDutyPhoto } from '../lib/data-service';
import type { DutyRow } from '../lib/data-service';
import { Plus, CheckCircle, X, Image as ImageIcon, FileEdit, Trash2, ArrowLeft, Calendar } from 'lucide-react';

type View = 'list' | 'create' | 'edit';

export default function AdminDutyEditor() {
  const [view, setView] = useState<View>('list');
  const [duties, setDuties] = useState<DutyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDuty, setEditingDuty] = useState<DutyRow | null>(null);

  // Form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const loadDuties = async () => {
    setLoading(true);
    const rows = await fetchDutyRows();
    setDuties(rows);
    setLoading(false);
  };

  useEffect(() => { loadDuties(); }, []);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setDescription('');
    setStatus('pending');
    setFile(null);
    setPreview(null);
    setEditingDuty(null);
  };

  const openCreate = () => {
    resetForm();
    setView('create');
  };

  const openEdit = (duty: DutyRow) => {
    setEditingDuty(duty);
    setStartDate(duty.duty_date ?? '');
    setEndDate(duty.off_duty_at?.split('T')[0] ?? duty.duty_date ?? '');
    setDescription(duty.notes ?? '');
    setStatus(duty.status ?? 'pending');
    setFile(null);
    setPreview(duty.photos?.[0]?.storage_path ?? null);
    setView('edit');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus laporan ini?')) return;
    const ok = await deleteDuty(id);
    if (ok) {
      setDuties(prev => prev.filter(d => d.id !== id));
      addToast('Laporan dihapus.', 'success');
    } else {
      addToast('Gagal menghapus laporan.', 'error');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const ok = await updateDuty(id, { status: newStatus });
    if (ok) {
      setDuties(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
      addToast(`Status diubah ke ${newStatus}.`, 'success');
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !description) {
      addToast('Semua field wajib diisi.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (view === 'edit' && editingDuty) {
        // Update existing duty
        const ok = await updateDuty(editingDuty.id, {
          duty_date: startDate,
          on_duty_at: startDate + 'T00:00:00Z',
          off_duty_at: endDate + 'T23:59:59Z',
          notes: description,
          status,
        });
        if (!ok) throw new Error('Gagal update laporan');

        // Upload new photo if selected
        if (file) {
          // Delete old photo first
          if (editingDuty.photos?.[0]?.id) {
            await deleteDutyPhoto(editingDuty.photos[0].id);
          }
          await uploadDutyPhoto(editingDuty.id, file);
        }

        addToast('Laporan berhasil diupdate.', 'success');
      } else {
        // Create new duty
        if (!supabase) throw new Error('Supabase not connected');

        const { data: members } = await supabase.from('members').select('id').limit(1);
        const memberId = members?.[0]?.id;
        if (!memberId) throw new Error('Tidak ada data member');

        const { data: report, error: insertErr } = await supabase.from('duty_reports').insert({
          member_id: memberId,
          duty_date: startDate,
          on_duty_at: startDate + 'T00:00:00Z',
          off_duty_at: endDate + 'T23:59:59Z',
          notes: description,
          status: status === 'pending' ? 'pending' : status,
        }).select('id').single();
        if (insertErr) throw insertErr;

        if (file && report) {
          await uploadDutyPhoto(report.id, file);
        }

        addToast('Laporan berhasil dipublikasikan.', 'success');
      }

      resetForm();
      setView('list');
      loadDuties();
    } catch (err: unknown) {
      console.error('[AdminDutyEditor] error:', err);
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      addToast('Gagal: ' + msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      addToast('Ukuran file maksimal 5MB.', 'error');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      addToast('Format harus JPG, PNG, atau WebP.', 'error');
      return;
    }
    setFile(f);
  };

  const statusLabel = (s: string) => {
    if (s === 'approved') return { text: 'DIPUBLIKASIKAN', color: 'text-green-400 border-green-500/30 bg-green-500/10' };
    if (s === 'rejected') return { text: 'DIARSIPKAN', color: 'text-slate-400 border-slate-600 bg-slate-800/50' };
    return { text: 'DRAF', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' };
  };

  // ── List View ──
  if (view === 'list') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold uppercase text-slate-50">Kelola Duty Faction</h1>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mt-1">Daftar laporan duty mingguan.</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Buat Laporan
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : duties.length === 0 ? (
          <div className="py-16 text-center border border-slate-800 bg-slate-900/50">
            <Calendar className="mx-auto w-8 h-8 text-slate-600 mb-3" />
            <p className="text-sm text-slate-400">Belum ada laporan duty.</p>
            <button onClick={openCreate} className="mt-4 text-[11px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300">Buat Laporan Pertama</button>
          </div>
        ) : (
          <div className="border border-slate-800">
            <div className="grid grid-cols-[1fr_120px_100px_120px] gap-4 px-6 py-3 bg-slate-950 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              <span>Judul</span>
              <span>Tanggal</span>
              <span>Status</span>
              <span className="text-right">Aksi</span>
            </div>
            {duties.map(d => {
              const sl = statusLabel(d.status);
              return (
                <div key={d.id}
                  className="grid grid-cols-[1fr_120px_100px_120px] gap-4 px-6 py-4 border-b border-slate-800/60 last:border-b-0 hover:bg-slate-800/20 transition-colors items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      DUTY FACTION — {d.duty_date}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-xs">{d.notes ?? '—'}</p>
                    {d.photos && d.photos.length > 0 && d.photos[0].storage_path && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-green-400">
                        <ImageIcon className="w-3 h-3" /> {d.photos.length} foto
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{d.duty_date}</span>
                  <div>
                    <select value={d.status}
                      onChange={(e) => handleStatusChange(d.id, e.target.value)}
                      className={`px-2 py-1 border text-[9px] font-bold uppercase tracking-widest bg-transparent focus:outline-none cursor-pointer ${sl.color}`}>
                      <option value="pending">Draf</option>
                      <option value="approved">Dipublikasikan</option>
                      <option value="rejected">Diarsipkan</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(d)}
                      className="p-1.5 border border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors">
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(d.id)}
                      className="p-1.5 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Create / Edit Form ──
  const isEdit = view === 'edit';
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => { resetForm(); setView('list'); }}
          className="p-2 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold uppercase text-slate-50">
            {isEdit ? 'Edit Laporan' : 'Buat Laporan Baru'}
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mt-1">
            {isEdit ? `Edit laporan duty ${editingDuty?.duty_date}` : 'Isi detail laporan duty mingguan.'}
          </p>
        </div>
      </div>

      <form className="max-w-2xl space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {isEdit && (
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-medium text-slate-50 transition-colors focus:border-blue-500 focus:outline-none">
              <option value="pending">Draf</option>
              <option value="approved">Dipublikasikan</option>
              <option value="rejected">Diarsipkan</option>
            </select>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Tanggal Mulai Duty</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-medium text-slate-50 transition-colors focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Tanggal Selesai Duty</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-medium text-slate-50 transition-colors focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Deskripsi Kegiatan</label>
          <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-medium text-slate-50 transition-colors placeholder:text-slate-700 focus:border-blue-500 focus:outline-none"
            placeholder="Ringkasan kegiatan operasional..." />
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {isEdit ? 'Ganti Foto (opsional)' : 'Upload Foto/Poster'}
          </label>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
          {preview ? (
            <div className="relative border border-slate-800 bg-slate-950 overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-3 right-3 p-1.5 bg-slate-950/80 border border-slate-700 text-red-400 hover:text-red-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
              {file && (
                <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-sm border border-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{file?.name}</span>
                </div>
              )}
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="group w-full cursor-pointer border border-dashed border-slate-700 bg-slate-950 p-12 text-center transition-colors hover:bg-slate-900 hover:border-blue-500/40">
              <ImageIcon className="mx-auto w-8 h-8 text-slate-600 group-hover:text-blue-400 mb-3 transition-colors" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-blue-400">Klik untuk upload foto kegiatan</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Format: JPG, PNG, WebP (Max 5MB)</p>
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center">
          <button type="submit" disabled={submitting || !startDate || !endDate || !description}
            className="bg-blue-600 px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {submitting ? (
              <><span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Mengirim...</>
            ) : isEdit ? (
              'Simpan Perubahan'
            ) : (
              'Publikasikan Laporan'
            )}
          </button>
          <button type="button" onClick={() => { resetForm(); setView('list'); }}
            className="px-6 py-3.5 border border-slate-700 text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            Batal
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {file ? `${(file.size / 1024 / 1024).toFixed(1)}MB` : isEdit ? 'Foto existing dipertahankan' : 'Belum ada foto'}
          </span>
        </div>
      </form>
    </div>
  );
}
