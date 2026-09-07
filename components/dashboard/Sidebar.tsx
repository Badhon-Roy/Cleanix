"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutConfirmModal from "@/components/dashboard/LogoutConfirmModal";
import Lenis from "lenis";
import { io } from "socket.io-client";
import { fetchMyBookingsAPI } from "@/services/bookingService";
import { fetchMySubscriptionsAPI } from "@/services/subscriptionService";
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  Home,
  Bell,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { SwirlLogo } from "@/components/Navbar";

interface SidebarProps {
  user?: any;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ user, mobileOpen: externalMobileOpen = false, setMobileOpen: externalSetMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [activeBookingsCount, setActiveBookingsCount] = useState<number>(0);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);

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

  const isMobileOpen = externalSetMobileOpen ? externalMobileOpen : internalMobileOpen;
  const setMobileOpen = externalSetMobileOpen || setInternalMobileOpen;

  const loadUserBookings = async () => {
    try {
      const res = await fetchMyBookingsAPI();
      if (res?.success && Array.isArray(res?.data)) {
        const active = res.data.filter((b: any) => {
          const st = (b.status || "").toUpperCase();
          return st !== "CANCELLED" && st !== "REJECTED";
        }).length;
        setActiveBookingsCount(active);
      }
    } catch (err) {
      console.error("Failed to load user bookings for sidebar:", err);
    }
  };

  const loadUserSubscriptions = async () => {
    try {
      const res = await fetchMySubscriptionsAPI();
      if (res?.success && Array.isArray(res?.data)) {
        const active = res.data.find(
          (s: any) => (s.status || "").toUpperCase() === "ACTIVE" && !s.isDeleted
        );
        setActiveSubscription(active || null);
      } else {
        setActiveSubscription(null);
      }
    } catch (err) {
      console.error("Failed to load user subscriptions for sidebar:", err);
    }
  };

  useEffect(() => {
    loadUserBookings();
    loadUserSubscriptions();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("booking_created", loadUserBookings);
    socket.on("booking_updated", loadUserBookings);
    socket.on("team_assignment_updated", loadUserBookings);
    socket.on("subscription_created", loadUserSubscriptions);
    socket.on("subscription_updated", loadUserSubscriptions);

    return () => {
      socket.off("booking_created");
      socket.off("booking_updated");
      socket.off("team_assignment_updated");
      socket.off("subscription_created");
      socket.off("subscription_updated");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleToggle = () => {
      setInternalMobileOpen((prev) => !prev);
    };
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "My Bookings",
      href: "/dashboard/bookings",
      icon: CalendarCheck,
      badge: activeBookingsCount > 0 ? `${activeBookingsCount} Active` : "0 Active",
    },
    {
      name: "Subscription",
      href: "/dashboard/subscription",
      icon: CreditCard,
      badge: activeSubscription
        ? activeSubscription.planTitle || activeSubscription.planId || "Active"
        : undefined,
    },
    { name: "New Booking", href: "/dashboard/new-booking", icon: PlusCircle, highlight: true },
    { name: "Invoices & Receipts", href: "/dashboard/invoices", icon: FileText },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Account Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full max-h-screen bg-white border-r border-slate-200 text-slate-800 w-72 p-5 flex-shrink-0 select-none overflow-hidden">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <SwirlLogo />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#0d274c] group-hover:text-[#007eff] transition-colors">
                Cleanix
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Customer Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links with Lenis Smooth Scrolling */}
      <div
        ref={scrollWrapperRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        className="flex-1 min-h-0 overflow-y-auto py-5 pr-1 overscroll-contain select-none"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        <div ref={scrollContentRef} className="space-y-1.5 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                  isActive
                    ? "bg-[#007eff] text-white"
                    : item.highlight
                    ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : item.highlight ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
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

      {/* Subscription Summary Card (Light Theme) */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex-shrink-0">
        {activeSubscription ? (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="truncate">{activeSubscription.planTitle || activeSubscription.planId || "Standard"} Plan</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                Active
              </span>
            </div>
            {(() => {
              const totalVisits = activeSubscription.totalVisitsPerMonth || 4;
              const remainingVisits = activeSubscription.remainingVisits ?? totalVisits;
              const usedVisits = activeSubscription.usedVisits ?? (totalVisits - remainingVisits);
              const percentDone = totalVisits > 0 ? Math.round((usedVisits / totalVisits) * 100) : 0;
              return (
                <>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-[#007eff] h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentDone}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                    <span>Visits: {usedVisits} of {totalVisits} used</span>
                    <span className="text-[#007eff]">{percentDone}%</span>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-500" /> Subscription Plan
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                No Plan
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mb-2.5 leading-snug">
              Subscribe for scheduled monthly visits & extra savings.
            </p>
            <Link
              href="/dashboard/subscription"
              className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-blue-50 text-[#007eff] font-bold text-[11px] flex items-center justify-center gap-1 border border-blue-200 transition-colors shadow-2xs"
            >
              <span>Choose Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Back to Public Site */}
        <div className="mt-3 flex items-center gap-2">
          <Link
            href="/"
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Main Website</span>
          </Link>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            title="Log out"
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}

      {/* Logout Confirmation Popup Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          alert("Logged out successfully!");
        }}
      />
    </>
  );
}
