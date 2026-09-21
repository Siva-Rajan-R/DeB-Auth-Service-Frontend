import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Code, Key, Settings, ShieldCheck, Terminal, Copy, Check } from 'lucide-react';

export const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = [
    {
      num: "01",
      title: "Create Your Project",
      subtitle: "Provision API Keys",
      description: "Create a DAuth project in seconds and obtain your secure credentials:",
      details: [
        "Client ID",
        "Client Secret",
        "Allowed Redirect URIs",
        "Authentication Endpoints",
      ],
      code: `// 1. Provision DAuth Credentials
const DAUTH_CLIENT_ID = "dauth_live_89a3f761";
const DAUTH_CLIENT_SECRET = "sk_live_9041a87b...";
const REDIRECT_URI = "https://myapp.com/api/auth/callback";`,
      lang: "javascript",
    },
    {
      num: "02",
      title: "Configure Authentication",
      subtitle: "Enable Providers",
      description: "Enable the exact auth methods your product requires from the dashboard:",
      details: [
        "Google, GitHub, Microsoft, Facebook",
        "Password & Passwordless",
        "Email & Mobile OTPs (India 🇮🇳 & Global)",
        "Passkeys & Hardware Security",
      ],
      code: `// 2. Select Enabled Providers in Dashboard
{
  "enabled_providers": ["google", "github", "otp-email", "passkey"],
  "mfa_required": true,
  "theme": "light"
}`,
      lang: "json",
    },
    {
      num: "03",
      title: "Redirect to DAuth",
      subtitle: "One-Time Session",
      description: "Your backend requests a short-lived, one-time authentication session URL:",
      details: [
        "One-time use session link",
        "Replay attack protection",
        "App-specific context passing",
      ],
      code: `// 3. Request One-Time Auth URL
const response = await fetch("https://api.dauth.dev/v1/auth/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    client_id: DAUTH_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    context: { tenant_id: "org_481" }
  })
});

const { auth_url } = await response.json();
// Redirect user -> auth_url`,
      lang: "javascript",
    },
    {
      num: "04",
      title: "Receive Authenticated Identity",
      subtitle: "Exchange Code",
      description: "Exchange the authorization code for the verified user identity payload:",
      details: [
        "User stays in your database",
        "Identity verified by provider",
        "No platform lock-in",
      ],
      code: `// 4. Identity Payload Received on Backend
{
  "user": {
    "email": "developer@company.com",
    "phone": "+919876543210",
    "name": "Alex Techie"
  },
  "verified": true,
  "provider": "google"
}`,
      lang: "json",
    },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="how-it-works-code" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 -cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <Terminal size={14} /> Integration Workflow
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            One authentication layer. <br /> Every application.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            Integrate DAuth into any stack in minutes using standard OAuth 2.0 authorization code exchange patterns.
          </motion.p>
        </div>

        {/* 4 Steps Grid & Code Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Steps List (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-cyan-50/60 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                    activeStep === idx ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {step.num}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 pl-11 mb-3 font-normal">
                  {step.description}
                </p>

                <div className="pl-11 grid grid-cols-2 gap-1.5 text-[11px] text-slate-700 font-medium">
                  {step.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-cyan-600 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Code Sandbox Preview (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl sticky top-28">
            {/* Terminal Header */}
            <div className="bg-slate-950 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-blue-500/80"></div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  Step {steps[activeStep].num} — {steps[activeStep].subtitle}
                </span>
              </div>
              <button
                onClick={() => handleCopy(steps[activeStep].code)}
                className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 px-3 py-1 rounded-lg transition-colors"
              >
                {copied ? <Check size={14} className="text-blue-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto min-h-[320px] bg-[#030712]/90">
              <pre>
                <code>{steps[activeStep].code}</code>
              </pre>
            </div>

            {/* Sandbox Footer Info */}
            <div className="bg-slate-950 px-6 py-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Standard OAuth 2.0 / OIDC Compliant</span>
              <span className="text-cyan-400 font-bold">DAuth Auth Engine</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
