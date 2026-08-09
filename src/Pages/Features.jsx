import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FeaturesCard } from '../Components/FeaturesCard'
import OTL from '../assets/lotties/Login and Sign up.json'
import Lottie from 'lottie-react'
import { featuresCardDatas } from '../Constants/index'

export const FeaturesPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <div ref={containerRef} className="mx-3 max-sm:mx-0 mt-32 max-sm:mt-16 max-lg:mt-24 w-full relative z-10" id="features">
      {/* Feature title */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full flex justify-center items-center flex-col text-center mb-12"
      >
        <h1 className="text-4xl max-sm:text-2xl font-black text-slate-900 tracking-tight">
          Everything You Need. <span className="text-indigo-600">Nothing You Don't.</span>
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl text-base leading-relaxed font-normal">
          We stripped out the complexity of traditional auth providers to give you a fast, secure, and developer-friendly experience.
        </p>
      </motion.div>

      {/* Feature container */}
      <div className="flex w-full justify-center items-center mt-8 max-sm:mt-2 max-lg:mt-5 px-4">
        <div className="flex max-lg:items-center flex-row max-sm:flex-col max-lg:flex-col mt-8 w-fit max-lg:w-full h-100 max-sm:h-full max-lg:h-full rounded-2xl relative">

          {/* Vertical feature card - Parallax */}
          <motion.div 
            style={{ y: y1 }}
            className="shadow-xl bg-white/90 backdrop-blur-xl w-90 h-90 ml-10 max-lg:ml-0 mt-5 rounded-3xl p-6 max-sm:ml-0 max-sm:w-full max-sm:h-80 z-20 border border-slate-200/80 shadow-slate-200/50"
          >
            <div className="h-36 flex justify-center items-center w-full">
              <Lottie animationData={OTL} className='max-sm:w-52 max-lg:w-52 mix-blend-multiply' />
            </div>
            <div className="w-60 h-40 flex flex-col justify-center">
              <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">
                One-Time Login URL
              </h1>
              <p className="text-slate-600 mt-2 text-xs leading-relaxed font-normal">
                After receiving the API key, a unique login link is generated — valid only once to ensure maximum security. No replay attacks.
              </p>
            </div>
          </motion.div>

          {/* Horizontal feature cards - Staggered Parallax */}
          <div className="w-full h-full grid grid-cols-2 max-sm:grid-cols-1 max-lg:grid-cols-2 ml-15 max-sm:ml-0 max-lg:ml-0 max-sm:gap-y-5 mt-5 max-sm:mt-8 z-10 gap-6">
            {featuresCardDatas.map((data, index) => (
              <motion.div 
                key={index}
                style={{ y: index % 2 === 0 ? y2 : y1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 hover:border-cyan-400/40 transition-all shadow-md p-2"
              >
                <FeaturesCard
                  title={data.title}
                  description={data.desc}
                  imageUrl={data.imageUrl}
                  lottieUrl={data.lottieUrl}
                />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
