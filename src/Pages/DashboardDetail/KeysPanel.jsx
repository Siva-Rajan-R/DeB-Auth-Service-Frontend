import { useState, useEffect } from 'react';
import { useNetworkCalls } from '../../Utils/NetworkCalls';
import { Key, Copy, Check, ShieldAlert, Info } from 'lucide-react';

export const KeysPanel = ({ apikey }) => {
  const [secretDetails, setSecretDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState('');
  const { call } = useNetworkCalls();

  useEffect(() => {
    if (!apikey) { setLoading(false); return; }
    const fetchKeys = async () => {
      setLoading(true);
      const res = await call({ method: 'GET', path: '/user/secrets', withCred: true });
      if (res?.secrets) {
        const currentProject = res.secrets.find(s => s.apikey === apikey);
        if (currentProject) {
          setSecretDetails({ apikey: currentProject.apikey, client_secret: currentProject.client_secret });
        }
      }
      setLoading(false);
    };
    fetchKeys();
  }, [apikey]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const CopyRow = ({ label, value, blur = false, copyId, hint }) => (
    <div className='space-y-2'>
      <label className='text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider block ml-1'>{label}</label>
      <div className={`flex items-center gap-2 bg-[var(--bg-deep)] border rounded-xl p-3 relative group ${
        blur ? 'border-purple-500/30' : 'border-[var(--border-glass)]'
      }`}>
        <code className={`flex-1 text-sm font-mono select-all truncate ${
          blur ? 'text-purple-300 blur-[4px] hover:blur-none transition-all duration-300' : 'text-indigo-400'
        }`}>
          {value}
        </code>
        <button
          onClick={() => handleCopy(value, copyId)}
          className='p-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-navbar)] rounded-lg text-[var(--text-muted)] hover:text-white transition-colors border border-[var(--border-glass)] z-10 flex-shrink-0'
        >
          {copiedKey === copyId ? <Check size={16} className='text-emerald-400' /> : <Copy size={16} />}
        </button>
      </div>
      {hint && (
        <p className='text-[var(--text-dim)] text-[11px] mt-1 ml-1 flex items-center gap-1.5'>
          {hint}
        </p>
      )}
    </div>
  );

  if (!apikey) {
    return (
      <div className='flex flex-col items-center justify-center p-8 text-center h-64'>
        <div className='w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400'>
          <Key size={32} />
        </div>
        <h3 className='text-[var(--text-main)] font-bold text-lg mb-2'>Save Project First</h3>
        <p className='text-[var(--text-muted)] text-sm max-w-xs'>
          You must create and save your configuration before API Keys can be generated.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-8'
    >
      <div>
        <h2 className='text-lg font-bold text-[var(--text-main)] flex items-center gap-2 mb-1'>
          <Key size={20} className='text-indigo-400' />
          API Credentials
        </h2>
        <p className='text-[var(--text-muted)] text-sm'>
          Use these credentials to authenticate your application with the DeB-Auth-Service.
        </p>
      </div>

      <div className='space-y-5'>
        {/* API Key */}
        <div className='bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-5 shadow-sm'>
          <CopyRow
            label='API Key (Client ID)'
            value={secretDetails?.apikey || apikey}
            copyId='apikey'
            hint={
              <><Info size={11} className='text-[var(--text-dim)] flex-shrink-0' /> Used to identify your project. Safe to expose in frontend client code.</>
            }
          />
        </div>

        {/* Client Secret */}
        <div className='bg-[var(--bg-card)] border border-purple-500/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(168,85,247,0.05)]'>
          <CopyRow
            label='Client Secret'
            value={secretDetails?.client_secret || 'Loading...'}
            blur
            copyId='secret'
            hint={
              <><ShieldAlert size={11} className='text-purple-400 flex-shrink-0' /> Keep this secret secure. Never expose in client-side code. Hover to reveal.</>
            }
          />
        </div>
      </div>
    </motion.div>
  );
};

// Import motion dynamically to avoid breaking
import { motion } from 'framer-motion';
