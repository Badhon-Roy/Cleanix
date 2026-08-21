"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

export function PricingStarIcon() {
  return (
    <div className="w-8 h-8 text-[#007eff] flex items-center justify-center mb-4">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
      </svg>
    </div>
  );
}

export interface PricingPlan {
  id: "BASIC" | "STANDARD" | "PREMIUM";
  name: string;
  subtitleBn: string;
  price: string;
  pricePeriodBn: string;
  popular?: boolean;
  popularLabel?: string;
  vipBadge?: string;
  ctaText: string;
  ctaHref?: string;
  features: string[];
}

export const defaultPricingPlans: PricingPlan[] = [
  {
    id: "BASIC",
    name: "BASIC",
    subtitleBn: "ছোট বাসা বা ছোট স্টার্টআপ অফিস",
    price: "৳6,000",
    pricePeriodBn: "/ মাস (Monthly)",
    ctaText: "Select Plan",
    ctaHref: "/contact",
    features: [
      "মাসে ২ বার রুটিন হোম ক্লিনিং",
      "ফ্লোর মোছা, ভ্যাকুয়াম ও ডাস্টিং",
      "রান্নাঘর ও বাথরুম ডিপ রিফ্রেশ",
      "অনলাইন সাপোর্ট ও ইনভয়েস",
      "রিয়েল-টাইম ট্র্যাকিং অ্যালার্ট",
    ],
  },
  {
    id: "STANDARD",
    name: "STANDARD",
    subtitleBn: "মাঝারি পরিবার ও কমার্শিয়াল শোরুমের পছন্দ",
    price: "৳14,000",
    pricePeriodBn: "/ মাস (Monthly)",
    popular: true,
    popularLabel: "★ MOST POPULAR",
    ctaText: "Select Standard Plan",
    ctaHref: "/contact",
    features: [
      "মাসে ৪ বার (সাপ্তাহিক ১ বার) ডিপ ক্লিন",
      "অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজেশন",
      "সোফা, কার্পেট ও মেট্রেস ড্রায়ার",
      "গ্লাস ও উইন্ডো স্যানিটাইজিং",
      "২৪/৭ ডেডিকেটেড ফোন ও চ্যাট",
    ],
  },
  {
    id: "PREMIUM",
    name: "PREMIUM",
    subtitleBn: "বড় কর্পোরেট অফিস ও ডুপ্লেক্স ভিলা",
    price: "৳30,000",
    pricePeriodBn: "/ মাস (Monthly)",
    vipBadge: "VIP CARE",
    ctaText: "Select Plan",
    ctaHref: "/contact",
    features: [
      "মাসে ৮ বার মাস্টার ক্লিনিং",
      "হসপিটাল-গ্রেড স্টিম স্যানিটাইজ",
      "ওভেন, ফ্রিজ ও কিচেন চিমনি কেয়ার",
      "ভিআইপি কনসিয়ার্জ ও লাইভ জিপিএস",
      "সাপ্তাহিক কোয়ালিটি রিপোর্ট",
    ],
  },
];

interface PricingCardsGridProps {
  currentPlanId?: string;
  onSelectPlan?: (planId: string) => void;
  showCurrentPlanBadge?: boolean;
}

export default function PricingCardsGrid({
  currentPlanId,
  onSelectPlan,
  showCurrentPlanBadge = false,
}: PricingCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {defaultPricingPlans.map((plan) => {
        const isCurrentPlan = currentPlanId === plan.id;
        const isPopular = plan.popular;

        return (
          <div
            key={plan.id}
            className={`rounded-3xl p-7 sm:p-9 bg-white flex flex-col justify-between relative transition-all duration-300 ${isPopular
                ? "border-2 border-[#007eff] md:-translate-y-2 z-10"
                : "border border-slate-200/90"
              }`}
          >
            {/* Top Badges */}
            {isPopular && (
              <span className="bg-[#007eff] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full px-4 py-1.5 absolute -top-3.5 right-7 border border-blue-400">
                {plan.popularLabel || "★ MOST POPULAR"}
              </span>
            )}

            {plan.vipBadge && !isPopular && (
              <span className="border border-purple-500/60 text-purple-600 font-bold text-[10px] uppercase tracking-wider rounded-full px-4 py-1 absolute top-7 right-7 bg-purple-50">
                {plan.vipBadge}
              </span>
            )}

            {showCurrentPlanBadge && isCurrentPlan && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 font-extrabold text-[11px] uppercase tracking-wider rounded-full px-4 py-1 absolute top-7 right-7">
                ✓ YOUR ACTIVE PLAN
              </span>
            )}

            <div>
              <PricingStarIcon />

              <h3 className="text-[#001837] font-black text-2xl tracking-wide uppercase mb-1">
                {plan.name}
              </h3>

              <p
                className={`font-extrabold text-xs sm:text-sm mb-6 ${isPopular ? "text-[#007eff]" : "text-slate-500"
                  }`}
              >
                {plan.subtitleBn}
              </p>

              {/* Price */}
              <div className="flex items-baseline mb-6">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#001837] tracking-tight">
                  {plan.price}
                </span>
                <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                  {plan.pricePeriodBn}
                </span>
              </div>

              {/* Select Plan Action Button */}
              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-3.5 px-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-sm text-center mb-8 cursor-default flex items-center justify-center gap-2"
                >
                  <span>✓ Currently Active Plan</span>
                </button>
              ) : onSelectPlan ? (
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`font-semibold text-sm sm:text-base py-3.5 px-6 rounded-full w-full flex items-center justify-between transition-all duration-300 hover:scale-[1.02] mb-8 cursor-pointer ${plan.id === "PREMIUM"
                      ? "bg-[#001837] hover:bg-[#0d274c] text-white border border-slate-800"
                      : "bg-[#007eff] hover:bg-[#0066ee] text-white border border-blue-400"
                    }`}
                >
                  <span>{plan.ctaText}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${plan.id === "PREMIUM"
                        ? "bg-[#007eff] text-white"
                        : "bg-white text-[#007eff]"
                      }`}
                  >
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </button>
              ) : (
                <Link
                  href={plan.ctaHref || "/contact"}
                  className={`font-semibold text-sm sm:text-base py-3.5 px-6 rounded-full w-full flex items-center justify-between transition-all duration-300 hover:scale-[1.02] mb-8 cursor-pointer ${plan.id === "PREMIUM"
                      ? "bg-[#001837] hover:bg-[#0d274c] text-white border border-slate-800"
                      : "bg-[#007eff] hover:bg-[#0066ee] text-white border border-blue-400"
                    }`}
                >
                  <span>{plan.ctaText}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${plan.id === "PREMIUM"
                        ? "bg-[#007eff] text-white"
                        : "bg-white text-[#007eff]"
                      }`}
                  >
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </Link>
              )}

              {/* Feature Checklist in Bengali */}
              <div className="space-y-3.5 border-t border-slate-100 pt-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
