import type { Metadata } from "next";
import ServicesBanner from "@/components/services/ServicesBanner";
import ServicesOverview from "@/components/services/ServicesOverview";
import CoreServicesSection from "@/components/services/CoreServicesSection";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";

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

export default function ServicesPage() {
  return (
    <>
      <ServicesBanner />
      <ServicesOverview />
      <CoreServicesSection />
      <HowItWorks />
      <PricingSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
