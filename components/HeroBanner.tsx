"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[104vh] min-h-screen bg-[#001837] overflow-hidden flex items-center -mt-[102px] pt-28 pb-12 rounded-none">
      {/* Background Image Container spanning full width with CSS gradient mask */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-none">
        {/* Cleaner Image with smooth alpha mask (0% opacity on left to 100% on right) */}
        <div
          className="absolute top-0 right-0 w-full lg:w-[75%] xl:w-[70%] h-full rounded-none overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 20%, rgba(0, 0, 0, 0.8) 50%, black 80%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 20%, rgba(0, 0, 0, 0.8) 50%, black 80%)",
          }}
        >
          <Image
            src="/hero-cleaner.png"
            alt="Reliable Professional Cleaner"
            fill
            priority
            className="object-cover object-center lg:object-right rounded-none"
            sizes="(max-width: 1024px) 100vw, 75vw"
          />
        </div>

        {/* Multi-layered #001837 Color Tint & Smooth Gradient Overlays */}
        {/* 1. Left-to-Right Solid to Transparent Gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-[#001837] via-[#001837]/90 via-35% md:via-30% to-transparent pointer-events-none" />

        {/* 2. Soft Ambient Tint for legibility */}
        <div className="absolute inset-0 bg-[#001837]/20 pointer-events-none" />

        {/* 3. Top-to-Bottom Subtle Shadow */}
        <div className="absolute inset-0 bg-linear-to-b from-[#001837]/60 via-transparent to-[#001837]/50 pointer-events-none" />
      </div>

      {/* Hero Main Content Container */}
      <div className="relative z-20 w-full container mx-auto px-4 sm:px-6 pt-8">
        <div className="max-w-3xl text-left">
          {/* Subtitle Badge Pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/[0.07] backdrop-blur-md px-3.5 py-2 mb-6 md:mb-8 shadow-lg">
            <div className="w-5 h-5 rounded-full bg-[#007eff] flex items-center justify-center text-white shrink-0">
              <ChevronRight className="w-3.5 h-3.5 stroke-3" />
            </div>
            <span className="text-white text-xs md:text-sm font-semibold tracking-wider uppercase font-sans">
              SIMPLE. RELIABLE. PROFESSIONAL CLEANING
            </span>
          </div>

          {/* Headline - Exact 2-Line Formatting matching Reference */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[62px] xl:text-[68px] font-extrabold text-white leading-[1.08] tracking-tight mb-6 uppercase drop-shadow-md">
            <span className="block whitespace-nowrap">RELIABLE CLEANING,</span>
            <span className="block whitespace-nowrap">HOMES &amp; OFFICES</span>
          </h1>

          {/* Subheading / Description */}
          <p className="text-slate-200 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-lg mb-8 md:mb-10 text-shadow-sm">
            Experience professional cleaning services designed save you time
            <br className="hidden sm:inline" />
            keep your home business sparkling clean every
          </p>

          {/* Action Buttons with Glowing Blue Shadows */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Button 1: Our Services */}
            <Link
              href="#services"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm md:text-base pl-6 pr-2 py-2.5 rounded-full flex items-center gap-3 transition-all duration-300 shadow-[0_0_22px_rgba(0,126,255,0.5)] hover:shadow-[0_0_32px_rgba(0,126,255,0.75)] hover:scale-[1.03] group"
            >
              <span>Our Services</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
              </div>
            </Link>

            {/* Button 2: Get Free Quote */}
            <Link
              href="#quote"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm md:text-base pl-6 pr-2 py-2.5 rounded-full flex items-center gap-3 transition-all duration-300 shadow-[0_0_22px_rgba(0,126,255,0.5)] hover:shadow-[0_0_32px_rgba(0,126,255,0.75)] hover:scale-[1.03] group"
            >
              <span>Get Free Quote</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
