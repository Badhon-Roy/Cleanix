"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Search,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Ban,
  User,
  CreditCard,
  Sparkles,
  RefreshCw,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  ICleanerProfile,
  TCleanerStatus,
  fetchAllCleanersAPI,
  updateCleanerApprovalAPI,
} from "@/services/cleanerService";

interface AdminCleanersClientViewProps {
  initialCleaners: ICleanerProfile[];
}

export default function AdminCleanersClientView({
  initialCleaners = [],
}: AdminCleanersClientViewProps) {
  const [cleaners, setCleaners] = useState<ICleanerProfile[]>(initialCleaners);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "APPROVED" | "BLOCKED">("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Manual Refresh
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCleanersAPI();
      setCleaners(data);
    } catch (err) {
      console.error("Failed to refresh cleaners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Silent Refresh via Socket.IO
  const silentRefreshData = async () => {
    try {
      const data = await fetchAllCleanersAPI();
      setCleaners(data);
    } catch (err) {
      console.error("Silent cleaner refresh failed:", err);
    }
  };

  // Real-time Socket.IO Connection
  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("⚡ Certified Staff Directory Socket connected:", socket.id);
    });

    socket.on("cleaner_updated", () => {
      silentRefreshData();
    });

    socket.on("team_updated", () => {
      silentRefreshData();
    });

    return () => {
      socket.off("cleaner_updated");
      socket.off("team_updated");
      socket.disconnect();
    };
  }, []);

  // Handler for Status Updates (Approve / Block)
  const handleUpdateApproval = async (
    cleanerId: string,
    newStatus: TCleanerStatus,
    isApproved: boolean
  ) => {
    setUpdatingId(cleanerId);
    try {
      const res = await updateCleanerApprovalAPI(cleanerId, {
        status: newStatus,
        isApproved,
      });

      if (res?.success) {
        toast.success(res?.message || `Cleaner status set to ${newStatus}`);
        setCleaners((prev) =>
          prev.map((c) =>
            c.id === cleanerId
              ? { ...c, status: newStatus, isApproved }
              : c
          )
        );
      } else {
        toast.error(res?.message || "Failed to update cleaner status");
      }
    } catch (err: any) {
      console.error("Error updating cleaner approval:", err);
      toast.error(err?.message || "Failed to update cleaner status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter ONLY Approved and Blocked Data for this page
  const approvedAndBlockedCleaners = cleaners.filter(
    (c) => c.status === "APPROVED" || c.status === "BLOCKED"
  );

  const pendingRequestsCount = cleaners.filter(
    (c) => c.status === "PENDING_APPROVAL"
  ).length;

  const approvedCount = cleaners.filter(
    (c) => c.status === "APPROVED"
  ).length;

  const blockedCount = cleaners.filter(
    (c) => c.status === "BLOCKED"
  ).length;

  // Search & Tab Filter
  const filteredCleaners = approvedAndBlockedCleaners.filter((c) => {
    const matchesTab = activeTab === "ALL" ? true : c.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.nidNumber?.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              Certified Cleaners & Staff CRM
            </h1>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ⚡ {approvedCount} APPROVED STAFF
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Directory of certified active cleaner staff, assigned coverage zones, performance ratings, and access control.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <Link
            href="/admin/cleaner-requests"
            className="px-5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Review Pending Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                {pendingRequestsCount} New
              </span>
            )}
            <ArrowRight className="w-4 h-4 text-amber-700" />
          </Link>

          <button
            type="button"
            onClick={refreshData}
            disabled={isLoading}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#007eff] ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh Directory</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Certified Staff */}
        <div
          onClick={() => setActiveTab("ALL")}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Total Staff Directory
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#007eff] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {approvedAndBlockedCleaners.length}
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            Approved & Blocked Staff
          </p>
        </div>

        {/* Card 2: Approved Active Staff */}
        <div
          onClick={() => setActiveTab("APPROVED")}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              Approved & Active
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{approvedCount}</p>
          <p className="text-[11px] font-bold text-emerald-700">
            Ready for Job Dispatch & Squad Allocation
          </p>
        </div>

        {/* Card 3: Blocked / Suspended Staff */}
        <div
          onClick={() => setActiveTab("BLOCKED")}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 cursor-pointer hover:border-red-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">
              Blocked Access
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{blockedCount}</p>
          <p className="text-[11px] font-bold text-red-600">
            Access Suspended by Admin
          </p>
        </div>
      </div>

      {/* Main Container & Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xs">
        {/* Header Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "ALL"
                  ? "bg-[#007eff] text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Staff ({approvedAndBlockedCleaners.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("APPROVED")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "APPROVED"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved Staff ({approvedCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("BLOCKED")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "BLOCKED"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                  : "bg-red-50 text-red-800 border border-red-200 hover:bg-red-100"
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Blocked Staff ({blockedCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name, Phone, NID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Cleaners List */}
        {filteredCleaners.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">
              No staff profiles found in this section.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCleaners.map((cleaner) => {
              const isUpdating = updatingId === cleaner.id;

              return (
                <div
                  key={cleaner.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-5 ${
                    cleaner.status === "APPROVED"
                      ? "bg-white border-slate-200 hover:border-blue-300 shadow-2xs"
                      : "bg-red-50/30 border-red-200 opacity-80"
                  }`}
                >
                  {/* Top Row: Avatar & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#007eff] text-white flex items-center justify-center font-black text-base border-2 border-white shadow-2xs flex-shrink-0 relative overflow-hidden">
                        {cleaner.avatar ? (
                          <img
                            src={cleaner.avatar}
                            alt={cleaner.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          cleaner.name.slice(0, 2).toUpperCase()
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                            {cleaner.name}
                          </h3>

                          {cleaner.status === "APPROVED" && (
                            <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> APPROVED STAFF
                            </span>
                          )}

                          {cleaner.status === "BLOCKED" && (
                            <span className="px-3 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300 text-[10px] font-black uppercase flex items-center gap-1">
                              <Ban className="w-3 h-3" /> ACCESS BLOCKED
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#007eff]" /> {cleaner.phone}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" /> {cleaner.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Button (Block / Unblock) */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {cleaner.status === "APPROVED" ? (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            handleUpdateApproval(cleaner.id, "BLOCKED", false)
                          }
                          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Ban className="w-3.5 h-3.5" />
                          )}
                          <span>Block Access</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            handleUpdateApproval(cleaner.id, "APPROVED", true)
                          }
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>Unblock & Restore</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4-Column Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* Column 1: Verification Info */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Verification Credentials
                      </span>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#007eff]" />
                        <span>NID: {cleaner.nidNumber || "Not Provided"}</span>
                      </p>
                      <p className="text-slate-500 font-medium">
                        Gender: {cleaner.gender || "Male"} • DOB: {cleaner.dob || "N/A"}
                      </p>
                    </div>

                    {/* Column 2: Rating & Duty Status */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Performance & Rating
                      </span>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Rating: {cleaner.rating} ★</span>
                      </p>
                      <p className="text-slate-500 font-medium">
                        Completed Jobs: {cleaner.totalJobsDone}
                      </p>
                    </div>

                    {/* Column 3: Coverage Area */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Assigned Coverage Area
                      </span>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>
                          {cleaner.coverageArea && cleaner.coverageArea.length > 0
                            ? cleaner.coverageArea.join(", ")
                            : "All Active Zones"}
                        </span>
                      </p>
                    </div>

                    {/* Column 4: System ID & Date */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        System Information
                      </span>
                      <p className="font-bold text-slate-700">ID: {cleaner.id}</p>
                      <p className="text-slate-400 text-[11px]">
                        Registered: {new Date(cleaner.createdAt || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
