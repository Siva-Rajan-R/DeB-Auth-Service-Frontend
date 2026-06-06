import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '../Store/useToastStore';
import { CheckCircle2, XCircle } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`pointer-events-auto flex items-center justify-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-white/90 dark:bg-black/90' 
                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 bg-white/90 dark:bg-black/90'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
            <p className="font-bold text-sm text-center tracking-wide leading-tight">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
