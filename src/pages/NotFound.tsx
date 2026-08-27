import { Link } from 'react-router';
import { ArrowLeft, RadioTower } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center border border-slate-800 bg-slate-900/70 p-8 md:p-16">
      <RadioTower className="mb-8 h-8 w-8 text-cyan-400" />
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-blue-400">Signal lost / 404</p>
      <h1 className="max-w-xl font-display text-6xl font-bold uppercase leading-[0.9] text-slate-50 md:text-8xl">Route not found.</h1>
      <p className="mt-8 max-w-lg text-sm leading-relaxed text-slate-400">Alamat ini tidak tercatat dalam jaringan LVPD. Kembali ke kanal utama untuk melihat laporan operasional terbaru.</p>
      <Link to="/" className="mt-10 inline-flex w-fit items-center gap-3 bg-blue-500 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-950 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
        <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
      </Link>
    </section>
  );
}
