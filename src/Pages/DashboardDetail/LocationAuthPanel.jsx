import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, AlertTriangle, SwitchCamera, Info } from 'lucide-react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';

export const LocationAuthPanel = () => {
  const { locationAuth, setLocationAuth } = useAuthConfigStore();

  const isEnabled = locationAuth || false;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 max-w-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
            <MapPin size={18} className="text-cyan-500" />
            Location Based Authentication
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Enforce geographic tracking and restrict access by capturing coordinates during sign-in and sign-up.
          </p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-slate-300/80 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        {/* Header/Toggle Row */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-xl transition-colors ${isEnabled ? 'bg-cyan-500/15 text-cyan-700 border border-cyan-300' : 'bg-slate-200/80 text-slate-600 border border-slate-300'}`}>
                <MapPin size={18} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Enable Location Auth</h3>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              When enabled, users will be prompted by their browser to grant location permissions. Their latitude and longitude will be attached to the final JWT payload.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={isEnabled}
              onChange={(e) => setLocationAuth(e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-300 border border-slate-400/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 peer-checked:border-cyan-700 shadow-inner"></div>
          </label>
        </div>

        {/* Warning Box */}
        <AnimatePresence>
          {isEnabled && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-2.5">
                <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-500 mb-0.5">Strict Requirement</h4>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    If users deny location access or their browser blocks it, they will <strong>not be able to authenticate</strong>. Ensure this fits your use case (e.g. fraud prevention, delivery tracking apps).
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};
