import { motion } from 'framer-motion';
import { Database, Zap, Layers, Paintbrush, Users, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const WhyDauthSection = () => {
  const reasons = [
    {
      icon: <Database className="text-cyan-600" size={24} />,
      title: "Keep Your Data",
      description: "Keep your application's user records in your own database & infrastructure.",
    },
    {
      icon: <Layers className="text-sky-600" size={24} />,
      title: "Simplify Authentication",
      description: "One unified authentication layer instead of maintaining every provider independently.",
    },
    {
      icon: <Zap className="text-amber-600" size={24} />,
      title: "Build Faster",
      description: "Add modern authentication without implementing every OAuth and OTP flow from scratch.",
    },
    {
      icon: <Paintbrush className="text-emerald-600" size={24} />,
      title: "Customize the Experience",
      description: "Make authentication look and feel like an integral part of your own product.",
    },
    {
      icon: <Users className="text-purple-600" size={24} />,
      title: "Scale Through Partners",
      description: "Agencies and dev shops can manage authentication across multiple client applications.",
    },
    {
      icon: <ShieldCheck className="text-teal-600" size={24} />,
      title: "Pay for Successful Logins",
      description: "Usage is measured strictly by completed authentication events — not page hits.",
    },
  ];

  const securityPrinciples = [
    "Short-lived authentication sessions",
    "One-time authorization URLs",
    "Authorization-code exchange",
    "Redirect URI validation",
    "Client authentication",
    "Replay protection",
    "Secure token handling",
    "Provider verification",
    "MFA support",
    "Passkey support",
    "Auditability",
  ];

  return (
    <section id="why-dauth" className="py-24 bg-white relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Why DAuth Grid */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <Zap size={14} /> Core Advantages
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Why teams choose DAuth
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-8 hover:border-cyan-400/40 transition-all shadow-sm"
            >
              <div className="p-3 bg-white border border-slate-200 rounded-2xl w-fit mb-6 shadow-sm">
                {r.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{r.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{r.description}</p>
            </motion.div>
          ))}
        </div>

        {/* SECURITY PHILOSOPHY SECTION */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl relative text-white">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">
              <Lock size={14} /> Security Philosophy
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-3">
              Authentication is infrastructure. Treat it like it matters.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              DAuth is designed around secure authentication flows, short-lived authorization sessions, protected redirects and server-side verification.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-700/80">
            {securityPrinciples.map((principle, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <CheckCircle2 size={13} className="text-cyan-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-200 truncate">{principle}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
