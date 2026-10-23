import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineKeyboardBackspace, MdDashboard } from "react-icons/md";
import { Sun, BookOpen, Lock, FileText, AlertTriangle, Settings, Crown, ChevronRight, Zap, LogOut, Code, Copy, Check, BarChart2, FolderKanban, MoreHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthConfigStore } from '../Store/useAuthConfigStore';
import { useEffect, useState } from 'react';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import Cookies from 'js-cookie';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, projectName } = useAuthConfigStore();
  const [subscriptionState, setSubscriptionState] = useState(null);
  const [copiedSdk, setCopiedSdk] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { call } = useNetworkCalls();

  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(Cookies.get('access_token') || Cookies.get('refresh_token')));
  const [userData, setUserData] = useState(() => {
    const name = Cookies.get('user_name') || '';
    const email = Cookies.get('user_email') || '';
    const profile = Cookies.get('user_profile') || null;
    return { name, email, profile };
  });
  const [profileImgError, setProfileImgError] = useState(false);

  useEffect(() => {
    const loggedIn = Boolean(Cookies.get('access_token') || Cookies.get('refresh_token'));
    setIsLoggedIn(loggedIn);
    if (!loggedIn) return;

    const cookieName = Cookies.get('user_name');
    const cookieEmail = Cookies.get('user_email');
    const cookieProfile = Cookies.get('user_profile');

    if (cookieName || cookieEmail || cookieProfile) {
      setUserData({
        name: cookieName || '',
        email: cookieEmail || '',
        profile: (cookieProfile && cookieProfile !== 'null' && cookieProfile !== 'undefined' && cookieProfile !== 'None') ? cookieProfile : null
      });
    }

    const fetchUserProfile = async () => {
      try {
        const res = await call({ method: 'GET', path: '/user/profile', withCred: true });
        if (res) {
          const freshName = res.name || cookieName || '';
          const freshEmail = res.email || cookieEmail || '';
          const freshProfile = res.profile_picture || cookieProfile || null;

          if (freshName) Cookies.set('user_name', freshName, { expires: 7, path: '/' });
          if (freshEmail) Cookies.set('user_email', freshEmail, { expires: 7, path: '/' });
          if (freshProfile && freshProfile !== 'null' && freshProfile !== 'undefined' && freshProfile !== 'None') {
            Cookies.set('user_profile', freshProfile, { expires: 7, path: '/' });
          }

          setUserData({
            name: freshName,
            email: freshEmail,
            profile: (freshProfile && freshProfile !== 'null' && freshProfile !== 'undefined' && freshProfile !== 'None') ? freshProfile : null
          });
        }
      } catch (_) {
        // Silently catch
      }
    };

    fetchUserProfile();
  }, [location.pathname, isLoggedIn]);

  const getCleanName = (nameVal, emailVal) => {
    if (nameVal && nameVal !== 'null' && nameVal !== 'undefined' && nameVal !== 'None' && nameVal.trim() !== '') {
      if (nameVal.includes('@')) {
        return nameVal.split('@')[0];
      }
      return nameVal.trim();
    }
    if (emailVal && emailVal !== 'null' && emailVal !== 'undefined' && emailVal !== 'None' && emailVal.trim() !== '') {
      const parts = emailVal.split('@');
      if (parts[0]) return parts[0];
    }
    return 'Developer';
  };

  const displayName = getCleanName(userData.name, userData.email);
  const displayEmail = userData.email || Cookies.get('user_email') || '';

  const getInitials = (name) => {
    if (!name || name === 'Developer') return 'DA';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName);

  const isDocsLoggedOut = !isLoggedIn && location.pathname === '/auth-docs';

  const DEFAULT_SIDEBAR_WIDTH = 288;
  const MIN_SIDEBAR_WIDTH = 230;
  const MAX_SIDEBAR_WIDTH = 480;

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('dauth_sidebar_width');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
        return parsed;
      }
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);

  useEffect(() => {
    if (!isDraggingSidebar) return;

    const handleMouseMove = (e) => {
      const newWidth = Math.min(Math.max(e.clientX, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
      setSidebarWidth(newWidth);
      localStorage.setItem('dauth_sidebar_width', String(newWidth));
    };

    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
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
  }, [isDraggingSidebar]);

  const resetSidebarWidth = () => {
    setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
    localStorage.setItem('dauth_sidebar_width', String(DEFAULT_SIDEBAR_WIDTH));
  };

  useEffect(() => {
    if (!Cookies.get('access_token') && !Cookies.get('refresh_token')) return;
    const fetchSub = async () => {
      const res = await call({ method: 'GET', path: '/billing/subscription', withCred: true });
      if (res) {
        setSubscriptionState(res);
      }
    };
    fetchSub();
  }, []);

  useEffect(() => {
    if (theme !== 'light') {
      toggleTheme();
    }
    document.documentElement.setAttribute('data-theme', 'light');
  }, [theme, toggleTheme]);

  useEffect(() => {
    setShowMoreMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    Cookies.remove('user_name', { path: '/' });
    Cookies.remove('user_email', { path: '/' });
    Cookies.remove('user_profile', { path: '/' });
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    window.location.href = '/';
  };

  const navItems = [
    { name: 'Auth Projects',     mobileLabel: 'Projects',  path: '/dashboard',        icon: <MdDashboard size={18} />, badge: null, desc: 'Manage your client apps & tokens' },
    { name: 'Analytics',         mobileLabel: 'Analytics', path: '/analytics',        icon: <BarChart2 size={17} />,   badge: null, desc: 'Sign-in logs, trends & usage metrics' },
    { name: 'Create Project',    mobileLabel: 'Create',    path: '/dashboard-detail',  icon: <FolderKanban size={17} />, badge: 'NEW', desc: 'Design auth styles & registration' },
    { name: 'API Documentation', mobileLabel: 'Docs',      path: '/auth-docs',         icon: <BookOpen size={17} />,    badge: null, desc: 'SDKs, endpoints & integration guides' },
    { name: 'Settings',          mobileLabel: 'Settings',  path: '/settings',          icon: <Settings size={17} />,    badge: null, desc: 'Account profile & security settings' },
    { name: 'Invoices',          mobileLabel: 'Invoices',  path: '/invoices',          icon: <FileText size={17} />,    badge: null, desc: 'Billing history & transaction receipts' },
    { name: 'Upgrade Plan',      mobileLabel: 'Upgrade',   path: '/pricing',           icon: <Crown size={17} />,       badge: 'PRO', isUpgrade: true, desc: 'Unlock unlimited projects & SSO' },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Auth Projects Overview';
      case '/analytics': return 'Authentication Analytics';
      case '/dashboard-detail': return projectName ? `Configuring ${projectName}` : 'Project Setup';
      case '/auth-docs': return 'Developer Documentation';
      case '/settings': return 'Account & Platform Settings';
      case '/invoices': return 'Billing & Invoices';
      case '/pricing': return 'Subscription Plans';
      default: return 'DAuth Platform';
    }
  };

  return (
    <div className="h-[100dvh] overflow-hidden w-full bg-[var(--bg-deep)] text-[var(--text-main)] transition-colors duration-300 flex relative">
      
      {/* Global drag overlay to prevent pointer capture issues */}
      {isDraggingSidebar && <div className="fixed inset-0 z-[9999] cursor-col-resize select-none" />}

      {/* Decorative Glow Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-cyan-200/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-blue-200/20 blur-[130px] rounded-full" />
      </div>

      {/* LEFT SIDEBAR (Desktop) */}
      {!isDocsLoggedOut && (
        <aside 
          style={{ width: `${sidebarWidth}px` }}
          className="hidden lg:flex h-full flex-col bg-[var(--bg-card)]/90 backdrop-blur-2xl border-r border-slate-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30 shrink-0 select-none relative"
        >
          
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <img src="/dauth_logo.png" alt="DAuth Logo" className="w-6 h-6 object-contain" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-slate-900 tracking-tight">DAuth</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300/80">v2.4</span>
                </div>
                <span className="text-[10px] font-bold text-slate-700 tracking-wide block">Authentication Platform</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 custom-scrollbar">
            
            <div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-3 block mb-2">Platform Navigation</span>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-800 border border-cyan-300/80 shadow-sm font-black'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-600' : 'text-slate-600'}`}>
                          {item.icon}
                        </span>
                        <span className={`truncate whitespace-nowrap ${isActive ? 'text-cyan-800 font-black' : ''}`}>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className={`shrink-0 ml-2 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider whitespace-nowrap ${
                          item.isUpgrade 
                            ? 'bg-cyan-100 text-cyan-800 border border-cyan-300/80' 
                            : 'bg-cyan-100 text-cyan-800 border border-cyan-300/60'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer: User Profile & Logout */}
          <div className="p-4 border-t border-slate-200/70 bg-slate-100/50 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
              {userData.profile && !profileImgError ? (
                <img
                  src={userData.profile}
                  alt={displayName}
                  className="w-8 h-8 rounded-xl object-cover border border-slate-300 shadow-sm shrink-0"
                  onError={() => setProfileImgError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black flex items-center justify-center text-xs shadow-sm shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-xs font-extrabold text-slate-900 block leading-tight truncate" title={displayName}>
                  {displayName}
                </span>
                <span className="text-[10px] font-bold text-slate-600 block leading-tight truncate" title={displayEmail || 'Active Session'}>
                  {displayEmail || 'Active Session'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200 shrink-0"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* DRAGGABLE RESIZER HANDLE FOR SIDEBAR */}
      {!isDocsLoggedOut && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDraggingSidebar(true);
          }}
          onDoubleClick={resetSidebarWidth}
          className={`hidden lg:flex items-center justify-center w-2 -ml-1 -mr-1 h-full z-40 cursor-col-resize select-none group transition-all shrink-0 relative ${
            isDraggingSidebar ? 'bg-cyan-500/20' : 'hover:bg-cyan-500/10'
          }`}
          title="Drag to resize sidebar • Double-click to reset"
        >
          <div className={`w-[2px] h-full transition-colors ${
            isDraggingSidebar ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-transparent group-hover:bg-cyan-400'
          }`} />
          <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-full transition-all shadow-sm flex items-center justify-center ${
            isDraggingSidebar ? 'bg-cyan-600 scale-y-110' : 'bg-slate-300 group-hover:bg-cyan-500 group-hover:scale-110'
          }`}>
            <div className="w-0.5 h-4 bg-white/60 rounded-full" />
          </div>
        </div>
      )}

      {/* MAIN RIGHT CONTAINER */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative z-10">

        {/* Subscription Alert Banner */}
        {subscriptionState && subscriptionState.status !== 'active' && subscriptionState.plan !== 'Community' && (
          <div className={`w-full py-2 px-4 text-center text-xs font-extrabold shadow-sm z-[60] flex items-center justify-center gap-2 ${
            subscriptionState.status === 'grace_period' ? 'bg-amber-100 text-amber-900 border-b border-amber-300' :
            subscriptionState.status === 'expired' ? 'bg-red-100 text-red-900 border-b border-red-300' :
            'bg-cyan-100 text-cyan-900 border-b border-cyan-300'
          }`}>
            <AlertTriangle size={16} />
            {subscriptionState.status === 'grace_period' ? 'Your subscription is in a grace period. Please renew to avoid service interruption.' :
             subscriptionState.status === 'expired' ? 'Your subscription has expired. Please upgrade to restore premium features.' :
             'Your subscription is ending soon. Please review your billing.'}
             <button onClick={() => navigate('/pricing')} className="ml-4 underline hover:opacity-80 font-black">Manage Subscription</button>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-slate-200/80 px-4 md:px-8 justify-between items-center w-full relative z-20 shadow-sm">
          
          {/* Left: Back Button + Breadcrumb Title / Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(isDocsLoggedOut ? '/' : -1)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer group shadow-sm active:scale-95 text-slate-700"
              title={isDocsLoggedOut ? "Back to Home" : "Go Back"}
            >
              <MdOutlineKeyboardBackspace size={20} className="group-hover:text-cyan-600 transition-colors" />
            </button>

            {isDocsLoggedOut ? (
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                <img src="/dauth_logo.png" alt="DAuth Logo" className="w-7 h-7 object-contain" />
                <span className="text-lg font-black text-slate-900 tracking-tight">DAuth</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">Docs</span>
              </div>
            ) : (
              <>
                {/* Mobile Logo */}
                <div className="flex lg:hidden items-center gap-2">
                  <img src="/dauth_logo.png" alt="DAuth Logo" className="w-6 h-6 object-contain" />
                  <span className="text-base font-extrabold text-slate-900 tracking-tight">DAuth</span>
                </div>

                <div className="hidden lg:flex items-center gap-2 text-slate-700 text-sm font-bold">
                  <span>Platform</span>
                  <ChevronRight size={14} className="text-slate-400" />
                  <span className="text-slate-900 font-extrabold">{getPageTitle()}</span>
                </div>
              </>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {isDocsLoggedOut ? (
              <button
                onClick={() => navigate('/auth')}
                className="neu-button-primary px-5 py-2.5 text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95"
              >
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard-detail')}
                className="neu-button-primary px-5 py-2.5 text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95"
              >
                <Zap size={14} className="fill-white" />
                <span>Create Project</span>
              </button>
            )}

            <button
              disabled
              className="p-2 rounded-xl text-slate-400 opacity-50 cursor-not-allowed bg-slate-100 border border-slate-200"
              title="Theme locked to Light Mode"
            >
              <div className="relative">
                <Sun size={16} />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <Lock size={8} className="text-slate-700" />
                </div>
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 w-full relative ${isDocsLoggedOut ? 'pb-0' : 'pb-20 lg:pb-0'} overflow-x-hidden overflow-y-auto flex flex-col min-h-0 custom-scrollbar`}>
          <Outlet />
        </main>

        {/* Mobile Bottom Bar (4 primary items + More) */}
        {!isDocsLoggedOut && (
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 pb-safe pt-1.5 px-3 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.06)] select-none">
            {navItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setShowMoreMenu(false);
                    navigate(item.path);
                  }}
                  className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative ${
                    isActive
                      ? 'text-cyan-700 bg-cyan-50/90 font-black shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-50'
                  }`}
                  title={item.name}
                >
                  <div className={`relative mb-0.5 transition-transform ${isActive ? 'scale-110 text-cyan-600' : 'scale-100'}`}>
                    {item.icon}
                    {item.badge && (
                      <span className={`absolute -top-1 -right-2 text-[8px] font-black px-1 py-0.2 rounded-full uppercase leading-none ${
                        item.isUpgrade ? 'bg-amber-500 text-white' : 'bg-cyan-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight leading-tight truncate w-full text-center">
                    {item.mobileLabel || item.name}
                  </span>
                </button>
              );
            })}

            {/* 5th Tab: More Button */}
            {(() => {
              const isOtherActive = !navItems.slice(0, 4).some((item) => item.path === location.pathname);
              return (
                <button
                  onClick={() => setShowMoreMenu((prev) => !prev)}
                  className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative ${
                    showMoreMenu || isOtherActive
                      ? 'text-cyan-700 bg-cyan-50/90 font-black shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-50'
                  }`}
                  title="More Navigation"
                >
                  <div className={`relative mb-0.5 transition-transform ${showMoreMenu || isOtherActive ? 'scale-110 text-cyan-600' : 'scale-100'}`}>
                    <MoreHorizontal size={18} />
                    {isOtherActive && (
                      <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-white" />
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight leading-tight truncate w-full text-center">
                    More
                  </span>
                </button>
              );
            })()}
          </nav>
        )}

        {/* Mobile "More" Full Navigation Drawer */}
        <AnimatePresence>
          {showMoreMenu && (
            <>
              {/* Dimmed backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMoreMenu(false)}
                className="lg:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[70]"
              />

              {/* Bottom Sheet Menu */}
              <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 z-[80] bg-white rounded-t-[28px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] border-t border-slate-200/90 pb-safe pt-3 px-4 max-h-[85vh] flex flex-col"
              >
                {/* Pull handle indicator */}
                <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 shrink-0" />

                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">All Navigation Options</h3>
                    <p className="text-[11px] font-medium text-slate-500">Quick access to all platform areas</p>
                  </div>
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation Items List */}
                <div className="overflow-y-auto py-3 space-y-1.5 custom-scrollbar flex-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          setShowMoreMenu(false);
                          navigate(item.path);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                          isActive
                            ? 'bg-cyan-50/90 border border-cyan-200 text-cyan-900 shadow-xs'
                            : 'hover:bg-slate-50 border border-transparent text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                            isActive
                              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black tracking-tight truncate">{item.name}</span>
                              {item.badge && (
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none ${
                                  item.isUpgrade ? 'bg-amber-500 text-white' : 'bg-cyan-500 text-white'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.desc && (
                              <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{item.desc}</p>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={15} className={isActive ? 'text-cyan-600 shrink-0' : 'text-slate-300 shrink-0'} />
                      </button>
                    );
                  })}
                </div>

                {/* Account row at bottom of sheet */}
                {isLoggedIn && (
                  <div className="pt-3 pb-2 border-t border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {userData.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{userData.name || 'User'}</p>
                        <p className="text-[10px] text-slate-400 truncate">{userData.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <LogOut size={13} /> Logout
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
