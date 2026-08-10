import { Edit3, Trash2, ShieldCheck, Mail, Smartphone, Lock, Key } from 'lucide-react';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { GoogleIcon, MicrosoftIcon } from './ProviderIcons';

const METHOD_ICON_MAP = {
  google: <GoogleIcon size={16} />,
  Google: <GoogleIcon size={16} />,
  G: <GoogleIcon size={16} />,
  github: <FaGithub size={16} className="text-[#24292e]" />,
  GitHub: <FaGithub size={16} className="text-[#24292e]" />,
  facebook: <FaFacebook size={16} className="text-[#1877F2]" />,
  Facebook: <FaFacebook size={16} className="text-[#1877F2]" />,
  F: <FaFacebook size={16} className="text-[#1877F2]" />,
  microsoft: <MicrosoftIcon size={16} />,
  Microsoft: <MicrosoftIcon size={16} />,
  'otp-email': <Mail size={16} className="text-teal-600" />,
  email_otp: <Mail size={16} className="text-teal-600" />,
  email: <Mail size={16} className="text-teal-600" />,
  Email: <Mail size={16} className="text-teal-600" />,
  E: <Mail size={16} className="text-teal-600" />,
  'otp-phone': <Smartphone size={16} className="text-sky-600" />,
  mobile_otp: <Smartphone size={16} className="text-sky-600" />,
  phone: <Smartphone size={16} className="text-sky-600" />,
  otp: <Smartphone size={16} className="text-sky-600" />,
  OTP: <Smartphone size={16} className="text-sky-600" />,
  M: <Smartphone size={16} className="text-sky-600" />,
  password: <Lock size={16} className="text-cyan-600" />,
  Password: <Lock size={16} className="text-cyan-600" />,
  P: <Lock size={16} className="text-cyan-600" />,
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

export const DashboardCards = ({ logoUrl, title, authMethods = [], ssoEnabled = false, lastUpdated, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className='group relative flex flex-col items-start justify-between gap-5 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-md hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer overflow-hidden w-full h-full'
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
          className='w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 border border-slate-200 hover:border-cyan-300 transition-all shadow-sm active:scale-95'
        >
          <Edit3 size={15} />
        </button>
        <button
          onClick={onDelete}
          title="Delete Project"
          className='w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-300 transition-all shadow-sm active:scale-95'
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Top Left: Logo + Title + Active Status Badge */}
      <div className='flex items-center gap-4 relative z-10 w-full pr-16'>
        <div className='w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-cyan-300 transition-colors shadow-sm'>
          {logoUrl ? (
            <img src={logoUrl} alt="logo" className='w-full h-full object-cover' />
          ) : (
            <div className='text-cyan-600'>
              <ShieldCheck size={26} />
            </div>
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <h2 className='text-slate-900 font-extrabold text-base truncate tracking-tight group-hover:text-cyan-600 transition-colors'>
              {title || 'Untitled Project'}
            </h2>
            {ssoEnabled && (
              <span className='bg-cyan-100 text-cyan-800 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-cyan-200'>
                SSO
              </span>
            )}
          </div>
          <div className='flex items-center gap-1.5 mt-1'>
            <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            <p className='text-slate-500 text-[10px] font-bold uppercase tracking-widest'>ACTIVE</p>
          </div>
        </div>
      </div>

      {/* Bottom: Provider Badges with Official Logos */}
      <div className='relative z-10 w-full flex flex-col items-start flex-1 mt-2'>
        <div className='text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2'>
          Enabled Auth Providers
        </div>
        <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide w-full flex-wrap'>
          {(() => {
            const methods = authMethods.filter(m => typeof m === 'string' || (typeof m === 'object' && m.enabled));
            if (methods.length === 0) return <p className='text-slate-400 text-xs font-medium italic'>No methods configured</p>;
            
            return methods.map((m, idx) => {
              const id = typeof m === 'object' ? m.id : m;
              const titleStr = typeof m === 'object' ? m.name : m;
              const icon = METHOD_ICON_MAP[id] || METHOD_ICON_MAP[titleStr];
              const label = METHOD_LABEL_MAP[id] || METHOD_LABEL_MAP[titleStr] || titleStr;
              
              return (
                <div
                  key={id || idx}
                  title={label}
                  className='flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-bold hover:border-cyan-300 transition-all cursor-default shadow-sm'
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