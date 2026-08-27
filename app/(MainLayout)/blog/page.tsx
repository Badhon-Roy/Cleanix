import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";
import { fetchBlogsServer } from "@/services/blogServerService";
import { fetchBlogCMSServer } from "@/services/cmsServerService";

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

export default async function BlogPage() {
  const blogsList = await fetchBlogsServer();
  const blogCMSData = await fetchBlogCMSServer();

  return (
    <>
      <BlogHero initialData={blogCMSData} />
      <BlogGrid initialBlogs={blogsList} />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
