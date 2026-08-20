import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Cleaning Blog & Expert Insights | Cleanix Bangladesh",
  description:
    "Read the latest cleaning tips, office hygiene strategies, move-out turnover checklists, and post-construction cleaning guides from the Cleanix Editorial Team.",
  keywords: [
    "Cleanix Blog",
    "Cleaning Tips Dhaka",
    "Office Cleaning Hacks",
    "House Deep Clean Checklist",
    "Eco Friendly Cleaning Bangladesh",
  ],
};

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogGrid />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
