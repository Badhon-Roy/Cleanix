"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  CreditCard,
  RefreshCw,
  Clock,
  Zap,
  ShieldCheck,
  X,
  ShieldAlert,
} from "lucide-react";
import PricingCardsGrid from "@/components/PricingCardsGrid";

export default function CustomerSubscriptionPage() {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>("STANDARD");

  const handleSwitchPlan = (planId: string) => {
    if (planId === currentPlan) return;
    const confirmSwitch = window.confirm(
      `আপনি কি আপনার Subscription Plan ${planId} এ পরিবর্তন করতে চান?`
    );
    if (confirmSwitch) {
      setCurrentPlan(planId);
      alert(`ধন্যবাদ! আপনার Subscription সফলভাবে ${planId} Plan এ আপডেট করা হয়েছে।`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Subscription Management
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
              ✓ ACTIVE: {currentPlan} PLAN
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            আপনার চলমান Clean Service এর তথ্য দেখুন, Visit Credit ট্র্যাক করুন এবং প্রয়োজনে Plan upgrade করুন।
          </p>
        </div>

        <button
          onClick={() => setCancelModalOpen(true)}
          className="text-xs font-bold text-red-600 hover:bg-red-100 bg-red-50 px-4 py-2.5 rounded border border-red-200 self-start sm:self-auto transition-colors cursor-pointer"
        >
          Cancel Subscription
        </button>
      </div>

      {/* Modern User-Friendly Active Plan Overview Card */}
      <div className="bg-white border-2 border-[#007eff] rounded-3xl p-6 sm:p-8 md:p-10 space-y-7 relative overflow-hidden">
        {/* Top Plan Header & Billing Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#007eff] border border-blue-200 text-xs font-bold">
              <Award className="w-4 h-4 text-[#007eff]" />
              <span>CURRENT ACTIVE PLAN</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              {currentPlan === "BASIC"
                ? "BASIC PLAN — ৳6,000 / Month"
                : currentPlan === "PREMIUM"
                ? "PREMIUM PLAN — ৳30,000 / Month"
                : "STANDARD PLAN — ৳14,000 / Month"}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-bold">
              মাসে ৪ বার সাপ্তাহিক Deep Cleaning, Anti-Bacterial Spray এবং Dedicated Support অন্তর্ভুক্ত।
            </p>
          </div>
        </div>

        {/* GLASSMORPHISM BILLING DETAILS PANEL */}
        <div className="relative rounded-3xl p-3 sm:p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-cyan-50/80 border border-blue-100 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Item 1: Renewal Date */}
            <div className="bg-white/90 hover:bg-white backdrop-blur-md p-5 rounded-2xl border border-blue-100 transition-all duration-300 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007eff] to-cyan-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  পরবর্তী Billing Renewal:
                </span>
                <strong className="text-slate-900 font-bold text-base sm:text-lg block">
                  26 August 2026
                </strong>
              </div>
            </div>

            {/* Item 2: Payment Method */}
            <div className="bg-white/90 hover:bg-white backdrop-blur-md p-5 rounded-2xl border border-blue-100 transition-all duration-300 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  Payment Method:
                </span>
                <strong className="text-slate-900 font-bold text-base sm:text-lg block">
                  bKash Online Payment
                </strong>
              </div>
            </div>

            {/* Item 3: Auto Renewal */}
            <div className="bg-white/90 hover:bg-white backdrop-blur-md p-5 rounded-2xl border border-blue-100 transition-all duration-300 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  Auto Renewal Status:
                </span>
                <strong className="text-emerald-700 font-bold text-base sm:text-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Auto-Renew Enabled
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4-VISIT PROGRESS TRACKER */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm sm:text-base font-bold">
            <span className="text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#007eff]" />
              <span>চলতি মাসের Service Credit: ৩/৪ টি ব্যবহার করা হয়েছে</span>
            </span>
            <span className="text-[#007eff] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 text-xs sm:text-sm">
              ১টি Visit বাকি রয়েছে (75% Done)
            </span>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-500 via-[#007eff] to-cyan-400 h-full rounded-full w-[75%] transition-all duration-500" />
          </div>

          {/* 4 Visit Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Visit 1 */}
            <div className="bg-emerald-50/90 border border-emerald-300 p-5 rounded-2xl flex items-center gap-3.5 transition-transform hover:scale-[1.01]">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 stroke-[2.5]" />
              <div>
                <p className="text-sm sm:text-base font-bold text-emerald-900">Visit 1: সম্পন্ন ✓</p>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">07 Aug 2026 (09:00 AM)</p>
              </div>
            </div>

            {/* Visit 2 */}
            <div className="bg-emerald-50/90 border border-emerald-300 p-5 rounded-2xl flex items-center gap-3.5 transition-transform hover:scale-[1.01]">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 stroke-[2.5]" />
              <div>
                <p className="text-sm sm:text-base font-bold text-emerald-900">Visit 2: সম্পন্ন ✓</p>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">14 Aug 2026 (09:00 AM)</p>
              </div>
            </div>

            {/* Visit 3 */}
            <div className="bg-gradient-to-r from-[#007eff] to-blue-600 border border-blue-400 p-5 rounded-2xl flex items-center gap-3.5 text-white animate-pulse transition-transform hover:scale-[1.01]">
              <Zap className="w-6 h-6 text-amber-300 flex-shrink-0 stroke-[2.5]" />
              <div>
                <p className="text-sm sm:text-base font-bold">Visit 3: আজ Active ⚡</p>
                <p className="text-xs text-blue-100 font-bold mt-0.5">Today (21 Aug, En-Route)</p>
              </div>
            </div>

            {/* Visit 4 */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-3.5 transition-transform hover:scale-[1.01]">
              <Clock className="w-6 h-6 text-slate-400 flex-shrink-0 stroke-[2]" />
              <div>
                <p className="text-sm sm:text-base font-bold text-slate-800">Visit 4: আগামী Schedule ⌛</p>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">28 Aug 2026 (09:00 AM)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Subscription Plans Section */}
      <div className="space-y-4 pt-4">
        <div>
          <span className="text-xl font-medium text-[#007eff] flex items-center gap-1.5 mb-1">
            Select or Upgrade Subscription
          </span>
          <h2 className="text-xl my-2 sm:text-3xl font-bold text-slate-900 tracking-tight">
            Subscription Plan সমূহ
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1">
            আপনার প্রয়োজন অনুযায়ী যেকোনো Plan বেছে নিন বা পরিবর্তন করুন। যেকোনো সময় Upgrade করা সম্ভব।
          </p>
        </div>

        {/* Reusable Pricing Cards Grid Component */}
        <div className="pt-2">
          <PricingCardsGrid
            currentPlanId={currentPlan}
            showCurrentPlanBadge={true}
            onSelectPlan={handleSwitchPlan}
          />
        </div>
      </div>

      {/* ULTRA-MODERN CANCEL CONFIRMATION POPUP MODAL (Clean Mixed Text Without Brackets) */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md transition-all">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl overflow-hidden text-slate-900 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Top Right Close Cross */}
            <button
              onClick={() => setCancelModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Red Icon + Title */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Subscription Cancel করবেন?
                </h3>
                <p className="text-sm text-slate-500 font-semibold">
                  {currentPlan} Plan Cancellation Request
                </p>
              </div>
            </div>

            {/* Warning Callout Box */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>সতর্কবার্তা ও Service সুবিধা:</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-800 font-semibold leading-relaxed">
                আপনি কি আপনার <strong className="text-amber-950 font-black">{currentPlan} Plan</strong> বাতিল করতে চান? Subscription বাতিল করলেও আগামী <strong className="text-amber-950 font-black">26 August 2026</strong> পর্যন্ত আপনার অবশিষ্ট ১টি Visit Credit বহাল থাকবে।
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Primary Keep Subscription Button */}
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm text-center transition-all hover:scale-[1.02] cursor-pointer"
              >
                Subscription চালু রাখুন
              </button>

              {/* Secondary Confirm Cancel Button */}
              <button
                onClick={() => {
                  alert("Subscription বাতিলের আবেদন গ্রহণ করা হয়েছে।");
                  setCancelModalOpen(false);
                }}
                className="py-3.5 px-5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs sm:text-sm text-center transition-colors cursor-pointer"
              >
                Cancel নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
