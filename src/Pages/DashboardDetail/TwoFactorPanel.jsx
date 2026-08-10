import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';

export const TwoFactorPanel = () => {
  const { twoFactor = { enabled: false }, updateTwoFactor = () => {} } = useAuthConfigStore();

  const isEnabled = twoFactor.enabled;

  return (
    <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-blue-100 text-blue-600 border border-blue-200'>
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className='text-[var(--text-main)] font-bold text-sm'>Two-Factor Authentication (2FA)</h3>
            <p className='text-[var(--text-muted)] text-[11px] font-medium'>Enhance user security with TOTP authentication</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <label className='relative inline-flex items-center cursor-pointer'>
          <input 
            type='checkbox' 
            className='sr-only peer' 
            checked={isEnabled} 
            onChange={(e) => updateTwoFactor({ enabled: e.target.checked })} 
          />
          <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
        </label>
      </div>

      {isEnabled ? (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className='space-y-5 pt-6 border-t border-[var(--border-glass)] overflow-hidden'
        >
          {/* Info Banner */}
          <div className='flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl'>
            <Info size={16} className='text-blue-500 flex-shrink-0 mt-0.5' />
            <div className='text-xs text-[var(--text-muted)] leading-relaxed space-y-1.5'>
              <p className='font-bold text-blue-800 uppercase tracking-wider text-[10px]'>Active Security & User Identification Notice</p>
              <p className='text-slate-700'>
                TOTP (Time-Based One-Time Password) is now integrated into your authentication system.
              </p>
              <p className='text-[11px] text-slate-700 font-medium bg-white p-2.5 rounded-xl border border-blue-100 mt-1'>
                <span className='font-bold text-blue-700'>🔒 User Identification & Domain Isolation:</span> To properly identify each user, their user identifier (<code className='text-blue-600 font-mono font-bold bg-blue-50 px-1 py-0.5 rounded'>email</code> or <code className='text-blue-600 font-mono font-bold bg-blue-50 px-1 py-0.5 rounded'>mobile_number</code>) is stored with the corresponding product domain ID (<code className='text-purple-600 font-mono font-bold bg-purple-50 px-1 py-0.5 rounded'>client_id</code>). This guarantees a completely separate 2FA secret for each product domain, even when the same user accesses multiple applications under different domains.
              </p>
            </div>
          </div>

          {/* Docs Navigation Action */}
          <div className='pt-2 flex flex-col gap-2'>
            <button
              onClick={() => window.open('/auth-docs#endpoints-2fa', '_blank')}
              className='w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]'
            >
              <ExternalLink size={14} />
              View 2FA Endpoint Documentation
            </button>
          </div>
        </motion.div>
      ) : (
        <div className='text-xs text-[var(--text-dim)] leading-relaxed pl-1'>
          Two-factor authentication is disabled. Enable this module to generate domain-scoped authenticator secrets and QR codes for user security.
        </div>
      )}
    </div>
  );
};
