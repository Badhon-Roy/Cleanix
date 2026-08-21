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
} from "lucide-react";
import LiveJobTracker from "@/components/dashboard/LiveJobTracker";
import InvoiceModal, { InvoiceData } from "@/components/dashboard/InvoiceModal";
import RateServiceModal from "@/components/dashboard/RateServiceModal";

export default function CustomerBookingsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [ratingBooking, setRatingBooking] = useState<{ id: string; title: string } | null>(null);

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
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200 animate-pulse",
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
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cleanerTeam: "Team Bravo (Tanvir Ahmed)",
      rating: 5,
    },
  ];

  const filteredBookings = bookingsList.filter((b) => {
    if (filter === "ACTIVE") return b.status === "EN_ROUTE" || b.status === "IN_PROGRESS";
    if (filter === "SCHEDULED") return b.status === "SCHEDULED";
    if (filter === "COMPLETED") return b.status === "COMPLETED";
    return true;
  });

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
          className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 self-start sm:self-auto transition-all"
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
                onClick={() => setFilter(t.key)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
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
            Showing <strong className="text-slate-900">{filteredBookings.length}</strong> bookings
          </div>
        </div>

        {/* Bookings Card List */}
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-200 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#007eff] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    #{b.id}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${b.badgeClass}`}>
                    {b.statusText}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{b.type}</span>
                </div>

                <span className="text-lg font-extrabold text-slate-900">{b.amount}</span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">{b.title}</h3>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 mt-2 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#007eff]" />
                    {b.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#007eff]" />
                    {b.address}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {b.cleanerTeam}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {b.status === "COMPLETED" && (
                    <button
                      onClick={() => setRatingBooking({ id: b.id, title: b.title })}
                      className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors"
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
                    className="text-xs font-bold text-[#007eff] bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#007eff]" />
                    <span>View PDF Invoice</span>
                  </button>
                </div>

                {b.status === "EN_ROUTE" && (
                  <span className="text-xs font-bold text-[#007eff] animate-pulse">
                    Live GPS Location Active ➔
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
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
