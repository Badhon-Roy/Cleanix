import Navbar from "@/components/Navbar";
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
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#001837] text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />
      <HeroBanner />
      <OurServices />
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
      <Footer />
    </main>
  );
}
