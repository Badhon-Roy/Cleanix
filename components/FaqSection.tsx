"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqList = [
  {
    id: 1,
    number: "01",
    question: "ক্লিনিং সার্ভিস সম্পন্ন করতে কত সময় লাগে?",
    answer:
      "সম্পত্তির স্কয়ার ফিট (SqFt) ও রুমের ওপর ভিত্তি করে সাধারণত ৩ থেকে ৬ ঘণ্টা সময় লাগে। ক্লিনার টিম পৌঁছানোর আগেই আপনাকে নিখুঁত টাইমলাইন জানিয়ে দেওয়া হবে।",
  },
  {
    id: 2,
    number: "02",
    question: "আমাকে কি পরিষ্কারের কোনো সরঞ্জাম বা কেমিক্যাল দিতে হবে?",
    answer:
      "একদমই না! আমাদের পেশাদার টিম আন্তর্জাতিক মানের সেফ কেমিক্যালস, ভ্যাকুয়াম অ্যান্ড ড্রাইয়ার এবং স্যানিটাইজিং ইক্যুইপমেন্ট নিজেদের সাথে নিয়ে আসে।",
  },
  {
    id: 3,
    number: "03",
    question: "ঢাকার কোন কোন এলাকায় আপনাদের সার্ভিস চালু আছে?",
    answer:
      "বর্তমানে গুলশান, বনানী, উত্তরা, ধানমন্ডি, মিরপুর, মতিঝিল, বসুন্ধরা আবাসিক এলাকা এবং ঢাকা মেট্রোপলিটনের সমস্ত প্রধান বাণিজ্যিক ও আবাসিক এলাকায় সার্ভিস এভেইলএবল।",
  },
  {
    id: 4,
    number: "04",
    question: "আমি কি মাসিক সাবস্ক্রিপশন বা নিয়মিত সার্ভিস নিতে পারব?",
    answer:
      "হ্যাঁ! আপনি আমাদের Basic (৳6,000/মাস), Standard (৳14,000/মাস) বা Premium (৳30,000/মাস) প্ল্যান বেছে নিয়ে রেগুলার সাপ্তাহিক/পাক্ষিক অটোমেটেড সার্ভিস নিতে পারেন।",
  },
];

import {
  getStoredHomeCMSData,
  defaultHomeCMSData,
  HomeCMSContent,
} from "@/lib/homeCMSData";

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(1);
  const [cmsData, setCmsData] = useState<HomeCMSContent>(defaultHomeCMSData);

  useEffect(() => {
    setCmsData(getStoredHomeCMSData());

    const handleUpdate = () => {
      setCmsData(getStoredHomeCMSData());
    };

    window.addEventListener("cleanix_home_cms_updated", handleUpdate);
    return () => {
      window.removeEventListener("cleanix_home_cms_updated", handleUpdate);
    };
  }, []);

  const toggleFaq = (id: number) => {
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
            {faqList.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  onClick={() => toggleFaq(faq.id)}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-300 cursor-pointer shadow-xs ${isOpen
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
