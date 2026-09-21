import { useState } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShieldAlert, Lock } from 'lucide-react';

const validate = (domain) => {
  const d = domain.trim().toLowerCase().replace(/^https?:\/\//, '');
  if (!d) return null;
  const ok =
    /^(?:\*\.)?[a-zA-Z0-9][-a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(d) ||  // domain.com / *.domain.com
    /^\*[a-zA-Z0-9-]+\*?$/.test(d) ||                                   // *domain or *domain*
    /^[a-zA-Z0-9-]+\*$/.test(d);                                         // domain*
  return ok ? d : null;
};

export const SSOPanel = ({ onOpenAdmin }) => {
  const { sso, toggleSSO, addSSODomain, removeSSODomain } = useAuthConfigStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    setError('');
    const clean = validate(input);
    if (!clean) { setError('Invalid format. Try: app.com | *.app.com | *app*'); return; }
    if (sso.domains.some((d) => d.domain === clean)) { setError('Already added.'); return; }
    addSSODomain(clean);
    setInput('');
  };

  return (
    <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200'>
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 className='text-[var(--text-main)] font-bold text-sm'>SSO Configuration</h3>
            <p className='text-[var(--text-muted)] text-[11px] font-medium'>Enterprise single sign-on domains</p>
          </div>
        </div>

        {/* Active Toggle Switch / Lock Badge */}
        {sso.isLocked ? (
          <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-amber-500/30 text-orange-600 text-xs font-semibold select-none'>
            <Lock size={13} />
            <span>Locked</span>
          </div>
        ) : (
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={sso.enabled}
              onChange={toggleSSO}
            />
            <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
          </label>
        )}
      </div>

      {sso.isLocked ? (
        <div className='p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs leading-relaxed flex items-start gap-3'>
          <Lock size={18} className='mt-0.5 shrink-0 text-orange-600' />
          <div>
            <span className='font-bold text-orange-900 block mb-0.5'>SSO Integration Locked</span>
            Single Sign-On (SSO) is currently locked by system policy. Cross-site wildcard domain authentication is disabled.
          </div>
        </div>
      ) : !sso.enabled && (
        <div className='text-xs text-[var(--text-dim)] leading-relaxed pl-1'>
          Single sign-on is disabled. Enable this module to configure wildcard domains for seamless cross-site authentication sharing.
        </div>
      )}

      {sso.enabled && (
        <div className='space-y-6 pt-6 border-t border-[var(--border-glass)]'>
          <div className='flex gap-3'>
            <div className='flex-1 space-y-2'>
              <input
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder='*.domain.com or app.com'
                className={`w-full bg-[var(--bg-deep)] border ${error ? 'border-red-500/50' : 'border-[var(--border-glass)]'} rounded-xl px-4 py-2.5 text-[var(--text-main)] text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-[var(--bg-card)] transition-all placeholder-[var(--text-dim)] font-medium`}
              />
            </div>
            <button
              onClick={handleAdd}
              className='bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 rounded-xl transition-all flex items-center gap-2 text-sm font-bold shadow-lg shadow-cyan-500/20 active:scale-95'
            >
              <Plus size={18} /> Add
            </button>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className='text-red-400 text-[11px] font-medium flex items-center gap-1.5 pl-1'>
              <ShieldAlert size={12} /> {error}
            </motion.p>
          )}

          {sso.domains.length > 0 && (
            <div className='flex flex-wrap gap-2 pt-2'>
              <AnimatePresence>
                {sso.domains.map((d) => (
                  <motion.span
                    key={d.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className='flex items-center gap-2 bg-cyan-50 border border-cyan-400/20 text-cyan-300 text-xs px-3 py-2 rounded-xl group/domain'
                  >
                    <span className='font-mono'>{d.domain}</span>
                    <button onClick={() => removeSSODomain(d.id)} className='text-cyan-500/50 hover:text-red-400 transition-colors p-0.5'>
                      <Trash2 size={14} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className='border-t border-[var(--border-glass)] pt-5 flex flex-col gap-3'>
            <div>
              <h4 className='text-xs font-bold text-[var(--text-main)] mb-1'>SSO Admin Console</h4>
              <p className='text-[10px] text-[var(--text-dim)]'>Monitor logged users, sessions, locations, and roles for this Single Sign-On cluster.</p>
            </div>
            <button
              onClick={() => {
                const id = new URLSearchParams(window.location.search).get('id');
                window.open(`/admin-portal${id ? `?id=${id}` : ''}`, '_blank');
              }}
              className='w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all text-xs font-bold shadow-md shadow-purple-600/20 active:scale-[0.98]'
            >
              Open Admin Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


