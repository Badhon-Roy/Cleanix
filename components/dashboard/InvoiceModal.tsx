"use client";

import React from "react";
import { X, Download, Printer, CheckCircle, ShieldCheck } from "lucide-react";
import { SwirlLogo } from "@/components/Navbar";

import { downloadBookingPDFAPI } from "@/services/bookingService";
import { downloadSubscriptionPDFAPI } from "@/services/subscriptionService";

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  bookingNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  serviceTitle: string;
  items: {
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  vat: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
}

interface InvoiceModalProps {
  invoice: InvoiceData | null;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!invoice.id) {
      alert("Invoice ID not found");
      return;
    }

    const cleanRef = (
      invoice.invoiceNumber ||
      invoice.bookingNumber ||
      "INVOICE"
    ).replace(/#/g, "");
    const filename = `Cleanix-Invoice-${cleanRef}.pdf`;

    if (
      invoice.invoiceNumber?.startsWith("INV-SUB") ||
      invoice.invoiceNumber?.startsWith("SUB") ||
      invoice.bookingNumber?.startsWith("#SUB")
    ) {
      await downloadSubscriptionPDFAPI(invoice.id, filename);
    } else {
      await downloadBookingPDFAPI(invoice.id, filename);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]">
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#007eff] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-bold">
              {invoice.invoiceNumber}
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> PAID
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-colors text-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="bg-[#007eff] hover:bg-[#0066ee] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm bg-white">
          {/* Header Branding & Invoice Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <SwirlLogo />
              <div>
                <h2 className="text-2xl font-extrabold text-[#0d274c] tracking-tight">
                  Cleanix
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Field Service Management System
                </p>
                <p className="text-[11px] text-slate-400">
                  Dhaka, Bangladesh • BIN: 004819283-0102
                </p>
              </div>
            </div>

            <div className="sm:text-right text-xs space-y-1 text-slate-600 font-mono">
              <p className="text-slate-900 font-extrabold text-sm">
                TAX INVOICE
              </p>
              <p>Invoice Date: {invoice.date}</p>
              <p>Booking Ref: #{invoice.bookingNumber}</p>
              <p>Trx ID: {invoice.transactionId}</p>
            </div>
          </div>

          {/* Billed To & Service Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <h4 className="text-[11px] uppercase font-extrabold text-[#007eff] tracking-wider mb-1">
                Billed To (Customer):
              </h4>
              <p className="font-extrabold text-slate-900 text-sm">
                {invoice.customerName}
              </p>
              <p className="text-slate-600 mt-0.5 font-medium">
                {invoice.customerAddress}
              </p>
              <p className="text-slate-500 mt-1">Phone: +880 1711-223344</p>
            </div>

            <div>
              <h4 className="text-[11px] uppercase font-extrabold text-[#007eff] tracking-wider mb-1">
                Service Package Details:
              </h4>
              <p className="font-extrabold text-slate-900 text-sm">
                {invoice.serviceTitle}
              </p>
              <p className="text-slate-600 mt-0.5 font-medium">
                Payment Method: {invoice.paymentMethod}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Guaranteed Quality
                Inspection
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 pl-4 font-bold">Item & Description</th>
                  <th className="p-3.5 text-center font-bold">Qty</th>
                  <th className="p-3.5 text-right font-bold">Unit Price</th>
                  <th className="p-3.5 text-right pr-4 font-bold">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3.5 pl-4 font-semibold">
                      {item.description}
                    </td>
                    <td className="p-3.5 text-center font-mono">{item.qty}</td>
                    <td className="p-3.5 text-right font-mono">
                      ৳{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900 pr-4">
                      ৳{item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Calculation */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-slate-500 space-y-1 max-w-xs font-medium">
              <p className="font-bold text-slate-700">Payment Terms:</p>
              <p>
                Paid electronically via {invoice.paymentMethod}. All service
                fees include certified eco-chemicals and equipment.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>৳{invoice.subtotal.toLocaleString()}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Discount:</span>
                  <span>-৳{invoice.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>VAT / Tax (0%):</span>
                <span>৳{invoice.vat.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-slate-900 font-extrabold text-sm">
                <span>Total Paid:</span>
                <span className="text-[#007eff]">
                  ৳{invoice.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100 font-medium">
            Thank you for choosing{" "}
            <span className="text-[#007eff] font-bold">Cleanix</span>! For
            inquiries, call +880 1700-000000 or email support@cleanix.com.
          </div>
        </div>
      </div>
    </div>
  );
}
