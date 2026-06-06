import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import { useToastStore } from '../Store/useToastStore';
import { DashBoardNavBar } from '../Sections/DashboardNavbar';
import { useAuthConfigStore } from '../Store/useAuthConfigStore';
import { SignInCustomizer } from './DashboardDetail/SignInCustomizer';
import { AuthMethodSelector } from './DashboardDetail/AuthMethodSelector';
import { SSOPanel } from './DashboardDetail/SSOPanel';
import { SignUpBuilder } from './DashboardDetail/SignUpBuilder';
import { LivePreview } from './DashboardDetail/LivePreview';
import { RedirectURLPanel } from './DashboardDetail/RedirectURLPanel';
import { AdminPanel } from './DashboardDetail/AdminPanel';
import { KeysPanel } from './DashboardDetail/KeysPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Paintbrush2, Users2, ShieldCheck, UserPlus2, Link2, UserCog, Check, Copy, AlertTriangle, Key, Eye, PencilLine } from 'lucide-react';

const TABS_SIGNIN = [
  { id: 'ui',      label: 'UI Style',  icon: <Paintbrush2 size={15} /> },
  { id: 'methods', label: 'Providers', icon: <Users2      size={15} /> },
  { id: 'sso',     label: 'SSO',       icon: <ShieldCheck size={15} /> },
];

const TABS_SIGNUP = [
  { id: 'ui',      label: 'UI Style',  icon: <Paintbrush2 size={15} /> },
  { id: 'methods', label: 'Providers', icon: <Users2      size={15} /> },
  { id: 'fields',  label: 'Fields',    icon: <UserPlus2   size={15} /> },
  { id: 'sso',     label: 'SSO',       icon: <ShieldCheck size={15} /> },
];

const TABS_SHARED = [
  { id: 'redirect', label: 'Redirects', icon: <Link2 size={15} /> },
  { id: 'keys', label: 'API Keys', icon: <Key size={15} /> },
];

export const DashboardDetail = () => {
  const { projectName, setProjectName, activeMode, setActiveMode, resetToDefaults, sso, getExportConfig } = useAuthConfigStore();
  const [activeTab, setActiveTab] = useState('ui');
  const [searchParams, setSearchParams] = useSearchParams();
  const { call } = useNetworkCalls();
  const apikey = searchParams.get('id');
  const [newCredentials, setNewCredentials] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');

  // Track changes and listen for external save trigger
  useEffect(() => {
    const unsub = useAuthConfigStore.subscribe((state, prevState) => {
      if (
        state.uiConfig !== prevState.uiConfig ||
        state.projectName !== prevState.projectName ||
        state.authMethods !== prevState.authMethods ||
        state.signupFields !== prevState.signupFields ||
        state.sso !== prevState.sso ||
        state.redirectURLs !== prevState.redirectURLs
      ) {
        if (!state.hasUnsavedChanges) {
          state.setHasUnsavedChanges(true);
        }
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleTriggerSave = () => handleSaveConfig();
    window.addEventListener('trigger-save-config', handleTriggerSave);
    return () => window.removeEventListener('trigger-save-config', handleTriggerSave);
  });

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleSaveConfig = async () => {
    const config = getExportConfig();
    try {
      if (!apikey) {
        const res = await call({
          method: 'POST',
          path: '/user/secrets',
          data: config,
          withCred: true
        });
        setNewCredentials(res);
        setSearchParams({ id: res.apikey });
      } else {
        await call({
          method: 'PUT',
          path: '/user/secrets/config',
          data: { apikey, config },
          withCred: true
        });
        useToastStore.getState().addToast('Configuration saved successfully!', 'success');
      }
      useAuthConfigStore.getState().setHasUnsavedChanges(false);
    } catch (error) {
      useToastStore.getState().addToast('Failed to save configuration', 'error');
    }
  };

  // Build dynamic tab list — Admin tab only when SSO is enabled
  const adminTab = sso.enabled
    ? [{ id: 'admin', label: 'Admin', icon: <UserCog size={15} /> }]
    : [];

  const tabs = [
    ...(activeMode === 'signup' ? TABS_SIGNUP : TABS_SIGNIN),
    ...TABS_SHARED,
    ...adminTab,
  ];

  // If SSO gets disabled while on Admin tab, snap back to UI tab
  useEffect(() => {
    if (activeTab === 'admin' && !sso.enabled) {
      setActiveTab('ui');
    }
  }, [sso.enabled]);

  const handleModeSwitch = (mode) => {
    setActiveMode(mode);
    // Only reset if the current tab isn't a shared tab
    if (activeTab !== 'redirect' && activeTab !== 'admin') {
      setActiveTab('ui');
    }
  };

  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const isAdminActive = activeTab === 'admin';

  return (
    <div className='w-full flex-1 min-h-0 flex flex-col md:flex-row bg-[var(--bg-deep)] overflow-hidden text-[var(--text-main)] relative'>
      {/* Decorative Background Glows */}
      <div className='absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-[var(--accent-indigo)]/5 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[var(--accent-purple)]/5 blur-[120px] rounded-full pointer-events-none' />

      {/* LEFT PANEL — Settings & Controls (Mobile: 100%, Desktop: 42%) */}
      <div className={`w-full md:w-[42%] flex-1 md:flex-none min-h-0 flex flex-col bg-[var(--bg-navbar)] backdrop-blur-xl border-r border-[var(--border-glass)] relative z-10 ${showMobilePreview ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Section Header & Toolbar */}
        <div className='flex-none p-4 md:p-6 border-b border-[var(--border-glass)]'>
          <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
            <div className='flex items-center gap-3 group/title'>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className='text-xl font-bold text-[var(--text-main)] bg-transparent border-b-2 border-transparent hover:border-[var(--border-glass)] focus:border-[var(--accent-indigo)] focus:outline-none transition-colors w-[250px] px-1 py-0.5 -ml-1'
                placeholder="Project Name"
              />
              <PencilLine size={14} className='text-[var(--text-muted)] opacity-0 group-hover/title:opacity-100 transition-opacity' />
            </div>
            <div className='flex items-center gap-2'>
              <button onClick={resetToDefaults} className='px-3 py-1.5 text-xs font-bold rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all'>
                Reset
              </button>
              <button onClick={handleSaveConfig} className='px-4 py-1.5 text-xs font-bold rounded-lg bg-[var(--accent-indigo)] text-white shadow-md shadow-[var(--accent-indigo)]/20 hover:bg-[var(--accent-indigo)]/90 transition-all'>
                Save Config
              </button>
            </div>
          </div>

          <div className='flex items-center bg-[var(--bg-surface)] rounded-xl p-1 border border-[var(--border-glass)] w-fit mb-4'>
            {['signin', 'signup'].map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeSwitch(mode)}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === mode ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {activeMode === mode && (
                  <motion.span
                    layoutId='mode-pill-detail'
                    className='absolute inset-0 bg-[var(--accent-indigo)] rounded-lg shadow-sm'
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className='relative capitalize z-10'>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
              </button>
            ))}
          </div>

          {/* Premium Tab Bar */}
          <div className='flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap border ${
                  activeTab === tab.id
                    ? tab.id === 'admin'
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400'
                      : tab.id === 'redirect'
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-[var(--accent-indigo)]'
                      : 'bg-[var(--accent-indigo)]/10 border-[var(--accent-indigo)]/30 text-[var(--accent-indigo)]'
                    : 'bg-transparent border-transparent text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span className={activeTab === tab.id ? 'scale-110' : 'opacity-70'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Panel Content */}
        <div 
          className='flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-24 md:pb-6'
          onScroll={(e) => window.dispatchEvent(new CustomEvent('page-scroll', { detail: e.target.scrollTop }))}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className='space-y-6'
            >
              {activeTab === 'ui'       && <SignInCustomizer />}
              {activeTab === 'methods'  && <AuthMethodSelector />}
              {activeTab === 'sso'      && <SSOPanel />}
              {activeTab === 'fields'   && <SignUpBuilder />}
              {activeTab === 'redirect' && <RedirectURLPanel />}
              {activeTab === 'keys'     && <KeysPanel apikey={apikey} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Floating Preview Button */}
      <AnimatePresence mode="wait">
        <motion.button
          key={showMobilePreview ? 'edit' : 'preview'}
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.05, opacity: 0.8 }}
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className={`md:hidden absolute right-6 z-50 overflow-hidden origin-bottom-right shadow-2xl ${
            showMobilePreview
              ? 'bottom-24 w-14 h-14 flex items-center justify-center rounded-full bg-[var(--accent-indigo)] text-white hover:scale-105 active:scale-95 shadow-[var(--accent-indigo)]/30'
              : 'bottom-24 w-[120px] h-[180px] rounded-2xl bg-[var(--bg-card)] shadow-[0_8px_30px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing'
          }`}
        >
          {showMobilePreview ? (
            <Paintbrush2 size={24} />
          ) : (
            <div className='absolute inset-0 pointer-events-none' style={{ transform: 'scale(0.3)', transformOrigin: 'top left', width: '400px', height: '600px' }}>
              <div className='w-full h-full bg-[var(--bg-surface)] shadow-inner'>
                <LivePreview />
              </div>
              {/* Glossy overlay effect for the "phone screen" */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            </div>
          )}
        </motion.button>
      </AnimatePresence>

      {/* RIGHT PANEL — Live Preview (Mobile: 100%, Desktop: 58%) */}
      <div className={`w-full md:w-[58%] flex-1 min-h-0 flex flex-col bg-[var(--bg-surface)] relative ${!showMobilePreview ? 'hidden md:flex' : 'flex'}`}>
        {/* Preview Toolbar */}
        <div className='flex-none flex items-center justify-between px-6 py-3 border-b border-[var(--border-glass)] bg-[var(--bg-navbar)] backdrop-blur-md relative z-20'>
          <div className='flex items-center gap-3'>
            <div className='hidden md:flex gap-1.5'>
              <div className='w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30' />
              <div className='w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30' />
              <div className='w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30' />
            </div>
            <div className='hidden md:block h-4 w-px bg-[var(--border-glass)] mx-1' />
            <div className='flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--bg-deep)] border border-[var(--border-glass)]'>
              <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
              <span className='text-[var(--text-dim)] text-[10px] font-mono tracking-wider uppercase'>
                Live Preview: {activeMode === 'signin' ? 'auth/login' : 'auth/register'}
              </span>
            </div>
          </div>
          
          <div className='flex items-center gap-4'>
            <span className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest'>{showMobilePreview ? 'Mobile' : 'Desktop'}</span>
          </div>
        </div>

        {/* Preview Screen Container */}
        <div className='flex-1 p-4 md:p-8 overflow-hidden flex items-center justify-center relative'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--border-active),transparent_70%)] opacity-20 pointer-events-none' />
          <div className='w-full h-full max-w-5xl max-h-[800px] rounded-[2rem] border border-[var(--border-glass)] shadow-2xl overflow-hidden bg-slate-950 relative z-10'>
            <LivePreview />
          </div>
        </div>
      </div>

      {/* ADMIN PANEL OVERLAY */}
      <AnimatePresence>
        {isAdminActive && (
          <motion.div
            key='admin-overlay'
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className='absolute inset-0 z-30 bg-[var(--bg-deep)] flex flex-col overflow-hidden'
          >
            <div className='flex-none flex items-center justify-between px-6 md:px-8 py-4 border-b border-[var(--border-glass)] bg-[var(--bg-navbar)] backdrop-blur-xl'>
              <div className='flex items-center gap-4'>
                <div className='p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400'>
                  <UserCog size={20} />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-[var(--text-main)]'>Organization Admin</h2>
                  <p className='text-[var(--text-muted)] text-xs mt-0.5'>Manage users and enterprise settings</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('ui')}
                className='px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 transition-all text-xs font-bold'
              >
                Exit Admin View
              </button>
            </div>
            <div className='flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar'>
              <AdminPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREDENTIALS MODAL OVERLAY */}
      <AnimatePresence>
        {newCredentials && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className='w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl shadow-2xl overflow-hidden flex flex-col'
            >
              <div className='p-6 border-b border-[var(--border-glass)]'>
                <h3 className='text-xl font-bold text-[var(--text-main)] flex items-center gap-2'>
                  <ShieldCheck className="text-[var(--accent-emerald)]" size={24} />
                  Configuration Created
                </h3>
                <p className='text-[var(--text-muted)] text-sm mt-2'>
                  Your new authentication project is live. Please save these credentials securely.
                </p>
              </div>
              
              <div className='p-6 space-y-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1'>API Key (Client ID)</label>
                  <div className='flex items-center gap-2 bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl p-3'>
                    <code className='flex-1 text-sm text-[var(--accent-indigo)] truncate font-mono select-all'>{newCredentials.apikey}</code>
                    <button onClick={() => handleCopy(newCredentials.apikey, 'apikey')} className='p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-[var(--text-muted)] transition-colors'>
                      {copiedKey === 'apikey' ? <Check size={16} className='text-[var(--accent-emerald)]' /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider ml-1'>Client Secret</label>
                  <div className='flex items-center gap-2 bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl p-3'>
                    <code className='flex-1 text-sm text-[var(--accent-purple)] truncate font-mono select-all'>{newCredentials.client_secret}</code>
                    <button onClick={() => handleCopy(newCredentials.client_secret, 'secret')} className='p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-[var(--text-muted)] transition-colors'>
                      {copiedKey === 'secret' ? <Check size={16} className='text-[var(--accent-emerald)]' /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className='p-6 pt-2 bg-[var(--bg-surface)] border-t border-[var(--border-glass)] flex justify-end'>
                <button 
                  onClick={() => setNewCredentials(null)}
                  className='px-6 py-2.5 bg-[var(--text-main)] text-[var(--bg-deep)] hover:scale-[1.02] font-bold rounded-xl transition-all shadow-md'
                >
                  I have saved these securely
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
