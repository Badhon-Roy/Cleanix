"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import LogoutConfirmModal from "@/components/dashboard/LogoutConfirmModal";
import {
  Bell,
  Search,
  Plus,
  Menu,
  User,
  ShieldAlert,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import Image from "next/image";

interface DashboardHeaderProps {
  user?: any;
  onToggleMobileMenu?: () => void;
}

export default function DashboardHeader({ user, onToggleMobileMenu }: DashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const avatarSrc = user?.avatar || user?.profile?.avatar;
  const userName = user?.name || "Customer";
  const userEmail = user?.email || "";
  const userInitials = userName.slice(0, 2).toUpperCase();

  // Close dropdowns automatically when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Cleaner Team Dispatched",
      desc: "Team Delta led by Rahat Karim is en route to Gulshan-2.",
      time: "10 mins ago",
      type: "info",
      unread: true,
    },
    {
      id: 2,
      title: "Invoice PDF Generated",
      desc: "Invoice for Booking #CLN-2026-8891 (৳14,000) is ready.",
      time: "2 hours ago",
      type: "success",
      unread: true,
    },
    {
      id: 3,
      title: "Subscription Renewal Notice",
      desc: "Standard Plan renews in 5 days.",
      time: "Yesterday",
      type: "warning",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between text-slate-800">
      {/* Left Area: Mobile Menu Toggle & Title/Search */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1">
        <button
          onClick={() => {
            if (onToggleMobileMenu) {
              onToggleMobileMenu();
            } else if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("toggle-mobile-sidebar"));
            }
          }}
          className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
          aria-label="Toggle mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search booking #, service name, or invoice..."
            className="w-full bg-slate-100 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Area: Actions, Hotline, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Support Hotline Badge */}
        <a
          href="tel:+8801700000000"
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
          <span>Hotline: +880 1700-000000</span>
        </a>

        {/* "+ New Booking" CTA */}
        <Link
          href="/dashboard/new-booking"
          className="bg-[#007eff] hover:bg-[#0066ee] text-white text-xs font-extrabold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Book Service</span>
        </Link>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
            className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors focus:outline-none cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#007eff] animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#007eff]" /> Notifications
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    3 New
                  </span>
                </div>
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-[#007eff] hover:underline font-bold"
                >
                  Clear All
                </Link>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href="/dashboard/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className={`block p-3.5 hover:bg-blue-50/50 transition-colors ${
                      n.unread ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 rounded-xl bg-blue-100 text-[#007eff] flex-shrink-0">
                        {n.type === "info" ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                          {n.unread && (
                            <span className="w-2 h-2 rounded-full bg-[#007eff]" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.time}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer View All Link */}
              <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-[#007eff] hover:bg-blue-100/70 font-bold px-4 py-2 rounded-xl border border-blue-200/80 inline-flex items-center justify-center gap-1.5 transition-all w-full"
                >
                  <span>View All Notifications</span>
                  <span>➔</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#007eff] flex items-center justify-center font-extrabold text-xs text-white overflow-hidden flex-shrink-0 shadow-sm border border-blue-400/40">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={userName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitials
              )}
            </div>
            <span className="hidden md:inline text-xs font-extrabold text-slate-800 max-w-[120px] truncate">
              {userName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                <p className="font-extrabold text-slate-900 text-sm truncate">{userName}</p>
                {userEmail && <p className="text-slate-500 text-[11px] truncate">{userEmail}</p>}
              </div>

              <Link
                href="/dashboard/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>My Account Settings</span>
              </Link>
              <Link
                href="/dashboard/subscription"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>My Subscription Plan</span>
              </Link>

              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 text-left font-bold cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Popup Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          alert("Logged out successfully!");
        }}
      />
    </header>
  );
}
