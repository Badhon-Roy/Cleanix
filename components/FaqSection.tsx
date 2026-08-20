"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqList = [
  {
    id: 1,
    number: "01",
    question: "How long does cleaning take?",
    answer:
      "Cleaning time depends on property size, room condition, selected service, and add-ons. Our team confirms a realistic schedule before arrival and keeps the visit organized throughout.",
  },
  {
    id: 2,
    number: "02",
    question: "Do I need to provide supplies?",
    answer:
      "No, our team brings all professional cleaning supplies, eco-friendly solutions, and specialized equipment needed for the entire cleaning service.",
  },
  {
    id: 3,
    number: "03",
    question: "What types of spaces do you clean?",
    answer:
      "We clean residential homes, apartments, commercial offices, retail stores, post-construction sites, and move-in/move-out turnover properties.",
  },
  {
    id: 4,
    number: "04",
    question: "Can I book recurring cleaning?",
    answer:
      "Yes! We offer flexible weekly, bi-weekly, and monthly recurring cleaning schedules with customized plans and discounted rates.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4 bg-white/60">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] tracking-tight uppercase">
            CLEANING QUESTIONS ANSWERED
          </h2>
        </div>

        {/* Grid Layout: Left Accordions, Right Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: FAQ Accordion Container */}
          <div className="lg:col-span-6 bg-[#f3f5f8] rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200/60 flex flex-col gap-4">
            {faqList.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  onClick={() => toggleFaq(faq.id)}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-300 cursor-pointer shadow-xs ${
                    isOpen
                      ? "border-[#007eff]/50 shadow-md"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[#001837] font-extrabold text-base sm:text-lg leading-snug">
                      {faq.number}. {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-8 h-8 rounded-full bg-[#007eff] text-white flex items-center justify-center flex-shrink-0 shadow-xs"
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
          <div className="lg:col-span-6 relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-md border border-slate-100">
            <Image
              src="https://framerusercontent.com/images/UaZYgh11hZSeJVH37MEKUXPqJb0.png?width=708&height=450"
              alt="Two Professional Cleaners at Work"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
