"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  UserCheck,
  Users,
  Search,
  Check,
  X,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  fetchMyTeamAssignmentsAPI,
  updateTeamAssignmentAPI,
} from "@/services/teamService";

interface Props {
  teamSlug: string;
}

export default function TeamBookingsView({ teamSlug }: Props) {
  const [filter, setFilter] = useState<"ALL" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAssignmentForDispatch, setSelectedAssignmentForDispatch] = useState<any | null>(null);
  const [selectedCleanerIds, setSelectedCleanerIds] = useState<string[]>([]);
  const [isUpdatingDispatch, setIsUpdatingDispatch] = useState(false);

  const loadMyTeamAssignments = useCallback(
    async (showLoadingSpinner = false) => {
      try {
        if (showLoadingSpinner) {
          setIsLoading(true);
        }
        const data = await fetchMyTeamAssignmentsAPI(teamSlug);
        if (Array.isArray(data)) {
          setAssignments(data);
        }
      } catch (err) {
        console.error("Failed to load team assignments:", err);
        if (showLoadingSpinner) {
          toast.error("Failed to load assigned jobs");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [teamSlug]
  );

  useEffect(() => {
    // Only show full loading spinner on initial cold load if assignments is empty
    loadMyTeamAssignments(assignments.length === 0);

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("⚡ TeamBookings Socket connected:", socket.id);
    });

    const handleSilentRefresh = () => {
      loadMyTeamAssignments(false);
    };

    socket.on("booking_updated", handleSilentRefresh);
    socket.on("booking_created", handleSilentRefresh);
    socket.on("team_updated", handleSilentRefresh);
    socket.on("cleaner_updated", handleSilentRefresh);
    socket.on("leader_request_updated", handleSilentRefresh);

    return () => {
      socket.off("booking_updated", handleSilentRefresh);
      socket.off("booking_created", handleSilentRefresh);
      socket.off("team_updated", handleSilentRefresh);
      socket.off("cleaner_updated", handleSilentRefresh);
      socket.off("leader_request_updated", handleSilentRefresh);
      socket.disconnect();
    };
  }, [loadMyTeamAssignments]);

  const openDispatchModal = (item: any) => {
    setSelectedAssignmentForDispatch(item);
    const existingCleanerIds = Array.isArray(item.assignedCleaners)
      ? item.assignedCleaners.map((c: any) => (typeof c === "object" ? c._id || c.id : c))
      : [];
    setSelectedCleanerIds(existingCleanerIds);
  };

  const toggleCleanerSelection = (cleanerId: string) => {
    setSelectedCleanerIds((prev) =>
      prev.includes(cleanerId)
        ? prev.filter((id) => id !== cleanerId)
        : [...prev, cleanerId]
    );
  };

  const handleSaveDispatch = async () => {
    if (!selectedAssignmentForDispatch) return;

    setIsUpdatingDispatch(true);
    try {
      const assignmentId = selectedAssignmentForDispatch._id || selectedAssignmentForDispatch.id;
      const targetStatus = selectedCleanerIds.length > 0 ? "IN_PROGRESS" : "ASSIGNED";

      const res = await updateTeamAssignmentAPI(assignmentId, {
        assignedCleaners: selectedCleanerIds,
        status: targetStatus,
      });

      if (res?.success) {
        toast.success("Squad cleaners allocated & job status updated successfully!");
        setSelectedAssignmentForDispatch(null);
        await loadMyTeamAssignments(false);
      } else {
        toast.error(res?.message || "Failed to update cleaner allocation");
      }
    } catch (err: any) {
      console.error("Save dispatch error:", err);
      toast.error(err?.message || "An error occurred while saving cleaner allocation");
    } finally {
      setIsUpdatingDispatch(false);
    }
  };

  const uniqueAssignments = useMemo(() => {
    const seen = new Set<string>();
    return assignments.filter((item: any) => {
      if (!item.booking) return false;
      const bKey = item.booking?.bookingRef || item.booking?._id || item._id;
      if (seen.has(bKey)) return false;
      seen.add(bKey);
      return true;
    });
  }, [assignments]);

  const filteredAssignments = uniqueAssignments.filter((item: any) => {
    const statusMatch = filter === "ALL" || item.status === filter;
    if (!statusMatch) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const bookingRef = item.booking?.bookingRef?.toLowerCase() || "";
      const customerName = item.booking?.user?.name?.toLowerCase() || "";
      const address = item.booking?.address?.toLowerCase() || "";
      const serviceTitle = item.booking?.serviceType?.title?.toLowerCase() || "";

      return (
        bookingRef.includes(q) ||
        customerName.includes(q) ||
        address.includes(q) ||
        serviceTitle.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d274c] via-slate-900 to-[#007eff] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE FIELD TEAM DISPATCH HUB
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
              Auto Split Commission Model
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Assigned Team Services &amp; Dispatch Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            অ্যাডমিন কর্তৃক আপনার টিমে অ্যাসাইন হওয়া বুকিং সার্ভিসসমূহ লাইভ ডাটাবেস থেকে রিভিউ করুন এবং স্টাফ বন্টন করুন।
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {(["ALL", "ASSIGNED", "IN_PROGRESS", "COMPLETED"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer ${
                filter === st
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"
              }`}
            >
              {st === "ALL"
                ? "All Jobs"
                : st === "ASSIGNED"
                ? "Pending Allocation"
                : st === "IN_PROGRESS"
                ? "In Progress"
                : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ref #, customer name, service or address..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#007eff] transition-all shadow-xs"
        />
      </div>

      {/* Loading State */}
      {isLoading && assignments.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white border border-slate-200 rounded-3xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#007eff] mx-auto" />
          <p className="text-xs font-bold text-slate-500">
            Fetching assigned jobs collection from server...
          </p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-3xl bg-white p-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center mx-auto">
            <FolderOpen className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-800">
              কোনো অ্যাসাইন করা কাজ পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              বর্তমানে আপনার টিম স্কোয়াডে কোনো বুকিং সার্ভিস অ্যাসাইন করা নেই। অ্যাডমিন প্যানেল থেকে সার্ভিস ডিসপ্যাচ করা হলে এখানে লাইভ প্রদর্শন করা হবে।
            </p>
          </div>
        </div>
      ) : (
        /* Dynamic Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.map((item) => {
            const booking = item.booking || {};
            const customerName = booking.user?.name || "Registered Customer";
            const customerPhone = booking.user?.phone || "N/A";
            const bookingRef = booking.bookingRef || "N/A";
            const serviceTitle = booking.serviceType?.title || "Standard Cleaning Service";
            const address = booking.address || "Customer Specified Address";
            const timeSlot = booking.timeSlot || "Scheduled Slot";
            const scheduledDate = booking.scheduledDate || "";

            const assignedCleaners = Array.isArray(item.assignedCleaners) ? item.assignedCleaners : [];

            return (
              <div
                key={item._id || item.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-black text-[#007eff] uppercase tracking-wider">
                        #{bookingRef}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                        {customerName}
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
                        item.status === "ASSIGNED"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : item.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {item.status === "ASSIGNED"
                        ? "Pending Allocation"
                        : item.status === "IN_PROGRESS"
                        ? "In Progress"
                        : "Completed"}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="font-extrabold text-slate-900 text-sm">
                        {serviceTitle}
                      </p>
                      {scheduledDate && (
                        <p className="text-slate-500 font-medium mt-0.5">
                          Date: {scheduledDate}
                        </p>
                      )}
                    </div>
                    <div className="flex items-start gap-2 pt-1">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-slate-800">{address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>
                        Time Slot: <strong className="text-slate-800">{timeSlot}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>
                        Phone: <strong className="text-slate-800">{customerPhone}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Assigned Squad Cleaners */}
                  <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#007eff]" />
                        Assigned Cleaners:
                      </span>
                      <span className="text-[11px] font-black text-[#007eff]">
                        {assignedCleaners.length} Cleaner(s)
                      </span>
                    </div>

                    {assignedCleaners.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {assignedCleaners.map((c: any) => {
                          const name = typeof c === "object" ? c.name || "Cleaner" : "Cleaner";
                          return (
                            <span
                              key={typeof c === "object" ? c._id || c.id : c}
                              className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white text-slate-800 border border-blue-200"
                            >
                              ✓ {name}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[11px] font-bold text-amber-700">
                        ⚠ No cleaners assigned yet. Click below to allocate team members.
                      </p>
                    )}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <span className="text-slate-500 font-bold block text-[10px] uppercase">
                        Leader Cut Share
                      </span>
                      <span className="text-emerald-700 font-black text-sm">
                        ৳{item.leaderCommission || 0}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                      <span className="text-slate-500 font-bold block text-[10px] uppercase">
                        Cleaner Pool Share
                      </span>
                      <span className="text-blue-700 font-black text-sm">
                        ৳{item.cleanerPoolPayout || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => openDispatchModal(item)}
                    className="w-full py-3 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>
                      {assignedCleaners.length > 0
                        ? "Update Assigned Cleaners"
                        : "Assign Cleaners to Job"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dispatch Cleaner Modal */}
      {selectedAssignmentForDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-[#007eff] uppercase">
                  JOB #{selectedAssignmentForDispatch.booking?.bookingRef}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Assign Team Cleaners
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignmentForDispatch(null)}
                disabled={isUpdatingDispatch}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                আপনার টিমের অধীনস্থ ১ জন বা একাধিক সার্টিফাইড ক্লিনার নির্বাচন করুন যারা এই সার্ভিসটিতে কাজ করবে:
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {Array.isArray(selectedAssignmentForDispatch.team?.members) &&
                selectedAssignmentForDispatch.team.members.length > 0 ? (
                  selectedAssignmentForDispatch.team.members.map((cleaner: any) => {
                    const cleanerId = cleaner._id || cleaner.id;
                    const isSelected = selectedCleanerIds.includes(cleanerId);

                    return (
                      <div
                        key={cleanerId}
                        onClick={() => toggleCleanerSelection(cleanerId)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-blue-50/80 border-[#007eff] shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isSelected
                                ? "bg-[#007eff] border-[#007eff] text-white"
                                : "bg-white border-slate-300"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-900">
                              {cleaner.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {cleaner.phone || "No phone"}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Active Cleaner
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-600">
                      No members found in this team squad.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedAssignmentForDispatch(null)}
                disabled={isUpdatingDispatch}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDispatch}
                disabled={isUpdatingDispatch}
                className="flex-1 py-3 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdatingDispatch ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>
                    Confirm Allocation ({selectedCleanerIds.length})
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
