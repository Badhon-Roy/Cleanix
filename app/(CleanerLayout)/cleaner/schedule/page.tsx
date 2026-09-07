"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  RefreshCw,
  Sparkles,
  Layers,
  AlertCircle,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { fetchMyTeamAssignmentsAPI } from "@/services/teamService";

interface ScheduleItem {
  id: string;
  assignmentId: string;
  date: string;
  rawDate: string;
  time: string;
  customer: string;
  phone: string;
  address: string;
  service: string;
  status: string;
  specs: string;
  addons: string[];
}

export default function CleanerSchedulePage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);

  const loadSchedule = useCallback(async () => {
    try {
      setIsLoading(true);
      const assignments = await fetchMyTeamAssignmentsAPI();
      if (Array.isArray(assignments)) {
        const mapped: ScheduleItem[] = assignments.map((item: any) => {
          const booking = item.booking || {};
          const user = booking.user || {};
          const serviceType = booking.serviceType || {};
          const location = booking.locationId || {};

          // Dynamic specs calculation
          const cFields = booking.customFields || {};
          const specsParts: string[] = [];
          if (cFields.sqft) specsParts.push(`${cFields.sqft} SqFt`);
          if (cFields.bedrooms) specsParts.push(`${cFields.bedrooms} Beds`);
          if (cFields.bathrooms) specsParts.push(`${cFields.bathrooms} Baths`);
          const specsString =
            specsParts.length > 0
              ? specsParts.join(" • ")
              : serviceType.category
              ? `${serviceType.category} Clean`
              : "Cleaning Visit";

          const addonsList: string[] = [];
          if (Array.isArray(booking.selectedAddons)) {
            booking.selectedAddons.forEach((ad: any) => {
              if (typeof ad === "string") addonsList.push(ad);
              else if (ad?.title) addonsList.push(ad.title);
              else if (ad?.name) addonsList.push(ad.name);
            });
          }

          const ref = booking.bookingRef || `#CLN-${String(item._id).slice(-6).toUpperCase()}`;
          const scheduledDateStr = booking.scheduledDate || item.scheduledDate || "";

          return {
            id: ref,
            assignmentId: String(item._id),
            date: scheduledDateStr || "Scheduled Date",
            rawDate: scheduledDateStr,
            time: booking.timeSlot || "Scheduled Slot",
            customer: user.name || "Customer",
            phone: user.phone || "N/A",
            address: booking.address || location.address || "Service Location, Dhaka",
            service: serviceType.title || "Professional Cleaning Care",
            status: (item.status || booking.status || "ASSIGNED").toUpperCase(),
            specs: specsString,
            addons: addonsList,
          };
        });
        setScheduleList(mapped);
      } else {
        setScheduleList([]);
      }
    } catch (err) {
      console.error("Failed to load cleaner schedule:", err);
      setScheduleList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("booking_created", loadSchedule);
    socket.on("booking_updated", loadSchedule);
    socket.on("team_assignment_updated", loadSchedule);
    socket.on("cleaner_updated", loadSchedule);

    return () => {
      socket.off("booking_created");
      socket.off("booking_updated");
      socket.off("team_assignment_updated");
      socket.off("cleaner_updated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loadSchedule]);

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split("T")[0];

  const filteredSchedule = scheduleList.filter((item) => {
    // Tab filtering
    if (activeTab === "today") {
      const isToday =
        item.rawDate === todayStr ||
        item.date.toLowerCase().includes("today") ||
        item.date.toLowerCase().includes("আজ");
      if (!isToday && item.rawDate !== "") return false;
    }
    if (activeTab === "tomorrow") {
      const isTomorrow =
        item.rawDate === tomorrowStr ||
        item.date.toLowerCase().includes("tomorrow") ||
        item.date.toLowerCase().includes("আগামীকাল");
      if (!isTomorrow) return false;
    }
    if (activeTab === "completed") {
      if (item.status !== "COMPLETED") return false;
    }
    if (activeTab === "active") {
      if (item.status === "COMPLETED" || item.status === "CANCELLED") return false;
    }

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = item.id.toLowerCase().includes(q);
      const matchCustomer = item.customer.toLowerCase().includes(q);
      const matchService = item.service.toLowerCase().includes(q);
      const matchAddress = item.address.toLowerCase().includes(q);
      const matchPhone = item.phone.toLowerCase().includes(q);
      return matchId || matchCustomer || matchService || matchAddress || matchPhone;
    }

    return true;
  });

  const activeCount = scheduleList.filter((i) => i.status !== "COMPLETED" && i.status !== "CANCELLED").length;
  const completedCount = scheduleList.filter((i) => i.status === "COMPLETED").length;

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
              ⚡ LIVE TIMETABLE ({scheduleList.length})
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            আপনার অ্যাসাইন করা ক্লিনিং কাজের সময়সূচী, কাস্টমারের ঠিকানা ও গুগল ম্যাপস নেভিগেশন ট্র্যাক করুন।
          </p>
        </div>

        <button
          onClick={loadSchedule}
          disabled={isLoading}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#007eff]" : ""}`} />
          <span>Sync Schedule</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Filter Pills & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: `All Visits (${scheduleList.length})` },
              { id: "active", label: `Active (${activeCount})` },
              { id: "today", label: "Today's Schedule" },
              { id: "completed", label: `Completed (${completedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#007eff] text-white shadow-md shadow-blue-500/25 border border-blue-400"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, client, area..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Schedule List Items */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#007eff] animate-spin mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-slate-500">লোকেশন ও কাজের সময়সূচী লোড হচ্ছে...</p>
          </div>
        ) : filteredSchedule.length > 0 ? (
          <div className="space-y-4">
            {filteredSchedule.map((item) => {
              const isCompleted = item.status === "COMPLETED";
              const isInProgress = item.status === "IN_PROGRESS";
              const isEnRoute = item.status === "EN_ROUTE";

              return (
                <div
                  key={item.assignmentId}
                  className={`p-5 rounded-3xl border transition-all space-y-4 ${
                    isInProgress
                      ? "bg-blue-50/60 border-2 border-blue-400 shadow-sm"
                      : isCompleted
                      ? "bg-slate-50/60 border-slate-200"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                        {item.id}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{item.service}</h4>
                      <span className="text-xs text-slate-500 font-semibold">• {item.specs}</span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : isInProgress
                            ? "bg-blue-50 text-blue-800 border-blue-300 animate-pulse"
                            : isEnRoute
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full text-slate-700 bg-slate-100 border border-slate-200 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#007eff]" />
                        <span>{item.date}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">Time &amp; Client Contact</span>
                      <p className="font-extrabold text-amber-700 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-500" /> {item.time}
                      </p>
                      <p className="font-bold text-slate-900 mt-1">
                        {item.customer} {item.phone !== "N/A" ? `(${item.phone})` : ""}
                      </p>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">Service Location &amp; Maps</span>
                      <p className="font-bold text-slate-900 leading-snug flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{item.address}</span>
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#007eff] hover:underline mt-1 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate via Google Maps ➔</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 px-6 text-center space-y-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#007eff] flex items-center justify-center mx-auto border border-blue-200">
              <Calendar className="w-8 h-8 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">বর্তমানে কোনো শিডিউল করা কাজ নেই</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                টিম লিডার বা এডমিন আপনার ফিল্ড স্কোয়াডে কাজ বরাদ্দ করলে রিয়েল-টাইমে এখানে কাজের শিডিউল ও ঠিকানা দেখতে পাবেন।
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
