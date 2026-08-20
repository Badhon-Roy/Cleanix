"use client";

import React from "react";
import Image from "next/image";

const stepsList = [
  {
    step: "STEP 01",
    title: "GET INSTANT ESTIMATE",
    description:
      "Share your rooms, schedule, and cleaning goals to receive a clear estimate for your space.",
    image:
      "https://framerusercontent.com/images/iP0bB1oMamNlkOzNJQUNBhTRiU.png?width=464&height=320",
  },
  {
    step: "STEP 02",
    title: "PROFESSIONAL CLEANING VISIT",
    description:
      "Our trained team arrives prepared, protects surfaces, and cleans every agreed area.",
    image:
      "https://framerusercontent.com/images/qQZSYnMAEFCtGMlduHTBAQmANg.png?width=464&height=320",
  },
  {
    step: "STEP 03",
    title: "QUALITY CHECK FOLLOW-UP",
    description:
      "We review the finished work, and make sure the space meets your expectations.",
    image:
      "https://framerusercontent.com/images/2Zn55hKsUUZQoQR8DfeD1PUXY78.png?width=464&height=320",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 mb-12 md:mb-16">
          {/* Badge & Headline (Left) */}
          <div className="max-w-2xl">
            <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4">
              HOW IT WORK
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase">
              EASY STEPS TO BOOK YOUR{" "}
              <span className="text-[#007eff]">CLEANING</span>
            </h2>
          </div>

          {/* Subtitle Description (Right) */}
          <div className="lg:max-w-md">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Seamlessly deliver reliable cleaning support with simple booking,
              clear communication, trained specialists, and final walkthroughs
              that keep every space fresh.
            </p>
          </div>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8">
          {stepsList.map((item, index) => (
            <div key={index} className="flex flex-col group">
              {/* Top Image Card */}
              <div className="relative w-full h-[240px] sm:h-[270px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Bottom Overlapping Step Info Card */}
              <div className="bg-[#f2f4f8] rounded-2xl p-6 sm:p-7 shadow-xs -mt-10 sm:-mt-12 relative z-10 mx-3 sm:mx-4 border border-slate-200/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                {/* Step Badge */}
                <span className="bg-[#007eff] text-white font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full inline-block mb-3 shadow-xs">
                  {item.step}
                </span>

                {/* Step Title */}
                <h3 className="text-[#001837] font-black text-lg sm:text-xl tracking-tight uppercase mb-2">
                  {item.title}
                </h3>

                {/* Step Description */}
                <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
