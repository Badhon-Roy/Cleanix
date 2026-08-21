"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  MapPin,
  Phone,
  ShieldCheck,
  UserCheck,
  Truck,
  Camera,
  ChevronRight,
  ChevronsRight,
  Navigation,
  Sparkles,
  Clock,
} from "lucide-react";
import LiveMapModal from "@/components/dashboard/LiveMapModal";
import JobDetailsModal from "@/components/dashboard/JobDetailsModal";

export interface BookingStatusStep {
  id: "SCHEDULED" | "ASSIGNED" | "EN_ROUTE" | "IN_PROGRESS" | "COMPLETED";
  label: string;
  bnLabel: string;
  desc: string;
  time: string;
}

interface LiveJobTrackerProps {
  bookingNumber?: string;
  serviceName?: string;
  address?: string;
}

export default function LiveJobTracker({
  bookingNumber = "CLN-2026-8891",
  serviceName = "Standard Home Deep Cleaning & Anti-Bacterial Sanitization",
  address = "House 42, Road 11, Block D, Gulshan-2, Dhaka",
}: LiveJobTrackerProps) {
  const [currentStep] = useState<number>(2); // Default to "EN_ROUTE" (index 2)
  const [mapModalOpen, setMapModalOpen] = useState<boolean>(false);
  const [specsModalOpen, setSpecsModalOpen] = useState<boolean>(false);

  const steps: BookingStatusStep[] = [
    {
      id: "SCHEDULED",
      label: "Scheduled",
      bnLabel: "বুকিং নিশ্চিত",
      desc: "Booking locked for 09:00 AM slot",
      time: "08:30 AM",
    },
    {
      id: "ASSIGNED",
      label: "Cleaner Assigned",
      bnLabel: "টিম বরাদ্দকৃত",
      desc: "Team Delta (3 Cleaners) dispatched",
      time: "08:45 AM",
    },
    {
      id: "EN_ROUTE",
      label: "En Route",
      bnLabel: "টিম রওনা দিয়েছে",
      desc: "Cleaners traveling to Gulshan-2",
      time: "09:05 AM (ETA 10 mins)",
    },
    {
      id: "IN_PROGRESS",
      label: "In Progress",
      bnLabel: "পরিষ্কার কাজ চলছে",
      desc: "Deep cleaning & steam sanitization active",
      time: "Expected 09:15 AM - 11:30 AM",
    },
    {
      id: "COMPLETED",
      label: "Completed",
      bnLabel: "কাজ সম্পন্ন",
      desc: "Proof of work uploaded & verified",
      time: "Pending completion",
    },
  ];

  return (
    <>
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 space-y-6">
        {/* Top Header: Booking Ref */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold uppercase px-4 py-1.5 rounded-full bg-blue-50 text-[#007eff] border border-blue-200 tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#007eff]" />
                LIVE JOB TRACKER • কাজ ট্র্যাকিং
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                #{bookingNumber}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0d274c] leading-tight">
              {serviceName}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 flex items-center gap-2 font-semibold">
              <MapPin className="w-4 h-4 text-[#007eff] flex-shrink-0" />
              <span>{address}</span>
            </p>
          </div>
        </div>

        {/* Stepper Timeline with Pointed Chevron Arrow Connectors (>) */}
        <div className="py-2">
          {/* Top Progress Bar Line */}
          <div className="hidden md:block mb-6 px-4">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-emerald-500 via-[#007eff] to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Cards with Pointed Chevron Right Badges (>) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 relative">
            {steps.map((step, idx) => {
              const isPassed = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isFuture = idx > currentStep;
              const isLast = idx === steps.length - 1;

              return (
                <div key={step.id} className="relative flex flex-col justify-between">
                  {/* Step Card Container */}
                  <div
                    className={`h-full p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 relative ${isPassed
                        ? "bg-gradient-to-br from-emerald-50/90 to-white border-emerald-300 text-slate-900"
                        : isCurrent
                          ? "bg-gradient-to-br from-blue-50 to-white border-[#007eff] ring-2 ring-blue-300 text-slate-900"
                          : "bg-slate-50/70 border-slate-200 text-slate-500"
                      }`}
                  >
                    {/* Header: Circle Icon & Status Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 ${isPassed
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                              ? "bg-[#007eff] text-white ring-4 ring-blue-100 animate-pulse"
                              : "bg-slate-200 text-slate-400"
                          }`}
                      >
                        {isPassed ? <CheckCircle className="w-6 h-6 stroke-[2.5]" /> : idx + 1}
                      </div>

                      {isCurrent && (
                        <span className="text-xs uppercase font-black tracking-wide px-3 py-1 rounded-full bg-[#007eff] text-white flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> রানিং Step
                        </span>
                      )}

                      {isPassed && (
                        <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Done ✓
                        </span>
                      )}
                    </div>

                    {/* Step Titles & Description */}
                    <div>
                      <h4
                        className={`text-base sm:text-lg font-black leading-tight ${isFuture ? "text-slate-500" : "text-slate-900"
                          }`}
                      >
                        {step.label}
                      </h4>
                      <span
                        className={`text-xs font-extrabold block mt-0.5 ${isPassed
                            ? "text-emerald-700"
                            : isCurrent
                              ? "text-[#007eff]"
                              : "text-slate-400"
                          }`}
                      >
                        ({step.bnLabel})
                      </span>

                      <p
                        className={`text-xs sm:text-sm mt-2 font-medium leading-snug ${isFuture ? "text-slate-400" : "text-slate-600"
                          }`}
                      >
                        {step.desc}
                      </p>
                    </div>

                    {/* Modern Professional Timestamp Badge */}
                    <div className="pt-2">
                      <div
                        className={`inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-xl border transition-all ${isPassed
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : isCurrent
                              ? "bg-blue-50 text-[#007eff] border-blue-300 font-black"
                              : "bg-slate-100/90 text-slate-500 border-slate-200"
                          }`}
                      >
                        {isCurrent ? (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007eff] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007eff]"></span>
                          </span>
                        ) : (
                          <Clock
                            className={`w-3.5 h-3.5 flex-shrink-0 ${isPassed ? "text-emerald-600" : "text-slate-400"
                              }`}
                          />
                        )}
                        <span>{step.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* POINTED CHEVRON RIBBON CONNECTOR BADGE (>) (Desktop/Tablet) */}
                  {!isLast && (
                    <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 items-center">
                      <div
                        className={`pr-3 pl-2 py-1.5 flex items-center justify-center font-extrabold text-white transition-all duration-300 border-y-2 border-l-2 border-white filter drop-shadow-sm ${isPassed
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                            : isCurrent
                              ? "bg-gradient-to-r from-[#007eff] via-blue-600 to-cyan-500 animate-pulse"
                              : "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-700"
                          }`}
                        style={{
                          clipPath: "polygon(0% 0%, 72% 0%, 100% 50%, 72% 100%, 0% 100%)",
                          borderRadius: "6px 0 0 6px",
                        }}
                      >
                        <ChevronsRight className="w-5 h-5 stroke-[3]" />
                      </div>
                    </div>
                  )}

                  {/* Mobile Flow Chevron Indicator (V-shaped pointing down) */}
                  {!isLast && (
                    <div className="md:hidden flex justify-center py-2.5">
                      <div
                        className={`pb-2 pt-1 px-2.5 flex items-center justify-center border-2 border-white ${isPassed
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                            : isCurrent
                              ? "bg-gradient-to-r from-[#007eff] to-cyan-500 text-white animate-pulse"
                              : "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-600"
                          }`}
                        style={{
                          clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)",
                        }}
                      >
                        <ChevronsRight className="w-4 h-4 rotate-90 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cleaner Team & GPS Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
          {/* Assigned Cleaner Team Card (Col 7) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs sm:text-sm uppercase font-black text-slate-600 tracking-wider flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                ASSIGNED CLEANER TEAM • নিয়োজিত পরিচ্ছন্নতা কর্মী
              </h4>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Police Verified ✓
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200">
              {/* Captain Avatar */}
              <div className="relative w-16 h-16 rounded-2xl bg-[#007eff] flex items-center justify-center font-black text-xl text-white flex-shrink-0">
                RK
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-base sm:text-lg text-slate-900">
                    Rahat Karim <span className="text-xs font-bold text-slate-500">(টিম ক্যাপ্টেন)</span>
                  </h5>
                  <span className="text-xs sm:text-sm font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    ★ 4.9 <span className="text-slate-500 font-normal">(142+ কাজ)</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold">
                  Team Delta • ৩ জন অভিজ্ঞ পরিচ্ছন্নতা কর্মী • Eco-Chemical Certified
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <a
                    href="tel:+8801711223344"
                    className="bg-[#007eff] hover:bg-[#0066ee] text-white text-xs sm:text-sm font-extrabold px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" /> <span>Call Captain (কল করুন)</span>
                  </a>
                  <span className="text-xs text-slate-500 font-mono font-bold">ID: CLN-STAFF-902</span>
                </div>
              </div>
            </div>

            {/* Current ETA Banner */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-[#007eff] flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm">
                    Status: Cleaners En Route (ক্লিনার টিম রাস্তায় রয়েছে)
                  </p>
                  <p className="text-slate-600 text-xs font-semibold">
                    Van #Dhaka-Metro-881 • আনুমানিক পৌঁছানোর সময়: ১০ মিনিট (09:05 AM)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMapModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-[#007eff] hover:underline font-extrabold text-xs sm:text-sm bg-white px-3.5 py-2 rounded-xl border border-blue-200 cursor-pointer"
              >
                <Navigation className="w-4 h-4" /> <span>Live Map (লাইভ ম্যাপ)</span>
              </button>
            </div>
          </div>

          {/* Proof of Work & Job Specs (Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 border-t lg:border-t-0 lg:border-l border-slate-200 pt-5 lg:pt-0 lg:pl-6">
            <div>
              <h4 className="text-xs sm:text-sm uppercase font-black text-slate-600 tracking-wider flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-[#007eff]" /> PROOF OF WORK • কাজের ফটো প্রুফ
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mb-3 font-semibold">
                কাজের আগে ও পরের ছবি সরাসরি এখানে আপলোড করা হবে।
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => alert("Before photo gallery preview: Living room floor before deep clean.")}
                  className="relative h-28 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-100 flex flex-col items-center justify-center p-3 text-center transition-colors group"
                >
                  <span className="text-xs sm:text-sm text-slate-900 font-extrabold group-hover:text-[#007eff]">
                    Before Photo (কাজের পূর্বে)
                  </span>
                  <span className="text-[11px] text-amber-800 font-extrabold bg-amber-100 px-2.5 py-1 rounded-full mt-2 border border-amber-200">
                    Uploaded 09:16 AM
                  </span>
                </div>

                <div
                  onClick={() => alert("After photo preview: Cleaning in progress. Final photo will unlock upon job completion.")}
                  className="relative h-28 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-100 flex flex-col items-center justify-center p-3 text-center transition-colors group"
                >
                  <span className="text-xs sm:text-sm text-slate-900 font-extrabold group-hover:text-[#007eff]">
                    After Photo (কাজের শেষে)
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full mt-2 border border-slate-200">
                    Pending Completion
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSpecsModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:border-blue-300 cursor-pointer"
              >
                <span>View Detailed Job Specifications (কাজের বিস্তারিত তথ্য)</span>
                <ChevronRight className="w-4 h-4 text-[#007eff]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LiveMapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        bookingNumber={bookingNumber}
      />

      <JobDetailsModal
        isOpen={specsModalOpen}
        onClose={() => setSpecsModalOpen(false)}
        bookingNumber={bookingNumber}
        serviceTitle={serviceName}
        address={address}
      />
    </>
  );
}
