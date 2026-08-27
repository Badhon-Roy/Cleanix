"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Navigation, Search, X, ChevronRight } from "lucide-react";

import {
  defaultCoverageCMSData,
  CoverageCMSContent,
} from "@/lib/coverageCMSData";
import {
  ICoverageArea,
  fetchAllCoveragesAPI,
} from "@/services/coverageService";
import { io } from "socket.io-client";

export function AreaStarIcon() {
  return (
    <div className="w-10 h-10 rounded-2xl bg-[#007eff]/10 text-[#007eff] flex items-center justify-center mb-4 border border-[#007eff]/20 group-hover:bg-[#007eff] group-hover:text-white transition-colors">
      <MapPin className="w-5 h-5 stroke-[2.5]" />
    </div>
  );
}

interface DhakaCoverageSectionProps {
  initialData?: CoverageCMSContent;
  initialCoverages?: ICoverageArea[];
}

export default function DhakaCoverageSection({
  initialData,
  initialCoverages = [],
}: DhakaCoverageSectionProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [coverages, setCoverages] = useState<ICoverageArea[]>(initialCoverages);
  const [cmsData, setCmsData] = useState<CoverageCMSContent>(
    initialData || defaultCoverageCMSData
  );

  const loadCoverages = async (query?: string) => {
    try {
      const data = await fetchAllCoveragesAPI({
        searchTerm: query !== undefined ? query : searchQuery,
        isActive: true,
      });
      if (Array.isArray(data)) {
        setCoverages(data);
      }
    } catch (err) {
      console.error("Error fetching coverages:", err);
    }
  };

  useEffect(() => {
    if (initialData) {
      setCmsData(initialData);
    }

    loadCoverages(searchQuery);

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("cms_updated", (payload: any) => {
      if (payload?.page === "coverage" || payload?.data) {
        const delta = payload?.updatedFields || payload?.data;
        if (delta) {
          setCmsData((prev) => ({ ...prev, ...delta }));
        }
      }
    });

    socket.on("coverage_updated", () => {
      loadCoverages();
    });

    return () => {
      socket.disconnect();
    };
  }, [initialData, searchQuery]);

  const filteredAreas = coverages;

  return (
    <section className="w-full bg-[#f4f6f9] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-6 bg-white shadow-2xs">
            <Navigation className="w-3.5 h-3.5 text-[#007eff]" />
            <span>{cmsData?.sectionBadge || "COVERAGE AREA MAP"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12]">
            {cmsData?.sectionTitleLine1} <br />
            {cmsData?.sectionTitleHighlight && (
              <span className="text-[#007eff]">{cmsData?.sectionTitleHighlight}</span>
            )}{" "}
            {cmsData?.sectionTitleLine2}
          </h2>

          {cmsData?.sectionSubtitle && (
            <div
              className="text-slate-600 text-sm sm:text-base font-normal mt-4 max-w-xl mx-auto [&_p]:mb-2"
              dangerouslySetInnerHTML={{ __html: cmsData.sectionSubtitle }}
            />
          )}

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
            {filteredAreas.map((item, idx) => {
              const zoneTitle = item?.zoneName || "Dhaka Zone";
              const tagLabel = item?.district
                ? `${item.district.toUpperCase()} COVERAGE`
                : "DHAKA COVERAGE";
              const description =
                item?.desc ||
                `সরাসরি ${zoneTitle} এলাকায় আমাদের ২৫-৩০ মিনিটের মধ্যে সার্ভিস স্পট বুক করুন।`;
              const firstWord = zoneTitle.split(" ")[0] || "Area";

              return (
                <div
                  key={item?.id || item?._id || idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-2xl hover:border-2 hover:border-[#007eff] hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between relative"
                >
                  {/* Badge (Turns Blue on Hover) */}
                  <span className="font-extrabold text-[10px] uppercase tracking-wider rounded-full px-3 py-1 absolute -top-3 right-5 shadow-md bg-[#001837] text-white group-hover:bg-[#007eff] group-hover:shadow-blue-500/30 transition-all duration-300 whitespace-nowrap">
                    ★ {item?.district ? item.district.toUpperCase() : "DHAKA"}
                  </span>

                  <div>
                    <AreaStarIcon />
                    <h3 className="text-[#001837] font-black text-lg tracking-tight uppercase mb-1 group-hover:text-[#007eff] transition-colors leading-snug">
                      {zoneTitle}
                    </h3>
                    <p className="text-[#007eff] font-bold text-[11px] mb-3 uppercase tracking-wider">
                      {tagLabel}
                    </p>

                    <p className="text-slate-500 font-medium text-xs leading-relaxed mb-4">
                      {description}
                    </p>

                    {Array.isArray(item?.areasIncluded) && item.areasIncluded.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-5">
                        {item.areasIncluded.slice(0, 3).map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-slate-100 font-bold text-slate-600 px-2 py-0.5 rounded-md"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Select Button (Turns Blue on Hover) */}
                  <div>
                    <Link
                      href="/contact"
                      className="font-bold text-[11px] py-3 px-4 rounded-full w-full flex items-center justify-between transition-all duration-300 shadow-md bg-[#001837] text-white group-hover:bg-[#007eff] group-hover:shadow-blue-500/30"
                    >
                      <span>Book in {zoneTitle}</span>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs bg-[#007eff] text-white group-hover:bg-white group-hover:text-[#007eff] transition-colors">
                        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
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
