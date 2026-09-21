import { useState } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { Link2, CheckCircle2, XCircle, ShieldCheck, Info, Copy, Check, Lock, Smartphone, Mail, ExternalLink, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../config';

const FRONTEND_URL = APP_CONFIG.FRONTEND_URL;

const SIGNIN_FIELDS = [
  {
    key: 'signin_success',
    label: 'Sign In — Success',
    hint: 'Redirect here after a successful sign-in',
    icon: <CheckCircle2 size={13} className='text-blue-600 flex-shrink-0' />,
    placeholder: 'http://127.0.0.1:8900/api/auth/callback',
  },
  {
    key: 'signin_failure',
    label: 'Sign In — Failure',
    hint: 'Redirect here after a failed sign-in attempt (e.g. invalid credentials, verification rejected)',
    icon: <XCircle size={13} className='text-red-600 flex-shrink-0' />,
    placeholder: 'http://127.0.0.1:8900/api/auth/callback',
  },
  {
    key: 'signin_verification',
    label: 'Sign In — Verification / Checking URL (Webhook)',
    hint: 'Called on submit to verify credentials against your database. Must return 2xx to succeed, or 4xx/5xx with { message, status_code } to reject and route to Failure URL.',
    icon: <ShieldCheck size={13} className='text-cyan-600 flex-shrink-0' />,
    placeholder: 'http://127.0.0.1:8900/api/auth/verify-signin',
  },
];

const SIGNUP_FIELDS = [
  {
    key: 'signup_success',
    label: 'Sign Up — Success',
    hint: 'Redirect here after a successful registration',
    icon: <CheckCircle2 size={13} className='text-blue-600 flex-shrink-0' />,
    placeholder: 'http://127.0.0.1:8900/api/auth/callback',
  },
  {
    key: 'signup_failure',
    label: 'Sign Up — Failure',
    hint: 'Redirect here after a failed registration attempt',
    icon: <XCircle size={13} className='text-red-600 flex-shrink-0' />,
    placeholder: 'http://127.0.0.1:8900/api/auth/callback',
  },
  {
    key: 'signup_verification',
    label: 'Sign Up — Verification / Checking URL (Webhook)',
    hint: 'Called on submit to verify registration eligibility. Must return 2xx to succeed, or 4xx/5xx with error message to reject and route to Failure URL.',
    icon: <ShieldCheck size={13} className='text-cyan-600 flex-shrink-0' />,
    placeholder: 'http://127.0.0.1:8900/api/auth/verify-signup',
  },
];

// ─── Autofill URL Builder Component ──────────────────────────────────────────
const AutofillURLBuilder = () => {
  const [valToPrefill, setValToPrefill] = useState('user@example.com');
  const [prefillType, setPrefillType] = useState('email'); // 'email' | 'phone'
  const [method, setMethod] = useState('otp'); // 'otp' | 'password'
  const [flowType, setFlowType] = useState('signin');
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
          <div className='p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600'>
            <Link2 size={16} />
          </div>
          <div>
            <h3 className='text-sm font-bold text-[var(--text-main)]'>Autofill & Lock URL Builder</h3>
            <p className='text-[11px] text-[var(--text-dim)] mt-0.5'>Generate pre-filled and locked auth links</p>
          </div>
        </div>
        <Link 
          to='/auth-docs' 
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 transition-colors'
        >
          Visit Docs <ExternalLink size={12} />
        </Link>
      </div>

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
                    flowType === f ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
                    prefillType === t ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
                    method === m ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
            className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-cyan-500/50 transition-all font-mono'
          />
        </div>

        {/* Generated URL preview */}
        <div className='space-y-1.5'>
          <div className='flex items-center gap-1.5'>
            <label className='text-[10px] font-extrabold text-slate-700 uppercase tracking-widest'>Generated Redirect URL</label>
            <span className='text-[9px] px-2 py-0.5 rounded-full bg-orange-100 border border-orange-300 text-orange-700 font-extrabold'>Replace REQUEST_ID</span>
          </div>
          <div className='flex items-center gap-2 bg-[var(--bg-surface)] border border-cyan-300 rounded-xl p-3 shadow-sm'>
            <code className='flex-1 text-xs text-slate-900 font-mono font-bold break-all leading-relaxed select-all'>
              {fullURL}
            </code>
            <button
              onClick={handleCopy}
              className='p-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white transition-colors border border-cyan-500 shadow-sm flex-shrink-0 flex items-center justify-center'
              title="Copy URL"
            >
              {copied ? <Check size={14} className='text-white' /> : <Copy size={14} className='text-white' />}
            </button>
          </div>
        </div>

        {/* Behaviour note */}
        <div className='flex items-start gap-2.5 p-3.5 rounded-xl bg-cyan-50/80 border border-cyan-200 shadow-sm'>
          <Lock size={15} className='text-cyan-700 flex-shrink-0 mt-0.5' />
          <p className='text-xs text-slate-800 leading-relaxed font-medium'>
            When the user opens this link, the {prefillType} field is <strong className='text-slate-950 font-bold'>pre-filled & locked</strong>.{' '}
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
  const [showWebhookGuide, setShowWebhookGuide] = useState(false);

  return (
    <div className='space-y-6'>
      {/* Header info */}
      <div className='flex items-start gap-3 bg-cyan-50 border border-cyan-200 rounded-2xl p-4'>
        <Link2 size={18} className='text-cyan-600 flex-shrink-0 mt-0.5' />
        <div className='text-xs leading-relaxed'>
          <p className='text-cyan-900 font-semibold'>
            Configure redirect destinations and verification webhooks for authentication events.
          </p>
          <p className='text-cyan-700 mt-1'>
            Verification webhooks check credentials (email existence, password verification, active status) in real time before redirecting.
          </p>
        </div>
      </div>

      {activeMode === 'signin' && (
        <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200'>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className='text-[var(--text-main)] font-bold text-sm'>Sign In Redirects & Verification</h3>
                <p className='text-[11px] text-[var(--text-dim)]'>Destination callbacks & real-time credential verification webhook</p>
              </div>
            </div>
            <Link 
              to='/auth-docs' 
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 transition-colors'
            >
              Visit Docs <ExternalLink size={12} />
            </Link>
          </div>
          <div className='space-y-6'>
            {SIGNIN_FIELDS.map(({ key, label, hint, icon, placeholder }) => (
              <URLField
                key={key}
                fieldKey={key}
                label={label}
                hint={hint}
                icon={icon}
                placeholder={placeholder}
                value={redirectURLs[key] || ''}
                onChange={(val) => updateRedirectURL(key, val)}
              />
            ))}
          </div>
        </div>
      )}

      {activeMode === 'signup' && (
        <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200'>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className='text-[var(--text-main)] font-bold text-sm'>Sign Up Redirects & Verification</h3>
                <p className='text-[11px] text-[var(--text-dim)]'>Destination callbacks & real-time registration verification webhook</p>
              </div>
            </div>
            <Link 
              to='/auth-docs' 
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 transition-colors'
            >
              Visit Docs <ExternalLink size={12} />
            </Link>
          </div>
          <div className='space-y-6'>
            {SIGNUP_FIELDS.map(({ key, label, hint, icon, placeholder }) => (
              <URLField
                key={key}
                fieldKey={key}
                label={label}
                hint={hint}
                icon={icon}
                placeholder={placeholder}
                value={redirectURLs[key] || ''}
                onChange={(val) => updateRedirectURL(key, val)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Verification Webhook Schema Guide */}
      <div className='bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-5 space-y-3 shadow-md'>
        <button
          onClick={() => setShowWebhookGuide(v => !v)}
          className='w-full flex items-center justify-between text-left group'
        >
          <div className='flex items-center gap-2.5'>
            <div className='p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600'>
              <Code2 size={15} />
            </div>
            <span className='text-xs font-bold text-[var(--text-main)] group-hover:text-cyan-600 transition-colors'>
              How does the Verification / Checking URL work?
            </span>
          </div>
          <span className='text-xs font-bold text-cyan-600'>{showWebhookGuide ? 'Hide Details ▲' : 'Show Protocol ▼'}</span>
        </button>

        <AnimatePresence>
          {showWebhookGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='pt-3 border-t border-[var(--border-glass)] space-y-3 text-xs text-[var(--text-muted)]'
            >
              <p>When the user clicks submit on the login portal, DAuth sends an HTTP POST request to your verification endpoint:</p>
              
              <div className='bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl p-3 font-mono text-[11px] text-slate-800 space-y-1'>
                <span className='text-cyan-700 font-bold block'>POST payload sent to your Verification URL:</span>
                <pre className='overflow-x-auto text-slate-700'>{`{
  "request_id": "req_12345",
  "flow_type": "signin",
  "auth_provider": "password",
  "email": "user@example.com",
  "password": "userEnteredPassword",
  "full_name": "...",
  "custom_fields": {},
  "ip": "127.0.0.1",
  "client_id": "your_api_key"
}`}</pre>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 pt-1'>
                <div className='p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5'>
                  <span className='text-emerald-800 font-bold flex items-center gap-1.5'>
                    <CheckCircle2 size={14} className='text-emerald-600' /> Success (200 OK)
                  </span>
                  <p className='text-emerald-900 text-[11px]'>Return HTTP 200 with optional custom metadata. DAuth directly redirects to your <strong>Success URL</strong> with the auth token.</p>
                </div>

                <div className='p-3 bg-red-50 border border-red-200 rounded-xl space-y-1.5'>
                  <span className='text-red-800 font-bold flex items-center gap-1.5'>
                    <XCircle size={14} className='text-red-600' /> Rejection (401 / 403 / 400)
                  </span>
                  <p className='text-red-900 text-[11px]'>Return non-2xx status (e.g. 401) with <code className='font-mono font-bold'>{`{"message": "Incorrect password", "status_code": 401}`}</code>. DAuth shows the error on the portal and immediately routes to your <strong>Failure URL</strong>.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Redirect Autofill Builder */}
      <AutofillURLBuilder />
    </div>
  );
};

const URLField = ({ label, hint, icon, value, placeholder, onChange }) => (
  <div className='space-y-2.5 group/field'>
    <div className='flex items-center gap-2'>
      <div className='opacity-70 group-hover/field:opacity-100 transition-opacity'>{icon}</div>
      <label className='text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest group-hover/field:text-[var(--text-main)] transition-colors'>{label}</label>
    </div>
    <input
      type='url'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'https://yourapp.com/...'}
      className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[var(--text-main)] text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-[var(--bg-card)] transition-all placeholder-[var(--text-dim)] font-medium'
    />
    <p className='text-[var(--text-dim)] text-[11px] font-medium pl-1'>{hint}</p>
  </div>
);

