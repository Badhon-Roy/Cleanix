"use client";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Star } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12">
      <div className="container mx-auto">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 mb-10 md:mb-14">
          {/* Badge Pill (Left) */}
          <div className="flex-shrink-0">
            <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2">
              ABOUT OUR COMPANY
            </span>
          </div>

          {/* Header Title (Right) */}
          <div className="lg:max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase">
              DELIVERING RELIABLE{" "}
              <span className="text-[#007eff]">CLEANING</span> SOLUTIONS WITH
              PROFESSIONAL CARE &amp; LASTING{" "}
              <span className="text-[#007eff]">QUALITY</span>
            </h2>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full border-b border-slate-200/90 mb-12 md:mb-16" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Feature Image with Scalloped Top Shape */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            {/* SVG Clip Path Definition for Scalloped Arch Top */}
            <svg className="absolute w-0 h-0 pointer-events-none">
              <defs>
                <clipPath
                  id="scalloped-card-clip"
                  clipPathUnits="objectBoundingClientRect"
                >
                  <path d="M 0,0.18 C 0,0.15 0.05,0.15 0.08,0.15 C 0.16,0.15 0.18,0 0.32,0 L 0.68,0 C 0.82,0 0.84,0.15 0.92,0.15 C 0.95,0.15 1,0.15 1,0.18 L 1,0.94 C 1,0.97 0.97,1 0.94,1 L 0.06,1 C 0.03,1 0,0.97 0,0.94 Z" />
                </clipPath>
              </defs>
            </svg>

            <div className="relative w-full max-w-[480px] h-[520px] sm:h-[580px] flex items-end justify-center">
              <Image
                src="/about-cleaner.png"
                alt="Professional Cleaning Specialist"
                fill
                priority
                className="object-contain object-bottom pt-2 px-1"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>

          {/* Right Column: Stats, Description & Features */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top 2 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {/* Card 1: Experience */}
              <div className="bg-[#f1f5f9] rounded-2xl p-6 sm:p-7 flex flex-col justify-center border border-slate-100/80">
                <span className="text-4xl sm:text-5xl font-black text-[#007eff] mb-2 leading-none">
                  10+
                </span>
                <p className="text-[#001837] font-bold text-base sm:text-lg leading-snug">
                  Years of Cleaning
                  <br />
                  Experience
                </p>
              </div>

              {/* Card 2: Happy Clients & Rating */}
              <div className="bg-[#f1f5f9] rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-slate-100/80 gap-4">
                {/* Avatars + Count */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-slate-300 relative overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-slate-300 relative overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-slate-300 relative overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-[#001837] font-extrabold text-sm sm:text-base leading-tight">
                    1,250+ Happy
                    <br />
                    Clients
                  </span>
                </div>

                {/* Google Rating */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-5 h-5 flex items-center justify-center font-black text-lg text-[#4285F4]">
                    G
                  </div>
                  <span className="font-extrabold text-[#007eff] text-base">
                    4.8/5.0
                  </span>
                  <div className="flex items-center gap-0.5 text-[#007eff]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#007eff]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Who We Are Subheading */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#001837] mb-4">
              Who We Are ?
            </h3>

            {/* Paragraph Descriptions */}
            <div className="space-y-4 text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-8">
              <p>
                We provide dependable residential and commercial cleaning
                services designed to keep every space fresh, hygienic, and
                professionally maintained. Our trained cleaners use proven
                techniques and quality products to deliver consistent results
                you can trust.
              </p>
              <p>
                We deliver dependable cleaning services that create healthier,
                fresher, and more welcoming spaces for homes and businesses.
                With experienced professionals, modern equipment, and
                eco-friendly cleaning solutions, we ensure every project is
                completed with exceptional care and consistent quality.
              </p>
            </div>

            {/* Key Features Checkmarks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                <span className="text-[#001837] font-bold text-xs sm:text-sm tracking-wide uppercase">
                  98% ON-TIME ARRIVAL RATE
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                <span className="text-[#001837] font-bold text-xs sm:text-sm tracking-wide uppercase">
                  500+ SATISFIED CLIENTS
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                <span className="text-[#001837] font-bold text-xs sm:text-sm tracking-wide uppercase">
                  99% CUSTOMER SATISFACTION
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                <span className="text-[#001837] font-bold text-xs sm:text-sm tracking-wide uppercase">
                  20+ EXPERIENCED CLEANER
                </span>
              </div>
            </div>

            {/* CTA Get in Touch Button */}
            <div>
              <Link
                href="#contact"
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm pl-6 pr-1.5 py-1.5 rounded-full inline-flex items-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.03]"
              >
                <span>Get in Touch</span>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
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
