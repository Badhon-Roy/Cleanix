"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, Check, ChevronRight, Plus, Minus } from "lucide-react";

export default function EstimateCalculator() {
  const [sqft, setSqft] = useState<number>(1200);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);

  const addonsList = [
    { id: "oven", name: "Oven Wash", price: 800 },
    { id: "fridge", name: "Fridge Deep Clean", price: 1000 },
    { id: "window", name: "Interior Window Wash", price: 1200 },
    { id: "sofa", name: "Sofa Shampoo Wash", price: 1500 },
    { id: "pet", name: "Pet Hygiene Treatment", price: 1000 },
  ];

  const [selectedAddons, setSelectedAddons] = useState<string[]>(["sofa"]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Dynamic Formula from REQUIREMENTS.txt Section 7:
  // Base Fee (৳1,500) + (SqFt * ৳2.5) + (Bedrooms * ৳500) + (Bathrooms * ৳400) + Selected Addons
  const totalEstimate = useMemo(() => {
    const baseFee = 1500;
    const sqftCost = sqft * 2.5;
    const bedroomCost = bedrooms * 500;
    const bathroomCost = bathrooms * 400;
    const addonsCost = selectedAddons.reduce((acc, id) => {
      const addon = addonsList.find((a) => a.id === id);
      return acc + (addon ? addon.price : 0);
    }, 0);

    return Math.round(baseFee + sqftCost + bedroomCost + bathroomCost + addonsCost);
  }, [sqft, bedrooms, bathrooms, selectedAddons]);

  return (
    <section className="w-full bg-white text-[#001837] py-12 md:py-16 px-4 sm:px-6 lg:px-12 border-t border-slate-100">
      <div className="container mx-auto bg-white text-[#001837] rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Radial Accent Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#007eff]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Calculation Controls Part (3/4 Width -> lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-4 py-1.5 mb-3 bg-blue-50/60 backdrop-blur-md">
                <Calculator className="w-3.5 h-3.5 text-[#007eff]" />
                <span>CUSTOM INSTANT ESTIMATE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#001837] tracking-tight">
                CALCULATE YOUR <span className="text-[#007eff]">CLEANING COST</span>
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
                স্পেসের সাইজ (SqFt), রুম সংখ্যা ও অ্যাড-অন পছন্দ করে সাথে সাথে আপনার সার্ভিস খরচের হিসাব দেখে নিন।
              </p>
            </div>

            {/* Controls Grid */}
            <div className="space-y-5">
              {/* 1. SqFt Slider */}
              <div className="bg-[#f4f6f9] p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-base font-semibold text-slate-700">
                    Property Size (Square Feet)
                  </label>
                  <span className="text-base sm:text-lg font-black text-[#007eff]">
                    {sqft.toLocaleString()} SqFt
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="6000"
                  step="50"
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#007eff]"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-1">
                  <span>400 SqFt</span>
                  <span>3,000 SqFt</span>
                  <span>6,000 SqFt</span>
                </div>
              </div>

              {/* 2. Bedrooms & Bathrooms Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bedrooms */}
                <div className="bg-[#f4f6f9] p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="block text-base font-semibold text-slate-700">
                      Bedrooms
                    </span>
                    <span className="text-xs text-slate-500 font-medium">৳500 / room</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <button
                      onClick={() => setBedrooms((prev) => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-[#0b2144] hover:bg-[#007eff] text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-extrabold text-base w-4 text-center text-[#001837]">
                      {bedrooms}
                    </span>
                    <button
                      onClick={() => setBedrooms((prev) => Math.min(10, prev + 1))}
                      className="w-7 h-7 rounded-lg bg-[#0b2144] hover:bg-[#007eff] text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="bg-[#f4f6f9] p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="block text-base font-semibold text-slate-700">
                      Bathrooms
                    </span>
                    <span className="text-xs text-slate-500 font-medium">৳400 / bath</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <button
                      onClick={() => setBathrooms((prev) => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-[#0b2144] hover:bg-[#007eff] text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-extrabold text-base w-4 text-center text-[#001837]">
                      {bathrooms}
                    </span>
                    <button
                      onClick={() => setBathrooms((prev) => Math.min(10, prev + 1))}
                      className="w-7 h-7 rounded-lg bg-[#0b2144] hover:bg-[#007eff] text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Add-on Services Checkboxes */}
              <div className="bg-[#f4f6f9] p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                <span className="block text-base font-semibold text-slate-700 mb-3">
                  Select Add-on Services (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {addonsList.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isChecked
                            ? "bg-[#007eff]/10 border-[#007eff] text-[#001837] font-bold"
                            : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked
                                ? "bg-[#007eff] border-[#007eff] text-white"
                                : "border-slate-300"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-sm">{addon.name}</span>
                        </div>
                        <span className="text-base text-[#007eff] font-extrabold ml-1">
                          +৳{addon.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary Total Result Card (1/4 Width -> lg:col-span-4) */}
          <div className="lg:col-span-4 bg-gradient-to-b from-[#0b2144] to-[#0d2853] text-white p-7 sm:p-8 rounded-3xl border border-slate-200/40 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden h-full">
            <div className="space-y-4">
              <span className="inline-block text-sm font-extrabold uppercase tracking-wider text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full">
                ESTIMATED ONE-TIME COST
              </span>

              <div className="pt-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  ৳{totalEstimate.toLocaleString()}
                </span>
                <span className="block text-slate-400 text-base font-semibold mt-1">
                  (VAT &amp; Service Charge Included)
                </span>
              </div>

              <div className="border-t border-white/10 pt-4 text-left space-y-2.5 text-lg text-slate-300 font-medium">
                <div className="flex justify-between">
                  <span>Base Service Fee:</span>
                  <span className="font-bold text-white">৳1,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Area ({sqft} SqFt × ৳2.5):</span>
                  <span className="font-bold text-white">৳{(sqft * 2.5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rooms ({bedrooms} Bed + {bathrooms} Bath):</span>
                  <span className="font-bold text-white">
                    ৳{(bedrooms * 500 + bathrooms * 400).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Add-ons ({selectedAddons.length}):</span>
                  <span className="font-bold text-[#007eff]">
                    +৳
                    {selectedAddons
                      .reduce((acc, id) => acc + (addonsList.find((a) => a.id === id)?.price || 0), 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/contact"
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-4 rounded-2xl w-full flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_25px_rgba(0,126,255,0.5)] hover:scale-[1.02]"
              >
                <span>Book Custom Estimate</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
