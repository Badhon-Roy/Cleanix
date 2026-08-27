"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  defaultHomeCMSData,
  HomeCMSContent,
} from "@/lib/homeCMSData";

import { io } from "socket.io-client";

interface CtaBannerProps {
  initialData?: HomeCMSContent;
}

export default function CtaBanner({ initialData }: CtaBannerProps) {
  const [cmsData, setCmsData] = useState<HomeCMSContent>(
    initialData || defaultHomeCMSData
  );

  useEffect(() => {
    if (initialData) {
      setCmsData(initialData);
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("cms_updated", (payload: any) => {
      const delta = payload?.updatedFields || payload?.data;
      if (delta) {
        const hasCtaKeys = Object.keys(delta).some((k) => k.startsWith("cta"));
        if (hasCtaKeys) {
          setCmsData((prev) => ({ ...prev, ...delta }));
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [initialData]);

  return (
    <section className="w-full bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-[#007eff] rounded-3xl p-8 sm:p-12 md:p-14 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Decorative Subtle Radial Glow */}
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text Content */}
          <div className="max-w-2xl text-left z-10">
            <span className="bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full inline-block mb-4 backdrop-blur-md">
              {cmsData?.ctaBadge || "GET IN TOUCH TODAY"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-black text-white leading-[1.12] uppercase tracking-tight">
              {cmsData?.ctaTitle || "READY FOR A SPOTLESS & HEALTHY SPACE?"}
            </h2>
            <div
              className="text-white/90 text-sm sm:text-base font-medium mt-3 [&_p]:mb-0"
              dangerouslySetInnerHTML={{
                __html:
                  cmsData?.ctaSubtitle ||
                  "আজই আপনার বাসা বা অফিসের জন্য বিশ্বমানের ক্লিনিং টিম বুক করুন অথবা কয়েক সেকেন্ডে ইনস্ট্যান্ট ফ্রি এস্টিমেট নিন।",
              }}
            />
          </div>

          {/* Right Action Button */}
          <div className="z-10 flex-shrink-0">
            <Link
              href={cmsData?.ctaBtnHref || "/contact"}
              className="bg-[#001837] hover:bg-[#031024] text-white font-extrabold text-sm sm:text-base pl-7 pr-2.5 py-2.5 rounded-full inline-flex items-center gap-4 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              <span>{cmsData?.ctaBtnText || "Book Service Now"}</span>
              <div className="w-8 h-8 rounded-full bg-[#007eff] flex items-center justify-center text-white shadow-sm">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
