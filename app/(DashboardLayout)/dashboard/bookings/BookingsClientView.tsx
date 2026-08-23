"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import LiveJobTracker from "@/components/dashboard/LiveJobTracker";
import InvoiceModal, { InvoiceData } from "@/components/dashboard/InvoiceModal";
import RateServiceModal from "@/components/dashboard/RateServiceModal";

export default function BookingsClientView({
  initialBookings = [],
}: {
  initialBookings?: any[];
}) {
  const [filter, setFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [ratingBooking, setRatingBooking] = useState<{ id: string; title: string } | null>(null);

  const ITEMS_PER_PAGE = 8;

  // Format real DB bookings from MongoDB
  const dbBookings = initialBookings.map((b: any) => {
    const serviceName =
      b.serviceType === "RESIDENTIAL"
        ? "Residential Home Deep Cleaning"
        : b.serviceType === "COMMERCIAL"
        ? "Commercial Office Cleaning"
        : b.serviceType === "MOVE_IN_OUT"
        ? "Move-In / Move-Out Deep Clean"
        : "Post Construction Cleaning";

    const isEnRoute = b.status === "IN_PROGRESS" || b.status === "EN_ROUTE";
    const isCompleted = b.status === "COMPLETED";

    return {
      raw: b,
      id: b.bookingRef || String(b._id),
      title: `${serviceName} (${b.sqft || 1200} SqFt)`,
      type: `${b.bedrooms || 3} Bed, ${b.bathrooms || 2} Bath ${
        b.selectedAddons?.length ? `• ${b.selectedAddons.length} Addons` : ""
      }`,
      date: `${b.scheduledDate || "Scheduled"} • ${b.timeSlot || "09:00 AM Slot"}`,
      address: b.address || "Dhaka",
      amount: `৳${(b.totalAmount || 0).toLocaleString()}`,
      status: isEnRoute ? "EN_ROUTE" : isCompleted ? "COMPLETED" : "SCHEDULED",
      statusText: isEnRoute
        ? "En Route (ETA 10 mins)"
        : isCompleted
        ? "Completed"
        : "Scheduled",
      badgeClass: isEnRoute
        ? "bg-white text-[#007eff] border-white font-black"
        : isCompleted
        ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold"
        : "bg-amber-50 text-amber-700 border-amber-200",
      cleanerTeam: "Cleanix Field Team (Assigned)",
      rating: 5,
    };
  });

  // Use real DB bookings list
  const bookingsList = dbBookings;

  // Active Job Tracker Target
  const activeJob = bookingsList.find(
    (b) => b.status === "EN_ROUTE" || b.status === "IN_PROGRESS"
  );

  // Dynamic Invoice Builder
  const handleOpenInvoice = (booking: any) => {
    const raw = booking.raw || {};
    const itemsList = [
      {
        description: `Base Service & Space Fee (${raw.sqft || 1200} SqFt, ${raw.bedrooms || 3} Bed, ${raw.bathrooms || 2} Bath)`,
        qty: 1,
        unitPrice:
          (raw.baseFee || 1500) +
          (raw.sqftCost || 3000) +
          (raw.bedroomCost || 1500) +
          (raw.bathroomCost || 800),
        total:
          (raw.baseFee || 1500) +
          (raw.sqftCost || 3000) +
          (raw.bedroomCost || 1500) +
          (raw.bathroomCost || 800),
      },
    ];

    if (raw.selectedAddons && Array.isArray(raw.selectedAddons)) {
      const addonPricesMap: Record<string, number> = {
        sofa: 2000,
        oven: 1200,
        fridge: 1000,
        window: 800,
        pet: 1500,
      };
      raw.selectedAddons.forEach((addon: string) => {
        itemsList.push({
          description: `Addon: ${addon.toUpperCase()} Care Service`,
          qty: 1,
          unitPrice: addonPricesMap[addon] || 1000,
          total: addonPricesMap[addon] || 1000,
        });
      });
    }

    const generatedInvoice: InvoiceData = {
      id: String(raw._id || booking.id),
      invoiceNumber: `INV-2026-${booking.id.replace(/[^0-9]/g, "") || "9042"}`,
      bookingNumber: booking.id,
      date: raw.scheduledDate || "25 Aug 2026",
      customerName: "Cleanix Customer",
      customerAddress: booking.address,
      serviceTitle: booking.title,
      items: itemsList,
      subtotal: raw.totalAmount || 15000,
      vat: 0,
      discount: 0,
      totalAmount: raw.totalAmount || 15000,
      paymentMethod: raw.paymentMethod ? `${raw.paymentMethod} Payment` : "bKash Online Payment",
      paymentStatus: raw.paymentStatus || "PAID",
      transactionId: `TXN-${booking.id.replace(/[^0-9]/g, "") || "9018274619"}`,
    };

    setSelectedInvoice(generatedInvoice);
  };

  // Filter items based on active tab
  const filteredBookings = bookingsList.filter((b) => {
    if (filter === "ACTIVE") return b.status === "EN_ROUTE" || b.status === "IN_PROGRESS";
    if (filter === "SCHEDULED") return b.status === "SCHEDULED";
    if (filter === "COMPLETED") return b.status === "COMPLETED";
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

        <Link
          href="/dashboard/new-booking"
          className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Book New Service</span>
        </Link>
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
              <h4 className="font-extrabold text-slate-900 text-sm">No Active Field Cleaning Currently In Progress</h4>
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
              { key: "ALL", label: "All Bookings" },
              { key: "ACTIVE", label: "Active / En-Route" },
              { key: "SCHEDULED", label: "Scheduled" },
              { key: "COMPLETED", label: "Completed" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => handleTabChange(t.key)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filter === t.key
                    ? "bg-[#007eff] text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
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
                আপনার কোনো সচল বা রেকর্ডকৃত সার্ভিস বুকিং নেই। নতুন একটি ক্লিন সার্ভিস বুকিং করতে নিচের বাটনে ক্লিক করুন।
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
              const isLiveActive = b.status === "EN_ROUTE" || b.status === "IN_PROGRESS";
              const isCompleted = b.status === "COMPLETED";

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl p-5 sm:p-6 transition-all duration-200 space-y-4 ${
                    isLiveActive
                      ? "bg-gradient-to-r from-[#007eff] via-blue-600 to-blue-700 text-white border-2 border-[#007eff] ring-2 ring-blue-200"
                      : isCompleted
                      ? "bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-100/80 border border-emerald-300 text-slate-900"
                      : "bg-slate-50 hover:bg-white border border-slate-200 text-slate-900"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${
                          isLiveActive
                            ? "bg-white/20 text-white border-white/40 backdrop-blur-sm"
                            : isCompleted
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "text-[#007eff] bg-blue-50 border-blue-200"
                        }`}
                      >
                        #{b.id}
                      </span>

                      <span
                        className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                          isLiveActive
                            ? "bg-white text-[#007eff] border-white"
                            : isCompleted
                            ? "bg-emerald-600 text-white border-emerald-700 font-black"
                            : b.badgeClass
                        }`}
                      >
                        {isLiveActive && <Radio className="w-3 h-3 text-[#007eff] animate-pulse" />}
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        {b.statusText}
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          isLiveActive
                            ? "text-blue-100"
                            : isCompleted
                            ? "text-emerald-800 font-semibold"
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
                          <span>Rate Team ({b.rating || 5}★)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
    </div>
  );
}
