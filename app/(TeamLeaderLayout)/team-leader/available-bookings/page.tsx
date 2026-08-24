"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  DollarSign,
  Building,
  Home,
  Sparkles,
} from "lucide-react";

interface OpenBooking {
  id: string;
  serviceName: string;
  customerArea: string;
  approxAddress: string;
  specs: string;
  estPayout: number;
  leaderCommissionEst: number;
  timeSlot: string;
  requestStatus: "NONE" | "REQUESTED_ADMIN" | "APPROVED";
}

export default function AvailableBookingsRequestPage() {
  const [openBookings, setOpenBookings] = useState<OpenBooking[]>([
    {
      id: "CLN-2026-9901",
      serviceName: "Post-Construction Deep Cleaning",
      customerArea: "Uttara Sector 4",
      approxAddress: "Villa 18, Road 7, Sector 4, Uttara",
      specs: "3,500 SqFt • Heavy Scrubbing Needed",
      estPayout: 12000,
      leaderCommissionEst: 1200,
      timeSlot: "Tomorrow • 10:00 AM - 02:00 PM",
      requestStatus: "NONE",
    },
    {
      id: "CLN-2026-9902",
      serviceName: "Commercial Showroom Sanitization",
      customerArea: "Tejgaon Industrial Area",
      approxAddress: "Plot 42, Main Road, Tejgaon C/A",
      specs: "5,000 SqFt • Glass Polish & Floor Shine",
      estPayout: 18000,
      leaderCommissionEst: 1800,
      timeSlot: "Day after Tomorrow • 03:00 PM - 07:00 PM",
      requestStatus: "NONE",
    },
    {
      id: "CLN-2026-9903",
      serviceName: "Basic Plan Routine Visit #1",
      customerArea: "Bashundhara R/A",
      approxAddress: "Block D, Road 3, Bashundhara",
      specs: "1,800 SqFt • 3 Bedrooms",
      estPayout: 6000,
      leaderCommissionEst: 300,
      timeSlot: "Today • 04:00 PM - 06:00 PM",
      requestStatus: "REQUESTED_ADMIN",
    },
  ]);

  const handleRequestBooking = (id: string) => {
    setOpenBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, requestStatus: "REQUESTED_ADMIN" } : b))
    );
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              UNASSIGNED BOOKING MARKETPLACE
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Team Request Flow Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Request New Customer Bookings from Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            আন-অ্যাসাইন্ড বুকিং সার্ভিসে কাজ করার জন্য অ্যাডমিনের কাছে টিমের পক্ষ থেকে রিকোয়েস্ট পাঠান। অ্যাডমিন এপ্রুভ করলে বুকিং টিম আলফায় যুক্ত হবে।
          </p>
        </div>
      </div>

      {/* Open Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-[#007eff] uppercase tracking-wider">
                  {b.id}
                </span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-[#007eff]">
                  Open Booking
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{b.serviceName}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">{b.specs}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-slate-800">{b.approxAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{b.timeSlot}</span>
                </div>
              </div>

              {/* Commission Estimate Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">
                    Leader 10% Est. Cut
                  </span>
                  <span className="text-emerald-700 font-black text-base">
                    ৳{b.leaderCommissionEst}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">
                    Total Booking Value
                  </span>
                  <span className="text-slate-900 font-extrabold">
                    ৳{b.estPayout}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {b.requestStatus === "REQUESTED_ADMIN" ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 rounded-2xl bg-amber-50 text-amber-800 font-extrabold text-xs border border-amber-200 flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>Request Pending Admin Approval</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRequestBooking(b.id)}
                  className="w-full py-3 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Team Request to Admin</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
