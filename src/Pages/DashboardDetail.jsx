import { useState, useEffect, useRef } from 'react';
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
  Loader2, Lock, MapPin, ShieldAlert, Activity, SlidersHorizontal, Copy,
  Eye, X, Maximize2, Minimize2, Minus
} from 'lucide-react';

export const DashboardDetail = () => {
  const navigate = useNavigate();
  const {
    projectName, setProjectName, activeMode, setActiveMode,
    separateConfig, toggleSeparateConfig, copyModeConfig,
    resetToDefaults, getExportConfig, hydrateFromConfig
  } = useAuthConfigStore();

  const [activeTab, setActiveTab] = useState('ui');
  const [searchParams, setSearchParams] = useSearchParams();
  const { call } = useNetworkCalls();
  const apikey = searchParams.get('id');
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const containerRef = useRef(null);
  const DEFAULT_SPLIT_PERCENT = 60;
  const MIN_SPLIT_PERCENT = 35;
  const MAX_SPLIT_PERCENT = 75;

  const [splitPercent, setSplitPercent] = useState(() => {
    const saved = localStorage.getItem('dauth_detail_split_percent');
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= MIN_SPLIT_PERCENT && parsed <= MAX_SPLIT_PERCENT) {
        return parsed;
      }
    }
    return DEFAULT_SPLIT_PERCENT;
  });
  const [isDraggingDetail, setIsDraggingDetail] = useState(false);
  const [isLg, setIsLg] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => setIsLg(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDraggingDetail) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const newPercent = (currentX / rect.width) * 100;
      const clamped = Math.min(Math.max(newPercent, MIN_SPLIT_PERCENT), MAX_SPLIT_PERCENT);
      setSplitPercent(clamped);
      localStorage.setItem('dauth_detail_split_percent', clamped.toFixed(2));
    };

    const handleMouseUp = () => {
      setIsDraggingDetail(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDraggingDetail]);

  const resetSplitPercent = () => {
    setSplitPercent(DEFAULT_SPLIT_PERCENT);
    localStorage.setItem('dauth_detail_split_percent', String(DEFAULT_SPLIT_PERCENT));
  };

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
    <div 
      ref={containerRef}
      className='w-full flex-1 min-h-0 flex flex-col lg:flex-row bg-[#e8ecf4] text-slate-900 relative overflow-hidden select-none'
    >

      {/* Global drag overlay to prevent pointer capture issues */}
      {isDraggingDetail && <div className="fixed inset-0 z-[9999] cursor-col-resize select-none" />}

      {/* Config loading overlay */}
      {isLoadingConfig && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-[#e8ecf4]/80 backdrop-blur-sm'>
          <div className='flex flex-col items-center gap-3'>
            <div className='w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-600 rounded-full animate-spin' />
            <p className='text-slate-700 text-sm font-extrabold'>Loading configuration...</p>
          </div>
        </div>
      )}

      {/* LEFT PANEL: Settings Canvas */}
      <div 
        style={{ width: isLg ? `${splitPercent}%` : '100%' }}
        className='w-full flex flex-col h-full border-r border-slate-300/60 bg-[#e8ecf4] z-10 min-w-0 shrink-0'
      >

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
              onClick={() => setShowMobilePreview(true)}
              className='lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-black text-cyan-900 bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 rounded-xl transition-all shadow-xs active:scale-95'
              title="Open Live Preview"
            >
              <Eye size={14} className="text-cyan-700" />
              <span>Preview</span>
            </button>
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

          {/* Mode Switcher, Separation Toggle & Analytics Quick Action */}
          <div className='flex items-center flex-wrap gap-2.5'>
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

            {/* Separate Mode Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={separateConfig}
              onClick={toggleSeparateConfig}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-black transition-all border select-none cursor-pointer ${
                separateConfig
                  ? 'bg-cyan-50/90 border-cyan-300 text-cyan-900 shadow-sm'
                  : 'bg-[#e6ebf3] border-slate-300/80 text-slate-600 hover:text-slate-800 shadow-[inset_1px_1px_3px_rgba(165,175,195,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.9)]'
              }`}
              title={separateConfig ? "Separate Config is ON (Independent providers & styles for Sign In and Sign Up)" : "Separate Config is OFF (Synced providers & styles)"}
            >
              <SlidersHorizontal size={13} className={separateConfig ? 'text-cyan-600' : 'text-slate-400'} />
              <span>Separate Config</span>
              <div
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                  separateConfig ? 'bg-cyan-600' : 'bg-slate-300'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform ${
                    separateConfig ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>

            {separateConfig && (
              <button
                onClick={() => {
                  const fromMode = activeMode === 'signin' ? 'signup' : 'signin';
                  copyModeConfig(fromMode, activeMode);
                  useToastStore.getState().addToast(`Copied ${fromMode === 'signin' ? 'Sign In' : 'Sign Up'} config to ${activeMode === 'signin' ? 'Sign In' : 'Sign Up'}!`, 'info');
                }}
                className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-cyan-900 bg-[#e6ebf3] hover:bg-[#dbe2ee] border border-slate-300/70 shadow-xs transition-all active:scale-95'
                title={`Copy settings from ${activeMode === 'signin' ? 'Sign Up' : 'Sign In'} to ${activeMode === 'signin' ? 'Sign In' : 'Sign Up'}`}
              >
                <Copy size={12} className='text-slate-500' />
                <span>Copy from {activeMode === 'signin' ? 'Sign Up' : 'Sign In'}</span>
              </button>
            )}

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
          <div className='flex flex-nowrap overflow-x-auto no-scrollbar sm:flex-wrap items-center gap-1.5 p-1 bg-[#e6ebf3] rounded-2xl shadow-[inset_2px_2px_5px_rgba(165,175,195,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] max-w-full'>
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${isActive
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

        {separateConfig && (
          <div className='px-5 py-2 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border-b border-cyan-500/15 flex items-center justify-between text-xs font-bold text-cyan-900'>
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-cyan-500 animate-pulse' />
              <span>
                Editing distinct configuration for <strong className='uppercase tracking-wider font-black text-cyan-700'>{activeMode === 'signin' ? 'Sign In' : 'Sign Up'}</strong>
              </span>
            </div>
            <span className='text-[11px] font-semibold text-slate-500 hidden sm:inline'>Providers & UI Styles will apply only to {activeMode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
          </div>
        )}

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

      {/* ADJUSTABLE RESIZER DIVIDER between Settings & Live Preview */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDraggingDetail(true);
        }}
        onDoubleClick={resetSplitPercent}
        className={`hidden lg:flex items-center justify-center w-2 -ml-1 -mr-1 h-full z-20 cursor-col-resize select-none group transition-all shrink-0 relative ${
          isDraggingDetail ? 'bg-cyan-500/20' : 'hover:bg-cyan-500/10'
        }`}
        title="Drag to resize panels • Double-click to reset"
      >
        <div className={`w-[2px] h-full transition-colors ${
          isDraggingDetail ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-transparent group-hover:bg-cyan-400'
        }`} />
        <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-full transition-all shadow-sm flex items-center justify-center ${
          isDraggingDetail ? 'bg-cyan-600 scale-y-110' : 'bg-slate-300 group-hover:bg-cyan-500 group-hover:scale-110'
        }`}>
          <div className="w-0.5 h-4 bg-white/60 rounded-full" />
        </div>
      </div>

      {/* RIGHT PANEL: Floating Live Preview (Desktop) */}
      <div className='hidden lg:flex flex-1 w-full flex-col h-full bg-[#e8ecf4] relative overflow-hidden min-w-0'>
        <LivePreview activeTab={activeTab} />
      </div>

      {/* Floating Action Pill Button for Live Preview (Mobile/Tablet only - desktop already has the dedicated preview panel) */}
      {!showMobilePreview && (
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobilePreview(true)}
            className="neu-button-primary flex items-center gap-2 px-4 py-3 text-white rounded-full font-black text-xs shadow-xl transition-all cursor-pointer"
            title="Open Live Preview"
          >
            <div className="relative flex items-center justify-center">
              <Eye size={16} className="text-white" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </div>
            <span className="tracking-wide">Live Preview</span>
          </motion.button>
        </div>
      )}

      {/* Floating Mini Preview Window */}
      <AnimatePresence>
        {showMobilePreview && (
          <motion.div
            drag={!isMaximized}
            dragMomentum={false}
            dragElastic={0.06}
            initial={{ opacity: 0, scale: 0.88, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 25 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={`fixed z-[100] flex flex-col bg-[#e8ecf4] rounded-3xl shadow-[0_25px_70px_-15px_rgba(15,23,42,0.45)] border border-slate-300/80 overflow-hidden ${
              isMaximized
                ? 'inset-3 sm:inset-8 w-auto h-auto'
                : 'bottom-6 right-6 w-[390px] sm:w-[430px] max-w-[calc(100vw-2rem)] h-[590px] max-h-[82vh]'
            }`}
          >
            {/* Window Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shrink-0 select-none cursor-grab active:cursor-grabbing">
              {/* Traffic light control dots */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors flex items-center justify-center group"
                  title="Close preview window"
                >
                  <X size={8} className="text-red-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors flex items-center justify-center group"
                  title="Minimize to floating pill"
                >
                  <Minus size={8} className="text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-500 transition-colors flex items-center justify-center group"
                  title={isMaximized ? "Restore mini preview" : "Expand window"}
                >
                  {isMaximized ? (
                    <Minimize2 size={8} className="text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <Maximize2 size={8} className="text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
                <div className="h-3 w-px bg-slate-200 ml-1" />
                <span className="text-[11px] font-black text-slate-800 flex items-center gap-1.5 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Mini Preview
                </span>
              </div>

              {/* Quick Mode Toggle in Floating Window Header */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl border border-slate-200 shadow-xs">
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveMode('signin'); }}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    activeMode === 'signin'
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveMode('signup'); }}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    activeMode === 'signup'
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Action buttons on the right */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title={isMaximized ? "Restore mini preview" : "Maximize preview"}
                >
                  {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMobilePreview(false); }}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Close preview window"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Preview Window Canvas */}
            <div className="flex-1 w-full overflow-hidden relative min-h-0 bg-[#e8ecf4]">
              <LivePreview activeTab={activeTab} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
