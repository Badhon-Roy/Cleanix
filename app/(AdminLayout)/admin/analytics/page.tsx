"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [downloadSuccessAlert, setDownloadSuccessAlert] = useState(false);

  const handleDownloadReport = () => {
    setDownloadSuccessAlert(true);
    setTimeout(() => setDownloadSuccessAlert(false), 3500);
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 stroke-[2.5]" />
              </div>
              Revenue & Financial Analytics
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ Q3 FINANCIAL LEDGER
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Monitor gross revenue, cleaner payout commission ledgers, subscription margins, and download financial statements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadReport}
          className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Export Financial PDF Report</span>
        </button>
      </div>

      {downloadSuccessAlert && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-emerald-800 text-xs sm:text-sm font-extrabold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Financial statement report downloaded successfully! (PDF Generated)</span>
        </div>
      )}

      {/* KPI Financial Metric Cards - Dashed Border Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Gross Platform Revenue */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Gross Platform Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳1,48,500</p>
            <div className="pt-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24% Monthly Growth
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Cleaner Staff Payouts */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Cleaner Staff Payouts
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳96,500</p>
            <div className="pt-1">
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 inline-block">
                ⚡ 65% Staff Share
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Platform Net Margin */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Cleanix Net Profit Margin
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳52,000</p>
            <div className="pt-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block">
                ★ 35% Cleanix Net Margin
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Avg Order Value */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Avg Booking Value
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <PieChart className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳14,200</p>
            <div className="pt-1">
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 inline-block">
                ⚡ Premium Tier Dominance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PACKAGE REVENUE BREAKDOWN & PAYOUT LEDGER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-[#007eff]" /> Revenue Stream Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Distribution of monthly earnings across B2B commercial, B2C residential subscriptions, and one-time deep cleaning bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
            <span className="text-xs font-bold text-blue-900 uppercase">Standard Subscription Plan</span>
            <p className="text-2xl font-black text-[#007eff]">৳68,000</p>
            <p className="text-xs text-slate-600 font-medium">45.7% of Total Revenue</p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
            <span className="text-xs font-bold text-blue-900 uppercase">Premium VIP Corporate Plan</span>
            <p className="text-2xl font-black text-[#007eff]">৳54,000</p>
            <p className="text-xs text-slate-600 font-medium">36.3% of Total Revenue</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
            <span className="text-xs font-bold text-emerald-900 uppercase">Basic Plan & One-Time Addons</span>
            <p className="text-2xl font-black text-emerald-700">৳26,500</p>
            <p className="text-xs text-slate-600 font-medium">18.0% of Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
