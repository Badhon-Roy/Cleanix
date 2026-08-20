"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const projectsList = [
  {
    id: 1,
    title: "SPARK HOME REFRESH",
    category: "CLEANING",
    year: "2026",
    description:
      "Reliable residential cleaning for busy homes, using trained teams, safe products, and detailed room-by-room checklists for a healthier living space.",
    image:
      "https://framerusercontent.com/images/bGhAKZiC8z0rbAf11PaNvvEUJA8.png?width=554&height=370",
  },
  {
    id: 2,
    title: "OFFICE DEEP CLEANING",
    category: "CLEANING",
    year: "2026",
    description:
      "Comprehensive office cleaning that keeps workstations, meeting rooms, kitchens, and common areas fresh, hygienic, and ready for productive teams.",
    image:
      "https://framerusercontent.com/images/iwM5w99dnI438KMR1A53E3idQ.png?width=554&height=370",
  },
  {
    id: 3,
    title: "MOVE OUT CLEAN SERVICE",
    category: "CLEANING",
    year: "2026",
    description:
      "Fast, dependable move-in and move-out cleaning designed for tight schedules, detailed turnovers, and spotless handover-ready interiors.",
    image:
      "https://framerusercontent.com/images/fxmPYxWX2tkvPKHFeqbLVtKSLs4.png?width=554&height=370",
  },
  {
    id: 4,
    title: "SPARK HOME REFRESH",
    category: "CLEANING",
    year: "2026",
    description:
      "Reliable residential cleaning for busy homes, using trained teams, safe products, and detailed room-by-room checklists for a healthier living space.",
    image:
      "https://framerusercontent.com/images/bGhAKZiC8z0rbAf11PaNvvEUJA8.png?width=554&height=370",
  }
];

export default function ProjectsSection() {
  return (
    <section className="w-full bg-[#001837] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 mb-12 md:mb-16">
          {/* Badge (Left) */}
          <div className="flex-shrink-0">
            <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2">
              OUR SUCCESSFULL WORK
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
          {projectsList.map((project, index) => (
            <div
              key={project.id}
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
                      {project.category}
                    </span>
                    <span className="bg-white/10 text-white/80 font-bold text-[10px] sm:text-xs uppercase px-3.5 py-1 rounded-full border border-white/10">
                      {project.year}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-white font-black text-2xl sm:text-3xl md:text-4xl tracking-tight uppercase mb-4">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mb-8">
                    {project.description}
                  </p>
                </div>

                {/* View Details Button */}
                <div>
                  <Link
                    href={`#project-${project.id}`}
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
                  src={project.image}
                  alt={project.title}
                  fill
                  priority
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
