"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar } from "lucide-react";

export default function OurJourneyStepper() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      year: "2025–2026",
      side: "right",
      title: "Expanding Smart SaaS Automation Across Dhaka City",
      desc: "গুলশান, বনানী, উত্তরা, ধানমন্ডি ও মতিঝিলে আমাদের ১,২০০+ সক্রিয় বিটুবি ও বিটুসি গ্রাহকদের জন্য রিয়েল-টাইম জিপিএস ট্র্যাকিং, অনলাইন বিটুবি সাবস্ক্রিপশন ও ডিজিটাল ইনভয়েসিং সিস্টেম চালু।",
    },
    {
      number: "02",
      year: "2022–2023",
      side: "left",
      title: "Hospital-Grade Chemical & HEPA Scrubbers Setup",
      desc: "বাংলাদেশি বাসাবাড়ি ও অফিসের জন্য বিশ্বমানের অ্যান্টি-ব্যাকটেরিয়াল ইকো কেমিক্যালস, ইন্ডাস্ট্রিয়াল ফ্লোর বাফার ও ১০০% এনআইডি-ভেরিফাইড প্রফেশনাল ক্লিনার টিম গঠন।",
    },
    {
      number: "03",
      year: "2020–2021",
      side: "right",
      title: "Company Founded in Dhaka",
      desc: "ঢাকার ব্যস্ত পরিবার ও করপোরেট প্রতিষ্ঠানকে সাশ্রয়ী খরচে (৳6,000 / ৳14,000 / ৳30,000 প্যাকেজে) নিখুঁত ও নির্ভরযোগ্য ক্লিনিং সেবা দেওয়ার ভিশন নিয়ে ক্লিনিক্সের শুভ সূচনা।",
    },
  ];

  // Automatic scroll listener for active step progression on scroll
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("our-journey-stepper");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight * 0.7 && rect.bottom >= windowHeight * 0.3) {
        const totalHeight = rect.height;
        const currentScroll = windowHeight * 0.7 - rect.top;
        const percentage = currentScroll / totalHeight;

        if (percentage < 0.4) {
          setActiveStep(0);
        } else if (percentage < 0.75) {
          setActiveStep(1);
        } else {
          setActiveStep(2);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="our-journey-stepper"
      className="w-full bg-[#001837] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b border-white/10"
    >
      {/* Radial Blue Glow Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#007eff]/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-6 bg-blue-50/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#007eff]" />
            <span>OUR JOURNEY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-[1.12]">
            BUILDING CLEANER SPACES <br />
            <span className="text-[#007eff]">WITH EVERY SERVICE</span>
          </h2>
        </div>

        {/* Vertical Timeline Stepper */}
        <div className="relative w-full min-h-[700px] flex flex-col justify-between py-6">
          {/* Timeline Center Continuous Progress Line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-6 bottom-6 w-1 bg-white/15 rounded-full z-0 overflow-hidden">
            {/* Active & Passed Stepper Line Fill */}
            <div
              className="w-full bg-[#007eff] rounded-full transition-all duration-700 shadow-[0_0_15px_#007eff]"
              style={{
                height:
                  activeStep === 0
                    ? "33%"
                    : activeStep === 1
                    ? "66%"
                    : "100%",
              }}
            />
          </div>

          {/* Stepper Node Items */}
          {steps.map((step, idx) => {
            const isPassedOrActive = idx <= activeStep;

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-4 sm:gap-6 cursor-pointer my-6 sm:my-8 group transition-all duration-500"
              >
                {/* Mobile Circle Badge (Only visible on mobile < md) */}
                <div className="md:hidden absolute left-6 -translate-x-1/2 top-6 z-20 flex justify-center items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-base transition-all duration-500 border-4 shadow-xl ${
                      isPassedOrActive
                        ? "bg-[#007eff] border-white text-white shadow-[0_0_25px_rgba(0,126,255,0.8)] scale-105"
                        : "bg-[#001837] border-white/20 text-slate-400"
                    }`}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Left Column (md:col-span-5) */}
                <div className="pl-16 md:pl-0 md:col-span-5">
                  {step.side === "left" && (
                    <div
                      className={`rounded-3xl p-6 sm:p-8 transition-all duration-500 border md:text-right ${
                        isPassedOrActive
                          ? "bg-[#007eff] text-white shadow-xl shadow-blue-500/25 border-transparent scale-[1.02]"
                          : "bg-white/5 backdrop-blur-md text-slate-200 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                          isPassedOrActive
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-slate-300"
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{step.year}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3 leading-tight">
                        {step.title}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm font-medium leading-relaxed ${
                          isPassedOrActive ? "text-white/95" : "text-slate-300"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  )}
                </div>

                {/* Center Circle Badge Node (Desktop md:col-span-2) */}
                <div className="hidden md:flex md:col-span-2 justify-center items-center z-20">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-lg sm:text-xl transition-all duration-500 border-4 shadow-xl ${
                      isPassedOrActive
                        ? "bg-[#007eff] border-white text-white shadow-[0_0_25px_rgba(0,126,255,0.8)] scale-110"
                        : "bg-[#001837] border-white/20 text-slate-400"
                    }`}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Right Column (md:col-span-5) */}
                <div className="pl-16 md:pl-0 md:col-span-5">
                  {step.side === "right" && (
                    <div
                      className={`rounded-3xl p-6 sm:p-8 transition-all duration-500 border md:text-left ${
                        isPassedOrActive
                          ? "bg-[#007eff] text-white shadow-xl shadow-blue-500/25 border-transparent scale-[1.02]"
                          : "bg-white/5 backdrop-blur-md text-slate-200 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                          isPassedOrActive
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-slate-300"
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{step.year}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3 leading-tight">
                        {step.title}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm font-medium leading-relaxed ${
                          isPassedOrActive ? "text-white/95" : "text-slate-300"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
