import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProofBar } from '@/components/landing/SocialProofBar';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { DemoSection } from '@/components/landing/DemoSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#04030C] text-white scroll-smooth overflow-x-hidden">
      <LandingHeader />
      <main>
        <HeroSection />
        <SocialProofBar />
        <BenefitsSection />
        <DemoSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
