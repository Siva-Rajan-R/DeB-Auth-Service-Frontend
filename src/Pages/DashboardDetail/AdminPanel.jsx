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
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={14} /> },
    { id: 'users', label: 'Users & Sites', icon: <Users size={14} /> },
    { id: 'roles', label: 'Access Roles', icon: <Shield size={14} /> },
    { id: 'security', label: 'Security & Keys', icon: <Lock size={14} /> },
    { id: 'logs', label: 'Audit Logs', icon: <ScrollText size={14} /> },
  ];

  return (
    <div className='flex h-full bg-[var(--bg-deep)] rounded-[1.5rem] border border-[var(--border-glass)] overflow-hidden shadow-2xl relative'>
      {/* Sidebar Navigation */}
      <div className='w-56 flex-none border-r border-[var(--border-glass)] bg-[var(--bg-card)]/40 flex flex-col'>
        <div className='p-5 border-b border-[var(--border-glass)]'>
          <div className='flex items-center gap-2.5'>
            <div className='w-7 h-7 rounded-lg bg-purple-50 border border-purple-500/25 flex items-center justify-center text-purple-600'>
              <Shield size={14} />
            </div>
            <span className='text-[var(--text-main)] font-extrabold text-xs tracking-wider uppercase'>Admin Center</span>
          </div>
        </div>

        <div className='flex-1 py-4 px-2.5 flex flex-col gap-1 overflow-y-auto custom-scrollbar'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all w-full text-left relative ${
                activeTab === tab.id
                  ? 'bg-purple-50 text-purple-300 border border-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.05)]'
                  : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-transparent'
              }`}
            >
              {activeTab === tab.id && (
                <span className='absolute left-0 top-1/3 bottom-1/3 w-0.5 bg-purple-500 rounded-full' />
              )}
              <span className={activeTab === tab.id ? 'text-purple-600' : ''}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--bg-card)]/20 relative'>
        {/* Dynamic Header Actions */}
        <div className='absolute top-4 right-6 z-10 flex items-center gap-3'>
          {activeTab === 'users' && (
            <button
              onClick={handleAddUser}
              className='flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/10 active:scale-95 border border-purple-500/30'
            >
              <UserPlus size={13} /> Add User
            </button>
          )}
        </div>

        <div className='flex-1 p-6 overflow-y-auto custom-scrollbar'>
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'users' && <UserTable onEdit={handleEditUser} />}
          {activeTab === 'roles' && (
            <div className='max-w-2xl'>
              <div className='mb-6 pl-1'>
                <h3 className='text-[var(--text-main)] font-bold text-base mb-1'>Role Management</h3>
                <p className='text-[var(--text-dim)] text-[11px] font-medium leading-relaxed'>
                  Create and manage authorization groups. Default system roles cannot be deleted. Custom roles can be assigned to users per target SSO application.
                </p>
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
