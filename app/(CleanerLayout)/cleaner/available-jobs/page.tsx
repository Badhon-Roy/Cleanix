"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  MapPin,
  Send,
  Hourglass,
  Search,
  Calendar,
  RefreshCw,
  Layers,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { fetchAvailableBookingsAPI, requestBookingForTeamAPI } from "@/services/teamService";

interface AvailableJob {
  id: string;
  _bookingId: string;
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
  const [availableJobs, setAvailableJobs] = useState<AvailableJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Custom Dropdown State & Ref
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const areaDropdownRef = useRef<HTMLDivElement>(null);

  // Application note modal state
  const [applyingJob, setApplyingJob] = useState<AvailableJob | null>(null);
  const [applicationNote, setApplicationNote] = useState("");

  const socketRef = useRef<Socket | null>(null);

  const loadAvailableJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchAvailableBookingsAPI();
      if (Array.isArray(data)) {
        const mapped: AvailableJob[] = data.map((b: any) => {
          const serviceType = b.serviceType || {};
          const location = b.locationId || {};
          const cFields = b.customFields || {};

          const specsParts: string[] = [];
          if (cFields.sqft) specsParts.push(`${cFields.sqft} SqFt`);
          if (cFields.bedrooms) specsParts.push(`${cFields.bedrooms} Beds`);
          if (cFields.bathrooms) specsParts.push(`${cFields.bathrooms} Baths`);
          const specsString =
            specsParts.length > 0
              ? specsParts.join(" • ")
              : serviceType.category
              ? `${serviceType.category} Clean`
              : "Standard Service";

          const addonsList: string[] = [];
          if (Array.isArray(b.selectedAddons)) {
            b.selectedAddons.forEach((ad: any) => {
              if (typeof ad === "string") addonsList.push(ad);
              else if (ad?.title) addonsList.push(ad.title);
              else if (ad?.name) addonsList.push(ad.name);
            });
          }

          const ref = b.bookingRef || `#CLN-${String(b._id).slice(-6).toUpperCase()}`;
          const areaName = b.zoneName || location.city || "Dhaka Zone";
          const approxPayout = Math.round((b.totalAmount || 3000) * 0.4);

          return {
            id: ref,
            _bookingId: String(b._id),
            serviceTitle: serviceType.title || "Cleaning Care Booking",
            customerArea: areaName,
            addressSnippet: b.address || location.address || "Coverage Area, Dhaka",
            propertySpecs: specsString,
            scheduledDate: b.scheduledDate || "Scheduled Date",
            timeSlot: b.timeSlot || "Scheduled Slot",
            payout: `৳${approxPayout.toLocaleString()}`,
            addons: addonsList,
            appliedStatus: b.requestedTeam || b.teamRequestStatus === "REQUESTED" ? "PENDING_APPROVAL" : "NONE",
          };
        });

        setAvailableJobs(mapped);
      } else {
        setAvailableJobs([]);
      }
    } catch (err) {
      console.error("Failed to load available jobs:", err);
      setAvailableJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailableJobs();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("booking_created", loadAvailableJobs);
    socket.on("booking_updated", loadAvailableJobs);

    return () => {
      socket.off("booking_created");
      socket.off("booking_updated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loadAvailableJobs]);

  // Close area dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target as Node)) {
        setAreaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConfirmApplication = async () => {
    if (!applyingJob) return;
    setIsSubmitting(true);
    try {
      const res = await requestBookingForTeamAPI(applyingJob._bookingId);
      if (res?.success) {
        setAvailableJobs((prev) =>
          prev.map((j) =>
            j._bookingId === applyingJob._bookingId
              ? {
                  ...j,
                  appliedStatus: "PENDING_APPROVAL",
                  appliedAt: "Just now",
                }
              : j
          )
        );
        toast.success(`Job #${applyingJob.id}-এ সফলভাবে আবেদন জমা হয়েছে! এডমিন অনুমোদনের অপেক্ষায় রয়েছে।`);
      } else {
        toast.error(res?.message || "কাজের আবেদন জমা দিতে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      toast.error(err?.message || "কাজের আবেদন জমা দেওয়ার সময় একটি ত্রুটি ঘটেছে।");
    } finally {
      setIsSubmitting(false);
      setApplyingJob(null);
      setApplicationNote("");
    }
  };

  const filteredJobs = availableJobs.filter((job) => {
    // Filter by tab
    if (activeTab === "my_applications" && job.appliedStatus === "NONE") return false;
    if (activeTab === "marketplace" && job.appliedStatus !== "NONE") return false;

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        job.id.toLowerCase().includes(q) ||
        job.serviceTitle.toLowerCase().includes(q) ||
        job.customerArea.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Filter by area
    if (selectedArea !== "all") {
      if (!job.customerArea.toLowerCase().includes(selectedArea.toLowerCase())) return false;
    }

    return true;
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
              নতুন সার্ভিস বুকিং মার্কেটপ্লেস
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              লাইভ কাস্টমার বুকিং ({unassignedCount})
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            গ্রাহকদের নতুন বুকিং করা কাজগুলো দেখুন, কাজের জন্য আবেদন করুন এবং এডমিন অনুমোদনের জন্য অপেক্ষা করুন।
          </p>
        </div>

        <button
          onClick={loadAvailableJobs}
          disabled={isLoading}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#007eff]" : ""}`} />
          <span>Sync Marketplace</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "marketplace"
                  ? "bg-[#007eff] text-white shadow-md shadow-blue-500/25 border border-blue-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <span>উন্মুক্ত কাজসমূহ (Open Jobs)</span>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
                {unassignedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("my_applications")}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "my_applications"
                  ? "bg-[#007eff] text-white shadow-md shadow-blue-500/25 border border-blue-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <span>আমার আবেদনসমূহ (My Requests)</span>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
                {appliedCount}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, zone..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Jobs Grid or Empty State */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#007eff] animate-spin mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-slate-500">মার্কেটপ্লেস বুকিং লোড হচ্ছে...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job._bookingId}
                className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#007eff] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {job.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{job.serviceTitle}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{job.propertySpecs}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xl font-bold text-emerald-600 block">{job.payout}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Pool</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span>{job.addressSnippet}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#007eff] flex-shrink-0" />
                    <span>{job.scheduledDate} ({job.timeSlot})</span>
                  </p>
                </div>

                {job.addons.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {job.addons.map((ad, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        + {ad}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  {job.appliedStatus === "NONE" ? (
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="w-full py-3 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Send className="w-4 h-4" />
                      <span>কাজের জন্য আবেদন করুন (Request Job)</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center gap-2">
                      <Hourglass className="w-4 h-4 text-amber-600 animate-spin" />
                      <span>আবেদন প্রক্রিয়াধীন (Pending Admin Review)</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 px-6 text-center space-y-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#007eff] flex items-center justify-center mx-auto border border-blue-200">
              <Layers className="w-8 h-8 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === "marketplace"
                  ? "বর্তমানে কোনো উন্মুক্ত বুকিং নেই"
                  : "আপনার কোনো সক্রিয় কাজের আবেদন নেই"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                {activeTab === "marketplace"
                  ? "কাস্টমাররা নতুন অন-ডিমান্ড সার্ভিস বুক করলে তাৎক্ষণিকভাবে মার্কেটপ্লেসে উন্মুক্ত কাজের তালিকা দেখতে পাবেন।"
                  : "উন্মুক্ত কাজ থেকে যেগুলোতে আবেদন করেছেন সেগুলো এখানে পর্যালোচনার স্ট্যাটাসসহ দেখতে পাবেন।"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">কাজের জন্য আবেদন নিশ্চিত করুন</h3>
              <p className="text-xs text-slate-500 font-medium">
                {applyingJob.serviceTitle} ({applyingJob.id})
              </p>
            </div>

            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
              <p className="font-bold">📍 {applyingJob.addressSnippet}</p>
              <p className="font-bold">🗓️ {applyingJob.scheduledDate} ({applyingJob.timeSlot})</p>
              <p className="font-extrabold text-emerald-700">💰 আনুমানিক পুল পারিশ্রমিক: {applyingJob.payout}</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmApplication}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>আবেদন পাঠান</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
