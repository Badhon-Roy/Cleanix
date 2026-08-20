"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Navigation, Search, X, ChevronRight } from "lucide-react";

export function AreaStarIcon() {
  return (
    <div className="w-10 h-10 rounded-2xl bg-[#007eff]/10 text-[#007eff] flex items-center justify-center mb-4 border border-[#007eff]/20 group-hover:bg-[#007eff] group-hover:text-white transition-colors">
      <MapPin className="w-5 h-5 stroke-[2.5]" />
    </div>
  );
}

export default function DhakaCoverageSection() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const coverageAreas = [
    {
      area: "Gulshan 1 & 2",
      tag: "VIP DUPLEX & EMBASSY",
      time: "25 Mins SLA",
      desc: "গুলশান ১ ও ২ এরিয়া এবং ডিপ্লোম্যাটিক এম্বাসি জোনের স্পেশাল সার্ভিস।",
    },
    {
      area: "Banani & DOHS",
      tag: "CORPORATE & TECH HUB",
      time: "25 Mins SLA",
      desc: "কর্পোরেট আইটি অফিস, স্টার্টআপ ও টেক হাবের নাইট শিফট স্যানিটাইজিং।",
    },
    {
      area: "Uttara (Sec 1-14)",
      tag: "RESIDENTIAL & TURNOVER",
      time: "30 Mins SLA",
      desc: "সেক্টর ১-১৪ এর রেসিডেন্সিয়াল অ্যাপার্টমেন্ট মুভ-ইন/মুভ-আউট সলিউশন।",
    },
    {
      area: "Dhanmondi & Lalmatia",
      tag: "RESIDENTIAL & MEDICAL",
      time: "30 Mins SLA",
      desc: "ধানমন্ডি ও লালমাটিয়া এলাকার ডুপ্লেক্স ও রেনোভেশন ক্লিনিং কেয়ার।",
    },
    {
      area: "Bashundhara R/A",
      tag: "LUXURY CONDO & VILLA",
      time: "30 Mins SLA",
      desc: "বসুন্ধরা আর/এ এর লাক্সারি কন্ডো ও প্রাইভেট ভিলার প্রিমিয়াম কেয়ার।",
    },
    {
      area: "Mohammadpur & Adabor",
      tag: "RESIDENTIAL & HOUSING",
      time: "30 Mins SLA",
      desc: "মোহাম্মদপুর ও আদাবর হাউজিং এলাকার রুটিন হোম কেয়ার ও ভ্যাকুয়াম।",
    },
    {
      area: "Badda & Rampura",
      tag: "COMMERCIAL & RESIDENTIAL",
      time: "25 Mins SLA",
      desc: "বাড্ডা, রামপুরা ও প্রগতি সরণি কমার্শিয়াল ফ্লোর ও হোম স্যানিটাইজ।",
    },
    {
      area: "Motijheel & Dilkusha",
      tag: "FINANCIAL & BANKING",
      time: "35 Mins SLA",
      desc: "মতিঝিল ও দিলকুশা ব্যাংকিং অ্যান্ড ফাইন্যান্সিয়াল অফ-আওয়ার্স কেয়ার।",
    },
    {
      area: "Mirpur & Pallabi",
      tag: "HIGH DENSITY HOUSING",
      time: "35 Mins SLA",
      desc: "মিরপুর ও পল্লবী কলোনি ও অ্যাপার্টমেন্টের দ্রুত সার্ভিস ডেলিভারি।",
    },
    {
      area: "Mohakhali & Tejgaon",
      tag: "SHOWROOM & COMMERCIAL",
      time: "25 Mins SLA",
      desc: "মহাখালী ও তেজগাঁও শোরুম গ্লাস ও ফ্লোর হ্যাভি-ডিউটি পলিশ সার্ভিস।",
    },
  ];

  const filteredAreas = coverageAreas.filter((item) =>
    item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="w-full bg-[#f4f6f9] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-6 bg-white shadow-2xs">
            <Navigation className="w-3.5 h-3.5 text-[#007eff]" />
            <span>COVERAGE AREA MAP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12]">
            PROUDLY SERVING ALL MAJOR <br />
            <span className="text-[#007eff]">NEIGHBORHOODS</span> IN DHAKA
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal mt-4 max-w-xl mx-auto">
            আমাদের জিপিএস ট্র্যাকিংকৃত ক্লিনার বহর ঢাকার প্রতিটি প্রধান এলাকায় জরুরি ২৫-৩০ মিনিটের মধ্যে পৌঁছে যায়।
          </p>

          {/* Interactive Location Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="border-2 border-[#007eff]/50 focus-within:border-[#007eff] rounded-full p-4 flex items-center gap-3 transition-all duration-300">
              <Search className="w-5 h-5 text-[#007eff] ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search your area (e.g. Gulshan, Uttara, Dhanmondi, Badda...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm sm:text-base font-semibold text-[#001837] bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors mr-2 shrink-0"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Coverage Cards Grid */}
        {filteredAreas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-14">
            {filteredAreas.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-2xl hover:border-2 hover:border-[#007eff] hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between relative"
              >
                {/* Badge (Turns Blue on Hover) */}
                <span className="font-extrabold text-[10px] uppercase tracking-wider rounded-full px-3 py-1 absolute -top-3 right-5 shadow-md bg-[#001837] text-white group-hover:bg-[#007eff] group-hover:shadow-blue-500/30 transition-all duration-300 whitespace-nowrap">
                  ★ {item.time}
                </span>

                <div>
                  <AreaStarIcon />
                  <h3 className="text-[#001837] font-black text-lg tracking-tight uppercase mb-1 group-hover:text-[#007eff] transition-colors leading-snug">
                    {item.area}
                  </h3>
                  <p className="text-[#007eff] font-bold text-[11px] mb-3 uppercase tracking-wider">
                    {item.tag}
                  </p>

                  <p className="text-slate-500 font-medium text-xs leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                {/* Select Button (Turns Blue on Hover) */}
                <div>
                  <Link
                    href="/contact"
                    className="font-bold text-[11px] py-3 px-4 rounded-full w-full flex items-center justify-between transition-all duration-300 shadow-md bg-[#001837] text-white group-hover:bg-[#007eff] group-hover:shadow-blue-500/30"
                  >
                    <span>Book in {item.area.split(" ")[0]}</span>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs bg-[#007eff] text-white group-hover:bg-white group-hover:text-[#007eff] transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center max-w-xl mx-auto border border-slate-200 mb-14 shadow-lg">
            <MapPin className="w-10 h-10 text-[#007eff] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-black text-[#001837] uppercase">
              No matching location found
            </h3>
            <p className="text-slate-500 text-xs font-medium mt-1 mb-4">
              &quot;{searchQuery}&quot; এরিয়ার কভারেজের জন্য সরাসরি আমাদের টিমের সাথে কথা বলুন।
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-[#007eff] underline"
            >
              Clear Search &amp; View All Areas
            </button>
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="bg-[#001837] text-white rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#007eff] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
              <Navigation className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-3xl font-semibold text-white tracking-tight">
                Don&apos;t see your area listed?
              </h4>
              <p className="text-slate-300 text-xs sm:text-base mt-2 font-medium">
                ঢাকার বাইরের এরিয়া বা স্পেশাল কভারেজের জন্য আমাদের টিমের সাথে হটলাইনে <br /> কথা বলুন: <strong>+880 1774-500815</strong>
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full flex items-center gap-2 whitespace-nowrap shadow-lg shadow-blue-500/30 hover:scale-105 transition-all"
          >
            <span>Request Coverage</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
