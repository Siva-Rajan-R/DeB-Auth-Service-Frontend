import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminApi } from '../../Services/adminApi';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { UserTable } from './AdminPanel/UserTable';
import { AddUserModal } from './AdminPanel/AddUserModal';
import { RoleManager } from './AdminPanel/RoleManager';
import { Overview } from './AdminPanel/Overview';
import { SecuritySettings } from './AdminPanel/SecuritySettings';
import { AuditLogs } from './AdminPanel/AuditLogs';
import { Users, Shield, UserPlus, LayoutDashboard, Lock, ScrollText } from 'lucide-react';

export const AdminPanel = () => {
  const { adminUsers, adminRoles, setAdminUsers, setAdminRoles } = useAuthConfigStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchParams] = useSearchParams();
  const apikey = searchParams.get('id');
  const { getUsers, getRoles } = useAdminApi();

  useEffect(() => {
    if (apikey) {
      getUsers(apikey).then(res => res && setAdminUsers(res));
      getRoles(apikey).then(res => res && setAdminRoles(res));
    }
  }, [apikey]);

  const handleAddUser = () => { setEditingUser(null); setShowModal(true); };
  const handleEditUser = (user) => { setEditingUser(user); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setEditingUser(null); };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'users', label: 'Users', icon: <Users size={16} /> },
    { id: 'roles', label: 'Roles', icon: <Shield size={16} /> },
    { id: 'security', label: 'Security Settings', icon: <Lock size={16} /> },
    { id: 'logs', label: 'Audit Logs', icon: <ScrollText size={16} /> },
  ];

  return (
    <div className='flex h-full bg-[var(--bg-card)] rounded-2xl border border-[var(--border-glass)] overflow-hidden shadow-xl'>
      {/* Sidebar Navigation */}
      <div className='w-64 flex-none border-r border-[var(--border-glass)] bg-[var(--bg-surface)]/50 flex flex-col'>
        <div className='p-6 pb-4 border-b border-[var(--border-glass)]'>
          <div className='flex items-center gap-3 mb-1'>
            <div className='w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/10'>
              <Shield size={16} className='text-purple-400' />
            </div>
            <h2 className='text-[var(--text-main)] font-bold text-sm'>Admin Center</h2>
          </div>
        </div>

        <div className='flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all w-full text-left ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-sm'
                  : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden relative'>
        {/* Dynamic Header Actions */}
        <div className='absolute top-4 right-6 z-10 flex items-center gap-3'>
          {activeTab === 'users' && (
            <button
              onClick={handleAddUser}
              className='flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95'
            >
              <UserPlus size={14} /> Add User
            </button>
          )}
        </div>

        <div className='flex-1 p-6 overflow-y-auto custom-scrollbar'>
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'users' && <UserTable onEdit={handleEditUser} />}
          {activeTab === 'roles' && (
            <div className='max-w-2xl'>
              <div className='mb-6'>
                <h3 className='text-[var(--text-main)] font-bold text-lg mb-1'>Role Management</h3>
                <p className='text-[var(--text-muted)] text-xs font-medium'>Create and manage roles. Default roles cannot be deleted. Custom roles can be assigned to users per product.</p>
              </div>
              <RoleManager />
            </div>
          )}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'logs' && <AuditLogs />}
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <AddUserModal editingUser={editingUser} onClose={handleCloseModal} />
      )}
    </div>
  );
};

