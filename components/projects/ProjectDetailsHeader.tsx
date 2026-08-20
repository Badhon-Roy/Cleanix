"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { ProjectDetail } from "@/lib/projectsData";

interface Props {
  project: ProjectDetail;
}

export default function ProjectDetailsHeader({ project }: Props) {
  return (
    <section className="relative w-full bg-[#001837] text-white pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-white/10 -mt-[102px]">
      {/* Background Glow Spotlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-[#007eff]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 mb-6 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full uppercase tracking-wider">
          <Link href="/" className="hover:text-[#007eff] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#007eff]" />
          <Link href="/projects" className="hover:text-[#007eff] transition-colors">
            Projects
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#007eff]" />
          <span className="text-[#007eff] font-bold truncate max-w-[200px] sm:max-w-none">
            {project.title}
          </span>
        </nav>

        {/* Category Pill Badge */}
        <div className="flex items-center gap-2 rounded-full border border-[#007eff]/40 bg-[#007eff]/15 backdrop-blur-md px-4 py-1.5 mb-4 shadow-lg max-w-max">
          <Sparkles className="w-4 h-4 text-[#007eff]" />
          <span className="text-white text-xs font-bold tracking-wider uppercase">
            {project.categoryFull}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tight max-w-5xl">
          {project.title}
        </h1>
      </div>
    </section>
  );
}
