"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Navigation,
  Camera,
  Star,
  DollarSign,
  User,
  UserCheck,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  ChevronRight,
  Search,
  Building,
  Calendar,
  X,
  Check,
  Wallet,
  Eye,
  Sliders,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  status: "ON_DUTY" | "OFF_DUTY" | "IN_SERVICE";
  rating: number;
  completedJobs: number;
  currentJob?: string;
  singleTeamVerified: boolean;
}

interface TeamBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  area: string;
  serviceType: string;
  packageType: string;
  timeSlot: string;
  specs: string;
  assignedCleaners: string[];
  status: "PENDING_DISPATCH" | "IN_PROGRESS" | "COMPLETED";
  totalPrice: number;
  leaderCommission: number;
  cleanerPoolShare: number;
  addons?: string[];
}

export default function TeamLeaderOverviewPage() {
  // Team Roster State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "CLN-101",
      name: "Asif Khan",
      phone: "+880 1711-123456",
      status: "IN_SERVICE",
      rating: 4.9,
      completedJobs: 48,
      currentJob: "CLN-2026-8891 (Gulshan-2)",
      singleTeamVerified: true,
    },
    {
      id: "CLN-102",
      name: "Kamrul Islam",
      phone: "+880 1819-234567",
      status: "ON_DUTY",
      rating: 4.8,
      completedJobs: 35,
      singleTeamVerified: true,
    },
    {
      id: "CLN-103",
      name: "Sajjad Hossain",
      phone: "+880 1912-345678",
      status: "ON_DUTY",
      rating: 4.9,
      completedJobs: 52,
      singleTeamVerified: true,
    },
    {
      id: "CLN-104",
      name: "Mahfuzur Rahman",
      phone: "+880 1611-456789",
      status: "OFF_DUTY",
      rating: 4.7,
      completedJobs: 29,
      singleTeamVerified: true,
    },
  ]);

  // Team Assigned Bookings State
  const [teamBookings, setTeamBookings] = useState<TeamBooking[]>([
    {
      id: "CLN-2026-8891",
      customerName: "Tanvir Hasan",
      customerPhone: "+880 1711-223344",
      address: "House 42, Road 11, Block D, Gulshan-2",
      area: "Gulshan-2",
      serviceType: "Standard Plan Visit #2 - Bi-weekly",
      packageType: "Standard Plan (৳14,000/mo)",
      timeSlot: "10:00 AM - 01:00 PM",
      specs: "2,400 SqFt • 3 Bedrooms • 3 Bathrooms",
      assignedCleaners: ["Asif Khan", "Kamrul Islam"],
      status: "IN_PROGRESS",
      totalPrice: 14000,
      leaderCommission: 350,
      cleanerPoolShare: 1400,
      addons: ["Oven Wash", "Sofa Shampoo"],
    },
    {
      id: "CLN-2026-8894",
      customerName: "Mahmudul Haq",
      customerPhone: "+880 1822-445566",
      address: "Suite 7B, Concord Tower, Banani C/A",
      area: "Banani",
      serviceType: "Commercial Office Deep Clean",
      packageType: "Custom One-Time Booking",
      timeSlot: "02:30 PM - 05:30 PM",
      specs: "4,500 SqFt • Open Floor & Chimney",
      assignedCleaners: [],
      status: "PENDING_DISPATCH",
      totalPrice: 8500,
      leaderCommission: 850,
      cleanerPoolShare: 3400,
      addons: ["Floor Shine Treatment", "Glass Polish"],
    },
    {
      id: "CLN-2026-8890",
      customerName: "Anisur Rahman",
      customerPhone: "+880 1912-334455",
      address: "Apartment 5B, Navana Tower, Gulshan-1",
      area: "Gulshan-1",
      serviceType: "Premium Plan Visit #4 - Master Clean",
      packageType: "Premium Plan (৳30,000/mo)",
      timeSlot: "08:00 AM - 10:45 AM",
      specs: "1,800 SqFt • 2 Bedrooms • 2 Bathrooms",
      assignedCleaners: ["Sajjad Hossain", "Asif Khan"],
      status: "COMPLETED",
      totalPrice: 30000,
      leaderCommission: 375,
      cleanerPoolShare: 1500,
      addons: ["Fridge Deep Clean"],
    },
  ]);

  // Modal State for Dispatching Cleaners
  const [dispatchModalBooking, setDispatchModalBooking] = useState<TeamBooking | null>(null);
  const [selectedCleanerNames, setSelectedCleanerNames] = useState<string[]>([]);

  // Search Query Filter
  const [searchQuery, setSearchQuery] = useState("");

  const activeOnDutyCount = teamMembers.filter((m) => m.status !== "OFF_DUTY").length;
  const pendingDispatchCount = teamBookings.filter((b) => b.status === "PENDING_DISPATCH").length;
  const completedCount = teamBookings.filter((b) => b.status === "COMPLETED").length;

  const openDispatchModal = (booking: TeamBooking) => {
    setDispatchModalBooking(booking);
    setSelectedCleanerNames(booking.assignedCleaners);
  };

  const toggleCleanerInModal = (name: string) => {
    setSelectedCleanerNames((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleSaveDispatch = () => {
    if (!dispatchModalBooking) return;
    setTeamBookings((prev) =>
      prev.map((b) =>
        b.id === dispatchModalBooking.id
          ? {
              ...b,
              assignedCleaners: selectedCleanerNames,
              status: selectedCleanerNames.length > 0 ? "IN_PROGRESS" : "PENDING_DISPATCH",
            }
          : b
      )
    );
    setDispatchModalBooking(null);
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header Banner - Matching Cleaner Dashboard Style */}
      <div className="bg-gradient-to-r from-[#0d274c] via-slate-900 to-[#007eff] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              DISPATCH HQ ACTIVE
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
              TEAM ALPHA • HUB #01
            </span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              10% LEADER COMMISSION RATE
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Team Leader Command & Dispatch HQ
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
            স্বাগতম টিম লিডার রাহাত করিম! আপনার অধীনস্থ ক্লিনার টিম সামলান, ফিল্ডে সার্ভিস বন্টন করুন এবং প্রতিটি কাজের ছবি ও কোয়ালিটি মনিটর করুন।
          </p>
        </div>

        {/* Quick Action CTA Box - Glassmorphic Style */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto">
          <Link
            href="/team-leader/bookings"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>ফিল্ড ডিসপ্যাচ ম্যানেজার</span>
          </Link>
          <Link
            href="/team-leader/available-bookings"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>নতুন জব রিকোয়েস্ট</span>
          </Link>
        </div>
      </div>

      {/* KPI Overview Grid - Matching Cleaner Dashboard Card Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Roster Card */}
        <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50/40 border border-blue-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              টিম মেম্বার রোস্টার
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {teamMembers.length} <span className="text-xl font-bold text-slate-600">জন</span>
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-3 py-1.5 rounded-full border border-blue-300 inline-block">
                🛡️ 1-Team সিঙ্গেল ভেরিফাইড স্টাফ
              </span>
            </div>
          </div>
        </div>

        {/* On-Duty Active Staff Card */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/40 border border-emerald-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              অন-ডিউটি সক্রিয় স্টাফ
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {activeOnDutyCount} / {teamMembers.length} <span className="text-xl font-bold text-slate-600">প্রস্তুত</span>
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-300 inline-block">
                ✓ কাজ গ্রহণের জন্য রেডি
              </span>
            </div>
          </div>
        </div>

        {/* Pending Dispatch Card */}
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50/40 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              মুলতুবি ডিসপ্যাচ কাজ
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {pendingDispatchCount} <span className="text-xl font-bold text-slate-600">টি</span>
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-300 inline-block">
                ⚡ ক্লিনার বরাদ্দ আবশ্যক
              </span>
            </div>
          </div>
        </div>

        {/* Leader Earnings Card */}
        <div className="bg-gradient-to-br from-purple-50/70 via-white to-slate-50/40 border border-purple-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              ১০% লিডার কমিশন ওয়ালেট
            </span>
            <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-purple-700 border border-purple-200 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ৳১৮,৪৫০
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-purple-800 bg-purple-100/80 px-3 py-1.5 rounded-full border border-purple-300 inline-block">
                💰 ৫০%-১০%-৪০% কমিশন ক্রেডিট
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Revenue Split Rule Highlight Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0d274c] to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-blue-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Official Revenue Commission Split Model (50% - 10% - 40%)
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              কাস্টমার পেমেন্ট: <strong>100%</strong> | অ্যাডমিন মার্জিন (মেটেরিয়াল কিট ও ট্রান্সপোর্ট সহ): <strong>50%</strong> | টিম লিডার কমিশন: <strong>10%</strong> | ক্লিনার স্টাফদের পেমেন্ট (কাজে অংশগ্রহণকারী মেম্বারদের জন্য): <strong>40%</strong>।
            </p>
          </div>
        </div>

        <Link
          href="/team-leader/earnings"
          className="px-4 py-2.5 rounded-xl bg-white text-[#0d274c] font-black text-xs hover:bg-blue-50 transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          View Wallet Details →
        </Link>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Team Roster (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#007eff]" /> Team Alpha Roster
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                অ্যাডমিন কর্তৃক নিয়োজিত ক্লিনারের তালিকা
              </p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              {teamMembers.length} Cleaners
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#007eff]/10 border border-[#007eff]/20 text-[#007eff] flex items-center justify-center font-black text-sm">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{member.name}</h3>
                      <a
                        href={`tel:${member.phone}`}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" /> {member.phone}
                      </a>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      member.status === "IN_SERVICE"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : member.status === "ON_DUTY"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        member.status === "IN_SERVICE"
                          ? "bg-[#007eff] animate-pulse"
                          : member.status === "ON_DUTY"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {member.status === "IN_SERVICE"
                      ? "In Service"
                      : member.status === "ON_DUTY"
                      ? "On Duty"
                      : "Off Duty"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {member.rating} ({member.completedJobs} Jobs)
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    1-Team Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 & 3: Assigned Team Dispatch Schedule (2 cols - Matching Cleaner Dashboard Job Cards Layout) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#007eff]" /> আজকের টিম ডিসপ্যাচ সময়সূচী
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                অ্যাডমিন কর্তৃক টিম আলফায় নিয়োজিত সার্ভিস ও ক্লিনার অ্যাসাইনমেন্ট
              </p>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              {teamBookings.length} টির মধ্যে {completedCount} টি সম্পূর্ণ
            </span>
          </div>

          <div className="space-y-5">
            {teamBookings.map((job) => {
              const getStatusBadge = () => {
                switch (job.status) {
                  case "IN_PROGRESS":
                    return (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                        IN PROGRESS (DISPATCHED)
                      </span>
                    );
                  case "COMPLETED":
                    return (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        JOB COMPLETED & VERIFIED
                      </span>
                    );
                  default:
                    return (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        PENDING ALLOCATION
                      </span>
                    );
                }
              };

              return (
                <div
                  key={job.id}
                  className={`p-6 rounded-3xl border transition-all space-y-5 ${
                    job.status === "IN_PROGRESS"
                      ? "bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border-blue-300 shadow-xs"
                      : job.status === "COMPLETED"
                      ? "bg-slate-50/70 border-slate-200"
                      : "bg-white border-amber-300 shadow-xs"
                  }`}
                >
                  {/* Row Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                        #{job.id}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                          {job.serviceType}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{job.packageType}</p>
                      </div>
                    </div>

                    {getStatusBadge()}
                  </div>

                  {/* 3-Column Specs & Client Info Grid - Exact Cleaner Dashboard Style */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                    {/* Column 1: Client & Contact */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">Customer & Contact</span>
                      <p className="font-extrabold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#007eff]" /> {job.customerName}
                      </p>
                      <a
                        href={`tel:${job.customerPhone}`}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5"
                      >
                        <Phone className="w-3.5 h-3.5" /> {job.customerPhone}
                      </a>
                    </div>

                    {/* Column 2: Service Location & Google Maps Link */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">Service Address</span>
                      <p className="font-bold text-slate-900 leading-snug flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{job.address}</span>
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#007eff] hover:underline mt-1"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Google Maps নেভিগেশন ➔</span>
                      </a>
                    </div>

                    {/* Column 3: Time Slot, Commission & Cleaners */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">Time Slot & Payout</span>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-500" /> {job.timeSlot}
                      </p>
                      <div className="pt-0.5 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-emerald-700">
                          Leader Cut: +৳{job.leaderCommission} (10%)
                        </span>
                      </div>
                      <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                        {job.addons?.map((addon, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
                          >
                            + {addon}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Assigned Cleaners List & Action CTAs Bar */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500">Assigned Cleaners:</span>
                      {job.assignedCleaners.length > 0 ? (
                        job.assignedCleaners.map((cleaner) => (
                          <span
                            key={cleaner}
                            className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200 flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3 text-[#007eff]" /> {cleaner}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          ⚠️ কোনো ক্লিনার বরাদ্দ করা হয়নি
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => openDispatchModal(job)}
                        className="px-4 py-2 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.assignedCleaners.length > 0 ? "ক্লিনার পরিবর্তন করুন" : "ক্লিনার বরাদ্দ করুন"}</span>
                      </button>

                      {job.status === "COMPLETED" && (
                        <Link
                          href="/team-leader/proofs"
                          className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>কাজের ছবি অডিট</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Cleaner Dispatch Modal */}
      {dispatchModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-[#007eff] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  #{dispatchModalBooking.id}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  ক্লিনার স্টাফ বরাদ্দ ও ডিসপ্যাচ
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {dispatchModalBooking.serviceType} • {dispatchModalBooking.area}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDispatchModalBooking(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Team Cleaners for Dispatch (40% Pool Shared):
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {teamMembers.map((cleaner) => {
                  const isChecked = selectedCleanerNames.includes(cleaner.name);
                  return (
                    <label
                      key={cleaner.id}
                      onClick={() => toggleCleanerInModal(cleaner.name)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? "bg-blue-50/80 border-[#007eff] shadow-xs"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-[#007eff] border-[#007eff] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div>
                          <span className="font-extrabold text-sm text-slate-900 block">
                            {cleaner.name}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            ⭐ {cleaner.rating} • {cleaner.completedJobs} Jobs
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          cleaner.status === "ON_DUTY"
                            ? "bg-emerald-100 text-emerald-800"
                            : cleaner.status === "IN_SERVICE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {cleaner.status}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDispatchModalBooking(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleSaveDispatch}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs"
              >
                ডিসপ্যাচ কনফার্ম করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
