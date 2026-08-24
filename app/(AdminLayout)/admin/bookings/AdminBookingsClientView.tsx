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
  } | null>(null);

  const [selectedBookingForDetails, setSelectedBookingForDetails] =
    useState<BookingDetailRecord | null>(null);

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
    // If no initial props were drilled, fetch from API on mount
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
            ? { ...b, status: "ASSIGNED", cleanerTeam: assignedTeamDisplay }
            : b,
        ),
      );

      if (
        selectedBookingForDetails &&
        (selectedBookingForDetails._dbId === targetDbId ||
          selectedBookingForDetails.id === selectedBookingForAssign.ref)
      ) {
        setSelectedBookingForDetails((prev) =>
          prev ? { ...prev, status: "ASSIGNED", cleanerTeam: assignedTeamDisplay } : null,
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

    const matchesStatus =
      statusFilter === "ALL" ? true : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
              Bookings & Dispatch Management
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ DISPATCH CONTROL CENTER
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Search customer subscription bookings, track job progress stages,
            and assign pro cleaner teams to field dispatches.
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
            {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED"].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all ${
                    statusFilter === st
                      ? "bg-[#007eff] text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st}
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
            filteredBookings.map((b) => (
              <div
                key={b._dbId || b.id}
                className="p-6 rounded-3xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-4 shadow-xs"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                      #{b.id}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {b.service}
                    </h3>
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

                  {/* Assigned Team & Action */}
                  <div className="space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[11px]">
                        Cleaner Team
                      </span>
                      <p className="font-extrabold text-slate-900">
                        {b.cleanerTeam}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBookingForAssign({
                          dbId: b._dbId || "",
                          ref: b.id,
                          customer: b.customer,
                          service: b.service,
                        })
                      }
                      className="w-full py-2.5 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>
                        {b.status === "ASSIGNED"
                          ? "Reassign Team"
                          : "Assign Cleaner Team"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
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

      {/* Render Assign Cleaner Portal Modal */}
      {selectedBookingForAssign && (
        <AssignCleanerModal
          isOpen={!!selectedBookingForAssign}
          onClose={() => setSelectedBookingForAssign(null)}
          bookingRef={selectedBookingForAssign.ref}
          customerName={selectedBookingForAssign.customer}
          serviceTitle={selectedBookingForAssign.service}
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
            });
          }}
        />
      )}
    </div>
  );
}
