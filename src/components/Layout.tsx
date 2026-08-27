import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Shield, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Duty Faction', path: '/duty' },
    { name: 'Arsip', path: '/arsip' },
    { name: 'Anggota', path: '/anggota' },
    { name: 'Struktur', path: '/struktur' },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
      <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-50 relative overflow-hidden selection:bg-blue-500 selection:text-slate-950">
      
      {/* Tech Grid Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
          backgroundSize: '4rem 4rem'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950"></div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950" onClick={closeMenu}>
              <Shield className="w-6 h-6 text-blue-500" />
             <span className="font-display font-bold text-xl tracking-wider uppercase text-slate-50 transition-colors group-hover:text-blue-300">LVPD</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-6 text-[11px] font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                  location.pathname === link.path ? 'text-blue-400 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-blue-400' : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-px h-4 bg-slate-800 mx-2"></div>
            <Link
              to="/admin"
              className="text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              Admin
            </Link>
            <a href="https://discord.gg/vNnYfCqtZH" target="_blank" rel="noreferrer" className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
              Discord
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="md:hidden p-2 text-slate-400 transition-colors hover:text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`text-sm font-bold uppercase tracking-widest ${
                  location.pathname === link.path ? 'text-blue-400' : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-slate-800 my-2"></div>
            <Link
              to="/admin"
              onClick={closeMenu}
              className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-slate-50"
            >
              Admin Login
            </Link>
            <a href="https://discord.gg/vNnYfCqtZH" target="_blank" rel="noreferrer" onClick={closeMenu} className="text-sm font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300">
              Discord Community
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-16 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 mt-auto relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">LVPD Duty Portal</span>
              <p className="text-[11px] font-semibold text-slate-300">Kepolisian Futuristic Daerah Las Venturas</p>
            </div>
          </div>
          <div className="flex flex-col text-left md:text-right">
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status Sistem</span>
             <p className="text-[11px] font-semibold text-slate-300 flex items-center gap-2 md:justify-end">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Online & Secured
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
