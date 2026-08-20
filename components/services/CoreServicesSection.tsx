"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export default function CoreServicesSection() {
  const services = [
    {
      num: "01",
      category: "HOME CARE",
      title: "RESIDENTIAL DEEP CLEANING",
      checklist: [
        "Detailed Room-By-Room Cleaning",
        "Flexible Recurring Home Service",
      ],
      image: "/RESIDENTIAL-DEEP-CLEANING.png",
      imageFirst: true,
    },
    {
      num: "02",
      category: "OFFICE",
      title: "COMMERCIAL OFFICE CLEANING",
      checklist: [
        "Daily & Weekly Office Programs",
        "High-Touch Surface Sanitizing",
      ],
      image: "https://framerusercontent.com/images/71kz5iX4crWQYqbcukrbVWogYA.png?width=600&height=400",
      imageFirst: false,
    },
    {
      num: "03",
      category: "TURNOVER",
      title: "MOVE-OUT CLEANING",
      checklist: [
        "Fast & Time-Critical Cleaning",
        "Move-In / Move-Out Deep Clean",
      ],
      image: "https://framerusercontent.com/images/gRwXdPkLkyjS5JXnK04q3ttVLk.png?width=600&height=400",
      imageFirst: true,
    },
    {
      num: "04",
      category: "RENOVATION",
      title: "POST-CONSTRUCTION CLEANING",
      checklist: [
        "Debris & Heavy Dust Removal",
        "Post-Renovation Deep Scrub & Polish",
      ],
      image: "https://framerusercontent.com/images/P64qFbW7sjXKqLCWX5Fd9KuqA.png?width=600&height=400",
      imageFirst: false,
    },
  ];

  return (
    <section className="w-full bg-[#f4f6f9] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-6 py-2 mb-6 bg-blue-50/50">
            <Sparkles className="w-3.5 h-3.5 text-[#007eff]" />
            <span>OUR CORE SERVICES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12]">
            RELIABLE HOME &amp; COMMERCIAL <br />
            <span className="text-[#007eff]">CLEANING</span> SERVICES
          </h2>
        </div>

        {/* 4 Core Service Pairs */}
        <div className="space-y-8">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch relative"
            >
              {/* Left Box (Top-Right Chamfered Corner) */}
              <div
                className={`relative w-full min-h-[360px] sm:min-h-[420px] rounded-[32px] overflow-hidden shadow-lg border border-slate-200/80 bg-white [clip-path:polygon(0_0,calc(100%-54px)_0,100%_54px,100%_100%,0_100%)] ${
                  item.imageFirst ? "order-1" : "order-2 lg:order-1"
                }`}
              >
                {item.imageFirst ? (
                  // Image Container
                  <div className="relative w-full h-full min-h-[360px] group bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      priority
                      className="object-cover object-center  transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  // Dark Navy Card
                  <div className="relative w-full h-full bg-[#001837] text-white p-8 sm:p-10 md:p-12 flex flex-col justify-between overflow-hidden">
                    {/* Watermark Number */}
                    <span className="absolute top-4 right-8 text-6xl sm:text-7xl font-black text-white/10 select-none">
                      {item.num}
                    </span>

                    <div className="relative z-10">
                      <span className="inline-block bg-gradient-to-r from-[#0055ff] via-[#007eff] to-[#00aaff] text-white font-bold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full mb-6 shadow-xs">
                        {item.category}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight mb-6">
                        {item.title}
                      </h3>
                    </div>

                    <div className="relative z-10">
                      <div className="w-full border-t border-white/15 my-6" />
                      <div className="space-y-3">
                        {item.checklist.map((point, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0055ff] to-[#00aaff] flex items-center justify-center flex-shrink-0 shadow-xs">
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-slate-200">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Center Seam Floating Arrow Button */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                <Link
                  href="/#quote"
                  className="pointer-events-auto w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group p-1.5 border border-slate-100"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0055ff] via-[#007eff] to-[#00aaff] flex items-center justify-center text-white shadow-md">
                    <ArrowRight className="w-4.5 h-4.5 stroke-[2.5] text-white group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>

              {/* Right Box (Top-Left Chamfered Corner) */}
              <div
                className={`relative w-full min-h-[360px] sm:min-h-[420px] rounded-[32px] overflow-hidden shadow-lg border border-slate-200/80 bg-white [clip-path:polygon(54px_0,100%_0,100%_100%,0_100%,0_54px)] ${
                  item.imageFirst ? "order-2" : "order-1 lg:order-2"
                }`}
              >
                {item.imageFirst ? (
                  // Dark Navy Card
                  <div className="relative w-full h-full bg-[#001837] text-white p-8 sm:p-10 md:p-12 flex flex-col justify-between overflow-hidden">
                    {/* Watermark Number */}
                    <span className="absolute top-4 right-8 text-6xl sm:text-7xl font-black text-white/10 select-none">
                      {item.num}
                    </span>

                    <div className="relative z-10">
                      <span className="inline-block bg-gradient-to-r from-[#0055ff] via-[#007eff] to-[#00aaff] text-white font-bold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full mb-6 shadow-xs">
                        {item.category}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight mb-6">
                        {item.title}
                      </h3>
                    </div>

                    <div className="relative z-10">
                      <div className="w-full border-t border-white/15 my-6" />
                      <div className="space-y-3">
                        {item.checklist.map((point, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0055ff] to-[#00aaff] flex items-center justify-center flex-shrink-0 shadow-xs">
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-slate-200">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Image Container
                  <div className="relative w-full h-full min-h-[360px] group bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      priority
                      className="object-cover object-center  transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
