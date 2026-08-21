"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import InvoiceModal, { InvoiceData } from "@/components/dashboard/InvoiceModal";

export default function CustomerInvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

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

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#007eff]" />
            Invoices & Payment Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Download automated PDF invoices, view payment transaction receipts, and track tax documentation.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Receipts</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">12 Paid Invoices</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Spent</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">৳142,500</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Latest Invoice</p>
            <h3 className="text-xl font-mono font-extrabold text-[#007eff] mt-1">INV-2026-8891</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">All Billing Statements</h3>
          <span className="text-xs text-slate-500 font-mono font-bold">Auto-generated by Resend API</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="p-3.5 pl-4 font-bold">Invoice ID</th>
                <th className="p-3.5 font-bold">Booking Ref</th>
                <th className="p-3.5 font-bold">Date</th>
                <th className="p-3.5 font-bold">Service Package</th>
                <th className="p-3.5 font-bold">Payment Method</th>
                <th className="p-3.5 font-bold">Amount Paid</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 text-right pr-4 font-bold">PDF Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {invoicesList.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 pl-4 font-mono font-extrabold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="p-3.5 font-mono font-bold text-[#007eff]">#{inv.bookingNumber}</td>
                  <td className="p-3.5 text-slate-600 font-medium">{inv.date}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">{inv.serviceTitle}</td>
                  <td className="p-3.5 text-slate-600 font-medium">{inv.paymentMethod}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">৳{inv.totalAmount.toLocaleString()}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      PAID
                    </span>
                  </td>
                  <td className="p-3.5 text-right pr-4">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#007eff] hover:bg-[#0066ee] px-3 py-1.5 rounded-xl transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View PDF</span>
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
    </div>
  );
}
