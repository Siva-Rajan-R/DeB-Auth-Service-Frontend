import { useState } from 'react';
import { useAuthConfigStore } from '../../../Store/useAuthConfigStore';
import { Plus, Pencil, Trash2, Check, X, ShieldCheck } from 'lucide-react';

export const RoleManager = () => {
  const { adminRoles, addAdminRole, updateAdminRole, removeAdminRole } = useAuthConfigStore();
  const [newRoleName, setNewRoleName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleCreate = () => {
    const name = newRoleName.trim();
    if (!name) return;
    addAdminRole(name);
    setNewRoleName('');
  };

  const startEdit = (role) => {
    setEditingId(role.id);
    setEditValue(role.name);
  };

  const confirmEdit = () => {
    const name = editValue.trim();
    if (!name) return;
    updateAdminRole(editingId, name);
    setEditingId(null);
  };

  const defaultRoles = adminRoles.filter((r) => r.isDefault);
  const customRoles  = adminRoles.filter((r) => !r.isDefault);

  return (
    <div className='space-y-6'>
      {/* Default Roles */}
      <div>
        <h4 className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2'>
          <ShieldCheck size={12} /> Default Roles
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {defaultRoles.map((role) => (
            <div key={role.id} className='flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-2xl px-5 py-3.5 shadow-sm'>
              <div className='flex items-center gap-3'>
                <div className='p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400'>
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <span className='text-[var(--text-main)] text-sm font-bold block'>{role.name}</span>
                  <span className='text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-tighter'>System Protected</span>
                </div>
              </div>
              <span className='text-[10px] px-2 py-0.5 rounded-lg font-bold bg-[var(--bg-deep)] text-[var(--text-dim)] border border-[var(--border-glass)] uppercase tracking-widest'>default</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Roles */}
      {customRoles.length > 0 && (
        <div>
          <h4 className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest mb-4'>Custom Roles</h4>
          <div className='space-y-2.5'>
            {customRoles.map((role) => (
              <div key={role.id} className='flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl px-5 py-3 group hover:border-[var(--border-active)] transition-all shadow-sm'>
                {editingId === role.id ? (
                  <div className='flex items-center gap-3 flex-1'>
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') setEditingId(null); }}
                      className='flex-1 bg-[var(--bg-deep)] border border-indigo-500/50 rounded-xl px-4 py-2 text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-500 shadow-inner'
                    />
                    <div className='flex items-center gap-1.5'>
                      <button onClick={confirmEdit} className='text-emerald-500 hover:bg-emerald-500/10 transition-all p-2 rounded-xl'>
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className='text-[var(--text-dim)] hover:bg-white/5 transition-all p-2 rounded-xl'>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : confirmDeleteId === role.id ? (
                  <div className='flex items-center gap-4 flex-1'>
                    <span className='text-red-500 text-sm font-bold flex-1'>Remove "{role.name}"?</span>
                    <div className='flex items-center gap-3'>
                      <button onClick={() => { removeAdminRole(role.id); setConfirmDeleteId(null); }}
                        className='text-xs bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20'>
                        Confirm
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className='text-xs text-[var(--text-dim)] font-bold hover:text-[var(--text-main)] transition-colors'>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' />
                      <span className='text-[var(--text-main)] text-sm font-bold'>{role.name}</span>
                    </div>
                    <div className='flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0'>
                      <button onClick={() => startEdit(role)} className='text-[var(--text-dim)] hover:text-indigo-400 transition-all p-2 rounded-xl hover:bg-indigo-400/10 border border-transparent hover:border-indigo-400/20'>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setConfirmDeleteId(role.id)} className='text-[var(--text-dim)] hover:text-red-400 transition-all p-2 rounded-xl hover:bg-red-400/10 border border-transparent hover:border-red-400/20'>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Role Input */}
      <div className='pt-4'>
        <h4 className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest mb-4'>Create New Role</h4>
        <div className='flex gap-3'>
          <input
            type='text'
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder='Role name (e.g. Moderator)'
            className='flex-1 bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-2xl px-5 py-3 text-[var(--text-main)] text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder-[var(--text-dim)] font-medium shadow-inner'
          />
          <button
            onClick={handleCreate}
            disabled={!newRoleName.trim()}
            className='flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-600/20 active:scale-95'
          >
            <Plus size={16} /> Create
          </button>
        </div>
      </div>
    </div>
  );
};
