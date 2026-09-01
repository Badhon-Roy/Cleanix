import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import CompanyOverview from "@/components/about/CompanyOverview";
import AboutSection from "@/components/AboutSection";
import TeamSpecialists from "@/components/about/TeamSpecialists";
import OurJourneyStepper from "@/components/about/OurJourneyStepper";
import TestimonialsSection from "@/components/TestimonialsSection";
import TrustedClients from "@/components/TrustedClients";
import { fetchAboutCMSServer } from "@/services/cmsServerService";
import { fetchFeaturedReviewsServer } from "@/services/reviewServerService";

export const metadata: Metadata = {
  title: "About Us | Cleanix - Pioneer SaaS Cleaning Automation in Bangladesh",
  description:
    "Learn about Cleanix, Bangladesh's leading SaaS-enabled B2B & B2C cleaning service automation platform. Discover our story, mission, verified team, GPS live tracking, and hygiene standards.",
  keywords: [
    "Cleanix About Us",
    "Cleaning Service Bangladesh",
    "SaaS Field Service",
    "Home Cleaning Dhaka",
    "Corporate Cleaning Service Gulshan",
    "Deep Cleaning Dhaka",
  ],
};

export default async function AboutPage() {
  const aboutData = await fetchAboutCMSServer();
  const reviewsList = await fetchFeaturedReviewsServer();

  return (
    <>
      <AboutHero initialData={aboutData} />
      <CompanyOverview initialData={aboutData} />
      <AboutSection initialData={aboutData} />
      <TrustedClients />
      <TeamSpecialists initialData={aboutData} />
      <OurJourneyStepper initialData={aboutData} />
      <TestimonialsSection initialReviews={reviewsList} />
    </>
  );
}
