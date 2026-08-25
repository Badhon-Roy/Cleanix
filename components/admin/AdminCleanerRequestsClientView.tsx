"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Search,
  Phone,
  Mail,
  CheckCircle2,
  Ban,
  CreditCard,
  Calendar,
  RefreshCw,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  FileCheck,
  MapPin,
  Check,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  ICleanerProfile,
  TCleanerStatus,
  fetchAllCleanersAPI,
  updateCleanerApprovalAPI,
} from "@/services/cleanerService";

interface AdminCleanerRequestsClientViewProps {
  initialCleaners: ICleanerProfile[];
}

export default function AdminCleanerRequestsClientView({
  initialCleaners = [],
}: AdminCleanerRequestsClientViewProps) {
  const [cleaners, setCleaners] = useState<ICleanerProfile[]>(initialCleaners);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Manual Refresh
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCleanersAPI("PENDING_APPROVAL");
      setCleaners(data);
    } catch (err) {
      console.error("Failed to refresh cleaner requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Silent Refresh via Socket.IO
  const silentRefreshData = async () => {
    try {
      const data = await fetchAllCleanersAPI("PENDING_APPROVAL");
      setCleaners(data);
    } catch (err) {
      console.error("Silent cleaner requests refresh failed:", err);
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
      console.log("⚡ Cleaner Requests Socket connected:", socket.id);
    });

    socket.on("cleaner_updated", () => {
      silentRefreshData();
    });

    return () => {
      socket.off("cleaner_updated");
      socket.disconnect();
    };
  }, []);

  // Handler for Approval Action (Approve / Reject)
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
        toast.success(
          res?.message ||
            (newStatus === "APPROVED"
              ? "Cleaner registration request APPROVED successfully!"
              : "Cleaner registration request REJECTED & Blocked.")
        );

        // Remove from pending list immediately
        setCleaners((prev) => prev.filter((c) => c.id !== cleanerId));
      } else {
        toast.error(res?.message || "Failed to update cleaner approval status");
      }
    } catch (err: any) {
      console.error("Error updating cleaner approval:", err);
      toast.error(err?.message || "Failed to update cleaner status");
    } finally {
      setUpdatingId(null);
    }
  };

  // STRICTLY filter ONLY PENDING_APPROVAL requests for this page!
  const pendingRequests = cleaners.filter((c) => c.status === "PENDING_APPROVAL");

  // Search Filter
  const filteredRequests = pendingRequests.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.nidNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/admin/cleaners"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Back to Staff Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 stroke-[2.5]" />
              </div>
              Cleaner Registration Requests
            </h1>
            {pendingRequests.length > 0 && (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-red-600 text-white shadow-xs animate-pulse">
                🔴 {pendingRequests.length} PENDING APPROVAL
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Review incoming cleaner staff registration applications, verify credentials, and approve for dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <Link
            href="/admin/cleaners"
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#007eff]" />
            <span>Certified Staff Directory</span>
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
            <span className="hidden sm:inline">Refresh Requests</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xs">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Requests ({pendingRequests.length})</span>
            </span>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Applicant Name, Phone, NID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Pending Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              No Pending Cleaner Requests!
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
              All cleaner registration applications have been processed. New registration requests will automatically appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((cleaner) => {
              const isUpdating = updatingId === cleaner.id;

              return (
                <div
                  key={cleaner.id}
                  className="p-5 sm:p-6 rounded-3xl border border-amber-300 bg-amber-50/40 hover:border-amber-400 shadow-2xs transition-all space-y-5"
                >
                  {/* Header Row: Applicant Profile & Primary Action */}
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

                          {/* Status Badge */}
                          <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-700 animate-spin" /> PENDING VERIFICATION
                          </span>
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

                    {/* Action Buttons: 1-Click Approve / Reject */}
                    <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateApproval(cleaner.id, "APPROVED", true)
                        }
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>Approve Staff</span>
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateApproval(cleaner.id, "BLOCKED", false)
                        }
                        className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Ban className="w-4 h-4" />
                        <span>Reject Application</span>
                      </button>
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

                    {/* Column 2: System ID */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        System Reference ID
                      </span>
                      <p className="font-extrabold text-slate-900">
                        {cleaner.id}
                      </p>
                      <p className="text-slate-500 font-medium">
                        User Document ID: {cleaner.userId}
                      </p>
                    </div>

                    {/* Column 3: Coverage Area */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Requested Coverage Area
                      </span>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>
                          {cleaner.coverageArea && cleaner.coverageArea.length > 0
                            ? cleaner.coverageArea.join(", ")
                            : "All Operational Zones"}
                        </span>
                      </p>
                    </div>

                    {/* Column 4: Registration Date */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Application Date
                      </span>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(cleaner.createdAt || "").toLocaleString()}</span>
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
