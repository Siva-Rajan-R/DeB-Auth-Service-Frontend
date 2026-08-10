import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal, Key, Mail, Smartphone, MapPin, UserPlus, Database, KeyRound } from 'lucide-react';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import { GoogleIcon, MicrosoftIcon } from '../../Components/ProviderIcons';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import FingerprintLottie from '../../assets/lotties/Fingerprint Scanning-2.json';

export const LandingHero = () => {
  const navigate = useNavigate();

  // Floating ambient provider & feature badges with official 4-color brand icons
  const floatingBubbles = [
    { label: "Google Auth", icon: <GoogleIcon size={18} />, left: "5%", speed: 14, delay: 0 },
    { label: "GitHub OAuth", icon: <FaGithub className="text-[#24292e]" size={18} />, left: "18%", speed: 18, delay: 2 },
    { label: "Microsoft", icon: <MicrosoftIcon size={18} />, left: "32%", speed: 15, delay: 4 },
    { label: "Facebook Auth", icon: <FaFacebook className="text-[#1877F2]" size={18} />, left: "62%", speed: 16, delay: 3 },
    { label: "Passkeys", icon: <Key className="text-purple-600" size={18} />, left: "48%", speed: 19, delay: 1 },
    { label: "Location Access", icon: <MapPin className="text-cyan-600" size={18} />, left: "76%", speed: 17, delay: 5 },
    { label: "Custom Fields", icon: <UserPlus className="text-emerald-600" size={18} />, left: "88%", speed: 13, delay: 0.5 },
    { label: "Email OTP", icon: <Mail className="text-teal-600" size={18} />, left: "12%", speed: 20, delay: 7 },
    { label: "Mobile OTP", icon: <Smartphone className="text-sky-600" size={18} />, left: "42%", speed: 16, delay: 6 },
    { label: "Zero User Lock-in", icon: <Database className="text-cyan-700" size={18} />, left: "70%", speed: 21, delay: 8 },
  ];

  return (
    <section id="hero" className="relative min-h-[88vh] flex items-center justify-center pt-12 pb-24 overflow-hidden bg-[#f8fafc]">
      
      {/* RISING BUBBLE ANIMATION FROM BOTTOM TO TOP WITH OFFICIAL 4-COLOR BRAND ICONS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingBubbles.map((bubble, idx) => (
          <motion.div
            key={idx}
            className="absolute hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 border border-slate-200/90 shadow-xl shadow-slate-200/60 backdrop-blur-md text-xs font-bold text-slate-800"
            style={{ left: bubble.left, bottom: '-60px' }}
            animate={{
              y: ['0px', '-110vh'],
              x: [0, (idx % 2 === 0 ? 25 : -25), (idx % 2 === 0 ? -15 : 15), 0],
              opacity: [0, 0.95, 0.95, 0],
              scale: [0.9, 1, 1, 0.9],
            }}
            transition={{
              duration: bubble.speed,
              repeat: Infinity,
              ease: "linear",
              delay: bubble.delay,
            }}
          >
            <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center">
              {bubble.icon}
            </div>
            <span className="whitespace-nowrap">{bubble.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Clear & Crisp Fingerprint Lottie Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 z-0">
        <Lottie
          animationData={FingerprintLottie}
          loop={true}
          autoplay={true}
          className="w-[750px] h-[750px]"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-8">
        
        {/* Top Pill Badge */}
        <div className="flex justify-center mb-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-cyan-200 text-cyan-800 text-xs font-semibold shadow-sm"
          >
            <img src="/dauth_logo.png" alt="DAuth" className="h-4 w-auto object-contain" />
            <span>Developer-First Authentication Infrastructure</span>
          </motion.div>
        </div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Authentication without <br className="hidden sm:inline" />
            <span className="text-cyan-600 inline-block font-black">
              user lock-in.
            </span>
          </h1>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Your Users. Your Database. Your Authentication.
          </h2>
        </motion.div>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal"
        >
          Connect Google, GitHub, Microsoft, Facebook, email, password, OTP, passkeys and other authentication methods through one secure authentication layer — while keeping your application's user data under your control. <span className="text-cyan-700 font-bold">We don't store your users.</span>
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base text-white bg-cyan-500 hover:bg-cyan-600 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            Start Building — It's Free
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/auth-docs')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Terminal size={18} className="text-cyan-600" />
            Explore Docs
          </button>
        </motion.div>

      </div>
    </section>
  );
};
