"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { defaultAboutData, AboutContent } from "@/lib/aboutData";
import { io } from "socket.io-client";

import cleanerGirl1 from "@/public/cleaner_girl_1.jpg";
import cleanerBoy1 from "@/public/cleaner_boy_1.jpg";
import cleanerGirl2 from "@/public/cleaner_girl_2.jpg";
import cleanerBoy2 from "@/public/cleaner_boy_2.jpg";

interface TeamSpecialistsProps {
  initialData?: AboutContent;
}

export default function TeamSpecialists({ initialData }: TeamSpecialistsProps) {
  const [data, setData] = useState<AboutContent>(
    initialData || defaultAboutData
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
      if (payload?.page === "about" || payload?.data) {
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

  const staticCleanerImages = [
    cleanerGirl1,
    cleanerBoy1,
    cleanerGirl2,
    cleanerBoy2,
  ];

  const defaultCleanersList = [
    {
      id: "TM-101",
      name: "Sumaiya Akter",
      role: "Residential Deep Cleaning Lead",
      image: cleanerGirl1,
      nidVerified: true,
      bio: "১০ বছরের ফিল্ড সার্ভিস অভিজ্ঞতা সহ প্রতিটি রেসিডেন্সিয়াল ডিপ ক্লিনিং প্রজেক্ট ইনসপেকশনের দায়িত্বপ্রাপ্ত কর্মকর্তা।",
    },
    {
      id: "TM-102",
      name: "Tanvir Hasan",
      role: "Glass & High-Rise Window Specialist",
      image: cleanerBoy1,
      nidVerified: true,
      bio: "অফিস এবং অ্যাপার্টমেন্টের গ্লাস স্ক্রাবিং, স্কেল রিমুভাল এবং স্পেকলেস উইন্ডো ট্রিটমেন্ট এক্সপার্ট।",
    },
    {
      id: "TM-103",
      name: "Nusrat Jahan",
      role: "Commercial Sanitization Specialist",
      image: cleanerGirl2,
      nidVerified: true,
      bio: "ভিআইপি কর্পোরেট অফিস ও কমার্শিয়াল স্পেসের অ্যান্টি-ব্যাকটেরিয়াল জীবাণুমুক্তকরণ টিম লিডার।",
    },
    {
      id: "TM-104",
      name: "Rafiq Ahmed",
      role: "Floor Buffing & Chemical Hygiene Expert",
      image: cleanerBoy2,
      nidVerified: true,
      bio: "ইকো-ফ্রেন্ডলি সার্টিফাইড অর্গানিক কেমিক্যাল, স্টিম অ্যাপ্লায়েন্স ও মার্বেল ফ্লোর পলিশিং এক্সপার্ট।",
    },
  ];

  const rawMembers =
    data?.teamMembers && data.teamMembers.length >= 4
      ? data.teamMembers
      : defaultCleanersList;

  const team = rawMembers.map((member: any, idx: number) => {
    const isOldPlaceholder =
      !member.image ||
      (typeof member.image === "string" &&
        (member.image.includes("unsplash.com") ||
          member.image.startsWith("/team/")));

    return {
      ...member,
      image: isOldPlaceholder
        ? staticCleanerImages[idx % staticCleanerImages.length]
        : member.image,
    };
  });

  return (
    <section className="w-full bg-[#f8fafc] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-100">
      <div className="container mx-auto">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          {/* Left Pill Badge */}
          <div>
            <span className="inline-block border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 bg-blue-50/50">
              OUR EXPERIENCED CLEANERS
            </span>
          </div>

          {/* Right Main Headline */}
          <div className="lg:text-right">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-tight">
              MEET OUR TRUSTED <br />
              <span className="text-[#007eff]">CLEANING</span> SPECIALISTS
            </h2>
          </div>
        </div>

        {/* Team Cards Grid with Equal Heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-20 relative z-10 items-stretch">
          {team.map((member) => (
            <div
              key={member.id}
              className="group relative transition-all duration-300 hover:-translate-y-2 h-full flex flex-col"
              style={{
                filter: "drop-shadow(0 12px 28px rgba(0, 24, 55, 0.08))",
              }}
            >
              {/* Notched Top Card Shape */}
              <div
                className="bg-white pt-12 pb-8 px-5 sm:px-6 flex flex-col items-center text-center transition-all duration-300 relative border-b-2 border-transparent group-hover:border-[#007eff]/30 h-full justify-between"
                style={{
                  clipPath: "polygon(0 0, 50% 28px, 100% 0, 100% 100%, 0 100%)",
                }}
              >
                {/* Pentagon Shaped Photo Container */}
                <div
                  className="relative w-44 h-48 sm:w-48 sm:h-52 mx-auto mb-6 shrink-0 flex items-center justify-center p-0.5 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    filter: "drop-shadow(0 8px 20px rgba(0, 126, 255, 0.32))",
                  }}
                >
                  <div
                    className="relative w-full h-full bg-gradient-to-b from-[#38bdf8] via-[#007eff] to-[#004ea8] overflow-hidden"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 36%, 82% 100%, 18% 100%, 0% 36%)",
                    }}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      unoptimized
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Subtle bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001837]/30 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Member Info Container with Aligned Rows */}
                <div className="w-full flex-1 flex flex-col justify-between text-center space-y-3">
                  <div className="space-y-1.5 flex flex-col items-center">
                    {/* Name */}
                    <h3 className="text-xl sm:text-2xl lg:text-2xl xl:text-[24px] font-black text-[#001837] tracking-tight group-hover:text-[#007eff] transition-colors duration-200 leading-snug min-h-[32px] sm:min-h-[36px] flex items-center justify-center">
                      {member.name}
                    </h3>

                    {/* Role */}
                    <p className="text-sm sm:text-base lg:text-[14px] xl:text-[15px] font-bold text-slate-600 tracking-normal min-h-[42px] flex items-center justify-center px-1">
                      {member.role}
                    </p>
                  </div>

                  {/* NID Badge Row */}
                  <div className="min-h-[28px] flex items-center justify-center">
                    {member.nidVerified && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black bg-emerald-50 text-emerald-700 px-3.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                        NID VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Bio Row */}
                  <div className="min-h-[58px] flex items-start justify-center pt-1">
                    {member.bio && (
                      <p className="text-xs sm:text-sm lg:text-[13px] xl:text-sm text-slate-500 font-normal line-clamp-3 px-1 max-w-sm leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Container */}
        <div className="mt-40 relative w-full overflow-visible min-h-[440px] md:min-h-[500px] flex items-center justify-end p-6 sm:p-10 md:p-12 mb-24">
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <Image
              src={
                data?.ctaBannerImage ||
                "https://framerusercontent.com/images/hykQu8sbeIwxfZ3UXUa3Ce7b47E.png?width=1880&height=750"
              }
              alt="Professional Floor Cleaning Banner"
              fill
              unoptimized
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />
          </div>

          <div className="absolute -top-2 sm:-top-3 md:-top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex justify-center">
            <div className="w-40 h-40 rounded-full bg-[#007eff] text-white border-8 border-white shadow-xl flex items-center justify-center relative p-1">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full animate-[spin_10s_linear_infinite] absolute inset-0"
              >
                <path
                  id="circlePath"
                  d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                  fill="none"
                />
                <text className="text-[9.2px] font-bold fill-white tracking-widest uppercase">
                  <textPath href="#circlePath" startOffset="0%">
                    {data?.ctaBadgeText || "• CLEANING • DEEP CLEAN • HOME CARE • SANITIZE"}
                  </textPath>
                </text>
              </svg>

              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md relative z-10">
                <div className="w-6 h-6 rounded-md bg-[#ff5b00] flex items-center justify-center text-white rotate-45 shadow-xs">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-3.5 h-3.5 -rotate-45 stroke-[3]"
                  >
                    <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:absolute lg:right-10 lg:top-1/2 lg:-bottom-16 z-20 w-full lg:max-w-md bg-[#007eff] rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-white/20 my-4 lg:my-0 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight mb-6">
                {data?.ctaTitle || "LET'S MOVE YOUR CLEANING WITH PROFESSIONAL"}
              </h3>

              <div className="space-y-3 mb-8">
                {(data?.ctaChecks && data?.ctaChecks.length > 0
                  ? data?.ctaChecks
                  : [
                      data?.ctaCheck1 || "RESIDENTIAL CLEANING SERVICES",
                      data?.ctaCheck2 || "COMMERCIAL CLEANING SOLUTIONS",
                      data?.ctaCheck3 || "ECO-FRIENDLY CLEANING PRODUCTS",
                    ]
                ).map((checkItem, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div>
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white">
                      {checkItem}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link
                href={data?.ctaButtonLink || "/#quote"}
                className="bg-[#001837] hover:bg-[#0b2144] text-white font-bold text-xs uppercase tracking-wider pl-6 hover:pl-10 pr-2 py-2.5 rounded-full inline-flex items-center gap-4 transition-all duration-300 shadow-xl hover:scale-105"
              >
                <span>Get a Quote</span>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#001837]">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
