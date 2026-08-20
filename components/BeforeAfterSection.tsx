"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowLeftRight, CheckCircle2 } from "lucide-react";

export default function BeforeAfterSection() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const transformations = [
    {
      title: "Kitchen Chimney & Stove Hood Degreasing",
      category: "KITCHEN CARE",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      beforeLabel: "Heavy Oil & Grease Stains",
      afterLabel: "Sparkling Mirror Finish",
      highlights: [
        "100% Non-Toxic Chemical Degreasing",
        "Deep Chimney Filter Scrubbing",
        "Dust-Repellent Protective Coating",
      ],
    },
    {
      title: "Sofa & Upholstery Steam Shampoo Wash",
      category: "FURNITURE CARE",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      beforeLabel: "Accumulated Dust & Spot Marks",
      afterLabel: "Fresh Fragrance & Shampooed Reset",
      highlights: [
        "Deep Extraction Water Vacuuming",
        "Pet Hair & Odor Neutralization",
        "Fast 2-Hour Quick Dryer Technique",
      ],
    },
    {
      title: "Bathroom Tiles & Limescale Removal",
      category: "BATHROOM HYGIENE",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      beforeLabel: "Hard Water Mineral Stains",
      afterLabel: "Hospital-Grade Disinfected Shine",
      highlights: [
        "Acid-Free Tile Grout Cleaning",
        "Glass Shower Partition Polishing",
        "Germ-Free Tap & Sanitary Fixtures",
      ],
    },
    {
      title: "Post-Renovation Marble Floor Buffing",
      category: "POST-CONSTRUCTION",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
      beforeLabel: "Cement Dust & Paint Drops",
      afterLabel: "Mirror-Shine Polished Surface",
      highlights: [
        "HEPA Industrial Vacuum Extraction",
        "Surface-Safe Paint Droplet Removal",
        "High-Speed Floor Buffing Machine",
      ],
    },
  ];

  const current = transformations[activeTab];

  return (
    <section className="w-full bg-[#001837] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-white/10 relative overflow-hidden">
      {/* Background Accent Blue Glow Spotlight */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#007eff]/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-6 bg-blue-50/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#007eff]" />
            <span>PROOF OF WORK &amp; RESULTS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-[1.12]">
            REAL BEFORE &amp; AFTER <br />
            <span className="text-[#007eff]">TRANSFORMATIONS</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-normal mt-4 max-w-xl mx-auto">
            আমাদের এনআইডি ট্র্যাকিংকৃত এক্সপার্ট ক্লিনার টিমের কাজের সরাসরি আগের ও পরের ঝকঝকে তফাত দেখে নিন।
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {transformations.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                setSliderPosition(50);
              }}
              className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all duration-300 ${
                activeTab === idx
                  ? "bg-[#007eff] text-white shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10"
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Card Container */}
        <div className="bg-[#0b2144] rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Interactive Before/After Split View Image Slider */}
          <div className="lg:col-span-7 relative w-full h-[320px] sm:h-[400px] md:h-[440px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 select-none group">
            {/* 1. AFTER Tag Pill (Fixed on background layer at top-right) */}
            <span className="absolute top-4 right-4 z-10 pointer-events-none bg-[#007eff] text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-full shadow-xl whitespace-nowrap backdrop-blur-md">
              AFTER: {current.afterLabel}
            </span>

            {/* 2. After Image (Full Background Layer) */}
            <Image
              src={current.image}
              alt="After Cleaning Result"
              fill
              unoptimized
              priority
              className="object-cover object-center"
            />

            {/* 3. Before Image (Clipped Left Layer with Grime/Stain Filter & Clipped BEFORE Tag) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden z-20"
              style={{ width: `${sliderPosition}%` }}
            >
              <Image
                src={current.image}
                alt="Before Cleaning Condition"
                fill
                unoptimized
                priority
                className="object-cover object-center max-w-none filter brightness-70 contrast-125 sepia-30 saturate-85"
                style={{ width: "100%", height: "100%" }}
              />

              {/* BEFORE Tag Pill inside clipped container with unclipped fixed wrapper */}
              <div className="absolute top-4 left-4 w-[500px] pointer-events-none z-30">
                <span className="inline-block bg-[#001837]/90 border border-white/25 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-full shadow-xl whitespace-nowrap backdrop-blur-md">
                  BEFORE: {current.beforeLabel}
                </span>
              </div>
            </div>

            {/* 4. Interactive Slider Separator Bar */}
            <div
              className="absolute inset-y-0 z-30 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_#007eff]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#007eff] border-2 border-white text-white flex items-center justify-center shadow-2xl">
                <ArrowLeftRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* 5. Range Input Trigger across image */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
              aria-label="Before and after slider"
            />
          </div>

          {/* Right Side: Details & Key Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[#007eff] font-extrabold text-xs uppercase tracking-wider mb-2 block">
                {current.category} RESULT
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight">
                {current.title}
              </h3>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-3.5">
              {current.highlights.map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-slate-200 font-bold text-sm">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <p className="text-slate-300 text-xs font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                💡 <strong>কাজের স্বচ্ছতা নিশ্চিতকরণ:</strong> প্রতিটি প্রজেক্ট শেষে ক্লায়েন্টকে ডিজিটাল ইমেইলে Before &amp; After ফটো প্রুফ নোটিফিকেশন প্রদান করা হয়।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
