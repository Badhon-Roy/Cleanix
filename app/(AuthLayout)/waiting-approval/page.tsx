"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  LogOut,
  RefreshCw,
  HelpCircle,
  ArrowLeft,
  Home as HomeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { SwirlLogo } from "@/components/Navbar";
import { getAuthUser, setAuthUser, logoutUser } from "@/utils/cookie";
import { fetchUserProfileAPI } from "@/services/authService";

export default function WaitingApprovalPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    dob?: string;
    gender?: string;
    role?: string;
    status?: string;
    isApproved?: boolean;
  } | null>(null);

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    try {
      const storedUser = getAuthUser();
      if (storedUser) {
        setUser(storedUser);

        // If approved by admin, allow access to cleaner portal
        if (storedUser.isApproved || storedUser.status === "APPROVED") {
          router.push("/cleaner");
        }
      }
    } catch (e) {
      console.log("Error reading user session", e);
    }
  }, [router]);

  // Check Live Admin Approval Status from Backend API
  const handleCheckApprovalStatus = async () => {
    setIsChecking(true);

    try {
      const res = await fetchUserProfileAPI();
      const dbUser = res?.data?.user || res?.data;

      if (res?.success && dbUser) {
        const isApproved = dbUser.isApproved === true || dbUser.status === "APPROVED";

        if (isApproved) {
          const updatedUser = {
            ...user,
            ...dbUser,
            status: "APPROVED",
            isApproved: true,
          };
          setAuthUser(updatedUser);
          setUser(updatedUser);
          toast.success(res?.message || "Cleaner account is approved and active!");
          setTimeout(() => {
            router.push("/cleaner");
          }, 1200);
          return;
        }

        toast.info(res?.message || "Your Cleaner application has been submitted and is currently pending Admin approval.");
        return;
      }

      toast.info(res?.message || "Your Cleaner application has been submitted and is currently pending Admin approval.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch approval status from server.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    logoutUser("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Top Navigation */}
      <header className="flex items-center justify-between py-2 mb-4 lg:mb-6">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <SwirlLogo />
          <div className="flex flex-col">
            <span className="text-[#11233F] text-2xl font-bold tracking-tight group-hover:text-[#007eff] transition-colors">
              Cleanix
            </span>
            <span className="text-[10px] uppercase tracking-wider text-blue-600 font-semibold -mt-1">
              Field Staff Verification
            </span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center my-auto py-6">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-300/30 relative text-center space-y-6">
            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            {/* Hourglass Animated Icon */}
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto shadow-sm">
              <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
            </div>

            {/* Status Information Header */}
            <div className="space-y-2">
              {/* Waiting Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Waiting For Admin Approval</span>
              </div>

              {/* Clean Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11233F] tracking-tight">
                Application Under Review
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                আপনার ক্লিনার নিবন্ধন আবেদনটি জমা হয়েছে। সিকিউরিটি ও সার্ভিস কোয়ালিটি নিশ্চিত করতে অ্যাডমিন আপনার তথ্য যাচাই করছেন। অ্যাডমিন অনুমোদন দিলে অ্যাকাউন্ট সচল হবে।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Live Admin Approval Status Check Button */}
              <button
                onClick={handleCheckApprovalStatus}
                disabled={isChecking}
                className="w-full bg-gradient-to-r from-[#007eff] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isChecking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Checking Status...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Check Approval Status</span>
                  </>
                )}
              </button>

              {/* Back to Home Button inside Card */}
              <Link
                href="/"
                className="w-full bg-slate-100 hover:bg-slate-200 text-[#11233F] font-bold py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <HomeIcon className="w-4 h-4 text-[#007eff]" />
                <span>Return to Cleanix Homepage</span>
              </Link>

              {/* Card Footer Links */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <Link
                  href="/contact"
                  className="text-slate-500 hover:text-[#11233F] font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Contact Support Team</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Log into another account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
