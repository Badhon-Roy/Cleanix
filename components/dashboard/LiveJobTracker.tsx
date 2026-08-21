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
  Navigation,
} from "lucide-react";

export interface BookingStatusStep {
  id: "SCHEDULED" | "ASSIGNED" | "EN_ROUTE" | "IN_PROGRESS" | "COMPLETED";
  label: string;
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
  serviceName = "Standard Home Deep Cleaning & Sanitization",
  address = "House 42, Road 11, Block D, Gulshan-2, Dhaka",
}: LiveJobTrackerProps) {
  const [currentStep, setCurrentStep] = useState<number>(2); // Default to "EN_ROUTE" (index 2)

  const steps: BookingStatusStep[] = [
    {
      id: "SCHEDULED",
      label: "Scheduled",
      desc: "Booking locked for 09:00 AM slot",
      time: "08:30 AM",
    },
    {
      id: "ASSIGNED",
      label: "Cleaner Assigned",
      desc: "Team Delta (3 Cleaners) dispatched",
      time: "08:45 AM",
    },
    {
      id: "EN_ROUTE",
      label: "En Route",
      desc: "Cleaners traveling to Gulshan-2",
      time: "09:05 AM (ETA 10 mins)",
    },
    {
      id: "IN_PROGRESS",
      label: "In Progress",
      desc: "Cleaning & steam sanitization active",
      time: "Expected 09:15 AM - 11:30 AM",
    },
    {
      id: "COMPLETED",
      label: "Completed",
      desc: "Proof of work uploaded & verified",
      time: "Pending completion",
    },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 text-slate-900">
      {/* Top Bar: Booking ID & Interactive Demo Stepper Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200 tracking-wider">
              Live Job Tracking
            </span>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              #{bookingNumber}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold mt-2 text-[#0d274c]">{serviceName}</h3>
          <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#007eff] flex-shrink-0" />
            <span>{address}</span>
          </p>
        </div>

        {/* Interactive Step Simulator */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto text-xs">
          <span className="text-[11px] font-bold text-slate-500 px-2 hidden md:inline">Simulate Status:</span>
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                currentStep === idx
                  ? "bg-[#007eff] text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Stepper Bar */}
      <div className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const isPassed = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-start relative z-10">
                {/* Step Circle */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition-all duration-300 ${
                      isPassed
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-[#007eff] text-white ring-4 ring-blue-100 animate-pulse"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {isPassed ? <CheckCircle className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-extrabold tracking-wide px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      Active
                    </span>
                  )}
                </div>

                {/* Step Text */}
                <h4
                  className={`text-xs font-bold transition-colors ${
                    isPassed || isCurrent ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-tight font-medium">
                  {step.desc}
                </p>
                <span className="text-[10px] font-mono text-blue-600 font-bold mt-1">{step.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Status Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        {/* Cleaner Team Card (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Assigned Cleaner Team
            </h4>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Background Verified
            </span>
          </div>

          <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-slate-200">
            {/* Captain Avatar */}
            <div className="relative w-14 h-14 rounded-2xl bg-[#007eff] flex items-center justify-center font-extrabold text-lg text-white overflow-hidden flex-shrink-0">
              RK
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-sm text-slate-900">Rahat Karim (Team Captain)</h5>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  ★ 4.9 <span className="text-[10px] text-slate-500 font-normal">(142 jobs)</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Team Delta • 3 Professional Cleaners • Eco-Chemicals Certified
              </p>
              <div className="flex items-center gap-3 mt-2">
                <a
                  href="tel:+8801711223344"
                  className="bg-[#007eff] hover:bg-[#0066ee] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Captain
                </a>
                <span className="text-xs text-slate-500 font-mono font-bold">ID: CLN-STAFF-902</span>
              </div>
            </div>
          </div>

          {/* Current ETA Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 text-[#007eff] flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Status: En Route in Cleaner Van #Dhaka-Metro-881</p>
                <p className="text-slate-600 text-[11px] font-medium">Estimated arrival in 10 minutes (09:05 AM)</p>
              </div>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-[#007eff] hover:underline font-extrabold text-xs">
              <Navigation className="w-3.5 h-3.5" /> Live Map
            </button>
          </div>
        </div>

        {/* Live GPS Preview & Proof Preview (Col 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
          <div>
            <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider flex items-center gap-1.5 mb-3">
              <Camera className="w-4 h-4 text-[#007eff]" /> Proof of Work Gallery
            </h4>
            <p className="text-xs text-slate-600 mb-3 font-medium">
              Cleaners will upload Before & After photos directly during job execution.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative h-24 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-500 text-xs font-mono p-2 text-center overflow-hidden">
                <span className="relative z-10 text-[11px] text-slate-800 font-sans font-bold">
                  Before Photo
                </span>
                <span className="relative z-10 text-[9px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded mt-1 border border-amber-200">
                  Uploaded at 09:16 AM
                </span>
              </div>

              <div className="relative h-24 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-500 text-xs font-mono p-2 text-center overflow-hidden">
                <span className="relative z-10 text-[11px] text-slate-800 font-sans font-bold">
                  After Photo
                </span>
                <span className="relative z-10 text-[9px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded mt-1 border border-slate-200">
                  Pending Completion
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors">
              <span>View Detailed Job Specifications</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
