import { Edit3, Trash2, ShieldCheck, Mic2 } from 'lucide-react';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { MdOutlineSms } from 'react-icons/md';
import { motion } from 'framer-motion';
import { BsMicrosoft } from 'react-icons/bs';

const METHOD_ICON_MAP = {
  Google:    <FaGoogle    size={14} />,
  GitHub:    <FaGithub    size={14} />,
  Facebook:  <FaFacebook  size={14} />,
  Microsoft: <BsMicrosoft size={14} />,
  OTP:       <MdOutlineSms size={14} />,
  google:    <FaGoogle    size={14} />,
  github:    <FaGithub    size={14} />,
  facebook:  <FaFacebook  size={14} />,
  microsoft: <BsMicrosoft size={14} />,
  otp:       <MdOutlineSms size={14} />,
};

export const DashboardCards = ({ logoUrl, title, authMethods = [], ssoEnabled = false, lastUpdated, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className='group relative flex flex-col items-start justify-between gap-5 bg-white/60 backdrop-blur-xl border border-white/50 rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.1)] hover:border-indigo-200 transition-all duration-300 cursor-pointer overflow-hidden w-full h-full'
      onClick={onEdit}
    >
      {/* Glow Effect on Hover */}
      <div className='absolute inset-0 bg-gradient-to-r from-blue-400/5 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />

      {/* Top Right Action buttons */}
      <div
        className='absolute top-4 right-4 flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onEdit}
          className='w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 hover:border-indigo-200 transition-all shadow-sm active:scale-95'
        >
          <Edit3 size={15} />
        </button>
        <button
          onClick={onDelete}
          className='w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-100 hover:border-red-200 transition-all shadow-sm active:scale-95'
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Top Left: Logo + Info */}
      <div className='flex items-center gap-4 relative z-10 w-full pr-16'>
        <div className='w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white group-hover:border-indigo-100 transition-colors shadow-sm'>
          {logoUrl
            ? <img src={logoUrl} alt="logo" className='w-full h-full object-cover' />
            : <div className='w-7 h-7 text-indigo-500'>
                <ShieldCheck size={28} />
              </div>}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <h2 className='text-slate-900 font-bold text-base truncate tracking-tight group-hover:text-indigo-600 transition-colors'>
              {title || 'Untitled Project'}
            </h2>
            {ssoEnabled && (
              <span className='bg-indigo-50/80 text-indigo-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-100/50'>
                SSO
              </span>
            )}
          </div>
          <div className='flex items-center gap-1.5 mt-0.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
            <p className='text-slate-500 text-[10px] font-bold uppercase tracking-widest'>Active</p>
          </div>
        </div>
      </div>

      {/* Bottom: Auth Methods */}
      <div className='relative z-10 w-full flex flex-col items-start flex-1 mt-2'>
        <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide w-full flex-wrap'>
          {(() => {
            const methods = authMethods.filter(m => typeof m === 'string' || (typeof m === 'object' && m.enabled));
            if (methods.length === 0) return <p className='text-slate-400 text-xs font-medium italic'>No methods configured</p>;
            
            return methods.map((m, idx) => {
              const id = typeof m === 'object' ? m.id : m;
              const titleStr = typeof m === 'object' ? m.name : m;
              
              return (
                <div
                  key={id || idx}
                  title={titleStr}
                  className='flex-shrink-0 w-8 h-8 rounded-lg bg-white/80 border border-white flex items-center justify-center text-slate-500 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all cursor-default shadow-sm'
                >
                  {METHOD_ICON_MAP[id] || <span className='text-xs font-bold'>{titleStr?.[0]?.toUpperCase() || '?'}</span>}
                </div>
              );
            });
          })()}
        </div>
      </div>
    </motion.div>
  );
};