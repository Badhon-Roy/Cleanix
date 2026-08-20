import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicesData } from "@/lib/servicesData";
import ServiceDetailsHeader from "@/components/services/ServiceDetailsHeader";
import ServiceDetailsSidebar from "@/components/services/ServiceDetailsSidebar";
import ServiceDetailsContent from "@/components/services/ServiceDetailsContent";
import CtaBanner from "@/components/CtaBanner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    return {
      title: "Service Not Found | Cleanix",
    };
  }

  return {
    title: `${service.title} | Cleanix Professional Services`,
    description: service.shortDesc,
    keywords: [service.title, "Cleanix Services", "Cleaning Service Bangladesh", service.category],
  };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  return (
    <>
      <ServiceDetailsHeader service={service} />

      <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Sidebar (col-span-4) */}
            <div className="lg:col-span-4 sticky top-28">
              <ServiceDetailsSidebar currentSlug={slug} />
            </div>

            {/* Right Main Content (col-span-8) */}
            <div className="lg:col-span-8">
              <ServiceDetailsContent service={service} />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
