import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { DndContext, closestCenter, MouseSensor, TouchSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Lock, Users2, KeyRound, ShieldCheck } from 'lucide-react';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { BsMicrosoft } from 'react-icons/bs';
import { MdOutlineSms, MdWarning } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';


const ICONS = {
  password:  <RiLockPasswordLine size={20} className='text-cyan-600'   />,
  google:    <FaGoogle    size={18} className='text-[#ea4335]'    />,
  github:    <FaGithub    size={18} className='text-white'  />,
  facebook:  <FaFacebook  size={20} className='text-[#1877f2]'   />,
  microsoft: <BsMicrosoft size={18} className='text-[#00a4ef]'    />,
  email_otp:  <MdOutlineSms size={20} className='text-emerald-600' />,
  mobile_otp: <MdOutlineSms size={20} className='text-cyan-600' />,
  otp:       <MdOutlineSms size={20} className='text-emerald-600' />,
  totp:      <ShieldCheck size={20} className='text-cyan-600' />,
};


const SortableItem = ({ method, onToggle, enabledCount }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: method.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isLocked = !!method.isLocked;
  const isLastEnabled = method.enabled && enabledCount <= 1;
  const isDisabled = isLocked || isLastEnabled;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-2xl p-4 transition-all hover:border-[var(--border-active)] group/item ${
        method.enabled ? 'bg-[var(--bg-card)]' : 'opacity-60'
      }`}
    >
      <div {...attributes} {...listeners} className='touch-none cursor-grab text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors p-1'>
        <GripVertical size={18} />
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
        method.enabled ? 'bg-[var(--bg-surface)] shadow-lg' : 'bg-[var(--bg-deep)] opacity-50'
      }`}>
        {ICONS[method.id]}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='text-[var(--text-main)] font-bold text-sm truncate'>{method.name}</span>
          {isLocked && (
            <span className='px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 dark:text-orange-600 text-[10px] font-bold rounded-md flex items-center gap-1'>
              <Lock size={10} /> Locked
            </span>
          )}
        </div>
        <span className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest'>
          {isLocked ? 'Locked (Coming Soon)' : (method.enabled ? 'Enabled' : 'Disabled')}
        </span>
      </div>

      <div className='flex items-center gap-3'>
        {isLastEnabled && !isLocked && (
          <div className='flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded-lg' title='At least one method required'>
            <Lock size={12} className='text-orange-600' />
            <span className='text-orange-600 text-[10px] font-bold uppercase'>Required</span>
          </div>
        )}

        <label className={`relative inline-flex items-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
          <input type='checkbox' className='sr-only peer' checked={isLocked ? false : method.enabled} onChange={() => onToggle(method.id)} disabled={isDisabled} />
          <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
        </label>
      </div>
    </div>
  );
};

export const AuthMethodSelector = () => {
  const { authMethods, toggleAuthMethod, reorderAuthMethods, forgotPasswordEnabled, toggleForgotPassword } = useAuthConfigStore();
  const enabledCount = authMethods.filter((m) => m.enabled).length;

  const emailOtp = authMethods.find(m => m.id === 'email_otp');
  const mobileOtp = authMethods.find(m => m.id === 'mobile_otp');
  const oldOtp = authMethods.find(m => m.id === 'otp');

  const isOtpEnabled = !!(emailOtp?.enabled || mobileOtp?.enabled || oldOtp?.enabled);
  const emailOtpEnabled = !!(emailOtp?.enabled || oldOtp?.enabled);
  const mobileOtpEnabled = !!(mobileOtp?.enabled);

  // Build display methods
  const displayMethods = [];
  const addedIds = new Set();
  authMethods.forEach(m => {
    if (m.id === 'email_otp' || m.id === 'otp') {
      if (!addedIds.has('otp')) {
        displayMethods.push({
          id: 'otp',
          name: 'OTP',
          enabled: isOtpEnabled
        });
        addedIds.add('otp');
      }
    } else if (m.id === 'mobile_otp') {
      // skip
    } else {
      displayMethods.push(m);
    }
  });

  const displayEnabledCount = displayMethods.filter(m => m.enabled).length;

  const handleToggle = (id) => {
    if (id === 'otp') {
      if (isOtpEnabled) {
        // Disable both sub-methods if turning off
        if (displayEnabledCount <= 1) return; // Keep at least one provider enabled
        if (emailOtp?.enabled) toggleAuthMethod('email_otp');
        if (oldOtp?.enabled) toggleAuthMethod('otp');
        if (mobileOtp?.enabled) toggleAuthMethod('mobile_otp');
      } else {
        // Turn ON: Enable email OTP by default
        toggleAuthMethod('email_otp');
      }
    } else {
      toggleAuthMethod(id);
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = displayMethods.findIndex((m) => m.id === active.id);
      const newIndex = displayMethods.findIndex((m) => m.id === over.id);
      const rearrangedDisplay = arrayMove(displayMethods, oldIndex, newIndex);
      
      const newRealMethods = [];
      rearrangedDisplay.forEach(dm => {
        if (dm.id === 'otp') {
          if (emailOtp) newRealMethods.push(emailOtp);
          if (oldOtp) newRealMethods.push(oldOtp);
          if (mobileOtp) newRealMethods.push(mobileOtp);
        } else {
          const found = authMethods.find(r => r.id === dm.id);
          if (found) newRealMethods.push(found);
        }
      });
      reorderAuthMethods(newRealMethods);
    }
  };

  return (
    <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200'>
            <Users2 size={18} />
          </div>
          <div>
            <h3 className='text-[var(--text-main)] font-bold text-sm'>Authentication Providers</h3>
            <p className='text-[var(--text-muted)] text-[11px] font-medium'>Manage how users sign into your app</p>
          </div>
        </div>
        <div className='flex items-center gap-2 px-3 py-1 bg-cyan-400/10 border border-cyan-200 rounded-xl'>
          <span className='w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse' />
          <span className='text-cyan-600 text-[10px] font-bold uppercase tracking-widest'>
            {displayEnabledCount} active
          </span>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={displayMethods.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          <div className='space-y-3'>
            <AnimatePresence>
              {displayMethods.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
                  <SortableItem method={m} onToggle={handleToggle} enabledCount={displayEnabledCount} />
                  
                  {/* Forgot Password sub-toggle */}
                  {m.id === 'password' && m.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className='ml-10 mt-2 flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl p-3'
                    >
                      <div className='p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200'>
                        <KeyRound size={14} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <span className='text-[var(--text-main)] font-bold text-xs block'>Forgot Password</span>
                        <span className='text-[var(--text-dim)] text-[9px] font-bold uppercase tracking-widest'>
                          {forgotPasswordEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input type='checkbox' className='sr-only peer' checked={forgotPasswordEnabled} onChange={toggleForgotPassword} />
                        <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 shadow-inner" />
                      </label>
                    </motion.div>
                  )}

                  {/* Email & Mobile OTP sub-toggles */}
                  {m.id === 'otp' && m.enabled && (
                    <div className='space-y-2.5 mt-2 ml-10'>
                      {/* Email OTP sub-toggle */}
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl p-3'
                      >
                        <div className='p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200'>
                          <MdOutlineSms size={14} />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <span className='text-[var(--text-main)] font-bold text-xs block'>Email OTP</span>
                          <span className='text-[var(--text-dim)] text-[9px] font-bold uppercase tracking-widest'>
                            {emailOtpEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input 
                            type='checkbox' 
                            className='sr-only peer' 
                            checked={emailOtpEnabled} 
                            onChange={() => {
                              if (emailOtpEnabled && !mobileOtpEnabled) return; // Keep at least one enabled
                              if (oldOtp?.enabled) toggleAuthMethod('otp');
                              if (emailOtp) toggleAuthMethod('email_otp');
                            }} 
                          />
                          <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 shadow-inner" />
                        </label>
                      </motion.div>

                      {/* Mobile OTP sub-toggle */}
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='flex flex-col gap-2 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl p-3'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='p-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200'>
                            <MdOutlineSms size={14} />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <span className='text-[var(--text-main)] font-bold text-xs block'>Mobile OTP</span>
                            <span className='text-[var(--text-dim)] text-[9px] font-bold uppercase tracking-widest'>
                              {mobileOtpEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          <label className='relative inline-flex items-center cursor-pointer'>
                            <input 
                              type='checkbox' 
                              className='sr-only peer' 
                              checked={mobileOtpEnabled} 
                              onChange={() => {
                                if (mobileOtpEnabled && !emailOtpEnabled) return; // Keep at least one enabled
                                if (mobileOtp) toggleAuthMethod('mobile_otp');
                              }} 
                            />
                            <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 shadow-inner" />
                          </label>
                        </div>
                        {mobileOtpEnabled && (
                          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1.5 rounded-lg flex items-center gap-1.5 animate-fade-in shadow-sm">
                            <MdWarning size={12} className="shrink-0" />
                            <span className="text-[10px] font-bold tracking-wide">Charged separately: ₹0.40 / OTP</span>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
