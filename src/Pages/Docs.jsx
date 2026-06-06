import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { codeExamples } from '../Constants/index';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, Key, Clock, ShieldCheck, RefreshCw, Copy, Check, Server, Code2, KeyRound } from 'lucide-react';
import { useAuthConfigStore } from '../Store/useAuthConfigStore';

export const AuthDocs = () => {
  const { theme } = useAuthConfigStore();
  const [activeTab, setActiveTab] = useState('javascript');
  const [copiedCode, setCopiedCode] = useState('');
  const [activeSection, setActiveSection] = useState('endpoints');

  const navItems = [
    { id: 'endpoints', label: 'Endpoints', icon: Server },
    { id: 'examples', label: 'Examples', icon: Code2 },
    { id: 'token-info', label: 'Token', icon: KeyRound },
    { id: 'guidelines', label: 'Security', icon: ShieldCheck }
  ];

  const handleScroll = (e) => {
    const sections = ['endpoints', 'examples', 'token-info', 'guidelines'];
    const scrollPosition = e.target.scrollTop + 150;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element && scrollPosition >= element.offsetTop) {
        setActiveSection(section);
      }
    }
    
    window.dispatchEvent(new CustomEvent('page-scroll', { detail: e.target.scrollTop }));
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    const container = document.getElementById('docs-scroll-container');
    if (element && container) {
      container.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setActiveSection(id);
  };

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
    <div className="w-full flex flex-col relative overflow-hidden bg-[var(--bg-deep)] text-[var(--text-main)] transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent-indigo)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[var(--accent-purple)]/10 blur-[120px] rounded-full" />
      </div>

      <div 
        id="docs-scroll-container"
        className="flex-1 w-full relative overflow-y-auto overflow-x-hidden custom-scrollbar pb-32"
        onScroll={handleScroll}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
          <header className="text-center mb-16 md:mb-24">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-indigo)]/10 border border-[var(--accent-indigo)]/20 text-[var(--accent-indigo)] mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">Documentation v2.0</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Authentication <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-purple)]">Made Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
              Secure OAuth 2.0 Implementation with JWT Tokens. Assign API Key & Client Secret once, get seamless authentication across all your apps.
            </p>
          </header>

          <div className="space-y-24">
            <section id="endpoints" className="scroll-mt-24 relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <RefreshCw size={24} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">API Endpoints</h2>
                  <p className="text-[var(--text-dim)]">Core endpoints for user authentication.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 shadow-xl flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">POST</span>
                    <code className="text-[var(--text-main)] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">/auth</code>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm mb-6 flex-1">Returns a one-time login URL for user authentication. The URL is valid for 5 minutes.</p>
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden border border-[var(--border-glass)] bg-[var(--bg-card)]">
                      <div className="bg-[var(--bg-navbar)] px-4 py-2 border-b border-[var(--border-glass)]">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Request Body</span>
                      </div>
                      <div className="p-4 text-sm font-mono text-[var(--text-main)]">
                        {`{\n  "apikey": "DeB-xxxxxxxxxxxxx"\n}`}
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-[var(--border-glass)] bg-[var(--bg-card)]">
                      <div className="bg-[var(--bg-navbar)] px-4 py-2 border-b border-[var(--border-glass)]">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Response</span>
                      </div>
                      <div className="p-4 text-sm font-mono text-emerald-600 dark:text-emerald-400">
                        {`{\n  "login_url": "https://auth.debuggers.com/..."\n}`}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl p-6 shadow-xl flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">POST</span>
                    <code className="text-[var(--text-main)] font-mono font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">/token</code>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm mb-6 flex-1">Exchange authorization code for JWT token. Requires your client secret for security.</p>
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden border border-[var(--border-glass)] bg-[var(--bg-card)]">
                      <div className="bg-[var(--bg-navbar)] px-4 py-2 border-b border-[var(--border-glass)]">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Request Body</span>
                      </div>
                      <div className="p-4 text-sm font-mono text-[var(--text-main)]">
                        {`{\n  "code": "auth_code",\n  "client_secret": "your_secret"\n}`}
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-[var(--border-glass)] bg-[var(--bg-card)]">
                      <div className="bg-[var(--bg-navbar)] px-4 py-2 border-b border-[var(--border-glass)]">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Response</span>
                      </div>
                      <div className="p-4 text-sm font-mono text-emerald-600 dark:text-emerald-400">
                        {`{\n  "token": "eyJhbGciOiJIUzI1NiIs...",\n  "expiresIn": 3600,\n  "tokenType": "Bearer"\n}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="examples" className="scroll-mt-24 relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  <Copy size={24} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Implementation Examples</h2>
                  <p className="text-[var(--text-dim)]">Drop-in code snippets for popular frameworks.</p>
                </div>
              </div>
              
              <div className="bg-[var(--bg-surface)] backdrop-blur-xl rounded-2xl border border-[var(--border-glass)] shadow-xl overflow-hidden">
                <div className="flex overflow-x-auto border-b border-[var(--border-glass)] bg-[var(--bg-navbar)] scrollbar-hide">
                  {Object.entries(codeExamples).map(([lang, { filename }]) => (
                    <button
                      key={lang}
                      className={`px-6 py-4 font-bold capitalize border-b-2 transition-all flex-shrink-0 flex items-center gap-3 ${
                        activeTab === lang 
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

            <section id="token-info" className="scroll-mt-24 relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Key size={24} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">JWT Token Claims</h2>
                  <p className="text-[var(--text-dim)]">Understanding the payload of your secure tokens.</p>
                </div>
              </div>
              
              <div className="bg-[var(--bg-surface)] backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-[var(--border-glass)] shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Token Payload</h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      The JWT returned after successful authentication contains standard and custom claims describing the authenticated user.
                    </p>
                    <CodeEditor 
                      code={`{\n  "iss": "DeB-Auth-Service",\n  "exp": 1672531200,\n  "iat": 1672527600,\n  "email": "user@example.com",\n  "name": "John Doe",\n  "profile_picture": "https://..."\n}`}
                      language="json"
                      filename="decoded-payload.json"
                    />
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--border-glass)] pb-2">Standard Claims</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="mt-1 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          <div>
                            <code className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs font-bold mr-2">iss</code>
                            <span className="text-[var(--text-muted)] text-sm">Token issuer (DeB-Auth-Service)</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />
                          <div>
                            <code className="text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded text-xs font-bold mr-2">exp</code>
                            <span className="text-[var(--text-muted)] text-sm">Expiration time (Valid for 1 hour)</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />
                          <div>
                            <code className="text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded text-xs font-bold mr-2">iat</code>
                            <span className="text-[var(--text-muted)] text-sm">Issued at timestamp</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--border-glass)] pb-2">Custom Profile Claims</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <div>
                            <code className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs font-bold mr-2">email</code>
                            <span className="text-[var(--text-muted)] text-sm">User's verified email address</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <div>
                            <code className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs font-bold mr-2">name</code>
                            <span className="text-[var(--text-muted)] text-sm">User's full name</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <div>
                            <code className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs font-bold mr-2">profile_picture</code>
                            <span className="text-[var(--text-muted)] text-sm">URL to user's avatar (or null)</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="guidelines" className="scroll-mt-24 relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Security Guidelines</h2>
                  <p className="text-[var(--text-dim)]">Best practices for maintaining a secure implementation.</p>
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
          </div>

          <footer className="mt-32 pt-8 border-t border-[var(--border-glass)] text-center">
            <p className="text-[var(--text-main)] font-bold">Authentication API Documentation v2.0</p>
            <p className="text-[var(--text-dim)] text-sm mt-1">Secure, scalable authentication for your applications</p>
          </footer>
        </div>
      </div>

      <div className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-[var(--bg-navbar)] backdrop-blur-2xl rounded-2xl border border-[var(--border-glass)] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 md:p-2">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl transition-all min-w-[40px] md:min-w-[100px] justify-center ${
                    isActive
                      ? 'bg-[var(--accent-indigo)] text-white shadow-md shadow-indigo-500/20'
                      : 'text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-main)]'
                  }`}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-xs font-bold ${isActive ? 'block' : 'hidden md:block'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};