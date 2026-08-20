"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Phone, ShieldCheck } from "lucide-react";

interface Props {
  currentSlug: string;
}

export default function ServiceDetailsSidebar({ currentSlug }: Props) {
  const allServicesList = [
    { name: "Residential Deep Cleaning", slug: "residential-deep-cleaning" },
    { name: "Commercial Office Cleaning", slug: "commercial-office-cleaning" },
    { name: "Post-Construction Cleaning", slug: "post-construction-cleaning" },
    { name: "Move-Out Cleaning", slug: "move-out-cleaning" },
  ];

  return (
    <aside className="w-full space-y-8">
      {/* Card 1: Explore Our Cleaning Services Menu (#f0f2f4 background) */}
      <div className="bg-[#f0f2f4] rounded-2xl overflow-hidden shadow-xs border border-slate-200/60">
        {/* Header */}
        <div className="bg-[#007eff] text-white px-6 py-4 text-center">
          <h3 className="font-extrabold text-base sm:text-lg text-white">
            Explore Our Cleaning Services
          </h3>
        </div>

        {/* Services List with Line Dividers & Upward-Right Blue Arrows */}
        <div className="divide-y divide-slate-200/80">
          {allServicesList.map((item) => {
            const isActive = item.slug === currentSlug;

            return (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className={`w-full px-6 py-4 font-bold text-sm sm:text-[15px] flex items-center justify-between transition-colors ${
                  isActive
                    ? "text-[#007eff] bg-blue-50/50"
                    : "text-slate-700 hover:text-[#007eff]"
                }`}
              >
                <span>{item.name}</span>
                <ArrowUpRight className="w-4.5 h-4.5 text-[#007eff] stroke-[2.5]" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Card 2: NEED A CUSTOM CLEANING PLAN? Banner */}
      <div className="bg-[#001837] text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-white/10 flex flex-col justify-between min-h-[360px]">
        {/* Subtle Background Glow */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#007eff]/25 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10">
          {/* Brand Tagline */}
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-[#007eff]" />
            <span className="font-black tracking-widest text-sm text-white uppercase">
              CLEANIX
            </span>
          </div>

          {/* Card Title */}
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight mb-4">
            NEED A CUSTOM CLEANING PLAN?
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal mb-8">
            Tell us about your space, schedule, and priorities. We&apos;ll recommend the right cleaning service and timing.
          </p>
        </div>

        {/* Contact CTA Phone Link */}
        <div className="relative z-10">
          <a
            href="tel:+8801774500815"
            className="w-full bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm uppercase tracking-wider py-3.5 px-6 rounded-2xl inline-flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(0,126,255,0.4)] hover:scale-[1.02]"
          >
            <Phone className="w-4 h-4 stroke-[3]" />
            <span>+88 01774500815</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
