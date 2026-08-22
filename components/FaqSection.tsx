"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStoredHomeCMSData,
  defaultHomeCMSData,
  HomeCMSContent,
  FaqItem,
} from "@/lib/homeCMSData";

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | string | null>(1);
  const [cmsData, setCmsData] = useState<HomeCMSContent>(defaultHomeCMSData);

  useEffect(() => {
    const loaded = getStoredHomeCMSData();
    setCmsData(loaded);
    if (loaded.faqItems && loaded.faqItems.length > 0) {
      setOpenId(loaded.faqItems[0].id);
    }

    const handleUpdate = () => {
      const updated = getStoredHomeCMSData();
      setCmsData(updated);
    };

    window.addEventListener("cleanix_home_cms_updated", handleUpdate);
    return () => {
      window.removeEventListener("cleanix_home_cms_updated", handleUpdate);
    };
  }, []);

  const faqItemsList: FaqItem[] =
    cmsData.faqItems && cmsData.faqItems.length > 0
      ? cmsData.faqItems
      : defaultHomeCMSData.faqItems;

  const toggleFaq = (id: number | string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4 bg-white/60">
            {cmsData.faqBadge || "FAQ"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] tracking-tight uppercase">
            {cmsData.faqTitle || "CLEANING QUESTIONS ANSWERED"}
          </h2>
        </div>

        {/* Grid Layout: Left Accordions, Right Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: FAQ Accordion Container */}
          <div className="lg:col-span-6 bg-[#f3f5f8] rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200/60 flex flex-col gap-4">
            {faqItemsList.map((faq, idx) => {
              const isOpen = openId === faq.id;
              const formattedNumber = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={faq.id || idx}
                  onClick={() => toggleFaq(faq.id)}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-300 cursor-pointer ${
                    isOpen
                      ? "border-[#007eff] bg-blue-50/20"
                      : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[#001837] font-extrabold text-base sm:text-lg leading-snug">
                      {formattedNumber}. {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-8 h-8 rounded-full bg-[#007eff] text-white flex items-center justify-center flex-shrink-0"
                    >
                      {isOpen ? (
                        <X className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </motion.div>
                  </div>

                  {/* Framer Motion Smooth Expandable Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto", marginTop: 16 },
                          collapsed: { opacity: 0, height: 0, marginTop: 0 },
                        }}
                        transition={{
                          duration: 0.35,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-slate-100 text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column: Feature Image Card */}
          <div className="lg:col-span-6 relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border border-slate-200/80">
            <Image
              src={
                cmsData.faqImage ||
                "https://framerusercontent.com/images/UaZYgh11hZSeJVH37MEKUXPqJb0.png?width=708&height=450"
              }
              alt="Two Professional Cleaners at Work"
              fill
              priority
              unoptimized
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
