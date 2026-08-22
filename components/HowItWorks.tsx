"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  getStoredServicesCMSData,
  defaultServicesCMSData,
  ServicesCMSContent,
} from "@/lib/servicesCMSData";

export default function HowItWorks() {
  const [data, setData] = useState<ServicesCMSContent>(defaultServicesCMSData);

  useEffect(() => {
    setData(getStoredServicesCMSData());

    const handleUpdate = () => {
      setData(getStoredServicesCMSData());
    };

    window.addEventListener("cleanix_services_cms_updated", handleUpdate);
    return () => {
      window.removeEventListener("cleanix_services_cms_updated", handleUpdate);
    };
  }, []);

  const stepsList = data.howItWorksSteps || defaultServicesCMSData.howItWorksSteps;

  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 mb-12 md:mb-16">
          {/* Badge & Headline (Left) */}
          <div className="max-w-2xl">
            <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4">
              {data.howItWorksBadge || "HOW IT WORKS"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase">
              {data.howItWorksTitle}{" "}
              {data.howItWorksHighlight && (
                <span className="text-[#007eff]">{data.howItWorksHighlight}</span>
              )}
            </h2>
          </div>

          {/* Subtitle Description (Right) */}
          {data.howItWorksRightDesc && (
            <div className="lg:max-w-md">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {data.howItWorksRightDesc}
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8">
          {stepsList.map((item, index) => (
            <div key={item.id || index} className="flex flex-col group">
              {/* Top Image Card */}
              <div className="relative w-full h-[240px] sm:h-[270px] overflow-hidden rounded-t-2xl bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  unoptimized
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
