"use client";

import React, { useState } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";

interface PayoutLog {
  id: string; bookingId: string; customerName: string; serviceType: string;
  totalBookingPrice: number; leaderCommission: number; cleanerPoolShare: number;
  completedAt: string; status: "CREDITED" | "PENDING_RELEASE";
}
interface Props { teamSlug: string; }

export default function TeamEarningsView({ teamSlug }: Props) {
  const [logs] = useState<PayoutLog[]>([
    { id: "PAY-501", bookingId: "CLN-2026-8890", customerName: "Anisur Rahman", serviceType: "Premium Plan Visit #4 (৳30,000/mo)", totalBookingPrice: 30000, leaderCommission: 375, cleanerPoolShare: 1500, completedAt: "Today at 12:15 PM", status: "CREDITED" },
    { id: "PAY-500", bookingId: "CLN-2026-8889", customerName: "Kazi Farhan", serviceType: "VIP Sofa & Carpet Wash (Custom One-Time)", totalBookingPrice: 8500, leaderCommission: 850, cleanerPoolShare: 3400, completedAt: "Yesterday at 04:30 PM", status: "CREDITED" },
    { id: "PAY-499", bookingId: "CLN-2026-8880", customerName: "Sabrina Rahman", serviceType: "Standard Plan Visit #1 (৳14,000/mo)", totalBookingPrice: 14000, leaderCommission: 350, cleanerPoolShare: 1400, completedAt: "22 Aug 2026", status: "CREDITED" },
  ]);

  return (
    <div className="space-y-8 pb-12 w-full">
      <div className="bg-gradient-to-r from-[#0d274c] via-slate-900 to-[#007eff] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">10% LEADER COMMISSION WALLET</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200">Auto-Credited Per Visit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Team Leader Commission &amp; Earnings Wallet</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl">অফিসিয়াল ৫০% - ১০% - ৪০% কমিশন মডেল অনুযায়ী আপনার অর্জিত ১০% লিডার কমিশন ও টিমের পেমেন্ট হিস্ট্রি।</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-3 self-start md:self-auto min-w-[240px]">
          <div><span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider block">Available Wallet Balance</span><span className="text-2xl sm:text-3xl font-black text-white">৳১৮,৪৫০</span></div>
          <button type="button" onClick={() => alert("Payout withdrawal request submitted to Admin Finance!")} className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"><CreditCard className="w-4 h-4" /> Withdraw to bKash / Bank</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2"><span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">This Month Total Leader Cut (10%)</span><div className="text-2xl font-black text-[#0d274c]">৳১৫,৭৫০</div><p className="text-xs font-bold text-emerald-600">From 24 Completed Visits</p></div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2"><span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Cleaner Pool Total (40%)</span><div className="text-2xl font-black text-blue-600">৳৬৩,০০০</div><p className="text-xs font-medium text-slate-500">Distributed among Team Cleaners</p></div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2"><span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Admin Margin Total (50%)</span><div className="text-2xl font-black text-slate-800">৳৭৮,৭৫০</div><p className="text-xs font-medium text-slate-500">Covers kits, gear &amp; platform net</p></div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div><h2 className="text-lg font-extrabold text-slate-900">Per-Visit Earnings Breakdown</h2><p className="text-xs text-slate-500 font-medium">প্রতিটি কাজ সম্পন্ন হওয়ার সাথে সাথেই কমিশন ওয়ালেটে ক্রেডিট হয়</p></div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">Real-Time Audit</span>
        </div>
        <div className="divide-y divide-slate-100">
          {logs.map(log => (
            <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2"><span className="text-xs font-black text-[#007eff]">{log.bookingId}</span><h3 className="font-extrabold text-slate-900 text-sm">{log.customerName}</h3></div>
                <p className="text-xs text-slate-600 font-medium">{log.serviceType}</p>
                <span className="text-[10px] text-slate-400 font-medium block">Completed {log.completedAt}</span>
              </div>
              <div className="flex items-center gap-6 self-end sm:self-auto text-right">
                <div><span className="text-[10px] text-slate-500 font-bold block uppercase">Leader 10% Cut</span><span className="text-emerald-700 font-extrabold text-base">+৳{log.leaderCommission}</span></div>
                <div><span className="text-[10px] text-slate-500 font-bold block uppercase">Cleaner 40% Pool</span><span className="text-blue-700 font-extrabold text-base">৳{log.cleanerPoolShare}</span></div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Credited</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
