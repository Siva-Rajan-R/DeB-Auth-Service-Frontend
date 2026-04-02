import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import fingerprint from "../assets/lotties/Fingerprint Scanning-2.json";

// 🔵 Buttons
const PrimaryButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="
      px-6 py-3 rounded-xl font-semibold text-white
      bg-gradient-to-r from-cyan-400 to-blue-500
      shadow-[0_0_20px_rgba(34,211,238,0.4)]
      transition-all duration-300
      hover:scale-105 hover:shadow-[0_0_35px_rgba(34,211,238,0.7)]
      active:scale-95
    "
  >
    {text}
  </button>
);

const SecondaryButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="
      px-6 py-3 rounded-xl font-semibold text-cyan-200
      border border-cyan-400
      backdrop-blur-md
      transition-all duration-300
      hover:bg-cyan-400/10 hover:text-white hover:border-cyan-300
    "
  >
    {text}
  </button>
);

// 🔵 Navbar
const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-10 py-5 border-b border-cyan-400/20 backdrop-blur-md">
      
      {/* Logo */}
      <h1 className="text-xl font-bold text-cyan-300">
        Authify
      </h1>

      {/* Links */}
      <div className="hidden md:flex gap-8 text-cyan-200 font-medium">
        <a href="#" className="hover:text-white transition">Home</a>
        <a href="#" className="hover:text-white transition">Features</a>
        <a href="#" className="hover:text-white transition">Docs</a>
        <a href="#" className="hover:text-white transition">Pricing</a>
      </div>

      {/* CTA */}
      <PrimaryButton text="Get API Key" />
    </nav>
  );
};

// 🔵 Hero Section
export const HeroPage = () => {
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(2);
      lottieRef.current.play();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">

      <Navbar />

      <div className="relative flex flex-col items-center justify-center text-center px-6 mt-20">

        {/* Text Content */}
        <div className="max-w-4xl z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Authentication API for Developers
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-cyan-100">
            Secure Login with OTP, OAuth & JWT
          </h2>

          <p className="text-cyan-300 mb-10 max-w-2xl mx-auto">
            Build secure, scalable authentication in minutes. No complexity.
            Just plug, play, and protect your users.
          </p>

          {/* Buttons */}
          <div className="flex gap-6 justify-center">
            <PrimaryButton text="Get API Key" />
            <SecondaryButton
              text="View Documentation"
              onClick={() => window.open("/auth-docs", "_blank")}
            />
          </div>
        </div>

        {/* Lottie Background */}
        <Lottie
          lottieRef={lottieRef}
          animationData={fingerprint}
          className="absolute top-1/2 left-1/2 w-[1400px] h-[900px] opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
};