"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight, Home, Building2, Sparkles, Wrench } from "lucide-react";

const servicesList = [
  {
    id: 1,
    title: "RESIDENTIAL DEEP CLEANING",
    tags: ["CLEANING", "HOME CARE"],
    icon: Home,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80",
    description:
      "We provide end-to-end cleaning solutions with trained teams, safe supplies, detailed checklists, and reliable service for homes and businesses of every size.",
  },
  {
    id: 2,
    title: "COMMERCIAL OFFICE CLEANING",
    tags: ["CLEANING", "COMMERCIAL"],
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1613963931023-5dc59437c8a6?auto=format&fit=crop&w=1000&q=80",
    description:
      "Professional office cleaning services tailored to maintain hygienic, productive, and sparkling work environments daily.",
  },
  {
    id: 3,
    title: "MOVE-OUT CLEANING",
    tags: ["CLEANING", "RELOCATION"],
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80",
    description:
      "Thorough move-in and move-out deep cleaning routines ensuring properties look pristine for new occupants.",
  },
  {
    id: 4,
    title: "POST-CONSTRUCTION CLEANING",
    tags: ["CLEANING", "HEAVY DUTY"],
    icon: Wrench,
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1000&q=80",
    description:
      "Specialized debris removal, dust sanitization, and final polish after building, remodeling, or renovation work.",
  },
];

export default function OurServices() {
  const [activeService, setActiveService] = useState(servicesList[0]);

  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 mb-12 md:mb-16">
          {/* Badge & Headline (Left/Center) */}
          <div className="max-w-2xl">
            <span className="inline-block border border-[#007eff]/40 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4">
              OUR SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#001837] leading-[1.12] tracking-tight uppercase">
              RELIABLE HOME AND OFFICE{" "}
              <span className="text-[#007eff]">CLEANING</span>
            </h2>
          </div>

          {/* Subtitle Description (Right) */}
          <div className="lg:max-w-md">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Seamlessly deliver trusted cleaning routines with trained teams,
              safe supplies, flexible scheduling, detailed quality checks, and
              service plans built around your space.
            </p>
          </div>
        </div>

        {/* Main Grid: Left Feature Image Card + Right Interactive Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Feature Image with Glassmorphism Overlay */}
          <div className="lg:col-span-6 relative w-full h-[480px] sm:h-[560px] lg:h-[600px] rounded-3xl overflow-hidden shadow-md group">
            <Image
              src={activeService.image}
              alt={activeService.title}
              fill
              priority
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Bottom Floating Glassmorphism Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#031837]/80 backdrop-blur-md border-l-4 border-[#007eff] rounded-2xl p-5 md:p-6 shadow-2xl text-white">
              <p className="text-white/95 text-sm md:text-[15px] font-medium leading-relaxed">
                {activeService.description}
              </p>
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
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs flex-shrink-0 ${
                      isActive
                        ? "bg-[#007eff] text-white rotate-0"
                        : "bg-white text-[#031837] group-hover:bg-[#007eff] group-hover:text-white"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
