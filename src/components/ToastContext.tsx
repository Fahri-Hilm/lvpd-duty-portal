import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`
                pointer-events-auto flex items-start gap-3 p-4 min-w-[300px] bg-slate-950 border 
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
                  System Notification
                </span>
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button 
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
