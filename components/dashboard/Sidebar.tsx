"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { SwirlLogo } from "@/components/Navbar";

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck, badge: "Live" },
    { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard, badge: "Standard" },
    { name: "New Booking", href: "/dashboard/new-booking", icon: PlusCircle, highlight: true },
    { name: "Invoices & Receipts", href: "/dashboard/invoices", icon: FileText },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: "3" },
    { name: "Account Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-800 w-72 p-5 flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
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

      {/* Navigation Links */}
      <div className="flex-1 space-y-1.5 overflow-y-auto py-6">
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

      {/* Subscription Summary Card (Light Theme) */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Standard Plan
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-[#007eff] h-full w-3/4 rounded-full" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-600 font-bold">
            <span>Visits: 3 of 4 used</span>
            <span className="text-[#007eff]">75%</span>
          </div>
        </div>

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
            onClick={() => alert("Logged out successfully")}
            title="Log out"
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors"
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
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
