import { useState } from 'react';
import { Key, ShieldAlert, Lock, Clock, Copy, Check } from 'lucide-react';

export const SecuritySettings = () => {
  const [copied, setCopied] = useState(false);
  const apiKey = 'sk_test_51NxO2zK9s...' + Math.random().toString(36).substring(2, 8);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h3 className='text-[var(--text-main)] font-bold text-lg mb-1'>Security Settings</h3>
        <p className='text-[var(--text-muted)] text-xs font-medium'>Manage global security policies and API access.</p>
      </div>

      {/* API Keys */}
      <div className='bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-6 shadow-sm space-y-4'>
        <div className='flex items-center gap-3 border-b border-[var(--border-glass)] pb-4'>
          <div className='p-2 bg-amber-500/10 text-amber-500 rounded-xl'>
            <Key size={18} />
          </div>
          <div>
            <h4 className='text-[var(--text-main)] font-bold text-sm'>API Keys</h4>
            <p className='text-[var(--text-dim)] text-[11px] font-medium'>Keys used to authenticate your backend server.</p>
          </div>
        </div>
        
        <div className='space-y-3 pt-2'>
          <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Secret Key (Test Mode)</label>
          <div className='flex items-center gap-3'>
            <div className='flex-1 bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-2.5 font-mono text-sm text-[var(--text-main)] flex items-center justify-between shadow-inner'>
              <span className='truncate'>{apiKey}</span>
              <button 
                onClick={handleCopy}
                className='text-[var(--text-dim)] hover:text-indigo-400 transition-colors p-1'
                title='Copy API Key'
              >
                {copied ? <Check size={16} className='text-emerald-500' /> : <Copy size={16} />}
              </button>
            </div>
            <button className='bg-[var(--bg-surface)] border border-[var(--border-glass)] hover:border-[var(--border-active)] text-[var(--text-main)] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm'>
              Roll Key
            </button>
          </div>
          <p className='text-amber-500/80 text-[11px] font-medium mt-2 flex items-center gap-1.5 bg-amber-500/5 px-3 py-2 rounded-lg border border-amber-500/10 w-fit'>
            <ShieldAlert size={12} /> Do not expose this key in client-side code.
          </p>
        </div>
      </div>

      {/* Security Policies */}
      <div className='bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-6 shadow-sm space-y-5'>
        <div className='flex items-center gap-3 border-b border-[var(--border-glass)] pb-4'>
          <div className='p-2 bg-purple-500/10 text-purple-500 rounded-xl'>
            <Lock size={18} />
          </div>
          <div>
            <h4 className='text-[var(--text-main)] font-bold text-sm'>Global Policies</h4>
            <p className='text-[var(--text-dim)] text-[11px] font-medium'>Enforce security rules across all users.</p>
          </div>
        </div>

        <div className='space-y-4 pt-2'>
          <PolicyToggle 
            title='Require Multi-Factor Authentication (MFA)' 
            description='Force all admins and editors to set up MFA.' 
            defaultChecked={false} 
          />
          <PolicyToggle 
            title='Strong Password Policy' 
            description='Require minimum 12 chars, uppercase, numbers, and symbols.' 
            defaultChecked={true} 
          />
        </div>
      </div>

      {/* Session Management */}
      <div className='bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-6 shadow-sm space-y-5'>
        <div className='flex items-center gap-3 border-b border-[var(--border-glass)] pb-4'>
          <div className='p-2 bg-indigo-500/10 text-indigo-500 rounded-xl'>
            <Clock size={18} />
          </div>
          <div>
            <h4 className='text-[var(--text-main)] font-bold text-sm'>Session Management</h4>
            <p className='text-[var(--text-dim)] text-[11px] font-medium'>Control how long users stay logged in.</p>
          </div>
        </div>

        <div className='pt-2'>
          <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block mb-2'>Session Timeout</label>
          <select className='w-full max-w-xs bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-2.5 text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-500/50 shadow-inner appearance-none custom-select-arrow'>
            <option value='15m'>15 Minutes</option>
            <option value='1h'>1 Hour</option>
            <option value='24h' selected>24 Hours</option>
            <option value='7d'>7 Days</option>
          </select>
        </div>
      </div>

    </div>
  );
};

const PolicyToggle = ({ title, description, defaultChecked }) => {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className='flex items-start justify-between gap-4 p-4 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)]/50 hover:bg-[var(--bg-surface)] transition-colors'>
      <div>
        <h5 className='text-[var(--text-main)] text-sm font-bold'>{title}</h5>
        <p className='text-[var(--text-dim)] text-[11px] font-medium mt-1'>{description}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out border-2 border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${checked ? 'bg-indigo-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-[var(--bg-deep)] border-[var(--border-glass)]'}`}
      >
        <span className='sr-only'>Toggle {title}</span>
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};
