import { useEffect, useRef } from "react";
import { IceBlueButton } from "../Components/Buttons";
import fingerprint from "../assets/lotties/Fingerprint Scanning-2.json";
import Lottie from "lottie-react";

export const Hero = () => {
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2);
      lottieRef.current.play();
    }
  }, []);

  return (
    <div className="relative h-[500px] flex flex-col justify-center items-center rounded-2xl mx-3 mt-30 max-sm:mt-10 max-lg:mt-15 border-l border-r border-cyan-300 overflow-hidden">

      <div className="w-[900px] text-center z-[90] max-sm:w-80">
        <h1 className="text-[70px] max-sm:text-4xl max-lg:text-5xl mb-2 bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300 bg-clip-text text-transparent font-bold">
          Authentication API for Developers
        </h1>

        <h2 className="text-[80px] max-sm:text-2xl max-lg:text-3xl mb-2 bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300 bg-clip-text text-transparent font-bold">
          Secure Login & User Authentication System
        </h2>

        <p className="text-cyan-100 font-semibold max-sm:text-[12px] max-lg:text-[15px] max-lg:px-40">
          Authentication API with OTP, OAuth & JWT Authentication
        </p>
      </div>

      <div className="flex w-[600px] justify-evenly mt-10 z-[90]">
        <IceBlueButton
          btnName={"Grab API Key"}
          btnClassName="text-[15px] font-semibold"
          btnDivClassName="max-sm:hidden"
        />

        <IceBlueButton
          btnName={"View API Documentation"}
          btnClassName="text-[15px] font-semibold"
          onclickFunc={() => window.open("/auth-docs", "_blank")}
        />
      </div>

      <Lottie
        lottieRef={lottieRef}
        animationData={fingerprint}
        className="absolute top-1/2 left-1/2 w-[2000px] h-[1300px] max-sm:w-[900px] z-0 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};