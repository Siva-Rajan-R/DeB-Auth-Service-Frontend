import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineKeyboardBackspace, MdDashboard, MdAddBox } from "react-icons/md";
import { Sun, BookOpen, Lock, FileText, AlertTriangle, Settings, Crown } from 'lucide-react';
import { useAuthConfigStore } from '../Store/useAuthConfigStore';
import { useEffect, useState } from 'react';
import { useNetworkCalls } from '../Utils/NetworkCalls';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, hasUnsavedChanges, projectName } = useAuthConfigStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [subscriptionState, setSubscriptionState] = useState(null);
  const { call } = useNetworkCalls();

  useEffect(() => {
    const fetchSub = async () => {
      const res = await call({ method: 'GET', path: '/billing/subscription', withCred: true });
      if (res) {
        setSubscriptionState(res);
      }
    };
    fetchSub();
    
    const handleScroll = (e) => setIsScrolled(e.detail > 40);
    window.addEventListener('page-scroll', handleScroll);
    return () => window.removeEventListener('page-scroll', handleScroll);
  }, []);

  useEffect(() => {
    // For now, lock the app in light mode
    if (theme !== 'light') {
      toggleTheme(); // This will flip it, or just force the attribute
    }
    document.documentElement.setAttribute('data-theme', 'light');
  }, [theme, toggleTheme]);

  const navItems = [
    { name: 'Projects',  path: '/dashboard',        icon: <MdDashboard size={15} /> },
    { name: 'Create',    path: '/dashboard-detail',  icon: <MdAddBox size={15} /> },
    { name: 'Docs',      path: '/auth-docs',         icon: <BookOpen size={13} /> },
    { name: 'Settings',  path: '/settings',          icon: <Settings size={13} /> },
    { name: 'Invoices',  path: '/invoices',          icon: <FileText size={13} /> },
    { name: 'Upgrade',   path: '/pricing',           icon: <Crown size={13} /> },
  ];

  return (
    <div className="h-[100dvh] overflow-hidden w-full bg-[var(--bg-deep)] text-[var(--text-main)] transition-colors duration-300 flex flex-col relative">
      {subscriptionState && subscriptionState.status !== 'active' && subscriptionState.plan !== 'Community' && (
        <div className={`w-full py-2 px-4 text-center text-sm font-bold shadow-sm z-[60] flex items-center justify-center gap-2 ${
          subscriptionState.status === 'grace_period' ? 'bg-amber-100 text-amber-800 border-b border-amber-200' :
          subscriptionState.status === 'expired' ? 'bg-red-100 text-red-800 border-b border-red-200' :
          'bg-cyan-100 text-cyan-800 border-b border-cyan-200'
        }`}>
          <AlertTriangle size={16} />
          {subscriptionState.status === 'grace_period' ? 'Your subscription is in a grace period. Please renew to avoid service interruption.' :
           subscriptionState.status === 'expired' ? 'Your subscription has expired. Please upgrade to restore premium features.' :
           'Your subscription is ending soon. Please review your billing.'}
           <button onClick={() => navigate('/pricing')} className="ml-4 underline hover:text-opacity-80">Manage Subscription</button>
        </div>
      )}
      
      {/* Top Background Glow Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] bg-cyan-200/25 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-200/25 blur-[120px] rounded-full" />
      </div>

      {/* Top Application Bar (Desktop & Mobile) */}
      <header className="flex h-16 shrink-0 bg-transparent backdrop-blur-2xl border-b border-[var(--border-glass)] px-4 md:px-6 justify-between items-center w-full relative">

        {/* Left: Back Arrow + DAuth Logo */}
        <div className="flex items-center gap-3 z-10">
          <div
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer group shadow-sm active:scale-95"
          >
            <MdOutlineKeyboardBackspace size={22} className="text-slate-600 group-hover:text-cyan-600 transition-colors" />
          </div>
          {/* DAuth Logo — moved from center to next to back arrow */}
          <div className="flex items-center gap-2">
            <img src="/dauth_logo.png" alt="DAuth Logo" className="w-6 h-6 object-contain" />
            <span className="text-base font-extrabold text-[var(--text-main)] tracking-tight hidden sm:block">
              {location.pathname === '/dashboard-detail' ? projectName : 'DAuth'}
            </span>
          </div>
        </div>

        {/* Center: Soft Neumorphic Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-[#e2e8f0]/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(166,180,200,0.35)] z-10 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isUpgrade = item.name === 'Upgrade';
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 active:scale-95 whitespace-nowrap ${
                  isUpgrade
                    ? isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-[0_0_16px_rgba(6,182,212,0.55)] scale-[1.04] border border-cyan-400/50'
                      : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-400/30 hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] hover:scale-[1.05] border border-cyan-400/30'
                    : isActive
                      ? 'bg-[#edf2f7] text-cyan-800 border border-white shadow-[-4px_-4px_10px_#ffffff,4px_4px_10px_rgba(166,180,200,0.45)] scale-[1.03]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-[#edf2f7]/80 hover:shadow-[-2px_-2px_6px_#ffffff,2px_2px_6px_rgba(166,180,200,0.3)] border border-transparent'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {item.name}
                {isUpgrade && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                  </span>
                )}
              </button>
            );
          })}
          <div className="w-px h-4 bg-slate-300/60 mx-0.5" />
          <button
            disabled
            className="p-2 rounded-xl transition-all text-slate-400 opacity-50 cursor-not-allowed"
            title="Theme is currently locked to Light Mode"
          >
            <div className="relative">
              <Sun size={16} />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <Lock size={8} className="text-slate-700" />
              </div>
            </div>
          </button>
        </nav>

        {/* Right placeholder to balance flex layout (mobile: Create button) */}
        <div className="z-10 flex items-center">
          {/* Mobile only: Create shortcut */}
          <button
            onClick={() => navigate('/dashboard-detail')}
            className="md:hidden p-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 hover:bg-cyan-100 transition-all shadow-sm active:scale-95"
          >
            <MdAddBox size={24} />
          </button>
          {/* Desktop: invisible spacer to balance left group */}
          <div className="hidden md:block w-[120px]" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative pb-20 md:pb-0 overflow-x-hidden overflow-y-auto flex flex-col min-h-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-cyan-100/50 pb-safe pt-2 px-6 flex justify-between items-center shadow-[0_-4px_24px_rgba(59,130,246,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${location.pathname === item.path
                ? 'text-[var(--accent-cyan)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
          >
            <div className={`mb-1 transition-transform ${location.pathname === item.path ? 'scale-110' : 'scale-100'}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold">{item.name}</span>
          </button>
        ))}
        <button
          disabled
          className="flex flex-col items-center p-2 rounded-xl text-[var(--text-muted)] opacity-50 cursor-not-allowed transition-all"
        >
          <div className="mb-1 relative">
            <Sun size={24} />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
              <Lock size={12} className="text-slate-700" />
            </div>
          </div>
          <span className="text-[10px] font-bold">Theme</span>
        </button>
      </nav>
    </div>
  );
};
