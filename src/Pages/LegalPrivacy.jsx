import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Database, EyeOff, BarChart3, CheckCircle2, ArrowLeft, FileText, ExternalLink, HelpCircle } from 'lucide-react';

export const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const sections = [
    { id: 'overview', title: '1. Core Privacy Philosophy' },
    { id: 'data-stored', title: '2. What We Store: 2FA Data Only' },
    { id: 'analytics', title: '3. Analytics: Ephemeral Reference Only' },
    { id: 'what-we-dont-store', title: '4. What We NEVER Store' },
    { id: 'security', title: '5. Encryption & Domain Isolation' },
    { id: 'third-parties', title: '6. Zero Third-Party Monetization' },
    { id: 'developer-duties', title: '7. Customer & Developer Responsibilities' },
  ];

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-900 pb-20">
      
      {/* Decorative Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-cyan-200/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-blue-200/20 blur-[140px] rounded-full" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#e8ecf4]/90 backdrop-blur-xl border-b border-slate-300/70 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 px-3 rounded-xl text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-300/60 shadow-xs transition-all flex items-center gap-2 text-xs font-bold"
              title="Return to Home"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <img src="/dauth_logo.png" alt="DAuth Logo" className="w-5 h-5 object-contain" />
                </div>
              </div>
              <span className="text-base font-black text-slate-900 tracking-tight">DAuth <span className="text-xs font-semibold text-slate-500">Legal</span></span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/terms"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-cyan-600 text-white hover:bg-cyan-700 transition-all shadow-md shadow-cyan-500/20"
            >
              Console
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative z-10 pt-12 pb-8 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/80 text-xs font-bold mb-4 shadow-xs">
          <ShieldCheck size={14} className="text-cyan-600" />
          <span>Strict Data Minimization Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          At DAuth, our mission is built on the philosophy: <strong className="text-slate-900">Your Users. Your Database. Your Authentication.</strong> We believe in extreme data minimization. We do not store your user databases, and we never harvest or monetize your analytics.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-medium text-slate-500">
          <span>Last Updated: October 2026</span>
          <span>•</span>
          <span>Version 2.4</span>
          <span>•</span>
          <span>Effective immediately for all DAuth Projects</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* Table of Contents Sticky Sidebar */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-24 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-2">Table of Contents</span>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeTab === section.id
                      ? 'bg-cyan-500/15 text-cyan-900 border border-cyan-300/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{section.title}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/70 text-xs mt-4">
              <span className="font-black text-cyan-950 block mb-1">Need a signed DPA?</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Enterprise and custom deployments can request a custom Data Protection Addendum from the dashboard.
              </p>
            </div>
          </div>
        </aside>

        {/* Policy Body */}
        <main className="lg:col-span-8 space-y-10">

          {/* Core Highlights Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-3">
                  <Lock size={16} />
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">2-Factor Authentication Only</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  We only store the cryptographic TOTP secret and user identifier strictly needed to generate and verify your Google Authenticator or Authy 2FA codes.
                </p>
              </div>
              <span className="mt-3 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 self-start">
                Zero User Tables
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-cyan-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center justify-center mb-3">
                  <EyeOff size={16} />
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Zero Analytics Tracking</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Dashboard charts and metrics are computed in real-time solely for your operational reference. We do not build personal behavior profiles or store analytics history.
                </p>
              </div>
              <span className="mt-3 text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200 self-start">
                Reference Only
              </span>
            </div>
          </div>

          {/* Section 1: Overview */}
          <section id="overview" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">1.</span> Core Privacy Philosophy
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              DAuth was intentionally architected from day one as a <strong className="text-slate-900">non-custodial authentication pipeline</strong>. Unlike legacy identity providers that mandate migrating your entire customer directory into their proprietary cloud databases, DAuth delegates user verification and account records directly to your own infrastructure or client-side flows.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              We operate under the fundamental principle of data minimization: if we do not need to store data to process a secure cryptographic token, we do not store it.
            </p>
          </section>

          {/* Section 2: 2FA Stored Data */}
          <section id="data-stored" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-cyan-600 font-black text-xl">2.</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                What We Store: 2-Factor Authentication (2FA) Data Only
              </h2>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              The only end-user data DAuth persists in its databases is the minimum cryptographic information strictly required to facilitate <strong className="text-slate-900">Two-Factor Authentication (2FA / TOTP)</strong>.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">The Specific 2FA Fields Stored:</span>
              <ul className="space-y-2 text-xs font-medium text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <code className="font-mono font-bold text-cyan-900 bg-cyan-100/70 px-1.5 py-0.5 rounded text-[11px]">user_identifier</code>: The user&apos;s email address or mobile phone number, provided by the developer during 2FA setup.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <code className="font-mono font-bold text-cyan-900 bg-cyan-100/70 px-1.5 py-0.5 rounded text-[11px]">totp_secret</code>: The cryptographically generated Base32 TOTP seed used to validate 6-digit Authenticator app codes.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <code className="font-mono font-bold text-cyan-900 bg-cyan-100/70 px-1.5 py-0.5 rounded text-[11px]">client_id</code>: Your registered product domain identifier, ensuring complete domain isolation.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <code className="font-mono font-bold text-cyan-900 bg-cyan-100/70 px-1.5 py-0.5 rounded text-[11px]">is_verified</code>: A boolean flag indicating whether the user has successfully entered their initial confirmation code to activate 2FA.
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-medium">
              🔒 <strong>Domain Scoping:</strong> Every 2FA secret is isolated by your project domain (<code className="font-bold">client_id</code>). If an end-user uses the same email across two different applications configured with DAuth, the two applications receive completely separated secrets and cannot cross-inspect each other.
            </div>
          </section>

          {/* Section 3: Analytics Ephemeral Only */}
          <section id="analytics" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-cyan-600 font-black text-xl">3.</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Analytics: Real-Time Operational Reference Only
              </h2>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              In your DAuth Developer Console, you can view insights such as authentication traffic patterns, provider breakdown (Google, GitHub, Password, OTP), active session volumes, and webhook latency.
            </p>

            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 space-y-2 text-xs font-medium leading-relaxed">
              <strong className="font-black text-cyan-900 text-sm block">Our Analytics Guarantee:</strong>
              <p>
                • <strong>For Your Reference Only:</strong> All metrics presented in the Analytics dashboard are calculated in-memory for your system administration, troubleshooting, and rate-limit visibility.
              </p>
              <p>
                • <strong>No Telemetry Storage:</strong> We do <strong className="underline">not</strong> store persistent user behavioral journeys, device fingerprint trails, browsing habits, or tracking logs.
              </p>
              <p>
                • <strong>No Advertising / Selling:</strong> We do not monetize, sell, exchange, or bundle your authentication metrics with advertising networks, third-party brokers, or data analytics firms.
              </p>
            </div>
          </section>

          {/* Section 4: What We NEVER Store */}
          <section id="what-we-dont-store" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-cyan-600 font-black text-xl">4.</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                What We NEVER Store
              </h2>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              To give developers and their end-users total confidence, here is a non-exhaustive list of data that DAuth <strong className="text-slate-900">NEVER</strong> saves or archives:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <span className="text-rose-600 font-black text-base">✕</span>
                <span>User Passwords or Password Hashes</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <span className="text-rose-600 font-black text-base">✕</span>
                <span>End-User Profiles & Personal Contact Lists</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <span className="text-rose-600 font-black text-base">✕</span>
                <span>Third-Party Social Tokens (Long-Term)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <span className="text-rose-600 font-black text-base">✕</span>
                <span>Advertising IDs or Behavioral Profiles</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <span className="text-rose-600 font-black text-base">✕</span>
                <span>Application Database Tables</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <span className="text-rose-600 font-black text-base">✕</span>
                <span>Credit Card or Payment Instrument Numbers</span>
              </div>
            </div>
          </section>

          {/* Section 5: Security */}
          <section id="security" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-cyan-600 font-black text-xl">5.</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Encryption & Domain Isolation
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              All communications between your client application, DAuth servers, and webhook endpoints are protected using TLS 1.3 / HTTPS encryption in transit. 
            </p>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              At rest, stored 2FA secrets are encrypted using industry-standard AES-256 encryption. Client credentials (<code className="font-mono text-cyan-900 bg-cyan-50 px-1 rounded">client_secret</code>) are stored as cryptographic hashes; they cannot be decrypted by DAuth personnel.
            </p>
          </section>

          {/* Section 6: Third Parties */}
          <section id="third-parties" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-cyan-600 font-black text-xl">6.</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Zero Third-Party Monetization
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              DAuth is not an ad network and does not engage in surveillance capitalism. We generate revenue exclusively through subscription plans and optional platform upgrades purchased by developers. We will never sell, rent, license, or share user authentication records with data brokers.
            </p>
          </section>

          {/* Section 7: Developer Duties */}
          <section id="developer-duties" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-cyan-600 font-black text-xl">7.</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Customer & Developer Responsibilities
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              As a developer integrating DAuth, you maintain full custody of your users and database. You are responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs font-medium text-slate-700">
              <li>Safeguarding your <code className="font-mono font-bold text-slate-900">client_secret</code> in server-side environment variables and never exposing it in front-end JavaScript bundles.</li>
              <li>Configuring exact, authorized redirect URLs to prevent open-redirect vulnerabilities.</li>
              <li>Publishing your own user-facing Privacy Policy explaining how you handle user records on your own servers.</li>
            </ul>
          </section>

        </main>
      </div>

    </div>
  );
};
