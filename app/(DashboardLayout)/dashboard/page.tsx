"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import LiveJobTracker from "@/components/dashboard/LiveJobTracker";
import InvoiceModal, { InvoiceData } from "@/components/dashboard/InvoiceModal";
import JobDetailsModal from "@/components/dashboard/JobDetailsModal";

export default function CustomerDashboardPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [selectedJobSpec, setSelectedJobSpec] = useState<{ id: string; service: string; date: string; location: string } | null>(null);

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
      serviceTitle: "Carpet & Furniture Shampoo Wash",
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
    "CLN-2026-7901": {
      id: "3",
      invoiceNumber: "INV-2026-7901",
      bookingNumber: "CLN-2026-7901",
      date: "07 Aug 2026",
      customerName: "Tanvir Hasan",
      customerAddress: "Motijheel C/A, Level 4, Dhaka",
      serviceTitle: "Weekly Office Sanitization",
      items: [
        { description: "Standard Plan Monthly Subscription (Visit #2)", qty: 1, unitPrice: 14000, total: 14000 },
      ],
      subtotal: 14000,
      vat: 0,
      discount: 0,
      totalAmount: 14000,
      paymentMethod: "bKash Online Payment",
      paymentStatus: "PAID",
      transactionId: "BKASH-8819201948",
    },
  };

  const recentBookings = [
    {
      id: "CLN-2026-8891",
      service: "Standard Home Deep Cleaning & Sanitization",
      date: "Today, 09:00 AM",
      location: "Gulshan-2, Dhaka",
      amount: "৳14,000",
      status: "EN_ROUTE",
      statusText: "En Route",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "CLN-2026-8210",
      service: "Carpet & Furniture Shampoo Wash",
      date: "14 Aug 2026",
      location: "Gulshan-2, Dhaka",
      amount: "৳3,500",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "CLN-2026-7901",
      service: "Weekly Office Sanitization",
      date: "07 Aug 2026",
      location: "Motijheel, Dhaka",
      amount: "৳14,000",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d274c] to-slate-900 border border-slate-800 p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#007eff]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs sm:text-sm font-bold mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Customer VIP Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Welcome back, Tanvir Hasan! 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl font-medium">
              Your next scheduled weekly visit is active today in <strong className="text-white">Gulshan-2</strong>. Cleaner Team Delta is en route.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/new-booking"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Book New Service</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards (Grid 4 Interactive Links with Cursor Pointer) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1 ➔ Bookings */}
        <Link
          href="/dashboard/bookings"
          className="bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-all group cursor-pointer"
        >
          <div>
            <p className="text-sm font-bold text-[#007eff] uppercase tracking-wider">
              Total Bookings
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">12 Jobs</h3>
            <span className="text-xs text-emerald-600 font-bold mt-1 block">100% On-time completion ➔</span>
          </div>
          <div className="w-13 h-13 p-3 rounded-2xl bg-blue-50 border border-blue-100 text-[#007eff] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
        </Link>

        {/* Stat 2 ➔ Subscription */}
        <Link
          href="/dashboard/subscription"
          className="bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-all group cursor-pointer"
        >
          <div>
            <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">
              Active Plan
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">Standard</h3>
            <span className="text-xs text-blue-600 font-bold mt-1 block">৳14,000 / Month ➔</span>
          </div>
          <div className="w-13 h-13 p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <CreditCard className="w-7 h-7" />
          </div>
        </Link>

        {/* Stat 3 ➔ Subscription */}
        <Link
          href="/dashboard/subscription"
          className="bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-all group cursor-pointer"
        >
          <div>
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
              Visits Left
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">1 / 4 Visits</h3>
            <span className="text-xs text-amber-700 font-bold mt-1 block">Renews in 5 days ➔</span>
          </div>
          <div className="w-13 h-13 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Clock className="w-7 h-7" />
          </div>
        </Link>

        {/* Stat 4 ➔ Bookings */}
        <Link
          href="/dashboard/bookings"
          className="bg-white hover:bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-all group cursor-pointer"
        >
          <div>
            <p className="text-sm font-bold text-purple-600 uppercase tracking-wider">
              Clean Area
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">4,800 SqFt</h3>
            <span className="text-xs text-slate-600 font-bold mt-1 block">Eco-chem Certified ➔</span>
          </div>
          <div className="w-13 h-13 p-3 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </Link>
      </div>

      {/* Live Job Tracking Component */}
      <LiveJobTracker
        bookingNumber="CLN-2026-8891"
        serviceName="Standard Home Deep Cleaning & Anti-Bacterial Sanitization"
        address="House 42, Road 11, Block D, Gulshan-2, Dhaka"
      />

      {/* Grid: Subscription & Quick Addons (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Subscription Details (Col 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">My Active Subscription</h3>
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">Standard Monthly Plan • 4 Weekly Deep Cleans</p>
            </div>
            <span className="text-xl font-bold text-[#007eff]">৳14,000 <span className="text-xs text-slate-400 font-normal">/mo</span></span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-700">Monthly Usage: 3 of 4 visits used</span>
                <span className="text-[#007eff] font-bold">75% Complete</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div className="bg-gradient-to-r from-[#007eff] to-cyan-400 h-full rounded-full w-[75%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-xs font-semibold">Next Scheduled Clean:</span>
                <strong className="text-slate-900 font-bold">Today at 09:00 AM</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-xs font-semibold">Billing Renewal:</span>
                <strong className="text-slate-900 font-bold">26 August 2026</strong>
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

        {/* Recommend Add-ons (Col 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Popular Add-On Upgrades
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              Add these extra services to your upcoming clean at special subscriber discounts:
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard/new-booking"
              className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors text-xs sm:text-sm group cursor-pointer"
            >
              <div>
                <p className="font-bold text-slate-900 group-hover:text-[#007eff] transition-colors">Sofa & Carpet Steam Wash</p>
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
                <p className="font-bold text-slate-900 group-hover:text-[#007eff] transition-colors">Kitchen Oven & Chimney Care</p>
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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Recent Service History</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">Click any row or ID to inspect job specs, or view invoices.</p>
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
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-4 font-mono font-bold text-[#007eff]">
                    <button
                      onClick={() => setSelectedJobSpec(b)}
                      className="hover:underline font-bold text-[#007eff] cursor-pointer"
                    >
                      {b.id}
                    </button>
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    <button
                      onClick={() => setSelectedJobSpec(b)}
                      className="hover:text-[#007eff] text-left cursor-pointer"
                    >
                      {b.service}
                    </button>
                  </td>
                  <td className="p-4 text-slate-600 font-semibold">{b.date}</td>
                  <td className="p-4 text-slate-600 font-semibold">{b.location}</td>
                  <td className="p-4 font-bold text-slate-900">{b.amount}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${b.badgeClass}`}>
                      {b.statusText}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-4 space-x-2">
                    <button
                      onClick={() => {
                        const inv = mockInvoices[b.id] || mockInvoices["CLN-2026-8891"];
                        setSelectedInvoice(inv);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007eff] hover:underline bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
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
        bookingNumber={selectedJobSpec?.id}
        serviceTitle={selectedJobSpec?.service}
        date={selectedJobSpec?.date}
        address={selectedJobSpec?.location}
      />
    </div>
  );
}
