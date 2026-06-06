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
    <div ref={containerRef} className="relative min-h-screen bg-blue-50">
      {/* Parallax Background - Light Theme */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0 opacity-80 w-full"
          style={{ 
            y: yBg,
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 60%), radial-gradient(circle at 80% 60%, rgba(99, 102, 241, 0.1) 0%, transparent 60%)',
            backgroundSize: '100% 100%, 100% 100%',
            height: '150%' 
          }}
        >
          {/* Floating grid - Light Theme */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </motion.div>
      </div>

      <div className='relative z-10 mx-12 max-sm:mx-3 pb-8'>
        <NavBar></NavBar> 
        <Hero scrollYProgress={scrollYProgress}></Hero> 
        <FeaturesPage></FeaturesPage>
        <AuthFLowPage></AuthFLowPage>
        <PricingPage></PricingPage>
        <KnowusPage></KnowusPage>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-200/60 flex justify-center items-center">
          <p className="text-slate-500 font-medium text-sm text-center">
            A product from <a href="https://debuggers.co.in" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">debuggers</a> | debuggers.co.in
          </p>
        </div>
      </div>
    </div>
  )
}
