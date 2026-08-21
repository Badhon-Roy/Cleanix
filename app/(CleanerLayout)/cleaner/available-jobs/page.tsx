"use client";

import React, { useState } from "react";
import {
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Send,
  CheckCircle2,
  Hourglass,
  ShieldCheck,
  Search,
  Filter,
  AlertCircle,
  Building,
  Home,
  Check,
  Calendar,
} from "lucide-react";

interface AvailableJob {
  id: string;
  serviceTitle: string;
  customerArea: string;
  addressSnippet: string;
  propertySpecs: string;
  scheduledDate: string;
  timeSlot: string;
  payout: string;
  addons: string[];
  appliedStatus: "NONE" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  appliedAt?: string;
}

export default function AvailableJobsPage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "my_applications">("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");

  // Application note modal state
  const [applyingJob, setApplyingJob] = useState<AvailableJob | null>(null);
  const [applicationNote, setApplicationNote] = useState("");

  const [availableJobs, setAvailableJobs] = useState<AvailableJob[]>([
    {
      id: "CLN-2026-9901",
      serviceTitle: "VIP Luxury Duplex Deep Cleaning",
      customerArea: "Gulshan-1",
      addressSnippet: "Road 23, Block B, Gulshan-1",
      propertySpecs: "3,800 SqFt • 4 Bedrooms • 4 Bathrooms",
      scheduledDate: "Tomorrow, Aug 22, 2026",
      timeSlot: "09:30 AM - 01:00 PM",
      payout: "৳4,500",
      addons: ["Oven Wash", "Carpet Shampoo", "Wood Polish"],
      appliedStatus: "NONE",
    },
    {
      id: "CLN-2026-9902",
      serviceTitle: "Commercial Office Floor Sanitization",
      customerArea: "Banani",
      addressSnippet: "Kamal Ataturk Avenue, Banani",
      propertySpecs: "5,000 SqFt • Open Office Floor",
      scheduledDate: "Tomorrow, Aug 22, 2026",
      timeSlot: "02:00 PM - 05:30 PM",
      payout: "৳5,200",
      addons: ["Hospital Grade Spray", "Glass Polish"],
      appliedStatus: "NONE",
    },
    {
      id: "CLN-2026-9903",
      serviceTitle: "Post-Construction Heavy Debris Clean",
      customerArea: "Dhanmondi",
      addressSnippet: "Road 7/A, Dhanmondi",
      propertySpecs: "2,900 SqFt • 3 Bedrooms • 3 Bathrooms",
      scheduledDate: "Aug 23, 2026",
      timeSlot: "10:00 AM - 02:00 PM",
      payout: "৳3,800",
      addons: ["Floor Scrubbing", "Chimey Degrease"],
      appliedStatus: "PENDING_APPROVAL",
      appliedAt: "10 mins ago",
    },
    {
      id: "CLN-2026-9904",
      serviceTitle: "Residential Move-In Refresh",
      customerArea: "Uttara",
      addressSnippet: "Sector 7, Uttara",
      propertySpecs: "2,200 SqFt • 3 Bedrooms • 2 Bathrooms",
      scheduledDate: "Aug 23, 2026",
      timeSlot: "03:00 PM - 06:00 PM",
      payout: "৳2,600",
      addons: ["Fridge Wash"],
      appliedStatus: "NONE",
    },
  ]);

  const handleConfirmApplication = () => {
    if (!applyingJob) return;

    setAvailableJobs((prev) =>
      prev.map((j) =>
        j.id === applyingJob.id
          ? {
              ...j,
              appliedStatus: "PENDING_APPROVAL",
              appliedAt: "Just now",
            }
          : j
      )
    );

    setApplyingJob(null);
    setApplicationNote("");
    alert(`Application submitted for Job #${applyingJob.id}! Waiting for Admin/Dispatcher approval.`);
  };

  const filteredJobs = availableJobs.filter((job) => {
    // Filter by tab
    if (activeTab === "my_applications" && job.appliedStatus === "NONE") return false;
    if (activeTab === "marketplace" && job.appliedStatus !== "NONE") return false;

    // Filter by search
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerArea.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by area
    const matchesArea = selectedArea === "all" || job.customerArea.toLowerCase() === selectedArea.toLowerCase();

    return matchesSearch && matchesArea;
  });

  const appliedCount = availableJobs.filter((j) => j.appliedStatus !== "NONE").length;
  const unassignedCount = availableJobs.filter((j) => j.appliedStatus === "NONE").length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 stroke-[2.5]" />
              </div>
              New Service Booking Marketplace
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ⚡ LIVE CUSTOMER REQUESTS
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Browse newly booked customer cleaning jobs, request job assignments, and wait for admin approval.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("marketplace")}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "marketplace"
                  ? "bg-gradient-to-r from-blue-500 via-[#007eff] to-blue-700 text-white shadow-md shadow-blue-500/25 border border-blue-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Available Jobs ({unassignedCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("my_applications")}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "my_applications"
                  ? "bg-gradient-to-r from-blue-500 via-[#007eff] to-blue-700 text-white shadow-md shadow-blue-500/25 border border-blue-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Hourglass className="w-4 h-4" />
              <span>My Requests ({appliedCount})</span>
            </button>
          </div>

          {/* Area Filter Selector & Search */}
          <div className="flex items-center gap-3">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#007eff]"
            >
              <option value="all">All Service Areas</option>
              <option value="gulshan-1">Gulshan-1</option>
              <option value="banani">Banani</option>
              <option value="dhanmondi">Dhanmondi</option>
              <option value="uttara">Uttara</option>
            </select>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Jobs Marketplace List */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-3xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                      #{job.id}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {job.serviceTitle}
                    </h3>
                  </div>

                  {job.appliedStatus === "PENDING_APPROVAL" ? (
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 animate-pulse">
                      <Hourglass className="w-3.5 h-3.5 text-amber-600" />
                      WAITING ADMIN APPROVAL
                    </span>
                  ) : (
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      UNASSIGNED CUSTOMER BOOKING
                    </span>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                  {/* Location */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[11px]">Location & Area</span>
                    <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-red-500" /> {job.customerArea}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">{job.addressSnippet}</p>
                  </div>

                  {/* Schedule & Specs */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[11px]">Schedule & Specs</span>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" /> {job.scheduledDate}
                    </p>
                    <p className="text-xs text-amber-700 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {job.timeSlot}
                    </p>
                  </div>

                  {/* Payout & Addons */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[11px]">Est. Cleaner Payout</span>
                    <p className="font-extrabold text-emerald-700 text-lg">
                      {job.payout}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {job.addons.map((addon, idx) => (
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

                {/* Footer Action */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">
                    Property: <span className="font-bold text-slate-800">{job.propertySpecs}</span>
                  </span>

                  {job.appliedStatus === "NONE" ? (
                    <button
                      type="button"
                      onClick={() => setApplyingJob(job)}
                      className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-2xl border border-blue-400 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Apply for this Job</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                        <Hourglass className="w-4 h-4 text-amber-600 animate-spin" />
                        Application Submitted ({job.appliedAt}) — Awaiting Admin
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">No jobs found in this section</h4>
            <p className="text-xs text-slate-500 font-medium">Check back later as new customer bookings are posted in real-time.</p>
          </div>
        )}
      </div>

      {/* Application Note Modal */}
      {applyingJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Send className="w-5 h-5 stroke-[2.5]" />
              </div>
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Apply for Job #{applyingJob.id}</h3>
              <p className="text-xs text-slate-500 font-semibold">
                {applyingJob.serviceTitle} • {applyingJob.customerArea} ({applyingJob.payout})
              </p>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <label className="font-bold text-slate-800">Dispatch Note for Admin / Supervisor (Optional):</label>
              <textarea
                rows={3}
                placeholder="e.g. Team Delta is active in Gulshan-1 with steam sanitizer ready..."
                value={applicationNote}
                onChange={(e) => setApplicationNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApplication}
                className="py-3 px-6 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 border border-blue-400"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>Submit Request to Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
