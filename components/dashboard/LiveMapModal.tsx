"use client";

import React from "react";
import { X, MapPin, Truck, Phone, Navigation, ShieldCheck, Clock } from "lucide-react";

interface LiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingNumber?: string;
  driverName?: string;
  driverPhone?: string;
}

export default function LiveMapModal({
  isOpen,
  onClose,
  bookingNumber = "CLN-2026-8891",
  driverName = "Rahat Karim (Team Captain)",
  driverPhone = "+880 1711-223344",
}: LiveMapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#007eff] flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Live GPS Dispatch Tracking</h3>
              <p className="text-xs text-slate-500 font-medium">Booking Ref #{bookingNumber} • Route: Banani ➔ Gulshan-2</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Visualization View */}
        <div className="relative h-80 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-200">
          {/* Mock Map Background Grid Lines */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(#007eff 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
              backgroundSize: "20px 20px, 40px 40px, 40px 40px",
            }}
          />

          {/* Animated Route Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 150 200 Q 300 120 500 180"
              fill="none"
              stroke="#007eff"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
          </svg>

          {/* Origin Pin */}
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-1 border border-slate-700">
              Cleaner Hub (Banani)
            </div>
            <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
              •
            </div>
          </div>

          {/* Cleaner Van Marker (Animated) */}
          <div className="absolute left-1/2 top-1/3 -translate-y-1/2 flex flex-col items-center animate-bounce">
            <div className="bg-[#007eff] text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <Truck className="w-3.5 h-3.5" /> Van #Dhaka-881
            </div>
            <div className="w-4 h-4 bg-[#007eff] rotate-45 -mt-1" />
          </div>

          {/* Destination Pin */}
          <div className="absolute right-1/4 bottom-1/3 flex flex-col items-center">
            <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-1 shadow-sm">
              Your House (Gulshan-2)
            </div>
            <MapPin className="w-7 h-7 text-emerald-600 fill-emerald-100" />
          </div>
        </div>

        {/* Info & Captain Contact */}
        <div className="p-6 bg-white space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Distance Remaining:</span>
              <strong className="text-slate-900 text-sm font-extrabold">2.4 km</strong>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Estimated Arrival (ETA):</span>
              <strong className="text-[#007eff] text-sm font-extrabold flex items-center gap-1">
                <Clock className="w-4 h-4" /> 10 Minutes
              </strong>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Current Speed:</span>
              <strong className="text-slate-900 text-sm font-extrabold">28 km/h (Moderate Traffic)</strong>
            </div>
          </div>

          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-2xl border border-blue-200 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#007eff] text-white flex items-center justify-center font-bold text-sm">
                RK
              </div>
              <div>
                <p className="font-extrabold text-slate-900">{driverName}</p>
                <p className="text-slate-600 text-[11px]">Cleaner Captain • Verified ID #902</p>
              </div>
            </div>

            <a
              href={`tel:${driverPhone}`}
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call Driver
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
