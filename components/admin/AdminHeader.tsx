"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Menu,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronDown,
  Settings,
  ShieldCheck,
  Sparkles,
  Sliders,
  FileText,
} from "lucide-react";
import LogoutConfirmModal from "@/components/dashboard/LogoutConfirmModal";

interface AdminHeaderProps {
  onMobileMenuClick?: () => void;
}

export default function AdminHeader({ onMobileMenuClick }: AdminHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mock Admin Notifications
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: "New Job Application",
      message: "Cleaner Rahat Karim applied for CLN-2026-8894 (Dhanmondi)",
      time: "2 mins ago",
      type: "application",
      unread: true,
    },
    {
      id: 2,
      title: "New Booking Created",
      message: "Tanvir Hasan booked VIP Deep Cleaning (Gulshan-2)",
      time: "15 mins ago",
      type: "booking",
      unread: true,
    },
    {
      id: 3,
      title: "Proof of Work Submitted",
      message: "Supervisor Selim Reza uploaded photos for CLN-2026-8891",
      time: "1 hour ago",
      type: "proof",
      unread: false,
    },
  ]);

  const unreadCount = notificationsList.filter((n) => n.unread).length;

  const markNotificationAsRead = (id: number) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Bookings, Cleaners, Customers by ID or Phone..."
            className="w-full bg-slate-100/80 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: Dispatch Hotline, System Alerts, Admin Avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dispatch Hotline Badge */}
        <a
          href="tel:+8801700999888"
          className="hidden md:flex items-center gap-2 text-xs font-black text-[#007eff] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-2xl border border-blue-200 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#007eff] animate-pulse" />
          <span>Hotline: +880 1700-999888</span>
        </a>

        {/* System Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
            className="relative p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#007eff] text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl p-4 shadow-2xl z-40 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">System Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-[#007eff] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {notificationsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markNotificationAsRead(item.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      item.unread
                        ? "bg-blue-50/80 border-blue-200 border-l-4 border-l-[#007eff]"
                        : "bg-slate-50 border-slate-200 opacity-80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{item.title}</span>
                      <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{item.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <Link
                  href="/admin/bookings"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-extrabold text-[#007eff] hover:underline"
                >
                  View All Admin Logs ➔
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin User Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#007eff] text-white flex items-center justify-center font-black text-xs">
              AD
            </div>
            <div className="hidden sm:block text-left pr-1">
              <p className="text-xs font-black text-slate-900 leading-none">Super Admin</p>
              <p className="text-[10px] text-[#007eff] font-bold mt-0.5">HQ Controller</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-3xl p-2 shadow-2xl z-40 text-xs font-bold space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 border-b border-slate-100 space-y-0.5">
                <p className="text-slate-900 font-extrabold">Cleanix Super Admin</p>
                <p className="text-[11px] text-slate-500 font-medium">admin@cleanix.com</p>
              </div>

              <Link
                href="/admin/content"
                onClick={() => setUserMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-[#007eff] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#007eff]" />
                <span>Dynamic Content CMS</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setUserMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>System Settings</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out Admin</span>
              </button>
            </div>
          )}
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
    </header>
  );
}
