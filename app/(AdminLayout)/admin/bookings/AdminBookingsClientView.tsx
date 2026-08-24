"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  Search,
  Calendar,
  MapPin,
  Eye,
  Loader2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import AssignCleanerModal from "@/components/admin/AssignCleanerModal";
import BookingDetailsModal, {
  BookingDetailRecord,
  IBookingServiceItem,
} from "@/components/admin/BookingDetailsModal";
import {
  fetchAdminBookingsAPI,
  updateAdminBookingStatusAPI,
  assignTeamToBookingAPI,
} from "@/services/bookingService";

interface AdminBookingsClientViewProps {
  initialBookings?: any[];
}

export default function AdminBookingsClientView({
  initialBookings = [],
}: AdminBookingsClientViewProps) {
  const mapBackendItemToRecord = (item: any): BookingDetailRecord => {
    const area =
      item.locationId?.name ||
      item.locationId?.area ||
      item.locationId?.city ||
      "Dhaka Central";

    const customVals = item.customFieldValues || {};
    const specParts: string[] = [];
    if (customVals.bedrooms !== undefined) specParts.push(`${customVals.bedrooms} Beds`);
    else if (item.bedrooms) specParts.push(`${item.bedrooms} Beds`);

    if (customVals.bathrooms !== undefined) specParts.push(`${customVals.bathrooms} Baths`);
    else if (item.bathrooms) specParts.push(`${item.bathrooms} Baths`);

    if (specParts.length === 0 && item.serviceType?.category) {
      specParts.push(item.serviceType.category);
    }

    const sqftVal = Number(customVals.sqft || item.sqft || 0);

    const servicesItems: IBookingServiceItem[] = Array.isArray(item.services)
      ? item.services
      : [];

    const addonsList: string[] = Array.isArray(item.selectedAddons)
      ? item.selectedAddons
      : [];

    const teamRequestsList = Array.isArray(item.teamRequests) ? item.teamRequests : [];

    return {
      _dbId: item._id,
      id: item.bookingRef || `#CLN-${String(item._id).slice(-4)}`,
      customer: item.user?.name || "Customer",
      phone: item.user?.phone || item.phone || "N/A",
      email: item.user?.email || "N/A",
      service: item.serviceType?.title || "Cleaning Service",
      area,
      address: item.address || "Dhaka",
      sqft: sqftVal,
      specs: specParts.join(" • ") || "Residential Cleaning",
      addons: addonsList,
      services: servicesItems,
      amount: `৳${Number(item.totalAmount || 0).toLocaleString()}`,
      paymentStatus: `${item.paymentStatus || "PAID"} (${item.paymentMethod || "bKash"})`,
      date: item.scheduledDate || "N/A",
      time: item.timeSlot || "N/A",
      status: item.status === "CONFIRMED" ? "PENDING" : item.status || "PENDING",
      cleanerTeam: item.cleanerTeam || "Unassigned",
      teamRequests: teamRequestsList,
    };
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<{
    dbId: string;
    ref: string;
    customer: string;
    service: string;
    teamRequests?: any[];
  } | null>(null);

  const [selectedBookingForDetails, setSelectedBookingForDetails] =
    useState<BookingDetailRecord | null>(null);

  // Direct Approval Confirmation Modal State
  const [confirmApproveModal, setConfirmApproveModal] = useState<{
    bookingId: string;
    bookingRef: string;
    teamId: string;
    teamName: string;
    leaderName: string;
    teamDisplayName: string;
  } | null>(null);
  const [isApprovingDirect, setIsApprovingDirect] = useState(false);

  const [bookingList, setBookingList] = useState<BookingDetailRecord[]>(() => {
    if (Array.isArray(initialBookings) && initialBookings.length > 0) {
      return initialBookings.map(mapBackendItemToRecord);
    }
    return [];
  });

  const loadBookings = async (showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    const res = await fetchAdminBookingsAPI();
    if (showSpinner) setIsLoading(false);

    if (res?.success && Array.isArray(res?.data)) {
      setBookingList(res.data.map(mapBackendItemToRecord));
    } else if (res?.message && showSpinner) {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    if (!initialBookings || initialBookings.length === 0) {
      loadBookings(true);
    }

    let socket: any = null;
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL ||
        process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
        "http://localhost:5000";

      socket = io(serverUrl, { withCredentials: true });

      socket.on("booking_created", (data: any) => {
        toast.success(`⚡ New Live Booking Received! (${data?.bookingRef || "Ref"})`, {
          duration: 5000,
        });
        loadBookings(false);
      });

      socket.on("booking_updated", () => {
        loadBookings(false);
      });
    } catch (err) {
      console.error("Socket error in AdminBookingsClientView:", err);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleAssignTeamFromModal = async (
    teamId: string,
    teamName: string,
    notes?: string,
  ): Promise<boolean> => {
    if (!selectedBookingForAssign) return false;

    const targetDbId = selectedBookingForAssign.dbId;

    const res = await assignTeamToBookingAPI(targetDbId, {
      teamId,
      cleanerTeam: teamName,
      notes,
    });

    if (res?.success) {
      const assignedTeamDisplay = res.data?.cleanerTeam || teamName;

      setBookingList((prev) =>
        prev.map((b) =>
          b._dbId === targetDbId || b.id === selectedBookingForAssign.ref
            ? { ...b, status: "ASSIGNED", cleanerTeam: assignedTeamDisplay, teamRequests: [] }
            : b,
        ),
      );

      if (
        selectedBookingForDetails &&
        (selectedBookingForDetails._dbId === targetDbId ||
          selectedBookingForDetails.id === selectedBookingForAssign.ref)
      ) {
        setSelectedBookingForDetails((prev) =>
          prev ? { ...prev, status: "ASSIGNED", cleanerTeam: assignedTeamDisplay, teamRequests: [] } : null,
        );
      }

      toast.success(
        `Assigned "${assignedTeamDisplay}" to Booking #${selectedBookingForAssign.ref}`,
      );
      setSelectedBookingForAssign(null);
      return true;
    } else {
      toast.error(res?.message || "Failed to assign team");
      return false;
    }
  };

  const handleConfirmDirectApproval = async () => {
    if (!confirmApproveModal) return;
    setIsApprovingDirect(true);
    try {
      const res = await assignTeamToBookingAPI(confirmApproveModal.bookingId, {
        teamId: confirmApproveModal.teamId,
        cleanerTeam: confirmApproveModal.teamDisplayName,
      });

      if (res?.success) {
        const assignedTeamDisplay = res.data?.cleanerTeam || confirmApproveModal.teamDisplayName;

        setBookingList((prev) =>
          prev.map((b) =>
            b._dbId === confirmApproveModal.bookingId || b.id === confirmApproveModal.bookingRef
              ? { ...b, status: "ASSIGNED", cleanerTeam: assignedTeamDisplay, teamRequests: [] }
              : b,
          ),
        );

        if (
          selectedBookingForDetails &&
          (selectedBookingForDetails._dbId === confirmApproveModal.bookingId ||
            selectedBookingForDetails.id === confirmApproveModal.bookingRef)
        ) {
          setSelectedBookingForDetails((prev) =>
            prev ? { ...prev, status: "ASSIGNED", cleanerTeam: assignedTeamDisplay, teamRequests: [] } : null,
          );
        }

        toast.success(
          `Approved & Assigned "${assignedTeamDisplay}" to Booking #${confirmApproveModal.bookingRef}`,
        );
        setConfirmApproveModal(null);
      } else {
        toast.error(res?.message || "Failed to assign team");
      }
    } catch (err) {
      console.error("Direct approval error:", err);
      toast.error("Error approving team request");
    } finally {
      setIsApprovingDirect(false);
    }
  };

  const handleUpdateBookingStatus = async (
    id: string,
    newStatus: string,
  ) => {
    const booking = bookingList.find((b) => b.id === id || b._dbId === id);
    const targetDbId = booking?._dbId || id;

    const res = await updateAdminBookingStatusAPI(targetDbId, {
      status: newStatus,
    });

    if (res?.success) {
      setBookingList((prev) =>
        prev.map((b) =>
          b.id === id || b._dbId === targetDbId
            ? { ...b, status: newStatus as any }
            : b,
        ),
      );

      if (
        selectedBookingForDetails &&
        (selectedBookingForDetails.id === id ||
          selectedBookingForDetails._dbId === targetDbId)
      ) {
        setSelectedBookingForDetails((prev) =>
          prev ? { ...prev, status: newStatus as any } : null,
        );
      }

      toast.success(`Booking #${booking?.id || id} stage updated to ${newStatus}`);
    } else {
      toast.error(res?.message || "Failed to update booking status");
    }
  };

  const filteredBookings = bookingList.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "REQUESTED") {
      matchesStatus = Array.isArray(b.teamRequests) && b.teamRequests.some((r: any) => r.status === "PENDING");
    } else if (statusFilter !== "ALL") {
      matchesStatus = b.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const pendingRequestsCount = bookingList.filter(
    (b) => Array.isArray(b.teamRequests) && b.teamRequests.some((r: any) => r.status === "PENDING")
  ).length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 stroke-[2.5]" />
              </div>
              Bookings &amp; Dispatch Management
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ DISPATCH CONTROL CENTER
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Search customer subscription bookings, track job progress stages,
            review team leader booking requests, and assign pro cleaner teams.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadBookings(true)}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-[#007eff] ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["ALL", "REQUESTED", "PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED"].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                    statusFilter === st
                      ? "bg-[#007eff] text-white shadow-md shadow-blue-500/20"
                      : st === "REQUESTED" && pendingRequestsCount > 0
                      ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st === "REQUESTED" ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>TEAM REQUESTS</span>
                      {pendingRequestsCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
                          {pendingRequestsCount}
                        </span>
                      )}
                    </>
                  ) : (
                    st
                  )}
                </button>
              ),
            )}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Name, Area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <Loader2 className="w-8 h-8 text-[#007eff] animate-spin mx-auto" />
              <p className="font-extrabold text-slate-900 text-sm">Loading Live Booking Database...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((b) => {
              const pendingReqs = Array.isArray(b.teamRequests)
                ? b.teamRequests.filter((r: any) => r && (r.status === "PENDING" || !r.status))
                : [];

              return (
                <div
                  key={b._dbId || b.id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 shadow-xs ${
                    pendingReqs.length > 0
                      ? "border-amber-300 bg-amber-50/20 hover:border-amber-400 ring-1 ring-amber-400/30"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-black text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                        #{b.id}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                        {b.service}
                      </h3>
                      {pendingReqs.length > 0 && (
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-[#42990E]/15 text-[#1b3e04] border border-[#42990E]/40 flex items-center gap-1.5 animate-pulse">
                          <Sparkles className="w-3.5 h-3.5 text-[#42990E]" />
                          <span>Team Leader Request Pending</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Stage Selector Dropdown */}
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1 text-xs font-bold">
                        <span className="text-slate-500 font-semibold text-[11px]">
                          Stage:
                        </span>
                        <select
                          value={b.status}
                          onChange={(e) =>
                            handleUpdateBookingStatus(b.id, e.target.value)
                          }
                          className="bg-transparent font-extrabold text-slate-900 focus:outline-none cursor-pointer"
                        >
                          <option value="PENDING">PENDING DISPATCH</option>
                          <option value="ASSIGNED">TEAM ASSIGNED</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedBookingForDetails(b)}
                        className="px-3.5 py-1.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#007eff] font-extrabold text-xs border border-blue-200 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Team Request Banner Section */}
                  {pendingReqs.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-[#42990E]/15 border border-[#42990E]/40 flex items-center justify-between flex-wrap gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#42990E] animate-ping flex-shrink-0" />
                        <span className="font-black text-[#1b3e04]">
                          ⚡ Team Leader Request(s):{" "}
                          <span className="underline">
                            {pendingReqs
                              .map((r: any) => {
                                const tName = r.team?.teamName || "Field Squad";
                                const lName =
                                  r.team?.leader?.name ||
                                  r.requestedBy?.name ||
                                  (r.team?.teamCode ? `${r.team.teamCode}` : "Team Leader");
                                return `${tName} (${lName})`;
                              })
                              .join(", ")}
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const targetReq = pendingReqs[0];
                          const tId = targetReq?.team?._id || targetReq?.team || "";
                          const tName = targetReq?.team?.teamName || "Field Squad";
                          const lName =
                            targetReq?.team?.leader?.name ||
                            targetReq?.requestedBy?.name ||
                            "Team Leader";
                          const tCode = targetReq?.team?.teamCode || "";
                          const tDisplay = `${tName} (${tCode || lName})`;

                          setConfirmApproveModal({
                            bookingId: b._dbId || "",
                            bookingRef: b.id,
                            teamId: tId,
                            teamName: tName,
                            leaderName: lName,
                            teamDisplayName: tDisplay,
                          });
                        }}
                        className="px-4 py-1.5 rounded-xl bg-[#42990E] hover:bg-[#37800c] text-white font-black text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve &amp; Assign Squad</span>
                      </button>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs sm:text-sm">
                    {/* Customer Info */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">
                        Customer &amp; Contact
                      </span>
                      <p className="font-extrabold text-slate-900">
                        {b.customer}
                      </p>
                      <p className="text-xs text-slate-600 font-semibold">
                        {b.phone}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {b.email}
                      </p>
                    </div>

                    {/* Location & Specs */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">
                        Location &amp; Property
                      </span>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" /> {b.area}
                      </p>
                      <p className="text-xs text-slate-600 font-medium">
                        {b.address}
                      </p>
                      <p className="text-[11px] text-[#007eff] font-bold">
                        {b.specs} {b.sqft > 0 ? `(${b.sqft} sqft)` : ""}
                      </p>
                    </div>

                    {/* Schedule & Billing */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">
                        Schedule &amp; Amount
                      </span>
                      <p className="font-bold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />{" "}
                        {b.date}
                      </p>
                      <p className="text-xs text-amber-700 font-bold">{b.time}</p>
                      <p className="font-extrabold text-emerald-700 text-base">
                        {b.amount}{" "}
                        <span className="text-[10px] font-bold text-slate-500">
                          ({b.paymentStatus})
                        </span>
                      </p>
                    </div>

                    {/* Assigned Team & Action (Identical Blue Button for All Cards) */}
                    <div className="space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[11px]">
                          Cleaner Team
                        </span>
                        <p className="font-extrabold text-slate-900">
                          {b.cleanerTeam}
                        </p>
                      </div>

                      {(() => {
                        const isAlreadyAssigned =
                          b.status === "ASSIGNED" ||
                          (b.cleanerTeam && b.cleanerTeam !== "Unassigned");
                        return (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedBookingForAssign({
                                dbId: b._dbId || "",
                                ref: b.id,
                                customer: b.customer,
                                service: b.service,
                                teamRequests: b.teamRequests,
                              })
                            }
                            className={`w-full py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 ${
                              isAlreadyAssigned
                                ? "bg-[#F2D701] hover:bg-[#e2ca01] text-slate-950 border border-yellow-500/30"
                                : "bg-[#007eff] hover:bg-blue-600 text-white"
                            }`}
                          >
                            <Truck className="w-4 h-4" />
                            <span>
                              {isAlreadyAssigned
                                ? "Change Cleaner Team"
                                : "Assign Cleaner Team"}
                            </span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
              <p className="font-extrabold text-slate-900 text-base">
                No Bookings Found
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Try adjusting your search or status filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Direct Approval Confirmation Modal Popup */}
      {confirmApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-extrabold">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Approve Team Booking Request
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Booking Ref: <span className="text-[#007eff] font-bold">#{confirmApproveModal.bookingRef}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmApproveModal(null)}
                disabled={isApprovingDirect}
                className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-slate-800 space-y-2">
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                Are you sure you want to approve and assign booking{" "}
                <span className="font-black text-[#007eff]">
                  #{confirmApproveModal.bookingRef}
                </span>{" "}
                to requesting squad:
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-300 font-extrabold text-xs text-amber-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {confirmApproveModal.teamName} ({confirmApproveModal.leaderName})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmApproveModal(null)}
                disabled={isApprovingDirect}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDirectApproval}
                disabled={isApprovingDirect}
                className="px-6 py-2.5 rounded-2xl text-xs font-black text-white bg-[#42990E] hover:bg-[#37800c] transition-all cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isApprovingDirect ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Approving &amp; Assigning...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Approve Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Assign Cleaner Portal Modal */}
      {selectedBookingForAssign && (
        <AssignCleanerModal
          isOpen={!!selectedBookingForAssign}
          onClose={() => setSelectedBookingForAssign(null)}
          bookingRef={selectedBookingForAssign.ref}
          customerName={selectedBookingForAssign.customer}
          serviceTitle={selectedBookingForAssign.service}
          teamRequests={selectedBookingForAssign.teamRequests}
          onAssign={handleAssignTeamFromModal}
        />
      )}

      {/* Render Booking Details Portal Modal */}
      {selectedBookingForDetails && (
        <BookingDetailsModal
          isOpen={!!selectedBookingForDetails}
          onClose={() => setSelectedBookingForDetails(null)}
          booking={selectedBookingForDetails}
          onStatusChange={(newStatus) =>
            handleUpdateBookingStatus(selectedBookingForDetails.id, newStatus)
          }
          onOpenAssignModal={() => {
            setSelectedBookingForAssign({
              dbId: selectedBookingForDetails._dbId || "",
              ref: selectedBookingForDetails.id,
              customer: selectedBookingForDetails.customer,
              service: selectedBookingForDetails.service,
              teamRequests: selectedBookingForDetails.teamRequests,
            });
          }}
        />
      )}
    </div>
  );
}
