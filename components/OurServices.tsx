"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, Building2, Sparkles, Wrench } from "lucide-react";

const servicesList = [
  {
    id: 1,
    slug: "residential-deep-cleaning",
    title: "RESIDENTIAL DEEP CLEANING",
    tags: ["HOME CARE", "আবাসিক বাসা"],
    icon: Home,
    image: "/RESIDENTIAL-DEEP-CLEANING.png",
    description:
      "ঢাকার যেকোনো অ্যাপার্টমেন্ট ও আবাসিক বাড়ির জন্য সম্পূর্ণ ডিপ রিফ্রেশ ক্লিনিং। ভ্যাকুয়ামিং, ডাস্টিং এবং কিচেন ও বাথরুম হাইজিন স্যানিটাইজেশন।",
  },
  {
    id: 2,
    slug: "commercial-office-cleaning",
    title: "COMMERCIAL OFFICE CLEANING",
    tags: ["CORPORATE", "অফিস স্পেস"],
    icon: Building2,
    image: "/COMMERCIAL-OFFICE-CLEANING.png",
    description:
      "গুলশান, বনানী, মতিঝিল ও উত্তরায় যেকোনো সাইজের কর্পোরেট অফিসের জন্য দৈনিক বা সাপ্তাহিক সাবস্ক্রিপশন ভিত্তিক হাইজিন স্যানিটাইজেশন।",
  },
  {
    id: 3,
    slug: "move-out-cleaning",
    title: "MOVE-IN / MOVE-OUT CLEANING",
    tags: ["RELOCATION", "বাসা পরিবর্তন"],
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80",
    description:
      "নতুন বাসায় শিফট হচ্ছেন বা পুরোনো বাসা ছাড়ছেন? বাসা সম্পূর্ণ জীবাণুমুক্ত ও ঝকঝকে করার জন্য আমাদের স্পেশাল মুভ-ইন/আউট সার্ভিস।",
  },
  {
    id: 4,
    slug: "post-construction-cleaning",
    title: "POST-CONSTRUCTION CLEANING",
    tags: ["HEAVY DUTY", "রেনোভেশন"],
    icon: Wrench,
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1000&q=80",
    description:
      "রেনোভেশন বা নতুন কনস্ট্রাকশনের পর জমে থাকা ধুলোবালি, রঙের দাগ ও সিভিল কেমিক্যাল দ্রুত পরিষ্কারের জন্য হেভি-ডিউটি স্পেস ক্লিনিং।",
  },
];

import {
  getStoredHomeCMSData,
  defaultHomeCMSData,
  HomeCMSContent,
} from "@/lib/homeCMSData";

export default function OurServices() {
  const [activeService, setActiveService] = useState(servicesList[0]);
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

  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 mb-12 md:mb-16">
          {/* Badge & Headline (Left/Center) */}
          <div className="max-w-2xl">
            <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4">
              {cmsData.servicesBadge || "OUR SERVICES"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase">
              {cmsData.servicesTitleLine1}{" "}
              {cmsData.servicesTitleHighlight && (
                <span className="text-[#007eff]">{cmsData.servicesTitleHighlight}</span>
              )}{" "}
              {cmsData.servicesTitleLine2}
            </h2>
          </div>

          {/* Subtitle Description (Right) */}
          <div className="lg:max-w-md">
            {cmsData.servicesSubtitle ? (
              <div
                className="text-slate-600 text-sm sm:text-base leading-relaxed [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: cmsData.servicesSubtitle }}
              />
            ) : (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                দক্ষ টিম, আন্তর্জাতিক মানের সেফ কেমিক্যালস, রিয়েল-টাইম জিপিএস ট্র্যাকিং এবং ডিজিটাল ইনভয়েসসহ প্রিমিয়াম সার্ভিস।
              </p>
            )}
          </div>
        </div>

        {/* Main Grid: Left Feature Image Card + Right Interactive Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Feature Image with Glassmorphism Overlay */}
          <div className="lg:col-span-6 relative w-full min-h-[380px] sm:min-h-[420px] lg:min-h-full h-full mx-auto lg:mx-0 overflow-hidden group rounded-[36px]">
            <Image
              src={activeService.image}
              alt={activeService.title}
              fill
              priority
              className="object-cover object-center transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Bottom Floating Glassmorphism Overlay with View Details Button */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#031837]/80 backdrop-blur-md border-l-4 border-[#007eff] rounded-2xl p-5 md:p-6 shadow-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-white/95 text-sm md:text-[15px] font-medium leading-relaxed max-w-md line-clamp-2">
                {activeService.description}
              </p>

              {/* View Details Button */}
              <Link
                href={`/services/${activeService.slug}`}
                className="bg-[#007eff] hover:bg-[#0062ee] text-white font-bold text-xs uppercase tracking-wider pl-5 pr-1.5 py-2.5 rounded-full inline-flex items-center gap-3 transition-all duration-300 shadow-lg hover:scale-105 flex-shrink-0 self-start sm:self-auto"
              >
                <span>View Details</span>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#007eff]">
                  <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Interactive Service Cards Stack */}
          <div className="lg:col-span-6 flex flex-col gap-4 md:gap-5">
            {servicesList.map((service) => {
              const IconComponent = service.icon;
              const isActive = activeService.id === service.id;

              return (
                <div
                  key={service.id}
                  onClick={() => setActiveService(service)}
                  className={`rounded-2xl p-5 md:p-6 flex items-center justify-between border transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? "bg-[#eaf1fb] border-[#007eff]/50 shadow-md translate-x-1"
                      : "bg-[#f3f5f8] border-slate-100/90 hover:bg-[#eaf1fb]/60 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Dark Navy Square Icon Box */}
                    <div className="w-12 h-12 rounded-xl bg-[#031837] flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:bg-[#007eff] transition-colors duration-300">
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>

                    {/* Service Title & Tags */}
                    <div>
                      <h3 className="text-[#031837] font-extrabold text-base sm:text-lg tracking-wide uppercase mb-2">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {service.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-white border border-slate-200/80 text-slate-500 font-bold text-[10px] uppercase px-3 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Circular Action Arrow Button */}
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs flex-shrink-0 ${
                      isActive
                        ? "bg-[#007eff] text-white rotate-0"
                        : "bg-white text-[#031837] group-hover:bg-[#007eff] group-hover:text-white"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
