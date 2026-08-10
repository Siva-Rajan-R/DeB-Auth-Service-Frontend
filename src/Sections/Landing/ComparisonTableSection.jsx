import { motion } from 'framer-motion';
import { Check, X, Shield, Sparkles, CheckCircle2, Lock, Briefcase, ShieldCheck } from 'lucide-react';

export const ComparisonTableSection = () => {
  const comparisonData = [
    { cap: "Authentication infrastructure", dauth: "Supported", trad: "Supported" },
    { cap: "Social authentication (Google, GitHub, etc.)", dauth: "Supported", trad: "Supported" },
    { cap: "Email & OTP authentication", dauth: "Supported", trad: "Supported" },
    { cap: "MFA (Multi-Factor)", dauth: "Supported", trad: "Supported" },
    { cap: "Passkeys (WebAuthn)", dauth: "Supported", trad: "Supported" },
    { cap: "Custom authentication UI & Branding", dauth: "Supported", trad: "Supported" },
    { cap: "Application owns user database", dauth: "Core Philosophy", trad: "Depends on architecture" },
    { cap: "Successful-auth usage model", dauth: "Completed Logins Only", trad: "Usually MAU / Total Users" },
    { cap: "Partner / Reseller agency model", dauth: "Built for Agencies", trad: "Varies / Restricted" },
    { cap: "Client project management", dauth: "Centralized Dashboard", trad: "Varies" },
    { cap: "Data ownership focus", dauth: "Zero Vendor Lock-in", trad: "Provider-dependent" },
  ];

  return (
    <section id="comparison" className="py-20 bg-[#f8fafc] relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <Sparkles size={14} /> Architectural Contrast
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Different architecture. <br />
            Different philosophy.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            DAuth isn't just another Auth0 or Clerk clone — it's built around data ownership and agency flexibility.
          </motion.p>
        </div>

        {/* Comparison Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl overflow-x-auto"
        >
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-mono">
                <th className="py-5 px-6 text-slate-600">Capability</th>
                <th className="py-5 px-6 text-cyan-800 font-bold bg-cyan-50 border-x border-cyan-200 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-cyan-600" />
                  <span>DAuth Platform</span>
                </th>
                <th className="py-5 px-6 text-slate-600">Traditional Auth Platforms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
              {comparisonData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800">
                    {row.cap}
                  </td>
                  <td className="py-4 px-6 font-bold text-cyan-900 bg-cyan-50/50 border-x border-cyan-100 font-mono">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-cyan-600 flex-shrink-0" />
                      {row.dauth}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-mono">
                    {row.trad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

      </div>
    </section>
  );
};
