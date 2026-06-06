import { useState } from 'react';
import { useAuthConfigStore } from '../../../Store/useAuthConfigStore';
import { Pencil, Trash2, Clock, Package } from 'lucide-react';

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
};

export const UserTable = ({ onEdit }) => {
  const { adminUsers, adminRoles, removeAdminUser } = useAuthConfigStore();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const getRoleName = (roleId) => adminRoles.find((r) => r.id === roleId)?.name || roleId;

  if (adminUsers.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <div className='w-16 h-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-glass)] flex items-center justify-center mb-6 shadow-inner'>
          <Package size={28} className='text-[var(--text-dim)]' />
        </div>
        <p className='text-[var(--text-main)] text-sm font-bold mb-2'>No users yet</p>
        <p className='text-[var(--text-muted)] text-xs font-medium'>Click "Add User" to create the first admin user.</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-deep)]/30 backdrop-blur-sm'>
      <table className='w-full text-sm border-collapse'>
        <thead>
          <tr className='bg-[var(--bg-surface)] border-b border-[var(--border-glass)]'>
            <th className='px-5 py-4 text-left text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest'>Name</th>
            <th className='px-5 py-4 text-left text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest'>Email</th>
            <th className='px-5 py-4 text-left text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest'>Products</th>
            <th className='px-5 py-4 text-left text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest'>Last Login</th>
            <th className='px-5 py-4 text-left text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest'>Status</th>
            <th className='px-5 py-4 text-right text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-[var(--border-glass)]'>
          {adminUsers.map((user) => (
            <tr key={user.id} className='hover:bg-[var(--bg-surface)]/40 transition-colors group'>
              {/* Name */}
              <td className='px-5 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg shadow-purple-500/10'>
                    {user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className='text-[var(--text-main)] font-bold whitespace-nowrap'>{user.name}</span>
                </div>
              </td>

              {/* Email */}
              <td className='px-5 py-4 text-[var(--text-muted)] whitespace-nowrap font-medium'>{user.email}</td>

              {/* Products */}
              <td className='px-5 py-4'>
                {user.products?.length > 0 ? (
                  <div className='flex flex-wrap gap-1.5 max-w-[240px]'>
                    {user.products.map((p, i) => (
                      <span key={i} className='flex items-center gap-1.5 text-[10px] bg-[var(--bg-navbar)] border border-[var(--border-glass)] text-[var(--text-muted)] px-2.5 py-1 rounded-lg whitespace-nowrap shadow-sm'>
                        <span className='truncate max-w-[90px] font-medium' title={p.url}>{p.url || '—'}</span>
                        <span className='text-indigo-500 font-bold'>· {getRoleName(p.roleId)}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className='text-[var(--text-dim)] text-xs italic font-medium'>No products</span>
                )}
              </td>

              {/* Last Login */}
              <td className='px-5 py-4'>
                <div className='flex items-center gap-2 text-[var(--text-dim)] whitespace-nowrap font-medium'>
                  <Clock size={14} className='opacity-60' />
                  <span className='text-xs'>{formatDate(user.lastLogin)}</span>
                </div>
              </td>

              {/* Status */}
              <td className='px-5 py-4'>
                {user.status === 'active' ? (
                  <span className='inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-xl uppercase tracking-wider'>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' />
                    Active
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-1.5 text-[10px] font-bold bg-[var(--bg-surface)] text-[var(--text-dim)] border border-[var(--border-glass)] px-3 py-1.5 rounded-xl uppercase tracking-wider'>
                    <span className='w-1.5 h-1.5 rounded-full bg-[var(--text-dim)]' />
                    Inactive
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className='px-5 py-4 text-right'>
                {confirmDeleteId === user.id ? (
                  <div className='flex items-center justify-end gap-3'>
                    <span className='text-xs text-red-500 font-bold'>Confirm?</span>
                    <button
                      onClick={() => { removeAdminUser(user.id); setConfirmDeleteId(null); }}
                      className='text-xs bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-xl transition-all font-bold'
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className='text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-bold'
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className='flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0'>
                    <button
                      onClick={() => onEdit(user)}
                      className='p-2 rounded-xl text-[var(--text-dim)] hover:text-indigo-500 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all shadow-sm active:scale-90'
                      title='Edit user'
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(user.id)}
                      className='p-2 rounded-xl text-[var(--text-dim)] hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all shadow-sm active:scale-90'
                      title='Delete user'
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
