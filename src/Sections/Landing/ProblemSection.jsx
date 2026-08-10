import { motion } from 'framer-motion';
import { AlertTriangle, Lock, Layers, Code2 } from 'lucide-react';

export const ProblemSection = () => {
  const problems = [
    {
      icon: <Code2 className="text-amber-600" size={24} />,
      title: "Build Everything Yourself",
      description: "Implement OAuth, OTP, password authentication, MFA, passkeys, recovery flows, security policies and session management from scratch.",
      badge: "High Overhead",
    },
    {
      icon: <Lock className="text-red-600" size={24} />,
      title: "Give Up Control",
      description: "Traditional authentication platforms can become deeply embedded in your application's identity infrastructure, locking your data away.",
      badge: "Vendor Lock-in",
    },
    {
      icon: <Layers className="text-cyan-600" size={24} />,
      title: "Manage Multiple Providers",
      description: "Maintaining Google, GitHub, Microsoft, Facebook, email and phone authentication separately creates unnecessary complexity.",
      badge: "API Fatigue",
    },
  ];

  return (
    <section id="problem" className="py-24 bg-white relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold"
          >
            <AlertTriangle size={14} /> The Authentication Dilemma
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Authentication shouldn't mean giving up control of your users.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            Modern applications need Google, GitHub, Microsoft, Facebook, email authentication, OTP, MFA, passkeys, password recovery, custom signup flows and more. <br />
            Building all of this internally takes significant engineering effort — but outsourcing authentication can create another problem: your application's identity layer becomes dependent on a third-party platform.
          </motion.p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((prob, i) => (
            <motion.div
              key={prob.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#f8fafc] border border-slate-200/80 rounded-3xl p-8 hover:border-cyan-400/40 transition-all hover:-translate-y-1 relative flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    {prob.icon}
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-mono text-slate-600 font-semibold shadow-sm">
                    {prob.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  {prob.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {prob.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 text-xs font-mono text-slate-400">
                0{i + 1} / Problem
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
