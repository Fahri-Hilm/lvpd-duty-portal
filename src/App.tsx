import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { ToastProvider } from './components/ToastContext';

const Duty = lazy(() => import('./pages/Duty'));
const Archive = lazy(() => import('./pages/Archive'));
const Members = lazy(() => import('./pages/Members'));
const Structure = lazy(() => import('./pages/Structure'));
const Admin = lazy(() => import('./pages/Admin'));

function RouteLoading() {
  return (
    <div className="flex min-h-[18rem] items-center justify-center border border-slate-800 bg-slate-900/70">
      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        <span className="h-2 w-2 animate-pulse bg-cyan-400" />
        Loading secure channel
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="duty" element={<Duty />} />
              <Route path="arsip" element={<Archive />} />
              <Route path="anggota" element={<Members />} />
              <Route path="struktur" element={<Structure />} />
              <Route path="admin/*" element={<Admin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  );
}
