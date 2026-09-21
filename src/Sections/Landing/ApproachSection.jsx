import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRightLeft, Database, Sparkles } from 'lucide-react';

export const ApproachSection = () => {
  const pillars = [
    {
      step: "01",
      title: "Authenticate",
      icon: <ShieldCheck className="text-cyan-600" size={28} />,
      description: "Let DAuth handle authentication providers, OTP verification, MFA, OAuth flows, passkeys and secure login experiences.",
    },
    {
      step: "02",
      title: "Transfer",
      icon: <ArrowRightLeft className="text-sky-600" size={28} />,
      description: "Once authentication succeeds, DAuth securely transfers the authenticated identity and application context back to your application.",
    },
    {
      step: "03",
      title: "Own",
      icon: <Database className="text-blue-600" size={28} />,
      description: "Your application remains the system of record for your users and application-specific data — keeping you in total control.",
    },
  ];

  return (
    <section id="approach" className="py-24 bg-[#f8fafc] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 -cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <Sparkles size={14} /> The DAuth Philosophy
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Authentication infrastructure, <br />
            without the identity lock-in.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            DAuth sits between your application and authentication providers. We handle the authentication complexity while your application remains responsible for its own user data.
          </motion.p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl p-8 hover:-cyan-400/40 transition-all neu-flat group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-cyan-800 font-bold bg-cyan-100 -cyan-300 px-3 py-1 rounded-full">
                  PILLAR {pillar.step}
                </span>
                <div className="p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                {pillar.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Large Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden neu-flat"
        >
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            DAuth authenticates your users. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
              You own your users.
            </span>
          </h3>
        </motion.div>

      </div>
    </section>
  );
};
