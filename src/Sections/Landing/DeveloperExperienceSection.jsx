import { motion } from 'framer-motion';
import { Terminal, Code, Cpu, ArrowRight, CheckCircle2, Webhook, FileText, Settings, Layers } from 'lucide-react';

export const DeveloperExperienceSection = () => {
  const devFeatures = [
    { title: "REST API", desc: "Clean HTTP API with predictable request/response JSON models" },
    { title: "SDK-Ready Architecture", desc: "Easily wrap endpoints for Python, Node.js, Go, or Ruby" },
    { title: "OAuth 2.0 Compatible Flows", desc: "Uses standard authorization code exchange pattern" },
    { title: "Secure Authorization Code", desc: "Short-lived one-time code verification on backend" },
    { title: "Client ID + Client Secret", desc: "Standard app credentials for authentication requests" },
    { title: "Redirect URI Validation", desc: "Strict origin & domain whitelist checking" },
    { title: "Webhooks", desc: "Event-driven notifications for auth events" },
    { title: "Detailed Documentation", desc: "Copy-pasteable code examples and API references" },
    { title: "Application Configuration", desc: "Granular controls for session TTLs and scopes" },
  ];

  return (
    <section id="developer-exp" className="py-24 bg-white relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <Terminal size={14} /> Developer First Platform
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Built for developers.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            DAuth should disappear into your architecture. Your application should only need to understand one authentication interface.
          </motion.p>
        </div>

        {/* Flow Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-8 mb-16 font-mono text-xs text-slate-800 shadow-lg relative overflow-hidden"
        >
          <div className="text-cyan-700 font-bold mb-4 flex items-center gap-2">
            <Cpu size={16} /> ARCHITECTURE SIMPLIFICATION
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4 px-4 bg-white rounded-2xl border border-slate-200">
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <span className="px-2.5 py-1 bg-slate-50 rounded border border-slate-200 font-semibold">Google</span>
              <span className="px-2.5 py-1 bg-slate-50 rounded border border-slate-200 font-semibold">GitHub</span>
              <span className="px-2.5 py-1 bg-slate-50 rounded border border-slate-200 font-semibold">Microsoft</span>
              <span className="px-2.5 py-1 bg-slate-50 rounded border border-slate-200 font-semibold">Facebook</span>
              <span className="px-2.5 py-1 bg-slate-50 rounded border border-slate-200 font-semibold">Email OTP</span>
              <span className="px-2.5 py-1 bg-slate-50 rounded border border-slate-200 font-semibold">Passkeys</span>
            </div>

            <div className="flex flex-col items-center gap-1 text-cyan-600 font-bold text-xs">
              <ArrowRight size={24} className="animate-pulse hidden md:block" />
              <span>Single Integration</span>
            </div>

            <div className="p-4 bg-cyan-50 border border-cyan-300 rounded-xl text-center">
              <span className="text-cyan-800 font-bold block text-sm">DAuth Engine</span>
              <span className="text-[10px] text-slate-500">Unified Auth Interface</span>
            </div>

            <div className="flex flex-col items-center gap-1 text-emerald-600 font-bold text-xs">
              <ArrowRight size={24} className="animate-pulse hidden md:block" />
              <span>Identity Payload</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-slate-900 font-bold block text-sm">Your Backend</span>
              <span className="text-[10px] text-slate-500">Your Database</span>
            </div>
          </div>
        </motion.div>

        {/* 9 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {devFeatures.map((item, i) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-cyan-400/40 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-base tracking-tight">
                <CheckCircle2 size={16} className="text-cyan-600" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6 font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#hero"
            className="px-8 py-4 rounded-xl font-bold text-sm text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all inline-flex items-center gap-2"
          >
            <FileText size={16} className="text-cyan-600" />
            Read the Documentation
          </a>
        </div>

      </div>
    </section>
  );
};
