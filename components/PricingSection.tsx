"use client";

import Image from "next/image";
import PricingCardsGrid from "@/components/PricingCardsGrid";

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

          {/* Right Column: Reusable 3 Pricing Cards Grid */}
          <div className="lg:col-span-8">
            <PricingCardsGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
