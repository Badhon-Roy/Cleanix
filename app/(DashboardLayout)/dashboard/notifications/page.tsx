"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Trash2,
  CheckCheck,
  Truck,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  date: string;
  category: "cleaner" | "billing" | "reminder" | "promo" | "security";
  unread: boolean;
  actionText?: string;
  actionHref?: string;
}

export default function NotificationsPage() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Cleaner Team Dispatched & En Route",
      desc: "Team Delta led by Senior Supervisor Rahat Karim has departed from the Gulshan hub and is traveling to House 42, Road 11.",
      time: "10 mins ago",
      date: "Today at 10:15 AM",
      category: "cleaner",
      unread: true,
      actionText: "Track Live Location",
      actionHref: "/dashboard/bookings",
    },
    {
      id: 2,
      title: "Automated Invoice PDF Generated (#CLN-8891)",
      desc: "Payment receipt of ৳14,000 for your Deep Cleaning service has been processed successfully and emailed to you.",
      time: "2 hours ago",
      date: "Today at 08:30 AM",
      category: "billing",
      unread: true,
      actionText: "View Invoice PDF",
      actionHref: "/dashboard/invoices",
    },
    {
      id: 3,
      title: "Upcoming Scheduled Cleaning Visit",
      desc: "Your weekly VIP Subscription cleaning visit is scheduled for tomorrow at 10:00 AM. Please ensure property access.",
      time: "Yesterday",
      date: "Yesterday at 04:00 PM",
      category: "reminder",
      unread: true,
      actionText: "Manage Visit Schedule",
      actionHref: "/dashboard/subscription",
    },
    {
      id: 4,
      title: "Exclusive 15% Off Add-on Voucher",
      desc: "Special VIP Member reward! Use coupon code CLEANIXVIP15 on your next sofa or mattress steam sanitization add-on.",
      time: "2 days ago",
      date: "Aug 19, 2026",
      category: "promo",
      unread: false,
      actionText: "Book New Service",
      actionHref: "/dashboard/new-booking",
    },
    {
      id: 5,
      title: "Service Completion & Rating Request",
      desc: "Your Living Room & Kitchen sanitization visit was completed. Please take a moment to rate cleaner supervisor Rahat.",
      time: "3 days ago",
      date: "Aug 18, 2026",
      category: "cleaner",
      unread: false,
      actionText: "Leave Rating",
      actionHref: "/dashboard/bookings",
    },
    {
      id: 6,
      title: "Account Security Password Updated",
      desc: "Your account password was updated successfully from Settings. If you did not perform this, contact support immediately.",
      time: "4 days ago",
      date: "Aug 17, 2026",
      category: "security",
      unread: false,
      actionText: "Account Settings",
      actionHref: "/dashboard/settings",
    },
  ]);

  // Handlers
  const toggleReadStatus = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  // Filtered List
  const filteredNotifications = notifications.filter((n) => {
    const matchesCategory =
      filterCategory === "all" ||
      (filterCategory === "unread" && n.unread) ||
      n.category === filterCategory;

    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;
  const cleanerCount = notifications.filter((n) => n.category === "cleaner").length;
  const billingCount = notifications.filter((n) => n.category === "billing").length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 stroke-[2.5]" />
              </div>
              Notification Center
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            View all activity alerts, cleaner dispatch updates, invoice receipts, and system announcements.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`px-4 py-2.5 rounded-2xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all border ${
              unreadCount > 0
                ? "bg-blue-50 hover:bg-blue-100 text-[#007eff] border-blue-200 cursor-pointer"
                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
            }`}
          >
            <CheckCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Mark All as Read</span>
          </button>

          <button
            type="button"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear All Notifications"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Alerts Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Total Logged</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#007eff] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{notifications.length}</p>
          <span className="text-[11px] text-slate-500 font-semibold">Activity record</span>
        </div>

        {/* Unread Alerts Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Unread Messages</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{unreadCount}</p>
          <span className="text-[11px] text-amber-700 font-medium">Action required</span>
        </div>

        {/* Cleaner Dispatch Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Cleaner Updates</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{cleanerCount}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Live dispatch</span>
        </div>

        {/* Billing Alerts Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Billing Receipts</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{billingCount}</p>
          <span className="text-[11px] text-indigo-700 font-medium">PDF ready</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Controls: Search & Category Filter Tabs */}
        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Filter Pills on Left */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Logs" },
              { id: "unread", label: `Unread (${unreadCount})` },
              { id: "cleaner", label: "Cleaner Team" },
              { id: "billing", label: "Invoices" },
              { id: "reminder", label: "Reminders" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === tab.id
                    ? "bg-gradient-to-r from-blue-500 via-[#007eff] to-blue-700 text-white shadow-md shadow-blue-500/25 border border-blue-400"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box on Right */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((item) => {
              // Icon selector
              const getCategoryIcon = () => {
                switch (item.category) {
                  case "cleaner":
                    return <Truck className="w-5 h-5 text-emerald-600" />;
                  case "billing":
                    return <FileText className="w-5 h-5 text-[#007eff]" />;
                  case "reminder":
                    return <Calendar className="w-5 h-5 text-amber-600" />;
                  case "promo":
                    return <Sparkles className="w-5 h-5 text-purple-600" />;
                  case "security":
                    return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
                  default:
                    return <Bell className="w-5 h-5 text-slate-600" />;
                }
              };

              const getCategoryBg = () => {
                switch (item.category) {
                  case "cleaner":
                    return "bg-emerald-50 border-emerald-200";
                  case "billing":
                    return "bg-blue-50 border-blue-200";
                  case "reminder":
                    return "bg-amber-50 border-amber-200";
                  case "promo":
                    return "bg-purple-50 border-purple-200";
                  case "security":
                    return "bg-indigo-50 border-indigo-200";
                  default:
                    return "bg-slate-50 border-slate-200";
                }
              };

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.unread) {
                      toggleReadStatus(item.id);
                    }
                  }}
                  className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer ${
                    item.unread
                      ? "bg-blue-50/80 border-blue-200 border-l-4 border-l-[#007eff]"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Content Container */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon Box */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border mt-0.5 ${getCategoryBg()}`}
                    >
                      {getCategoryIcon()}
                    </div>

                    {/* Text Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                          {item.title}
                        </h4>

                        {item.unread && (
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#007eff] text-white">
                            New Alert
                          </span>
                        )}

                        <span className="text-xs text-slate-400 font-medium">{item.time}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                        <span>📅 {item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right Area */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {item.actionText && item.actionHref && (
                      <Link
                        href={item.actionHref}
                        className="bg-blue-50 hover:bg-blue-100 text-[#007eff] font-extrabold text-xs px-4 py-2 rounded-2xl border border-blue-200 flex items-center gap-1.5 transition-colors"
                      >
                        <span>{item.actionText}</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                      title="Delete Notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-slate-900">No Notifications Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto">
                There are no activity logs matching your current filter criteria.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFilterCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#007eff] font-medium text-xs border border-blue-200 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
