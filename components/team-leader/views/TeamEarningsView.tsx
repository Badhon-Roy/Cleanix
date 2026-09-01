"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, CreditCard, Clock, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { fetchMyTeamAssignmentsAPI, fetchTeamByIdOrSlugAPI, TeamSquad } from "@/services/teamService";

interface Props {
  teamSlug: string;
}

export default function TeamEarningsView({ teamSlug }: Props) {
  const [teamSquad, setTeamSquad] = useState<TeamSquad | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEarningsData = async () => {
      setIsLoading(true);
      try {
        const [teamData, assignmentsData] = await Promise.all([
          fetchTeamByIdOrSlugAPI(teamSlug),
          fetchMyTeamAssignmentsAPI(teamSlug),
        ]);

        if (teamData) setTeamSquad(teamData);
        if (Array.isArray(assignmentsData)) setAssignments(assignmentsData);
      } catch (err) {
        console.error("Error loading team earnings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEarningsData();
  }, [teamSlug]);

  const leaderWallet = teamSquad?.dashboardStats?.leaderCommissionWallet ?? 0;
  const pendingLeaderCommission = teamSquad?.dashboardStats?.pendingLeaderCommission ?? 0;
  const cleanerPoolTotal = teamSquad?.dashboardStats?.cleanerPoolEarnings ?? 0;
  const completedJobsCount = teamSquad?.dashboardStats?.completedJobsCount ?? 0;

  // 50% Admin margin calculation
  const totalCompletedGross = leaderWallet > 0 ? leaderWallet * 10 : 0;
  const adminMarginTotal = Math.round(totalCompletedGross * 0.5);

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d274c] via-slate-900 to-[#007eff] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              10% LEADER COMMISSION WALLET
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200">
              Auto-Credited Upon Completion
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Team Leader Commission &amp; Earnings Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl">
            অফিসিয়াল ৫০% - ১০% - ৪০% কমিশন মডেল অনুযায়ী আপনার অর্জিত ১০% লিডার কমিশন ও টিমের পেমেন্ট হিস্ট্রি।
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-3 self-start md:self-auto min-w-[260px]">
          <div>
            <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider block">
              Available Credited Balance
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">
              ৳{leaderWallet.toLocaleString()}
            </span>
            {pendingLeaderCommission > 0 && (
              <span className="text-[11px] text-amber-300 font-bold block mt-0.5">
                +৳{pendingLeaderCommission.toLocaleString()} Pending (In Progress)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => alert("Payout withdrawal request submitted to Admin Finance!")}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" /> Withdraw to bKash / Bank
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
            Leader Commission Cut (10%)
          </span>
          <div className="text-2xl font-black text-[#0d274c]">৳{leaderWallet.toLocaleString()}</div>
          <p className="text-xs font-bold text-emerald-600">
            From {completedJobsCount} Completed Field Services
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
            Cleaner Pool Total (40%)
          </span>
          <div className="text-2xl font-black text-blue-600">৳{cleanerPoolTotal.toLocaleString()}</div>
          <p className="text-xs font-medium text-slate-500">
            Distributed equally among assigned squad cleaners
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
            Admin Margin Total (50%)
          </span>
          <div className="text-2xl font-black text-slate-800">৳{adminMarginTotal.toLocaleString()}</div>
          <p className="text-xs font-medium text-slate-500">
            Covers chemical kits, vans &amp; platform net
          </p>
        </div>
      </div>

      {/* Per-Visit Earnings Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Per-Service Earnings Breakdown</h2>
            <p className="text-xs text-slate-500 font-medium">
              কাজ সম্পন্ন (COMPLETED) হওয়ার পরই কেবল কমিশন ওয়ালেটে জমা হয়
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
            Real-Time Audit
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#007eff] mx-auto" />
            <p className="text-xs font-bold text-slate-500">লোড করা হচ্ছে...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 font-medium">
            এখনো কোনো সার্ভিসের রেকর্ড পাওয়া যায়নি
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assignments.map((item) => {
              const b = item.booking || {};
              const bookingRef = b.bookingRef || `#CLN-${String(item._id).slice(-4)}`;
              const customerName = b.user?.name || "Customer";
              const serviceType = b.serviceType?.title || "Cleaning Service";
              const isCompleted = item.status === "COMPLETED" || b.status === "COMPLETED";
              const cleanerCount = Array.isArray(item.assignedCleaners) && item.assignedCleaners.length > 0 ? item.assignedCleaners.length : 1;
              const individualCleanerCut = Math.round((Number(item.cleanerPoolPayout) || 0) / cleanerCount);

              return (
                <div
                  key={item._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-[#007eff] font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {bookingRef}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm">{customerName}</h3>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{serviceType}</p>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Total Service Price: ৳{Number(b.totalAmount || 0).toLocaleString()} • {cleanerCount} Cleaners Assigned
                    </span>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-auto text-right flex-wrap">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">
                        Leader 10% Cut
                      </span>
                      <span className="text-emerald-700 font-extrabold text-base">
                        +৳{Number(item.leaderCommission || 0).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">
                        Cleaner 40% Pool ({cleanerCount}x ৳{individualCleanerCut})
                      </span>
                      <span className="text-blue-700 font-extrabold text-base">
                        ৳{Number(item.cleanerPoolPayout || 0).toLocaleString()}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Credited
                      </span>
                    ) : (
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Completion
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
