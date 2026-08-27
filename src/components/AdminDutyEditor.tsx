import React, { useEffect, useState, useRef } from 'react';
import { useToast } from './ToastContext';
import { supabase } from '../lib/supabase';
import { Upload, CheckCircle, X, Image as ImageIcon } from 'lucide-react';

export default function AdminDutyEditor() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [published, setPublished] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

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

  const handlePublish = async () => {
    if (!supabase) {
      addToast('Supabase tidak terhubung.', 'error');
      return;
    }
    if (!startDate || !endDate || !description) {
      addToast('Semua field wajib diisi.', 'error');
      return;
    }

    setUploading(true);
    try {
      // Pick first available member as member_id (required NOT NULL)
      const { data: members } = await supabase.from('members').select('id').limit(1);
      const memberId = members?.[0]?.id;
      if (!memberId) {
        addToast('Tidak ada data member di database.', 'error');
        setUploading(false);
        return;
      }

      // Insert duty report
      const { data: report, error: insertErr } = await supabase.from('duty_reports').insert({
        member_id: memberId,
        duty_date: startDate,
        on_duty_at: startDate + 'T00:00:00Z',
        off_duty_at: endDate + 'T23:59:59Z',
        notes: description,
        status: 'approved',
      }).select('id').single();
      if (insertErr) throw insertErr;

      // Upload photo if provided
      if (file && report) {
        const ext = file.name.split('.').pop();
        const path = `duty/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('duty-photos')
          .upload(path, file, { contentType: file.type, upsert: false });
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage.from('duty-photos').getPublicUrl(path);

        await supabase.from('duty_photos').insert({
          duty_report_id: report.id,
          storage_path: urlData.publicUrl,
          original_size: file.size,
        });
      }

      setPublished(true);
      addToast('Laporan berhasil dipublikasikan.', 'success');
      setStartDate('');
      setEndDate('');
      setDescription('');
      setFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mempublikasikan.';
      addToast(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-3xl font-display font-bold uppercase text-slate-50">Kelola Duty Faction</h1>
      <p className="mb-8 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Buat laporan baru untuk minggu ini. Minimal upload 1 foto kegiatan.</p>
      <form className="max-w-2xl space-y-6" onSubmit={(e) => { e.preventDefault(); handlePublish(); }}>
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
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Upload Foto/Poster</label>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
          {preview ? (
            <div className="relative border border-slate-800 bg-slate-950 overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-3 right-3 p-1.5 bg-slate-950/80 border border-slate-700 text-red-400 hover:text-red-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-sm border border-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{file?.name}</span>
              </div>
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
          <button type="submit" disabled={uploading || !startDate || !endDate || !description}
            className="bg-blue-600 px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {uploading ? (
              <><span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Mengirim...</>
            ) : published ? (
              <><CheckCircle className="w-3.5 h-3.5" /> Terpublikasi</>
            ) : (
              'Publikasikan Laporan'
            )}
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {file ? `${(file.size / 1024 / 1024).toFixed(1)}MB` : 'Belum ada foto'}
          </span>
        </div>
      </form>
    </div>
  );
}
