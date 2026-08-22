"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Check, ShieldCheck, Users, CalendarCheck, Headset } from "lucide-react";
import {
  getStoredHomeCMSData,
  defaultHomeCMSData,
  HomeCMSContent,
} from "@/lib/homeCMSData";

export default function WhyChooseUs() {
  const [data, setData] = useState<HomeCMSContent>(defaultHomeCMSData);

  useEffect(() => {
    setData(getStoredHomeCMSData());

    const handleUpdate = () => {
      setData(getStoredHomeCMSData());
    };

    window.addEventListener("cleanix_home_cms_updated", handleUpdate);
    return () => {
      window.removeEventListener("cleanix_home_cms_updated", handleUpdate);
    };
  }, []);

  const card1Checks = data.whyUsCard1Checks && data.whyUsCard1Checks.length > 0
    ? data.whyUsCard1Checks
    : defaultHomeCMSData.whyUsCard1Checks;

  const card2Checks = data.whyUsCard2Checks && data.whyUsCard2Checks.length > 0
    ? data.whyUsCard2Checks
    : defaultHomeCMSData.whyUsCard2Checks;

  const card3Checks = data.whyUsCard3Checks && data.whyUsCard3Checks.length > 0
    ? data.whyUsCard3Checks
    : defaultHomeCMSData.whyUsCard3Checks;

  const card4Checks = data.whyUsCard4Checks && data.whyUsCard4Checks.length > 0
    ? data.whyUsCard4Checks
    : defaultHomeCMSData.whyUsCard4Checks;

  return (
    <section className="w-full bg-[#f4f6f9] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="max-w-3xl mb-10 md:mb-14">
          {/* Badge Pill */}
          <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4 bg-white/60">
            {data.whyUsBadge || "WHY CHOOSE US"}
          </span>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase">
            {data.whyUsTitleLine1}{" "}
            {data.whyUsTitleHighlight && (
              <span className="text-[#007eff]">{data.whyUsTitleHighlight}</span>
            )}{" "}
            {data.whyUsTitleLine2}
          </h2>
        </div>

        {/* Main Content Grid (Left 2x2 Feature Cards, Right Arch Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: 2x2 Feature Cards with Equal Height (items-stretch) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6 items-stretch">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-start h-full">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#007eff] flex items-center justify-center text-white mb-4">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-[#001837] font-extrabold text-lg md:text-xl leading-snug mb-4">
                  {data.whyUsCard1Title || "Verified Professional Cleaners"}
                </h3>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                {card1Checks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                    <span className="text-slate-600 font-medium text-xs sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-start h-full">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#007eff] flex items-center justify-center text-white mb-4">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-[#001837] font-extrabold text-lg md:text-xl leading-snug mb-4">
                  {data.whyUsCard2Title || "Safe & Eco-Friendly Solutions"}
                </h3>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                {card2Checks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                    <span className="text-slate-600 font-medium text-xs sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-start h-full">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#007eff] flex items-center justify-center text-white mb-4">
                  <CalendarCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-[#001837] font-extrabold text-lg md:text-xl leading-snug mb-4">
                  {data.whyUsCard3Title || "Flexible Subscriptions & Slots"}
                </h3>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                {card3Checks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                    <span className="text-slate-600 font-medium text-xs sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-start h-full">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#007eff] flex items-center justify-center text-white mb-4">
                  <Headset className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-[#001837] font-extrabold text-lg md:text-xl leading-snug mb-4">
                  {data.whyUsCard4Title || "24/7 Dedicated Support"}
                </h3>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                {card4Checks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                    <span className="text-slate-600 font-medium text-xs sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Scalloped Arch Image - Preserving Full Top Arch Curve */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="relative w-full max-w-[460px] h-[540px] sm:h-[620px] flex items-center justify-center">
              <Image
                src={data.whyUsCleanerImage || "/why-choose-cleaner.png"}
                alt="Professional Masked Cleaner"
                fill
                priority
                unoptimized
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
