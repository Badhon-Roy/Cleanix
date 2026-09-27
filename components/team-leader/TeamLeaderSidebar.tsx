"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  UserCheck,
  CheckSquare,
  FileCheck,
  Wallet,
  LogOut,
  X,
  ShieldCheck,
  Home,
  Star,
} from "lucide-react";
import Lenis from "lenis";
import { io } from "socket.io-client";
import { SwirlLogo } from "@/components/Navbar";
import LogoutConfirmModal from "@/components/dashboard/LogoutConfirmModal";
import { fetchMyTeamAssignmentsAPI, fetchAvailableBookingsAPI } from "@/services/teamService";
import { fetchTeamReviewsAPI } from "@/services/reviewService";
import { fetchAllCleanersAPI } from "@/services/cleanerService";
import { getAuthUser } from "@/utils/cookie";
import { slugifyTeamName } from "@/utils/slug";

interface TeamLeaderSidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function TeamLeaderSidebar({
  mobileOpen = false,
  setMobileOpen,
}: TeamLeaderSidebarProps) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(true);

  // Dynamic live count states
  const [assignedCount, setAssignedCount] = useState<number>(0);
  const [availableCount, setAvailableCount] = useState<number>(0);
  const [requestsCount, setRequestsCount] = useState<number>(0);
  const [proofsCount, setProofsCount] = useState<number>(0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollWrapperRef.current || !scrollContentRef.current) return;

    const sidebarLenis = new Lenis({
      wrapper: scrollWrapperRef.current,
      content: scrollContentRef.current,
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      sidebarLenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      sidebarLenis.destroy();
    };
  }, []);

  const teamMatch = pathname.match(/^\/team\/([^/]+)/);
  const teamSlugFromUrl = teamMatch ? teamMatch[1] : null;

  const authUser = getAuthUser();
  const authTeamSlug =
    authUser?.leadTeam?.teamSlug ||
    (authUser?.leadTeam?.teamName ? slugifyTeamName(authUser.leadTeam.teamName) : null);

  const effectiveSlug = teamSlugFromUrl || authTeamSlug || "";

  // 1. Sync Assigned Services & Proofs Count
  const loadAssignmentsCount = useCallback(async () => {
    try {
      const data = await fetchMyTeamAssignmentsAPI(effectiveSlug);
      if (Array.isArray(data)) {
        const seen = new Set<string>();
        let proofsPending = 0;

        const unique = data.filter((item) => {
          if (!item.booking) return false;
          const bKey = item.booking?.bookingRef || item.booking?._id || item._id;
          if (seen.has(bKey)) return false;
          seen.add(bKey);

          // Check if proof is pending review
          if (item.status === "IN_PROGRESS" || item.status === "COMPLETED") {
            proofsPending++;
          }
          return true;
        });

        setAssignedCount(unique.length);
        setProofsCount(proofsPending);
      }
    } catch (err) {
      console.error("Error fetching assignments count for sidebar:", err);
    }
  }, [effectiveSlug]);

  // 2. Sync Available Bookings Count
  const loadAvailableCount = useCallback(async () => {
    try {
      const available = await fetchAvailableBookingsAPI();
      if (Array.isArray(available)) {
        setAvailableCount(available.length);
      }
    } catch (err) {
      console.error("Error fetching available count for sidebar:", err);
    }
  }, []);

  // 3. Sync Cleaner Requests Count
  const loadRequestsCount = useCallback(async () => {
    try {
      const cleaners = await fetchAllCleanersAPI("PENDING_APPROVAL");
      if (Array.isArray(cleaners)) {
        setRequestsCount(cleaners.length);
      }
    } catch (err) {
      console.error("Error fetching requests count for sidebar:", err);
    }
  }, []);

  // 4. Sync Reviews Count for THIS team squad only
  const loadReviewsCount = useCallback(async () => {
    if (!effectiveSlug) return;
    try {
      const reviews = await fetchTeamReviewsAPI(effectiveSlug);
      if (Array.isArray(reviews)) {
        setReviewsCount(reviews.length);
      } else {
        setReviewsCount(0);
      }
    } catch (err) {
      console.error("Error fetching reviews count for sidebar:", err);
    }
  }, [effectiveSlug]);

  // Sync all live counts
  const syncAllLeaderCounts = useCallback(() => {
    loadAssignmentsCount();
    loadAvailableCount();
    loadRequestsCount();
    loadReviewsCount();
  }, [loadAssignmentsCount, loadAvailableCount, loadRequestsCount, loadReviewsCount]);

  // Real-time Socket.IO Live Data Synchronization
  useEffect(() => {
    syncAllLeaderCounts();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("booking_created", () => {
      loadAvailableCount();
      loadAssignmentsCount();
    });

    socket.on("booking_updated", () => {
      loadAssignmentsCount();
      loadAvailableCount();
    });

    socket.on("team_assignment_updated", loadAssignmentsCount);
    socket.on("team_updated", loadAssignmentsCount);

    socket.on("leader_request_updated", loadRequestsCount);
    socket.on("cleaner_updated", loadRequestsCount);

    socket.on("review_created", loadReviewsCount);
    socket.on("review_updated", loadReviewsCount);

    return () => {
      socket.off("booking_created");
      socket.off("booking_updated");
      socket.off("team_assignment_updated");
      socket.off("team_updated");
      socket.off("leader_request_updated");
      socket.off("cleaner_updated");
      socket.off("review_created");
      socket.off("review_updated");
      socket.disconnect();
    };
  }, [syncAllLeaderCounts, loadAssignmentsCount, loadAvailableCount, loadRequestsCount, loadReviewsCount]);

  const isUserAdmin = authUser?.role === "ADMIN" || authUser?.role === "SUPER_ADMIN";

  const navItems = [
    { name: "Overview & Roster", key: "", icon: LayoutDashboard },
    { name: "My Team Squad", key: "my-team", icon: Users, badge: "Squad" },
    {
      name: "Assigned Team Services",
      key: "bookings",
      icon: Truck,
      badge: assignedCount > 0 ? `${assignedCount} Active` : "0 Active",
      isUrgent: assignedCount > 0,
    },
    {
      name: "Cleaner Requests",
      key: "requests",
      icon: UserCheck,
      badge: requestsCount > 0 ? `${requestsCount}` : "0",
      isUrgent: requestsCount > 0,
    },
    {
      name: "Request New Bookings",
      key: "available-bookings",
      icon: CheckSquare,
      badge: availableCount > 0 ? `${availableCount} Available` : "0 Available",
    },
    {
      name: "Proof of Work Monitor",
      key: "proofs",
      icon: FileCheck,
      badge: proofsCount > 0 ? `${proofsCount} Active` : "Quality",
    },
    {
      name: "Squad Reviews & Ratings",
      key: "reviews",
      icon: Star,
      badge: reviewsCount > 0 ? `${reviewsCount} Ratings` : "0 Ratings",
    },
    { name: "Team Wallet & Earnings", key: "earnings", icon: Wallet, badge: "10% Cut" },
    ...(isUserAdmin ? [{ name: "Admin Control HQ", key: "/admin", icon: ShieldCheck, badge: "ADMIN" }] : []),
  ];

  const getNavHref = (key: string) => {
    if (key === "/admin") return "/admin";
    if (!key) return `/team/${effectiveSlug}`;
    return `/team/${effectiveSlug}/${key}`;
  };

  const checkIsActive = (key: string) => {
    if (key === "/admin") return pathname === "/admin";
    const targetHref = getNavHref(key);
    if (!key) return pathname === targetHref;
    return pathname.startsWith(targetHref);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full max-h-screen bg-white border-r border-slate-200 text-slate-800 w-72 p-5 flex-shrink-0 select-none overflow-hidden">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 flex-shrink-0">
        <Link href={getNavHref("")} className="flex items-center gap-3 group">
          <SwirlLogo />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#0d274c] group-hover:text-[#007eff] transition-colors">
                Cleanix
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                TEAM LEADER
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Field Operations HQ</p>
          </div>
        </Link>
      </div>

      {/* Duty Status Quick Switcher Box */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-emerald-50/80 border border-blue-100 space-y-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnDuty ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            Dispatch Status
          </span>
          <button
            type="button"
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
              isOnDuty
                ? "bg-emerald-500 text-white border-emerald-600"
                : "bg-slate-200 text-slate-700 border-slate-300"
            }`}
          >
            {isOnDuty ? "ONLINE / ACTIVE" : "OFFLINE"}
          </button>
        </div>
        <p className="text-xs text-slate-600 font-medium leading-snug">
          Squad Slug: <span className="font-extrabold text-blue-600">{effectiveSlug}</span>
        </p>
      </div>

      {/* Navigation Links with Lenis Smooth Scrolling */}
      <div
        ref={scrollWrapperRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        className="flex-1 min-h-0 overflow-y-auto py-4 pr-1 mt-2 overscroll-contain select-none"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        <div ref={scrollContentRef} className="space-y-1.5 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.key);

            return (
              <Link
                key={item.name}
                href={getNavHref(item.key)}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                  isActive
                    ? "bg-[#007eff] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 transition-all ${
                      item.isUrgent
                        ? isActive
                          ? "bg-white text-red-600 font-extrabold shadow-xs"
                          : "bg-red-500 text-white shadow-xs animate-pulse font-black"
                        : isActive
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Main Website</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            title="Log Out Leader Portal"
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          window.location.href = "/";
        }}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-white h-full shadow-2xl z-10">
            <button
              type="button"
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
