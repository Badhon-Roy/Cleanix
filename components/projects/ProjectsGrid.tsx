"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectDetail } from "@/lib/projectsData";
import { io } from "socket.io-client";

interface ProjectsGridProps {
  initialProjects?: ProjectDetail[];
}

export default function ProjectsGrid({ initialProjects }: ProjectsGridProps) {
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
    <section className="w-full bg-[#f0f2f4] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/60">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-6 py-2 mb-4 bg-white/70 backdrop-blur-md shadow-2xs">
            OUR PROJECTS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12]">
            EXPLORE OUR REAL WORLD <br />
            <span className="text-[#007eff]">CLEANING</span> PROJECTS
          </h2>
        </div>

        {/* 4 Cards Grid (2x2 on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {publishedProjects.map((item) => (
            <Link
              key={item?.slug || item?._id}
              href={`/projects/${item?.slug}`}
              className="bg-white hover:bg-[#001837] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-[0_20px_50px_rgba(0,126,255,0.25)] border border-slate-200/60 hover:border-[#007eff]/60 transition-all duration-500 hover:-translate-y-2 group flex flex-col justify-between"
            >
              {/* Card Image */}
              <div className="relative w-full h-[260px] sm:h-[300px] md:h-[330px] rounded-2xl overflow-hidden mb-6 bg-slate-100">
                <Image
                  src={item?.heroImage || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"}
                  alt={item?.title || "Cleanix Project Case Study"}
                  fill
                  unoptimized
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Card Info & Circular Arrow Action */}
              <div className="flex items-end justify-between gap-4 pt-1">
                <div>
                  {/* Category & Year Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#007eff] text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-2xs">
                      {item?.category}
                    </span>
                    <span className="bg-slate-100 group-hover:bg-white/10 text-slate-500 group-hover:text-slate-200 font-bold text-[10px] sm:text-[11px] px-3 py-1 rounded-full border border-slate-200/80 group-hover:border-white/20 transition-colors">
                      {item?.startDate ? item.startDate.split(" ").pop() : "2026"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#001837] group-hover:text-white uppercase tracking-tight transition-colors leading-tight">
                    {item?.title}
                  </h3>
                </div>

                {/* Solid Blue Circular Arrow Button -> Inverts on hover */}
                <div className="w-11 h-11 rounded-full bg-[#007eff] group-hover:bg-white text-white group-hover:text-[#007eff] flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/25 group-hover:scale-110 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 stroke-[2.5] text-white group-hover:text-[#007eff] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
