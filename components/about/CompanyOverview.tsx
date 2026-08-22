"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Truck, Users, Star } from "lucide-react";
import { getStoredAboutData, AboutContent } from "@/lib/aboutData";

export default function CompanyOverview() {
  const [data, setData] = useState<AboutContent>(getStoredAboutData());

  useEffect(() => {
    setData(getStoredAboutData());

    const handleUpdate = () => {
      setData(getStoredAboutData());
    };

    window.addEventListener("cleanix_about_updated", handleUpdate);
    return () => {
      window.removeEventListener("cleanix_about_updated", handleUpdate);
    };
  }, []);

  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100">
      <div className="container mx-auto max-w-7xl">
        {/* Top Grid: Left Image, Center Content, Right Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left Image */}
          <div className="lg:col-span-3 hidden lg:block relative w-full h-[360px] rounded-[48px_16px_48px_48px] overflow-hidden shadow-lg border border-slate-200">
            <Image
              src={data.overviewLeftImage || "/RESIDENTIAL-DEEP-CLEANING.png"}
              alt="Professional Cleaner"
              fill
              unoptimized
              className="object-cover object-center"
              sizes="25vw"
            />
          </div>

          {/* Center Content Area */}
          <div className="lg:col-span-6 text-center flex flex-col items-center">
            <div className="inline-flex items-center border border-[#007eff]/60 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-6 py-2 mb-6 bg-blue-50/50">
              {data.overviewBadge || "COMPANY OVERVIEW"}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] leading-[1.15] tracking-tight mb-6">
              {data.overviewTitle1 || "PROFESSIONAL CLEANING"} <br />
              <span className="text-[#007eff]">{data.overviewTitleHighlight || "SERVICE NETWORK"}</span>
            </h2>

            <div
              className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-medium"
              dangerouslySetInnerHTML={{ __html: data.overviewDesc }}
            />

            <Link
              href="/#quote"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-sm pl-7 pr-2 py-3 rounded-full inline-flex items-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.03]"
            >
              <span>Get Started Now</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#007eff]">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </Link>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-3 hidden lg:block relative w-full h-[360px] rounded-[16px_48px_48px_48px] overflow-hidden shadow-lg border border-slate-200">
            <Image
              src={data.overviewRightImage || "/COMMERCIAL-OFFICE-CLEANING.png"}
              alt="Professional Cleaner"
              fill
              unoptimized
              className="object-cover object-center"
              sizes="25vw"
            />
          </div>
        </div>

        {/* Bottom 3 Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#001837] rounded-3xl p-8 text-white shadow-xl flex items-center justify-between border border-white/10 group hover:border-[#007eff]/50 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#007eff]/15 text-[#007eff] flex items-center justify-center flex-shrink-0">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {data.stat1Count || "16K+"}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-medium mt-0.5">
                  {data.stat1Label || "Cleanings Completed"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#007eff] rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 flex items-center justify-between group hover:bg-[#0066ee] transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {data.stat2Count || "1,200+"}
                </h3>
                <p className="text-white/90 text-xs sm:text-sm font-medium mt-0.5">
                  {data.stat2Label || "Satisfied Clients"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#001837] rounded-3xl p-8 text-white shadow-xl flex items-center justify-between border border-white/10 group hover:border-[#007eff]/50 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#007eff]/15 text-[#007eff] flex items-center justify-center flex-shrink-0">
                <Star className="w-7 h-7 fill-[#007eff]" />
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {data.stat3Count || "4.9 / 5"}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-medium mt-0.5">
                  {data.stat3Label || "Average Client Rating"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
