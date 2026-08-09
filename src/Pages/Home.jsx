import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { NavBar } from '../Sections/NavBar'
import { Hero } from '../Sections/Hero'
import { FeaturesPage } from './Features'
import { AuthFLowPage } from './AuthFLow'
import { PricingPage } from './Pricing'
import { KnowusPage } from './Knowus'

export const HomePage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Slow moving background
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-800 overflow-hidden">
      {/* Ambient Radial Background Glow (Mild Cyan Background Only) */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0 opacity-100 w-full"
          style={{ 
            y: yBg,
            backgroundImage: 'radial-gradient(circle at 20% 15%, rgba(0, 210, 229, 0.08) 0%, transparent 55%), radial-gradient(circle at 85% 55%, rgba(14, 165, 233, 0.06) 0%, transparent 55%), radial-gradient(circle at 40% 85%, rgba(16, 185, 129, 0.04) 0%, transparent 55%)',
            backgroundSize: '100% 100%, 100% 100%, 100% 100%',
            height: '150%' 
          }}
        >
          {/* Subtle Light Grid Overlay */}
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(rgba(0, 210, 229, 0.2) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        </motion.div>
      </div>

      <div className='relative z-10 mx-12 max-sm:mx-3 pb-8'>
        <NavBar /> 
        <Hero scrollYProgress={scrollYProgress} /> 
        <FeaturesPage />
        <AuthFLowPage />
        <PricingPage />
        <KnowusPage />

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-slate-200/80 flex justify-center items-center">
          <p className="text-slate-500 font-medium text-sm text-center">
            A product from <a href="https://debuggerstechnologies.com" target="_blank" rel="noreferrer" className="text-slate-800 font-bold hover:underline hover:text-indigo-600">debuggerstechnologies</a> | debuggerstechnologies.com
          </p>
        </div>
      </div>
    </div>
  )
}
