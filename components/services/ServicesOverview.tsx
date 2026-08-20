"use client";

import React from "react";
import Image from "next/image";
import { Home, Building2, Check } from "lucide-react";

export default function ServicesOverview() {
  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Custom Shaped Cleaner Image (Transparent PNG with Native Top Curved Corners) */}
          <div className="lg:col-span-6 relative w-full h-[460px] sm:h-[540px] md:h-[580px] flex items-center justify-center group">
            <Image
              src="https://framerusercontent.com/images/c5y1nznyANddYfGro1eQOAip3bc.png?width=588&height=640"
              alt="Professional Cleaner Service Overview"
              fill
              unoptimized
              priority
              className="object-contain object-center lg:object-left group-hover:scale-105 transition-transform duration-700 drop-shadow-xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right Column: Content & 2 Feature Cards */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Pill Badge */}
            <div>
              <span className="inline-block border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-6 bg-blue-50/50">
                SERVICES OVERVIEW
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12] mb-6">
              COMPLETE HOME &amp; <br />
              BUSINESS <span className="text-[#007eff]">CLEANING</span> CARE
            </h2>

            {/* Paragraph Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 font-medium">
              ঢাকার যেকোনো রেসিডেন্সিয়াল হোম, অ্যাপার্টমেন্ট, করপোরেট অফিস, শোরুম ও রেনোভেশন পরবর্তী স্পেসের জন্য আধুনিক SaaS প্ল্যাটফর্মের মাধ্যমে নির্ভরযোগ্য স্যানিটাইজেশন ও ডিপ ক্লিনিং সুবিধা।
            </p>

            {/* 2 Service Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 1: Residential Cleaning */}
              <div className="bg-[#f4f6f9] rounded-3xl p-6 border border-slate-200/80 hover:border-[#007eff]/40 transition-all duration-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0055ff] via-[#007eff] to-[#00aaff] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/25">
                      <Home className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#001837] leading-tight">
                      Residential <br /> Cleaning (B2C)
                    </h3>
                  </div>

                  <div className="w-full border-b border-slate-200/80 my-4" />

                  {/* Checklist */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                      <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                      <span>Room-by-Room Deep Clean</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                      <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                      <span>Kitchen &amp; Bathroom Reset</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                      <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                      <span>Sofa &amp; Carpet Vacuuming</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Commercial Cleaning */}
              <div className="bg-[#f4f6f9] rounded-3xl p-6 border border-slate-200/80 hover:border-[#007eff]/40 transition-all duration-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#001837] to-[#0b2144] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Building2 className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#001837] leading-tight">
                      Commercial <br /> Cleaning (B2B)
                    </h3>
                  </div>

                  <div className="w-full border-b border-slate-200/80 my-4" />

                  {/* Checklist */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                      <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                      <span>Workstation Sanitization</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                      <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                      <span>Off-Hour &amp; Weekend Shifts</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                      <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                      <span>Monthly Corporate SLAs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
