import { Edit3, Trash2, ShieldCheck, Mail, Smartphone, Lock, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogo, GithubLogo, FacebookLogo, MicrosoftLogo } from './BrandLogos';

const METHOD_ICON_MAP = {
  google: <GoogleLogo size={16} />,
  Google: <GoogleLogo size={16} />,
  G: <GoogleLogo size={16} />,
  github: <GithubLogo size={16} className="text-[#181717]" />,
  GitHub: <GithubLogo size={16} className="text-[#181717]" />,
  facebook: <FacebookLogo size={16} />,
  Facebook: <FacebookLogo size={16} />,
  F: <FacebookLogo size={16} />,
  microsoft: <MicrosoftLogo size={16} />,
  Microsoft: <MicrosoftLogo size={16} />,
  'otp-email': <Mail size={16} className="text-indigo-600" />,
  email_otp: <Mail size={16} className="text-indigo-600" />,
  email: <Mail size={16} className="text-indigo-600" />,
  Email: <Mail size={16} className="text-indigo-600" />,
  E: <Mail size={16} className="text-indigo-600" />,
  'otp-phone': <Smartphone size={16} className="text-indigo-600" />,
  mobile_otp: <Smartphone size={16} className="text-indigo-600" />,
  phone: <Smartphone size={16} className="text-indigo-600" />,
  otp: <Smartphone size={16} className="text-indigo-600" />,
  OTP: <Smartphone size={16} className="text-indigo-600" />,
  M: <Smartphone size={16} className="text-indigo-600" />,
  password: <Lock size={16} className="text-slate-600" />,
  Password: <Lock size={16} className="text-slate-600" />,
  P: <Lock size={16} className="text-slate-600" />,
  passkey: <Key size={16} className="text-purple-600" />,
  Passkey: <Key size={16} className="text-purple-600" />,
};

const METHOD_LABEL_MAP = {
  google: 'Google',
  github: 'GitHub',
  facebook: 'Facebook',
  microsoft: 'Microsoft',
  'otp-email': 'Email OTP',
  email_otp: 'Email OTP',
  'otp-phone': 'SMS OTP',
  mobile_otp: 'SMS OTP',
  password: 'Password',
  passkey: 'Passkeys',
  G: 'Google',
  F: 'Facebook',
  E: 'Email OTP',
  M: 'SMS OTP',
  P: 'Password',
};

export const DashboardCards = ({ logoUrl, title, authMethods = [], ssoEnabled = false, onEdit, onDelete, isActive = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className='group relative flex flex-col items-start justify-between gap-5 bg-[#f3f6fa] border border-white/90 rounded-[24px] p-6 shadow-[10px_10px_24px_rgba(165,175,195,0.45),-10px_-10px_24px_rgba(255,255,255,0.9)] hover:shadow-[14px_14px_30px_rgba(165,175,195,0.6),-14px_-14px_30px_rgba(255,255,255,0.95)] transition-all duration-300 cursor-pointer overflow-hidden w-full h-full'
      onClick={onEdit}
    >
      {/* Top Right Action buttons */}
      <div
        className='absolute top-5 right-5 flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onEdit}
          title="Edit Project"
          className='w-8 h-8 flex items-center justify-center rounded-xl bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/90 transition-all shadow-sm active:scale-95'
        >
          <Edit3 size={15} />
        </button>
        <button
          onClick={onDelete}
          title="Delete Project"
          className='w-8 h-8 flex items-center justify-center rounded-xl bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200/90 transition-all shadow-sm active:scale-95'
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Top Left: Logo + Title + Status Dot */}
      <div className='flex items-center gap-4 relative z-10 w-full pr-16'>
        <div className='w-12 h-12 rounded-2xl bg-[#f0f4fa] border border-white/90 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-[4px_4px_10px_rgba(165,175,195,0.45),-4px_-4px_10px_rgba(255,255,255,0.95)]'>
          {logoUrl ? (
            <img src={logoUrl} alt="logo" className='w-full h-full object-cover' />
          ) : (
            <img src="/dauth_logo.png" alt="DAuth Logo" className="w-7 h-7 object-contain" />
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <h2 className='text-slate-900 font-extrabold text-base truncate tracking-tight group-hover:text-cyan-600 transition-colors'>
              {title || 'Untitled Project'}
            </h2>
            {ssoEnabled && (
              <span className='bg-cyan-100 text-cyan-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-cyan-300/80'>
                SSO
              </span>
            )}
          </div>
          <div className='flex items-center gap-1.5 mt-1'>
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <p className='text-slate-600 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1'>
              <span>{isActive ? 'Active' : 'Inactive'}</span>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </p>
          </div>
        </div>
      </div>

      {/* Bottom: Provider Badges */}
      <div className='relative z-10 w-full flex flex-col items-start flex-1 mt-2'>
        <div className='text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5'>
          Enabled Auth Providers
        </div>
        <div className='flex items-center gap-2.5 overflow-x-auto scrollbar-hide w-full flex-wrap'>
          {(() => {
            const methods = authMethods.filter(m => typeof m === 'string' || (typeof m === 'object' && m.enabled));
            if (methods.length === 0) return <p className='text-slate-500 text-xs font-medium italic'>No methods configured</p>;
            
            return methods.map((m, idx) => {
              const id = typeof m === 'object' ? m.id : m;
              const titleStr = typeof m === 'object' ? m.name : m;
              const icon = METHOD_ICON_MAP[id] || METHOD_ICON_MAP[titleStr];
              const label = METHOD_LABEL_MAP[id] || METHOD_LABEL_MAP[titleStr] || titleStr;
              
              return (
                <div
                  key={id || idx}
                  title={label}
                  className='flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#f0f4fa] border border-white/90 text-slate-900 text-xs font-extrabold shadow-[3px_3px_8px_rgba(165,175,195,0.35),-3px_-3px_8px_rgba(255,255,255,0.95)] hover:shadow-[5px_5px_12px_rgba(165,175,195,0.5),-5px_-5px_12px_rgba(255,255,255,0.95)] transition-all cursor-default'
                >
                  <div className="flex justify-center items-center">
                    {icon || <span className='text-xs font-bold text-slate-700'>{titleStr?.[0]?.toUpperCase() || '?'}</span>}
                  </div>
                  <span>{label}</span>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </motion.div>
  );
};