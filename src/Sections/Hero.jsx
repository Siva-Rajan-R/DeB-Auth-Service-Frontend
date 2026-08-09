import { useEffect, useRef } from 'react'
import { IceBlueButton } from '../Components/Buttons'
import fingertprint from "../assets/lotties/Fingerprint Scanning-2.json"
import Lottie from 'lottie-react'
import { motion, useTransform } from 'framer-motion'

export const Hero = ({ scrollYProgress }) => {
    const lottieRef = useRef();

    useEffect(() => {
        lottieRef.current?.play();
        lottieRef.current?.setSpeed(2);
    }, []);

    // Parallax transforms based on global scroll progress
    // Move text up faster, fade out as you scroll down
    const yText = useTransform(scrollYProgress, [0, 0.2], ["0%", "-100%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    // Move fingerprint slower
    const yLottie = useTransform(scrollYProgress, [0, 0.5], ["0%", "30%"]);
    const scaleLottie = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  
  return (
    <div className="relative h-100 flex flex-col justify-center items-center rounded-3xl mx-3 mt-20 max-sm:mt-8 max-lg:mt-12 border border-slate-200/80 bg-white/60 backdrop-blur-xl overflow-hidden shadow-xl shadow-slate-200/50">

        <motion.div style={{ y: yText, opacity: opacityText }} className='w-full max-w-4xl text-center z-[90] px-4 relative'>
            <h1 className='text-[64px] max-sm:text-3xl max-lg:text-4xl max-sm:mb-2 max-lg:mb-2 text-slate-900 font-black tracking-tight leading-none drop-shadow-sm'>
                Lock, Load, <span className="text-indigo-600">Login</span>
            </h1>
            <h1 className='text-[72px] max-sm:text-2xl max-lg:text-3xl max-sm:mb-2 max-lg:mb-2 font-black text-slate-800 tracking-tight leading-none mt-2'>
                Auth That Plays Hard
            </h1>
            <p className='text-slate-600 font-normal mt-6 text-[15px] max-sm:text-[13px] max-lg:text-[14px] leading-relaxed max-w-2xl mx-auto'>
                Drop your API Key <span className="text-slate-400 font-bold">→</span> grab a one-time login URL <span className="text-slate-400 font-bold">→</span> users sign in their way (OTP or social) <span className="text-slate-400 font-bold">→</span> code hits your redirect <span className="text-slate-400 font-bold">→</span> swap it with your client secret <span className="text-slate-400 font-bold">→</span> JWT drops with full user profile info. <span className="text-slate-900 font-semibold">No fluff. No weak flows. Just fast, clean, savage authentication.</span>
            </p>
        </motion.div>

        <motion.div style={{ y: yText, opacity: opacityText }} className='flex justify-center items-center gap-5 mt-8 z-[90]'>
            <IceBlueButton btnName={"Grab API Key"} btnClassName={'text-sm font-bold'} btnDivClassName={"max-sm:hidden shadow-lg shadow-cyan-300/40"}></IceBlueButton>
            <IceBlueButton btnName={"Get Started"} btnClassName={'text-sm font-bold'} onclickFunc={()=>{window.open('/auth-docs','_blank')}} btnDivClassName={"shadow-lg shadow-cyan-300/40"}></IceBlueButton>
        </motion.div>
        
        <motion.div 
            style={{ y: yLottie, scale: scaleLottie }}
            className="absolute top-1/2 left-1/2 w-[2000px] h-[1300px] max-sm:w-[900px] -z-10 -translate-x-1/2 -translate-y-1/2 opacity-15 mix-blend-multiply pointer-events-none"
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={fingertprint}
                speed={10}
                className="w-full h-full"
            />
        </motion.div>

    </div>
  )
}
