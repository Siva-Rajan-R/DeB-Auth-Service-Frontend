import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineKeyboardBackspace, MdDashboard, MdAddBox, MdSettings, MdSave } from "react-icons/md";
import { Sun, Moon, BookOpen, Lock } from 'lucide-react';
import { useAuthConfigStore } from '../Store/useAuthConfigStore';
import { useEffect, useState } from 'react';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, hasUnsavedChanges, projectName } = useAuthConfigStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
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
    { name: 'Projects', path: '/dashboard', icon: <MdDashboard size={24} /> },
    { name: 'Create', path: '/dashboard-detail', icon: <MdAddBox size={24} /> },
    { name: 'Docs', path: '/auth-docs', icon: <BookOpen size={24} /> },
  ];

  return (
    <div className="h-[100dvh] overflow-hidden w-full bg-[var(--bg-deep)] text-[var(--text-main)] transition-colors duration-300 flex flex-col relative">
      {/* Top Background Glow Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] bg-blue-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full" />
      </div>

      {/* Top Application Bar (Desktop & Mobile) */}
      <header className="flex h-16 shrink-0 bg-transparent backdrop-blur-2xl border-b border-[var(--border-glass)] px-4 md:px-6 justify-between items-center w-full relative">
        <div className="flex items-center gap-4">
          <div
            onClick={() => window.location.href = "/"}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer group shadow-sm active:scale-95 z-10"
          >
            <MdOutlineKeyboardBackspace size={24} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
          </div>
        </div>

        {/* Center Logo / App Name */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none z-0 h-full w-full overflow-hidden">
          <div className={`flex items-center gap-2 transition-all duration-300 absolute ${isScrolled ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className="w-5 h-5 md:w-6 md:h-6 bg-indigo-500 rounded flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-[10px] md:text-xs">D</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-[var(--text-main)] tracking-tight">
              {location.pathname === '/dashboard-detail' ? projectName : 'deb-Authentication'}
            </h1>
          </div>
          <div className={`flex items-center gap-2 transition-all duration-300 absolute ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <h1 className="text-lg md:text-xl font-bold text-[var(--text-main)] tracking-tight">
              {location.pathname === '/dashboard' ? 'Auth Projects' : location.pathname === '/dashboard-detail' ? projectName : location.pathname === '/auth-docs' ? 'Deb-auth-docs' : 'Dashboard'}
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-1 rounded-xl z-10">
          {navItems.map((item) => {
            const isCreateBtn = item.name === 'Create';
            const showSave = isCreateBtn && location.pathname === '/dashboard-detail';
            const btnName = showSave ? 'Save' : item.name;
            return (
              <button
                key={item.path}
                onClick={() => {
                  if (showSave) {
                    window.dispatchEvent(new Event('trigger-save-config'));
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  location.pathname === item.path
                    ? showSave && hasUnsavedChanges
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-indigo-600 text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {btnName}
                {showSave && hasUnsavedChanges && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-indigo-600"></span>
                  </span>
                )}
              </button>
            );
          })}
          <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1" />
          <button
            disabled
            className="p-2 rounded-lg transition-all text-[var(--text-muted)] opacity-50 cursor-not-allowed"
            title="Theme is currently locked to Light Mode"
          >
            <div className="relative">
              <Sun size={18} />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                <Lock size={10} className="text-slate-700" />
              </div>
            </div>
          </button>
        </nav>
        {/* Mobile Right Action: Create / Save Button */}
        <div className="md:hidden z-10 flex items-center">
          {location.pathname === '/dashboard-detail' ? (
            <button 
              onClick={() => window.dispatchEvent(new Event('trigger-save-config'))}
              className={`relative p-1.5 rounded-lg transition-all shadow-sm active:scale-95 ${
                hasUnsavedChanges 
                  ? 'bg-indigo-600 text-white shadow-indigo-500/30 border border-indigo-500 hover:bg-indigo-700' 
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100'
              }`}
            >
              <MdSave size={24} />
              {hasUnsavedChanges && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-indigo-600"></span>
                </span>
              )}
            </button>
          ) : (
            <button 
              onClick={() => navigate('/dashboard-detail')}
              className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-all shadow-sm active:scale-95"
            >
              <MdAddBox size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative pb-20 md:pb-0 overflow-x-hidden flex flex-col min-h-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-indigo-100/50 pb-safe pt-2 px-6 flex justify-between items-center shadow-[0_-4px_24px_rgba(59,130,246,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${location.pathname === item.path
                ? 'text-[var(--accent-indigo)]'
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
