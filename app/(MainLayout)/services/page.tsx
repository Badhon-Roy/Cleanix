import type { Metadata } from "next";
import ServicesBanner from "@/components/services/ServicesBanner";
import ServicesOverview from "@/components/services/ServicesOverview";
import CoreServicesSection from "@/components/services/CoreServicesSection";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import DhakaCoverageSection from "@/components/DhakaCoverageSection";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import CtaBanner from "@/components/CtaBanner";
import { fetchServicesCMSServer } from "@/services/cmsServerService";
import { fetchActiveServicesServer } from "@/services/serviceCategoryServerService";

export const metadata: Metadata = {
  title: "Our Services | Cleanix - Professional Home & Office Cleaning Solutions",
  description:
    "Explore Cleanix's full range of professional cleaning services in Bangladesh: Residential Deep Cleaning, Commercial Office Sanitization, Move-in/Move-out Cleaning, and Post-Construction Care.",
  keywords: [
    "Cleanix Services",
    "Home Cleaning Services Dhaka",
    "Office Cleaning Service Gulshan",
    "Deep Cleaning Solutions",
    "Sanitization & Disinfection Bangladesh",
  ],
};

export default async function ServicesPage() {
  const [servicesData, activeServices] = await Promise.all([
    fetchServicesCMSServer(),
    fetchActiveServicesServer(),
  ]);

  return (
    <>
      <ServicesBanner initialData={servicesData} />
      <ServicesOverview initialData={servicesData} />
      <CoreServicesSection initialData={servicesData} initialServices={activeServices} />
      <BeforeAfterSection />
      <DhakaCoverageSection />
      <HowItWorks initialData={servicesData} />
      <PricingSection />
      <CtaBanner />
    </>
  );
}
