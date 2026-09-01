"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
  FileText,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Users,
  Play,
  Check,
} from "lucide-react";
import LiveJobTracker from "@/components/dashboard/LiveJobTracker";
import InvoiceModal, { InvoiceData } from "@/components/dashboard/InvoiceModal";
import JobDetailsModal from "@/components/dashboard/JobDetailsModal";
import { getAuthUser } from "@/utils/cookie";
import {
  fetchMyBookingsAPI,
  fetchAdminBookingsAPI,
  updateBookingProgressAPI,
  requestBookingByTeamAPI,
} from "@/services/bookingService";
import { fetchMySubscriptionsAPI, downloadSubscriptionPDFAPI } from "@/services/subscriptionService";
import { io, Socket } from "socket.io-client";

export default function DashboardClientView({
  initialBookings = [],
  initialSubscriptions = [],
  initialAdminBookings = [],
}: {
  initialBookings?: any[];
  initialSubscriptions?: any[];
  initialAdminBookings?: any[];
}) {
  const [user, setUser] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [selectedJobSpec, setSelectedJobSpec] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [subscriptions, setSubscriptions] = useState<any[]>(initialSubscriptions);
  const [adminBookings, setAdminBookings] = useState<any[]>(initialAdminBookings);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const role = user?.role || "CUSTOMER";
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const isTeamLeader = role === "TEAM_LEADER" || role === "CLEANER";

  // Refetch latest data
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        const adminRes = await fetchAdminBookingsAPI();
        if (adminRes?.success && Array.isArray(adminRes?.data)) {
          setAdminBookings(adminRes.data);
        }
      } else {
        const [bRes, sRes] = await Promise.all([
          fetchMyBookingsAPI(),
          fetchMySubscriptionsAPI(),
        ]);
        if (bRes?.success && Array.isArray(bRes?.data)) {
          setBookings(bRes.data);
        }
        if (sRes?.success && Array.isArray(sRes?.data)) {
          setSubscriptions(sRes.data);
        }
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadDashboardData();

    // Socket.io Real-time Event Listener for instant on-the-fly updates
    const socketUrl =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    const handleBookingRealtimeEvent = (data?: any) => {
      if (data && data._id) {
        setBookings((prev) => {
          const exists = prev.some((b) => b._id === data._id);
          if (exists) {
            return prev.map((b) => (b._id === data._id ? { ...b, ...data } : b));
          } else {
            return [data, ...prev];
          }
        });
        setAdminBookings((prev) => {
          const exists = prev.some((b) => b._id === data._id);
          if (exists) {
            return prev.map((b) => (b._id === data._id ? { ...b, ...data } : b));
          } else {
            return [data, ...prev];
          }
        });
      }
      loadDashboardData();
    };

    socket.on("booking_created", handleBookingRealtimeEvent);
    socket.on("booking_updated", handleBookingRealtimeEvent);
    socket.on("team_updated", handleBookingRealtimeEvent);
    socket.on("cleaner_updated", handleBookingRealtimeEvent);
    socket.on("subscription_created", () => loadDashboardData());
    socket.on("subscription_updated", () => loadDashboardData());

    return () => {
      socket.off("booking_created", handleBookingRealtimeEvent);
      socket.off("booking_updated", handleBookingRealtimeEvent);
      socket.off("team_updated", handleBookingRealtimeEvent);
      socket.off("cleaner_updated", handleBookingRealtimeEvent);
      socket.off("subscription_created");
      socket.off("subscription_updated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loadDashboardData]);

  // Handle Team Leader or Cleaner Job Progress Update
  const handleUpdateJobProgress = async (bookingId: string, status: string) => {
    try {
      const res = await updateBookingProgressAPI(bookingId, { status });
      if (res?.success) {
        loadDashboardData();
      } else {
        alert(res?.message || "Failed to update job status.");
      }
    } catch (err: any) {
      alert(err?.message || "An error occurred.");
    }
  };

  // Handle Team Request for Unassigned Job
  const handleRequestJob = async (bookingId: string) => {
    try {
      const res = await requestBookingByTeamAPI(bookingId);
      if (res?.success) {
        alert("Job request submitted to admin successfully!");
        loadDashboardData();
      } else {
        alert(res?.message || "Failed to request job.");
      }
    } catch (err: any) {
      alert(err?.message || "Error requesting job.");
    }
  };

  // Compute Active Subscription
  const activeSubscription = subscriptions.find(
    (s) => s.status === "ACTIVE" && !s.isDeleted
  ) || subscriptions[0];

  // Active Running Bookings list (for all active jobs tracking!)
  const activeRunningBookings = bookings.filter(
    (b) =>
      (b.status === "PENDING" ||
        b.status === "SCHEDULED" ||
        b.status === "CONFIRMED" ||
        b.status === "ASSIGNED" ||
        b.status === "EN_ROUTE" ||
        b.status === "IN_PROGRESS" ||
        b.status === "COMPLETION_REQUESTED") &&
      !b.isDeleted
  );

  const activeTrackerBooking = activeRunningBookings[0] || bookings[0];

  const totalBookingsCount = isAdmin ? adminBookings.length : bookings.length;
  const activePlanTitle = activeSubscription
    ? activeSubscription.planTitle || activeSubscription.planId
    : "Standard";
  const totalVisits = activeSubscription?.totalVisitsPerMonth || 4;
  const remainingVisits = activeSubscription?.remainingVisits ?? 1;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d274c] to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#007eff]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs sm:text-sm font-bold mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {isAdmin
                  ? "SYSTEM ADMIN PORTAL"
                  : isTeamLeader
                  ? "FIELD TEAM OPERATIONS"
                  : "CUSTOMER PORTAL DASHBOARD"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Welcome back, {user?.name || (isAdmin ? "Admin" : "Valued Member")}! 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl font-medium">
              {isAdmin
                ? "Manage customer bookings, approve team assignments, and monitor live cleaning operations across Dhaka."
                : isTeamLeader
                ? "View assigned team jobs, request available unassigned bookings, and update live progress status."
                : `Your monthly cleaning care is active. Next service: ${
                    activeTrackerBooking?.scheduledDate || "Scheduled Date"
                  }.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
              <span>Sync Status</span>
            </button>

            {!isAdmin && !isTeamLeader && (
              <Link
                href="/dashboard/new-booking"
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition-all cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Book New Service</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1 */}
        <Link
          href="/dashboard/bookings"
          className="bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-all group cursor-pointer shadow-xs"
        >
          <div>
            <p className="text-xs font-bold text-[#007eff] uppercase tracking-wider">
              {isAdmin ? "Total System Jobs" : "Total Bookings"}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {totalBookingsCount} Jobs
            </h3>
            <span className="text-xs text-emerald-600 font-bold mt-1 block">
              100% Verified records ➔
            </span>
          </div>
          <div className="w-13 h-13 p-3 rounded-2xl bg-blue-50 border border-blue-100 text-[#007eff] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
        </Link>

        {/* Stat 2 */}
        <Link
          href="/dashboard/subscription"
          className="bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-all group cursor-pointer shadow-xs"
        >
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Active Plan
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {activePlanTitle}
            </h3>
            <span className="text-xs text-blue-600 font-bold mt-1 block">
              ৳{(activeSubscription?.totalAmount || 14000).toLocaleString()} / Month ➔
            </span>
          </div>
          <div className="w-13 h-13 p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <CreditCard className="w-7 h-7" />
          </div>
        </Link>

        {/* Stat 3 */}
        <Link
          href="/dashboard/subscription"
          className="bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-all group cursor-pointer shadow-xs"
        >
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Visits Credit
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {remainingVisits} / {totalVisits} Left
            </h3>
            <span className="text-xs text-amber-700 font-bold mt-1 block">
              Active monthly cycle ➔
            </span>
          </div>
          <div className="w-13 h-13 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Clock className="w-7 h-7" />
          </div>
        </Link>

        {/* Stat 4 */}
        <Link
          href="/dashboard/invoices"
          className="bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-all group cursor-pointer shadow-xs"
        >
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Billing Statements
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {subscriptions.length + bookings.length} Records
            </h3>
            <span className="text-xs text-slate-600 font-bold mt-1 block">
              Tax Compliant Invoices ➔
            </span>
          </div>
          <div className="w-13 h-13 p-3 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </Link>
      </div>

      {/* CUSTOMER LIVE JOB TRACKER SECTION FOR ALL ACTIVE JOBS */}
      {!isAdmin && activeRunningBookings.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span>Active Job Real-Time Tracker ({activeRunningBookings.length} Running)</span>
            </h2>

            {activeRunningBookings.length > 1 && (
              <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-blue-50 text-[#007eff] border border-blue-200 tracking-wider">
                ⚡ MULTIPLE ACTIVE JOBS TRACKING ({activeRunningBookings.length} LIVE)
              </span>
            )}
          </div>

          <div className="space-y-8">
            {activeRunningBookings.map((b) => {
              const serviceTitle =
                typeof b.serviceType === "object"
                  ? b.serviceType?.title || b.serviceType?.name || "Cleaning Care"
                  : "Cleaning Care";
              const ref = b.bookingRef || `#CLN-${String(b._id).slice(-6).toUpperCase()}`;

              return (
                <LiveJobTracker
                  key={b._id}
                  bookingId={b._id}
                  bookingNumber={ref}
                  serviceName={serviceTitle}
                  address={b.address || "Dhaka Coverage Zone"}
                  status={b.status}
                  cleanerTeam={b.cleanerTeam}
                  assignedTeam={b.assignedTeam}
                  assignedCleaners={b.assignedCleaners}
                  scheduledDate={b.scheduledDate}
                  timeSlot={b.timeSlot}
                  proofOfWork={b.proofOfWork}
                  onRefresh={loadDashboardData}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* TEAM LEADER / CLEANER WORKSPACE OPERATIONS */}
      {isTeamLeader && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                Field Team Operations & Job Progress Control
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                আপনার টিমের অ এসাইনড সার্ভিসগুলোর স্ট্যাটাস `IN_PROGRESS` বা `COMPLETED` আপডেট করুন।
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-50/70 text-indigo-900 border-b border-indigo-200 uppercase tracking-wider text-xs font-bold">
                  <th className="p-4 pl-5">Booking Ref</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Service Package</th>
                  <th className="p-4">Date &amp; Slot</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-5">Update Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-indigo-50/30">
                    <td className="p-4 pl-5 font-mono font-bold text-indigo-700">
                      {b.bookingRef}
                    </td>
                    <td className="p-4 font-bold">
                      {b.user?.name || "Valued Client"}
                      <span className="text-xs text-slate-500 font-normal block">
                        {b.address}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {b.serviceType?.title || "Cleaning Care"}
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">
                      {b.scheduledDate} ({b.timeSlot})
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                          b.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : b.status === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-800 border-blue-300 animate-pulse"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-5 whitespace-nowrap">
                      {b.status !== "COMPLETED" ? (
                        <div className="flex items-center justify-end gap-2">
                          {b.status !== "IN_PROGRESS" && (
                            <button
                              onClick={() => handleUpdateJobProgress(b._id, "IN_PROGRESS")}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Start (IN_PROGRESS)</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateJobProgress(b._id, "COMPLETED")}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Mark Completed</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700">✓ Job Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid: Subscription & Quick Addons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Subscription Details */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {activeSubscription ? `Active Plan: ${activePlanTitle}` : "No Active Subscription"}
                </h3>
                <span
                  className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                    activeSubscription?.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {activeSubscription?.status || "INACTIVE"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                {activeSubscription
                  ? `${activeSubscription.zoneName || "Dhaka Zone"} • ${totalVisits} Monthly Visits`
                  : "Subscribe for weekly sanitization & deep cleaning."}
              </p>
            </div>
            <span className="text-xl font-bold text-[#007eff]">
              ৳{(activeSubscription?.totalAmount || 14000).toLocaleString()}{" "}
              <span className="text-xs text-slate-400 font-normal">/mo</span>
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-700">
                  Monthly Usage: {totalVisits - remainingVisits} of {totalVisits} visits used
                </span>
                <span className="text-[#007eff] font-bold">
                  {Math.round(((totalVisits - remainingVisits) / totalVisits) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-[#007eff] to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(((totalVisits - remainingVisits) / totalVisits) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-xs font-semibold">Next Visit:</span>
                <strong className="text-slate-900 font-bold">
                  {activeTrackerBooking?.scheduledDate || "Scheduled Date"}
                </strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-xs font-semibold">Billing Renewal:</span>
                <strong className="text-slate-900 font-bold">
                  {activeSubscription?.endDate
                    ? new Date(activeSubscription.endDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "30 Days Period"}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/dashboard/subscription"
              className="text-xs sm:text-sm text-[#007eff] hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Manage Subscription & Upgrade Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recommended Add-ons */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Popular Add-On Upgrades
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              Add extra services to your upcoming clean at special subscriber discounts:
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard/new-booking"
              className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors text-xs sm:text-sm group cursor-pointer"
            >
              <div>
                <p className="font-bold text-slate-900 group-hover:text-[#007eff] transition-colors">
                  Sofa & Carpet Steam Wash
                </p>
                <p className="text-xs text-slate-500 font-medium">Deep anti-allergen extraction</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-amber-600">+৳1,500</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007eff]" />
              </div>
            </Link>

            <Link
              href="/dashboard/new-booking"
              className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors text-xs sm:text-sm group cursor-pointer"
            >
              <div>
                <p className="font-bold text-slate-900 group-hover:text-[#007eff] transition-colors">
                  Kitchen Oven & Chimney Care
                </p>
                <p className="text-xs text-slate-500 font-medium">Grease-free sparkling finish</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-amber-600">+৳1,200</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007eff]" />
              </div>
            </Link>
          </div>

          <Link
            href="/dashboard/new-booking"
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm text-center border border-slate-200 transition-colors block cursor-pointer"
          >
            Customize Service Add-Ons
          </Link>
        </div>
      </div>

      {/* Recent Bookings Table Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Recent Service History</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Click any row or ID to inspect job specs, or view invoices.
            </p>
          </div>

          <Link
            href="/dashboard/bookings"
            className="text-xs sm:text-sm font-bold text-[#007eff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-xs">
                <th className="p-4 pl-4 font-bold">Booking Ref</th>
                <th className="p-4 font-bold">Service Type</th>
                <th className="p-4 font-bold">Date & Time</th>
                <th className="p-4 font-bold">Location</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 text-right pr-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {(isAdmin ? adminBookings : bookings).slice(0, 5).map((b: any) => {
                const serviceTitle =
                  typeof b.serviceType === "object"
                    ? b.serviceType?.title || b.serviceType?.name || "Cleaning Care"
                    : "Cleaning Care";
                const ref = b.bookingRef || `#CLN-${String(b._id).slice(-6).toUpperCase()}`;

                return (
                  <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-4 font-mono font-bold text-[#007eff]">
                      <button
                        onClick={() => setSelectedJobSpec(b)}
                        className="hover:underline font-bold text-[#007eff] cursor-pointer"
                      >
                        {ref}
                      </button>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{serviceTitle}</td>
                    <td className="p-4 text-slate-600 font-semibold">
                      {b.scheduledDate} ({b.timeSlot})
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">{b.address}</td>
                    <td className="p-4 font-bold text-slate-900">
                      ৳{(b.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                          b.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : b.status === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-800 border-blue-300 animate-pulse"
                            : b.status === "CANCELLED"
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-4 space-x-2">
                      <button
                        onClick={() => {
                          const invNum = `INV-${ref.replace(/#/g, "")}`;
                          setSelectedInvoice({
                            id: String(b._id),
                            invoiceNumber: invNum,
                            bookingNumber: ref,
                            date: b.createdAt
                              ? new Date(b.createdAt).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Recent",
                            customerName: b.user?.name || "Valued Client",
                            customerAddress: b.address || "Dhaka, Bangladesh",
                            serviceTitle,
                            items: [
                              {
                                description: `${serviceTitle} (${b.scheduledDate || ""})`,
                                qty: 1,
                                unitPrice: b.totalAmount || 0,
                                total: b.totalAmount || 0,
                              },
                            ],
                            subtotal: b.totalAmount || 0,
                            vat: 0,
                            discount: 0,
                            totalAmount: b.totalAmount || 0,
                            paymentMethod: b.paymentMethod || "BKASH",
                            paymentStatus: b.paymentStatus || "PAID",
                            transactionId: `TXN-${String(b._id).slice(-8).toUpperCase()}`,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007eff] hover:underline bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={!!selectedJobSpec}
        onClose={() => setSelectedJobSpec(null)}
        bookingNumber={selectedJobSpec?.bookingRef}
        serviceTitle={selectedJobSpec?.serviceType?.title || "Cleaning Service"}
        date={selectedJobSpec?.scheduledDate}
        address={selectedJobSpec?.address}
      />
    </div>
  );
}
