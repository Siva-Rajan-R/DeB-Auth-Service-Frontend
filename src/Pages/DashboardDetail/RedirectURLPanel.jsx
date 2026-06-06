import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { Link2, CheckCircle2, XCircle } from 'lucide-react';

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

export const RedirectURLPanel = () => {
  const { redirectURLs, updateRedirectURL, activeMode } = useAuthConfigStore();

  return (
    <div className='space-y-6'>
      {/* Header info */}
      <div className='flex items-start gap-3 bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4'>
        <Link2 size={18} className='text-indigo-400 flex-shrink-0 mt-0.5' />
        <p className='text-indigo-300 text-xs leading-relaxed font-medium'>
          Configure where users are redirected after authentication events. Leave blank to use the default behavior.
        </p>
      </div>

      {activeMode === 'signin' && (
        /* Sign In Section */
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
                value={redirectURLs[key]}
                onChange={(val) => updateRedirectURL(key, val)}
              />
            ))}
          </div>
        </div>
      )}

      {activeMode === 'signup' && (
        /* Sign Up Section */
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
                value={redirectURLs[key]}
                onChange={(val) => updateRedirectURL(key, val)}
              />
            ))}
          </div>
        </div>
      )}
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
