import { DashboardCards } from '../Components/DashboardCards';
import { CreateNewCard } from '../Components/CreateNewCard';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import { AuthContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardPage = () => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { call } = useNetworkCalls();
  const { isSecretsAdded } = useContext(AuthContext);
  const navigate = useNavigate();

  const getSecrets = async () => {
    setLoading(true);
    const res = await call({ method: 'GET', path: '/user/secrets', withCred: true });
    if (res?.secrets) setSecrets(res.secrets);
    setLoading(false);
  };

  useEffect(() => {
    if (!Cookies.get('access_token')) {
      window.location.href = '/';
      return;
    }
    getSecrets();
  }, [isSecretsAdded]);

  const handleCreateNew = () => navigate('/dashboard-detail');
  const handleEdit = (id) => navigate(`/dashboard-detail?id=${id}`);

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    
    setLoading(true);
    const res = await call({ method: 'DELETE', path: `/user/secrets/remove?apikey=${deleteConfirm}`, withCred: true });
    if (res) {
      await getSecrets();
    }
    setDeleteConfirm(null);
    setLoading(false);
  };

  return (
    <div 
      className='w-full flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden custom-scrollbar'
      onScroll={(e) => window.dispatchEvent(new CustomEvent('page-scroll', { detail: e.target.scrollTop }))}
    >
      {/* Decorative Background Elements */}
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-indigo)]/10 blur-[120px] rounded-full pointer-events-none' />
      
      <div className='flex-1 px-4 md:px-12 py-8 md:py-12 relative z-10'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='max-w-4xl'
          >
            <h1 className='text-3xl md:text-5xl font-extrabold text-[var(--text-main)] tracking-tight'>
              Auth <span className='text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-purple)]'>Projects</span>
            </h1>
          </motion.div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center h-64 gap-4'>
            <div className='relative w-16 h-16'>
              <div className='absolute inset-0 border-4 border-[var(--border-glass)] rounded-full' />
              <div className='absolute inset-0 border-4 border-[var(--accent-indigo)] border-t-transparent rounded-full animate-spin' />
            </div>
            <p className='text-[var(--text-dim)] font-medium animate-pulse'>Loading projects...</p>
          </div>
        ) : secrets.length === 0 ? (
          /* Empty State */
          <div className='flex flex-col items-center justify-center min-h-[50vh] w-full'>
            <div className='w-full max-w-md mx-auto'>
              <CreateNewCard heading='Create your first project' onClick={handleCreateNew} />
            </div>
          </div>
        ) : (
          /* Projects Grid */
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl mx-auto'>
            {secrets.map((item, index) => (
              <div key={item.apikey || index} className="h-full">
                <DashboardCards
                  title={item.configurations?.project_name || item.configurations?.branding || `Project #${index + 1}`}
                  authMethods={item.configurations?.auth_methods || []}
                  ssoEnabled={item.configurations?.sso?.enabled || false}
                  onEdit={() => handleEdit(item.apikey)}
                  onDelete={() => setDeleteConfirm(item.apikey)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Project</h3>
                <p className="text-slate-500 text-sm">
                  Are you sure you want to delete this project? This action cannot be undone and will permanently remove all related authentication data.
                </p>
              </div>
              <div className="flex bg-slate-50 p-4 gap-3 justify-end border-t border-slate-100">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
