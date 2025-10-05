import { useEffect, useRef } from 'react'
import { IceBlueButton } from '../Components/Buttons'
import fingertprint from "../assets/lotties/Fingerprint Scanning-2.json"
import Lottie from 'lottie-react'

export const Hero = () => {
    const lottieRef = useRef();

    useEffect(() => {
        // Play the animation
        lottieRef.current?.play();

        // Set speed to 2x
        lottieRef.current?.setSpeed(2);
    }, []);
  
  return (
    <div className="relative h-100 flex flex-col justify-center items-center rounded-2xl mx-3 mt-30 border-l-1 border-r-1 border-cyan-300 overflow-hidden">

        
        <div className='w-240 text-center z-[90]'>
            <h1 className='text-[70px] bg-linear-to-r from-cyan-100 via-cyan-200 to-cyan-300 bg-clip-text text-transparent font-bold'>
                Lock, Load, Login
            </h1>
            <h1 className='text-[80px] bg-linear-to-r from-cyan-100 via-cyan-200 to-cyan-300 bg-clip-text text-transparent font-bold'>
                Auth That Plays Hard
            </h1>
            <h1 className='text-cyan-100 font-semibold'>
                “Drop your API Key → grab a one-time login URL → users sign in their way (OTP or social) → code hits your redirect → swap it with your client secret → JWT drops with full user profile info. No fluff. No weak flows. Just fast, clean, savage authentication — made for devs who play hard and ship faster”
            </h1>
        </div>

        <div className='flex w-150 justify-evenly mt-10 z-[90]'>
            <IceBlueButton btnName={"Grab API Key"} btnClassName={'text-[15px] font-semibold'}></IceBlueButton>
            <IceBlueButton btnName={"Get Started"} btnClassName={'text-[15px] font-semibold'} onclickFunc={()=>{window.open('/auth-docs','_blank')}}></IceBlueButton>
        </div>
        
        <Lottie
            lottieRef={lottieRef}
            animationData={fingertprint}
            speed={10}
            className="absolute top-1/2 left-1/2 w-[2000px] h-[1300px] z-0 -translate-x-1/2 -translate-y-1/2"
        />

    </div>
  )
}
