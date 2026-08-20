"use client";

import React from "react";
import Image from "next/image";

const statsList = [
  {
    id: 1,
    value: "2,500+",
    label: "ক্লিন করা বাসা ও অফিস",
  },
  {
    id: 2,
    value: "150+",
    label: "ভেরিফাইড প্রফেশনাল ক্লিনার",
  },
  {
    id: 3,
    value: "99.2%",
    label: "সন্তোষজনক কাস্টমার রেটিং",
  },
];

export default function ImpactSection() {
  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 mb-12 md:mb-16">
          {/* Badge & Headline (Left) */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#007eff] inline-block" />
              <span>OUR IMPACT &amp; NUMBERS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] leading-[1.15] tracking-tight uppercase">
              REAL NUMBERS BEHIND OUR <br className="hidden sm:block" />
              <span className="text-[#007eff]">CLEANING EXCELLENCE</span>
            </h2>
          </div>

          {/* Subtitle Description (Right) */}
          <div className="lg:max-w-md">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              বাংলাদেশের প্রতিটি বাসা ও কর্পোরেট অফিস স্পেসকে শতভাগ জীবাণুমুক্ত ও ঝকঝকে রাখার নির্ভরযোগ্য ডিজিটাল সমাধান।
            </p>
          </div>
        </div>

        {/* 3-Column Main Grid (Equal Height Columns: Left Image, Center 3 Stats, Right Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Image Card 1 */}
          <div className="lg:col-span-4 relative w-full min-h-[320px] sm:min-h-[360px] lg:min-h-[380px] h-full rounded-3xl overflow-hidden shadow-xs border border-slate-100">
            <Image
              src="https://framerusercontent.com/images/7kuxPVTjMLe1PbETJGXV0BIBB6s.png?scale-down-to=512&width=901&height=826"
              alt="Modern Property Exterior 1"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>

          {/* Center Column: 3 Stacked Stat Cards Matching Exact Height */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3 sm:gap-4 h-full">
            {statsList.map((stat) => (
              <div
                key={stat.id}
                className="flex-1 bg-[#f4f6f8] rounded-2xl p-5 sm:p-6 flex items-center justify-between border border-slate-200/60 hover:border-slate-300 transition-all duration-300 min-h-[96px]"
              >
                <span className="text-3xl sm:text-4xl lg:text-[36px] font-black text-[#007eff] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-slate-700 font-extrabold text-xs sm:text-base tracking-wider uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Right Column: Image Card 2 */}
          <div className="lg:col-span-4 relative w-full min-h-[320px] sm:min-h-[360px] lg:min-h-[380px] h-full rounded-3xl overflow-hidden shadow-xs border border-slate-100">
            <Image
              src="https://framerusercontent.com/images/RakXiRCu0eigdFvdHDqHa9us9PQ.png?width=855&height=858"
              alt="Modern Property Exterior 2"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
