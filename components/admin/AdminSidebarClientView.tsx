"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  UserCheck,
  Sliders,
  FileText,
  Users,
  TrendingUp,
  Settings,
  X,
  MessageSquare,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import { io } from "socket.io-client";
import Lenis from "lenis";
import { fetchAdminBookingsAPI } from "@/services/bookingService";
import { fetchReviewsAPI } from "@/services/reviewService";
import { fetchAllTeamsAPI } from "@/services/teamService";
import { fetchAllCleanersAPI as fetchCleanersByRoleAPI } from "@/services/cleanerService";
import { fetchAllCoveragesAPI } from "@/services/coverageService";
import { fetchAllContactsAPI } from "@/services/contactService";
import { fetchProjectsAPI } from "@/services/projectService";

interface AdminSidebarClientViewProps {
  initialPendingCount?: number;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

interface IAdminSidebarCounts {
  pendingBookings: number;
  pendingReviews: number;
  totalReviews: number;
  totalSquads: number;
  pendingCleaners: number;
  totalCleaners: number;
  coverageZones: number;
  newContactMessages: number;
  projectsCount: number;
}

export default function AdminSidebarClientView({
  initialPendingCount = 0,
  mobileOpen = false,
  setMobileOpen,
}: AdminSidebarClientViewProps) {
  const pathname = usePathname();

  // Dynamic live counts state
  const [counts, setCounts] = useState<IAdminSidebarCounts>({
    pendingBookings: 0,
    pendingReviews: 0,
    totalReviews: 0,
    totalSquads: 0,
    pendingCleaners: initialPendingCount,
    totalCleaners: 0,
    coverageZones: 0,
    newContactMessages: 0,
    projectsCount: 0,
  });

  // Dedicated Lenis instance refs for ultra-smooth sidebar scrolling
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis smooth scroll on the sidebar navigation container
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

  // 1. Sync Bookings Count (Pending Bookings)
  const syncBookings = useCallback(async () => {
    try {
      const res = await fetchAdminBookingsAPI();
      if (res?.success && Array.isArray(res?.data)) {
        const pending = res.data.filter(
          (b: any) => (b.status || "").toUpperCase() === "PENDING"
        ).length;
        setCounts((prev) => ({ ...prev, pendingBookings: pending }));
      }
    } catch (err) {
      console.error("Failed to sync bookings count:", err);
    }
  }, []);

  // 2. Sync Reviews Count (Moderation / Pending Approval)
  const syncReviews = useCallback(async () => {
    try {
      const allReviews = await fetchReviewsAPI();
      if (Array.isArray(allReviews)) {
        const pending = allReviews.filter((r) => r.isApproved === false).length;
        setCounts((prev) => ({
          ...prev,
          pendingReviews: pending,
          totalReviews: allReviews.length,
        }));
      }
    } catch (err) {
      console.error("Failed to sync reviews count:", err);
    }
  }, []);

  // 3. Sync Teams Count
  const syncTeams = useCallback(async () => {
    try {
      const squads = await fetchAllTeamsAPI();
      if (Array.isArray(squads)) {
        setCounts((prev) => ({ ...prev, totalSquads: squads.length }));
      }
    } catch (err) {
      console.error("Failed to sync teams count:", err);
    }
  }, []);

  // 4. Sync Cleaners Count (Pending Requests & Total Active Staff)
  const syncCleaners = useCallback(async () => {
    try {
      const [pendingList, allList] = await Promise.all([
        fetchCleanersByRoleAPI("PENDING_APPROVAL"),
        fetchCleanersByRoleAPI(),
      ]);
      setCounts((prev) => ({
        ...prev,
        pendingCleaners: Array.isArray(pendingList) ? pendingList.length : 0,
        totalCleaners: Array.isArray(allList) ? allList.length : 0,
      }));
    } catch (err) {
      console.error("Failed to sync cleaners count:", err);
    }
  }, []);

  // 5. Sync Coverage Zones Count
  const syncCoverage = useCallback(async () => {
    try {
      const zones = await fetchAllCoveragesAPI();
      if (Array.isArray(zones)) {
        const activeZones = zones.filter((z) => z.isActive !== false);
        setCounts((prev) => ({ ...prev, coverageZones: activeZones.length }));
      }
    } catch (err) {
      console.error("Failed to sync coverage count:", err);
    }
  }, []);

  // 6. Sync Contact Messages Count (NEW status)
  const syncContacts = useCallback(async () => {
    try {
      const msgs = await fetchAllContactsAPI();
      if (Array.isArray(msgs)) {
        const newMsgs = msgs.filter((m) => (m.status || "").toUpperCase() === "NEW");
        setCounts((prev) => ({ ...prev, newContactMessages: newMsgs.length }));
      }
    } catch (err) {
      console.error("Failed to sync contacts count:", err);
    }
  }, []);

  // 7. Sync Projects Count
  const syncProjects = useCallback(async () => {
    try {
      const res = await fetchProjectsAPI();
      if (res?.success && Array.isArray(res?.data)) {
        setCounts((prev) => ({ ...prev, projectsCount: res.data.length }));
      }
    } catch (err) {
      console.error("Failed to sync projects count:", err);
    }
  }, []);

  // Sync All Counts in Parallel on Mount
  const syncAllCounts = useCallback(() => {
    syncBookings();
    syncReviews();
    syncTeams();
    syncCleaners();
    syncCoverage();
    syncContacts();
    syncProjects();
  }, [
    syncBookings,
    syncReviews,
    syncTeams,
    syncCleaners,
    syncCoverage,
    syncContacts,
    syncProjects,
  ]);

  // Real-time Socket.IO Live Data Synchronization for All Sidebar Badges
  useEffect(() => {
    syncAllCounts();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    // Live Socket Event Handlers
    socket.on("booking_created", syncBookings);
    socket.on("booking_updated", syncBookings);
    socket.on("team_assignment_updated", () => {
      syncBookings();
      syncTeams();
    });

    socket.on("review_created", syncReviews);
    socket.on("review_updated", syncReviews);

    socket.on("team_updated", syncTeams);

    socket.on("cleaner_updated", syncCleaners);
    socket.on("leader_request_updated", () => {
      syncCleaners();
      syncTeams();
    });
    socket.on("leader_appointment_updated", syncCleaners);

    socket.on("coverage_updated", syncCoverage);

    socket.on("contact_created", syncContacts);
    socket.on("contact_updated", syncContacts);

    socket.on("gallery_updated", syncProjects);
    socket.on("cms_updated", syncProjects);

    return () => {
      socket.off("booking_created", syncBookings);
      socket.off("booking_updated", syncBookings);
      socket.off("team_assignment_updated");
      socket.off("review_created", syncReviews);
      socket.off("review_updated", syncReviews);
      socket.off("team_updated", syncTeams);
      socket.off("cleaner_updated", syncCleaners);
      socket.off("leader_request_updated");
      socket.off("leader_appointment_updated");
      socket.off("coverage_updated", syncCoverage);
      socket.off("contact_created", syncContacts);
      socket.off("contact_updated", syncContacts);
      socket.off("gallery_updated", syncProjects);
      socket.off("cms_updated", syncProjects);
      socket.disconnect();
    };
  }, [
    syncAllCounts,
    syncBookings,
    syncReviews,
    syncTeams,
    syncCleaners,
    syncCoverage,
    syncContacts,
    syncProjects,
  ]);

  const navItems = [
    { name: "Overview & KPIs", href: "/admin", icon: LayoutDashboard },
    {
      name: "Bookings & Dispatch",
      href: "/admin/bookings",
      icon: Truck,
      badge:
        counts.pendingBookings > 0
          ? `${counts.pendingBookings} Pending`
          : "0 Pending",
      isUrgent: counts.pendingBookings > 0,
    },
    {
      name: "Reviews & Ratings",
      href: "/admin/reviews",
      icon: Star,
      badge:
        counts.pendingReviews > 0
          ? `${counts.pendingReviews} New`
          : counts.totalReviews > 0
          ? `${counts.totalReviews} Total`
          : "0 Reviews",
      isUrgent: counts.pendingReviews > 0,
    },
    {
      name: "Teams & Squads",
      href: "/admin/teams",
      icon: Users,
      badge: `${counts.totalSquads} ${counts.totalSquads === 1 ? "Squad" : "Squads"}`,
    },
    {
      name: "Cleaner Requests",
      href: "/admin/cleaner-requests",
      icon: Clock,
      badge: `${counts.pendingCleaners}`,
      isUrgent: counts.pendingCleaners > 0,
    },
    {
      name: "Cleaners & Staff",
      href: "/admin/cleaners",
      icon: UserCheck,
      badge: `${counts.totalCleaners} Staff`,
    },
    {
      name: "Coverage Areas",
      href: "/admin/coverage",
      icon: MapPin,
      badge: `${counts.coverageZones} ${counts.coverageZones === 1 ? "Zone" : "Zones"}`,
    },
    {
      name: "Contact Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      badge:
        counts.newContactMessages > 0
          ? `${counts.newContactMessages} New`
          : "0 New",
      isUrgent: counts.newContactMessages > 0,
    },
    {
      name: "Projects Portfolio",
      href: "/admin/projects",
      icon: FileText,
      badge: `${counts.projectsCount}`,
    },
    { name: "Services & Pricing", href: "/admin/services", icon: Sliders },
    { name: "Dynamic Content CMS", href: "/admin/content", icon: FileText, badge: "CMS" },
    { name: "Customers & Plans", href: "/admin/customers", icon: Users },
    { name: "Revenue Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full max-h-screen bg-white border-r border-slate-200 text-slate-800 w-72 p-5 flex-shrink-0 select-none overflow-hidden">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-3 group">
          {/* Swirl Logo */}
          <div className="relative w-10 h-10 rounded-2xl bg-[#007eff] text-white flex items-center justify-center font-black text-xl shadow-xs">
            C
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#0d274c] group-hover:text-[#007eff] transition-colors">
                Cleanix
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
                ADMIN HQ
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Platform Control Center</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links with Lenis Smooth Scrolling Container */}
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
        <div ref={scrollContentRef} className="space-y-1.5 pb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-150 gap-2 ${
                  isActive
                    ? "bg-[#007eff] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 stroke-[2.5] flex-shrink-0 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 transition-all ${
                      item.isUrgent
                        ? isActive
                          ? "bg-white text-red-600 font-extrabold shadow-xs"
                          : "bg-red-500 text-white shadow-xs animate-pulse font-black"
                        : isActive
                        ? "bg-white text-[#007eff] shadow-xs"
                        : "bg-blue-50 text-[#007eff] border border-blue-200"
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
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-20 flex-shrink-0 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen?.(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-white h-full shadow-2xl z-10 overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileOpen?.(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer z-20"
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
