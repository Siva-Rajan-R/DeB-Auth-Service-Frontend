import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, TrendingUp, DollarSign, CheckCircle2, ArrowRight, ShieldCheck, Briefcase, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PartnerProgramSection = () => {
  const navigate = useNavigate();
  const [clientCount, setClientCount] = useState(100);
  const marginPerClient = 300; // ₹300 margin/mo

  const partnerBenefits = [
    "Multiple client projects management",
    "Dedicated Partner Dashboard",
    "Client & project provisioning",
    "White-label authentication experiences",
    "Recurring monthly revenue opportunity",
    "Volume-based tier rewards",
    "Priority agency support",
    "Technical integration assistance",
  ];

  const partnerTiers = [
    {
      name: "Partner",
      level: "Starting Level",
      badge: "Tier 1",
      features: [
        "Partner Dashboard access",
        "Client project management",
        "Partner resources & docs",
        "Standard agency support",
      ],
    },
    {
      name: "Growth Partner",
      level: "Consistent Volume",
      badge: "Tier 2",
      features: [
        "Additional free project allowances",
        "Priority 24/7 technical support",
        "Co-marketing & directory listing",
        "Dedicated partner manager",
      ],
    },
    {
      name: "Strategic Partner",
      level: "High-Volume Agencies",
      badge: "Tier 3 VIP",
      features: [
        "Higher custom project allowances",
        "Custom commercial & revenue terms",
        "Joint go-to-market opportunities",
        "Direct engineering integration support",
      ],
    },
  ];

  const totalMonthlyRevenue = clientCount * marginPerClient;

  return (
    <section id="partners" className="py-20 bg-[#f8fafc] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 -cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <Briefcase size={14} /> Agency & Partner Program
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Build authentication into <br />
            every product you deliver.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg font-semibold text-cyan-700"
          >
            Partner with DAuth. Turn authentication into a recurring service.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            Software agencies, development companies, and IT service providers can use DAuth across their client applications and package authentication as part of their own managed services.
          </motion.p>
        </div>

        {/* Partner Architecture & Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Architecture Diagram (Left 6 Cols) */}
          <div className="lg:col-span-6 rounded-3xl p-8 neu-flat">
            <div className="text-xs font-mono text-cyan-700 font-bold mb-4 flex items-center gap-2">
              <Users size={16} /> PARTNER AGENCY ARCHITECTURE
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-cyan-50 -cyan-300 rounded-2xl text-center">
                <span className="text-cyan-900 font-bold text-sm block">DAuth Partner Agency</span>
                <span className="text-[10px] text-slate-500">Single Centralized Dashboard</span>
              </div>

              <div className="flex justify-center text-cyan-600 text-xs">↓ Provisions Clients ↓</div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl text-center">
                  <span className="text-slate-900 font-bold block">Client A</span>
                  <span className="text-[9px] text-slate-500">Project 1</span>
                </div>
                <div className="p-3 rounded-xl text-center">
                  <span className="text-slate-900 font-bold block">Client B</span>
                  <span className="text-[9px] text-slate-500">Project 2</span>
                </div>
                <div className="p-3 rounded-xl text-center">
                  <span className="text-slate-900 font-bold block">Client C</span>
                  <span className="text-[9px] text-slate-500">Project 3</span>
                </div>
              </div>

              <div className="flex justify-center text-cyan-600 text-xs">↓ Powered By ↓</div>

              <div className="p-3 rounded-xl text-center">
                <span className="text-cyan-700 font-bold">DAuth Platform Infrastructure</span>
              </div>
            </div>
          </div>

          {/* Partner Benefits (Right 6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Why Agencies Partner with DAuth
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partnerBenefits.map((b, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl flex items-center gap-2.5 neu-flat">
                  <CheckCircle2 size={16} className="text-cyan-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">{b}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* INTERACTIVE PARTNER REVENUE MODEL CALCULATOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="-cyan-200 rounded-3xl p-8 sm:p-12 mb-16 neu-flat relative overflow-hidden"
        >
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-mono text-cyan-700 uppercase tracking-widest font-bold">REVENUE MARGIN MODEL</span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              Your clients pay you. You build the relationship.
            </h3>
            <p className="text-xs text-slate-600">
              Partners package DAuth authentication into their own client retainer or subscription packages.
            </p>
          </div>

          {/* Interactive Slider */}
          <div className="max-w-xl mx-auto space-y-6 p-8 rounded-2xl">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-800">Active Client Projects:</span>
              <span className="text-cyan-700 font-mono text-xl">{clientCount} Clients</span>
            </div>

            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={clientCount}
              onChange={(e) => setClientCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-4">
              <div>
                <span className="text-slate-500 block text-[10px]">DAUTH PLAN</span>
                <span className="text-slate-900 font-bold">₹499 / mo</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">YOUR RETAINER</span>
                <span className="text-slate-900 font-bold">₹799 / mo</span>
              </div>
              <div>
                <span className="text-cyan-700 block text-[10px]">YOUR MARGIN</span>
                <span className="text-cyan-700 font-bold">₹300 / mo</span>
              </div>
            </div>

            <div className="p-4 bg-cyan-100 -cyan-300 rounded-xl text-center">
              <span className="text-xs text-cyan-900 block mb-1">Estimated Recurring Monthly Revenue:</span>
              <span className="text-3xl font-black text-cyan-700 tracking-tight">
                ₹{totalMonthlyRevenue.toLocaleString()} / month
              </span>
            </div>

            <p className="text-[10px] text-slate-500 text-center font-mono">
              * Partner pricing, resale rights and margins are subject to the DAuth Partner Program terms.
            </p>
          </div>
        </motion.div>

        {/* Partner Tiers Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Partner Reward Tiers</h3>
            <p className="text-xs text-slate-600 mt-1">Grow with DAuth and get rewarded for the volume you bring.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerTiers.map((tier, i) => (
              <div
                key={tier.name}
                className="rounded-3xl p-6 hover:-cyan-400/40 transition-all flex flex-col justify-between neu-flat"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-full -cyan-300">
                      {tier.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{tier.level}</span>
                  </div>

                  <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{tier.name}</h4>

                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-600 flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-cyan-600 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/auth')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  Apply for {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
