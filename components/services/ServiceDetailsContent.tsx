"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Plus,
  Minus,
  Sparkles,
  Utensils,
  Clock,
  Building2,
  ShieldCheck,
  Calendar,
  Wrench,
  Home,
} from "lucide-react";
import { ServiceDetail } from "@/lib/servicesData";
import ServiceReviewsSection from "./ServiceReviewsSection";
import { ReviewItem } from "@/services/reviewService";

interface Props {
  service: ServiceDetail;
  initialReviews?: ReviewItem[];
}

export default function ServiceDetailsContent({ service, initialReviews }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Icon Resolver
  const getOfferIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-[#007eff]" />;
      case "Utensils":
        return <Utensils className="w-5 h-5 text-[#007eff]" />;
      case "Clock":
        return <Clock className="w-5 h-5 text-[#007eff]" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-[#007eff]" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-[#007eff]" />;
      case "Calendar":
        return <Calendar className="w-5 h-5 text-[#007eff]" />;
      case "Wrench":
        return <Wrench className="w-5 h-5 text-[#007eff]" />;
      case "Home":
        return <Home className="w-5 h-5 text-[#007eff]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#007eff]" />;
    }
  };

  // Why Choose Icon Resolver
  const getWhyChooseIcon = (title: string, index: number) => {
    const t = title.toLowerCase();
    if (t.includes("nid") || t.includes("staff") || t.includes("verified")) {
      return <ShieldCheck className="w-5 h-5 stroke-[2.5]" />;
    }
    if (t.includes("eco") || t.includes("chemical") || t.includes("safe")) {
      return <Sparkles className="w-5 h-5 stroke-[2.5]" />;
    }
    if (t.includes("time") || t.includes("tracking") || t.includes("schedule")) {
      return <Clock className="w-5 h-5 stroke-[2.5]" />;
    }
    if (t.includes("invoice") || t.includes("payment") || t.includes("digital")) {
      return <Check className="w-5 h-5 stroke-[2.5]" />;
    }
    const icons = [
      <ShieldCheck key="1" className="w-5 h-5 stroke-[2.5]" />,
      <Sparkles key="2" className="w-5 h-5 stroke-[2.5]" />,
      <Clock key="3" className="w-5 h-5 stroke-[2.5]" />,
      <Check key="4" className="w-5 h-5 stroke-[2.5]" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <article className="w-full space-y-12 text-[#001837]">
      {/* 1. Large Hero Featured Image */}
      <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100">
        <Image
          src={service.heroImage}
          alt={service.title}
          fill
          unoptimized
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {/* 2. Introductory Text */}
      <div className="space-y-4 text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
        <p>{service.introParagraph1}</p>
        <p>{service.introParagraph2}</p>
      </div>

      {/* 3. WHAT WE OFFER Section */}
      <div className="pt-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#001837] tracking-tight mb-4">
          {service.offersTitle}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
          {service.offersDesc}
        </p>

        {/* 3 Feature Offer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {service.offers.map((offer, i) => (
            <div
              key={i}
              className="bg-[#f4f6f9] rounded-2xl p-6 border border-slate-200/80 hover:border-[#007eff]/40 transition-all duration-300 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center mb-4">
                  {getOfferIcon(offer.iconName)}
                </div>
                <h3 className="text-base font-extrabold text-[#001837] mb-2 leading-tight">
                  {offer.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {offer.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. WHY CHOOSE OUR SERVICE Container (Sleek Flat Professional Design - No Shadows) */}
      <div className="bg-[#f8fafc] rounded-3xl p-6 sm:p-10 border border-slate-200/80 relative overflow-hidden">
        {/* Subtitle Badge Pill */}
        <div className="inline-flex items-center gap-2 border border-[#007eff]/30 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-4 py-1.5 mb-4 bg-blue-50/70">
          <Sparkles className="w-3.5 h-3.5 text-[#007eff]" />
          <span>WHY CHOOSE CLEANIX</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#001837] tracking-tight leading-tight mb-3">
          {service.whyChooseTitle}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl font-medium">
          {service.whyChooseDesc}
        </p>

        {/* 2x2 Clean Flat Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {service.whyChoosePoints.map((pt, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-[#007eff] hover:bg-blue-50/20 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007eff] border border-blue-100/80 flex items-center justify-center flex-shrink-0 group-hover:bg-[#007eff] group-hover:text-white transition-colors duration-200">
                    {getWhyChooseIcon(pt.title, i)}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#001837] leading-snug group-hover:text-[#007eff] transition-colors">
                    {pt.title}
                  </h3>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Secondary Content Gallery Image */}
      <div className="relative w-full h-[280px] sm:h-[360px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100">
        <Image
          src={service.contentImage}
          alt={`${service.title} Gallery`}
          fill
          unoptimized
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {/* 6. FREQUENTLY ASKED QUESTIONS Accordion */}
      <div className="pt-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#001837] tracking-tight mb-8">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="space-y-4">
          {service.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                className="bg-[#f4f6f9] rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#001837] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#007eff] font-black">
                      {faq.num}_
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      isOpen
                        ? "bg-[#007eff] text-white rotate-0"
                        : "bg-white text-[#007eff] border border-slate-200"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[3]" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-200/60 pt-4 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. VERIFIED CUSTOMER REVIEWS SECTION */}
      <ServiceReviewsSection
        serviceSlug={service.slug}
        serviceTitle={service.title}
        initialReviews={initialReviews}
      />
    </article>
  );
}
