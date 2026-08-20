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
      title: "Expanding Professional Cleaning Services",
      desc: "We continue to grow our residential and commercial cleaning solutions, serving more homes and businesses with dependable service, trained professionals, and consistent cleaning standards.",
    },
    {
      number: "02",
      year: "2022–2023",
      side: "left",
      title: "Modern Cleaning Equipment",
      desc: "We invest in advanced cleaning equipment and eco-friendly products to improve efficiency while delivering safer, healthier, and longer-lasting cleaning results.",
    },
    {
      number: "03",
      year: "2020–2021",
      side: "right",
      title: "Company Founded",
      desc: "Our company began with a simple mission—to provide reliable, affordable, and high-quality cleaning services backed by professionalism, integrity, and exceptional customer care.",
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
      className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100 relative overflow-hidden"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-6 py-2 mb-6 bg-blue-50/50">
            <Sparkles className="w-3.5 h-3.5 text-[#007eff]" />
            <span>OUR JOURNEY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12]">
            BUILDING <span className="text-[#007eff]">CLEANER</span> SPACES <br />
            WITH EVERY SERVICE
          </h2>
        </div>

        {/* Stepper Timeline Container */}
        <div className="relative my-8">
          {/* Central Vertical Line Background (Rounded Caps) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-12 w-1.5 bg-slate-200 rounded-full hidden md:block" />

          {/* Active Step Progress Line Filler (Curved Rounded-Full Caps & Glow Shadow) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-6 w-1.5 bg-[#007eff] rounded-full transition-all duration-500 ease-out hidden md:block shadow-[0_0_12px_rgba(0,126,255,0.6)]"
            style={{
              height:
                activeStep === 0
                  ? "25%"
                  : activeStep === 1
                  ? "60%"
                  : "95%",
            }}
          />

          {/* Stepper Items */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, idx) => {
              const isPassedOrActive = idx <= activeStep;
              const isLeft = step.side === "left";

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveStep(idx)}
                  className="relative grid grid-cols-1 md:grid-cols-12 items-center gap-6 group cursor-pointer"
                >
                  {/* Left Column Container */}
                  <div
                    className={`md:col-span-5 ${
                      isLeft ? "md:text-right" : "hidden md:block"
                    }`}
                  >
                    {isLeft && (
                      <div
                        className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 border ${
                          isPassedOrActive
                            ? "bg-[#007eff] text-white border-transparent shadow-xl shadow-blue-500/20 scale-[1.02]"
                            : "bg-[#f4f6f9] text-[#001837] border-slate-200/80 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`inline-flex items-center gap-2 text-[11px] font-bold px-3.5 py-1 rounded-full mb-4 shadow-xs ${
                            isPassedOrActive
                              ? "bg-white/20 text-white border border-white/25 backdrop-blur-md"
                              : "bg-[#001837] text-white"
                          }`}
                        >
                          <Calendar
                            className={`w-3 h-3 ${
                              isPassedOrActive
                                ? "text-white"
                                : "text-[#007eff]"
                            }`}
                          />
                          <span>{step.year}</span>
                        </div>
                        <h3
                          className={`text-xl sm:text-2xl font-extrabold mb-3 ${
                            isPassedOrActive ? "text-white" : "text-[#001837]"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm sm:text-[15px] leading-relaxed font-normal ${
                            isPassedOrActive
                              ? "text-white/95"
                              : "text-slate-600"
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Center Node Bullet (md:col-span-2) */}
                  <div className="md:col-span-2 flex justify-center relative z-20">
                    <button
                      onClick={() => setActiveStep(idx)}
                      className={`w-11 h-11 rounded-full font-extrabold text-xs flex items-center justify-center transition-all duration-300 ${
                        isPassedOrActive
                          ? "bg-[#007eff] text-white border-4 border-white ring-4 ring-[#007eff]/30 shadow-lg scale-110"
                          : "bg-white text-slate-500 border-2 border-slate-300 hover:border-[#007eff] hover:text-[#007eff]"
                      }`}
                    >
                      {step.number}
                    </button>
                  </div>

                  {/* Right Column Container */}
                  <div
                    className={`md:col-span-5 ${
                      !isLeft ? "text-left" : "hidden md:block"
                    }`}
                  >
                    {!isLeft && (
                      <div
                        className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 border ${
                          isPassedOrActive
                            ? "bg-[#007eff] text-white border-transparent shadow-xl shadow-blue-500/20 scale-[1.02]"
                            : "bg-[#f4f6f9] text-[#001837] border-slate-200/80 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`inline-flex items-center gap-2 text-[11px] font-bold px-3.5 py-1 rounded-full mb-4 shadow-xs ${
                            isPassedOrActive
                              ? "bg-white/20 text-white border border-white/25 backdrop-blur-md"
                              : "bg-[#001837] text-white"
                          }`}
                        >
                          <Calendar
                            className={`w-3 h-3 ${
                              isPassedOrActive
                                ? "text-white"
                                : "text-[#007eff]"
                            }`}
                          />
                          <span>{step.year}</span>
                        </div>
                        <h3
                          className={`text-xl sm:text-2xl font-extrabold mb-3 ${
                            isPassedOrActive ? "text-white" : "text-[#007eff]"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm sm:text-[15px] leading-relaxed font-normal ${
                            isPassedOrActive
                              ? "text-white/95"
                              : "text-slate-600"
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mobile View Card */}
                  {isLeft && (
                    <div className="block md:hidden">
                      <div
                        className={`rounded-3xl p-6 transition-all duration-300 border ${
                          isPassedOrActive
                            ? "bg-[#007eff] text-white shadow-xl"
                            : "bg-[#f4f6f9] text-[#001837] border-slate-200/80"
                        }`}
                      >
                        <div
                          className={`inline-flex items-center gap-2 text-[11px] font-bold px-3.5 py-1 rounded-full mb-4 ${
                            isPassedOrActive
                              ? "bg-white/20 text-white"
                              : "bg-[#001837] text-white"
                          }`}
                        >
                          <Calendar className="w-3 h-3 text-[#007eff]" />
                          <span>{step.year}</span>
                        </div>
                        <h3
                          className={`text-xl font-extrabold mb-3 ${
                            isPassedOrActive ? "text-white" : "text-[#001837]"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm leading-relaxed ${
                            isPassedOrActive
                              ? "text-white/95"
                              : "text-slate-600"
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
