import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { DndContext, closestCenter, MouseSensor, TouchSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Lock, Users2, KeyRound } from 'lucide-react';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { BsMicrosoft } from 'react-icons/bs';
import { MdOutlineSms } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';

const ICONS = {
  password:  <RiLockPasswordLine size={20} className='text-indigo-400'   />,
  google:    <FaGoogle    size={18} className='text-[#ea4335]'    />,
  github:    <FaGithub    size={18} className='text-white'  />,
  facebook:  <FaFacebook  size={20} className='text-[#1877f2]'   />,
  microsoft: <BsMicrosoft size={18} className='text-[#00a4ef]'    />,
  otp:       <MdOutlineSms size={20} className='text-emerald-400' />,
};

const SortableItem = ({ method, onToggle, enabledCount }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: method.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isLastEnabled = method.enabled && enabledCount <= 1;

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
        <span className='text-[var(--text-main)] font-bold text-sm block truncate'>{method.name}</span>
        <span className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest'>
          {method.enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      <div className='flex items-center gap-3'>
        {isLastEnabled && (
          <div className='flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg' title='At least one method required'>
            <Lock size={12} className='text-amber-400' />
            <span className='text-amber-400 text-[10px] font-bold uppercase'>Locked</span>
          </div>
        )}

        <label className={`relative inline-flex items-center ${isLastEnabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
          <input type='checkbox' className='sr-only peer' checked={method.enabled} onChange={() => onToggle(method.id)} disabled={isLastEnabled} />
          <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
        </label>
      </div>
    </div>
  );
};

export const AuthMethodSelector = () => {
  const { authMethods, toggleAuthMethod, reorderAuthMethods, forgotPasswordEnabled, toggleForgotPassword } = useAuthConfigStore();
  const enabledCount = authMethods.filter((m) => m.enabled).length;

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
      const oldIndex = authMethods.findIndex((m) => m.id === active.id);
      const newIndex = authMethods.findIndex((m) => m.id === over.id);
      reorderAuthMethods(arrayMove(authMethods, oldIndex, newIndex));
    }
  };

  return (
    <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'>
            <Users2 size={18} />
          </div>
          <div>
            <h3 className='text-[var(--text-main)] font-bold text-sm'>Authentication Providers</h3>
            <p className='text-[var(--text-muted)] text-[11px] font-medium'>Manage how users sign into your app</p>
          </div>
        </div>
        <div className='flex items-center gap-2 px-3 py-1 bg-indigo-400/10 border border-indigo-500/20 rounded-xl'>
          <span className='w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse' />
          <span className='text-indigo-400 text-[10px] font-bold uppercase tracking-widest'>
            {enabledCount} active
          </span>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={authMethods.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          <div className='space-y-3'>
            <AnimatePresence>
              {authMethods.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
                  <SortableItem method={m} onToggle={toggleAuthMethod} enabledCount={enabledCount} />
                  {/* Forgot Password sub-toggle — only for 'password' method when enabled */}
                  {m.id === 'password' && m.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className='ml-10 mt-2 flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl p-3'
                    >
                      <div className='p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20'>
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
