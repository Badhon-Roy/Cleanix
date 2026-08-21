"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Calendar,
  Download,
  ArrowUpRight,
} from "lucide-react";

export default function CleanerEarningsPage() {
  const payouts = [
    {
      id: "PAY-2026-901",
      date: "Aug 21, 2026",
      jobId: "CLN-2026-8891",
      service: "VIP Standard Deep Cleaning",
      gross: "৳14,000",
      share: "15%",
      net: "৳2,100",
      status: "CREDITED",
    },
    {
      id: "PAY-2026-902",
      date: "Aug 21, 2026",
      jobId: "CLN-2026-8892",
      service: "Commercial Office Cleaning",
      gross: "৳22,000",
      share: "16%",
      net: "৳3,520",
      status: "PENDING",
    },
    {
      id: "PAY-2026-899",
      date: "Aug 20, 2026",
      jobId: "CLN-2026-8890",
      service: "Move-In / Move-Out Deep Clean",
      gross: "৳12,000",
      share: "15%",
      net: "৳1,800",
      status: "CREDITED",
    },
    {
      id: "PAY-2026-895",
      date: "Aug 19, 2026",
      jobId: "CLN-2026-8888",
      service: "Residential Bi-Weekly Cleaning",
      gross: "৳6,000",
      share: "20%",
      net: "৳1,200",
      status: "CREDITED",
    },
  ];

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 stroke-[2.5]" />
              </div>
              Earnings & Payout Breakdown
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ WEEKLY DISPATCH PAY
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Track daily job commissions, supervisor bonuses, and bKash/Bank payout records.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid - Modern Gradient & Dashed Border Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Monthly Earnings Card */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 border-2 border-dashed border-emerald-300 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Monthly Earnings
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳42,500</p>
            <div className="pt-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 inline-block">
                 +18% vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Completed Jobs Card */}
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 border-2 border-dashed border-blue-300 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Completed Jobs
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">18 Jobs</p>
            <div className="pt-2">
              <span className="text-xs font-bold text-blue-800 bg-blue-100/90 px-3 py-1 rounded-full border border-blue-300 inline-block">
                ✓ 100% On-time Dispatch
              </span>
            </div>
          </div>
        </div>

        {/* Pending Payout Card */}
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 border-2 border-dashed border-amber-300 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Pending Payout
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳3,520</p>
            <div className="pt-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 inline-block">
                ⏱ Processing Friday
              </span>
            </div>
          </div>
        </div>

        {/* 5-Star VIP Bonus Card */}
        <div className="bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 border-2 border-dashed border-purple-300 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              5-Star VIP Bonus
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳3,500</p>
            <div className="pt-2">
              <span className="text-xs font-bold text-purple-800 bg-purple-100/90 px-3 py-1 rounded-full border border-purple-300 inline-block">
                ⭐ Performance Reward
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-[#007eff]" /> Recent Payout Records
          </h2>
          <button
            type="button"
            onClick={() => alert("Downloading Payout Statement PDF...")}
            className="bg-blue-50 hover:bg-blue-100 text-[#007eff] font-bold text-xs sm:text-sm px-4 py-2 rounded-2xl border border-blue-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Statement PDF</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Payout ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Job Ref</th>
                <th className="p-4">Service</th>
                <th className="p-4">Gross Fee</th>
                <th className="p-4">Comm. %</th>
                <th className="p-4">Net Payout</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payouts.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900">{row.id}</td>
                  <td className="p-4 text-slate-600">{row.date}</td>
                  <td className="p-4 font-bold text-[#007eff]">{row.jobId}</td>
                  <td className="p-4 font-semibold text-slate-800">{row.service}</td>
                  <td className="p-4 text-slate-600">{row.gross}</td>
                  <td className="p-4 text-slate-600 font-bold">{row.share}</td>
                  <td className="p-4 font-extrabold text-emerald-700">{row.net}</td>
                  <td className="p-4">
                    {row.status === "CREDITED" ? (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Credited
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
