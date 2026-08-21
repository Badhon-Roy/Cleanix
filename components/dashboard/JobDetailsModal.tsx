"use client";

import React from "react";
import { X, CheckCircle2, ShieldCheck, Sparkles, MapPin, Calendar, Clock, UserCheck, Droplet, FileCheck } from "lucide-react";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingNumber?: string;
  serviceTitle?: string;
  date?: string;
  address?: string;
}

export default function JobDetailsModal({
  isOpen,
  onClose,
  bookingNumber = "CLN-2026-8891",
  serviceTitle = "Standard Home Deep Cleaning & Sanitization",
  date = "Today, 21 Aug 2026 • 09:00 AM Slot",
  address = "House 42, Road 11, Block D, Gulshan-2, Dhaka",
}: JobDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-mono text-[#007eff] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
              #{bookingNumber}
            </span>
            <h3 className="font-extrabold text-slate-900 text-lg mt-1">{serviceTitle}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Quick Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#007eff]" />
              <span className="text-slate-700 font-semibold">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#007eff]" />
              <span className="text-slate-700 font-semibold truncate">{address}</span>
            </div>
          </div>

          {/* Job Scope & Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#007eff]" /> Detailed Scope of Work Included
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 font-medium">
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>3 Bedrooms Deep Dusting & Floor Polishing</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>2 Bathrooms Anti-Bacterial Sanitization</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Kitchen Countertop & Sink Degreasing</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Living Room Sofa & Carpet Vacuuming</span>
              </div>
            </div>
          </div>

          {/* Certified Eco Chemicals & Safety Standards */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-emerald-900 text-xs flex items-center gap-2">
              <Droplet className="w-4 h-4 text-emerald-700" /> Hospital-Grade Certified Chemicals Used
            </h4>
            <p className="text-emerald-800 text-[11px] font-medium leading-relaxed">
              Diversey Virex II 256 Disinfectant • Non-toxic & Pet Safe • 99.99% Virus & Germ Reduction • Eco-Certified Biodegradable Formula.
            </p>
          </div>

          {/* Assigned Cleaner Team Roster */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#007eff]" /> Assigned Cleaner Team Delta (3 Members)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#007eff] text-white flex items-center justify-center font-extrabold text-xs">
                  RK
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs">Rahat Karim</p>
                  <p className="text-slate-500 text-[10px]">Team Captain</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-extrabold text-xs">
                  MA
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs">Mahmud Al-Hasan</p>
                  <p className="text-slate-500 text-[10px]">Floor Specialist</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-extrabold text-xs">
                  SB
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs">Salma Begum</p>
                  <p className="text-slate-500 text-[10px]">Sanitization Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#007eff] text-white font-extrabold text-xs"
          >
            Close Job Specifications
          </button>
        </div>
      </div>
    </div>
  );
}
