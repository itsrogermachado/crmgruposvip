import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProofBar } from '@/components/landing/SocialProofBar';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { DemoSection } from '@/components/landing/DemoSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { LeadCaptureSection } from '@/components/landing/LeadCaptureSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { FloatingWhatsApp } from '@/components/landing/FloatingWhatsApp';
import { useTheme } from '@/hooks/useTheme';

export default function Landing() {
  useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth overflow-x-hidden">
      <LandingHeader />
      <main>
        <HeroSection />
        <SocialProofBar />
        <BenefitsSection />
        <HowItWorksSection />
        <DemoSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <LeadCaptureSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
      <FloatingWhatsApp />
    </div>
  );
}
