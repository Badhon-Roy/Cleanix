"use client";

import React from "react";
import Image from "next/image";
import { Check, ShieldCheck, Users, CalendarCheck, Headset } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-[#f4f6f9] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="max-w-3xl mb-10 md:mb-14">
          {/* Badge Pill */}
          <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4 bg-white/60">
            WHY CHOOSE US
          </span>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase">
            PROFESSIONAL <span className="text-[#007eff]">CLEANING</span> YOU
            CAN TRUST EVERY DAY
          </h2>
        </div>

        {/* Main Content Grid (Left 2x2 Feature Cards, Right Arch Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: 2x2 Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#007eff] flex items-center justify-center text-white mb-4 shadow-md shadow-blue-500/20">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-[#001837] font-extrabold text-lg md:text-xl leading-snug mb-4">
                  Verified Professional Cleaners
                </h3>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    NID ও পুলিশ ব্যাকগ্রাউন্ড ভেরিফাইড
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    আন্তর্জাতিক স্ট্যান্ডার্ড ট্রেনিংপ্রাপ্ত
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#007eff] flex items-center justify-center text-white mb-4 shadow-md shadow-blue-500/20">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-[#001837] font-extrabold text-lg md:text-xl leading-snug mb-4">
                  Safe &amp; Eco-Friendly Solutions
                </h3>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    শিশু ও পোষা প্রাণীর জন্য শতভাগ নিরাপদ
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                  <span className="text-[#001837] font-medium text-xs sm:text-sm">
                    অ্যান্টি-ব্যাকটেরিয়াল কেমিক্যাল স্যানিটাইজ
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#007eff] flex items-center justify-center text-white mb-4 shadow-md shadow-blue-500/20">
                  <CalendarCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-[#001837] font-extrabold text-lg md:text-xl leading-snug mb-4">
                  Flexible Subscriptions &amp; Slots
                </h3>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    মাসিক প্যাকেজ ও ইনস্ট্যান্ট এককালীন বুকিং
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    আপনার সময় অনুযায়ী স্লট সিলেক্টর
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#007eff] flex items-center justify-center text-white mb-4 shadow-md shadow-blue-500/20">
                  <Headset className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-[#001837] font-extrabold text-lg md:text-xl leading-snug mb-4">
                  24/7 Dedicated Support
                </h3>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    হটলাইন, হোয়াটসঅ্যাপ ও চ্যাট সাপোর্ট
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#007eff] stroke-[3] flex-shrink-0" />
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    ১০০% সার্ভিস স্যাটিস্ফেকশন গ্যারান্টি
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Scalloped Arch Image - Preserving Full Top Arch Curve */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="relative w-full max-w-[460px] h-[540px] sm:h-[620px] flex items-center justify-center">
              <Image
                src="/why-choose-cleaner.png"
                alt="Professional Masked Cleaner"
                fill
                priority
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
