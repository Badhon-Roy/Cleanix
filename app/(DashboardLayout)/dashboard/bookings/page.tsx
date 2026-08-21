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
  Sparkles,
  Radio,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import LiveJobTracker from "@/components/dashboard/LiveJobTracker";
import InvoiceModal, { InvoiceData } from "@/components/dashboard/InvoiceModal";
import RateServiceModal from "@/components/dashboard/RateServiceModal";

export default function CustomerBookingsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [ratingBooking, setRatingBooking] = useState<{ id: string; title: string } | null>(null);

  const ITEMS_PER_PAGE = 8;

  const mockInvoices: Record<string, InvoiceData> = {
    "CLN-2026-8891": {
      id: "1",
      invoiceNumber: "INV-2026-8891",
      bookingNumber: "CLN-2026-8891",
      date: "21 Aug 2026",
      customerName: "Tanvir Hasan",
      customerAddress: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      serviceTitle: "Standard Home Deep Cleaning & Sanitization",
      items: [
        { description: "Standard Plan Monthly Subscription (Visit #3)", qty: 1, unitPrice: 14000, total: 14000 },
        { description: "Hospital-Grade Anti-Bacterial Spray", qty: 1, unitPrice: 0, total: 0 },
      ],
      subtotal: 14000,
      vat: 0,
      discount: 0,
      totalAmount: 14000,
      paymentMethod: "bKash Online Payment",
      paymentStatus: "PAID",
      transactionId: "BKASH-9018274619",
    },
    "CLN-2026-8210": {
      id: "2",
      invoiceNumber: "INV-2026-8210",
      bookingNumber: "CLN-2026-8210",
      date: "14 Aug 2026",
      customerName: "Tanvir Hasan",
      customerAddress: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      serviceTitle: "Carpet & Sofa Steam Shampoo Wash",
      items: [
        { description: "3-Seater Sofa Deep Shampoo & Extraction", qty: 1, unitPrice: 2000, total: 2000 },
        { description: "Living Room Carpet Deep Clean", qty: 1, unitPrice: 1500, total: 1500 },
      ],
      subtotal: 3500,
      vat: 0,
      discount: 0,
      totalAmount: 3500,
      paymentMethod: "Stripe Credit Card (**** 4242)",
      paymentStatus: "PAID",
      transactionId: "STRIPE-ch_3N9x1827419",
    },
  };

  const bookingsList = [
    {
      id: "CLN-2026-8891",
      title: "Standard Home Deep Cleaning & Sanitization",
      type: "Standard Monthly Plan (Visit 3 of 4)",
      date: "Today, 21 Aug 2026 • 09:00 AM Slot",
      address: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      amount: "৳14,000",
      status: "EN_ROUTE",
      statusText: "En Route (ETA 10 mins)",
      badgeClass: "bg-white text-[#007eff] border-white font-black",
      cleanerTeam: "Team Delta (Rahat Karim)",
    },
    {
      id: "CLN-2026-8500",
      title: "Upcoming Scheduled Deep Clean",
      type: "Standard Monthly Plan (Visit 4 of 4)",
      date: "28 Aug 2026 • 09:00 AM Slot",
      address: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      amount: "৳14,000",
      status: "SCHEDULED",
      statusText: "Scheduled",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      cleanerTeam: "Team Delta (Assigned)",
    },
    {
      id: "CLN-2026-8210",
      title: "Carpet & Sofa Steam Shampoo Wash",
      type: "One-Time Custom Service",
      date: "14 Aug 2026 • 02:00 PM Slot",
      address: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      amount: "৳3,500",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Alpha (Mahmud Hasan)",
      rating: 5,
    },
    {
      id: "CLN-2026-7901",
      title: "Weekly Office Sanitization",
      type: "Standard Monthly Plan (Visit 2 of 4)",
      date: "07 Aug 2026 • 10:00 AM Slot",
      address: "Motijheel C/A, Level 4, Dhaka",
      amount: "৳14,000",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Bravo (Tanvir Ahmed)",
      rating: 5,
    },
    {
      id: "CLN-2026-7540",
      title: "Full Apartment Move-in Deep Cleaning",
      type: "Custom One-Time Service",
      date: "31 Jul 2026 • 09:30 AM Slot",
      address: "Banani Road 11, Apartment 5B, Dhaka",
      amount: "৳18,500",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Charlie (Imran Hossain)",
      rating: 5,
    },
    {
      id: "CLN-2026-7200",
      title: "Commercial Kitchen Heavy Degreasing",
      type: "Commercial Service Package",
      date: "24 Jul 2026 • 08:00 PM Slot",
      address: "Dhanmondi 27, Food Court Level 3, Dhaka",
      amount: "৳22,000",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Echo (Kamal Uddin)",
      rating: 5,
    },
    {
      id: "CLN-2026-6890",
      title: "Exterior Glass Window & Facade Clean",
      type: "Specialized Rope Access Clean",
      date: "17 Jul 2026 • 07:00 AM Slot",
      address: "Uttara Sector 4, Commercial Building, Dhaka",
      amount: "৳12,500",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Sky (Nayan Chowdhury)",
      rating: 4,
    },
    {
      id: "CLN-2026-6510",
      title: "Overhead Water Tank Disinfection",
      type: "Hygiene & Water Tank Service",
      date: "10 Jul 2026 • 11:00 AM Slot",
      address: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      amount: "৳5,000",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Aqua (Saiful Islam)",
      rating: 5,
    },
    {
      id: "CLN-2026-6200",
      title: "Post-Construction Scrubbing & Stain Clean",
      type: "Post-Renovation Heavy Scrubbing",
      date: "03 Jul 2026 • 09:00 AM Slot",
      address: "Bashundhara R/A, Block C, Villa 12, Dhaka",
      amount: "৳25,000",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Delta (Rahat Karim)",
      rating: 5,
    },
    {
      id: "CLN-2026-5900",
      title: "Villa Deep Cleaning & Eco-Pest Control",
      type: "Comprehensive Home Care Package",
      date: "26 Jun 2026 • 10:00 AM Slot",
      address: "Baridhara DOHS, Road 4, House 19, Dhaka",
      amount: "৳32,000",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Shield (Arifur Rahman)",
      rating: 5,
    },
    {
      id: "CLN-2026-5540",
      title: "Mattress & Heavy Curtain Steam Sanitize",
      type: "Furniture Anti-Allergen Care",
      date: "19 Jun 2026 • 03:00 PM Slot",
      address: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      amount: "৳4,800",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Alpha (Mahmud Hasan)",
      rating: 5,
    },
    {
      id: "CLN-2026-5120",
      title: "Restaurant Dining Hall Deep Steam Clean",
      type: "Commercial Hospitality Package",
      date: "12 Jun 2026 • 06:00 AM Slot",
      address: "Gulshan 1, Avenue Road 3, Dhaka",
      amount: "৳16,000",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Echo (Kamal Uddin)",
      rating: 4,
    },
    {
      id: "CLN-2026-4800",
      title: "Duplex Home Annual Deep Refresh",
      type: "Annual Home Maintenance Package",
      date: "05 Jun 2026 • 09:00 AM Slot",
      address: "Nikunja 2, Road 7, House 88, Dhaka",
      amount: "৳28,000",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Charlie (Imran Hossain)",
      rating: 5,
    },
    {
      id: "CLN-2026-4410",
      title: "Emergency Water Leakage Stain Clean",
      type: "Urgent Cleaning Dispatch",
      date: "28 May 2026 • 01:00 PM Slot",
      address: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      amount: "৳6,500",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Delta (Rahat Karim)",
      rating: 5,
    },
    {
      id: "CLN-2026-4100",
      title: "Express Balcony & Open Terrace Clean",
      type: "Outdoor Cleaning Add-on",
      date: "21 May 2026 • 11:30 AM Slot",
      address: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      amount: "৳2,500",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
      cleanerTeam: "Team Bravo (Tanvir Ahmed)",
      rating: 5,
    },
  ];

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
          className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Book New Service</span>
        </Link>
      </div>

      {/* Live Job Tracker Container */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#007eff] flex items-center gap-2">
          <Truck className="w-4 h-4" /> Active Job Real-Time Tracker
        </h2>
        <LiveJobTracker
          bookingNumber="CLN-2026-8891"
          serviceName="Standard Home Deep Cleaning & Sanitization"
          address="House 42, Road 11, Block D, Gulshan-2, Dhaka"
        />
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto text-xs">
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
            Showing <strong className="text-slate-900">{startIndex + 1}</strong>–
            <strong className="text-slate-900">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length)}
            </strong>{" "}
            of <strong className="text-[#007eff]">{filteredBookings.length}</strong> bookings
          </div>
        </div>

        {/* Bookings Card List */}
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
                          isLiveActive
                            ? "text-amber-300"
                            : isCompleted
                            ? "text-emerald-600"
                            : "text-[#007eff]"
                        }`}
                      />
                      {b.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin
                        className={`w-4 h-4 ${
                          isLiveActive
                            ? "text-cyan-200"
                            : isCompleted
                            ? "text-emerald-600"
                            : "text-[#007eff]"
                        }`}
                      />
                      {b.address}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {b.cleanerTeam}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  className={`pt-3 flex flex-wrap items-center justify-between gap-3 ${
                    isLiveActive
                      ? "border-t border-white/20"
                      : isCompleted
                      ? "border-t border-emerald-200"
                      : "border-t border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {b.status === "COMPLETED" && (
                      <button
                        onClick={() => setRatingBooking({ id: b.id, title: b.title })}
                        className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3.5 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{b.rating ? `Rated ★ ${b.rating}.0` : "Rate Cleaning Session"}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const inv = mockInvoices[b.id] || mockInvoices["CLN-2026-8891"];
                        setSelectedInvoice(inv);
                      }}
                      className={`text-xs font-extrabold px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isLiveActive
                          ? "bg-white text-[#007eff] hover:bg-blue-50 border-white"
                          : isCompleted
                          ? "bg-white text-emerald-800 hover:bg-emerald-50 border-emerald-300"
                          : "text-[#007eff] bg-blue-50 hover:bg-blue-100 border-blue-200"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>View PDF Invoice</span>
                    </button>
                  </div>

                  {isLiveActive && (
                    <span className="text-xs font-extrabold text-white bg-white/20 px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5 backdrop-blur-sm animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Live GPS Tracking Active ➔</span>
                    </span>
                  )}

                  {isCompleted && (
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/90 px-3 py-1.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Completed ✓</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ULTRA-MODERN PROFESSIONAL PAGINATION BAR */}
        {totalPages > 1 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {/* Left Page & Results Summary */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#007eff] flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span className="bg-blue-100 text-[#007eff] px-2.5 py-0.5 rounded-full text-[11px] font-black border border-blue-200">
                    {filteredBookings.length} Total Jobs
                  </span>
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Displaying {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length)} items per view
                </p>
              </div>
            </div>

            {/* Right Controls: Previous / Numbers / Next */}
            <div className="flex items-center gap-2">
              {/* Previous Page Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  currentPage === 1
                    ? "bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed"
                    : "bg-white text-slate-700 hover:bg-[#007eff] hover:text-white border-slate-200 hover:border-[#007eff]"
                }`}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                <span>Prev</span>
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = currentPage === pageNum;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#007eff] text-white"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Page Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  currentPage === totalPages
                    ? "bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed"
                    : "bg-white text-slate-700 hover:bg-[#007eff] hover:text-white border-slate-200 hover:border-[#007eff]"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* Rating Modal */}
      <RateServiceModal
        bookingNumber={ratingBooking?.id || null}
        serviceTitle={ratingBooking?.title || ""}
        onClose={() => setRatingBooking(null)}
        onSubmit={(rating, review) => {
          alert(`Rating ${rating} stars submitted for ${ratingBooking?.id}!`);
        }}
      />
    </div>
  );
}
