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
import CustomerProofReviewModal from "@/components/dashboard/CustomerProofReviewModal";

export interface BookingStatusStep {
  id: "SCHEDULED" | "ASSIGNED" | "EN_ROUTE" | "IN_PROGRESS" | "COMPLETED";
  label: string;
  bnLabel: string;
  desc: string;
  time: string;
}

interface LiveJobTrackerProps {
  bookingId?: string;
  bookingNumber?: string;
  serviceName?: string;
  address?: string;
  status?: string;
  cleanerTeam?: string;
  assignedTeam?: any;
  assignedCleaners?: any[];
  scheduledDate?: string;
  timeSlot?: string;
  proofOfWork?: any;
  onRefresh?: () => void;
}

export default function LiveJobTracker({
  bookingId = "",
  bookingNumber = "",
  serviceName = "",
  address = "",
  status = "CONFIRMED",
  cleanerTeam,
  assignedTeam,
  assignedCleaners,
  scheduledDate,
  timeSlot,
  proofOfWork,
  onRefresh,
}: LiveJobTrackerProps) {
  // Calculate step index dynamically based on backend booking status
  let currentStep = 0; // Default: SCHEDULED
  const upperStatus = String(status || "CONFIRMED").toUpperCase();

  if (upperStatus === "PENDING") {
    currentStep = 0; // Step 1: Pending Team Assignment
  } else if (upperStatus === "SCHEDULED" || upperStatus === "CONFIRMED") {
    currentStep = 1; // Step 2: Cleaner allocation in progress
  } else if (upperStatus === "ASSIGNED") {
    currentStep = 2; // Step 2: Cleaner Assigned completed (DONE ✓ Green), Step 3 (En Route) is active
  } else if (upperStatus === "EN_ROUTE") {
    currentStep = 2; // Step 3: En Route is active
  } else if (upperStatus === "IN_PROGRESS") {
    currentStep = 3; // Step 4: In Progress is active
  } else if (upperStatus === "COMPLETION_REQUESTED") {
    currentStep = 4; // Step 5: Awaiting Customer Approval
  } else if (upperStatus === "COMPLETED") {
    currentStep = 5; // Step 5: Completed (All steps done)
  }

  const [mapModalOpen, setMapModalOpen] = useState<boolean>(false);
  const [specsModalOpen, setSpecsModalOpen] = useState<boolean>(false);
  const [proofReviewOpen, setProofReviewOpen] = useState<boolean>(false);

  const activeTeamName = cleanerTeam || (assignedTeam ? assignedTeam.teamName : null);
  const cleanerNames = Array.isArray(assignedCleaners) && assignedCleaners.length > 0
    ? assignedCleaners
        .filter((c: any) => c != null)
        .map((c: any) => (typeof c === "object" ? c.name : c))
        .filter(Boolean)
        .join(", ")
    : null;

  const step2Desc = cleanerNames
    ? `${activeTeamName ? activeTeamName + " • " : ""}Cleaners: ${cleanerNames}`
    : activeTeamName
    ? `${activeTeamName} assigned to job`
    : "Cleaner Team Dispatched";

  const steps: BookingStatusStep[] = [
    {
      id: "SCHEDULED",
      label: "Scheduled",
      bnLabel: "বুকিং নিশ্চিত",
      desc:
        upperStatus === "PENDING"
          ? "অ্যাডমিন টিম বরাদ্দের অপেক্ষায় রয়েছে"
          : scheduledDate
          ? `Scheduled for ${scheduledDate}`
          : "Booking confirmed & scheduled",
      time:
        upperStatus === "PENDING"
          ? "Awaiting Team Allocation"
          : timeSlot || "09:00 AM Slot",
    },
    {
      id: "ASSIGNED",
      label: "Cleaner Assigned",
      bnLabel: "টিম ও ক্লিনার বরাদ্দকৃত",
      desc:
        upperStatus === "PENDING"
          ? "ক্লিনার অ্যাসাইনমেন্ট পেন্ডিং"
          : step2Desc,
      time:
        upperStatus === "PENDING"
          ? "Pending"
          : upperStatus === "SCHEDULED" || upperStatus === "CONFIRMED"
          ? cleanerNames
            ? `Assigned (${cleanerNames}) ✓`
            : "Allocating Cleaners..."
          : cleanerNames
          ? `Assigned (${cleanerNames}) ✓`
          : "Assigned ✓",
    },
    {
      id: "EN_ROUTE",
      label: "En Route",
      bnLabel: "টিম রওনা দিয়েছে",
      desc:
        upperStatus === "ASSIGNED"
          ? "Cleaners allocated • Awaiting departure"
          : "Cleaners traveling to location",
      time:
        upperStatus === "ASSIGNED"
          ? "Awaiting Departure"
          : upperStatus === "EN_ROUTE"
          ? "En Route (ETA 10m)"
          : currentStep > 2
          ? "Arrived ✓"
          : "Pending",
    },
    {
      id: "IN_PROGRESS",
      label: "In Progress",
      bnLabel: "পরিষ্কার কাজ চলছে",
      desc: "Deep cleaning & sanitization active",
      time:
        currentStep === 3
          ? "Cleaning Active"
          : upperStatus === "COMPLETION_REQUESTED" || currentStep > 3
          ? "Cleaned ✓"
          : "Pending",
    },
    {
      id: "COMPLETED",
      label: upperStatus === "COMPLETION_REQUESTED" ? "Review & Confirm" : "Completed",
      bnLabel: upperStatus === "COMPLETION_REQUESTED" ? "অনুমোদন করুন" : "কাজ সম্পন্ন",
      desc:
        upperStatus === "COMPLETION_REQUESTED"
          ? "Cleaner uploaded proof photos"
          : "Proof of work verified",
      time:
        upperStatus === "COMPLETION_REQUESTED"
          ? "Awaiting Your Confirmation"
          : upperStatus === "COMPLETED"
          ? "Job Completed ✓"
          : "Pending Completion",
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

        {/* Completion Confirmation Request Alert Banner for Customer */}
        {upperStatus === "COMPLETION_REQUESTED" && (
          <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-blue-500/10 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-900 text-base sm:text-lg">
                    ক্লিনার কাজ সম্পন্ন করেছেন ও প্রুফ ছবি জমা দিয়েছেন!
                  </h4>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    অ্যাকশন প্রয়োজন
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  বিফোর/আফটার ছবি ও চেকলিস্ট পর্যালোচনা করে সার্ভিসটি সম্পন্ন করতে ও রেটিং দিতে নিচের বাটনে ক্লিক করুন।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setProofReviewOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl border border-emerald-500 shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto hover:scale-[1.02]"
            >
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              <span>কাজের ছবি যাচাই ও সম্পন্ন করুন</span>
            </button>
          </div>
        )}

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
                {assignedTeam?.leader?.name
                  ? assignedTeam.leader.name.slice(0, 2).toUpperCase()
                  : cleanerTeam
                    ? cleanerTeam.slice(0, 2).toUpperCase()
                    : "CT"}
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-base sm:text-lg text-slate-900">
                    {assignedTeam?.leader?.name || (cleanerTeam && cleanerTeam !== "Unassigned" ? cleanerTeam : "Team Captain Pending")}{" "}
                    <span className="text-xs font-bold text-slate-500">(টিম ক্যাপ্টেন)</span>
                  </h5>
                  <span className="text-xs sm:text-sm font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    ★ 4.9 <span className="text-slate-500 font-normal">(Verified)</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold">
                  {assignedTeam?.teamName || (cleanerTeam && cleanerTeam !== "Unassigned" ? cleanerTeam : "Cleaner Staff Allocation in Progress")} • Eco-Chemical Certified
                </p>
                <div className="flex items-center gap-4 pt-2 flex-wrap">
                  {assignedTeam?.leader?.phone ? (
                    <a
                      href={`tel:${assignedTeam.leader.phone}`}
                      className="bg-[#007eff] hover:bg-[#0066ee] text-white text-xs sm:text-sm font-extrabold px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                    >
                      <Phone className="w-4 h-4" /> <span>Call Captain ({assignedTeam.leader.phone})</span>
                    </a>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Contact Phone Available on Assign
                    </span>
                  )}
                  {assignedTeam?.teamCode && (
                    <span className="text-xs text-slate-500 font-mono font-bold">
                      ID: {assignedTeam.teamCode}
                    </span>
                  )}
                </div>

                {/* Assigned Squad Cleaners Section */}
                {Array.isArray(assignedCleaners) && assignedCleaners.length > 0 && (
                  <div className="space-y-2 pt-3 mt-3 border-t border-slate-100">
                    <span className="text-[11px] uppercase font-extrabold text-slate-700 tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#007eff]" />
                      নিয়োগকৃত স্কোয়াড পরিচ্ছন্নতাকর্মী ({assignedCleaners.length} জন):
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {assignedCleaners.map((c: any, idx: number) => {
                        const cName = typeof c === "object" ? c.name : c;
                        const cPhone = typeof c === "object" ? c.phone : null;
                        const cRating = typeof c === "object" ? c.rating || 4.9 : 4.9;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 bg-blue-50/80 border border-blue-200 py-1.5 px-3 rounded-xl shadow-2xs"
                          >
                            <div className="w-7 h-7 rounded-full bg-[#007eff] text-white flex items-center justify-center font-extrabold text-xs">
                              {cName ? cName.slice(0, 1).toUpperCase() : "C"}
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-900 leading-tight">
                                {cName}
                              </p>
                              {cPhone && (
                                <a
                                  href={`tel:${cPhone}`}
                                  className="text-[10px] text-blue-600 font-bold hover:underline"
                                >
                                  {cPhone}
                                </a>
                              )}
                            </div>
                            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md">
                              ★ {cRating}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Current Status & ETA Banner */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-[#007eff] flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm">
                    Status: {upperStatus === "CONFIRMED" || upperStatus === "PENDING"
                      ? "Booking Confirmed & Locked (বুকিং নিশ্চিত হয়েছে)"
                      : upperStatus === "ASSIGNED"
                        ? "Cleaner Team Assigned (টিম বরাদ্দ হয়েছে)"
                        : upperStatus === "EN_ROUTE"
                          ? "Cleaners En Route (ক্লিনার টিম রাস্তায় রয়েছে)"
                          : upperStatus === "IN_PROGRESS"
                            ? "Cleaning In Progress (কাজ শুরু হয়েছে)"
                            : "Job Completed (কাজ সম্পন্ন হয়েছে)"}
                  </p>
                  <p className="text-slate-600 text-xs font-semibold">
                    Scheduled Date: {scheduledDate || "Today"} • Slot: {timeSlot || "Scheduled Slot"}
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

      <CustomerProofReviewModal
        isOpen={proofReviewOpen}
        onClose={() => setProofReviewOpen(false)}
        bookingId={bookingId}
        bookingRef={bookingNumber}
        serviceTitle={serviceName}
        customerAddress={address}
        proofOfWork={proofOfWork}
        onCompletionSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </>
  );
}
