import { motion } from 'framer-motion';
import { ShoppingBag, Landmark, HeartPulse, Building2, Briefcase, ShieldCheck, Zap, Layers, Lock, Cpu, Globe } from 'lucide-react';

export const UseCasesSection = () => {
  const chips = [
    { icon: <Building2 className="text-cyan-600" size={18} />, label: "SaaS Platforms" },
    { icon: <ShoppingBag className="text-emerald-600" size={18} />, label: "E-Commerce" },
    { icon: <Landmark className="text-amber-600" size={18} />, label: "FinTech" },
    { icon: <HeartPulse className="text-red-600" size={18} />, label: "Healthcare" },
    { icon: <Building2 className="text-purple-600" size={18} />, label: "Enterprise Software" },
    { icon: <Briefcase className="text-teal-600" size={18} />, label: "Agencies & Dev Shops" },
    { icon: <ShieldCheck className="text-cyan-600" size={18} />, label: "Mobile Apps" },
    { icon: <Zap className="text-amber-600" size={18} />, label: "API Gateways" },
    { icon: <Layers className="text-sky-600" size={18} />, label: "Multi-Tenant Systems" },
    { icon: <Lock className="text-emerald-600" size={18} />, label: "Zero-Trust Infra" },
    { icon: <Cpu className="text-indigo-600" size={18} />, label: "Microservices" },
    { icon: <Globe className="text-cyan-600" size={18} />, label: "Global Web Apps" },
  ];

  // Quadrupled array for ultra-smooth, seamless infinite marquee loop
  const marqueeChips = [...chips, ...chips, ...chips, ...chips];

  return (
    <section id="use-cases" className="py-20 bg-[#f8fafc] relative border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-semibold">
            <img src="/dauth_logo.png" alt="DAuth" className="h-4 w-auto object-contain" />
            <span>Supported Architectures</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Authentication for every kind of application.
          </motion.h2>
        </div>

      </div>

      {/* CONTINUOUS SILKY-SMOOTH INFINITE CHIP MARQUEE */}
      <div className="w-full relative overflow-hidden py-4">
        {/* Gradient edge masks for smooth fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/80 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4 w-max transform-gpu will-change-transform"
          animate={{ x: ['0%', '-25%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            duration: 32,
          }}
        >
          {marqueeChips.map((chip, i) => (
            <div
              key={i}
              className="px-5 py-3 bg-white border border-slate-200/90 rounded-full flex items-center gap-3 shadow-sm hover:shadow-md hover:border-cyan-400/60 hover:scale-105 transition-all cursor-pointer font-bold text-xs sm:text-sm text-slate-800"
            >
              <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-full flex justify-center items-center">
                {chip.icon}
              </div>
              <span className="whitespace-nowrap">{chip.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};
