"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative w-full min-h-[460px] md:min-h-[500px] bg-[#001837] text-white pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-white/10 flex items-center justify-center -mt-[102px]">
      {/* Background Image Layer - Crisp, Vibrant & Clearly Visible */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <Image
          src="/hero-cleaner.png"
          alt="Cleanix Professional Cleaner"
          fill
          priority
          className="object-cover object-center lg:object-right opacity-75"
          sizes="100vw"
        />

        {/* Soft, Transparent Color Overlay Tint for Perfect Contrast */}
        {/* Dark Tint Overlay to ensure text readability while image is clearly visible */}
        <div className="absolute inset-0 bg-[#001837]/55 pointer-events-none" />

        {/* Top & Bottom Smooth Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001837]/75 via-transparent to-[#001837] pointer-events-none" />

        {/* Left Side Subtle Fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001837]/70 via-transparent to-[#001837]/50 pointer-events-none" />
      </div>

      {/* Hero Header Content Box - Minimal, Crisp & Professional */}
      <div className="container mx-auto relative z-10 pt-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Minimal Top Pill Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 border border-[#007eff]/50 bg-[#001837]/80 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#007eff]" />
              <span>ABOUT CLEANIX</span>
            </div>
          </div>

          {/* High-Impact Sleek Headline with Drop Shadow */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] uppercase mb-5 drop-shadow-xl text-white">
            REDEFINING CLEANLINESS WITH{" "}
            <span className="text-[#007eff] drop-shadow-[0_0_20px_rgba(0,126,255,0.8)]">
              TECHNOLOGY
            </span>
          </h1>

          {/* Minimal 1-Sentence Subtitle Paragraph */}
          <p className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            বাংলাদেশের প্রথম SaaS-চালিত অন-ডিমান্ড স্মার্ট ফিল্ড সার্ভিস প্ল্যাটফর্ম—যেখানে প্রতিটি সেবা শতভাগ স্বচ্ছ, নিখুঁত এবং নিরাপদ।
          </p>
        </div>
      </div>
    </section>
  );
}
