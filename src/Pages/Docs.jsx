import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { codeExamples } from '../Constants/index';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, Key, Clock, ShieldCheck, RefreshCw, Copy, Check, Server, Code2, KeyRound, ArrowDown } from 'lucide-react';
import { useAuthConfigStore } from '../Store/useAuthConfigStore';
import { APP_CONFIG } from '../config';

export const AuthDocs = () => {
  const { theme } = useAuthConfigStore();
  const [activeTab, setActiveTab] = useState('javascript');
  const [copiedCode, setCopiedCode] = useState('');
  const [activeSection, setActiveSection] = useState('endpoints-base');

  const navItems = [
    {
      id: 'endpoints',
      label: 'Endpoints',
      icon: Server,
      subItems: [
        { id: 'endpoints-base', label: 'Base Auth' },
        { id: 'endpoints-2fa', label: '2-Factor Auth' }
      ]
    },
    { id: 'examples', label: 'Examples', icon: Code2 },
    { id: 'token-info', label: 'Token', icon: KeyRound },
    { id: 'guidelines', label: 'Security', icon: ShieldCheck }
  ];



  const copyToClipboard = (code, language) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(language);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const CodeEditor = ({ code, language, filename }) => (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-glass)] overflow-hidden shadow-xl">
      <div className="flex items-center justify-between bg-black/5 dark:bg-black/40 px-4 py-3 border-b border-[var(--border-glass)]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500/50" />
          </div>
          <span className="text-[var(--text-muted)] text-xs font-medium font-mono">{filename}</span>
        </div>
        <button
          onClick={() => copyToClipboard(code, language)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] rounded-lg text-xs font-medium transition-colors border border-[var(--border-glass)]"
        >
          {copiedCode === language ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          language={codeExamples[language]?.language || language}
          style={theme === 'light' ? prism : atomDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.6'
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            color: 'var(--text-dim)',
            minWidth: '2.5em',
            paddingRight: '1em',
            textAlign: 'right',
            borderRight: '1px solid var(--border-glass)',
            marginRight: '1.5em'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex relative overflow-hidden bg-[var(--bg-deep)] text-[var(--text-main)] transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent-indigo)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[var(--accent-purple)]/10 blur-[120px] rounded-full" />
      </div>

      {/* SIDEBAR */}
      <div className="w-64 border-r border-[var(--border-glass)] bg-[var(--bg-navbar)]/50 backdrop-blur-xl flex flex-col relative z-20">
        <div className="p-6 border-b border-[var(--border-glass)] flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--accent-indigo)]/10 border border-[var(--accent-indigo)]/20 text-[var(--accent-indigo)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Docs v2.0</span>
          </motion.div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            if (item.subItems) {
              return (
                <div key={item.id} className="space-y-1 mb-2">
                  <div className="flex items-center gap-3 px-4 py-2 text-[var(--text-muted)] opacity-70">
                    <item.icon size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                  {item.subItems.map((sub) => {
                    const isActive = activeSection === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSection(sub.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all pl-11 ${isActive
                            ? 'bg-[var(--accent-indigo)] text-white shadow-md shadow-indigo-500/20'
                            : 'text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-main)]'
                          }`}
                      >
                        <span className="text-sm font-bold">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            }

            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-[var(--accent-indigo)] text-white shadow-md shadow-indigo-500/20'
                    : 'text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-main)]'
                  }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div
        id="docs-scroll-container"
        className="flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar z-10"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Authentication <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-purple)]">Made Simple</span>
            </h1>
            <p className="text-base text-[var(--text-muted)]">
              Secure OAuth 2.0 Implementation with JWT Tokens. Assign API Key & Client Secret once, get seamless authentication across all your apps.
            </p>
          </header>

          {/* Base API URL Banner */}
          {(activeSection === 'endpoints-base' || activeSection === 'endpoints-2fa') && (
            <div className="bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-glass)] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                  <Server size={24} />
                </div>
                <div>
                  <span className="text-[var(--text-dim)] text-xs font-bold uppercase tracking-wider block mb-0.5">DAuth Base API URL</span>
                  <code className="text-indigo-600 dark:text-indigo-400 font-mono font-extrabold text-lg">{APP_CONFIG.BACKEND_URL}</code>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(APP_CONFIG.BACKEND_URL, 'base_url')}
                className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-xl text-xs font-bold transition-colors border border-indigo-500/20 flex items-center gap-2 self-stretch md:self-auto justify-center"
              >
                {copiedCode === 'base_url' ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
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
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-indigo)] via-[var(--accent-purple)] to-emerald-500 opacity-20 -translate-x-1/2 hidden md:block"></div>

                  {/* STEP 1: GET SIGNIN & SIGNUP URLS WITH ADDITIONAL INFOS */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">POST</span>
                        <code className="text-[var(--text-main)] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">/auth</code>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">Step 1: Get Sign-in & Sign-up URLs</span>
                    </div>

                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Send your registered <code className="text-indigo-500 font-bold">apikey</code>. Optionally attach custom application metadata in <code className="text-indigo-500 font-bold">additional_infos</code> (e.g. user roles, tenant IDs, custom metadata). DAuth stores this securely in session and returns it inside the final JWT payload after sign-in.
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
                    <div className="border-t border-[var(--border-glass)] pt-4">
                      <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-3">Parameter Specification</span>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[var(--border-glass)] text-[var(--text-muted)] uppercase text-[10px]">
                              <th className="py-2.5 px-3">Parameter</th>
                              <th className="py-2.5 px-3">Type</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-glass)] text-[var(--text-muted)]">
                            <tr>
                              <td className="py-2.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">apikey</td>
                              <td className="py-2.5 px-3 font-mono">string</td>
                              <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-2.5 px-3">Product client API Key registered in your dashboard.</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">additional_infos</td>
                              <td className="py-2.5 px-3 font-mono">object</td>
                              <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] font-bold rounded-md uppercase">Optional</span></td>
                              <td className="py-2.5 px-3"><strong>Declared for your purpose.</strong> Custom key-value app metadata (e.g. role, tenant_id) securely attached & returned in final JWT token.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* FLOW ARROW 1 */}
                  <div className="flex flex-col items-center justify-center py-2 text-[var(--accent-indigo)] relative z-10 md:hidden">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-[var(--accent-indigo)] to-transparent opacity-50 mb-1"></div>
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center text-[var(--accent-indigo)] relative z-10 w-14 h-14 bg-[var(--bg-deep)] rounded-full border border-[var(--border-glass)] my-4 shadow-lg shadow-indigo-500/20">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>

                  {/* STEP 2: USER LOGIN & BROWSER REDIRECT */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">REDIRECT</span>
                        <code className="text-[var(--text-main)] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">Redirect URL</code>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">Step 2: User Sign-In & Redirect</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Direct user to <code className="text-indigo-500 font-bold">signin_url</code> or <code className="text-indigo-500 font-bold">signup_url</code>. Once user completes authentication, DAuth redirects back to your registered success URL with a temporary <code className="text-indigo-500 font-bold">token_id</code>.
                    </p>
                    <CodeEditor
                      code={`https://yourdomain.com/your-redirect-url?token_id=e7b41b90c0_a812f9k`}
                      language="bash"
                      filename="redirect_url_format.txt"
                    />
                    <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/20 text-xs text-[var(--text-muted)] leading-relaxed">
                      💡 <strong>Note:</strong> Extract the <code className="text-indigo-500 font-bold">token_id</code> parameter from the URL query string in your redirect handler.
                    </div>
                  </div>

                  {/* FLOW ARROW 2 */}
                  <div className="flex flex-col items-center justify-center py-2 text-emerald-500 relative z-10 md:hidden">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-[var(--accent-indigo)] to-emerald-500 opacity-50 mb-1"></div>
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center text-emerald-500 relative z-10 w-14 h-14 bg-[var(--bg-deep)] rounded-full border border-[var(--border-glass)] my-4 shadow-lg shadow-emerald-500/20">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>

                  {/* STEP 3: TOKEN_ID EXCHANGE FOR JWT */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">POST</span>
                        <code className="text-[var(--text-main)] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">/auth/authenticated-user</code>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Step 3: Exchange token_id for JWT</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                      Send <code className="text-indigo-500 font-bold">token_id</code>, <code className="text-indigo-500 font-bold">client_id</code> (your API key), and <code className="text-indigo-500 font-bold">client_secret</code> to receive the final signed JWT token.
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
                    <div className="border-t border-[var(--border-glass)] pt-4">
                      <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-3">Parameter Specification</span>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[var(--border-glass)] text-[var(--text-muted)] uppercase text-[10px]">
                              <th className="py-2 px-2">Parameter</th>
                              <th className="py-2 px-2">Type</th>
                              <th className="py-2 px-2">Status</th>
                              <th className="py-2 px-2">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-glass)] text-[var(--text-muted)]">
                            <tr>
                              <td className="py-2 px-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">token_id</td>
                              <td className="py-2 px-2 font-mono">string</td>
                              <td className="py-2 px-2"><span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-2 px-2">Authorization token ID extracted from redirect URL query param.</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">client_id</td>
                              <td className="py-2 px-2 font-mono">string</td>
                              <td className="py-2 px-2"><span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-2 px-2">Your registered product client API Key.</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">client_secret</td>
                              <td className="py-2 px-2 font-mono">string</td>
                              <td className="py-2 px-2"><span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-2 px-2">Your registered confidential Client Secret key.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
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
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">POST</span>
                    <h2 className="text-xl md:text-2xl font-bold">Two-Factor Authentication (2FA / TOTP) Endpoints</h2>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm">
                    Domain-Scoped 2FA TOTP secret management per product domain (<code className="text-indigo-500 font-bold">client_id</code>). Identifies users by <code className="text-indigo-500 font-bold">email</code> or <code className="text-indigo-500 font-bold">mobile_number</code>.
                  </p>
                </div>

                <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full relative">
                  {/* Flow Line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-indigo-500 to-purple-500 opacity-20 -translate-x-1/2 hidden md:block"></div>

                  {/* 2FA ENDPOINT 1: SETUP */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">POST</span>
                          <code className="text-[var(--text-main)] font-mono font-bold text-lg">/auth/2fa/setup</code>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 self-start mt-2">1. Initiate 2FA & Generate QR Code</span>
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
                  <div className="flex flex-col items-center justify-center py-2 text-emerald-500 relative z-10 md:hidden">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500 to-indigo-500 opacity-50 mb-1"></div>
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center text-emerald-500 relative z-10 w-14 h-14 bg-[var(--bg-deep)] rounded-full border border-[var(--border-glass)] my-4 shadow-lg shadow-emerald-500/20">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>

                  {/* 2FA ENDPOINT 2: SETUP VERIFY */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">POST</span>
                          <code className="text-[var(--text-main)] font-mono font-bold text-lg">/auth/2fa/setup/verify</code>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 self-start mt-2">2. Confirm & Enable 2FA</span>
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
                  <div className="flex flex-col items-center justify-center py-2 text-indigo-500 relative z-10 md:hidden">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-50 mb-1"></div>
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center text-indigo-500 relative z-10 w-14 h-14 bg-[var(--bg-deep)] rounded-full border border-[var(--border-glass)] my-4 shadow-lg shadow-indigo-500/20">
                    <ArrowDown size={24} className="animate-bounce" />
                  </div>

                  {/* 2FA ENDPOINT 3: VERIFY LOGIN */}
                  <div className="bg-[var(--bg-surface)] w-full backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-5 shadow-xl flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">POST</span>
                          <code className="text-[var(--text-main)] font-mono font-bold text-lg">/auth/2fa/verify</code>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20 self-start mt-2">3. Verify 2FA Code During Sign-In</span>
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
                    <div className="border-t border-[var(--border-glass)] pt-6 mt-4">
                      <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-4">2FA Parameter Specifications</span>
                      <div className="overflow-x-auto bg-black/10 rounded-xl border border-[var(--border-glass)] p-1">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-[var(--border-glass)] text-[var(--text-muted)] uppercase text-xs tracking-wide">
                              <th className="py-3 px-4 font-semibold">Parameter</th>
                              <th className="py-3 px-4 font-semibold">Type</th>
                              <th className="py-3 px-4 font-semibold">Status</th>
                              <th className="py-3 px-4 font-semibold">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-glass)] text-[var(--text-muted)]">
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-400">client_id</td>
                              <td className="py-3 px-4 font-mono text-xs">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-3 px-4 text-xs">Product client API Key. Scopes TOTP secret to this product domain.</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-400">client_secret</td>
                              <td className="py-3 px-4 font-mono text-xs">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-3 px-4 text-xs">Your registered product client secret key.</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-400">email</td>
                              <td className="py-3 px-4 font-mono text-xs">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold rounded-md uppercase">Conditional*</span></td>
                              <td className="py-3 px-4 text-xs">User email address (*Either <code className="text-indigo-400 font-bold bg-indigo-500/10 px-1 rounded">email</code> or <code className="text-indigo-400 font-bold bg-indigo-500/10 px-1 rounded">mobile_number</code> must be provided).</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-400">mobile_number</td>
                              <td className="py-3 px-4 font-mono text-xs">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold rounded-md uppercase">Conditional*</span></td>
                              <td className="py-3 px-4 text-xs">User phone number (*Either <code className="text-indigo-400 font-bold bg-indigo-500/10 px-1 rounded">email</code> or <code className="text-indigo-400 font-bold bg-indigo-500/10 px-1 rounded">mobile_number</code> must be provided).</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-400">code</td>
                              <td className="py-3 px-4 font-mono text-xs">string</td>
                              <td className="py-3 px-4"><span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold rounded-md uppercase">Mandatory</span></td>
                              <td className="py-3 px-4 text-xs">6-digit time-based verification code generated by Google Authenticator / Authy app (Required on /setup/verify and /verify).</td>
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

                <div className="bg-[var(--bg-surface)] backdrop-blur-xl rounded-2xl border border-[var(--border-glass)] shadow-xl overflow-hidden">
                  <div className="flex overflow-x-auto border-b border-[var(--border-glass)] bg-[var(--bg-navbar)] scrollbar-hide">
                    {Object.entries(codeExamples).map(([lang, { filename }]) => (
                      <button
                        key={lang}
                        className={`px-6 py-4 font-bold capitalize border-b-2 transition-all flex-shrink-0 flex items-center gap-3 ${activeTab === lang
                            ? 'border-[var(--accent-indigo)] text-[var(--accent-indigo)] bg-[var(--bg-deep)]'
                            : 'border-transparent text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-main)]'
                          }`}
                        onClick={() => setActiveTab(lang)}
                      >
                        <span>{lang}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md ${activeTab === lang ? 'bg-indigo-500/20' : 'bg-black/10 dark:bg-white/10'}`}>
                          {filename.split('.').pop()}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="p-4 md:p-6 bg-[var(--bg-deep)]">
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
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Key size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">JWT Token Claims & Payloads</h2>
                    <p className="text-sm text-[var(--text-dim)]">Understanding JWT payloads with and without custom additional fields.</p>
                  </div>
                </div>

                <div className="bg-[var(--bg-surface)] backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-[var(--border-glass)] shadow-xl space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* WITHOUT ADDITIONAL INFOS */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg">Standard JWT Payload</span>
                        <h3 className="text-lg font-bold">Standard Social/OTP Sign-In</h3>
                      </div>
                      <p className="text-[var(--text-muted)] text-sm">
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
                        <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg">Extended JWT Payload</span>
                        <h3 className="text-lg font-bold">With additional_infos & custom_fields</h3>
                      </div>
                      <p className="text-[var(--text-muted)] text-sm">
                        Decoded JWT payload returning custom app metadata passed during <code className="text-indigo-500 font-bold">/auth</code> along with user signup fields.
                      </p>
                      <CodeEditor
                        code={`{\n  "email": "john.doe@acme.com",\n  "mobile_number": "+19876543210",\n  "name": "John Doe",\n  "profile_picture": "https://example.com/avatar.png",\n  "auth_provider": "password",\n  "custom_fields": {\n    "fullname": "John Doe",\n    "phone": "+19876543210"\n  },\n  "additional_infos": {\n    "role": "admin",\n    "tenant_id": "org_acme_corp",\n    "custom_user_id": "usr_abc123"\n  },\n  "prefilled": false,\n  "lock_method": null,\n  "ip": "127.0.0.1",\n  "browser": "Mozilla/5.0...",\n  "exp": 1786218915\n}`}
                        language="json"
                        filename="extended-jwt-decoded.json"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[var(--border-glass)] pt-6">
                    <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Claim Descriptions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-glass)]">
                        <code className="text-indigo-600 dark:text-indigo-400 font-bold">additional_infos</code>
                        <p className="text-[var(--text-muted)] text-xs mt-1">Custom key-value metadata provided by your application when requesting <code className="text-indigo-500">POST /auth</code>.</p>
                      </div>
                      <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-glass)]">
                        <code className="text-indigo-600 dark:text-indigo-400 font-bold">custom_fields</code>
                        <p className="text-[var(--text-muted)] text-xs mt-1">Form attributes collected from end-users during sign up (e.g. phone, full name).</p>
                      </div>
                      <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-glass)]">
                        <code className="text-indigo-600 dark:text-indigo-400 font-bold">auth_provider & profile</code>
                        <p className="text-[var(--text-muted)] text-xs mt-1">Authentication provider used (google, github, password, email_otp) and verified user profile attributes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'guidelines' && (
              <section id="guidelines" className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Security Guidelines</h2>
                    <p className="text-sm text-[var(--text-dim)]">Best practices for maintaining a secure implementation.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    { icon: Lock, color: 'text-blue-500', bg: 'bg-blue-500/10', title: "HTTPS Only", desc: "Always use HTTPS in production to protect API keys and tokens in transit." },
                    { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', title: "Secret Protection", desc: "Never expose your client_secret in client-side code like React or Vue." },
                    { icon: Key, color: 'text-amber-500', bg: 'bg-amber-500/10', title: "Environment Variables", desc: "Store API keys securely in .env files, not in your version control." },
                    { icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: "Token Expiration", desc: "Our JWTs expire in 1 hour. Implement proper refresh mechanisms." },
                    { icon: Check, color: 'text-indigo-500', bg: 'bg-indigo-500/10', title: "Server Validation", desc: "Always validate JWT signatures on your backend for protected routes." },
                    { icon: RefreshCw, color: 'text-purple-500', bg: 'bg-purple-500/10', title: "Key Rotation", desc: "Regularly rotate your Client Secret from the dashboard if compromised." }
                  ].map((item, i) => (
                    <div key={i} className="bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-glass)] p-6 rounded-2xl shadow-lg hover:-translate-y-1 transition-transform duration-300">
                      <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                        <item.icon size={24} />
                      </div>
                      <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                      <p className="text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
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