"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { ServiceDetail } from "@/lib/servicesData";

interface Props {
  service: ServiceDetail;
}

export default function ServiceDetailsHeader({ service }: Props) {
  return (
    <section className="relative w-full bg-[#001837] text-white pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-white/10 -mt-[102px]">
      {/* Background Glow Spotlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-[#007eff]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center leading-tight uppercase tracking-tight mb-4">
          {service.title}
        </h1>

        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed text-center">
          {service.shortDesc}
        </p>
      </div>
    </section>
  );
}
