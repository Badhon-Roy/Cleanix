import HeroBanner from "@/components/HeroBanner";
import OurServices from "@/components/OurServices";
import HowItWorks from "@/components/HowItWorks";
import TrustedClients from "@/components/TrustedClients";
import AboutSection from "@/components/AboutSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import BlogSection from "@/components/BlogSection";
import ImpactSection from "@/components/ImpactSection";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <AboutSection />
      <TrustedClients />
      <ImpactSection />
      <WhyChooseUs />
      <OurServices />
      <ProjectsSection />
      <PricingSection />
      <HowItWorks />
      <TestimonialsSection />
      <FaqSection />
      <BlogSection />
      <CtaBanner />
    </>
  );
}
