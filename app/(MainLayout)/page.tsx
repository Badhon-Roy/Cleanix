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
import { fetchHomeCMSServer } from "@/services/cmsServerService";
import { fetchBlogsServer } from "@/services/blogServerService";

export default async function Home() {
  const cmsData = await fetchHomeCMSServer();
  const blogsList = await fetchBlogsServer();

  return (
    <>
      <HeroBanner initialData={cmsData} />
      <AboutSection />
      <TrustedClients />
      <ImpactSection initialData={cmsData} />
      <WhyChooseUs initialData={cmsData} />
      <OurServices initialData={cmsData} />
      <ProjectsSection />
      <PricingSection />
      <HowItWorks />
      <TestimonialsSection />
      <FaqSection initialData={cmsData} />
      <BlogSection initialBlogs={blogsList} />
      <CtaBanner initialData={cmsData} />
    </>
  );
}
