import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Map, MapPin, Radio } from 'lucide-react';
import PanelHeader from './PanelHeader';

const districts = [
  { name: 'THE STRIP', status: 'KONDUSIF', color: 'text-green-400', bg: 'bg-green-400', sector: { top: '30%', left: '60%' } },
  { name: 'OLD VENTURAS', status: 'PATROLI AKTIF', color: 'text-blue-400', bg: 'bg-blue-400', sector: { top: '55%', left: '45%' } },
  { name: 'PRICKLE PINE', status: 'KONDUSIF', color: 'text-green-400', bg: 'bg-green-400', sector: { top: '20%', left: '35%' } },
  { name: 'ROCA ESCALANTE', status: 'INVESTIGASI', color: 'text-yellow-400', bg: 'bg-yellow-400', sector: { top: '65%', left: '25%' } },
  { name: 'BONE COUNTY', status: 'KONDUSIF', color: 'text-green-400', bg: 'bg-green-400', sector: { top: '80%', left: '55%' } }
];

export default function TacticalMap() {
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let start: number;
    let active = true;

    const step = (timestamp: number) => {
      if (!active) return;
      if (start === undefined) start = timestamp;
      const elapsed = timestamp - start;
      setRotation((elapsed / 20) % 360);
      animationFrameId = window.requestAnimationFrame(step);
    };

    // Pause when tab hidden
    const onVisibility = () => {
      if (document.hidden) {
        active = false;
        window.cancelAnimationFrame(animationFrameId);
      } else {
        active = true;
        start = undefined;
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) {
      animationFrameId = window.requestAnimationFrame(step);
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      active = false;
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const handleClick = useCallback((name: string) => {
    setSelected(prev => prev === name ? null : name);
  }, []);

  const selectedDistrict = districts.find(d => d.name === selected);

  return (
    <div className="bg-slate-950/80 border border-slate-800 p-6 flex flex-col md:flex-row gap-8 items-start md:items-stretch h-full group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>

      {/* Radar Section */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full border border-blue-500/30 bg-slate-900/50 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.1)]">

        {/* GTA SA Map */}
        <div
          className="absolute inset-0 z-0 opacity-70"
          style={{
            backgroundImage: "url('https://www.gta-sanandreas.com/guides/maps/gta-san-andreas-map.webp')",
            backgroundSize: "280%",
            backgroundPosition: "85% 15%",
            filter: "grayscale(100%) sepia(100%) hue-rotate(180deg) saturate(300%) contrast(150%) brightness(40%)"
          }}
        ></div>

        {/* Grid lines */}
        <div className="absolute w-full h-px bg-blue-500/20 z-0"></div>
        <div className="absolute h-full w-px bg-blue-500/20 z-0"></div>
        <div className="absolute w-3/4 h-3/4 rounded-full border border-blue-500/20 z-0"></div>
        <div className="absolute w-2/4 h-2/4 rounded-full border border-blue-500/20 z-0"></div>

        {/* Radar Sweep */}
        <div
          className="absolute inset-0 origin-center rounded-full z-10 motion-reduce:hidden"
          style={{
            background: 'conic-gradient(from 0deg, transparent 70%, rgba(59, 130, 246, 0.4) 100%)',
            transform: `rotate(${rotation}deg)`
          }}
        ></div>

        {/* District Blips */}
        {districts.map(d => (
          <button
            key={d.name}
            onClick={() => handleClick(d.name)}
            className={`absolute w-2.5 h-2.5 rounded-full z-20 transition-all duration-300 cursor-pointer ${
              selected === d.name
                ? 'scale-150 shadow-[0_0_12px_3px_rgba(255,255,255,0.6)] ring-2 ring-white/60'
                : 'animate-ping hover:scale-125'
            } ${d.bg}`}
            style={{ top: d.sector.top, left: d.sector.left, animationDuration: selected === d.name ? '0s' : '3s' }}
            aria-label={`Pilih distrik ${d.name}`}
          />
        ))}

        {/* Center dot */}
        <div className="w-1 h-1 bg-white rounded-full relative z-20 shadow-[0_0_5px_rgba(255,255,255,1)]"></div>
      </div>

      {/* District Status */}
      <div className="flex-1 flex flex-col justify-center w-full min-w-0">
        <PanelHeader icon={Map} title="Tactical Sector Map" status={`${districts.length} sektor`} />

        {/* 2-column grid: Name | Status */}
        <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0">
          {districts.map((district) => (
            <button
              key={district.name}
              onClick={() => handleClick(district.name)}
              className={`col-span-2 grid grid-cols-[1fr_auto] gap-x-4 items-center py-3 border-b border-slate-800/60 last:border-b-0 transition-colors text-left ${
                selected === district.name ? 'bg-slate-800/40 -mx-3 px-3 border border-slate-700/50' : 'hover:bg-slate-800/20'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className={`h-3 w-3 shrink-0 transition-colors ${selected === district.name ? 'text-white' : 'text-slate-600'}`} />
                <span className="whitespace-nowrap text-[11px] font-semibold tracking-wider text-slate-300 truncate">{district.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${district.bg}`}></span>
                <span className={`whitespace-nowrap text-[9px] font-bold uppercase tracking-widest ${district.color}`}>{district.status}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected district detail */}
        {selectedDistrict && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1"
          >
            <p className="font-semibold text-slate-200">{selectedDistrict.name}</p>
            <p>Status: <span className={selectedDistrict.color}>{selectedDistrict.status}</span></p>
            <p className="text-slate-600">Klik marker di peta atau baris di atas untuk memilih distrik lain.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
