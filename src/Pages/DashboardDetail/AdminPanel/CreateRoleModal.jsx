import { useState } from 'react';
import { useAuthConfigStore } from '../../../Store/useAuthConfigStore';
import { X, Plus } from 'lucide-react';

export const CreateRoleModal = ({ onCreated, onClose }) => {
  const { addAdminRole, adminRoles } = useAuthConfigStore();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Role name cannot be empty.'); return; }
    if (adminRoles.some((r) => r.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('A role with this name already exists.');
      return;
    }
    addAdminRole(trimmed);
    // Find the new role (last non-default with this name)
    // Pass name so parent can match it to the newly created role id
    onCreated?.(trimmed);
    onClose();
  };

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm'>
      <div className='bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl w-[380px] shadow-2xl'>
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-[var(--border-glass)] bg-[var(--bg-navbar)] rounded-t-2xl'>
          <h3 className='text-[var(--text-main)] font-semibold text-sm flex items-center gap-2'>
            <Plus size={15} className='text-purple-400' />
            Create New Role
          </h3>
          <button onClick={onClose} className='text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors'>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className='p-5 space-y-4'>
          <div className='space-y-1.5'>
            <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Role Name</label>
            <input
              autoFocus
              type='text'
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder='e.g. Moderator, Editor, Viewer'
              className={`w-full bg-[var(--bg-deep)] border rounded-xl px-4 py-2.5 text-[var(--text-main)] text-sm focus:outline-none transition-colors placeholder-[var(--text-dim)] ${
                error ? 'border-red-500/50 focus:border-red-500' : 'border-[var(--border-glass)] focus:border-purple-500/50'
              }`}
            />
            {error && <p className='text-red-400 text-xs font-medium'>{error}</p>}
          </div>
          <p className='text-[var(--text-muted)] text-[11px] font-medium'>This role will be available for all users and can be assigned per product.</p>
        </div>

        {/* Footer */}
        <div className='flex gap-3 px-5 pb-5'>
          <button
            onClick={onClose}
            className='flex-1 border border-[var(--border-glass)] hover:border-[var(--border-active)] text-[var(--text-dim)] hover:text-[var(--text-main)] bg-[var(--bg-surface)] rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest transition-all'
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className='flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-purple-600/20'
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};
