import { motion } from 'framer-motion';
import { Check, Sparkles, AlertCircle, ArrowRight, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Community",
      price: "Free",
      period: "",
      desc: "For developers, prototypes and small applications.",
      popular: false,
      cta: "Start Free",
      features: [
        "1 Project",
        "2,100 successful auth requests / mo",
        "All authentication providers",
        "Up to 2 custom signup fields",
        "Email OTP included",
        "Pay-as-you-go Mobile OTP",
        "No custom branding",
      ],
    },
    {
      name: "Growth",
      price: "₹499",
      period: "/ month",
      desc: "For startups and growing applications.",
      popular: false,
      cta: "Start Growth",
      features: [
        "Up to 2 Projects",
        "13,500 successful auth requests / mo",
        "All authentication providers",
        "UI theme customization",
        "Custom brand name & logo",
        "Up to 6 custom signup fields",
        "Location-Based Access Control",
        "Email OTP included",
        "Pay-as-you-go Mobile OTP",
      ],
    },
    {
      name: "Scale",
      price: "₹999",
      period: "/ month",
      desc: "For production applications and growing businesses.",
      popular: true,
      badge: "MOST POPULAR",
      cta: "Start Scaling",
      features: [
        "Up to 3 Projects",
        "40,500 successful auth requests / mo",
        "All authentication providers",
        "UI theme customization",
        "Custom brand name & logo",
        "Up to 12 custom signup fields",
        "Location-Based Access Control",
        "Email OTP included",
        "Pay-as-you-go Mobile OTP",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For organizations with advanced requirements.",
      popular: false,
      cta: "Contact Sales",
      features: [
        "Custom project limits",
        "Custom authentication limits",
        "Advanced security policies",
        "Unlimited custom signup fields",
        "Advanced access controls",
        "Custom integrations & SLA",
        "Dedicated onboarding & support",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 -cyan-200 text-cyan-800 text-xs font-semibold"
          >
            <Sparkles size={14} /> Transparent Pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            Simple authentication pricing.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-600 leading-relaxed"
          >
            Pay for successful authentication. Not failed attempts.
          </motion.p>
        </div>

        {/* Definition Highlight Box */}
        <div className="max-w-3xl mx-auto bg-[#f8fafc] -cyan-300 rounded-2xl p-6 mb-16 neu-flat text-center">
          <span className="text-xs font-mono text-cyan-800 uppercase font-bold tracking-widest block mb-2">
            FAIR PRICING DEFINITION
          </span>
          <p className="text-base font-extrabold text-slate-900">
            1 Authentication Request = 1 successfully completed authentication through DAuth.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 text-xs text-left">
            <div className="flex items-start gap-2">
              <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-red-700 font-bold block mb-0.5">We Do NOT Count:</span>
                <span className="text-slate-600 font-normal">Login page views, generated URLs, failed passwords, invalid/expired OTPs, cancelled attempts.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-blue-700 font-bold block mb-0.5">We ONLY Count:</span>
                <span className="text-slate-600 font-normal">Successfully completed Google, GitHub, Password, Email OTP, Mobile OTP, or Passkey logins.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-3xl p-6 flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? 'bg-white border-2 border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-105 z-10'
                  : 'bg-[#f8fafc] border border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-600 text-white text-xs font-extrabold rounded-full neu-flat flex items-center gap-1.5 shadow-md shadow-cyan-500/30">
                  <img src="/dauth_logo.png" alt="DAuth" className="w-3.5 h-3.5 object-contain brightness-0 invert" />
                  <span className="text-white font-extrabold">{plan.badge}</span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-600 mb-6 min-h-[36px] font-normal">{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-mono">{plan.period}</span>
                </div>

                <button
                  onClick={() => navigate('/auth')}
                  className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs transition-all mb-6 ${
                    plan.popular
                      ? 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check size={14} className="text-cyan-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.period && (
                <div className="text-[10px] text-slate-500 font-mono text-center mt-6 pt-4">
                  Payment gateway charges may apply.
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* MOBILE OTP BILLING CARD */}
        <div className="bg-[#f8fafc] rounded-3xl p-8 max-w-4xl mx-auto neu-flat">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-800 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <AlertCircle size={14} /> Mobile OTP Usage Billing
              </div>
              <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
                Email OTP is free. Mobile OTP is usage-based.
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl font-normal">
                Email OTP is included with every DAuth plan. Mobile OTP is billed separately based on actual successful SMS deliveries.
              </p>
            </div>

            <div className="p-4 rounded-2xl text-center min-w-[200px] neu-flat">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">INDIA SMS RATE</span>
              <span className="text-2xl font-black text-cyan-700 tracking-tight">₹0.40</span>
              <span className="text-[10px] text-slate-500 block font-mono">per successful OTP delivery</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
