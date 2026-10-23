import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, ShieldCheck, Lock, AlertTriangle, Scale, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';

export const TermsOfService = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: '1. Acceptance & Eligibility' },
    { id: 'service-scope', title: '2. Platform Scope & Architecture' },
    { id: 'data-boundaries', title: '3. Data Boundaries (2FA & Analytics)' },
    { id: 'account-security', title: '4. API Keys & Security Duties' },
    { id: 'acceptable-use', title: '5. Acceptable Use Policy' },
    { id: 'subscriptions', title: '6. Subscriptions & Billing' },
    { id: 'service-availability', title: '7. Availability & SLA' },
    { id: 'liability', title: '8. Disclaimers & Liability' },
    { id: 'termination', title: '9. Suspension & Termination' },
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
              to="/privacy"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Privacy Policy
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
          <Scale size={14} className="text-cyan-600" />
          <span>Developer Agreement & Platform Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          These Terms of Service govern your access to and use of the DAuth authentication platform, APIs, authentication endpoints, and hosted login portals. Please read them carefully.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-medium text-slate-500">
          <span>Last Updated: October 2026</span>
          <span>•</span>
          <span>Version 2.4</span>
          <span>•</span>
          <span>Binding Developer Agreement</span>
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
              <span className="font-black text-cyan-950 block mb-1">Developer Notice</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                By generating an API Key or creating a project in the DAuth console, you agree to these platform terms.
              </p>
            </div>
          </div>
        </aside>

        {/* Terms Body */}
        <main className="lg:col-span-8 space-y-10">

          {/* Section 1: Acceptance */}
          <section id="acceptance" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">1.</span> Acceptance & Eligibility
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              By registering an account, initializing an Auth Project, accessing our APIs, or utilizing the DAuth endpoints and redirect flows, you agree to be legally bound by these Terms of Service. If you are accepting these terms on behalf of an entity, you represent and warrant that you possess the requisite authority to bind that entity.
            </p>
          </section>

          {/* Section 2: Platform Scope */}
          <section id="service-scope" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">2.</span> Platform Scope & Architecture
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              DAuth provides developer-first authentication middleware, token exchange services, customizable login portals, and verification webhooks. DAuth operates on a non-custodial model:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs font-medium text-slate-700">
              <li>You maintain direct ownership and control over your end-user records and backend databases.</li>
              <li>DAuth facilitates authentication sessions, issues signed JSON Web Tokens (JWTs), and executes webhook verification without holding your database captive.</li>
            </ul>
          </section>

          {/* Section 3: Data Boundaries (2FA & Analytics) */}
          <section id="data-boundaries" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">3.</span> Explicit Data Boundaries: 2FA & Analytics
            </h2>

            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-sm font-black text-slate-900 block">3.1 Two-Factor Authentication (2FA) Storage Limitation</span>
                <p className="text-slate-600 leading-relaxed">
                  DAuth <strong className="text-slate-900">only stores end-user data strictly required for Two-Factor Authentication</strong> (specifically: domain-scoped TOTP secrets, user identifier email/phone, and verification status). DAuth does NOT store end-user passwords, password hashes, or application profile directories.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 space-y-2 leading-relaxed">
                <span className="text-sm font-black text-cyan-900 block">3.2 Analytics are for Developer Reference Only</span>
                <p>
                  Metrics displayed within the DAuth Developer Console (traffic charts, provider breakdown, active session volume) are computed strictly for your <strong className="text-cyan-900 font-bold">real-time reference, system visibility, and debugging</strong>.
                </p>
                <p>
                  DAuth does <strong>not store, harvest, or retain user behavioral tracking dossiers</strong>, cross-site cookies, or browsing history. Furthermore, DAuth does not sell or share telemetry with third-party advertisers.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: API Keys & Security */}
          <section id="account-security" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">4.</span> API Keys & Security Obligations
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              You are solely responsible for safeguarding the credentials associated with your DAuth projects:
            </p>
            <div className="space-y-2 text-xs font-medium text-slate-700">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Lock size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Client Secret Confidentiality:</strong> Your <code className="font-mono font-bold text-cyan-900 bg-cyan-100/70 px-1 rounded">client_secret</code> is confidential. You must store it exclusively in secure server-side environments and rotate it immediately if exposed.
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Redirect URI Validation:</strong> You must configure exact, trusted redirect URLs. DAuth will refuse redirects to unlisted or wildcard domains.
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Acceptable Use */}
          <section id="acceptable-use" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">5.</span> Acceptable Use Policy
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              You agree not to misuse the DAuth platform. Prohibited activities include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs font-medium text-slate-700">
              <li>Using DAuth login portals for phishing, credential theft, or deceptive impersonation.</li>
              <li>Launching denial-of-service (DDoS) attacks or automated scraping against DAuth endpoints.</li>
              <li>Attempting to probe, bypass, or reverse-engineer DAuth token signing or rate limiting systems.</li>
              <li>Configuring malicious webhooks intended to exploit or overload external third-party infrastructure.</li>
            </ul>
          </section>

          {/* Section 6: Subscriptions & Billing */}
          <section id="subscriptions" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">6.</span> Subscriptions & Billing
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Free tier accounts enjoy baseline features. Paid subscriptions (such as Pro or Enterprise) provide increased project quotas, dedicated throughput, and advanced security capabilities. Invoices are generated transparently in your console under Billing.
            </p>
          </section>

          {/* Section 7: Availability */}
          <section id="service-availability" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">7.</span> Service Availability & SLA
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              We strive to maintain 99.9% uptime for all core authentication pipelines. Scheduled maintenance windows will be communicated in advance via the developer console and official status channels whenever possible.
            </p>
          </section>

          {/* Section 8: Liability */}
          <section id="liability" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">8.</span> Disclaimers & Limitation of Liability
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DAUTH IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND. IN NO EVENT SHALL DAUTH BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR INTEGRATION OR USE OF THE SERVICE.
            </p>
          </section>

          {/* Section 9: Termination */}
          <section id="termination" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-cyan-600">9.</span> Suspension & Termination
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              We reserve the right to suspend or terminate project API keys that violate our Acceptable Use Policy or pose an immediate security hazard to the network. You may delete your project at any time via the project settings panel.
            </p>
          </section>

        </main>
      </div>

    </div>
  );
};
