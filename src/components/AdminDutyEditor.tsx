import { useEffect, useState } from 'react';
import { useToast } from './ToastContext';

const draftStorageKeys = {
  title: 'lvpd:duty-draft:title',
  startDate: 'lvpd:duty-draft:start-date',
  endDate: 'lvpd:duty-draft:end-date',
  description: 'lvpd:duty-draft:description',
} as const;

export default function AdminDutyEditor() {
  const [title, setTitle] = useState('DUTY FACTION MINGGU 36');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('Draf lokal aktif');
  const { addToast } = useToast();

  useEffect(() => {
    setTitle(localStorage.getItem(draftStorageKeys.title) ?? 'DUTY FACTION MINGGU 36');
    setStartDate(localStorage.getItem(draftStorageKeys.startDate) ?? '');
    setEndDate(localStorage.getItem(draftStorageKeys.endDate) ?? '');
    setDescription(localStorage.getItem(draftStorageKeys.description) ?? '');
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(draftStorageKeys.title, title);
    localStorage.setItem(draftStorageKeys.startDate, startDate);
    localStorage.setItem(draftStorageKeys.endDate, endDate);
    localStorage.setItem(draftStorageKeys.description, description);
    setStatus('Tersimpan otomatis');
  }, [description, endDate, ready, startDate, title]);

  return (
    <div>
      <h1 className="mb-4 text-3xl font-display font-bold uppercase text-slate-50">Kelola Duty Faction</h1>
      <p className="mb-8 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Buat laporan baru untuk minggu ini. Minimal upload 1 foto kegiatan.</p>
      <form className="max-w-2xl space-y-6">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Judul Laporan</label>
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} className="w-full border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-medium text-slate-50 transition-colors focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Periode Mulai</label>
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-medium text-slate-50 transition-colors focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Periode Selesai</label>
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="w-full border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-medium text-slate-50 transition-colors focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Deskripsi Kegiatan</label>
          <textarea rows={5} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm font-medium text-slate-50 transition-colors placeholder:text-slate-700 focus:border-blue-500 focus:outline-none" placeholder="Ringkasan kegiatan operasional..." />
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Upload Foto/Poster</label>
          <div className="group cursor-pointer border border-dashed border-slate-700 bg-slate-950 p-12 text-center transition-colors hover:bg-slate-900">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-blue-400">Klik untuk upload foto kegiatan</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Format: JPG, PNG (Max 5MB)</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center">
          <button type="button" onClick={() => addToast('Supabase belum terhubung. Laporan belum dipublikasikan.', 'error')} className="bg-blue-600 px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500">Publikasikan Laporan</button>
          <button type="button" onClick={() => { localStorage.setItem(draftStorageKeys.title, title); setStatus('Draf disimpan lokal'); addToast('Draf laporan disimpan secara lokal.', 'info'); }} className="border border-slate-700 bg-slate-950 px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:bg-slate-900 hover:text-white">Simpan Draf</button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{status}</span>
        </div>
      </form>
    </div>
  );
}
