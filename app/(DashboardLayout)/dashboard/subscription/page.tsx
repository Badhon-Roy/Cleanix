"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Award,
} from "lucide-react";

export default function CustomerSubscriptionPage() {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const plans = [
    {
      id: "BASIC",
      name: "Basic Plan",
      price: "৳6,000",
      period: "per month",
      subtitle: "Best for small apartments & 2-bedroom homes",
      visits: "2 Visits / Month (Bi-weekly)",
      features: [
        "2 Routine Home Cleans",
        "Floor Mopping & Dusting",
        "Bathroom & Kitchen Refresh",
        "Online Invoice & Tracking",
      ],
      color: "border-slate-200 bg-white",
    },
    {
      id: "STANDARD",
      name: "Standard Plan",
      price: "৳14,000",
      period: "per month",
      popular: true,
      active: true,
      subtitle: "Best for medium families & office spaces",
      visits: "4 Visits / Month (Weekly)",
      features: [
        "4 Full Deep Cleans (Weekly)",
        "Kitchen & Bathroom Sanitization",
        "Sofa, Carpet & Mattress Vacuuming",
        "Interior Window Cleaning",
        "24/7 Dedicated Phone & Chat Support",
      ],
      color: "border-blue-300 bg-gradient-to-b from-blue-50/80 to-white",
    },
    {
      id: "PREMIUM",
      name: "Premium Plan",
      price: "৳30,000",
      period: "per month",
      subtitle: "Best for luxury duplexes & corporate offices",
      visits: "8 Visits / Month (Bi-weekly)",
      features: [
        "8 Master Cleans (Bi-weekly)",
        "Hospital-Grade Steam Sanitization",
        "Oven, Fridge & Chimney Deep Care",
        "Furniture Wood & Leather Polishing",
        "VIP Concierge Manager & Live GPS",
        "Weekly Inspection Quality Report",
      ],
      color: "border-amber-200 bg-gradient-to-b from-amber-50/50 to-white",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Subscription Management
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ACTIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Manage your monthly cleaning plan, track remaining visits, upgrade tiers, or update billing.
          </p>
        </div>

        <button
          onClick={() => setCancelModalOpen(true)}
          className="text-xs font-bold text-red-600 hover:bg-red-100 bg-red-50 px-4 py-2.5 rounded-2xl border border-red-200 self-start sm:self-auto transition-colors"
        >
          Cancel Subscription
        </button>
      </div>

      {/* Current Active Plan Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d274c] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#007eff]/20 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <Award className="w-4 h-4" /> Current Active Package
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Standard Plan — ৳14,000 / Month
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Includes 4 Weekly Deep Cleans, Anti-Bacterial Sanitization & Dedicated Support.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 p-4 rounded-2xl text-xs space-y-1 text-slate-200 min-w-[240px]">
            <p className="text-white font-bold text-sm">Billing Details:</p>
            <p>Renewal Date: <strong className="text-white font-bold">26 August 2026</strong></p>
            <p>Payment Method: <strong className="text-blue-300 font-bold">bKash Gateway</strong></p>
            <p>Auto-Renewal: <strong className="text-emerald-400 font-bold">Enabled</strong></p>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="space-y-3 pt-4 border-t border-white/15 relative z-10">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Monthly Visit Credits: 3 of 4 Visits Used</span>
            <span className="text-amber-400 font-bold">1 Visit Remaining</span>
          </div>
          <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/15">
            <div className="bg-gradient-to-r from-[#007eff] to-cyan-400 h-full rounded-full w-[75%]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-emerald-500/20 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-300 font-bold text-center">
              ✓ Visit 1: Completed (07 Aug)
            </div>
            <div className="bg-emerald-500/20 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-300 font-bold text-center">
              ✓ Visit 2: Completed (14 Aug)
            </div>
            <div className="bg-blue-500/30 border border-blue-400/50 p-2.5 rounded-xl text-blue-200 font-extrabold text-center animate-pulse">
              ⚡ Visit 3: Active Today (21 Aug)
            </div>
            <div className="bg-white/10 border border-white/15 p-2.5 rounded-xl text-slate-300 font-medium text-center">
              ⌛ Visit 4: Scheduled (28 Aug)
            </div>
          </div>
        </div>
      </div>

      {/* Package Upgrade Options (3 Cards) */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Explore All Subscription Plans & Upgrade
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl p-6 sm:p-7 border ${p.color} flex flex-col justify-between space-y-6 relative transition-transform hover:scale-[1.01]`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#007eff] text-white text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider">
                  Most Popular Choice
                </div>
              )}

              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-extrabold text-slate-900">{p.name}</h3>
                  {p.active && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      CURRENT PLAN
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">{p.subtitle}</p>

                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-slate-900">{p.price}</span>
                  <span className="text-xs text-slate-500 font-medium ml-1">/{p.period}</span>
                </div>

                <div className="mt-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 inline-block">
                  ⚡ {p.visits}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 space-y-2.5">
                  {p.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {p.active ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-2xl bg-slate-100 text-slate-500 font-bold text-xs cursor-default text-center border border-slate-200"
                  >
                    Your Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Upgrading to ${p.name} ...`)}
                    className="w-full py-3 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs text-center transition-all flex items-center justify-center gap-2"
                  >
                    <span>Switch to {p.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Modal Mock */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Cancel Subscription?</h3>
            <p className="text-xs text-slate-600 font-medium">
              Are you sure you want to cancel your Standard Plan? You will retain your 1 remaining visit until 26 August 2026.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Keep My Subscription
              </button>
              <button
                onClick={() => {
                  alert("Subscription cancellation request received.");
                  setCancelModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
