import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { codeExamples } from '../Constants/index';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, ShieldAlert, Key, Clock, ShieldCheck, RefreshCw, Copy, Check,
  Server, Code2, KeyRound, ArrowDown, Link2, ExternalLink, Webhook,
  Menu, X, ChevronDown, Layers, BookOpen
} from 'lucide-react';
import { useAuthConfigStore } from '../Store/useAuthConfigStore';
import { APP_CONFIG } from '../config';

export const AuthDocs = () => {
  const { theme } = useAuthConfigStore();
  const [activeTab, setActiveTab] = useState('javascript');
  const [copiedCode, setCopiedCode] = useState('');
  const [activeSection, setActiveSection] = useState('endpoints-base');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'endpoints',
      label: 'Endpoints',
      icon: Server,
      subItems: [
        {
          id: 'base-auth-group',
          label: 'Base Auth',
          subItems: [
            { id: 'endpoints-base', label: 'Base Endpoints' },
            { id: 'endpoints-autofill', label: 'Autofill & Lock URLs' },
            { id: 'endpoints-verification', label: 'Verification Webhooks' }
          ]
        },
        { id: 'endpoints-2fa', label: '2-Factor Auth' }
      ]
    },
    { id: 'examples', label: 'Examples', icon: Code2 },
    { id: 'token-info', label: 'Token & Claims', icon: KeyRound },
    { id: 'guidelines', label: 'Security', icon: ShieldCheck }
  ];

  const quickSections = [
    { id: 'endpoints-base', label: 'Base Endpoints' },
    { id: 'endpoints-autofill', label: 'Autofill & Lock' },
    { id: 'endpoints-verification', label: 'Webhooks' },
    { id: 'endpoints-2fa', label: '2FA TOTP' },
    { id: 'examples', label: 'Examples' },
    { id: 'token-info', label: 'Token & Claims' },
    { id: 'guidelines', label: 'Security' },
  ];

  const selectSection = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const container = document.getElementById('docs-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const copyToClipboard = (code, language) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(language);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const CodeEditor = ({ code, language, filename }) => (
    <div className="bg-[#0f172a] rounded-xl border border-slate-700/80 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between bg-slate-900/90 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-300 text-xs font-semibold font-mono">{filename}</span>
        </div>
        <button
          onClick={() => copyToClipboard(code, language)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
        >
          {copiedCode === language ? (
            <>
              <Check size={14} className="text-cyan-400" />
              <span className="text-cyan-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} className="text-slate-400" />
              <span className="text-slate-200">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto custom-scrollbar bg-[#0f172a]">
        <SyntaxHighlighter
          language={codeExamples[language]?.language || language}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: '#0f172a',
            fontSize: '0.875rem',
            lineHeight: '1.6'
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            color: '#475569',
            minWidth: '2.5em',
            paddingRight: '1em',
            textAlign: 'right',
            borderRight: '1px solid #1e293b',
            marginRight: '1.5em'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col md:flex-row relative overflow-hidden bg-[var(--bg-deep)] text-[var(--text-main)] transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent-cyan)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[var(--accent-purple)]/10 blur-[120px] rounded-full" />
      </div>

      {/* MOBILE TOP CONTROLS & NAVIGATION BAR (md:hidden) */}
      <div className="md:hidden flex flex-col w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/90 z-30 shrink-0 sticky top-0 shadow-xs">
        {/* Mobile Header Row */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-cyan-900 bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-200/80">
              Docs v2.0
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-black transition-all border border-slate-200/70"
          >
            <BookOpen size={13} className="text-cyan-600" />
            <span>All Sections</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile Horizontal Swipeable Quick Navigation Pills */}
        <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar scroll-smooth">
          {quickSections.map((sec) => {
            const isSecActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => selectSection(sec.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  isSecActive
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/30'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-200/60'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Dropdown Modal / Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200 bg-white/98 backdrop-blur-2xl px-4 py-3 shadow-xl max-h-[70vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Documentation Directory</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {/* Endpoints Group */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    <Server size={14} className="text-cyan-600" />
                    <span>Endpoints</span>
                  </div>
                  <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-1.5">
                    <button
                      onClick={() => selectSection('endpoints-base')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeSection === 'endpoints-base' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200 font-black' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      • Base Authentication Endpoints
                    </button>
                    <button
                      onClick={() => selectSection('endpoints-autofill')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeSection === 'endpoints-autofill' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200 font-black' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      • Autofill & Lock URLs
                    </button>
                    <button
                      onClick={() => selectSection('endpoints-verification')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeSection === 'endpoints-verification' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200 font-black' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      • Verification Webhooks
                    </button>
                    <button
                      onClick={() => selectSection('endpoints-2fa')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeSection === 'endpoints-2fa' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200 font-black' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      • Two-Factor Authentication (2FA)
                    </button>
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <button
                    onClick={() => selectSection('examples')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                      activeSection === 'examples' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Code2 size={15} className="text-cyan-600" />
                    <span>Implementation Examples</span>
                  </button>
                </div>

                {/* Token & Claims */}
                <div>
                  <button
                    onClick={() => selectSection('token-info')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                      activeSection === 'token-info' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <KeyRound size={15} className="text-cyan-600" />
                    <span>Token & Claims Payloads</span>
                  </button>
                </div>

                {/* Security */}
                <div>
                  <button
                    onClick={() => selectSection('guidelines')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                      activeSection === 'guidelines' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck size={15} className="text-cyan-600" />
                    <span>Security Guidelines</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP SIDEBAR: Hidden on mobile (< md), visible on desktop (md+) */}
      <div className="hidden md:flex md:w-64 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl flex-col relative z-20 shrink-0">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">Docs v2.0</span>
          </motion.div>
        </div>
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            if (item.subItems) {
              return (
                <div key={item.id} className="space-y-1 mb-2">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-500">
                    <item.icon size={16} />
                    <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                  </div>
                  {item.subItems.map((sub) => {
                    if (sub.subItems) {
                      return (
                        <div key={sub.id} className="mb-1 mt-1">
                          <div className="flex items-center gap-2 px-3 py-1 text-slate-400 pl-[34px]">
                            <span className="text-[10px] font-bold uppercase tracking-widest">{sub.label}</span>
                          </div>

                          {/* Tree Branch Container */}
                          <div className="relative ml-[38px] mt-0.5 border-l border-slate-200 space-y-1 py-0.5">
                            {sub.subItems.map((child) => {
                              const isChildActive = activeSection === child.id;

                              return (
                                <div key={child.id} className="relative flex items-center group">
                                  {/* Horizontal Branch Line */}
                                  <div className={`absolute left-0 top-1/2 w-3 h-px bg-slate-200 transition-colors ${isChildActive ? 'bg-cyan-500' : 'group-hover:bg-slate-400'}`}></div>

                                  <button
                                    onClick={() => selectSection(child.id)}
                                    className={`w-full flex items-center px-3 py-1.5 ml-3 rounded-xl transition-all text-xs ${isChildActive
                                      ? 'bg-cyan-500/15 text-cyan-900 border border-cyan-400/60 font-black shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                                      }`}
                                  >
                                    <span>{child.label}</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    const isActive = activeSection === sub.id;
                    return (
                      <div key={sub.id} className="pl-4 pr-1">
                        <button
                          onClick={() => selectSection(sub.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-xs font-bold ${isActive
                            ? 'bg-cyan-500/15 text-cyan-900 border border-cyan-400/60 shadow-xs font-black'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-cyan-600' : 'bg-slate-300'}`} />
                          <span>{sub.label}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            }

            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectSection(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${isActive
                  ? 'bg-cyan-500/15 text-cyan-900 border border-cyan-300/80 shadow-xs font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
              >
                <item.icon size={17} className={isActive ? 'text-cyan-700' : 'text-slate-500'} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* MAIN CONTENT: Takes 100% width on mobile, full breathing room */}
      <div
        id="docs-scroll-container"
        className="flex-1 w-full min-w-0 relative overflow-y-auto overflow-x-hidden custom-scrollbar z-10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 md:mb-3 text-slate-900">
              Authentication <span className="text-cyan-600">Made Simple</span>
            </h1>
            <p className="text-base text-slate-700 font-medium leading-relaxed">
              Secure OAuth 2.0 Implementation with JWT Tokens. Assign API Key & Client Secret once, get seamless authentication across all your apps.
            </p>
          </header>

          {/* Base API URL Banner */}
          {(activeSection === 'endpoints-base' || activeSection === 'endpoints-2fa') && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-glass)] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20">
                  <Server size={24} />
                </div>
                <div>
                  <span className="text-[var(--text-dim)] text-xs font-bold uppercase tracking-wider block mb-0.5">DAuth Base API URL</span>
                  <code className="text-cyan-600 dark:text-cyan-400 font-mono font-extrabold text-sm sm:text-base md:text-lg break-all">{APP_CONFIG.BACKEND_URL}</code>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(APP_CONFIG.BACKEND_URL, 'base_url')}
                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 rounded-xl text-xs font-bold transition-colors border border-cyan-500/20 flex items-center gap-2 self-stretch md:self-auto justify-center"
              >
                {copiedCode === 'base_url' ? (
                  <>
                    <Check size={14} className="text-blue-500" />
                    <span className="text-blue-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Base URL</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="space-y-8 pb-12">
            {activeSection === 'endpoints-base' && (
              <section id="endpoints-base" className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <RefreshCw size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Authentication Workflow & API Endpoints</h2>
                    <p className="text-sm text-[var(--text-dim)]">Complete step-by-step authentication flow from login URL to JWT code exchange.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full relative">
                  {/* Flow Line (optional background connector) */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-cyan)] via-[var(--accent-purple)] to-blue-500 opacity-20 -translate-x-1/2 hidden md:block"></div>

                  {/* STEP 1: GET SIGNIN & SIGNUP URLS WITH ADDITIONAL INFOS */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">POST</span>
                        <code className="text-[var(--text-main)] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">/auth</code>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">Step 1: Get Sign-in & Sign-up URLs</span>
                    </div>

                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Send your registered <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">apikey</code>. Optionally attach custom application metadata in <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">additional_infos</code> (e.g. user roles, tenant IDs, custom metadata). DAuth stores this securely in session and returns it inside the final JWT payload after sign-in.
                    </p>

                    <div className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Request Body</span>
                        <CodeEditor
                          code={`{\n  "apikey": "DeB-pCRP-C07EthcUz8VjKL-4AUOpVhZBkEpZfqDFOmdhzk",\n  "additional_infos": {\n    "role": "admin",\n    "tenant_id": "org_acme_corp",\n    "user_custom_data": "custom_value"\n  }\n}`}
                          language="json"
                          filename="request_step1.json"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Actual Server Response</span>
                        <CodeEditor
                          code={`{\n  "signin_url": "${APP_CONFIG.FRONTEND_URL}/auth/request/req_12345/signin",\n  "signup_url": "${APP_CONFIG.FRONTEND_URL}/auth/request/req_12345/signup"\n}`}
                          language="json"
                          filename="response_step1.json"
                        />
                      </div>
                    </div>

                    {/* PARAMETER SPECIFICATION TABLE */}
                    <div className="border-t border-slate-200/80 pt-4">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-3">Parameter Specification</span>
                      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider font-extrabold">
                              <th className="py-2.5 px-3">Parameter</th>
                              <th className="py-2.5 px-3">Type</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-2.5 px-3"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">apikey</code></td>
                              <td className="py-2.5 px-3 font-mono text-xs text-slate-600">string</td>
                              <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-2.5 px-3 text-xs text-slate-600 leading-relaxed">Product client API Key registered in your dashboard.</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-2.5 px-3"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">additional_infos</code></td>
                              <td className="py-2.5 px-3 font-mono text-xs text-slate-600">object</td>
                              <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold rounded-md uppercase">Optional</span></td>
                              <td className="py-2.5 px-3 text-xs text-slate-600 leading-relaxed"><strong className="text-slate-800">Declared for your purpose.</strong> Custom key-value app metadata (e.g. role, tenant_id) securely attached & returned in final JWT token.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* FLOW ARROW 1 */}
                  <div className="flex flex-col items-center justify-center py-2 text-[var(--accent-cyan)] relative z-10 md:hidden">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-[var(--accent-cyan)] to-transparent opacity-50 mb-1"></div>
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center text-[var(--accent-cyan)] relative z-10 w-14 h-14 bg-[var(--bg-deep)] rounded-full border border-[var(--border-glass)] my-4 shadow-lg shadow-cyan-500/20">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>

                  {/* STEP 2: USER LOGIN & BROWSER REDIRECT */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">REDIRECT</span>
                        <code className="text-[var(--text-main)] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">Redirect URL</code>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-900 bg-cyan-50 px-2 py-1 rounded-md border border-cyan-200/80">Step 2: User Sign-In & Redirect</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Direct user to <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">signin_url</code> or <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">signup_url</code>. Once user completes authentication, DAuth redirects back to your registered success URL with a temporary <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">token_id</code>.
                    </p>
                    <CodeEditor
                      code={`https://yourdomain.com/your-redirect-url?token_id=e7b41b90c0_a812f9k`}
                      language="bash"
                      filename="redirect_url_format.txt"
                    />
                    <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/20 text-xs text-[var(--text-muted)] leading-relaxed">
                      💡 <strong>Note:</strong> Extract the <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">token_id</code> parameter from the URL query string in your redirect handler.
                    </div>
                  </div>

                  {/* FLOW ARROW 2 */}
                  <div className="flex flex-col items-center justify-center py-2 text-blue-500 relative z-10 md:hidden">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-[var(--accent-cyan)] to-blue-500 opacity-50 mb-1"></div>
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center text-blue-500 relative z-10 w-14 h-14 bg-[var(--bg-deep)] rounded-full border border-[var(--border-glass)] my-4 shadow-lg shadow-blue-500/20">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>

                  {/* STEP 3: TOKEN_ID EXCHANGE FOR JWT */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">POST</span>
                        <code className="text-[var(--text-main)] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">/auth/authenticated-user</code>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/80">Step 3: Exchange token_id for JWT</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Send <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">token_id</code>, <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">client_id</code> (your API key), and <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">client_secret</code> to receive the final signed JWT token.
                    </p>

                    <div className="space-y-4">
                      <CodeEditor
                        code={`{\n  "token_id": "e7b41b90c0_a812f9k",\n  "client_id": "DeB-pCRP-C07EthcUz8VjKL-4AUOpVhZBkEpZfqDFOmdhzk",\n  "client_secret": "your_registered_client_secret"\n}`}
                        language="json"
                        filename="request_step3.json"
                      />
                      <CodeEditor
                        code={`{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."\n}`}
                        language="json"
                        filename="response_step3.json"
                      />
                    </div>

                    {/* PARAMETER SPECIFICATION TABLE */}
                    <div className="border-t border-slate-200/80 pt-4">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-3">Parameter Specification</span>
                      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider font-extrabold">
                              <th className="py-2.5 px-3">Parameter</th>
                              <th className="py-2.5 px-3">Type</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-2.5 px-3"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">token_id</code></td>
                              <td className="py-2.5 px-3 font-mono text-xs text-slate-600">string</td>
                              <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-2.5 px-3 text-xs text-slate-600 leading-relaxed">Authorization token ID extracted from redirect URL query param.</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-2.5 px-3"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">client_id</code></td>
                              <td className="py-2.5 px-3 font-mono text-xs text-slate-600">string</td>
                              <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-2.5 px-3 text-xs text-slate-600 leading-relaxed">Your registered product client API Key.</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-2.5 px-3"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">client_secret</code></td>
                              <td className="py-2.5 px-3 font-mono text-xs text-slate-600">string</td>
                              <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-2.5 px-3 text-xs text-slate-600 leading-relaxed">Your registered confidential Client Secret key.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            )}

            {activeSection === 'endpoints-autofill' && (
              <section id="endpoints-autofill" className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    <Link2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Autofill & Lock URLs</h2>
                    <p className="text-sm text-[var(--text-dim)]">Generate secure, pre-filled authentication links to reduce onboarding friction.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full relative">
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">FEATURE</span>
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Autofill & Lock URLs</h3>
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Generate secure, pre-filled authentication links to drastically reduce onboarding friction. When users click the link, their information is already filled in and strictly locked, enforcing the auth flow you defined.
                    </p>

                    <div className="space-y-4 mt-2">
                      <h4 className="text-sm font-bold text-[var(--text-main)]">URL Parameters:</h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--text-muted)]">
                        <li><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">prefill_email</code> / <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">prefill_phone</code>: The value to pre-populate.</li>
                        <li><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">lock_method</code>: <code className="text-slate-900 font-mono font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-xs">otp</code> or <code className="text-slate-900 font-mono font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-xs">password</code>. Prevents the user from altering the prefilled field.</li>
                      </ul>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Example Magic Link</span>
                        <CodeEditor
                          code={`http://localhost:5173/auth/REQUEST_ID/signin?prefill_email=user@example.com&lock_method=otp`}
                          language="text"
                          filename="magic_link.txt"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'endpoints-verification' && (
              <section id="endpoints-verification" className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Webhook size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Verification & Checking Webhooks</h2>
                    <p className="text-sm text-[var(--text-dim)]">Real-time custom user validation and credential checking webhooks before authentication completes.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full relative">
                  {/* Overview Card */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl space-y-4">
                    <h3 className="text-lg font-bold text-[var(--text-main)]">How Verification Webhooks Work</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Configure <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">signin_verification</code> and <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">signup_verification</code> URLs in your project dashboard under Redirects. When users submit their credentials, DAuth performs an HTTP POST request to your webhook endpoint before generating tokens.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Sign-in Verification</span>
                        <p className="text-xs text-[var(--text-muted)]">Validates that the account exists in your DB and credentials/passwords are correct.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Sign-up Verification</span>
                        <p className="text-xs text-[var(--text-muted)]">Validates whether an account with that email/phone already exists before creating an account.</p>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Payload */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-3">
                      <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Payload Sent by DAuth to Your Webhook</span>
                      <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold font-mono">POST JSON</span>
                    </div>
                    <CodeEditor
                      code={`{\n  "flow_type": "signin", // "signin" or "signup"\n  "auth_provider": "password", // "password", "otp-email", "otp-phone", "google", "github"\n  "email": "user@example.com",\n  "mobile_number": "+19876543210",\n  "password": "plain_entered_password", // sent during password authentication\n  "custom_fields": {},\n  "request_id": "58edb05e-eb34-540f-bbc2-8ad212ce2dd3"\n}`}
                      language="json"
                      filename="dauth_verification_payload.json"
                    />
                  </div>

                  {/* Expected Responses */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl space-y-6">
                    <h3 className="text-base font-bold text-[var(--text-main)]">Expected Webhook Responses</h3>
                    
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Check size={14} /> Success Response (HTTP 200)
                      </span>
                      <p className="text-xs text-[var(--text-muted)]">User is allowed to complete login/registration.</p>
                      <CodeEditor
                        code={`{\n  "success": true,\n  "message": "Verification successful"\n}`}
                        language="json"
                        filename="webhook_success_response.json"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert size={14} /> Failure Response (HTTP 401 / 409 / 400)
                      </span>
                      <p className="text-xs text-[var(--text-muted)]">
                        DAuth immediately displays the status code and error message in the user login modal for easy corrections. After maximum retry attempts, DAuth safely redirects to your failure URL.
                      </p>
                      <CodeEditor
                        code={`{\n  "success": false,\n  "status_code": 401,\n  "message": "Incorrect password. Please check your credentials."\n}`}
                        language="json"
                        filename="webhook_failure_response.json"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'endpoints-2fa' && (
              <section id="endpoints-2fa" className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* 2FA SECTION HEADER */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">POST</span>
                    <h2 className="text-xl md:text-2xl font-bold">Two-Factor Authentication (2FA / TOTP) Endpoints</h2>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm">
                    Domain-Scoped 2FA TOTP secret management per product domain (<code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">client_id</code>). Identifies users by <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">email</code> or <code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-1.5 py-0.5 rounded text-xs">mobile_number</code>.
                  </p>
                </div>

                <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full relative">
                  {/* Flow Line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-sky-400 opacity-20 -translate-x-1/2 hidden md:block"></div>

                  {/* 2FA ENDPOINT 1: SETUP */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">POST</span>
                          <code className="text-[var(--text-main)] font-mono font-bold text-lg">/auth/2fa/setup</code>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/80 self-start mt-2">1. Initiate 2FA & Generate QR Code</span>
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Generate or retrieve a domain-scoped TOTP secret, provisioning URI, and Base64 QR code image for Google Authenticator or Authy.
                    </p>
                    <div className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Request Body</span>
                        <CodeEditor
                          code={`{\n  "client_id": "DeB-pCRP-C07EthcUz8VjKL-4AUOpVhZBkEpZfqDFOmdhzk",\n  "client_secret": "your_registered_client_secret",\n  "email": "user@domain.com"\n  // or "mobile_number": "+19876543210"\n}`}
                          language="json"
                          filename="2fa_setup_request.json"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Actual Server Response</span>
                        <CodeEditor
                          code={`{\n  "success": true,\n  "user_identifier": "user@domain.com",\n  "secret": "JBSWY3DPEHPK3PXP",\n  "provisioning_uri": "otpauth://totp/DeB-Auth:user@domain.com?secret=JBSWY3DPEHPK3PXP&issuer=DeB-Auth",\n  "qr_code_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."\n}`}
                          language="json"
                          filename="2fa_setup_response.json"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FLOW ARROW 1 */}
                  <div className="flex flex-col items-center justify-center py-2 text-blue-500 relative z-10 md:hidden">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 opacity-50 mb-1"></div>
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center text-blue-500 relative z-10 w-14 h-14 bg-[var(--bg-deep)] rounded-full border border-[var(--border-glass)] my-4 shadow-lg shadow-blue-500/20">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>

                  {/* 2FA ENDPOINT 2: SETUP VERIFY */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-cyan-50 text-cyan-900 border border-cyan-200 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">POST</span>
                          <code className="text-[var(--text-main)] font-mono font-bold text-lg">/auth/2fa/setup/verify</code>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-900 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200/80 self-start mt-2">2. Confirm & Enable 2FA</span>
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Submit the initial 6-digit TOTP code generated by the user's authenticator app to permanently enable 2FA on this domain.
                    </p>
                    <div className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Request Body</span>
                        <CodeEditor
                          code={`{\n  "client_id": "DeB-pCRP-C07EthcUz8VjKL-4AUOpVhZBkEpZfqDFOmdhzk",\n  "client_secret": "your_registered_client_secret",\n  "email": "user@domain.com",\n  "code": "123456"\n}`}
                          language="json"
                          filename="2fa_setup_verify_req.json"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Actual Server Response</span>
                        <CodeEditor
                          code={`{\n  "success": true,\n  "user_identifier": "user@domain.com",\n  "message": "Two-Factor Authentication (2FA) enabled successfully for 'user@domain.com' on this product domain"\n}`}
                          language="json"
                          filename="2fa_setup_verify_res.json"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FLOW ARROW 2 */}
                  <div className="flex flex-col items-center justify-center py-2 text-cyan-500 relative z-10 md:hidden">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500 to-sky-400 opacity-50 mb-1"></div>
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center text-cyan-500 relative z-10 w-14 h-14 bg-[var(--bg-deep)] rounded-full border border-[var(--border-glass)] my-4 shadow-lg shadow-cyan-500/20">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>

                  {/* 2FA ENDPOINT 3: VERIFY LOGIN */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">POST</span>
                          <code className="text-[var(--text-main)] font-mono font-bold text-lg">/auth/2fa/verify</code>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/80 self-start mt-2">3. Verify 2FA Code During Sign-In</span>
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Verify time-based 6-digit TOTP code during login for users with active 2FA.
                    </p>

                    <div className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Request Body</span>
                        <CodeEditor
                          code={`{\n  "client_id": "DeB-pCRP-C07EthcUz8VjKL-4AUOpVhZBkEpZfqDFOmdhzk",\n  "client_secret": "your_registered_client_secret",\n  "email": "user@domain.com",\n  "code": "654321"\n}`}
                          language="json"
                          filename="2fa_verify_req.json"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Actual Server Response</span>
                        <CodeEditor
                          code={`{\n  "success": true,\n  "user_identifier": "user@domain.com",\n  "message": "Verification successful"\n}`}
                          language="json"
                          filename="2fa_verify_res.json"
                        />
                      </div>
                    </div>

                    {/* 2FA PARAMETER SPECIFICATION TABLE */}
                    <div className="border-t border-slate-200/80 pt-6 mt-4">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-3">2FA Parameter Specifications</span>
                      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider font-extrabold">
                              <th className="py-3 px-4">Parameter</th>
                              <th className="py-3 px-4">Type</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">client_id</code></td>
                              <td className="py-3 px-4 font-mono text-xs text-slate-600">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed">Product client API Key. Scopes TOTP secret to this product domain.</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">client_secret</code></td>
                              <td className="py-3 px-4 font-mono text-xs text-slate-600">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed">Your registered product client secret key.</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">email</code></td>
                              <td className="py-3 px-4 font-mono text-xs text-slate-600">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-md uppercase">Conditional*</span></td>
                              <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed">User email address (*Either <code className="text-slate-900 font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">email</code> or <code className="text-slate-900 font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">mobile_number</code> must be provided).</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">mobile_number</code></td>
                              <td className="py-3 px-4 font-mono text-xs text-slate-600">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-md uppercase">Conditional*</span></td>
                              <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed">User phone number (*Either <code className="text-slate-900 font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">email</code> or <code className="text-slate-900 font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">mobile_number</code> must be provided).</td>
                            </tr>
                            <tr className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4"><code className="font-mono font-bold text-cyan-900 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-lg text-xs">code</code></td>
                              <td className="py-3 px-4 font-mono text-xs text-slate-600">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed">6-digit time-based verification code generated by Google Authenticator / Authy app (Required on /setup/verify and /verify).</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'examples' && (
              <section id="examples" className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    <Copy size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Implementation Examples</h2>
                    <p className="text-sm text-[var(--text-dim)]">Drop-in code snippets for popular frameworks.</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 scrollbar-hide">
                    {Object.entries(codeExamples).map(([lang, { filename }]) => (
                      <button
                        key={lang}
                        className={`px-6 py-4 font-bold capitalize border-b-2 transition-all flex-shrink-0 flex items-center gap-3 ${activeTab === lang
                          ? 'border-cyan-600 text-cyan-900 font-black bg-white shadow-xs'
                          : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        onClick={() => setActiveTab(lang)}
                      >
                        <span>{lang}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md ${activeTab === lang ? 'bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold' : 'bg-slate-200 text-slate-600'}`}>
                          {filename.split('.').pop()}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="p-4 md:p-6 bg-[#0f172a]">
                    <CodeEditor
                      code={codeExamples[activeTab].code}
                      language={activeTab}
                      filename={codeExamples[activeTab].filename}
                    />
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'token-info' && (
              <section id="token-info" className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
                    <Key size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900">JWT Token Claims & Payloads</h2>
                    <p className="text-sm text-slate-500 font-medium">Understanding JWT payloads with and without custom additional fields.</p>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* WITHOUT ADDITIONAL INFOS */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 text-xs font-black rounded-lg">Standard JWT Payload</span>
                        <h3 className="text-lg font-black text-slate-900">Standard Social/OTP Sign-In</h3>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        Decoded JWT token payload issued after standard authentication without passing custom app metadata.
                      </p>
                      <CodeEditor
                        code={`{\n  "email": "alex.dev@gmail.com",\n  "mobile_number": null,\n  "name": "Alex Dev",\n  "profile_picture": "https://lh3.googleusercontent.com/a/...",\n  "auth_provider": "google",\n  "custom_fields": {},\n  "additional_infos": null,\n  "prefilled": false,\n  "lock_method": null,\n  "ip": "127.0.0.1",\n  "browser": "Mozilla/5.0...",\n  "exp": 1786218915\n}`}
                        language="json"
                        filename="standard-jwt-decoded.json"
                      />
                    </div>

                    {/* WITH ADDITIONAL INFOS & CUSTOM FIELDS */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-cyan-50 text-cyan-900 border border-cyan-200 text-xs font-black rounded-lg">Extended JWT Payload</span>
                        <h3 className="text-lg font-black text-slate-900">With additional_infos & custom_fields</h3>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        Decoded JWT payload returning custom app metadata passed during <code className="text-cyan-900 font-bold bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded text-xs">/auth</code> along with user signup fields.
                      </p>
                      <CodeEditor
                        code={`{\n  "email": "john.doe@acme.com",\n  "mobile_number": "+19876543210",\n  "name": "John Doe",\n  "profile_picture": "https://example.com/avatar.png",\n  "auth_provider": "password",\n  "custom_fields": {\n    "fullname": "John Doe",\n    "phone": "+19876543210"\n  },\n  "additional_infos": {\n    "role": "admin",\n    "tenant_id": "org_acme_corp",\n    "custom_user_id": "usr_abc123"\n  },\n  "location": {\n    "lat": 9.848474,\n    "lng": 78.094087\n  },\n  "prefilled": false,\n  "lock_method": null,\n  "ip": "127.0.0.1",\n  "browser": "Mozilla/5.0...",\n  "exp": 1786218915\n}`}
                        language="json"
                        filename="extended-jwt-decoded.json"
                      />
                    </div>

                    {/* FORGOT PASSWORD / PASSWORD RESET JWT PAYLOAD */}
                    <div className="space-y-4 lg:col-span-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black rounded-lg">Password Reset Payload</span>
                        <h3 className="text-lg font-black text-slate-900">Forgot Password Completion Token</h3>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        When a user resets their password, DAuth issues a token with <code className="text-cyan-900 font-bold font-mono bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded text-xs">auth_provider: &quot;forgot-password&quot;</code> and includes the newly set <code className="text-cyan-900 font-bold font-mono bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded text-xs">password</code> so your backend can hash and update the user&apos;s record.
                      </p>
                      <CodeEditor
                        code={`{\n  "email": "user@example.com",\n  "auth_provider": "forgot-password",\n  "flow_type": "password_reset",\n  "password": "newly_set_secure_password",\n  "custom_fields": {},\n  "additional_infos": null,\n  "ip": "127.0.0.1",\n  "browser": "Mozilla/5.0...",\n  "exp": 1786218915\n}`}
                        language="json"
                        filename="forgot-password-jwt-decoded.json"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Claim Descriptions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <code className="text-cyan-900 font-bold font-mono text-xs bg-cyan-100/70 border border-cyan-200 px-2 py-0.5 rounded-md">additional_infos</code>
                        <p className="text-slate-600 text-xs mt-2 leading-relaxed font-medium">Custom key-value metadata provided by your application when requesting <code className="text-slate-900 font-bold bg-white border border-slate-200 px-1 py-0.5 rounded">POST /auth</code>.</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <code className="text-cyan-900 font-bold font-mono text-xs bg-cyan-100/70 border border-cyan-200 px-2 py-0.5 rounded-md">custom_fields</code>
                        <p className="text-slate-600 text-xs mt-2 leading-relaxed font-medium">Form attributes collected from end-users during sign up (e.g. phone, full name).</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <code className="text-cyan-900 font-bold font-mono text-xs bg-cyan-100/70 border border-cyan-200 px-2 py-0.5 rounded-md">auth_provider</code>
                        <p className="text-slate-600 text-xs mt-2 leading-relaxed font-medium">Provider used (<code className="text-slate-900 font-bold bg-white border border-slate-200 px-1 py-0.5 rounded">google</code>, <code className="text-slate-900 font-bold bg-white border border-slate-200 px-1 py-0.5 rounded">github</code>, <code className="text-slate-900 font-bold bg-white border border-slate-200 px-1 py-0.5 rounded">password</code>, etc.).</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                        <code className="text-cyan-900 font-bold font-mono text-xs bg-cyan-100/70 border border-cyan-200 px-2 py-0.5 rounded-md">location</code>
                        <p className="text-slate-600 text-xs mt-2 leading-relaxed font-medium">Geographic coordinates (latitude and longitude) captured during sign-in if Location Auth is enabled.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'guidelines' && (
              <section id="guidelines" className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900">Security Guidelines</h2>
                    <p className="text-sm text-slate-500 font-medium">Best practices for maintaining a secure implementation.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    { icon: Lock, color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-200', title: "HTTPS Only", desc: "Always use HTTPS in production to protect API keys and tokens in transit." },
                    { icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50 border border-rose-200', title: "Secret Protection", desc: "Never expose your client_secret in client-side code like React or Vue." },
                    { icon: Key, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200', title: "Environment Variables", desc: "Store API keys securely in .env files, not in your version control." },
                    { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-200', title: "Token Expiration", desc: "Our JWTs expire in 1 hour. Implement proper refresh mechanisms." },
                    { icon: Check, color: 'text-cyan-600', bg: 'bg-cyan-50 border border-cyan-200', title: "Server Validation", desc: "Always validate JWT signatures on your backend for protected routes." },
                    { icon: RefreshCw, color: 'text-purple-600', bg: 'bg-purple-50 border border-purple-200', title: "Key Rotation", desc: "Regularly rotate your Client Secret from the dashboard if compromised." }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-4 shadow-xs`}>
                        <item.icon size={22} />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <footer className="pt-8 pb-12 border-t border-[var(--border-glass)] text-center">
            <p className="text-[var(--text-main)] font-bold">Authentication API Documentation v2.0</p>
            <p className="text-[var(--text-dim)] text-sm mt-1">Secure, scalable authentication for your applications</p>
          </footer>
        </div>
      </div>
    </div>
  );
};