"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  FileText,
  Star,
  ShieldCheck,
  Plus,
  Truck,
  Radio,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  RefreshCw,
  XCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import LiveJobTracker from "@/components/dashboard/LiveJobTracker";
import InvoiceModal, { InvoiceData } from "@/components/dashboard/InvoiceModal";
import RateServiceModal from "@/components/dashboard/RateServiceModal";
import { fetchMyBookingsAPI, cancelBookingAPI } from "@/services/bookingService";

export default function BookingsClientView({
  initialBookings = [],
}: {
  initialBookings?: any[];
}) {
  const [bookingsList, setBookingsList] = useState<any[]>(initialBookings);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [ratingBooking, setRatingBooking] = useState<{ id: string; title: string } | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<any | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const ITEMS_PER_PAGE = 8;

  // Sync initial bookings prop
  useEffect(() => {
    if (initialBookings && initialBookings.length > 0) {
      setBookingsList(initialBookings);
    }
  }, [initialBookings]);

  // Client-side auto-fetch on mount for freshest data
  const loadBookings = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchMyBookingsAPI();
      if (res?.success && Array.isArray(res?.data)) {
        setBookingsList(res.data);
      }
    } catch (err) {
      console.error("Client fetch bookings error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Status mapping helper
  const getStatusConfig = (status: string) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "IN_PROGRESS":
        return {
          key: "ACTIVE",
          label: "In Progress (Live)",
          badgeClass: "bg-white text-[#007eff] border-white font-black",
          cardBg: "bg-gradient-to-r from-[#007eff] via-blue-600 to-blue-700 text-white border-2 border-[#007eff] ring-2 ring-blue-200",
          isLive: true,
        };
      case "ASSIGNED":
        return {
          key: "ACTIVE",
          label: "Team Assigned",
          badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-300 font-extrabold",
          cardBg: "bg-indigo-50/70 hover:bg-white border border-indigo-200 text-slate-900",
          isLive: true,
        };
      case "CONFIRMED":
        return {
          key: "SCHEDULED",
          label: "Confirmed",
          badgeClass: "bg-blue-100 text-blue-800 border-blue-300 font-extrabold",
          cardBg: "bg-slate-50 hover:bg-white border border-slate-200 text-slate-900",
          isLive: false,
        };
      case "PENDING":
        return {
          key: "SCHEDULED",
          label: "Pending Confirmation",
          badgeClass: "bg-amber-100 text-amber-800 border-amber-300 font-extrabold",
          cardBg: "bg-amber-50/40 hover:bg-white border border-amber-200 text-slate-900",
          isLive: false,
        };
      case "COMPLETED":
        return {
          key: "COMPLETED",
          label: "Completed",
          badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
          cardBg: "bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-100/80 border border-emerald-300 text-slate-900",
          isLive: false,
        };
      case "CANCELLED":
        return {
          key: "CANCELLED",
          label: "Cancelled",
          badgeClass: "bg-rose-100 text-rose-800 border-rose-300 font-extrabold",
          cardBg: "bg-rose-50/40 opacity-80 border border-rose-200 text-slate-700",
          isLive: false,
        };
      default:
        return {
          key: "SCHEDULED",
          label: s || "Scheduled",
          badgeClass: "bg-slate-100 text-slate-700 border-slate-300 font-bold",
          cardBg: "bg-slate-50 hover:bg-white border border-slate-200 text-slate-900",
          isLive: false,
        };
    }
  };

  // Format DB bookings list
  const formattedBookings = bookingsList.map((b: any) => {
    // Dynamic Service Name
    let serviceTitle = "Professional Deep Cleaning";
    if (typeof b.serviceType === "object" && b.serviceType !== null) {
      serviceTitle = b.serviceType.title || b.serviceType.name || serviceTitle;
    } else if (typeof b.serviceType === "string" && b.serviceType.length > 0) {
      serviceTitle =
        b.serviceType === "RESIDENTIAL"
          ? "Residential Home Deep Cleaning"
          : b.serviceType === "COMMERCIAL"
          ? "Commercial Office Cleaning"
          : b.serviceType === "MOVE_IN_OUT"
          ? "Move-In / Move-Out Deep Clean"
          : b.serviceType;
    }

    // Dynamic Space Details based on backend schema & custom values
    const categoryFields: any[] = Array.isArray(b.serviceType?.fields)
      ? b.serviceType.fields.filter((f: any) => f.enabled !== false)
      : [];
    const customVals: Record<string, any> = b.customFieldValues || {};
    const fieldParts: string[] = [];

    if (categoryFields.length > 0) {
      // Respect enabled fields from populated ServiceCategory schema
      for (const field of categoryFields) {
        const val = customVals[field.id] ?? b[field.id];
        if (val !== undefined && val !== null && val !== "" && Number(val) > 0) {
          const unitStr = field.unit ? ` ${field.unit}` : "";
          if (field.id === "sqft" || field.id === "area") {
            fieldParts.push(`${Number(val).toLocaleString()}${unitStr || " SqFt"}`);
          } else if (field.id === "bedrooms") {
            fieldParts.push(`${val} Bed`);
          } else if (field.id === "bathrooms") {
            fieldParts.push(`${val} Bath`);
          } else {
            const fieldLabel = (field.label || "").split("(")[0].trim();
            fieldParts.push(`${val}${unitStr} ${fieldLabel}`);
          }
        }
      }
    } else {
      // Fallback if fields array is not populated: check customVals directly
      if (customVals.bedrooms && Number(customVals.bedrooms) > 0) {
        fieldParts.push(`${customVals.bedrooms} Bed`);
      }
      if (customVals.bathrooms && Number(customVals.bathrooms) > 0) {
        fieldParts.push(`${customVals.bathrooms} Bath`);
      }
      if (customVals.sqft && Number(customVals.sqft) > 0) {
        fieldParts.push(`${Number(customVals.sqft).toLocaleString()} SqFt`);
      }
    }

    // If no custom fields were resolved, extract non-addon service line items from backend b.services
    if (fieldParts.length === 0 && Array.isArray(b.services) && b.services.length > 0) {
      const customItems = b.services.filter(
        (s: any) => !s.addOn && !s.name?.toLowerCase().includes("বেসিক") && !s.name?.toLowerCase().includes("base")
      );
      customItems.forEach((item: any) => {
        if (item.name) fieldParts.push(item.name);
      });
    }

    let spaceSummary = fieldParts.length > 0 ? fieldParts.join(", ") : "Standard Service Package";

    const addonCount = Array.isArray(b.selectedAddons) ? b.selectedAddons.length : 0;
    if (addonCount > 0) {
      spaceSummary += ` • ${addonCount} ${addonCount === 1 ? "Addon" : "Addons"}`;
    }

    // Dynamic Address
    let address = b.address || "Dhaka";
    if (b.coverageArea && typeof b.coverageArea === "object") {
      const zoneStr = [b.coverageArea.zoneName, b.coverageArea.district].filter(Boolean).join(", ");
      if (zoneStr && !address.includes(b.coverageArea.zoneName)) {
        address = `${address} (${zoneStr})`;
      }
    }

    // Status Config
    const statusCfg = getStatusConfig(b.status);

    return {
      raw: b,
      mongoId: String(b._id),
      id: b.bookingRef || `#CLN-${String(b._id).slice(-6).toUpperCase()}`,
      title: serviceTitle,
      type: spaceSummary,
      date: `${b.scheduledDate || "Scheduled"} • ${b.timeSlot || "Standard Slot"}`,
      address: address,
      amount: `৳${(b.totalAmount || 0).toLocaleString()}`,
      statusRaw: b.status,
      statusKey: statusCfg.key,
      statusText: statusCfg.label,
      badgeClass: statusCfg.badgeClass,
      cardBg: statusCfg.cardBg,
      isLive: statusCfg.isLive,
      cleanerTeam: b.cleanerTeam || (b.assignedTeam?.name ? `Team: ${b.assignedTeam.name}` : "Cleanix Field Team (Assigned)"),
      rating: 5,
    };
  });

  // Active Job Tracker Target (First IN_PROGRESS or ASSIGNED)
  const activeJob = formattedBookings.find(
    (b) => b.statusRaw === "IN_PROGRESS" || b.statusRaw === "ASSIGNED"
  );

  // Dynamic Invoice Builder
  const handleOpenInvoice = (booking: any) => {
    const raw = booking.raw || {};
    let itemsList: any[] = [];

    if (Array.isArray(raw.services) && raw.services.length > 0) {
      itemsList = raw.services.map((s: any) => ({
        description: s.name,
        qty: 1,
        unitPrice: s.value || 0,
        total: s.value || 0,
      }));
    } else {
      itemsList = [
        {
          description: `${booking.title} (${booking.type})`,
          qty: 1,
          unitPrice: raw.totalAmount || 0,
          total: raw.totalAmount || 0,
        },
      ];
    }

    const formattedDate = raw.createdAt
      ? new Date(raw.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : raw.scheduledDate || "Today";

    const generatedInvoice: InvoiceData = {
      id: booking.mongoId,
      invoiceNumber: `INV-${(booking.id || "").replace(/[^a-zA-Z0-9]/g, "") || "9042"}`,
      bookingNumber: booking.id,
      date: formattedDate,
      customerName: raw.user?.name || "Cleanix Customer",
      customerAddress: booking.address,
      serviceTitle: booking.title,
      items: itemsList,
      subtotal: raw.totalAmount || 0,
      vat: 0,
      discount: 0,
      totalAmount: raw.totalAmount || 0,
      paymentMethod: raw.paymentMethod ? `${raw.paymentMethod} Payment` : "bKash Online Payment",
      paymentStatus: raw.paymentStatus || "PAID",
      transactionId: `TXN-${booking.mongoId.slice(-8).toUpperCase()}`,
    };

    setSelectedInvoice(generatedInvoice);
  };

  // Cancel Booking Action
  const confirmCancel = async () => {
    if (!cancelModalBooking) return;
    setIsCancelling(true);
    try {
      const res = await cancelBookingAPI(cancelModalBooking.mongoId);
      if (res?.success) {
        setBookingsList((prev) =>
          prev.map((item) =>
            String(item._id) === cancelModalBooking.mongoId
              ? { ...item, status: "CANCELLED" }
              : item
          )
        );
        setCancelModalBooking(null);
      } else {
        alert(res?.message || "Failed to cancel booking.");
      }
    } catch (err: any) {
      console.error("Cancel booking error:", err);
      alert(err?.message || "An error occurred while cancelling.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Filter items based on active tab
  const filteredBookings = formattedBookings.filter((b) => {
    if (filter === "ACTIVE") return b.statusRaw === "IN_PROGRESS" || b.statusRaw === "ASSIGNED";
    if (filter === "SCHEDULED") return b.statusRaw === "CONFIRMED" || b.statusRaw === "PENDING";
    if (filter === "COMPLETED") return b.statusRaw === "COMPLETED";
    if (filter === "CANCELLED") return b.statusRaw === "CANCELLED";
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleTabChange = (key: string) => {
    setFilter(key);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings & Live Job Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Track active field cleaner teams in real-time, view scheduled visits, and access job receipts.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={loadBookings}
            disabled={isRefreshing}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            title="Refresh Bookings Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#007eff]" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/dashboard/new-booking"
            className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Book New Service</span>
          </Link>
        </div>
      </div>

      {/* Live Job Tracker Container */}
      {activeJob ? (
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#007eff] flex items-center gap-2">
            <Truck className="w-4 h-4" /> Active Job Real-Time Tracker
          </h2>
          <LiveJobTracker
            bookingNumber={activeJob.id}
            serviceName={activeJob.title}
            address={activeJob.address}
          />
        </div>
      ) : (
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#007eff] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-xl mb-2">No Active Field Cleaning Currently In Progress</h4>
              <p className="text-xs text-slate-600 font-medium">আপনার এই মুহূর্তে কোনো রানিং ফিল্ড টিম ডিলিভারি নেই।</p>
            </div>
          </div>
          <Link
            href="/dashboard/new-booking"
            className="text-xs font-extrabold text-[#007eff] hover:underline whitespace-nowrap"
          >
            + New Booking
          </Link>
        </div>
      )}

      {/* Filter Tabs Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs sm:text-sm">
            {[
              { key: "ALL", label: `All (${formattedBookings.length})` },
              { key: "ACTIVE", label: "Active / En-Route" },
              { key: "SCHEDULED", label: "Scheduled" },
              { key: "COMPLETED", label: "Completed" },
              { key: "CANCELLED", label: "Cancelled" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => handleTabChange(t.key)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filter === t.key
                    ? "bg-[#007eff] text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-bold">
            Showing <strong className="text-slate-900">{filteredBookings.length === 0 ? 0 : startIndex + 1}</strong>–
            <strong className="text-slate-900">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length)}
            </strong>{" "}
            of <strong className="text-[#007eff]">{filteredBookings.length}</strong> bookings
          </div>
        </div>

        {/* Bookings List or Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="p-12 rounded-3xl border-2 border-dashed border-blue-200/80 bg-gradient-to-b from-blue-50/40 to-slate-50/60 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100/70 text-[#007eff] flex items-center justify-center mx-auto border border-blue-200 shadow-sm">
              <Layers className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                কোনো সার্ভিস বুকিং পাওয়া যায়নি (No Bookings Found)
              </h4>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                {filter === "ALL"
                  ? "আপনার কোনো সচল বা রেকর্ডকৃত সার্ভিস বুকিং নেই। নতুন একটি ক্লিন সার্ভিস বুকিং করতে নিচের বাটনে ক্লিক করুন।"
                  : `"${filter}" ফিল্টারে কোনো বুকিং খুঁজে পাওয়া যায়নি।`}
              </p>
            </div>
            <Link
              href="/dashboard/new-booking"
              className="inline-flex items-center gap-2 bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm sm:text-base px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/25 hover:scale-[1.02] cursor-pointer mt-2"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Book New Service</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedBookings.map((b) => {
              const isLiveActive = b.statusRaw === "IN_PROGRESS";
              const isCompleted = b.statusRaw === "COMPLETED";
              const isCancelled = b.statusRaw === "CANCELLED";
              const canCancel = b.statusRaw === "PENDING" || b.statusRaw === "CONFIRMED";

              return (
                <div
                  key={b.mongoId}
                  className={`rounded-2xl p-5 sm:p-6 transition-all duration-200 space-y-4 ${b.cardBg}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${
                          isLiveActive
                            ? "bg-white/20 text-white border-white/40 backdrop-blur-sm"
                            : isCompleted
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : isCancelled
                            ? "bg-rose-100 text-rose-800 border-rose-300"
                            : "text-[#007eff] bg-blue-50 border-blue-200"
                        }`}
                      >
                        {b.id}
                      </span>

                      <span
                        className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${b.badgeClass}`}
                      >
                        {isLiveActive && <Radio className="w-3 h-3 text-[#007eff] animate-pulse" />}
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        {isCancelled && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        {b.statusText}
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          isLiveActive
                            ? "text-blue-100"
                            : isCompleted
                            ? "text-emerald-800 font-semibold"
                            : isCancelled
                            ? "text-rose-700"
                            : "text-slate-500"
                        }`}
                      >
                        {b.type}
                      </span>
                    </div>

                    <span
                      className={`text-lg font-black ${
                        isLiveActive
                          ? "text-white"
                          : isCompleted
                          ? "text-emerald-900"
                          : isCancelled
                          ? "text-rose-800 line-through opacity-70"
                          : "text-slate-900"
                      }`}
                    >
                      {b.amount}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-lg sm:text-xl font-extrabold ${
                        isLiveActive
                          ? "text-white"
                          : isCompleted
                          ? "text-slate-900"
                          : "text-slate-900"
                      }`}
                    >
                      {b.title}
                    </h3>
                    <div
                      className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm mt-2 font-semibold ${
                        isLiveActive
                          ? "text-blue-100"
                          : isCompleted
                          ? "text-slate-700"
                          : "text-slate-600"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock
                          className={`w-4 h-4 ${
                            isLiveActive ? "text-white" : isCompleted ? "text-emerald-600" : "text-[#007eff]"
                          }`}
                        />
                        {b.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin
                          className={`w-4 h-4 ${
                            isLiveActive ? "text-white" : isCompleted ? "text-emerald-600" : "text-[#007eff]"
                          }`}
                        />
                        {b.address}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck
                          className={`w-4 h-4 ${
                            isLiveActive ? "text-white" : isCompleted ? "text-emerald-600" : "text-[#007eff]"
                          }`}
                        />
                        {b.cleanerTeam}
                      </span>
                    </div>
                  </div>

                  {/* Card Action CTAs */}
                  <div
                    className={`pt-3 flex flex-wrap items-center justify-between gap-3 border-t text-xs font-bold ${
                      isLiveActive
                        ? "border-white/20"
                        : isCompleted
                        ? "border-emerald-200/80"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenInvoice(b)}
                        className={`flex items-center gap-1.5 cursor-pointer font-bold ${
                          isLiveActive
                            ? "text-white hover:underline"
                            : isCompleted
                            ? "text-emerald-800 hover:text-emerald-900 underline"
                            : "text-[#007eff] hover:underline"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Invoice Receipt</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <button
                          onClick={() => setRatingBooking({ id: b.id, title: b.title })}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          <span>Rate Service ({b.rating || 5}★)</span>
                        </button>
                      )}

                      {canCancel && (
                        <button
                          onClick={() => setCancelModalBooking(b)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-slate-600">
              Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
              <strong className="text-slate-900">{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* Rate Service Modal */}
      <RateServiceModal
        bookingNumber={ratingBooking?.id || null}
        serviceTitle={ratingBooking?.title || ""}
        onClose={() => setRatingBooking(null)}
        onSubmit={() => setRatingBooking(null)}
      />

      {/* Cancel Booking Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Cancel Booking Confirmation</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Are you sure you want to cancel booking <strong className="text-slate-900">{cancelModalBooking.id}</strong>? 
                This action cannot be undone.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1 font-semibold text-slate-700">
              <div>Service: {cancelModalBooking.title}</div>
              <div>Scheduled: {cancelModalBooking.date}</div>
              <div>Amount: {cancelModalBooking.amount}</div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                disabled={isCancelling}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={isCancelling}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isCancelling ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Confirm Cancel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
