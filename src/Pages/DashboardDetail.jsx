import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import { useToastStore } from '../Store/useToastStore';
import { useAuthConfigStore } from '../Store/useAuthConfigStore';
import { SignInCustomizer } from './DashboardDetail/SignInCustomizer';
import { AuthMethodSelector } from './DashboardDetail/AuthMethodSelector';
import { SSOPanel } from './DashboardDetail/SSOPanel';
import { SignUpBuilder } from './DashboardDetail/SignUpBuilder';
import { LivePreview } from './DashboardDetail/LivePreview';
import { RedirectURLPanel } from './DashboardDetail/RedirectURLPanel';
import { KeysPanel } from './DashboardDetail/KeysPanel';
import { TwoFactorPanel } from './DashboardDetail/TwoFactorPanel';
import { LocationAuthPanel } from './DashboardDetail/LocationAuthPanel';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paintbrush2, Users2, ShieldCheck, UserPlus2, Link2, Key, PencilLine,
  Loader2, Lock, MapPin, ShieldAlert, Activity
} from 'lucide-react';

export const DashboardDetail = () => {
  const navigate = useNavigate();
  const {
    projectName, setProjectName, activeMode, setActiveMode,
    resetToDefaults, getExportConfig, hydrateFromConfig
  } = useAuthConfigStore();

  const [activeTab, setActiveTab] = useState('ui');
  const [searchParams, setSearchParams] = useSearchParams();
  const { call } = useNetworkCalls();
  const apikey = searchParams.get('id');
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing config from backend on mount/apikey change
  useEffect(() => {
    if (!apikey) {
      resetToDefaults();
      return;
    }
    const loadConfig = async () => {
      setIsLoadingConfig(true);
      try {
        const res = await call({ method: 'GET', path: '/user/secrets', withCred: true });
        if (res?.secrets) {
          const match = res.secrets.find((s) => s.apikey === apikey);
          if (match?.configurations) {
            hydrateFromConfig(match.configurations);
          }
        }
      } catch (_) {
        // Silently catch
      }
      setIsLoadingConfig(false);
    };
    loadConfig();
  }, [apikey]);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    const config = getExportConfig();
    try {
      if (!apikey) {
        const res = await call({
          method: 'POST',
          path: '/user/secrets',
          data: config,
          withCred: true
        });
        if (res?.apikey) {
          setSearchParams({ id: res.apikey });
          useToastStore.getState().addToast('Configuration saved successfully!', 'success');
          useAuthConfigStore.getState().setHasUnsavedChanges(false);
        } else {
          useToastStore.getState().addToast('Failed to save configuration', 'error');
        }
      } else {
        const res = await call({
          method: 'PUT',
          path: '/user/secrets/config',
          data: { apikey, config },
          withCred: true
        });
        if (res !== null && res !== undefined) {
          useToastStore.getState().addToast('Configuration saved successfully!', 'success');
          useAuthConfigStore.getState().setHasUnsavedChanges(false);
        } else {
          useToastStore.getState().addToast('Failed to save configuration', 'error');
        }
      }
    } catch (error) {
      useToastStore.getState().addToast('Failed to save configuration', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const navTabs = [
    { id: 'ui', label: 'UI Style', icon: <Paintbrush2 size={14} /> },
    { id: 'providers', label: 'Providers', icon: <Users2 size={14} /> },
    ...(activeMode === 'signup' ? [{ id: 'fields', label: 'Fields', icon: <UserPlus2 size={14} /> }] : []),
    { id: 'sso', label: 'SSO', icon: <Lock size={14} /> },
    { id: 'location', label: 'Location', icon: <MapPin size={14} /> },
    { id: '2fa', label: '2FA', icon: <ShieldAlert size={14} /> },
    { id: 'redirect', label: 'Redirects', icon: <Link2 size={14} /> },
    { id: 'keys', label: 'API Keys', icon: <Key size={14} /> },
  ];

  return (
    <div className='w-full flex-1 min-h-0 flex flex-col lg:flex-row bg-[#e8ecf4] text-slate-900 relative overflow-hidden select-none'>

      {/* Config loading overlay */}
      {isLoadingConfig && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-[#e8ecf4]/80 backdrop-blur-sm'>
          <div className='flex flex-col items-center gap-3'>
            <div className='w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-600 rounded-full animate-spin' />
            <p className='text-slate-700 text-sm font-extrabold'>Loading configuration...</p>
          </div>
        </div>
      )}

      {/* LEFT PANEL: Settings Canvas (lg:w-[62%]) */}
      <div className='w-full lg:w-[62%] flex flex-col h-full border-r border-white/80 bg-[#e8ecf4] z-10 min-w-0'>

        {/* Top Header Bar */}
        <div className='p-5 border-b border-slate-300/60 bg-[#f3f6fa] shadow-sm flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className='text-xl font-black text-slate-900 bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:border-cyan-500 focus:outline-none transition-colors w-full max-w-[260px] truncate'
              placeholder="Project Name"
            />
            <PencilLine size={15} className='text-slate-400 shrink-0' />
          </div>

          <div className='flex items-center gap-2 shrink-0'>
            <button
              onClick={resetToDefaults}
              className='px-3.5 py-2 text-xs font-extrabold text-slate-600 hover:text-slate-900 rounded-xl transition-all'
            >
              Reset
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className='neu-button-primary px-5 py-2.5 text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95 transition-all'
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              <span>{isSaving ? 'Saving...' : 'Save Config'}</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Sign In / Sign Up Mode & Feature Navigation Tabs */}
        <div className='p-4 border-b border-slate-300/60 bg-[#f3f6fa]/60 flex flex-wrap items-center justify-between gap-3'>

          {/* Mode Switcher & Analytics Quick Action */}
          <div className='flex items-center gap-2.5'>
            <div className='flex items-center bg-[#e6ebf3] rounded-2xl p-1 shadow-[inset_2px_2px_5px_rgba(165,175,195,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.95)]'>
              {['signin', 'signup'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`relative px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${activeMode === mode ? '!text-white' : 'text-slate-700 hover:text-slate-900'
                    }`}
                >
                  {activeMode === mode && (
                    <motion.span
                      layoutId='mode-pill-easy'
                      className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl shadow-md'
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative capitalize z-10 ${activeMode === mode ? '!text-white font-black' : ''}`}>
                    {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </span>
                </button>
              ))}
            </div>

            {apikey && (
              <button
                onClick={() => navigate(`/analytics?id=${apikey}&name=${encodeURIComponent(projectName || 'Project')}`)}
                className='flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-black text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-sm transition-all active:scale-95'
                title='View Full Project Analytics'
              >
                <Activity size={14} className='text-emerald-600' />
                <span>Analytics</span>
              </button>
            )}
          </div>

          {/* All Feature Category Tabs */}
          <div className='flex flex-wrap items-center gap-1.5 p-1 bg-[#e6ebf3] rounded-2xl shadow-[inset_2px_2px_5px_rgba(165,175,195,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.95)]'>
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all ${isActive
                      ? 'bg-[#f0f4fa] text-cyan-800 border border-cyan-300/80 shadow-[3px_3px_8px_rgba(165,175,195,0.35),-3px_-3px_8px_rgba(255,255,255,0.95)] font-black'
                      : 'text-slate-700 hover:text-slate-900'
                    }`}
                >
                  <span className={isActive ? 'text-cyan-600' : 'text-slate-500'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Active Tab Content Pane */}
        <div className='flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar space-y-6'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'ui' && <SignInCustomizer />}
              {activeTab === 'providers' && <AuthMethodSelector />}
              {activeTab === 'fields' && <SignUpBuilder />}
              {activeTab === 'sso' && <SSOPanel />}
              {activeTab === 'location' && <LocationAuthPanel />}
              {activeTab === '2fa' && <TwoFactorPanel />}
              {activeTab === 'redirect' && <RedirectURLPanel />}
              {activeTab === 'keys' && <KeysPanel apikey={apikey} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANEL: Floating Live Preview WITHOUT Outer Box Border (lg:w-[38%]) */}
      <div className='w-full lg:w-[38%] flex flex-col h-full bg-[#e8ecf4] relative overflow-hidden'>
        <LivePreview />
      </div>
    </div>
  );
};
