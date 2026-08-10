import { motion } from 'framer-motion';
import { ShieldAlert, MapPin, KeyRound, Fingerprint, Lock, ShieldCheck, Key } from 'lucide-react';

export const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: <MapPin className="text-cyan-600" size={24} />,
      title: "Location-Based Access",
      description: "Restrict authentication based on configured geographic locations when required by your application's compliance rules.",
    },
    {
      icon: <KeyRound className="text-emerald-600" size={24} />,
      title: "MFA (Multi-Factor)",
      description: "Add an additional authentication factor to sensitive accounts and workflows with TOTP and SMS fallback options.",
    },
    {
      icon: <Fingerprint className="text-purple-600" size={24} />,
      title: "Passkeys",
      description: "Support modern passwordless authentication using device-based credentials (WebAuthn / FIDO2).",
    },
    {
      icon: <Lock className="text-sky-600" size={24} />,
      title: "Session Security",
      description: "Control authentication sessions and protect authorization flows against replay attacks and misuse.",
    },
    {
      icon: <ShieldCheck className="text-amber-600" size={24} />,
      title: "OAuth Security",
      description: "Secure provider redirects, authorization codes, PKCE parameter validation, and application callbacks.",
    },
    {
      icon: <Key className="text-teal-600" size={24} />,
      title: "Key-Based Verification",
      description: "Use client credentials and secure server-side token exchange for backend-to-backend services.",
    },
  ];

  return (
    <section id="security" className="py-24 bg-[#f8fafc] relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <ShieldAlert size={14} /> Enterprise Access Controls
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Security controls built into <br />
            the authentication layer.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            Comprehensive security policies enforced at the edge before authentication data ever reaches your application backend.
          </motion.p>
        </div>

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((sec, idx) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-8 hover:border-cyan-400/40 transition-all hover:-translate-y-1 shadow-md"
            >
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl w-fit mb-6">
                {sec.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                {sec.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {sec.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
