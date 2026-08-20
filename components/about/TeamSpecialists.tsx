"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";

export default function TeamSpecialists() {
  const team = [
    {
      name: "Anjelina Watson",
      role: "SENIOR CLEANING SPECIALIST",
      image: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=342&height=292",
    },
    {
      name: "John D. Alexon",
      role: "SANITIZATION EXPERT",
      image: "https://framerusercontent.com/images/71kz5iX4crWQYqbcukrbVWogYA.png?width=342&height=292",
    },
    {
      name: "Jak Farnandez",
      role: "FIELD SUPERVISOR",
      image: "https://framerusercontent.com/images/gRwXdPkLkyjS5JXnK04q3ttVLk.png?width=342&height=292",
    },
    {
      name: "David Watson",
      role: "DISINFECTION LEAD",
      image: "https://framerusercontent.com/images/P64qFbW7sjXKqLCWX5Fd9KuqA.png?width=347&height=292",
    },
  ];

  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100">
      <div className="container mx-auto">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          {/* Left Pill Badge */}
          <div>
            <span className="inline-block border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 bg-blue-50/50">
              OUR EXPERIENCED CLEANERS
            </span>
          </div>

          {/* Right Main Headline */}
          <div className="lg:text-right">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-tight">
              MEET OUR TRUSTED <br />
              <span className="text-[#007eff]">CLEANING</span> SPECIALISTS
            </h2>
          </div>
        </div>

        {/* 4 Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 relative z-10">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-[#f4f6f9] rounded-3xl p-4 border border-slate-200/80 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Image Container with Chamfered Top-Right Corner */}
              <div className="relative w-full h-[240px] rounded-[24px_48px_24px_24px] overflow-hidden mb-4 flex items-end justify-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  unoptimized
                  className="object-contain object-bottom transition-transform duration-500"
                />
              </div>

              {/* Name & Role */}
              <div className="px-2 pb-2">
                <h3 className="text-[#001837] font-extrabold text-lg mb-1">
                  {member.name}
                </h3>
                <span className="text-[#007eff] font-bold text-[11px] uppercase tracking-wider block">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Container - Uses the native Curved Cutout in the Image Asset */}
        <div className="mt-40 relative w-full overflow-visible min-h-[440px] md:min-h-[500px] flex items-center justify-end p-6 sm:p-10 md:p-12 mb-24">
          {/* Background Image Container - Image asset has built-in U-notch curve */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <Image
              src="https://framerusercontent.com/images/hykQu8sbeIwxfZ3UXUa3Ce7b47E.png?width=1880&height=750"
              alt="Professional Floor Cleaning Banner"
              fill
              unoptimized
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />
          </div>

          {/* Continuously Rotating Circular Badge positioned directly inside the image's built-in curve */}
          <div className="absolute -top-2 sm:-top-3 md:-top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex justify-center">
            <div className="w-40 h-40 rounded-full bg-[#007eff] text-white border-8 border-white shadow-xl flex items-center justify-center relative p-1">
              {/* 360-degree Rotating SVG Circular Text */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full animate-[spin_10s_linear_infinite] absolute inset-0"
              >
                <path
                  id="circlePath"
                  d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                  fill="none"
                />
                <text className="text-[9.2px] font-bold fill-white tracking-widest uppercase">
                  <textPath href="#circlePath" startOffset="0%">
                    • CLEANING • DEEP CLEAN • HOME CARE • SANITIZE
                  </textPath>
                </text>
              </svg>

              {/* Inner White Circle with Orange Compass Arrow Icon */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md relative z-10">
                <div className="w-6 h-6 rounded-md bg-[#ff5b00] flex items-center justify-center text-white rotate-45 shadow-xs">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-3.5 h-3.5 -rotate-45 stroke-[3]"
                  >
                    <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Floating Blue Action Card - Extends from Center (top-1/2) to Bottom (-bottom-16) */}
          <div className="relative lg:absolute lg:right-10 lg:top-1/2 lg:-bottom-16 z-20 w-full lg:max-w-md bg-[#007eff] rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-white/20 my-4 lg:my-0 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight mb-6">
                LET&apos;S MOVE YOUR CLEANING WITH PROFESSIONAL
              </h3>

              {/* Checklist */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div >
                    <Check className="w-5 h-5 text-white stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white">
                    RESIDENTIAL CLEANING SERVICES
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div >
                    <Check className="w-5 h-5 text-white stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white">
                    COMMERCIAL CLEANING SOLUTIONS
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div >
                    <Check className="w-5 h-5 text-white stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white">
                    ECO-FRIENDLY CLEANING PRODUCTS
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/#quote"
                className="bg-[#001837] hover:bg-[#0b2144] text-white font-bold text-xs uppercase tracking-wider pl-6 hover:pl-10 pr-2 py-2.5 rounded-full inline-flex items-center gap-4 transition-all duration-300 shadow-xl hover:scale-105"
              >
                <span>Get a Quote</span>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#001837]">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
