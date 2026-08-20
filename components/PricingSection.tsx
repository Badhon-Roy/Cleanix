"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Sparkle } from "lucide-react";

export function AsteriskIcon() {
  return (
    <div className="w-8 h-8 text-[#007eff] flex items-center justify-center mb-4">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
      </svg>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="w-full bg-[#F0F2F4] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Badge, Title & Cleaning Bucket Asset */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <div>
              {/* Badge Pill */}
              <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4 bg-white/60">
                PRICING
              </span>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase mb-8">
                FLEXIBLE PRICING PLANS CLEANING SERVICES
              </h2>
            </div>

            {/* Cleaning Bucket Asset */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[260px] sm:h-[300px] mt-4">
              <Image
                src="/cleaning-bucket.png"
                alt="Cleaning Bucket with Supplies"
                fill
                priority
                className="object-contain object-left-bottom drop-shadow-lg"
                sizes="320px"
              />
            </div>
          </div>

          {/* Right Column: 2 Pricing Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: BASIC */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              <div>
                <AsteriskIcon />
                <h3 className="text-[#001837] font-extrabold text-2xl tracking-wide uppercase mb-1">
                  BASIC
                </h3>
                <p className="text-slate-500 font-medium text-sm mb-6">
                  Perfect for new investors
                </p>

                {/* Price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-[#001837] tracking-tight">
                    $199
                  </span>
                  <span className="text-slate-500 font-bold text-sm ml-1">
                    / Monthly
                  </span>
                </div>

                {/* Select Plan Button */}
                <Link
                  href="#select-basic"
                  className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm sm:text-base py-3 px-6 rounded-full w-full flex items-center justify-between shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] mb-8"
                >
                  <span>Select Plan</span>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </Link>

                {/* Feature Checklist */}
                <div className="space-y-3.5 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Standard Home Cleaning
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Kitchen &amp; Bath Refresh
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Email Support
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Real-time Tracking
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Monthly Report
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: STANDARD (POPULAR) */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              {/* Popular Badge */}
              <span className="border border-[#007eff]/60 text-[#007eff] font-bold text-[10px] uppercase tracking-wider rounded-full px-4 py-1 absolute top-7 right-7">
                POPULAR
              </span>

              <div>
                <AsteriskIcon />
                <h3 className="text-[#001837] font-extrabold text-2xl tracking-wide uppercase mb-1">
                  STANDARD
                </h3>
                <p className="text-slate-500 font-medium text-sm mb-6">
                  Perfect for new investors
                </p>

                {/* Price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-[#001837] tracking-tight">
                    $499
                  </span>
                  <span className="text-slate-500 font-bold text-sm ml-1">
                    / Monthly
                  </span>
                </div>

                {/* Select Plan Button */}
                <Link
                  href="#select-standard"
                  className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm sm:text-base py-3 px-6 rounded-full w-full flex items-center justify-between shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] mb-8"
                >
                  <span>Select Plan</span>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </Link>

                {/* Feature Checklist */}
                <div className="space-y-3.5 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Priority Deep Cleaning
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Detailed Sanitizing Service
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      24/7 Dedicated Support
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Advanced Real-time Tracking
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Multi-Room Cleaning Plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2: STANDARD (POPULAR) */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              {/* Popular Badge */}
              <span className="border border-[#007eff]/60 text-[#007eff] font-bold text-[10px] uppercase tracking-wider rounded-full px-4 py-1 absolute top-7 right-7">
                POPULAR
              </span>

              <div>
                <AsteriskIcon />
                <h3 className="text-[#001837] font-extrabold text-2xl tracking-wide uppercase mb-1">
                  STANDARD
                </h3>
                <p className="text-slate-500 font-medium text-sm mb-6">
                  Perfect for new investors
                </p>

                {/* Price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-[#001837] tracking-tight">
                    $499
                  </span>
                  <span className="text-slate-500 font-bold text-sm ml-1">
                    / Monthly
                  </span>
                </div>

                {/* Select Plan Button */}
                <Link
                  href="#select-standard"
                  className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm sm:text-base py-3 px-6 rounded-full w-full flex items-center justify-between shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] mb-8"
                >
                  <span>Select Plan</span>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </Link>

                {/* Feature Checklist */}
                <div className="space-y-3.5 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Priority Deep Cleaning
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Detailed Sanitizing Service
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      24/7 Dedicated Support
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Advanced Real-time Tracking
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      Multi-Room Cleaning Plan
                    </span>
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
