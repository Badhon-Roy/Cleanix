import type { Metadata } from "next";
import CoverageHero from "@/components/coverage/CoverageHero";
import DhakaCoverageSection from "@/components/DhakaCoverageSection";
import { fetchCoverageCMSServer } from "@/services/cmsServerService";

export const metadata: Metadata = {
  title: "Coverage Area | Cleanix Dhaka Service Locations",
  description:
    "Explore Cleanix 24/7 service coverage areas across Dhaka: Gulshan, Banani, Uttara, Dhanmondi, Bashundhara R/A, Mohammadpur, Badda, Motijheel, Mirpur, and Mohakhali.",
  keywords: [
    "Cleanix Coverage Area",
    "Cleaning Service Gulshan",
    "Home Cleaning Service Uttara",
    "Office Cleaning Dhanmondi",
    "Deep Cleaning Dhaka Locations",
  ],
};

export default async function CoveragePage() {
  const coverageData = await fetchCoverageCMSServer();

  return (
    <>
      <CoverageHero initialData={coverageData} />
      <DhakaCoverageSection initialData={coverageData} />
    </>
  );
}
