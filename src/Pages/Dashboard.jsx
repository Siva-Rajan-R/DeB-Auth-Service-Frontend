import { DashboardCards } from '../Components/DashboardCards';
import { CreateNewCard } from '../Components/CreateNewCard';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import { AuthContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const DashboardPage = () => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
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
          <div className='flex flex-col items-center justify-center min-h-[50vh] text-center'>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className='p-12 rounded-[2.5rem] bg-[var(--bg-surface)] border border-[var(--border-glass)] shadow-sm mb-8'
            >
              <div className='w-24 h-24 bg-gradient-to-br from-[var(--accent-indigo)]/10 to-[var(--accent-purple)]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-[var(--border-glass)]'>
                <div className='w-12 h-12 border-4 border-dashed border-[var(--accent-indigo)]/40 rounded-2xl' />
              </div>
              <h2 className='text-2xl font-bold text-[var(--text-main)] mb-3'>No Projects Found</h2>
              <p className='text-[var(--text-muted)] max-w-sm mx-auto mb-8'>
                You haven't created any authentication systems yet. Get started by creating your first project.
              </p>
              <div className='max-w-xs mx-auto'>
                <CreateNewCard heading='Create your first Auth System' onClick={handleCreateNew} />
              </div>
            </motion.div>
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
                  onDelete={() => {}}
                />
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};
