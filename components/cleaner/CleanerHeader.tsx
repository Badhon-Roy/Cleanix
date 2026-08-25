"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Menu,
  User,
  ShieldAlert,
  ChevronDown,
  CheckCircle2,
  Clock,
  PhoneCall,
  Truck,
  MapPin,
  Timer,
} from "lucide-react";
import { io } from "socket.io-client";
import { getAuthUser } from "@/utils/cookie";
import LogoutConfirmModal from "@/components/dashboard/LogoutConfirmModal";
import {
  fetchCleanerProfileMeAPI,
  ICleanerProfile,
} from "@/services/cleanerService";

interface CleanerHeaderProps {
  onToggleMobileMenu: () => void;
}

export default function CleanerHeader({ onToggleMobileMenu }: CleanerHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [cleanerProfile, setCleanerProfile] = useState<ICleanerProfile | null>(null);
  const [elapsedTimeStr, setElapsedTimeStr] = useState<string>("00h 00m 00s");

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const loadCleanerProfile = async () => {
    const prof = await fetchCleanerProfileMeAPI();
    if (prof) {
      setCleanerProfile(prof);
    }
  };

  useEffect(() => {
    setUserProfile(getAuthUser());
    loadCleanerProfile();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("cleaner_updated", () => {
      loadCleanerProfile();
    });

    return () => {
      socket.off("cleaner_updated");
      socket.disconnect();
    };
  }, []);

  // 1-second live countdown timer interval
  useEffect(() => {
    if (
      !cleanerProfile ||
      (cleanerProfile.dutyStatus !== "ON_DUTY" && cleanerProfile.dutyStatus !== "IN_SERVICE") ||
      !cleanerProfile.dutyStartedAt
    ) {
      setElapsedTimeStr("00h 00m 00s");
      return;
    }

    const calculateElapsed = () => {
      const startMs = new Date(cleanerProfile.dutyStartedAt!).getTime();
      const nowMs = Date.now();
      const diffMs = Math.max(0, nowMs - startMs);

      const totalSecs = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      const pad = (n: number) => n.toString().padStart(2, "0");
      setElapsedTimeStr(`${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, [cleanerProfile]);

  const getInitials = (name?: string) => {
    if (!name) return "CL";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

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
      title: "New Dispatch Assigned (#CLN-8891)",
      desc: "Deep Cleaning job assigned at House 42, Road 11, Gulshan-2.",
      time: "5 mins ago",
      type: "info",
      unread: true,
    },
    {
      id: 2,
      title: "Schedule Time Lock Update",
      desc: "Customer requested 10:00 AM check-in confirmation.",
      time: "1 hour ago",
      type: "info",
      unread: true,
    },
    {
      id: 3,
      title: "Weekly Payout Credited (৳42,500)",
      desc: "Weekly field earnings successfully transferred to your bKash merchant account.",
      time: "Yesterday",
      type: "success",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between text-slate-800">
      {/* Left Area: Mobile Menu Toggle & Title/Search */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
          aria-label="Toggle mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar for Jobs */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search job ID, client name, or area..."
            className="w-full bg-slate-100 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Area: Status, Duty Countdown Timer, Dispatch Hotline, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Live Duty Time Countdown Badge */}
        {cleanerProfile && (
          <div>
            {cleanerProfile.dutyStatus === "ON_DUTY" || cleanerProfile.dutyStatus === "IN_SERVICE" ? (
              <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-2.5 shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <div className="flex flex-col text-[11px] leading-tight">
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1">
                    <span className="bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded text-[10px] uppercase tracking-wider font-black">
                      ON-DUTY
                    </span>
                    {cleanerProfile.dutyStartedAt && (
                      <span className="text-slate-600 font-semibold text-[10px]">
                        Start: {new Date(cleanerProfile.dutyStartedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-black text-xs text-emerald-700 tracking-wide mt-0.5 flex items-center gap-1">
                    <Timer className="w-3 h-3 text-emerald-600 animate-spin" />
                    <span>{elapsedTimeStr}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 flex items-center gap-1.5 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Off Duty</span>
              </div>
            )}
          </div>
        )}

        {/* Support Dispatch Hotline */}
        <a
          href="tel:+8801700000000"
          className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#007eff]" />
          <span>Dispatch: +880 1700-999888</span>
        </a>

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
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-200">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#007eff]" /> Cleaner Alerts
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

              {/* List */}
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
                        {n.type === "info" ? (
                          <Truck className="w-4 h-4" />
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
            <div className="w-8 h-8 rounded-full bg-[#007eff] flex items-center justify-center font-bold text-xs text-white uppercase">
              {getInitials(userProfile?.name)}
            </div>
            <span className="hidden md:inline text-xs font-bold text-slate-800">
              {userProfile?.name || "Cleaner Staff"} ({userProfile?.role === "TEAM_LEADER" ? "Team Leader" : "Cleaner"})
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                <p className="font-bold text-slate-900 text-sm">{userProfile?.name || "Cleaner Staff"}</p>
                <p className="text-slate-500 text-[11px] truncate">{userProfile?.email || "N/A"}</p>
              </div>

              <Link
                href="/cleaner/profile"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>My Cleaner Profile</span>
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
          alert("Cleaner Team logged out successfully!");
        }}
      />
    </header>
  );
}
