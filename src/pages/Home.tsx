import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Activity, MapPin, ShieldCheck, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'motion/react';
import DispatchFeed from '../components/DispatchFeed';
import SpotlightPanel from '../components/SpotlightPanel';
import PanelHeader from '../components/PanelHeader';
import { PanelSkeleton } from '../components/Skeleton';
import { fetchProfiles, fetchDuties } from '../lib/data-service';
import type { Profile, DutyFaction } from '../types';
import { lazy, Suspense } from 'react';

const ActivityChart = lazy(() => import('../components/ActivityChart'));
const LazyTacticalMap = lazy(() => import('../components/LazyTacticalMap'));

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [duties, setDuties] = useState<DutyFaction[]>([]);

  useEffect(() => {
    fetchProfiles().then(setProfiles);
    fetchDuties().then(setDuties);
  }, []);

  const latestDuty = duties[0];
  const activeProfiles = profiles.filter(p => p.status === 'active' || p.status === 'deployed');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-20"
    >
      <motion.section variants={item} className="pt-8 pb-12 relative">
        <div className="absolute inset-x-[-3rem] top-[-3rem] bottom-0 -z-10 overflow-hidden border-y border-slate-800/50 bg-slate-950 md:inset-x-[-8rem]">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-55 saturate-[0.9] contrast-125 motion-reduce:hidden"
            autoPlay loop muted playsInline preload="metadata"
            poster="/lvpd-hero-poster.webp"
            aria-hidden="true"
          >
            <source src="/lvpd-hero.webm" type="video/webm" />
            <source src="/lvpd-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-slate-950/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950"></div>
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"></div>
          <div className="hero-grain absolute inset-0 opacity-[0.035]" aria-hidden="true"></div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="grid grid-cols-1 gap-12 pb-8 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-20">
          <div>
            <div className="flex flex-col gap-3 mb-10">
              <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">Secure Network: Active</span>
              </div>
            </div>
            <h1 className="max-w-5xl text-[clamp(3.5rem,8vw,7.5rem)] font-display font-bold uppercase leading-[0.88] tracking-tight text-slate-50 text-balance">
              Las Venturas <br />
              <span className="text-slate-500">Police Dept.</span>
            </h1>
            <p className="mt-10 max-w-xl text-sm font-medium leading-relaxed text-slate-300 md:text-base">
              Sistem pelaporan resmi kegiatan mingguan Kepolisian Futuristic Daerah Las Venturas. Transparansi operasional dan bukti kinerja untuk Pemerintah Kota.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/duty" className="group inline-flex items-center gap-3 bg-blue-600 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0">
                Buka laporan terbaru <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/struktur" className="inline-flex items-center gap-2 border border-slate-600 bg-slate-950/30 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-200 backdrop-blur-sm transition-colors hover:border-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
                Lihat personel <Users className="h-4 w-4 text-blue-400" />
              </Link>
            </div>
          </div>
          <SpotlightPanel className="hidden self-end border-l border-slate-700/80 pl-6 lg:block">
            <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Operational brief</p>
            <div className="space-y-7">
              <div><p className="text-3xl font-display font-bold text-slate-100">24/7</p><p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Network coverage</p></div>
              <div><p className="flex items-center gap-2 text-sm font-semibold text-slate-200"><MapPin className="h-4 w-4 text-cyan-400" /> Las Venturas</p><p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Command region</p></div>
              <div><p className="text-sm font-semibold text-cyan-300">Clearance active</p><p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Public access</p></div>
            </div>
          </SpotlightPanel>
        </div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} className="grid grid-cols-1 border-y border-slate-800/80 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:grid-cols-3">
          <div className="flex items-center gap-3 py-2 sm:border-r sm:border-slate-800/80 sm:pl-1"><ShieldCheck className="h-4 w-4 text-blue-400" /> Verified reporting channel</div>
          <div className="flex items-center gap-3 py-2 sm:border-r sm:border-slate-800/80 sm:pl-6"><Activity className="h-4 w-4 text-cyan-400" /> Live activity monitoring</div>
          <div className="flex items-center gap-3 py-2 sm:pl-6"><MapPin className="h-4 w-4 text-blue-400" /> Las Venturas district</div>
        </motion.div>
      </motion.section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div variants={item} className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-slate-950/80 border border-slate-800 p-6 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <PanelHeader icon={Users} title="Personil Aktif" status={`${activeProfiles.length} anggota`} />
            <p className="text-5xl md:text-6xl font-display font-bold text-slate-50 leading-none">{activeProfiles.length}</p>
            <div className="mt-6 pt-4 border-t border-slate-800 relative z-10">
              <Link to="/struktur" className="group/link inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors">
                Lihat Struktur <ArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-6 flex-1 flex flex-col">
            <PanelHeader icon={Activity} title="Tingkat Aktivitas" status="Minggu 35" />
            <div className="flex-1 w-full min-h-[120px]">
              <Suspense fallback={<div className="h-full w-full animate-pulse bg-slate-950/60" />}>
                <ActivityChart />
              </Suspense>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-9">
          <div className="bg-slate-950/80 border border-slate-800 flex flex-col overflow-hidden h-full group relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent z-10"></div>
            {latestDuty?.photoUrl && (
              <div className="w-full aspect-video relative overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 bg-slate-950/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                <img src={latestDuty.photoUrl} alt="Kegiatan Minggu Ini" width={1200} height={675} loading="lazy" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 z-20">
                  <span className="inline-flex items-center px-3 py-1 bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                    {latestDuty.status}
                  </span>
                </div>
              </div>
            )}
            <div className="p-6 md:p-8 flex flex-col flex-1">
              {latestDuty ? (
                <>
                  <PanelHeader icon={FileText} title="Laporan Terbaru" status={format(new Date(latestDuty.endDate), 'dd MMM yyyy', { locale: id })} />
                  <h4 className="text-2xl md:text-3xl font-display font-bold text-slate-50 mb-2 uppercase">{latestDuty.title}</h4>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
                    Periode: {format(new Date(latestDuty.startDate), 'dd MMM yyyy', { locale: id })} — {format(new Date(latestDuty.endDate), 'dd MMM yyyy', { locale: id })}
                  </p>
                  <p className="mb-6 text-sm leading-relaxed text-slate-400">{latestDuty.description}</p>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">Belum ada laporan</div>
              )}
              <div className="mt-auto">
                <Link to="/duty" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors">
                  Detail Laporan
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DispatchFeed />
        <Suspense fallback={<PanelSkeleton />}>
          <LazyTacticalMap />
        </Suspense>
      </motion.section>
    </motion.div>
  );
}
