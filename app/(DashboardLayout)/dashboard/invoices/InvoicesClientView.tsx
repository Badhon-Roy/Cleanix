"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Search,
  RefreshCw,
  Eye,
} from "lucide-react";
import InvoiceModal, { InvoiceData } from "@/components/dashboard/InvoiceModal";
import { fetchMyBookingsAPI, downloadBookingPDFAPI } from "@/services/bookingService";
import { fetchMySubscriptionsAPI, downloadSubscriptionPDFAPI } from "@/services/subscriptionService";

export default function InvoicesClientView({
  initialBookings = [],
  initialSubscriptions = [],
}: {
  initialBookings?: any[];
  initialSubscriptions?: any[];
}) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [subscriptions, setSubscriptions] = useState<any[]>(initialSubscriptions);

  // Client-side auto-fetch on mount for freshest data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, subsRes] = await Promise.all([
        fetchMyBookingsAPI(),
        fetchMySubscriptionsAPI(),
      ]);

      if (bookingsRes?.success && Array.isArray(bookingsRes?.data)) {
        setBookings(bookingsRes.data);
      }
      if (subsRes?.success && Array.isArray(subsRes?.data)) {
        setSubscriptions(subsRes.data);
      }
    } catch (err) {
      console.error("Error loading invoices data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Combine bookings & subscriptions into dynamic unified InvoiceData list
  const formattedInvoices: InvoiceData[] = [
    // Subscription Invoices
    ...subscriptions.map((sub: any) => {
      const planTitle = sub.planTitle || sub.planId || "STANDARD";
      const total = sub.totalAmount || 0;
      const ref = sub.subscriptionRef || `#SUB-${String(sub._id).slice(-6).toUpperCase()}`;
      const invNum = `INV-${ref.replace(/#/g, "")}`;
      const dateStr = sub.createdAt
        ? new Date(sub.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Recent";

      const items = [
        {
          description: `Monthly Subscription Plan: ${planTitle} (${sub.totalVisitsPerMonth || 4} Visits/Month)`,
          qty: 1,
          unitPrice: sub.subtotal || total,
          total: sub.subtotal || total,
        },
      ];

      if (Array.isArray(sub.selectedAddons) && sub.selectedAddons.length > 0) {
        sub.selectedAddons.forEach((addon: string) => {
          items.push({
            description: `Addon Care Extra: ${addon.toUpperCase()}`,
            qty: 1,
            unitPrice: 0,
            total: 0,
          });
        });
      }

      return {
        id: String(sub._id),
        invoiceNumber: invNum,
        bookingNumber: ref,
        date: dateStr,
        customerName: sub.user?.name || "Subscriber",
        customerAddress: sub.streetAddress || sub.zoneName || "Dhaka, Bangladesh",
        serviceTitle: `Monthly Subscription Plan: ${planTitle}`,
        items,
        subtotal: sub.subtotal || total,
        vat: 0,
        discount: sub.discount || 0,
        totalAmount: total,
        paymentMethod: `${sub.paymentMethod} Payment`,
        paymentStatus: (sub.status || sub.paymentStatus || "ACTIVE") as any,
        transactionId: sub.trxId || `TXN-SUB-${String(sub._id).slice(-6).toUpperCase()}`,
        rawCreatedAt: sub.createdAt ? new Date(sub.createdAt).getTime() : 0,
      };
    }),

    // One-Time Booking Invoices
    ...bookings.map((b: any) => {
      const serviceObj = b.serviceType;
      const serviceTitle =
        typeof serviceObj === "object"
          ? serviceObj?.title || serviceObj?.name || "Cleaning Service"
          : "Cleaning Service";
      const total = b.totalAmount || 0;
      const ref = b.bookingRef || `#CLN-${String(b._id).slice(-6).toUpperCase()}`;
      const invNum = `INV-${ref.replace(/#/g, "")}`;
      const dateStr = b.createdAt
        ? new Date(b.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Recent";

      const items =
        Array.isArray(b.services) && b.services.length > 0
          ? b.services.map((s: any) => ({
              description: s.name,
              qty: 1,
              unitPrice: s.value || 0,
              total: s.value || 0,
            }))
          : [
              {
                description: `${serviceTitle} (${b.scheduledDate || ""})`,
                qty: 1,
                unitPrice: total,
                total,
              },
            ];

      return {
        id: String(b._id),
        invoiceNumber: invNum,
        bookingNumber: ref,
        date: dateStr,
        customerName: b.user?.name || "Customer",
        customerAddress: b.address || "Dhaka, Bangladesh",
        serviceTitle,
        items,
        subtotal: total,
        vat: 0,
        discount: 0,
        totalAmount: total,
        paymentMethod: `${b.paymentMethod || "BKASH"} Payment`,
        paymentStatus: (b.paymentStatus || "PAID") as any,
        transactionId: `TXN-CLN-${String(b._id).slice(-8).toUpperCase()}`,
        rawCreatedAt: b.createdAt ? new Date(b.createdAt).getTime() : 0,
      };
    }),
  ].sort((a: any, b: any) => b.rawCreatedAt - a.rawCreatedAt);

  // Filter invoices by search query
  const filteredInvoices = formattedInvoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute KPI Statistics
  const totalReceiptsCount = formattedInvoices.length;
  const totalSpentAmount = formattedInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const latestInvoice = formattedInvoices[0];

  const handleDirectPDFDownload = (inv: InvoiceData) => {
    if (!inv.id) return;
    const cleanRef = (inv.invoiceNumber || inv.bookingNumber || "INVOICE").replace(/#/g, "");
    const filename = `Cleanix-Invoice-${cleanRef}.pdf`;

    if (inv.bookingNumber.startsWith("#SUB") || inv.invoiceNumber.includes("SUB")) {
      downloadSubscriptionPDFAPI(inv.id, filename);
    } else {
      downloadBookingPDFAPI(inv.id, filename);
    }
  };

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
              ⚡ AUTOMATED BILLING SYSTEM
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Download official PDF invoices, view payment receipts, and track your billing statements.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#007eff]" : ""}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between transition-all hover:border-slate-300 shadow-xs">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Total Receipts
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {totalReceiptsCount} Paid Invoices
            </h3>
            <span className="text-xs text-emerald-600 font-bold mt-1 block">
              100% Tax Compliant Receipt ✓
            </span>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between transition-all hover:border-slate-300 shadow-xs">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Total Amount Billed
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              ৳{totalSpentAmount.toLocaleString()} BDT
            </h3>
            <span className="text-xs text-blue-600 font-bold mt-1 block">
              Verified Electronic Records ➔
            </span>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between transition-all hover:border-slate-300 shadow-xs">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Latest Issued Statement
            </p>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-[#007eff] mt-1">
              {latestInvoice ? latestInvoice.bookingNumber : "No Invoices"}
            </h3>
            <span className="text-xs text-slate-500 font-bold mt-1 block">
              {latestInvoice ? `Issued on ${latestInvoice.date}` : "Cleanix Billing"}
            </span>
          </div>
          <div className="w-13 h-13 p-3.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Main Billing Table Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              All System Billing Statements ({filteredInvoices.length})
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              ইনভয়েস বা পেমেন্ট রিসিপ্ট দেখার জন্য যেকোনো সারিতে বা PDF ডাউনলোডে ক্লিক করুন।
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
                <th className="p-4 sm:p-5">Order Ref</th>
                <th className="p-4 sm:p-5">Date Issued</th>
                <th className="p-4 sm:p-5">Service Package</th>
                <th className="p-4 sm:p-5">Payment Channel</th>
                <th className="p-4 sm:p-5">Amount Billed</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5 text-right pr-5">PDF Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-bold text-sm">
                    কোনো ইনভয়েস পাওয়া যায়নি (No invoices recorded).
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/50 transition-colors">
                    {/* Invoice ID */}
                    <td className="p-4 sm:p-5 pl-5 font-mono font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>

                    {/* Booking Ref */}
                    <td className="p-4 sm:p-5 font-mono font-bold text-[#007eff] text-xs sm:text-sm whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="hover:underline text-[#007eff] cursor-pointer flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>{inv.bookingNumber}</span>
                        <Eye className="w-3.5 h-3.5 text-[#007eff] flex-shrink-0" />
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
                      ৳{inv.totalAmount.toLocaleString()} BDT
                    </td>

                    {/* Status */}
                    <td className="p-4 sm:p-5 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                          inv.paymentStatus === "ACTIVE" || inv.paymentStatus === "PAID" || inv.paymentStatus === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : inv.paymentStatus === "EXPIRED"
                            ? "bg-slate-100 text-slate-700 border-slate-300"
                            : inv.paymentStatus === "CANCELLED" || inv.paymentStatus === "FAILED"
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        {inv.paymentStatus === "ACTIVE" || inv.paymentStatus === "PAID" || inv.paymentStatus === "CONFIRMED"
                          ? `✓ ${inv.paymentStatus}`
                          : inv.paymentStatus}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="p-4 sm:p-5 text-right pr-5 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer text-xs"
                          title="View Digital Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDirectPDFDownload(inv)}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-white bg-[#007eff] hover:bg-[#0066ee] px-3.5 py-2 rounded-2xl transition-all cursor-pointer shadow-sm border border-blue-400"
                        >
                          <Download className="w-4 h-4" />
                          <span>PDF</span>
                        </button>
                      </div>
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
