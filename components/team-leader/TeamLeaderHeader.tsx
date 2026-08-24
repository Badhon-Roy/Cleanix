"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Menu,
  User,
  ShieldAlert,
  ChevronDown,
  CheckCircle2,
  Truck,
  PhoneCall,
  Users,
} from "lucide-react";
import LogoutConfirmModal from "@/components/dashboard/LogoutConfirmModal";

interface TeamLeaderHeaderProps {
  onToggleMobileMenu: () => void;
}

export default function TeamLeaderHeader({ onToggleMobileMenu }: TeamLeaderHeaderProps) {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const teamMatch = pathname?.match(/^\/team\/([^/]+)/);
  const teamSlug = teamMatch ? teamMatch[1] : "team-squad";
  const leaderProfileHref = `/team/${teamSlug}`;

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
      title: "New Booking Assigned by Admin",
      desc: "VIP Commercial Deep Cleaning assigned to Team Alpha at Gulshan-2.",
      time: "10 mins ago",
      type: "info",
      unread: true,
    },
    {
      id: 2,
      title: "Cleaner Job Request",
      desc: "Cleaner Asif Khan requested to work on job #CLN-2026-8891.",
      time: "25 mins ago",
      type: "request",
      unread: true,
    },
    {
      id: 3,
      title: "10% Commission Credited (৳১,৫০০)",
      desc: "Job #CLN-2026-8890 verified. Commission added to team wallet.",
      time: "2 hours ago",
      type: "success",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between text-slate-800">
      {/* Left Area: Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
          aria-label="Toggle mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search team jobs, cleaners, or booking IDs..."
            className="w-full bg-slate-100 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Area: Dispatch Hotline, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Support Hotline */}
        <a
          href="tel:+8801700000000"
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#007eff]" />
          <span>Admin Control HQ: +880 1700-999888</span>
        </a>

        {/* Notification Bell */}
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
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-200 shadow-xl">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#007eff]" /> Team Leader Alerts
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    2 New
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-[#007eff] hover:underline font-bold"
                >
                  Clear All
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-blue-50/50 transition-colors ${
                      n.unread ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 rounded-xl bg-blue-100 text-[#007eff] flex-shrink-0">
                        {n.type === "request" ? (
                          <Users className="w-4 h-4 text-blue-600" />
                        ) : n.type === "info" ? (
                          <Truck className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                          {n.unread && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
            <div className="w-8 h-8 rounded-full bg-[#0d274c] flex items-center justify-center font-extrabold text-xs text-white">
              TL
            </div>
            <span className="hidden md:inline text-xs font-bold text-slate-800">
              Rahat Karim (Team Alpha)
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-200 rounded-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                <p className="font-bold text-slate-900 text-sm">Rahat Karim</p>
                <p className="text-slate-500 text-[11px] truncate">Team Leader • Team Alpha</p>
              </div>

              <Link
                href={leaderProfileHref}
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>Leader Profile & Roster</span>
              </Link>

              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 text-left font-bold cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Log Out Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          window.location.href = "/";
        }}
      />
    </header>
  );
}
