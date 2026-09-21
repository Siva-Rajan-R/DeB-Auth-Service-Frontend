import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineKeyboardBackspace, MdDashboard, MdAddBox } from "react-icons/md";
import { Sun, BookOpen, Lock, FileText, AlertTriangle, Settings, Crown, ChevronRight, Zap, LogOut, Code, Copy, Check, BarChart2 } from 'lucide-react';
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
  const { call } = useNetworkCalls();

  useEffect(() => {
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

  const handleLogout = () => {
    Cookies.remove('access_token');
    window.location.href = '/';
  };

  const copySdkCommand = () => {
    navigator.clipboard.writeText('npm i @dauth/react');
    setCopiedSdk(true);
    setTimeout(() => setCopiedSdk(false), 2000);
  };

  const navItems = [
    { name: 'Auth Projects',  path: '/dashboard',        icon: <MdDashboard size={18} />, badge: null },
    { name: 'Analytics',      path: '/analytics',        icon: <BarChart2 size={17} />,   badge: null },
    { name: 'Create Project', path: '/dashboard-detail',  icon: <MdAddBox size={18} />, badge: 'NEW' },
    { name: 'API Docs & SDK', path: '/auth-docs',         icon: <BookOpen size={17} />, badge: null },
    { name: 'Settings',       path: '/settings',          icon: <Settings size={17} />, badge: null },
    { name: 'Invoices',       path: '/invoices',          icon: <FileText size={17} />, badge: null },
    { name: 'Upgrade Plan',   path: '/pricing',           icon: <Crown size={17} />, badge: 'PRO', isUpgrade: true },
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
      
      {/* Decorative Glow Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-cyan-200/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-blue-200/20 blur-[130px] rounded-full" />
      </div>

      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-72 h-full flex-col bg-[var(--bg-card)]/90 backdrop-blur-2xl border-r border-slate-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30 shrink-0 select-none">
        
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
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-800 border border-cyan-300/80 shadow-sm font-black'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-600' : 'text-slate-600'}`}>
                        {item.icon}
                      </span>
                      <span className={isActive ? 'text-cyan-800 font-black' : ''}>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
              DA
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block leading-tight">Developer</span>
              <span className="text-[10px] font-bold text-slate-600">Active Session</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

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
          
          {/* Left: Back Button + Breadcrumb Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer group shadow-sm active:scale-95 text-slate-700"
              title="Go Back"
            >
              <MdOutlineKeyboardBackspace size={20} className="group-hover:text-cyan-600 transition-colors" />
            </button>

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
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard-detail')}
              className="neu-button-primary px-5 py-2.5 text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95"
            >
              <Zap size={14} className="fill-white" />
              <span>+ Create Project</span>
            </button>

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
        <main className="flex-1 w-full relative pb-20 lg:pb-0 overflow-x-hidden overflow-y-auto flex flex-col min-h-0 custom-scrollbar">
          <Outlet />
        </main>

        {/* Mobile Bottom Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-200 pb-safe pt-2 px-4 flex justify-between items-center shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                location.pathname === item.path ? 'text-cyan-600 font-black' : 'text-slate-500 font-bold'
              }`}
            >
              <div className={`mb-1 transition-transform ${location.pathname === item.path ? 'scale-110 text-cyan-600' : 'scale-100'}`}>
                {item.icon}
              </div>
              <span className="text-[9px]">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
