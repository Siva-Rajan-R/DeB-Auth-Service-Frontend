import Lottie from "lottie-react";
import fingerprint from "../assets/lotties/Fingerprint Scanning-2.json";

// 🔵 Buttons
const PrimaryButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold text-white 
      bg-gradient-to-r from-cyan-400 to-blue-500
      shadow-lg shadow-cyan-500/30
      transition-all duration-300
      hover:scale-105 hover:shadow-cyan-400/60 active:scale-95"
    >
      {text}
    </button>
  );
};

const SecondaryButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold text-cyan-200 
      border border-cyan-400
      transition-all duration-300
      hover:bg-cyan-400/10 hover:text-white"
    >
      {text}
    </button>
  );
};

// 🔵 Navbar
const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 md:px-16 py-4 border-b border-cyan-400/20 backdrop-blur-md">

      {/* Logo */}
      <h1 className="text-xl font-bold text-cyan-300">
        Authify
      </h1>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8 text-cyan-200 font-medium">
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

// 🔵 Main Page
export const HeroPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 mt-20">

        {/* Content */}
        <div className="max-w-4xl z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Authentication API for Developers
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-cyan-100">
            Secure Login with OTP, OAuth & JWT
          </h2>

          <p className="text-cyan-300 mb-8 max-w-2xl mx-auto">
            Build secure, scalable authentication in minutes. No complexity.
            Just plug, play, and protect your users.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PrimaryButton text="Get API Key" />
            
            <SecondaryButton
              text="View Documentation"
              onClick={() => window.open("/auth-docs", "_blank")}
            />
          </div>
        </div>

        {/* Lottie Animation */}
        <Lottie
          animationData={fingerprint}
          loop={true}
          autoplay={true}
          className="absolute top-1/2 left-1/2 w-[1000px] max-sm:w-[600px] opacity-20 
          -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
};