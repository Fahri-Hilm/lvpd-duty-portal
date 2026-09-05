import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
}

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', action?: ToastAction) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, action }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, action ? 8000 : 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-24 right-4 z-[100] flex max-w-[calc(100vw-2rem)] flex-col gap-3 pointer-events-none md:bottom-6 md:right-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`
                pointer-events-auto flex w-full min-w-0 items-start gap-3 border bg-slate-950 p-4 sm:min-w-[300px]
                ${toast.type === 'success' ? 'border-green-500/50' : 
                  toast.type === 'error' ? 'border-red-500/50' : 
                  toast.type === 'warning' ? 'border-yellow-500/50' : 'border-blue-500/50'}
                relative overflow-hidden group shadow-2xl
              `}
            >
              <div className={`absolute left-0 top-0 w-1 h-full 
                ${toast.type === 'success' ? 'bg-green-500' : 
                  toast.type === 'error' ? 'bg-red-500' : 
                  toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}
              `}></div>
              
              <Terminal className={`w-4 h-4 mt-0.5 
                ${toast.type === 'success' ? 'text-green-500' : 
                  toast.type === 'error' ? 'text-red-500' : 
                  toast.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}
              `} />
              
              <div className="flex-1 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                   Notifikasi sistem
                </span>
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide leading-relaxed">
                  {toast.message}
                </p>
                {toast.action && (
                  <button type="button" onClick={() => { toast.action?.onClick(); setToasts(prev => prev.filter(item => item.id !== toast.id)); }}
                    className="mt-3 self-start border border-slate-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-300 transition-colors hover:border-blue-500 hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                    {toast.action.label}
                  </button>
                )}
              </div>

              <button 
                aria-label="Tutup notifikasi"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
