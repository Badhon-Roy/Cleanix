import type { Metadata } from "next";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsOverview from "@/components/projects/ProjectsOverview";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import { fetchProjectsCMSServer } from "@/services/cmsServerService";
import { fetchProjectsServer } from "@/services/projectServerService";
import { fetchFeaturedReviewsServer } from "@/services/reviewServerService";

export const metadata: Metadata = {
  title: "Completed Projects & Portfolio | Cleanix - Pioneer Cleaning SaaS",
  description:
    "Explore Cleanix's recent cleaning portfolio across Gulshan, Banani, Uttara, and Dhanmondi. See how our verified teams deliver 10K+ successful residential, corporate, move-out, and post-construction deep cleanings.",
  keywords: [
    "Cleanix Projects",
    "Cleaning Portfolio Dhaka",
    "Gulshan House Cleaning Project",
    "Banani Office Cleaning Case Study",
    "Deep Cleaning Portfolio Bangladesh",
  ],
};

export default async function ProjectsPage() {
  const projectsData = await fetchProjectsCMSServer();
  const projectsList = await fetchProjectsServer();
  const reviewsList = await fetchFeaturedReviewsServer();

  return (
    <>
      <ProjectsHero initialData={projectsData} />
      <ProjectsOverview initialData={projectsData} />
      <ProjectsGrid initialProjects={projectsList} />
      <TestimonialsSection initialReviews={reviewsList} />
      <FaqSection />
    </>
  );
}
