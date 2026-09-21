import { motion } from 'framer-motion';
import { ArrowRight, FileText, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FinalCtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-white via-cyan-50/40 to-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-200/40 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-6">
        
        {/* Official DAuth Logo (Replaced generic shield icon as requested) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-16 h-16 rounded-2xl -cyan-200 flex items-center justify-center mx-auto mb-2 neu-flat shadow-cyan-500/10 p-2.5"
        >
          <img src="/dauth_logo.png" alt="DAuth Logo" className="w-full h-full object-contain" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight"
        >
          Build authentication once. <br />
          <span className="text-cyan-600 font-black">
            Keep control forever.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Give your users modern authentication without giving up ownership of your application's identity data.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base text-white bg-cyan-500 hover:bg-cyan-600 neu-flat shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            Start Building — Free
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/auth-docs')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-slate-700 hover:text-slate-900 hover: neu-flat transition-all flex items-center justify-center gap-2"
          >
            <FileText size={18} className="text-cyan-600" />
            Read Documentation
          </button>
        </motion.div>

      </div>
    </section>
  );
};
