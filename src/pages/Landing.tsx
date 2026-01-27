import { useState } from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProofBar } from '@/components/landing/SocialProofBar';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { DemoSection } from '@/components/landing/DemoSection';
import { LeadCaptureSection } from '@/components/landing/LeadCaptureSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function Landing() {
  const scrollToLeadCapture = () => {
    document.getElementById('contato')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <LandingHeader />
      <main>
        <HeroSection onOpenLeadCapture={scrollToLeadCapture} />
        <SocialProofBar />
        <BenefitsSection />
        <DemoSection />
        <LeadCaptureSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
