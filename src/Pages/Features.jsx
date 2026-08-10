import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FeaturesCard } from '../Components/FeaturesCard';
import OTL from '../assets/lotties/Login and Sign up.json';
import Lottie from 'lottie-react';
import { featuresCardDatas } from '../Constants/index';

export const FeaturesPage = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const yParallaxLeft = useTransform(smoothProgress, [0, 1], [30, -30]);
  const yParallaxRight = useTransform(smoothProgress, [0, 1], [50, -20]);

  return (
    <section ref={containerRef} className="py-20 px-6 max-w-7xl mx-auto relative z-10" id="features">
      {/* Feature Title */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full flex justify-center items-center flex-col text-center mb-16"
      >
        <h2 className="text-4xl max-sm:text-3xl font-black text-slate-900 tracking-tight">
          Everything You Need. <span className="text-cyan-600">Nothing You Don't.</span>
        </h2>
        <p className="mt-4 text-slate-600 max-w-2xl text-base leading-relaxed font-medium">
          We stripped out the complexity of traditional auth providers to give you a fast, secure, and developer-friendly experience.
        </p>
      </motion.div>

      {/* Feature Cards Grid Container with Parallax Effect */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* Vertical Left Card: One-Time Login URL with Parallax */}
        <motion.div 
          style={{ y: yParallaxLeft }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4 bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-cyan-400/40 transition-all flex flex-col justify-between"
        >
          <div className="h-52 flex justify-center items-center w-full mb-4">
            <Lottie animationData={OTL} className='w-full max-w-[260px] mix-blend-multiply drop-shadow-md' />
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight mb-3">
              One-Time Login URL
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              After receiving the API key, a unique login link is generated — valid only once to ensure maximum security. No replay attacks.
            </p>
          </div>
        </motion.div>

        {/* 4 Right Side Cards with Parallax */}
        <motion.div style={{ y: yParallaxRight }} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuresCardDatas.map((data, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-cyan-400/40 transition-all flex items-center"
            >
              <FeaturesCard 
                title={data.title}
                description={data.description}
                imageUrl={data.imageUrl}
                lottieUrl={data.lottieUrl}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
