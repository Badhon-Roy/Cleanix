"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  Clock,
  Star,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { fetchCleanerProfileMeAPI, ICleanerProfile } from "@/services/cleanerService";
import { fetchMyTeamAssignmentsAPI } from "@/services/teamService";

interface PayoutRecord {
  id: string;
  date: string;
  jobId: string;
  service: string;
  gross: string;
  share: string;
  net: string;
  status: "CREDITED" | "PENDING" | "PROCESSING";
}

export default function CleanerEarningsPage() {
  const [profile, setProfile] = useState<ICleanerProfile | null>(null);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);

  const loadEarningsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [profRes, assignmentsRes] = await Promise.all([
        fetchCleanerProfileMeAPI(),
        fetchMyTeamAssignmentsAPI(),
      ]);

      if (profRes) {
        setProfile(profRes);
      }

      if (Array.isArray(assignmentsRes)) {
        const cleanerIdStr = profRes?.id ? String(profRes.id) : "";
        const mappedPayouts: PayoutRecord[] = assignmentsRes.map((item: any) => {
          const booking = item.booking || {};
          const serviceType = booking.serviceType || {};
          const isCompleted = item.status === "COMPLETED" || booking.status === "COMPLETED";
          const cleanerCount = item.assignedCleaners?.length || 1;
          const poolPayout = Number(item.cleanerPoolPayout) || 0;
          const cleanerShare = Math.round(poolPayout / cleanerCount);
          const grossAmount = booking.totalAmount || (cleanerShare > 0 ? cleanerShare * 2 : 0);

          const bookingRef = booking.bookingRef || `#CLN-${String(item._id).slice(-6).toUpperCase()}`;
          const dateStr = booking.scheduledDate || item.scheduledDate || "Recent";

          return {
            id: `PAY-${bookingRef.replace(/#/g, "")}`,
            date: dateStr,
            jobId: bookingRef,
            service: serviceType.title || "Cleaning Care Visit",
            gross: `৳${grossAmount.toLocaleString()}`,
            share: cleanerCount > 1 ? `${Math.round(100 / cleanerCount)}% (Split)` : "100% Staff",
            net: `৳${cleanerShare.toLocaleString()}`,
            status: isCompleted ? "CREDITED" : "PENDING",
          };
        });

        setPayouts(mappedPayouts);
      } else {
        setPayouts([]);
      }
    } catch (err) {
      console.error("Failed to load cleaner earnings:", err);
      setPayouts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEarningsData();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("booking_updated", loadEarningsData);
    socket.on("team_assignment_updated", loadEarningsData);
    socket.on("cleaner_updated", loadEarningsData);

    return () => {
      socket.off("booking_updated");
      socket.off("team_assignment_updated");
      socket.off("cleaner_updated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loadEarningsData]);

  const totalEarnedWallet =
    profile?.dashboardStats?.totalEarnedWallet ??
    profile?.dashboardStats?.totalEstimatedEarnings ??
    0;
  const completedCount = profile?.dashboardStats?.completedCount ?? 0;
  const pendingEstimatedEarnings = profile?.dashboardStats?.pendingEstimatedEarnings ?? 0;
  const ratingValue = profile?.dashboardStats?.ratingValue ?? "0.0";
  const totalReviewsCount = profile?.dashboardStats?.totalReviewsCount ?? 0;

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
              Earnings &amp; Payout Breakdown
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ LIVE WALLET
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            সম্পন্ন করা ক্লিনিং সার্ভিসের অর্জিত পারিশ্রমিক ও সাপ্তাহিক পে-আউট স্টেটমেন্ট ট্র্যাক করুন।
          </p>
        </div>

        <button
          onClick={loadEarningsData}
          disabled={isLoading}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#007eff]" : ""}`} />
          <span>Sync Earnings</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Earned Wallet */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 border-2 border-dashed border-emerald-300 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
              অর্জিত ওয়ালেট জমা
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ৳{totalEarnedWallet.toLocaleString()}
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 inline-block">
                ✓ সম্পন্ন কাজের ব্যালেন্স
              </span>
            </div>
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 border-2 border-dashed border-blue-300 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
              সম্পন্নকৃত কাজ
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {completedCount} টি কাজ
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-blue-800 bg-blue-100/90 px-3 py-1 rounded-full border border-blue-300 inline-block">
                ✓ সফল ডিসপ্যাচ রেকর্ড
              </span>
            </div>
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 border-2 border-dashed border-amber-300 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
              চলতি কাজের পেন্ডিং আয়
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ৳{pendingEstimatedEarnings.toLocaleString()}
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 inline-block">
                ⏱ কাজ শেষ হলে যোগ হবে
              </span>
            </div>
          </div>
        </div>

        {/* Performance Rating */}
        <div className="bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 border-2 border-dashed border-purple-300 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
              গড় রেটিং স্কোর
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 stroke-[2.5] fill-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {ratingValue} <span className="text-amber-500">★</span>
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-purple-800 bg-purple-100/90 px-3 py-1 rounded-full border border-purple-300 inline-block">
                {totalReviewsCount > 0 ? `${totalReviewsCount}টি রিভিউ` : "নতুন ক্লিনার"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#007eff]" /> Recent Payout Records
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              আপনার সম্পন্ন ও চলমান কাজের বিস্তারিত পারিশ্রমিক হিসাব।
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#007eff] animate-spin mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-slate-500">পে-আউট স্টেটমেন্ট লোড হচ্ছে...</p>
          </div>
        ) : payouts.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-5">Payout Ref</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Job Ref</th>
                  <th className="p-4">Service Package</th>
                  <th className="p-4">Gross Fee</th>
                  <th className="p-4">Share</th>
                  <th className="p-4">Net Payout</th>
                  <th className="p-4 pr-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {payouts.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-5 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="p-4 text-slate-600">{row.date}</td>
                    <td className="p-4 font-mono font-bold text-[#007eff]">{row.jobId}</td>
                    <td className="p-4 font-semibold text-slate-900">{row.service}</td>
                    <td className="p-4 text-slate-600">{row.gross}</td>
                    <td className="p-4 text-slate-600 font-bold">{row.share}</td>
                    <td className="p-4 font-bold text-emerald-700">{row.net}</td>
                    <td className="p-4 pr-5 text-right">
                      {row.status === "CREDITED" ? (
                        <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Credited
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-6 text-center space-y-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <DollarSign className="w-8 h-8 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">এখনো কোনো পে-আউট রেকর্ড নেই</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                কাজ সফলভাবে সম্পন্ন হলে আপনার ওয়ালেটে আর্নিং ব্যালেন্স যুক্ত হবে এবং এখানে প্রতিটি পে-আউটের স্টেটমেন্ট দেখতে পাবেন।
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
