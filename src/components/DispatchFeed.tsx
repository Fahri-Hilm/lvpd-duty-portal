import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal } from 'lucide-react';
import PanelHeader from './PanelHeader';

const mockLogs = [
  "UNIT 2-ADAM MERESPON KODE 3 DI THE STRIP.",
  "LAPORAN PERAMPOKAN DI ROB-A-BIRD, OLD VENTURAS.",
  "DISPATCH, TUNJUKKAN KAMI 10-8 MULAI PATROLI.",
  "UNIT 4-LINCOLN MENUJU ROCA ESCALANTE.",
  "TERSANGKA DITANGKAP DI JULIUS THRUWAY.",
  "PERMINTAAN BACKUP DI KASINO CALIGULA.",
  "STATUS KONDUSIF DI AREA PRICKLE PINE.",
  "UNIT K-9 DIKERAHKAN KE SEKTOR BARAT.",
  "PENGEJARAN KENDARAAN SUSPEK DI GREENGAS",
  "DISPATCH, 10-4, KAMI KEMBALI KE MARKAS."
];

interface LogEntry {
  id: string;
  time: string;
  text: string;
}

export default function DispatchFeed() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initial = mockLogs.slice(0, 3).map((text, i) => ({
      id: Math.random().toString(),
      time: new Date(Date.now() - (3 - i) * 15000).toLocaleTimeString('id-ID', { hour12: false }),
      text
    }));
    setLogs(initial);

    const interval = setInterval(() => {
      setLogs(prev => {
        const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
        const newLog = {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
          text: randomLog
        };
        const updatedLogs = [...prev, newLog];
        return updatedLogs.slice(Math.max(updatedLogs.length - 8, 0));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-950/80 border border-slate-800 p-6 flex flex-col h-full min-h-[300px] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50"></div>

      <PanelHeader icon={Terminal} title="Live Dispatch Feed" live />

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] md:text-xs tracking-wider scrollbar-hide pr-2 flex flex-col justify-end"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              <span className="text-slate-600 shrink-0">[{log.time}]</span>
              <span className="text-cyan-400/60">&gt;</span>
              <span className="text-slate-300">{log.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex gap-4 mt-2">
          <span className="text-slate-800 shrink-0">[{new Date().toLocaleTimeString('id-ID', { hour12: false })}]</span>
          <span className="text-cyan-400 animate-pulse block w-2 h-4 bg-cyan-400/50"></span>
        </div>
      </div>
    </div>
  );
}
