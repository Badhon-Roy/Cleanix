"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Truck,
  Calendar,
  Filter,
  Search,
  ChevronRight,
} from "lucide-react";

export default function CleanerSchedulePage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const scheduleList = [
    {
      id: "CLN-2026-8891",
      date: "Today, Aug 21, 2026",
      time: "10:00 AM - 12:30 PM",
      customer: "Tanvir Hasan",
      phone: "+880 1711-223344",
      address: "House 42, Road 11, Block D, Gulshan-2",
      service: "VIP Standard Deep Cleaning",
      status: "EN_ROUTE",
    },
    {
      id: "CLN-2026-8892",
      date: "Today, Aug 21, 2026",
      time: "02:00 PM - 04:30 PM",
      customer: "Sabrina Rahman",
      phone: "+880 1819-998877",
      address: "Level 4, City Tower, Commercial Avenue, Motijheel",
      service: "Commercial Office Cleaning",
      status: "ASSIGNED",
    },
    {
      id: "CLN-2026-8894",
      date: "Tomorrow, Aug 22, 2026",
      time: "09:00 AM - 11:30 AM",
      customer: "Mahmudul Haq",
      phone: "+880 1722-445566",
      address: "Flat 4A, Concord Heights, Dhanmondi 27",
      service: "Residential Bi-Weekly Clean",
      status: "ASSIGNED",
    },
    {
      id: "CLN-2026-8895",
      date: "Tomorrow, Aug 22, 2026",
      time: "03:00 PM - 05:30 PM",
      customer: "Nusrat Jahan",
      phone: "+880 1988-112233",
      address: "House 18, Road 4, Baridhara DOHS",
      service: "Post-Construction Cleaning",
      status: "ASSIGNED",
    },
    {
      id: "CLN-2026-8890",
      date: "Yesterday, Aug 20, 2026",
      time: "08:00 AM - 09:45 AM",
      customer: "Anisur Rahman",
      phone: "+880 1912-334455",
      address: "Apartment 5B, Navana Tower, Banani",
      service: "Move-In / Move-Out Deep Clean",
      status: "COMPLETED",
    },
  ];

  const filteredSchedule = scheduleList.filter((item) => {
    if (activeTab === "today") return item.date.includes("Today");
    if (activeTab === "tomorrow") return item.date.includes("Tomorrow");
    if (activeTab === "completed") return item.status === "COMPLETED";
    return true;
  });

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              Assigned Field Schedule
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ LIVE TIMETABLE
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            View your assigned cleaning visits timeline, client addresses, and time slots.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Filter Pills Header */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 pb-5">
          {[
            { id: "all", label: "All Scheduled Visits" },
            { id: "today", label: "Today's Visits" },
            { id: "tomorrow", label: "Tomorrow" },
            { id: "completed", label: "Completed History" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 via-[#007eff] to-blue-700 text-white shadow-md shadow-blue-500/25 border border-blue-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Schedule Timetable List */}
        <div className="space-y-4">
          {filteredSchedule.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                    #{item.id}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">{item.service}</h4>
                </div>

                <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  {item.date}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[11px]">Time & Customer</span>
                  <p className="font-extrabold text-amber-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" /> {item.time}
                  </p>
                  <p className="font-bold text-slate-900 mt-1">{item.customer} ({item.phone})</p>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <span className="font-bold text-slate-400 uppercase text-[11px]">Address & Navigation</span>
                  <p className="font-bold text-slate-900 leading-snug flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{item.address}</span>
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#007eff] hover:underline mt-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate on Google Maps ➔</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
