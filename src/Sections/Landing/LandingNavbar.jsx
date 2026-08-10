import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LayoutDashboard, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNetworkCalls } from '../../Utils/NetworkCalls';

export const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { call } = useNetworkCalls();

  const navLinks = [
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'How It Works', href: '#auth-flow', id: 'auth-flow' },
    { name: 'Docs', href: '#auth-docs', id: 'auth-docs', isRoute: true },
    { name: 'Pricing', href: '#pricing', id: 'pricing' },
    { name: 'Use Cases', href: '#use-cases', id: 'use-cases' },
  ];

  // Active section scroll observer
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'auth-flow', 'pricing', 'use-cases'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get('name');
    const urlEmail = params.get('email');
    const urlProfile = params.get('profile');
    const urlAccessToken = params.get('access_token');
    const urlRefreshToken = params.get('refresh_token');

    if (urlAccessToken) Cookies.set('access_token', urlAccessToken);
    if (urlRefreshToken) Cookies.set('refresh_token', urlRefreshToken);
    if (urlName) Cookies.set('user_name', urlName);
    if (urlEmail) Cookies.set('user_email', urlEmail);
    if (urlProfile && urlProfile !== 'null' && urlProfile !== 'undefined') {
      Cookies.set('user_profile', urlProfile);
    }

    const finalName = urlName || Cookies.get('user_name');
    const finalEmail = urlEmail || Cookies.get('user_email');
    const finalProfile = urlProfile || Cookies.get('user_profile');

    if (finalName || finalEmail) {
      setUser({
        name: finalName || 'Developer',
        email: finalEmail || 'user@dauth.dev',
        profile: (finalProfile && finalProfile !== 'null' && finalProfile !== 'undefined') ? finalProfile : null
      });
    }

    // Clean URL bar query params smoothly after storing cookies
    if (urlAccessToken || urlName || urlEmail || urlProfile) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    if (user || Cookies.get('access_token')) {
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    try {
      const res = await call({ method: 'GET', path: '/user/auth', withCred: false });
      if (res) {
        Cookies.set('isInitiated', true);
        const targetUrl = res.signin_url || res.login_url || res.data?.signin_url || res.data?.login_url;
        if (targetUrl) {
          window.location.href = targetUrl;
          return;
        }
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Auth initialization failed:", err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('user_name');
    Cookies.remove('user_email');
    Cookies.remove('user_profile');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/85 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Official DAuth Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <img
            src="/dauth_logo.png"
            alt="DAuth Logo"
            className="h-9 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105"
          />
          <span className="text-xl font-black tracking-tight text-slate-900">
            DAuth
          </span>
        </a>

        {/* Desktop Navigation Links with Active Underscore Indicator */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <div key={link.name} className="relative py-1">
                {link.isRoute ? (
                  <button
                    onClick={() => navigate('/auth-docs')}
                    className={`text-sm font-semibold transition-colors ${
                      isActive ? 'text-cyan-600 font-bold' : 'text-slate-600 hover:text-cyan-600'
                    }`}
                  >
                    {link.name}
                  </button>
                ) : (
                  <a
                    href={link.href}
                    onClick={() => setActiveSection(link.id)}
                    className={`text-sm font-semibold transition-colors ${
                      isActive ? 'text-cyan-600 font-bold' : 'text-slate-600 hover:text-cyan-600'
                    }`}
                  >
                    {link.name}
                  </a>
                )}

                {/* Active Cyan Underscore Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavUnderscore"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-cyan-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop CTAs / Logged-in User Profile Dropdown */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              {/* Profile Avatar Trigger Button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-3 p-1.5 pr-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-cyan-400/60 transition-all shadow-sm group"
              >
                {user.profile && !imgError ? (
                  <img
                    src={user.profile}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-white font-black text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight group-hover:text-cyan-600 transition-colors">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Dashboard</span>
                </div>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-cyan-600 transition-transform group-hover:rotate-180" />
              </button>

              {/* Hover / Click Dropdown Menu */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-2"
                  >
                    {/* User Card info */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                      {user.profile && !imgError ? (
                        <img
                          src={user.profile}
                          alt=""
                          referrerPolicy="no-referrer"
                          onError={() => setImgError(true)}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white font-black flex items-center justify-center text-base">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-xs font-extrabold text-slate-900 truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-500 truncate font-mono">{user.email}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-cyan-600" />
                        Go to Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={16} className="text-red-500" />
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin text-cyan-600" />}
                Sign In
              </button>
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="relative group px-5 py-2.5 rounded-xl font-extrabold text-sm text-white bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin text-white" /> : 'Get Started — Free'}
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-700 hover:text-slate-900 p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.isRoute) navigate('/auth-docs');
                }}
                className="block text-base font-medium text-slate-700 hover:text-cyan-600 py-1"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white font-black flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-center py-3 font-bold text-white bg-cyan-500 rounded-xl shadow-lg shadow-cyan-500/20"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2.5 text-red-600 font-semibold rounded-xl bg-red-50"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignIn}
                    disabled={loading}
                    className="w-full text-center py-2.5 text-slate-700 hover:text-slate-900 font-semibold rounded-xl bg-slate-100"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignIn}
                    disabled={loading}
                    className="w-full text-center py-3 font-bold text-white bg-cyan-500 rounded-xl shadow-lg shadow-cyan-500/20"
                  >
                    Get Started — Free
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
