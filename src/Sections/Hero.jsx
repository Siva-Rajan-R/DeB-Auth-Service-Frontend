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
    <div className="relative h-100 flex flex-col justify-center items-center rounded-2xl mx-3 mt-30 max-sm:mt-10 max-lg:mt-15 border-l border-r border-indigo-100 overflow-hidden">

        <motion.div style={{ y: yText, opacity: opacityText }} className='w-240 text-center z-[90] max-sm:w-80 relative'>
            <h1 className='text-[70px] max-sm:text-4xl max-lg:text-5xl max-sm:mb-2 max-lg:mb-2 text-slate-800 font-extrabold tracking-tight drop-shadow-sm'>
                Lock, Load, <span className="text-indigo-600">Login</span>
            </h1>
            <h1 className='text-[80px] max-sm:text-2xl max-lg:text-3xl max-sm:mb-2 max-lg:mb-2 text-slate-800 font-extrabold tracking-tight drop-shadow-sm'>
                Auth That Plays Hard
            </h1>
            <h1 className='text-slate-600 font-medium mt-6 text-[14px] max-sm:text-[12px] max-lg:text-[15px] max-sm:px-0 px-20 max-lg:px-40'>
                Drop your API Key → grab a one-time login URL → users sign in their way (OTP or social) → code hits your redirect → swap it with your client secret → JWT drops with full user profile info. No fluff. No weak flows. Just fast, clean, savage authentication.
            </h1>
        </motion.div>

        <motion.div style={{ y: yText, opacity: opacityText }} className='flex w-150 justify-center gap-6 mt-10 z-[90]'>
            <IceBlueButton btnName={"Grab API Key"} btnClassName={'text-[15px] font-semibold'} btnDivClassName={"max-sm:hidden shadow-lg shadow-indigo-200"}></IceBlueButton>
            <IceBlueButton btnName={"Get Started"} btnClassName={'text-[15px] font-semibold'} onclickFunc={()=>{window.open('/auth-docs','_blank')}} btnDivClassName={"shadow-lg shadow-indigo-200"}></IceBlueButton>
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
