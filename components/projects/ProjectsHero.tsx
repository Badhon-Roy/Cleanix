"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles, FolderCheck, Calculator } from "lucide-react";

export default function ProjectsHero() {
  return (
    <section className="relative w-full min-h-[520px] md:min-h-[580px] bg-[#001837] text-white pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-white/10 flex items-center justify-center -mt-[102px]">
      {/* Background Image Container with Mask */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
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
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"
            alt="Cleanix Completed Cleaning Projects"
            fill
            priority
            className="object-cover object-center opacity-75"
            sizes="(max-width: 1024px) 100vw, 75vw"
          />
        </div>

        {/* Multi-layered #001837 Color Tint Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001837] via-[#001837]/90 via-40% md:via-35% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[#001837]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001837]/70 via-transparent to-[#001837] pointer-events-none" />

        {/* Radial Blue Spotlight Accent */}
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#007eff]/20 rounded-full blur-[150px] pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full container mx-auto px-4 sm:px-6 lg:px-12 pt-12">
        <div className="max-w-3xl text-left">

          {/* Subtitle Badge Pill */}
          <div className="flex items-center gap-2.5 rounded-full border border-[#007eff]/40 bg-[#007eff]/15 backdrop-blur-md px-4 py-2 mb-6 shadow-lg max-w-max">
            <FolderCheck className="w-4 h-4 text-[#007eff]" />
            <span className="text-white text-xs md:text-sm font-bold tracking-wider uppercase">
              OUR RECENT WORK &amp; PORTFOLIO
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black text-white leading-[1.12] tracking-tight mb-6 uppercase drop-shadow-md">
            EXPLORE OUR <span className="text-[#007eff]">SUCCESSFUL</span> CLEANING PROJECTS
          </h1>

          {/* Description */}
          <p className="text-slate-200 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl mb-8 text-shadow-sm">
            ঢাকার বিভিন্ন অভিজাত অ্যাপার্টমেন্ট, করপোরেট অফিস, শোরুম ও রেনোভেশন পরবর্তী স্থানে সম্পন্নকৃত আমাদের কিছু উল্লেখযোগ্য কাজের বাস্তব পোর্টফোলিও দেখুন।
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/#quote"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-sm md:text-base pl-6 pr-2 py-2.5 rounded-full flex items-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(0,126,255,0.5)] hover:shadow-[0_0_35px_rgba(0,126,255,0.8)] hover:scale-[1.03] group"
            >
              <Calculator className="w-4 h-4" />
              <span>Start Your Project</span>
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
