"use client";

import React, { useState } from "react";
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
  LogOut,
  X,
  ShieldAlert,
  Activity,
  Sparkles,
  MessageSquare,
  MapPin,
  Info,
} from "lucide-react";
import LogoutConfirmModal from "@/components/dashboard/LogoutConfirmModal";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function AdminSidebar({
  mobileOpen = false,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [systemHealth, setSystemHealth] = useState("ONLINE");

  const navItems = [
    { name: "Overview & KPIs", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings & Dispatch", href: "/admin/bookings", icon: Truck, badge: "12 Pending" },
    { name: "Coverage Areas", href: "/admin/coverage", icon: MapPin, badge: "10 Zones" },
    { name: "Contact Messages", href: "/admin/messages", icon: MessageSquare, badge: "2 New" },
    { name: "Projects Portfolio", href: "/admin/projects", icon: FileText, badge: "4" },
    { name: "Cleaners & Staff", href: "/admin/cleaners", icon: UserCheck, badge: "16 Active" },
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
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-800 w-72 p-5 flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
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

      {/* System Health Status Indicator Box */}
      <div className="mt-5 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            System Status
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white border border-emerald-600">
            ONLINE
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium leading-snug">
          4 Hubs Active • MongoDB Connected • Dispatch Engine Running
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1.5 overflow-y-auto py-5">
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
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                    isActive
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

      {/* Admin Profile Footer & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#007eff] text-white flex items-center justify-center font-extrabold text-sm">
              AD
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900 leading-none">Super Admin</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">admin@cleanix.com</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Log Out Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Render Portal Logout Confirm Modal */}
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
      <aside className="hidden lg:block h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen?.(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-white h-full shadow-2xl z-10">
            <button
              type="button"
              onClick={() => setMobileOpen?.(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
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
