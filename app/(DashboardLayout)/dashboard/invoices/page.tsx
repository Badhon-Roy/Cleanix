"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Search,
  ExternalLink,
  Printer,
  Sparkles,
} from "lucide-react";
import InvoiceModal, { InvoiceData } from "@/components/dashboard/InvoiceModal";

export default function CustomerInvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const invoicesList: InvoiceData[] = [
    {
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
    {
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
    {
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
    {
      id: "4",
      invoiceNumber: "INV-2026-7100",
      bookingNumber: "CLN-2026-7100",
      date: "28 Jul 2026",
      customerName: "Tanvir Hasan",
      customerAddress: "House 42, Road 11, Block D, Gulshan-2, Dhaka",
      serviceTitle: "Post-Renovation Kitchen Deep Care",
      items: [
        { description: "Kitchen Chimney & Oven Steam Wash", qty: 1, unitPrice: 4500, total: 4500 },
      ],
      subtotal: 4500,
      vat: 0,
      discount: 0,
      totalAmount: 4500,
      paymentMethod: "SSLCommerz Gateway",
      paymentStatus: "PAID",
      transactionId: "SSL-8810294819",
    },
  ];

  const filteredInvoices = invoicesList.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 stroke-[2.5]" />
              </div>
              Invoices & Payment Receipts
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ AUTOMATED BILLING
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Download automated PDF invoices, view payment transaction receipts, and track tax documentation.
          </p>
        </div>
      </div>

      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between transition-all hover:border-slate-300">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Total Receipts
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">12 Paid Invoices</h3>
            <span className="text-xs text-emerald-600 font-bold mt-1 block">100% Tax Compliant ✓</span>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between transition-all hover:border-slate-300">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Total Spent
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">৳142,500</h3>
            <span className="text-xs text-blue-600 font-bold mt-1 block">Verified Transactions ➔</span>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between transition-all hover:border-slate-300">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Latest Invoice
            </p>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-[#007eff] mt-1">INV-2026-8891</h3>
            <span className="text-xs text-slate-500 font-bold mt-1 block">Issued on 21 Aug 2026</span>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Main Billing Table Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">All Billing Statements</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              ইনভয়েস বা পেমেন্ট দেখার জন্য যেকোনো সারিতে বা PDF ডাউনলোডে ক্লিক করুন।
            </p>
          </div>

          {/* Search Box Filter */}
          <div className="relative self-start sm:self-auto w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Invoice # or Service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#007eff] focus:bg-white"
            />
          </div>
        </div>

        {/* Larger & Readable Billing Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 uppercase tracking-wider text-xs sm:text-sm font-extrabold">
                <th className="p-4 sm:p-5 pl-5">Invoice ID</th>
                <th className="p-4 sm:p-5">Booking Ref</th>
                <th className="p-4 sm:p-5">Date</th>
                <th className="p-4 sm:p-5">Service Package</th>
                <th className="p-4 sm:p-5">Payment Method</th>
                <th className="p-4 sm:p-5">Amount Paid</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5 text-right pr-5">PDF Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-bold text-sm">
                    কোনো ইনভয়েস পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/50 transition-colors">
                    {/* Invoice ID */}
                    <td className="p-4 sm:p-5 pl-5 font-mono font-bold text-slate-900 text-sm sm:text-base">
                      {inv.invoiceNumber}
                    </td>

                    {/* Booking Ref */}
                    <td className="p-4 sm:p-5 font-mono font-bold text-[#007eff] text-sm sm:text-base">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="hover:underline text-[#007eff] cursor-pointer"
                      >
                        #{inv.bookingNumber}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="p-4 sm:p-5 text-slate-600 font-bold text-sm whitespace-nowrap">
                      {inv.date}
                    </td>

                    {/* Service Package */}
                    <td className="p-4 sm:p-5 font-bold text-slate-900 text-sm sm:text-base min-w-[220px]">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="hover:text-[#007eff] text-left cursor-pointer"
                      >
                        {inv.serviceTitle}
                      </button>
                    </td>

                    {/* Payment Method */}
                    <td className="p-4 sm:p-5 text-slate-700 font-bold text-xs sm:text-sm whitespace-nowrap">
                      {inv.paymentMethod}
                    </td>

                    {/* Amount Paid */}
                    <td className="p-4 sm:p-5 font-bold text-slate-900 text-base whitespace-nowrap">
                      ৳{inv.totalAmount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="p-4 sm:p-5 whitespace-nowrap">
                      <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                        ✓ {inv.paymentStatus}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="p-4 sm:p-5 text-right pr-5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-white bg-[#007eff] hover:bg-[#0066ee] px-4 py-2 rounded-2xl transition-all cursor-pointer shadow-sm border border-blue-400"
                      >
                        <Download className="w-4 h-4" />
                        <span>View PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
