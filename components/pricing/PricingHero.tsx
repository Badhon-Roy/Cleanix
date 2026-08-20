"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, BadgePercent } from "lucide-react";

export default function PricingHero() {
  return (
    <section className="relative w-full min-h-[460px] md:min-h-[500px] bg-[#001837] text-white pt-32 pb-20 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-white/10 flex items-center justify-center -mt-[102px]">
      {/* Background Image Overlay */}
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
            alt="Cleanix Transparent Pricing Plans"
            fill
            priority
            className="object-cover object-center opacity-65"
            sizes="(max-width: 1024px) 100vw, 75vw"
          />
        </div>

        {/* Color Mask Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001837] via-[#001837]/90 via-40% md:via-35% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[#001837]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001837]/70 via-transparent to-[#001837] pointer-events-none" />

        {/* Radial Blue Spotlight Accent */}
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#007eff]/20 rounded-full blur-[150px] pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full container mx-auto px-4 sm:px-6 lg:px-12 pt-10">
        <div className="max-w-3xl text-left">
          {/* Subtitle Badge Pill */}
          <div className="flex items-center gap-2.5 rounded-full border border-[#007eff]/40 bg-[#007eff]/15 backdrop-blur-md px-4 py-2 mb-6 shadow-lg max-w-max">
            <BadgePercent className="w-4 h-4 text-[#007eff]" />
            <span className="text-white text-xs md:text-sm font-bold tracking-wider uppercase">
              TRANSPARENT SAAS PRICING &amp; ESTIMATE
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black text-white leading-[1.12] tracking-tight mb-6 uppercase drop-shadow-md">
            AFFORDABLE &amp; FLEXIBLE <span className="text-[#007eff]">PRICING</span> PLANS
          </h1>

          {/* Description */}
          <p className="text-slate-200 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl text-shadow-sm">
            আবাসিক বাসা, কমার্শিয়াল অফিস ও স্থানান্তরিত স্পেসের জন্য স্বচ্ছ সাবস্ক্রিপশন প্যাকেজ অথবা ডাইনামিক লাইভ ক্যালকুলেটর থেকে তাৎক্ষণিক বাজেট বের করুন।
          </p>
        </div>
      </div>
    </section>
  );
}
