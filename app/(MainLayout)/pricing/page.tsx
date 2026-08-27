import type { Metadata } from "next";
import PricingHero from "@/components/pricing/PricingHero";
import PricingSection from "@/components/PricingSection";
import EstimateCalculator from "@/components/EstimateCalculator";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";
import { fetchPricingCMSServer } from "@/services/cmsServerService";

export const metadata: Metadata = {
  title: "Pricing Plans & Instant Estimate Calculator | Cleanix Bangladesh",
  description:
    "Explore transparent B2C and B2B subscription pricing packages (৳6,000, ৳14,000, ৳30,000) or calculate custom instant estimates for home and office cleaning in Dhaka.",
  keywords: [
    "Cleanix Pricing",
    "Cleaning Service Cost Dhaka",
    "House Deep Cleaning Package Price",
    "Office Cleaning Subscription Bangladesh",
    "Instant Estimate Calculator",
  ],
};

export default async function PricingPage() {
  const pricingData = await fetchPricingCMSServer();

  return (
    <>
      <PricingHero initialData={pricingData} />
      <PricingSection initialData={pricingData} />
      <EstimateCalculator />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
