import { useRef } from 'react'
import Lottie from 'lottie-react'
import WorkFlowLottie from '../assets/lotties/Artboard 1.json'
import { authFLowSteps } from '../Constants/index'
import { motion, useScroll, useTransform } from 'framer-motion'

export const AuthFLowPage = () => {
  const containerRef = useRef(null);

  return (
    <div id="auth-flow" ref={containerRef} className="relative z-10 px-4 mt-32 max-sm:mt-20 max-lg:mt-24">
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full flex justify-center items-center flex-col text-center"
        >
          <h1 className="text-4xl max-sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            How It Works
          </h1>
          <p className="mt-4 text-slate-500 max-w-2xl text-lg">
            A seamless, highly secure authentication flow designed to be implemented in minutes.
          </p>
        </motion.div>
        {/* End Title */}

        {/* Sticky Scroll Container */}
        <div className="w-full relative mt-20 flex flex-row max-lg:flex-col items-start gap-12 lg:gap-20">
          
          {/* Left Side: Sticky Lottie */}
          <div className="w-1/2 max-lg:w-full sticky top-32 h-[70vh] max-lg:h-auto max-lg:relative max-lg:top-0 flex justify-center items-center max-lg:mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full h-full relative flex justify-center items-center"
            >
              <div className="absolute inset-0 bg-indigo-200/20 blur-[80px] rounded-full z-0"></div>
              <Lottie animationData={WorkFlowLottie} className="relative z-10 w-[120%] max-w-[600px] max-lg:w-full max-lg:max-w-md mix-blend-multiply drop-shadow-2xl" />
            </motion.div>
          </div>
          
          {/* Right Side: Timeline Steps */}
          <div className="w-1/2 max-lg:w-full relative flex flex-col py-10 z-20">
            {/* Continuous vertical timeline line - Exactly centered under the 56px (w-14) icons -> left: 28px */}
            <div className="absolute left-[27px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-indigo-200 via-indigo-300 to-indigo-100 max-lg:hidden z-0 rounded-full"></div>

            <div className="flex flex-col gap-16">
              {authFLowSteps.map((step, index) => (
                <StepCard key={index} step={step} index={index} total={authFLowSteps.length} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const StepCard = ({ step, index, total }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full relative flex flex-row max-lg:flex-col items-start gap-8 max-lg:gap-4 group"
    >
      {/* Icon/Number */}
      <div className="relative z-10 flex shrink-0 justify-center items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-2xl shadow-lg shadow-indigo-400/50 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
        {index + 1}
      </div>
      
      {/* Card Content */}
      <div className="flex-1 bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
        {/* Decorative background number */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-50/50 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <span className="text-8xl font-black text-indigo-100/50">{index + 1}</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-slate-800 font-extrabold text-2xl max-sm:text-xl tracking-tight mb-4 group-hover:text-indigo-600 transition-colors duration-300">
            {step.title}
          </h1>
          <h4 className="text-slate-500 whitespace-pre-line leading-relaxed text-base">
            {step.subTitle}
          </h4>
        </div>
      </div>
    </motion.div>
  )
}
