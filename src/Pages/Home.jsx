import { LandingNavbar } from '../Sections/Landing/LandingNavbar';
import { LandingHero } from '../Sections/Landing/LandingHero';
import { FeaturesPage } from './Features';
import { AuthFLowPage } from './AuthFLow';
import { PricingSection } from '../Sections/Landing/PricingSection';
import { ComparisonTableSection } from '../Sections/Landing/ComparisonTableSection';
import { UseCasesSection } from '../Sections/Landing/UseCasesSection';
import { FinalCtaSection } from '../Sections/Landing/FinalCtaSection';
import { LandingFooter } from '../Sections/Landing/LandingFooter';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-800 overflow-clip font-sans">
      <LandingNavbar />
      <main>
        {/* 1. Hero / Entry Point */}
        <LandingHero />
        
        {/* 2. Problem & Solution (Lottie Feature Cards from Screenshot 3) */}
        <FeaturesPage />
        
        {/* 3. How It Works (Sticky Lottie Timeline Flow from Screenshot 1) */}
        <AuthFLowPage />
        
        {/* 4. Pricing & DAuth vs Traditional Auth Comparison */}
        <PricingSection />
        <ComparisonTableSection />
        
        {/* 5. Use Cases / Applications for Every Kind of App */}
        <UseCasesSection />
        
        {/* Final CTA */}
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};




