import { useState } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, Check, Copy } from 'lucide-react';

export const TwoFactorPanel = () => {
  const { twoFactor = { enabled: false }, updateTwoFactor = () => {} } = useAuthConfigStore();
  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const isEnabled = twoFactor.enabled;

  return (
    <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'>
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
          <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
        </label>
      </div>

      {isEnabled ? (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className='space-y-5 pt-6 border-t border-[var(--border-glass)] overflow-hidden'
        >
          {/* Info Banner */}
          <div className='flex items-start gap-3 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl'>
            <Info size={16} className='text-cyan-400 flex-shrink-0 mt-0.5' />
            <div className='text-xs text-[var(--text-muted)] leading-relaxed space-y-1.5'>
              <p className='font-bold text-cyan-400 uppercase tracking-wider text-[10px]'>Active Security & User Identification Notice</p>
              <p>
                TOTP (Time-Based One-Time Password) is now integrated into your authentication system.
              </p>
              <p className='text-[11px] text-[var(--text-main)] font-medium bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/20 mt-1'>
                <span className='font-bold text-cyan-300'>🔒 User Identification & Domain Isolation:</span> To properly identify each user, their user identifier (<code className='text-emerald-300 font-mono'>email</code> or <code className='text-emerald-300 font-mono'>mobile_number</code>) is stored with the corresponding product domain ID (<code className='text-emerald-300 font-mono'>client_id</code>). This guarantees a completely separate 2FA secret for each product domain, even when the same user accesses multiple applications under different domains.
              </p>
            </div>
          </div>

          {/* Quick Integration Guide */}
          <div className='space-y-3.5'>
            <h4 className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider pl-1'>Backend Integration Endpoints</h4>
            
            <div className='space-y-3'>
              {/* Endpoint 1 */}
              <div className='bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl p-3.5 space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <span className='text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded'>POST</span>
                  <button 
                    onClick={() => handleCopy('/auth/2fa/setup')}
                    className='text-[var(--text-dim)] hover:text-white transition-colors'
                  >
                    {copiedText === '/auth/2fa/setup' ? <Check size={14} className='text-emerald-400' /> : <Copy size={14} />}
                  </button>
                </div>
                <code className='text-[11px] text-cyan-400 font-mono block'>/auth/2fa/setup</code>
                <p className='text-[10px] text-[var(--text-dim)]'>Generates domain-scoped TOTP secret and returns provisioning URI + Base64 QR Code image.</p>
                <div className='bg-[var(--bg-card)] p-2 rounded-lg text-[10px] font-mono text-[var(--text-muted)] border border-white/5 mt-1'>
                  Payload: &#123; "client_id": "...", "client_secret": "...", "email": "user@domain.com" /* or "mobile_number": "+1234567890" */ &#125;
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className='bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl p-3.5 space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <span className='text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded'>POST</span>
                  <button 
                    onClick={() => handleCopy('/auth/2fa/setup/verify')}
                    className='text-[var(--text-dim)] hover:text-white transition-colors'
                  >
                    {copiedText === '/auth/2fa/setup/verify' ? <Check size={14} className='text-emerald-400' /> : <Copy size={14} />}
                  </button>
                </div>
                <code className='text-[11px] text-cyan-400 font-mono block'>/auth/2fa/setup/verify</code>
                <p className='text-[10px] text-[var(--text-dim)]'>Verifies initial code and permanently activates 2FA for this user & product domain.</p>
                <div className='bg-[var(--bg-card)] p-2 rounded-lg text-[10px] font-mono text-[var(--text-muted)] border border-white/5 mt-1'>
                  Payload: &#123; "client_id": "...", "client_secret": "...", "email": "user@domain.com", "code": "123456" &#125;
                </div>
              </div>

              {/* Endpoint 3 */}
              <div className='bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl p-3.5 space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <span className='text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded'>POST</span>
                  <button 
                    onClick={() => handleCopy('/auth/2fa/verify')}
                    className='text-[var(--text-dim)] hover:text-white transition-colors'
                  >
                    {copiedText === '/auth/2fa/verify' ? <Check size={14} className='text-emerald-400' /> : <Copy size={14} />}
                  </button>
                </div>
                <code className='text-[11px] text-cyan-400 font-mono block'>/auth/2fa/verify</code>
                <p className='text-[10px] text-[var(--text-dim)]'>Verifies time-based verification codes for subsequent application logins on this domain.</p>
                <div className='bg-[var(--bg-card)] p-2 rounded-lg text-[10px] font-mono text-[var(--text-muted)] border border-white/5 mt-1'>
                  Payload: &#123; "client_id": "...", "client_secret": "...", "email": "user@domain.com", "code": "123456" &#125;
                </div>
              </div>
            </div>
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
