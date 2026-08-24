"use client";

import React, { useState } from "react";
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
  Sparkles,
  ChevronRight,
  Home,
  CheckCircle2,
} from "lucide-react";
import { SwirlLogo } from "@/components/Navbar";
import LogoutConfirmModal from "@/components/dashboard/LogoutConfirmModal";

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

  const navItems = [
    { name: "Overview & Roster", href: "/team-leader", icon: LayoutDashboard },
    { name: "Assigned Team Services", href: "/team-leader/bookings", icon: Truck, badge: "3 Active" },
    { name: "Cleaner Requests", href: "/team-leader/requests", icon: UserCheck, badge: "2 Pending" },
    { name: "Request New Bookings", href: "/team-leader/available-bookings", icon: CheckSquare, badge: "5 Open" },
    { name: "Proof of Work Monitor", href: "/team-leader/proofs", icon: FileCheck, badge: "Quality" },
    { name: "Team Wallet & Earnings", href: "/team-leader/earnings", icon: Wallet, badge: "10% Cut" },
    { name: "Admin Control HQ", href: "/admin", icon: ShieldCheck, badge: "ADMIN" },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/team-leader") return pathname === "/team-leader";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-800 w-72 p-5 flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <Link href="/team-leader" className="flex items-center gap-3 group">
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

      {/* Duty Status Quick Switcher Box - Matching Cleaner Sidebar */}
      <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-emerald-50/80 border border-blue-100 space-y-2">
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
          Team Alpha • Gulshan Hub #01 • Leader: Rahat Karim
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1.5 overflow-y-auto py-5">
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

      {/* Bottom Footer Actions - Matching Cleaner Sidebar */}
      <div className="mt-auto pt-4 border-t border-slate-100">
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
