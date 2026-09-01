"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Layers,
  Plus,
  Download,
  FileText,
  Check,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import PricingCardsGrid from "@/components/PricingCardsGrid";
import {
  fetchMySubscriptionsAPI,
  cancelSubscriptionAPI,
  downloadSubscriptionPDFAPI,
} from "@/services/subscriptionService";

export default function SubscriptionClientView({
  initialSubscriptions = [],
}: {
  initialSubscriptions?: any[];
}) {
  const [subscriptions, setSubscriptions] = useState<any[]>(initialSubscriptions);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Sync initial props
  useEffect(() => {
    if (initialSubscriptions && initialSubscriptions.length > 0) {
      setSubscriptions(initialSubscriptions);
    }
  }, [initialSubscriptions]);

  // Client-side auto-fetch on mount for freshest data
  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchMySubscriptionsAPI();
      if (res?.success && Array.isArray(res?.data)) {
        setSubscriptions(res.data);
      }
    } catch (err) {
      console.error("Error loading subscriptions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  // Find active subscription if any
  const activeSubscription = subscriptions.find(
    (s) => s.status === "ACTIVE" && !s.isDeleted
  ) || subscriptions[0];

  const handleCancelSubscription = async () => {
    if (!activeSubscription?._id) return;
    setIsCancelling(true);
    try {
      const res = await cancelSubscriptionAPI(String(activeSubscription._id));
      if (res?.success) {
        setCancelModalOpen(false);
        loadSubscriptions();
      } else {
        alert(res?.message || "Failed to cancel subscription.");
      }
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      alert(err?.message || "An error occurred during cancellation.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadPDF = (sub: any) => {
    if (!sub?._id) return;
    const cleanRef = (sub.subscriptionRef || "SUBSCRIPTION").replace(/#/g, "");
    downloadSubscriptionPDFAPI(String(sub._id), `Cleanix-Invoice-${cleanRef}.pdf`);
  };

  const currentPlanTitle = activeSubscription
    ? activeSubscription.planTitle || activeSubscription.planId || "STANDARD"
    : "NO ACTIVE PLAN";

  const totalVisits = activeSubscription?.totalVisitsPerMonth || 4;
  const remainingVisits = activeSubscription?.remainingVisits ?? totalVisits;
  const usedVisits = activeSubscription?.usedVisits ?? (totalVisits - remainingVisits);
  const percentDone = Math.round((usedVisits / totalVisits) * 100);

  const getRenewalDateDisplay = (activeSub: any) => {
    if (!activeSub) return "N/A";

    let end: Date;
    if (activeSub.endDate) {
      end = new Date(activeSub.endDate);
    } else if (activeSub.createdAt) {
      const created = new Date(activeSub.createdAt);
      end = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else {
      end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    if (isNaN(end.getTime())) return "30 Days Billing Cycle";

    const formattedDate = end.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const diffMs = end.getTime() - Date.now();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${formattedDate} (${diffDays} দিন বাকি)`;
    } else if (diffDays === 0) {
      return `${formattedDate} (আজ Renewal Date)`;
    } else {
      return `${formattedDate} (Expired)`;
    }
  };

  const renewalDateStr = getRenewalDateDisplay(activeSubscription);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Subscription Management
            </h1>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                activeSubscription?.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : activeSubscription?.status === "CANCELLED"
                  ? "bg-rose-50 text-rose-800 border-rose-300"
                  : "bg-amber-50 text-amber-800 border-amber-300"
              }`}
            >
              {activeSubscription
                ? `✓ ${activeSubscription.status}: ${currentPlanTitle} PLAN`
                : "INACTIVE"}
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            আপনার চলমান Clean Service এর তথ্য দেখুন, Visit Credit ট্র্যাক করুন এবং প্রয়োজনে Plan upgrade করুন।
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={loadSubscriptions}
            disabled={isLoading}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            title="Refresh Subscriptions"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#007eff]" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {activeSubscription && (
            <button
              onClick={() => handleDownloadPDF(activeSubscription)}
              className="bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Invoice</span>
            </button>
          )}

          {activeSubscription && activeSubscription.status === "ACTIVE" && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="text-xs font-bold text-red-600 hover:bg-red-100 bg-red-50 px-4 py-2.5 rounded-xl border border-red-200 transition-colors cursor-pointer"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Active Plan Overview Card */}
      {activeSubscription ? (
        <div className="bg-white border-2 border-[#007eff] rounded-3xl p-6 sm:p-8 md:p-10 space-y-7 relative overflow-hidden shadow-xs">
          {/* Top Plan Header & Billing Summary */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#007eff] border border-blue-200 text-xs font-bold">
                <Award className="w-4 h-4 text-[#007eff]" />
                <span>
                  ACTIVE SUBSCRIPTION #{activeSubscription.subscriptionRef}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                {currentPlanTitle} PLAN — ৳{(activeSubscription.totalAmount || 14000).toLocaleString()} / Month
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-600 font-bold">
                মাসে {totalVisits} বার রুটিন স্যানিটাইজেশন, অ্যান্টি-ব্যাকটেরিয়াল স্প্রে ও ভিআইপি কাস্টমার সাপোর্ট।
              </p>

              {/* Selected Addons Pills */}
              {Array.isArray(activeSubscription.selectedAddons) &&
                activeSubscription.selectedAddons.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-xs font-bold text-slate-500">Selected Extras:</span>
                    {activeSubscription.selectedAddons.map((addon: string) => (
                      <span
                        key={addon}
                        className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        + {addon}
                      </span>
                    ))}
                  </div>
                )}
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
                    {renewalDateStr}
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
                    {activeSubscription.paymentMethod} ({activeSubscription.paymentStatus})
                  </strong>
                </div>
              </div>

              {/* Item 3: Service Zone */}
              <div className="bg-white/90 hover:bg-white backdrop-blur-md p-5 rounded-2xl border border-blue-100 transition-all duration-300 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <RefreshCw className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                    Subscription Zone:
                  </span>
                  <strong className="text-emerald-700 font-bold text-sm sm:text-base flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    {activeSubscription.zoneName || "Dhaka Zone"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* VISIT PROGRESS TRACKER */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm sm:text-base font-bold">
              <span className="text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#007eff]" />
                <span>চলতি মাসের Service Credit: {usedVisits}/{totalVisits} টি ব্যবহার করা হয়েছে</span>
              </span>
              <span className="text-[#007eff] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 text-xs sm:text-sm">
                {remainingVisits}টি Visit বাকি রয়েছে ({percentDone}% Used)
              </span>
            </div>

            {/* Progress Bar Line */}
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-emerald-500 via-[#007eff] to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentDone}%` }}
              />
            </div>

            {/* Visit Step Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {Array.from({ length: totalVisits }).map((_, idx) => {
                const visitNum = idx + 1;
                const isCompleted = visitNum <= usedVisits;
                const isNext = visitNum === usedVisits + 1;

                return (
                  <div
                    key={visitNum}
                    className={`p-5 rounded-2xl flex items-center gap-3.5 transition-transform hover:scale-[1.01] ${
                      isCompleted
                        ? "bg-emerald-50/90 border border-emerald-300"
                        : isNext
                        ? "bg-gradient-to-r from-[#007eff] to-blue-600 border border-blue-400 text-white animate-pulse"
                        : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 stroke-[2.5]" />
                    ) : isNext ? (
                      <Zap className="w-6 h-6 text-amber-300 flex-shrink-0 stroke-[2.5]" />
                    ) : (
                      <Clock className="w-6 h-6 text-slate-400 flex-shrink-0 stroke-[2]" />
                    )}

                    <div>
                      <p
                        className={`text-sm sm:text-base font-bold ${
                          isCompleted
                            ? "text-emerald-900"
                            : isNext
                            ? "text-white"
                            : "text-slate-800"
                        }`}
                      >
                        Visit {visitNum}: {isCompleted ? "সম্পন্ন ✓" : isNext ? "পরবর্তী Active ⚡" : "আগামী Schedule ⌛"}
                      </p>
                      <p
                        className={`text-xs font-bold mt-0.5 ${
                          isCompleted
                            ? "text-emerald-700"
                            : isNext
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {isNext ? activeSubscription.firstVisitDate || "Scheduled Date" : `Monthly Visit #${visitNum}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl border-2 border-dashed border-blue-200 bg-gradient-to-b from-blue-50/40 to-slate-50/60 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100/70 text-[#007eff] flex items-center justify-center mx-auto border border-blue-200 shadow-sm">
            <Layers className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              আপনার কোনো সচল সাবস্ক্রিপশন নেই (No Active Subscription)
            </h4>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              সাপ্তাহিক ও মাসিক স্যানিটাইজিং সার্ভিসের জন্য নিচে থেকে আপনার পছন্দমতো প্যাকেজ নির্বাচন করুন।
            </p>
          </div>
          <Link
            href="/subscribe"
            className="inline-flex items-center gap-2 bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm sm:text-base px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/25 hover:scale-[1.02] cursor-pointer mt-2"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Subscribe Now</span>
          </Link>
        </div>
      )}

      {/* Subscription Order History */}
      {subscriptions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#007eff]" />
            <span>Subscription Order Records ({subscriptions.length})</span>
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-bold">
                  <th className="p-3.5 pl-4">Ref Code</th>
                  <th className="p-3.5">Plan Title</th>
                  <th className="p-3.5">Coverage Zone</th>
                  <th className="p-3.5">Amount Billed</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {subscriptions.map((sub: any) => (
                  <tr key={sub._id} className="hover:bg-slate-50">
                    <td className="p-3.5 pl-4 font-mono font-bold text-[#007eff]">
                      {sub.subscriptionRef}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {sub.planTitle || sub.planId}
                    </td>
                    <td className="p-3.5 text-slate-600">{sub.zoneName}</td>
                    <td className="p-3.5 font-bold text-slate-900">
                      ৳{(sub.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold">{sub.paymentMethod}</span>
                      <span className="text-[10px] block text-slate-500">
                        {sub.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          sub.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : sub.status === "CANCELLED"
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : "bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right pr-4">
                      <button
                        onClick={() => handleDownloadPDF(sub)}
                        className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscription Plans Grid */}
      <div className="space-y-4 pt-4">
        <div>
          <span className="text-xl font-medium text-[#007eff] flex items-center gap-1.5 mb-1">
            Select or Upgrade Subscription
          </span>
          <h2 className="text-xl my-2 sm:text-3xl font-bold text-slate-900 tracking-tight">
            Cleanix Subscription Packages
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1">
            আপনার প্রয়োজন অনুযায়ী যেকোনো Plan বেছে নিন বা পরিবর্তন করুন।
          </p>
        </div>

        <div className="pt-2">
          <PricingCardsGrid
            currentPlanId={activeSubscription?.planId?.toLowerCase() || "standard"}
            showCurrentPlanBadge={true}
          />
        </div>
      </div>

      {/* CANCEL CONFIRMATION MODAL */}
      {cancelModalOpen && activeSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md transition-all">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl overflow-hidden text-slate-900 space-y-6 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Subscription Cancel করবেন?
                </h3>
                <p className="text-sm text-slate-500 font-semibold">
                  {currentPlanTitle} ({activeSubscription.subscriptionRef}) Cancellation
                </p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>সতর্কবার্তা:</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-800 font-semibold leading-relaxed">
                আপনি কি আপনার <strong className="text-amber-950 font-black">{currentPlanTitle} Plan</strong> বাতিল করতে চান? Subscription বাতিল করলেও মেয়াদের শেষ পর্যন্ত আপনার অবশিষ্ট সার্ভিস ক্রেডিট বহাল থাকবে।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                disabled={isCancelling}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm text-center transition-all hover:scale-[1.02] cursor-pointer"
              >
                Subscription चालू রাখুন
              </button>

              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="py-3.5 px-5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs sm:text-sm text-center transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isCancelling ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                ) : (
                  <span>Cancel নিশ্চিত করুন</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
