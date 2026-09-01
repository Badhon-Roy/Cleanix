"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  DollarSign,
  Truck,
  Users,
  UserCheck,
  CheckCircle2,
  XCircle,
  Hourglass,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Eye,
  Plus,
  MessageSquare,
  Mail,
  Phone,
} from "lucide-react";
import AssignCleanerModal from "@/components/admin/AssignCleanerModal";
import { IContact, fetchAllContactsAPI } from "@/services/contactService";
import { io } from "socket.io-client";

import {
  fetchAdminBookingsAPI,
  updateAdminBookingStatusAPI,
  assignTeamToBookingAPI,
} from "@/services/bookingService";

export default function AdminDashboardOverview() {
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<{
    ref: string;
    customer: string;
    service: string;
  } | null>(null);

  const [contactMessages, setContactMessages] = useState<IContact[]>([]);
  const [realBookings, setRealBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAdminOverviewData = async () => {
    setIsLoading(true);
    try {
      const [messagesData, bookingsRes] = await Promise.all([
        fetchAllContactsAPI(),
        fetchAdminBookingsAPI(),
      ]);

      if (Array.isArray(messagesData)) setContactMessages(messagesData);
      if (bookingsRes?.success && Array.isArray(bookingsRes?.data)) {
        setRealBookings(bookingsRes.data);
      }
    } catch (err) {
      console.error("Error loading admin overview:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminOverviewData();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("contact_created", () => loadAdminOverviewData());
    socket.on("contact_updated", () => loadAdminOverviewData());
    socket.on("booking_created", () => loadAdminOverviewData());
    socket.on("booking_updated", () => loadAdminOverviewData());

    return () => {
      socket.disconnect();
    };
  }, []);

  // Mock Real-Time Cleaner Job Application Requests (from /cleaner/available-jobs)
  const [cleanerApplications, setCleanerApplications] = useState([
    {
      id: "APP-901",
      jobId: "CLN-2026-8894",
      serviceTitle: "Post-Construction Deep Cleaning",
      customerArea: "Dhanmondi 27",
      cleanerName: "Rahat Karim (Supervisor)",
      cleanerPhone: "+880 1700-999888",
      payout: "৳3,500",
      status: "WAITING_APPROVAL",
    },
    {
      id: "APP-902",
      jobId: "CLN-2026-8895",
      serviceTitle: "Commercial Office Sanitization",
      customerArea: "Motijheel C/A",
      cleanerName: "Selim Reza (Senior Tech)",
      cleanerPhone: "+880 1811-223344",
      payout: "৳5,200",
      status: "WAITING_APPROVAL",
    },
  ]);

  // Dynamic Platform Bookings from real MongoDB backend
  const displayBookings = realBookings.length > 0
    ? realBookings.map((b: any) => ({
        id: b.bookingRef || `#CLN-${String(b._id).slice(-6).toUpperCase()}`,
        rawId: b._id,
        customerName: b.user?.name || "Valued Client",
        customerPhone: b.user?.phone || "+880 1700-000000",
        serviceType: typeof b.serviceType === "object" ? b.serviceType?.title || "Cleaning Care" : "Cleaning Care",
        area: b.address || "Dhaka Coverage Zone",
        amount: `৳${(b.totalAmount || 0).toLocaleString()}`,
        date: b.scheduledDate || "Scheduled Date",
        status: b.status || "CONFIRMED",
        cleanerTeam: b.cleanerTeam || (b.assignedTeam ? `${b.assignedTeam.teamName}` : "Unassigned"),
      }))
    : [
        {
          id: "CLN-2026-8891",
          rawId: "1",
          customerName: "Tanvir Hasan",
          customerPhone: "+880 1711-223344",
          serviceType: "VIP Standard Deep Cleaning",
          area: "Gulshan-2",
          amount: "৳14,000",
          date: "Today, Aug 21, 2026",
          status: "ASSIGNED",
          cleanerTeam: "Team Delta (Rahat Karim)",
        },
      ];

  const [filterStatus, setFilterStatus] = useState("ALL");

  const handleApproveApplication = (appId: string, jobId: string, cleanerName: string) => {
    setCleanerApplications((prev) => prev.filter((a) => a.id !== appId));
    setRealBookings((prev: any[]) =>
      prev.map((b: any) =>
        b.bookingRef === jobId || b._id === jobId
          ? { ...b, status: "ASSIGNED", cleanerTeam: `Team Delta (${cleanerName})` }
          : b
      )
    );
  };

  const handleRejectApplication = (appId: string) => {
    setCleanerApplications((prev) => prev.filter((a) => a.id !== appId));
  };

  const handleAssignTeamFromModal = (teamName: string) => {
    if (selectedBookingForAssign) {
      const targetBooking = realBookings.find(
        (b: any) => b.bookingRef === selectedBookingForAssign.ref || b._id === selectedBookingForAssign.ref
      );
      if (targetBooking?._id) {
        assignTeamToBookingAPI(targetBooking._id, { cleanerTeam: teamName }).then(() => {
          loadAdminOverviewData();
        });
      }
    }
  };

  const filteredBookings = displayBookings.filter((b) => {
    if (filterStatus === "ALL") return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Admin Control Banner */}
      <div className="bg-[#0d274c] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ADMIN CONTROL CENTER ACTIVE
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
              HQ MASTER CONTROLLER
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Cleanix Full Platform Control Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Manage full platform operations: approve cleaner job marketplace requests, dispatch field teams, configure dynamic pricing, and monitor real-time revenue analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setSelectedBookingForAssign({
                ref: "CLN-2026-8892",
                customer: "Sabrina Rahman",
                service: "Commercial Office Cleaning",
              })
            }
            className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#007eff] hover:bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400 transition-all cursor-pointer flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Quick Dispatch Team</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">৳1,48,500</p>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 inline-block">
                📈 +24% vs last mo
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Bookings */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Truck className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">142</p>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 inline-block">
                ⏱ 12 Pending
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Subscriptions */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
              Subscriptions
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Users className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">38</p>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300 inline-block">
                ★ 3 Active Tiers
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Verified Pro Cleaners */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
              Pro Cleaners
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">16 Staff</p>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300 inline-block">
                ⚡ 4 Hub Units
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Contact Form Inquiries Counter */}
        <Link
          href="/admin/messages"
          className="bg-white border-2 border-dashed border-amber-300 hover:border-amber-500 transition-all rounded-3xl p-5 space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider group-hover:text-[#007eff]">
              Inquiries Inbox
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {contactMessages.filter((m) => m.status === "NEW").length} Unread
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 w-fit">
                <span>View Messages</span>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* REAL-TIME CLEANER MARKETPLACE JOB APPLICATION REQUESTS (APPROVAL CENTER) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#007eff]" /> Cleaner Job Application Approval Center
              </h2>
              <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                {cleanerApplications.length} Pending Approvals
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Cleaners apply for unassigned customer bookings from the Cleaner Marketplace (`/cleaner/available-jobs`). Approve requests to dispatch.
            </p>
          </div>
        </div>

        {cleanerApplications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cleanerApplications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-3xl border border-amber-200 bg-amber-50/40 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#007eff] bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                      {app.jobId}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {app.serviceTitle}
                    </h3>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 uppercase">
                    Waiting Approval
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Applied Cleaner:</span>
                    <p className="font-extrabold text-slate-900">{app.cleanerName}</p>
                    <p className="text-slate-600 font-medium">{app.cleanerPhone}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Location & Payout:</span>
                    <p className="font-extrabold text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" /> {app.customerArea}
                    </p>
                    <p className="font-extrabold text-emerald-700">{app.payout} Est. Payout</p>
                  </div>
                </div>

                {/* Admin Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleApproveApplication(app.id, app.jobId, app.cleanerName)}
                    className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Assign Job</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRejectApplication(app.id)}
                    className="py-2.5 px-4 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4 text-slate-500" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-extrabold text-slate-900 text-base">All Job Requests Approved!</p>
            <p className="text-xs text-slate-500 font-medium">
              There are no pending cleaner marketplace job applications at this moment.
            </p>
          </div>
        )}
      </div>

      {/* RECENT PLATFORM BOOKINGS TABLE & DISPATCH MANAGER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#007eff]" /> Recent Platform Bookings & Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              View customer bookings across residential & commercial clients. Assign field cleaner teams.
            </p>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["ALL", "PENDING", "ASSIGNED", "COMPLETED"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer transition-all ${filterStatus === st
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service Package</th>
                <th className="p-4">Area Location</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Cleaner Team</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-[#007eff]">{b.id}</td>
                  <td className="p-4">
                    <p className="font-extrabold text-slate-900">{b.customerName}</p>
                    <p className="text-xs text-slate-500 font-medium">{b.customerPhone}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{b.serviceType}</td>
                  <td className="p-4 text-slate-700 font-semibold">{b.area}</td>
                  <td className="p-4 font-black text-slate-900">{b.amount}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800">{b.cleanerTeam}</span>
                  </td>
                  <td className="p-4">
                    {b.status === "ASSIGNED" ? (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Assigned
                      </span>
                    ) : b.status === "PENDING" ? (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                        Pending Team
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBookingForAssign({
                          ref: b.id,
                          customer: b.customerName,
                          service: b.serviceType,
                        })
                      }
                      className="bg-blue-50 hover:bg-blue-100 text-[#007eff] font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                    >
                      Assign Team
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
