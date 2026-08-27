import { useState, useEffect } from 'react';
import { fetchDuties } from '../lib/data-service';
import type { DutyFaction } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Duty() {
  const [currentDuty, setCurrentDuty] = useState<DutyFaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDuties().then(duties => {
      setCurrentDuty(duties.find(d => d.status === 'DIPUBLIKASIKAN') ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Memuat laporan...</p>
      </div>
    );
  }

  if (!currentDuty) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-display font-bold uppercase text-slate-50 mb-2">Belum Ada Laporan</h2>
        <p className="text-slate-400">Laporan minggu ini belum dipublikasikan oleh admin.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <header className="mb-12 border-b border-slate-800 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Laporan Resmi</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold uppercase leading-[1.1] text-slate-50 mb-8">
          {currentDuty.title}
        </h1>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6 text-slate-400 text-[11px] font-semibold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>
              {format(new Date(currentDuty.startDate), 'dd MMMM yyyy', { locale: id })} — {format(new Date(currentDuty.endDate), 'dd MMMM yyyy', { locale: id })}
            </span>
          </div>
          <div className="hidden md:block w-px h-4 bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Dipublikasikan: {currentDuty.publishedAt ? format(new Date(currentDuty.publishedAt), 'dd MMM yyyy', { locale: id }) : '-'}</span>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {/* Deskripsi */}
        <section className="bg-slate-900 border border-slate-800 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
            <div className="w-1 h-4 bg-blue-500"></div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Deskripsi Kegiatan</h3>
          </div>
          <p className="text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-medium">
            {currentDuty.description}
          </p>
        </section>

        {/* Bukti Foto */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-4 bg-blue-500"></div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Bukti Visual</h3>
          </div>
          <div className="border border-slate-800 p-2 bg-slate-900/50">
            {currentDuty.photoUrl ? (
              <img 
                src={currentDuty.photoUrl}
                alt={`Bukti ${currentDuty.title}`} 
                width={1200}
                height={675}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
            ) : (
              <div className="aspect-[16/9] bg-slate-900 flex items-center justify-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Tidak ada foto tersedia</span>
              </div>
            )}
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mt-4 text-center">
            Dokumentasi resmi kegiatan operasional LVPD minggu ini.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
