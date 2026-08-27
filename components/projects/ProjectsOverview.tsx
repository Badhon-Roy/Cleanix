"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import {
  defaultProjectsCMSData,
  ProjectsCMSContent,
} from "@/lib/projectsCMSData";
import { io } from "socket.io-client";

interface ProjectsOverviewProps {
  initialData?: ProjectsCMSContent;
}

export default function ProjectsOverview({ initialData }: ProjectsOverviewProps) {
  const [data, setData] = useState<ProjectsCMSContent>(
    initialData || defaultProjectsCMSData
  );

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("cms_updated", (payload: any) => {
      if (payload?.page === "projects" || payload?.data) {
        const delta = payload?.updatedFields || payload?.data;
        if (delta) {
          setData((prev) => ({ ...prev, ...delta }));
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [initialData]);

  return (
    <section className="w-full bg-white text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Custom Shaped Cleaner Image */}
          <div className="lg:col-span-6 relative w-full h-[460px] sm:h-[540px] md:h-[580px] flex items-center justify-center group">
            <Image
              src={
                data?.overviewFeatureImage ||
                "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630"
              }
              alt="Delivering Cleaner Healthier Spaces Professional Care"
              fill
              unoptimized
              priority
              className="object-contain object-center lg:object-left group-hover:scale-105 transition-transform duration-700 drop-shadow-xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right Column: Content & Features Grid */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Pill Badge */}
            <div>
              <span className="inline-block border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-6 bg-blue-50/50">
                {data?.overviewBadge || "1,200+ COMPLETED PROJECTS IN DHAKA"}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12] mb-6">
              {data?.overviewTitleLine1} <br />
              {data?.overviewTitleLine2}{" "}
              {data?.overviewTitleHighlight && (
                <span className="text-[#007eff]">{data?.overviewTitleHighlight}</span>
              )}{" "}
              {data?.overviewTitleLine3}
            </h2>

            {/* Single Description Paragraph / HTML Content */}
            {data?.overviewDesc && (
              <div
                className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 font-normal [&_p]:mb-3 [&_b]:text-[#001837] [&_b]:font-bold"
                dangerouslySetInnerHTML={{ __html: data.overviewDesc }}
              />
            )}

            {/* Dynamic Feature Checklist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {(data?.overviewChecks || []).map((checkItem, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0055ff] to-[#00aaff] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                  <span className="text-sm font-extrabold text-[#001837]">
                    {checkItem}
                  </span>
                </div>
              ))}
            </div>

            {/* Start A Project CTA Button */}
            <div>
              <Link
                href="/contact"
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-sm md:text-base pl-6 pr-2 py-2.5 rounded-full inline-flex items-center gap-4 transition-all duration-300 shadow-[0_0_20px_rgba(0,126,255,0.4)] hover:shadow-[0_0_30px_rgba(0,126,255,0.7)] hover:scale-105"
              >
                <span>Start A Project</span>
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-[#007eff] shadow-sm">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
