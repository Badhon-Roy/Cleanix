"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased selection:bg-[#007eff] selection:text-white">
      {/* Sidebar Navigation (Desktop Sticky & Mobile Drawer) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Dashboard Header */}
        <DashboardHeader
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Page Content Container - Full Width */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
