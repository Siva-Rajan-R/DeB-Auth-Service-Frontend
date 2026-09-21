import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Key, RefreshCw, ArrowRight, Zap, Server } from 'lucide-react';

export const OneTimeUrlSection = () => {
  const highlights = [
    { title: "One-time use", desc: "Invalidated immediately after single execution" },
    { title: "Short-lived", desc: "Strict 5-minute TTL to prevent session hijacking" },
    { title: "Application-specific", desc: "Bound directly to your verified Client ID" },
    { title: "Redirect protected", desc: "Enforces strict origin & whitelist verification" },
    { title: "Server-side verification", desc: "Token exchange performed backend-to-backend" },
    { title: "Replay protection", desc: "Nonce & state parameter validation enforced" },
  ];

  const flowSteps = [
    { step: "01", name: "Application", sub: "User Clicks Login" },
    { step: "02", name: "Request Auth Session", sub: "POST /auth/session" },
    { step: "03", name: "DAuth Engine", sub: "Generates Session Token" },
    { step: "04", name: "One-Time URL", sub: "Short-Lived Auth Link" },
    { step: "05", name: "User Auth", sub: "OTP / OAuth / Passkey" },
    { step: "06", name: "Authorization Code", sub: "Redirect Callback" },
    { step: "07", name: "Your Backend", sub: "Stores User in DB" },
  ];

  return (
    <section id="onetime-urls" className="py-24 bg-[#f8fafc] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 -cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <Lock size={14} /> Zero Trust Architecture
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Every login starts with a secure, <br />
            one-time session.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            DAuth generates short-lived authentication URLs for every authentication session, protecting your users from token theft and replay attacks.
          </motion.p>
        </div>

        {/* Horizontal Session Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 mb-16 neu-flat overflow-x-auto"
        >
          <div className="flex items-center justify-between min-w-[800px] gap-2">
            {flowSteps.map((s, idx) => (
              <div key={s.step} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center text-center p-3 rounded-2xl hover:-cyan-400 transition-colors w-full">
                  <span className="text-[10px] font-mono text-cyan-700 font-bold mb-1">{s.step}</span>
                  <span className="text-xs font-bold text-slate-900 tracking-tight">{s.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">{s.sub}</span>
                </div>
                {idx < flowSteps.length - 1 && (
                  <ArrowRight size={14} className="text-cyan-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 6 Security Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl hover:-cyan-400/40 transition-all neu-flat flex items-start gap-4"
            >
              <div className="p-2.5 bg-cyan-50 -cyan-200 rounded-xl text-cyan-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1 tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
