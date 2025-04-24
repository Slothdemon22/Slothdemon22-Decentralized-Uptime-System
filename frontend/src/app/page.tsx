import { HeroSection } from '@/components/ui/Hero';
import { FeaturesSection } from '@/components/ui/Features';
import { HowItWorksSection } from '@/components/ui/HowItWorks';
import { ComparisonSection } from '@/components/ComparisonSection';
import { TestimonialsSection } from '@/components/ui/Testimonials';
import { PricingSection } from '@/components/ui/PricingSection';
import { FaqSection } from '@/components/ui/FaqSection';
import { CtaSection } from '@/components/ui/Ctasection';
import { Header } from '@/components/ui/Header';
// import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      {/* <Footer /> */}
    </div>
  );
}