"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProjectDetail } from "@/lib/projectsData";
import { io } from "socket.io-client";

interface ProjectsSectionProps {
  initialProjects?: ProjectDetail[];
}

export default function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const [projectsList, setProjectsList] = useState<ProjectDetail[]>(
    initialProjects || []
  );

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjectsList(initialProjects);
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("cms_updated", (payload: any) => {
      if (payload?.page === "projects") {
        if (payload?.action === "create" && payload?.data) {
          setProjectsList((prev) => [payload.data, ...prev]);
        } else if (payload?.action === "update" && payload?.data) {
          setProjectsList((prev) =>
            prev.map((p) => (p.slug === payload.data.slug ? payload.data : p))
          );
        } else if (payload?.action === "delete" && payload?.slug) {
          setProjectsList((prev) => prev.filter((p) => p.slug !== payload.slug));
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [initialProjects]);

  const publishedProjects = projectsList.filter((p) => p?.status !== "DRAFT");

  return (
    <section className="w-full bg-[#001837] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 mb-12 md:mb-16">
          {/* Badge (Left) */}
          <div className="flex-shrink-0">
            <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2">
              OUR SUCCESSFUL WORK
            </span>
          </div>

          {/* Headline (Right) */}
          <div className="lg:max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-white leading-[1.12] tracking-tight uppercase">
              EXPLORE OUR REAL WORLD CLEANING{" "}
              <span className="text-[#007eff]">PROJECTS</span>
            </h2>
          </div>
        </div>

        {/* Sticky Stacking Projects Cards Stack */}
        <div className="space-y-12 md:space-y-16 relative pb-12">
          {publishedProjects.map((project, index) => (
            <div
              key={project?.slug || project?._id || index}
              style={{
                top: `calc(100px + ${index * 24}px)`,
                zIndex: index + 10,
              }}
              className="sticky w-full bg-[#071f40] border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl transition-all duration-300"
            >
              {/* Left Content Area */}
              <div className="w-full lg:w-1/2 text-left flex flex-col justify-between">
                <div>
                  {/* Category & Year Tags */}
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="bg-[#007eff] text-white font-bold text-[10px] sm:text-xs uppercase px-3.5 py-1 rounded-full shadow-sm">
                      {project?.category}
                    </span>
                    <span className="bg-white/10 text-white/80 font-bold text-[10px] sm:text-xs uppercase px-3.5 py-1 rounded-full border border-white/10">
                      {project?.startDate ? project.startDate.split(" ").pop() : "2026"}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-white font-black text-2xl sm:text-3xl md:text-4xl tracking-tight uppercase mb-4">
                    {project?.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mb-8 line-clamp-3">
                    {project?.introParagraph}
                  </p>
                </div>

                {/* View Details Button */}
                <div>
                  <Link
                    href={`/projects/${project?.slug}`}
                    className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm pl-5 pr-1.5 py-1.5 rounded-full inline-flex items-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.03]"
                  >
                    <span>View Details</span>
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right Image Area */}
              <div className="w-full lg:w-1/2 relative h-[260px] sm:h-[320px] md:h-[360px] overflow-hidden rounded-b-lg rounded-tr-lg">
                <Image
                  src={project?.heroImage || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"}
                  alt={project?.title || "Cleanix Project"}
                  fill
                  priority
                  unoptimized
                  className="object-cover object-center transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
