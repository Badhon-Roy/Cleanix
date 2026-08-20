"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

export function AsteriskIcon() {
  return (
    <div className="w-8 h-8 text-[#007eff] flex items-center justify-center mb-4">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
      </svg>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="w-full bg-[#F0F2F4] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Top Header Row with Cleaning Bucket */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl text-left">
            {/* Badge Pill */}
            <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4 bg-white/60">
              PRICING
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase">
              FLEXIBLE PRICING PLANS CLEANING SERVICES
            </h2>
          </div>

          {/* Cleaning Bucket Asset */}
          <div className="relative w-full max-w-[240px] sm:max-w-[280px] h-[200px] sm:h-[240px] flex-shrink-0">
            <Image
              src="/cleaning-bucket.png"
              alt="Cleaning Bucket with Supplies"
              fill
              priority
              className="object-contain object-right-bottom drop-shadow-lg"
              sizes="280px"
            />
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: BASIC */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xs flex flex-col justify-between relative hover:shadow-md transition-shadow">
            <div>
              <AsteriskIcon />
              <h3 className="text-[#001837] font-extrabold text-2xl tracking-wide uppercase mb-1">
                BASIC
              </h3>
              <p className="text-slate-500 font-medium text-xs sm:text-sm mb-6">
                ছোট বাসা ও ২ বেডরুমের জন্য উপযোগী
              </p>

              {/* Price */}
              <div className="flex items-baseline mb-6">
                <span className="text-3xl sm:text-4xl font-black text-[#001837] tracking-tight">
                  ৳১৪,০০০
                </span>
                <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                  / মাস
                </span>
              </div>

              {/* Select Plan Button */}
              <Link
                href="#select-basic"
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm sm:text-base py-3 px-6 rounded-full w-full flex items-center justify-between shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] mb-8"
              >
                <span>Select Plan</span>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </Link>

              {/* Feature Checklist */}
              <div className="space-y-3.5 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    মাসে ২ বার রুটিন হোম ক্লিনিং
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    রান্নাঘর ও বাথরুম ডিপ রিফ্রেশ
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    মেঝে মোছা, ভ্যাকুয়াম ও ডাস্টিং
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    ইমেইল ও টিকেট সাপোর্ট
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    লাইভ সার্ভিস ট্র্যাকিং নোটিফিকেশন
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: STANDARD (POPULAR) */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border-2 border-[#007eff]/80 shadow-md flex flex-col justify-between relative hover:shadow-lg transition-shadow">
            {/* Popular Badge */}
            <span className="bg-[#007eff] text-white font-bold text-[10px] uppercase tracking-wider rounded-full px-4 py-1.5 absolute top-7 right-7 shadow-sm">
              POPULAR
            </span>

            <div>
              <AsteriskIcon />
              <h3 className="text-[#001837] font-extrabold text-2xl tracking-wide uppercase mb-1">
                STANDARD
              </h3>
              <p className="text-slate-500 font-medium text-xs sm:text-sm mb-6">
                মাঝারি পরিবার ও মিডিয়াম অফিসের জন্য
              </p>

              {/* Price */}
              <div className="flex items-baseline mb-6">
                <span className="text-3xl sm:text-4xl font-black text-[#001837] tracking-tight">
                  ৳৩০,০০০
                </span>
                <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                  / মাস
                </span>
              </div>

              {/* Select Plan Button */}
              <Link
                href="#select-standard"
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm sm:text-base py-3 px-6 rounded-full w-full flex items-center justify-between shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] mb-8"
              >
                <span>Select Plan</span>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </Link>

              {/* Feature Checklist */}
              <div className="space-y-3.5 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    মাসে ৪ বার (সাপ্তাহিক ১ বার) ডিপ ক্লিন
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজেশন
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    সোফা, কার্পেট ও মেট্রেস ভ্যাকুয়াম
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    ইন্টেরিয়র গ্লাস ও উইন্ডো স্যানিটাইজ
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    ২৪/৭ ডেডিকেটেড ফোন ও চ্যাট সাপোর্ট
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: PREMIUM */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xs flex flex-col justify-between relative hover:shadow-md transition-shadow">
            <div>
              <AsteriskIcon />
              <h3 className="text-[#001837] font-extrabold text-2xl tracking-wide uppercase mb-1">
                PREMIUM
              </h3>
              <p className="text-slate-500 font-medium text-xs sm:text-sm mb-6">
                করপোরেট অফিস ও ডুপ্লেক্স কমার্শিয়াল স্পেস
              </p>

              {/* Price */}
              <div className="flex items-baseline mb-6">
                <span className="text-3xl sm:text-4xl font-black text-[#001837] tracking-tight">
                  ৳৫০,০০০
                </span>
                <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                  / মাস
                </span>
              </div>

              {/* Select Plan Button */}
              <Link
                href="#select-premium"
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-semibold text-sm sm:text-base py-3 px-6 rounded-full w-full flex items-center justify-between shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] mb-8"
              >
                <span>Select Plan</span>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </Link>

              {/* Feature Checklist */}
              <div className="space-y-3.5 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    মাসে ৮ বার (সাপ্তাহিক ২ বার) মাস্টার ক্লিন
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    হসপিটাল-গ্রেড স্টীম স্যানিটাইজেশন
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    ওভেন, ফ্রিজ ও চিমনি ডিপ কেয়ার
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    ফার্নিচার পোলিশ ও ফ্লোর শাইন
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                  <span className="text-[#001837] font-bold text-xs sm:text-sm">
                    ডেডিকেটেড VIP কনসিয়ার্জ ও লাইভ জিপিএস
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
