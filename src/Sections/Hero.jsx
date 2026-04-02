import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import fingerprint from "../assets/lotties/Fingerprint Scanning-2.json";

const PrimaryButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        relative px-8 py-3 rounded-xl font-semibold text-white
        bg-gradient-to-r from-cyan-400 to-blue-500
        shadow-[0_0_25px_rgba(34,211,238,0.4)]
        transition-all duration-300
        hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.7)]
        active:scale-95
      "
    >
      {text}
    </button>
  );
};

const SecondaryButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        px-8 py-3 rounded-xl font-semibold text-cyan-200
        border border-cyan-400
        backdrop-blur-md
        transition-all duration-300
        hover:bg-cyan-400/10 hover:text-white hover:border-cyan-300
      "
    >
      {text}
    </button>
  );
};

export const Hero = () => {
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(1.5);
      lottieRef.current.play();
    }
  }, []);

  return (
    <div className="relative h-[520px] flex flex-col justify-center items-center rounded-2xl mx-3 mt-20 max-sm:mt-10 border border-cyan-300/20 overflow-hidden bg-black">

      {/* Content */}
      <div className="max-w-4xl text-center z-[90] px-4">
        
        <h1 className="text-5xl max-sm:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-100 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">
          Authentication API for Developers
        </h1>

        <h2 className="text-3xl max-sm:text-xl font-semibold mb-4 text-cyan-200">
          Secure Login with OTP, OAuth & JWT
        </h2>

        <p className="text-cyan-100/70 text-sm max-w-xl mx-auto">
          Build secure, scalable authentication in minutes. Stop wasting time reinventing login systems.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-6 mt-8 z-[90] items-center justify-center">
        <PrimaryButton text="Get API Key" />
        
        <SecondaryButton
          text="View Docs"
          onClick={() => window.open("/auth-docs", "_blank")}
        />
      </div>

      {/* Background Animation */}
      <Lottie
        lottieRef={lottieRef}
        animationData={fingerprint}
        className="absolute top-1/2 left-1/2 w-[1400px] h-[900px] opacity-30 max-sm:w-[800px] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};