import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectsData } from "@/lib/projectsData";
import ProjectDetailsHeader from "@/components/projects/ProjectDetailsHeader";
import ProjectDetailsSidebar from "@/components/projects/ProjectDetailsSidebar";
import ProjectDetailsContent from "@/components/projects/ProjectDetailsContent";
import CtaBanner from "@/components/CtaBanner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    return {
      title: "Project Not Found | Cleanix",
    };
  }

  return {
    title: `${project.title} | Cleanix Case Studies`,
    description: project.introParagraph,
    keywords: [project.title, "Cleanix Case Study", "Cleaning Project Dhaka", project.category],
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectDetailsHeader project={project} />

      <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Main Content (col-span-8) */}
            <div className="lg:col-span-8">
              <ProjectDetailsContent project={project} />
            </div>

            {/* Right Sidebar (col-span-4) */}
            <div className="lg:col-span-4 sticky top-28">
              <ProjectDetailsSidebar project={project} />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
