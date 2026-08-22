"use client";

import React, { useState } from "react";
import {
  Truck,
  Search,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import AssignCleanerModal from "@/components/admin/AssignCleanerModal";
import BookingDetailsModal, {
  BookingDetailRecord,
} from "@/components/admin/BookingDetailsModal";

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<{
    ref: string;
    customer: string;
    service: string;
  } | null>(null);

  const [selectedBookingForDetails, setSelectedBookingForDetails] =
    useState<BookingDetailRecord | null>(null);

  const [bookingList, setBookingList] = useState<BookingDetailRecord[]>([
    {
      id: "CLN-2026-8891",
      customer: "Tanvir Hasan",
      phone: "+880 1711-223344",
      email: "tanvir.hasan@gmail.com",
      service: "Basic Plan Monthly Clean #1",
      area: "Gulshan-2",
      address: "House 42, Road 11, Block D",
      sqft: 2200,
      specs: "3 Beds • 3 Baths",
      addons: ["Oven Deep Wash", "Sofa Shampoo"],
      amount: "৳6,000 (Basic Subscription)",
      paymentStatus: "PAID (bKash)",
      date: "Today, Aug 21, 2026",
      time: "10:00 AM - 12:30 PM",
      status: "ASSIGNED",
      cleanerTeam: "Team Delta (Supervisor Rahat)",
    },
    {
      id: "CLN-2026-8892",
      customer: "Sabrina Rahman",
      phone: "+880 1819-998877",
      email: "sabrina.r@gmail.com",
      service: "Standard Plan Weekly Clean #2",
      area: "Motijheel C/A",
      address: "Level 4, City Tower, Commercial Avenue",
      sqft: 4500,
      specs: "Corporate Office Floor",
      addons: ["Hospital-Grade Sanitization"],
      amount: "৳14,000 (Standard Subscription)",
      paymentStatus: "PAID (Stripe Credit Card)",
      date: "Today, Aug 21, 2026",
      time: "02:00 PM - 04:30 PM",
      status: "PENDING",
      cleanerTeam: "Unassigned",
    },
    {
      id: "CLN-2026-8894",
      customer: "Mahmudul Haq",
      phone: "+880 1722-445566",
      email: "mahmudul.haq@yahoo.com",
      service: "Residential Bi-Weekly Clean",
      area: "Dhanmondi 27",
      address: "Flat 4A, Concord Heights",
      sqft: 1800,
      specs: "2 Beds • 2 Baths",
      addons: ["Fridge Cleaning"],
      amount: "৳6,000",
      paymentStatus: "PAID (SSLCommerz)",
      date: "Tomorrow, Aug 22, 2026",
      time: "09:00 AM - 11:30 AM",
      status: "IN_PROGRESS",
      cleanerTeam: "Team Alpha (Selim Reza)",
    },
    {
      id: "CLN-2026-8895",
      customer: "Nusrat Jahan",
      phone: "+880 1988-112233",
      email: "nusrat.j@gmail.com",
      service: "Premium Plan Master Steam Clean #1",
      area: "Baridhara DOHS",
      address: "House 18, Road 4",
      sqft: 3600,
      specs: "Duplex Villa",
      addons: ["Floor Polish", "Window Shine"],
      amount: "৳30,000 (Premium Subscription)",
      paymentStatus: "PAID (bKash)",
      date: "Aug 20, 2026",
      time: "11:00 AM - 02:00 PM",
      status: "COMPLETED",
      cleanerTeam: "Team Delta (Supervisor Rahat)",
    },
  ]);

  const handleAssignTeamFromModal = (teamName: string) => {
    if (selectedBookingForAssign) {
      setBookingList((prev) =>
        prev.map((b) =>
          b.id === selectedBookingForAssign.ref
            ? { ...b, status: "ASSIGNED", cleanerTeam: teamName }
            : b,
        ),
      );

      if (
        selectedBookingForDetails &&
        selectedBookingForDetails.id === selectedBookingForAssign.ref
      ) {
        setSelectedBookingForDetails((prev) =>
          prev ? { ...prev, status: "ASSIGNED", cleanerTeam: teamName } : null,
        );
      }

      toast.success(
        `Assigned "${teamName}" to Booking #${selectedBookingForAssign.ref}`,
      );
      setSelectedBookingForAssign(null);
    }
  };

  const handleUpdateBookingStatus = (
    id: string,
    newStatus: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED",
  ) => {
    setBookingList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
    );

    if (selectedBookingForDetails && selectedBookingForDetails.id === id) {
      setSelectedBookingForDetails((prev) =>
        prev ? { ...prev, status: newStatus } : null,
      );
    }

    toast.success(`Booking #${id} stage updated to ${newStatus}`);
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
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b) => (
              <div
                key={b.id}
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
                          handleUpdateBookingStatus(b.id, e.target.value as any)
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
                      {b.specs} ({b.sqft} sqft)
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
