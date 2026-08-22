"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles, Calculator } from "lucide-react";
import {
  getStoredServicesCMSData,
  defaultServicesCMSData,
  ServicesCMSContent,
} from "@/lib/servicesCMSData";

export default function ServicesBanner() {
  const [data, setData] = useState<ServicesCMSContent>(defaultServicesCMSData);

  useEffect(() => {
    setData(getStoredServicesCMSData());

    const handleUpdate = () => {
      setData(getStoredServicesCMSData());
    };

    window.addEventListener("cleanix_services_cms_updated", handleUpdate);
    return () => {
      window.removeEventListener("cleanix_services_cms_updated", handleUpdate);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[540px] md:min-h-[600px] bg-[#001837] text-white pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-white/10 flex items-center justify-center -mt-[102px]">
      {/* Background Image Container with Gradient Mask */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Cleaner Image with Smooth Right-to-Left Alpha Mask */}
        <div
          className="absolute top-0 right-0 w-full lg:w-[75%] xl:w-[70%] h-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.85) 50%, black 80%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.85) 50%, black 80%)",
          }}
        >
          <Image
            src={data.heroImage || "/COMMERCIAL-OFFICE-CLEANING.png"}
            alt="Cleanix Cleaning Services Banner"
            fill
            priority
            unoptimized
            className="object-cover object-center lg:object-right opacity-80"
            sizes="(max-width: 1024px) 100vw, 75vw"
          />
        </div>

        {/* Multi-layered #001837 Color Tint & Smooth Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001837] via-[#001837]/90 via-40% md:via-35% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[#001837]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001837]/70 via-transparent to-[#001837] pointer-events-none" />

        {/* Glowing Radial Blue Spotlight Accent */}
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#007eff]/20 rounded-full blur-[150px] pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 w-full container mx-auto px-4 sm:px-6 lg:px-12 pt-12">
        <div className="max-w-3xl text-left">
          {/* Subtitle Badge Pill */}
          <div className="flex items-center gap-2.5 rounded-full border border-[#007eff]/40 bg-[#007eff]/15 backdrop-blur-md px-4 py-2 mb-6 shadow-lg max-w-max">
            <Sparkles className="w-4 h-4 text-[#007eff]" />
            <span className="text-white text-xs md:text-sm font-bold tracking-wider uppercase">
              {data.heroBadge || "WORLD-CLASS CLEANING SOLUTIONS"}
            </span>
          </div>

          {/* Headline - High Impact Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black text-white leading-[1.12] tracking-tight mb-6 uppercase drop-shadow-md">
            {data.heroTitleLine1}{" "}
            {data.heroTitleHighlight1 && (
              <span className="text-[#007eff]">{data.heroTitleHighlight1}</span>
            )}{" "}
            {data.heroTitleMiddle}{" "}
            {data.heroTitleHighlight2 && (
              <span className="text-[#007eff]">{data.heroTitleHighlight2}</span>
            )}
          </h1>

          {/* Subtitle Description */}
          {data.heroSubtitle && (
            <div
              className="text-slate-200 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl mb-8 text-shadow-sm [&_p]:mb-2 [&_b]:text-white [&_b]:font-bold"
              dangerouslySetInnerHTML={{ __html: data.heroSubtitle }}
            />
          )}

          {/* Action Buttons with Glowing Blue Shadows */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/#quote"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-sm md:text-base pl-6 pr-2 py-2.5 rounded-full flex items-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(0,126,255,0.5)] hover:shadow-[0_0_35px_rgba(0,126,255,0.8)] hover:scale-[1.03] group"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Instant Estimate</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
              </div>
            </Link>

            <Link
              href="/#pricing"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm md:text-base pl-6 pr-2 py-2.5 rounded-full flex items-center gap-3 border border-white/20 transition-all duration-300 hover:scale-[1.03] group backdrop-blur-md"
            >
              <span>View Packages</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#007eff] flex items-center justify-center text-white shadow-sm group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
