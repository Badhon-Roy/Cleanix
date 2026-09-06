"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { fetchAllCleanersAPI } from "@/services/cleanerService";

interface AdminSidebarClientViewProps {
  initialPendingCount?: number;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function AdminSidebarClientView({
  initialPendingCount = 0,
  mobileOpen = false,
  setMobileOpen,
}: AdminSidebarClientViewProps) {
  const pathname = usePathname();
  const [pendingCleanerCount, setPendingCleanerCount] = useState<number>(initialPendingCount);

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

  // Fetch pending cleaner requests count
  const loadPendingCount = async () => {
    try {
      const cleaners = await fetchAllCleanersAPI("PENDING_APPROVAL");
      setPendingCleanerCount(cleaners.length);
    } catch (err) {
      console.error("Failed to load pending cleaner count for sidebar:", err);
    }
  };

  // Real-time Socket.IO Live Data Synchronization for Sidebar Badge
  useEffect(() => {
    loadPendingCount();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("cleaner_updated", () => {
      loadPendingCount();
    });

    socket.on("team_updated", () => {
      loadPendingCount();
    });

    socket.on("leader_request_updated", () => {
      loadPendingCount();
    });

    socket.on("leader_appointment_updated", () => {
      loadPendingCount();
    });

    return () => {
      socket.off("cleaner_updated");
      socket.off("team_updated");
      socket.off("leader_request_updated");
      socket.off("leader_appointment_updated");
      socket.disconnect();
    };
  }, []);

  const navItems = [
    { name: "Overview & KPIs", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings & Dispatch", href: "/admin/bookings", icon: Truck, badge: "12 Pending" },
    { name: "Reviews & Ratings", href: "/admin/reviews", icon: Star, badge: "Moderation" },
    { name: "Teams & Squads", href: "/admin/teams", icon: Users, badge: "4 Squads" },
    {
      name: "Cleaner Requests",
      href: "/admin/cleaner-requests",
      icon: Clock,
      badge: pendingCleanerCount > 0 ? `${pendingCleanerCount}` : "0",
      isUrgent: pendingCleanerCount > 0,
    },
    { name: "Cleaners & Staff", href: "/admin/cleaners", icon: UserCheck, badge: "Staff CRM" },
    { name: "Coverage Areas", href: "/admin/coverage", icon: MapPin, badge: "10 Zones" },
    { name: "Contact Messages", href: "/admin/messages", icon: MessageSquare, badge: "2 New" },
    { name: "Projects Portfolio", href: "/admin/projects", icon: FileText, badge: "4" },
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
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-150 gap-2 ${
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

                {item.badge && (
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
