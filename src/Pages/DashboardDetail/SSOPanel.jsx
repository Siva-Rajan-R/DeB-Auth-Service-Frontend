import { useState } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';

const validate = (domain) => {
  const d = domain.trim().toLowerCase().replace(/^https?:\/\//, '');
  if (!d) return null;
  const ok =
    /^(?:\*\.)?[a-zA-Z0-9][-a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(d) ||  // domain.com / *.domain.com
    /^\*[a-zA-Z0-9-]+\*?$/.test(d) ||                                   // *domain or *domain*
    /^[a-zA-Z0-9-]+\*$/.test(d);                                         // domain*
  return ok ? d : null;
};

export const SSOPanel = () => {
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
          <div className='p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'>
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 className='text-[var(--text-main)] font-bold text-sm'>SSO Configuration</h3>
            <p className='text-[var(--text-muted)] text-[11px] font-medium'>Enterprise single sign-on domains</p>
          </div>
        </div>
        <label className='relative inline-flex items-center cursor-pointer'>
          <input type='checkbox' className='sr-only peer' checked={sso.enabled} onChange={toggleSSO} />
          <div className="w-11 h-6 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-full peer peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
        </label>
      </div>

      {sso.enabled && (
        <div className='space-y-4 pt-6 border-t border-[var(--border-glass)]'>
          <div className='flex gap-3'>
            <div className='flex-1 space-y-2'>
              <input
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder='*.domain.com or app.com'
                className={`w-full bg-[var(--bg-deep)] border ${error ? 'border-red-500/50' : 'border-[var(--border-glass)]'} rounded-xl px-4 py-2.5 text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-[var(--bg-card)] transition-all placeholder-[var(--text-dim)] font-medium`}
              />
            </div>
            <button
              onClick={handleAdd}
              className='bg-indigo-500 hover:bg-indigo-400 text-slate-950 px-5 rounded-xl transition-all flex items-center gap-2 text-sm font-bold shadow-lg shadow-indigo-500/20 active:scale-95'
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
                    className='flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs px-3 py-2 rounded-xl group/domain'
                  >
                    <span className='font-mono'>{d.domain}</span>
                    <button onClick={() => removeSSODomain(d.id)} className='text-indigo-500/50 hover:text-red-400 transition-colors p-0.5'>
                      <Trash2 size={14} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
