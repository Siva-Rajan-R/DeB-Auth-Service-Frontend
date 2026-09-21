import { DashboardCards } from '../Components/DashboardCards';
import { CreateNewCard } from '../Components/CreateNewCard';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import { AuthContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

export const DashboardPage = () => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredSecrets = secrets.filter((item) => {
    const name = (item.configurations?.project_name || item.domain || '').toLowerCase();
    const key = (item.apikey || '').toLowerCase();
    const q = searchTerm.toLowerCase().trim();
    return !q || name.includes(q) || key.includes(q);
  });

  return (
    <div 
      className='w-full flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden custom-scrollbar'
      onScroll={(e) => window.dispatchEvent(new CustomEvent('page-scroll', { detail: e.target.scrollTop }))}
    >
      {/* Decorative Background Elements */}
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-cyan)]/10 blur-[120px] rounded-full pointer-events-none' />
      
      <div className='flex-1 px-4 md:px-12 py-6 md:py-8 relative z-10'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='max-w-2xl'
          >
            <div className='flex items-center gap-2 mb-1.5'>
              <span className='px-2.5 py-0.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-800 text-[10px] font-black uppercase tracking-wider'>
                Secure Auth
              </span>
              <span className='text-xs font-extrabold text-slate-700'>Authentication Platform</span>
            </div>
            <h1 className='text-2xl md:text-3xl font-black text-slate-900 tracking-tight'>
              Auth <span className='text-[var(--primary-cyan)]'>Projects</span>
            </h1>
            <p className='text-xs md:text-sm text-slate-600 font-medium mt-0.5'>
              Manage your authentication applications, API keys, and custom sign-in flows.
            </p>
          </motion.div>

          {/* Search Bar in place of create button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='w-full md:w-80 relative'
          >
            <div className='relative flex items-center'>
              <Search size={16} className='absolute left-3.5 text-slate-400 pointer-events-none' />
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search projects by name or key...'
                className='w-full pl-10 pr-9 py-2.5 bg-white/90 border border-slate-200/90 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all'
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className='absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors'
                  title='Clear search'
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center h-64 gap-4'>
            <div className='relative w-16 h-16'>
              <div className='absolute inset-0 border-4 border-[var(--border-glass)] rounded-full' />
              <div className='absolute inset-0 border-4 border-t-[var(--accent-cyan)] border-r-transparent rounded-full animate-spin' />
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
        ) : filteredSecrets.length === 0 ? (
          /* No Search Match State */
          <div className='flex flex-col items-center justify-center min-h-[40vh] w-full text-center space-y-3'>
            <div className='w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400'>
              <Search size={22} />
            </div>
            <p className='text-sm font-bold text-slate-700'>No projects match &ldquo;{searchTerm}&rdquo;</p>
            <p className='text-xs text-slate-500'>Try searching with a different project name or API key.</p>
            <button
              onClick={() => setSearchTerm('')}
              className='px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all'
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* Projects Grid */
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl mx-auto'>
            {filteredSecrets.map((item, index) => (
              <div key={item.apikey || index} className="h-full">
                <DashboardCards
                  title={item.configurations?.project_name || `Project #${index + 1}`}
                  logoUrl={item.configurations?.ui?.brand_logo || item.configurations?.brand_logo || item.configurations?.logo_url || null}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="neu-flat rounded-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Project</h3>
                <p className="text-slate-500 text-sm">
                  Are you sure you want to delete this project? This action cannot be undone and will permanently remove all related authentication data.
                </p>
              </div>
              <div className="flex p-4 gap-3 justify-end  border-[var(--border-glass)] mt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="neu-button px-4 py-2 text-sm font-semibold text-[var(--text-muted)]"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="neu-button px-4 py-2 text-sm font-semibold text-red-500"
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
