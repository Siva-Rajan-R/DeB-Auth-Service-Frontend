import { useState } from 'react';
import { motion } from 'framer-motion';
import { Paintbrush, UserPlus, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomExperienceSection = () => {
  const navigate = useNavigate();

  const customFields = [
    "Company Name",
    "Employee ID",
    "Referral Code",
    "Business Type",
    "Workspace Name",
    "Customer ID",
  ];

  const brandControls = [
    { label: "Brand Name", value: "Acme Corp" },
    { label: "Primary Accent", value: "#00d2e5" },
    { label: "Card Style", value: "Clean Light" },
    { label: "Typography", value: "Outfit / Inter" },
  ];

  return (
    <section id="custom-ui" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 -cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <Paintbrush size={14} /> Full Brand Identity Control
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Authentication that looks <br />
            like your product.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            Your users should feel like they're signing into your application — not someone else's platform. Paid plans grant full customization over your authentication experience.
          </motion.p>
        </div>

        {/* Interactive Customization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          
          {/* Controls & Custom Fields (Left Column) */}
          <div className="space-y-6">
            
            {/* Branding Customization Card */}
            <div className="bg-[#f8fafc] rounded-3xl p-8 neu-flat">
              <div className="flex items-center gap-3 mb-4 text-slate-900 font-bold text-lg">
                <Paintbrush className="text-cyan-600" size={22} />
                <span>Custom UI & Theme Engine</span>
              </div>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Customize your brand name, logo, custom colors, fonts, buttons, login cards, and full signup experiences without writing custom CSS.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {brandControls.map((c) => (
                  <div key={c.label} className="p-3 rounded-xl neu-flat">
                    <span className="text-[10px] font-mono text-slate-400 block">{c.label}</span>
                    <span className="text-xs font-bold text-slate-900 font-mono mt-0.5 block">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Signup Fields Card */}
            <div className="bg-[#f8fafc] rounded-3xl p-8 neu-flat">
              <div className="flex items-center gap-3 mb-2 text-slate-900 font-bold text-lg">
                <UserPlus className="text-blue-600" size={22} />
                <span>Custom Signup Fields</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Collect the information your application actually needs directly during registration:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {customFields.map((field) => (
                  <div key={field} className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-1.5 neu-flat">
                    <CheckCircle2 size={13} className="text-cyan-600 flex-shrink-0" />
                    <span className="truncate">{field}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Live Preview Card (Right Column) */}
          <div className="bg-gradient-to-br from-cyan-50 via-white to-sky-50 -cyan-200 rounded-3xl p-8 neu-flat relative">
            <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-100 -cyan-300 rounded-full text-[10px] font-mono text-cyan-900 font-bold">
              PREVIEW MATCHING YOUR BRAND
            </div>

            <div className="max-w-sm mx-auto rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-white text-sm">
                  AC
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-none">Acme Corp</h4>
                  <span className="text-[10px] text-slate-500">Sign in to your workspace</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-mono text-slate-600 block mb-1">Company Email</label>
                  <input disabled value="user@acmecorp.com" className="w-full text-xs text-slate-700 rounded-lg px-3 py-2 outline-none font-mono" />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-600 block mb-1">Workspace Name</label>
                  <input disabled value="engineering-team" className="w-full text-xs text-slate-700 rounded-lg px-3 py-2 outline-none font-mono" />
                </div>
                <button className="w-full py-2.5 bg-cyan-500 text-white font-bold rounded-lg text-xs neu-flat shadow-cyan-500/20">
                  Continue to App →
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Banner */}
        <div className="text-center">
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 rounded-xl font-extrabold text-sm text-white bg-cyan-500 hover:bg-cyan-600 neu-flat shadow-cyan-500/20 transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            Customize Your Authentication Experience
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};
