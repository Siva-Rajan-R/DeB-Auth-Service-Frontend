import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { Plus, Trash2, GripVertical, UserPlus2 } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';

const FIELD_TYPE_OPTIONS = [
  { value: 'text',     label: 'Text'     },
  { value: 'email',    label: 'Email'    },
  { value: 'number',   label: 'Number'   },
  { value: 'password', label: 'Password' },
];

const selectStyles = {
  control: (b) => ({
    ...b, 
    backgroundColor: 'rgba(15, 23, 42, 0.5)', 
    borderColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: '0.75rem',
    minHeight: '34px', 
    boxShadow: 'none', 
    '&:hover': { borderColor: 'rgba(34, 211, 238, 0.3)' },
  }),
  menu: (b) => ({ 
    ...b, 
    backgroundColor: '#0f172a', 
    borderRadius: '0.75rem', 
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    overflow: 'hidden',
  }),
  option: (b, s) => ({
    ...b, 
    backgroundColor: s.isFocused ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
    color: s.isFocused ? 'white' : '#94a3b8', 
    fontSize: '0.8125rem', 
    padding: '8px 12px',
    cursor: 'pointer',
  }),
  singleValue: (b) => ({ ...b, color: '#f1f5f9', fontSize: '0.8125rem' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (b) => ({ ...b, color: '#64748b', padding: '4px' }),
};

const SortableField = ({ field }) => {
  const { removeSignupField, updateSignupField } = useAuthConfigStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className='bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-2xl p-5 space-y-4 hover:border-[var(--border-active)] transition-all group/field'>
      <div className='flex items-center gap-3 justify-between'>
        <div className='flex items-center gap-3'>
          <div {...attributes} {...listeners} className='cursor-grab text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors p-1'>
            <GripVertical size={16} />
          </div>
          <span className='text-[var(--text-main)] font-bold text-sm tracking-tight'>{field.label || 'Unnamed Field'}</span>
        </div>
        <button onClick={() => removeSignupField(field.id)} className='text-[var(--text-dim)] hover:text-red-400 transition-colors p-1.5 hover:bg-red-400/10 rounded-lg'>
          <Trash2 size={16} />
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <label className='text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest block'>Label</label>
          <input
            value={field.label}
            onChange={(e) => updateSignupField(field.id, { label: e.target.value })}
            className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-3 py-2 text-sm text-[var(--text-main)] focus:border-indigo-500/50 outline-none transition-all placeholder-[var(--text-dim)] font-medium'
            placeholder='e.g. Phone Number'
          />
        </div>
        <div className='space-y-1.5'>
          <label className='text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest block'>Field Key</label>
          <input
            value={field.name}
            onChange={(e) => updateSignupField(field.id, { name: e.target.value })}
            className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-3 py-2 text-sm text-[var(--text-main)] focus:border-indigo-500/50 outline-none font-mono transition-all placeholder-[var(--text-dim)]'
            placeholder='e.g. phone_number'
          />
        </div>
        <div className='space-y-1.5'>
          <label className='text-slate-500 text-[10px] font-bold uppercase tracking-widest block'>Type</label>
          <Select
            options={FIELD_TYPE_OPTIONS}
            value={FIELD_TYPE_OPTIONS.find((o) => o.value === field.type) || FIELD_TYPE_OPTIONS[0]}
            onChange={(opt) => updateSignupField(field.id, { type: opt.value })}
            styles={selectStyles}
            isSearchable={false}
          />
        </div>
        <div className='flex items-center pt-4'>
          <label className='flex items-center gap-3 cursor-pointer group/check'>
            <div className='relative flex items-center'>
              <input
                type='checkbox'
                checked={field.required}
                onChange={(e) => updateSignupField(field.id, { required: e.target.checked })}
                className='w-5 h-5 accent-indigo-500 rounded-lg cursor-pointer'
              />
            </div>
            <span className='text-slate-400 text-xs font-bold uppercase tracking-widest group-hover/check:text-slate-200 transition-colors'>Required</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export const SignUpBuilder = () => {
  const { signupFields, addSignupField, reorderSignupFields, activeMode } = useAuthConfigStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = signupFields.findIndex((f) => f.id === active.id);
      const newIndex = signupFields.findIndex((f) => f.id === over.id);
      reorderSignupFields(arrayMove(signupFields, oldIndex, newIndex));
    }
  };

  if (activeMode !== 'signup') {
    return (
      <div className='flex flex-col items-center justify-center py-12 px-6 text-center space-y-4 bg-white/[0.02] border border-white/5 rounded-2xl'>
        <div className='p-4 rounded-full bg-slate-800/50 text-slate-600'>
          <UserPlus2 size={32} />
        </div>
        <div>
          <h3 className='text-slate-400 font-bold text-sm'>Sign-Up Builder</h3>
          <p className='text-slate-600 text-xs mt-1 max-w-[240px] mx-auto leading-relaxed'>
            Switch to <b>Sign Up</b> mode in the preview to configure custom registration fields.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 space-y-6 shadow-xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'>
            <UserPlus2 size={18} />
          </div>
          <div>
            <h3 className='text-[var(--text-main)] font-bold text-sm'>Registration Fields</h3>
            <p className='text-[var(--text-muted)] text-[11px] font-medium'>Additional data to collect during sign-up</p>
          </div>
        </div>
        <button
          onClick={addSignupField}
          className='flex items-center gap-2 text-xs font-bold text-slate-950 bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95'
        >
          <Plus size={16} /> Add Field
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={signupFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className='space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar'>
            <AnimatePresence>
              {signupFields.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-slate-600 text-xs text-center py-8 bg-slate-900/30 rounded-2xl border border-dashed border-white/5'>
                  No extra fields. Click "Add Field" to start building your form.
                </motion.div>
              ) : (
                signupFields.map((f) => (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
                    <SortableField field={f} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
