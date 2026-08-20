"use client";

import React from "react";
import Link from "next/link";
import { Phone, ChevronRight, Sparkles, Mail } from "lucide-react";
import { ProjectDetail } from "@/lib/projectsData";

interface Props {
  project: ProjectDetail;
}

export default function ProjectDetailsSidebar({ project }: Props) {
  return (
    <aside className="w-full space-y-8">
      {/* Card 1: Project Metadata Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-[#001837]">
        {/* Client */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-1.5">
            Client :
          </span>
          <span className="text-base sm:text-lg font-black text-[#001837] block">
            {project.client}
          </span>
        </div>

        {/* Category */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-1.5">
            Category :
          </span>
          <span className="text-base sm:text-lg font-black text-[#001837] block">
            {project.categoryFull}
          </span>
        </div>

        {/* Starting Date */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-1.5">
            Starting Date :
          </span>
          <span className="text-base sm:text-lg font-black text-[#001837] block">
            {project.startDate}
          </span>
        </div>

        {/* End Date */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-1.5">
            End Date :
          </span>
          <span className="text-base sm:text-lg font-black text-[#001837] block">
            {project.endDate}
          </span>
        </div>

        {/* Project Value */}
        <div>
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-1.5">
            Project Value :
          </span>
          <span className="text-2xl font-black text-[#007eff] block">
            {project.projectValue}
          </span>
        </div>
      </div>

      {/* Card 2: Book a Similar Cleaning Promo Card */}
      <div className="bg-[#001837] text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-white/10 space-y-6">
        {/* Glow spotlight */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#007eff]/25 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top Blue Icon Circle */}
          <div className="w-12 h-12 rounded-full bg-[#007eff] text-white flex items-center justify-center shadow-md shadow-blue-500/30">
            <Phone className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-slate-300 font-bold text-xs uppercase tracking-wider block mb-1">
              Book a Similar Cleaning
            </span>
            <a
              href="tel:+8801774500815"
              className="text-2xl font-black text-white hover:text-[#007eff] transition-colors block tracking-tight"
            >
              +88 01774500815
            </a>
            <span className="text-slate-300 text-xs font-semibold block mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#007eff]" />
              info@cleanix.com
            </span>
          </div>
        </div>

        {/* Request Estimate CTA Button */}
        <div className="relative z-10 pt-2">
          <Link
            href="/#quote"
            className="w-full bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-[0_0_20px_rgba(0,126,255,0.4)] hover:scale-[1.02] group"
          >
            <span>Request Estimate</span>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}
