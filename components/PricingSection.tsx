"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Sparkle } from "lucide-react";

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
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Badge, Title & Cleaning Bucket Asset */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <div>
              {/* Badge Pill */}
              <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4 bg-white/60">
                PRICING
              </span>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase mb-8">
                FLEXIBLE PRICING PLANS CLEANING SERVICES
              </h2>
            </div>

            {/* Cleaning Bucket Asset */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[260px] sm:h-[300px] mt-4">
              <Image
                src="/cleaning-bucket.png"
                alt="Cleaning Bucket with Supplies"
                fill
                priority
                className="object-contain object-left-bottom drop-shadow-lg"
                sizes="320px"
              />
            </div>
          </div>

          {/* Right Column: 2 Pricing Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: BASIC */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              <div>
                <AsteriskIcon />
                <h3 className="text-[#001837] font-extrabold text-2xl tracking-wide uppercase mb-1">
                  BASIC
                </h3>
                <p className="text-slate-500 font-medium text-xs sm:text-sm mb-6">
                  ছোট বাসা বা ছোট স্টার্টআপ অফিস
                </p>

                {/* Price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-[#001837] tracking-tight">
                    ৳6,000
                  </span>
                  <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                    / মাস (Monthly)
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
                      ফ্লোর মোছা, ভ্যাকুয়াম ও ডাস্টিং
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
                      অনলাইন সাপোর্ট ও ইনভয়েস
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      রিয়েল-টাইম ট্র্যাকিং অ্যালার্ট
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: STANDARD (POPULAR - HIGHLIGHTED) */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 border-2 border-[#007eff] shadow-2xl shadow-blue-500/20 md:-translate-y-3 flex flex-col justify-between relative z-10">
              {/* Popular Badge */}
              <span className="bg-[#007eff] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full px-4 py-1.5 absolute -top-3.5 right-7 shadow-lg shadow-blue-500/30">
                ★ MOST POPULAR
              </span>

              <div>
                <AsteriskIcon />
                <h3 className="text-[#001837] font-extrabold text-2xl tracking-wide uppercase mb-1">
                  STANDARD
                </h3>
                <p className="text-[#007eff] font-bold text-xs sm:text-sm mb-6">
                  মাঝারি পরিবার ও কমার্শিয়াল শোরুমের পছন্দ
                </p>

                {/* Price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-[#001837] tracking-tight">
                    ৳14,000
                  </span>
                  <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                    / মাস (Monthly)
                  </span>
                </div>

                {/* Select Plan Button */}
                <Link
                  href="#select-standard"
                  className="bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-full w-full flex items-center justify-between shadow-xl shadow-blue-500/35 transition-all duration-300 hover:scale-[1.03] mb-8"
                >
                  <span>Select Standard Plan</span>
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
                      সোফা, কার্পেট ও মেট্রেস ড্রায়ার
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      গ্লাস ও উইন্ডো স্যানিটাইজিং
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      ২৪/৭ ডেডিকেটেড ফোন ও চ্যাট
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: PREMIUM */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              {/* Premium VIP Badge */}
              <span className="border border-purple-500/60 text-purple-600 font-bold text-[10px] uppercase tracking-wider rounded-full px-4 py-1 absolute top-7 right-7 bg-purple-50">
                VIP CARE
              </span>

              <div>
                <AsteriskIcon />
                <h3 className="text-[#001837] font-extrabold text-2xl tracking-wide uppercase mb-1">
                  PREMIUM
                </h3>
                <p className="text-slate-500 font-medium text-xs sm:text-sm mb-6">
                  বড় কর্পোরেট অফিস ও ডুপ্লেক্স ভিলা
                </p>

                {/* Price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-[#001837] tracking-tight">
                    ৳30,000
                  </span>
                  <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                    / মাস (Monthly)
                  </span>
                </div>

                {/* Select Plan Button */}
                <Link
                  href="#select-premium"
                  className="bg-[#001837] hover:bg-[#0d274c] text-white font-semibold text-sm sm:text-base py-3 px-6 rounded-full w-full flex items-center justify-between shadow-lg transition-all duration-300 hover:scale-[1.02] mb-8"
                >
                  <span>Select Plan</span>
                  <div className="w-7 h-7 rounded-full bg-[#007eff] flex items-center justify-center text-white shadow-sm">
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </Link>

                {/* Feature Checklist */}
                <div className="space-y-3.5 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      মাসে ৮ বার মাস্টার ক্লিনিং
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      হসপিটাল-গ্রেড স্টিম স্যানিটাইজ
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      ওভেন, ফ্রিজ ও কিচেন চিমনি কেয়ার
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      ভিআইপি কনসিয়ার্জ ও লাইভ জিপিএস
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      সাপ্তাহিক কোয়ালিটি রিপোর্ট
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
