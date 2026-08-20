"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

export default function ProjectsOverview() {
  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Custom Shaped Cleaner Image (Transparent PNG with Native Top Cutout Corners) */}
          <div className="lg:col-span-6 relative w-full h-[460px] sm:h-[540px] md:h-[580px] flex items-center justify-center group">
            <Image
              src="https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630"
              alt="Delivering Cleaner Healthier Spaces Professional Care"
              fill
              unoptimized
              priority
              className="object-contain object-center lg:object-left group-hover:scale-105 transition-transform duration-700 drop-shadow-xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right Column: Content & Features Grid */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Pill Badge */}
            <div>
              <span className="inline-block border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-6 bg-blue-50/50">
                10K+ COMPLETED PROJECTS
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12] mb-6">
              DELIVERING CLEANER, <br />
              HEALTHIER SPACES WITH <br />
              <span className="text-[#007eff]">PROFESSIONAL</span> CARE
            </h2>

            {/* Paragraph 1 */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 font-normal">
              From residential homes to commercial facilities, we provide dependable cleaning solutions tailored to every environment. Our experienced team combines modern equipment with eco-friendly products to deliver spotless results and exceptional customer satisfaction.
            </p>

            {/* Paragraph 2 */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 font-normal">
              We deliver reliable cleaning solutions that connect our team with clients across homes, offices, and commercial spaces. From move-in cleaning to post-construction cleanup, every project is handled with trained staff, proven checklists, and a commitment to spotless, on-time results.
            </p>

            {/* 4 Feature Points (2-Column Checkmark Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0055ff] to-[#00aaff] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
                <span className="text-sm font-extrabold text-[#001837]">
                  Residential Deep Cleaning
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0055ff] to-[#00aaff] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
                <span className="text-sm font-extrabold text-[#001837]">
                  End-to-End Sanitation
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0055ff] to-[#00aaff] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
                <span className="text-sm font-extrabold text-[#001837]">
                  Eco-Friendly Products
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0055ff] to-[#00aaff] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
                <span className="text-sm font-extrabold text-[#001837]">
                  Real-Time Job Tracking
                </span>
              </div>
            </div>

            {/* Start A Project CTA Button */}
            <div>
              <Link
                href="/#quote"
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-sm md:text-base pl-6 pr-2 py-2.5 rounded-full inline-flex items-center gap-4 transition-all duration-300 shadow-[0_0_20px_rgba(0,126,255,0.4)] hover:shadow-[0_0_30px_rgba(0,126,255,0.7)] hover:scale-105"
              >
                <span>Start A Project</span>
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
