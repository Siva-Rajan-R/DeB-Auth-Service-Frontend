import { useState } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { Link2, CheckCircle2, XCircle, Info, Copy, Check, Lock, Smartphone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

const URL_FIELDS = [
  {
    key: 'signin_success',
    label: 'Sign In — Success',
    hint: 'Redirect here after a successful sign-in',
    icon: <CheckCircle2 size={13} className='text-emerald-400 flex-shrink-0' />,
    accent: 'emerald',
  },
  {
    key: 'signin_failure',
    label: 'Sign In — Failure',
    hint: 'Redirect here after a failed sign-in attempt',
    icon: <XCircle size={13} className='text-red-400 flex-shrink-0' />,
    accent: 'red',
  },
  {
    key: 'signup_success',
    label: 'Sign Up — Success',
    hint: 'Redirect here after a successful registration',
    icon: <CheckCircle2 size={13} className='text-emerald-400 flex-shrink-0' />,
    accent: 'emerald',
  },
  {
    key: 'signup_failure',
    label: 'Sign Up — Failure',
    hint: 'Redirect here after a failed registration',
    icon: <XCircle size={13} className='text-red-400 flex-shrink-0' />,
    accent: 'red',
  },
];

// ─── Autofill URL Builder Component ──────────────────────────────────────────
const AutofillURLBuilder = () => {
  const [valToPrefill, setValToPrefill] = useState('user@example.com');
  const [prefillType, setPrefillType] = useState('email'); // 'email' | 'phone'
  const [method, setMethod] = useState('otp'); // 'otp' | 'password'
  const [flowType, setFlowType] = useState('signin');
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseAuthURL = `${FRONTEND_URL}/auth/REQUEST_ID/${flowType}`;
  
  // Build query params
  const paramName = prefillType === 'email' ? 'prefill_email' : 'prefill_phone';
  const fullURL = `${baseAuthURL}?${paramName}=${encodeURIComponent(valToPrefill)}&lock_method=${method}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-card)] overflow-hidden shadow-xl mt-6'>
      {/* Header */}
      <div className='flex items-center justify-between px-5 py-4 border-b border-[var(--border-glass)]'>
        <div className='flex items-center gap-2.5'>
          <div className='p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'>
            <Link2 size={16} />
          </div>
          <div>
            <h3 className='text-sm font-bold text-[var(--text-main)]'>Autofill & Lock URL Builder</h3>
            <p className='text-[11px] text-[var(--text-dim)] mt-0.5'>Generate pre-filled and locked auth links</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(v => !v)}
          className={`p-1.5 rounded-lg transition-colors ${showInfo ? 'text-indigo-400 bg-indigo-500/10' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}
        >
          <Info size={15} />
        </button>
      </div>

      {/* Info box */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='overflow-hidden'
          >
            <div className='px-5 py-4 bg-indigo-500/5 border-b border-indigo-500/15 space-y-2 text-xs text-[var(--text-muted)] leading-relaxed'>
              <p className='font-bold text-indigo-400 uppercase tracking-wider text-[10px]'>How it works</p>
              <ul className='space-y-1.5 list-none'>
                <li className='flex gap-2'><span className='text-indigo-400 flex-shrink-0'>→</span> Append <code className='text-indigo-300 bg-indigo-500/10 px-1 rounded'>?prefill_email=EMAIL</code> or <code className='text-indigo-300 bg-indigo-500/10 px-1 rounded'>?prefill_phone=PHONE</code> to pre-populate inputs.</li>
                <li className='flex gap-2'><span className='text-indigo-400 flex-shrink-0'>→</span> Add <code className='text-indigo-300 bg-indigo-500/10 px-1 rounded'>lock_method=otp</code> or <code className='text-indigo-300 bg-indigo-500/10 px-1 rounded'>lock_method=password</code> to lock that field and jump directly to that step.</li>
                <li className='flex gap-2'><span className='text-indigo-400 flex-shrink-0'>→</span> <strong className='text-[var(--text-main)]'>Request-Time Autofill</strong>: You can also specify these values in your backend auth request body instead of the URL, keeping your frontend link clean and simple.</li>
                <li className='flex gap-2'><span className='text-indigo-400 flex-shrink-0'>→</span> For OTP, the code is <strong className='text-[var(--text-main)]'>automatically sent</strong> on page load, displaying only the code verification screen.</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Builder controls */}
      <div className='p-5 space-y-4'>
        <div className='grid grid-cols-3 gap-3'>
          {/* Flow */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest block'>Flow</label>
            <div className='flex gap-1 p-1 bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl'>
              {['signin', 'signup'].map(f => (
                <button
                  key={f}
                  onClick={() => setFlowType(f)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    flowType === f ? 'bg-indigo-500 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest block'>Prefill Type</label>
            <div className='flex gap-1 p-1 bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl'>
              {['email', 'phone'].map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setPrefillType(t);
                    setValToPrefill(t === 'email' ? 'user@example.com' : '+15550199');
                  }}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    prefillType === t ? 'bg-indigo-500 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Lock Method */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest block'>Lock Method</label>
            <div className='flex gap-1 p-1 bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl'>
              {['otp', 'password'].map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    method === m ? 'bg-indigo-500 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >{m}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Value */}
        <div className='space-y-1.5'>
          <label className='text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest flex items-center gap-1.5'>
            {prefillType === 'email' ? <Mail size={11} /> : <Smartphone size={11} />}
            {prefillType === 'email' ? 'Email Address' : 'Mobile Number'}
          </label>
          <input
            type={prefillType === 'email' ? 'email' : 'text'}
            value={valToPrefill}
            onChange={e => setValToPrefill(e.target.value)}
            placeholder={prefillType === 'email' ? 'user@example.com' : '+15550199'}
            className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-indigo-500/50 transition-all font-mono'
          />
        </div>

        {/* Generated URL preview */}
        <div className='space-y-1.5'>
          <div className='flex items-center gap-1.5'>
            <label className='text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest'>Generated Redirect URL</label>
            <span className='text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 font-bold'>Replace REQUEST_ID</span>
          </div>
          <div className='flex items-center gap-2 bg-[var(--bg-deep)] border border-indigo-500/20 rounded-xl p-3'>
            <code className='flex-1 text-[11px] text-indigo-400 font-mono break-all leading-relaxed'>
              {fullURL}
            </code>
            <button
              onClick={handleCopy}
              className='p-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg text-indigo-400 transition-colors border border-indigo-500/20 flex-shrink-0'
            >
              {copied ? <Check size={14} className='text-emerald-400' /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Behaviour note */}
        <div className='flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-glass)]'>
          <Lock size={12} className='text-[var(--text-dim)] flex-shrink-0 mt-0.5' />
          <p className='text-[11px] text-[var(--text-dim)] leading-relaxed'>
            When the user opens this link, the {prefillType} field is <strong className='text-[var(--text-muted)]'>pre-filled & locked</strong>.{' '}
            {method === 'otp'
              ? 'An OTP is automatically dispatched on page load — they only need to enter the code.'
              : 'They only need to enter their password.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Main RedirectURLPanel ────────────────────────────────────────────────────
export const RedirectURLPanel = () => {
  const { redirectURLs, updateRedirectURL, activeMode } = useAuthConfigStore();

  return (
    <div className='space-y-6'>
      {/* Header info */}
      <div className='flex items-start gap-3 bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4'>
        <Link2 size={18} className='text-indigo-400 flex-shrink-0 mt-0.5' />
        <p className='text-indigo-300 text-xs leading-relaxed font-medium'>
          Configure where users are redirected after authentication events, or build pre-filled links for direct authentication flows.
        </p>
      </div>

      {activeMode === 'signin' && (
        <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'>
              <CheckCircle2 size={18} />
            </div>
            <h3 className='text-[var(--text-main)] font-bold text-sm'>Sign In Redirects</h3>
          </div>
          <div className='space-y-6'>
            {URL_FIELDS.slice(0, 2).map(({ key, label, hint, icon }) => (
              <URLField
                key={key}
                fieldKey={key}
                label={label}
                hint={hint}
                icon={icon}
                value={redirectURLs[key] || ''}
                onChange={(val) => updateRedirectURL(key, val)}
              />
            ))}
          </div>
        </div>
      )}

      {activeMode === 'signup' && (
        <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'>
              <CheckCircle2 size={18} />
            </div>
            <h3 className='text-[var(--text-main)] font-bold text-sm'>Sign Up Redirects</h3>
          </div>
          <div className='space-y-6'>
            {URL_FIELDS.slice(2).map(({ key, label, hint, icon }) => (
              <URLField
                key={key}
                fieldKey={key}
                label={label}
                hint={hint}
                icon={icon}
                value={redirectURLs[key] || ''}
                onChange={(val) => updateRedirectURL(key, val)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Redirect Autofill Builder */}
      <AutofillURLBuilder />
    </div>
  );
};

const URLField = ({ label, hint, icon, value, onChange }) => (
  <div className='space-y-2.5 group/field'>
    <div className='flex items-center gap-2'>
      <div className='opacity-70 group-hover/field:opacity-100 transition-opacity'>{icon}</div>
      <label className='text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest group-hover/field:text-[var(--text-main)] transition-colors'>{label}</label>
    </div>
    <input
      type='url'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='https://yourapp.com/...'
      className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-[var(--bg-card)] transition-all placeholder-[var(--text-dim)] font-medium'
    />
    <p className='text-[var(--text-dim)] text-[11px] font-medium pl-1'>{hint}</p>
  </div>
);
