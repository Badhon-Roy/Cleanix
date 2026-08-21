"use client";

import React, { useState } from "react";
import CleanerSidebar from "@/components/cleaner/CleanerSidebar";
import CleanerHeader from "@/components/cleaner/CleanerHeader";

export default function CleanerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased selection:bg-[#007eff] selection:text-white">
      {/* Sidebar Navigation (Desktop Sticky & Mobile Drawer) */}
      <CleanerSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Cleaner Header */}
        <CleanerHeader
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Page Content Container - Full Width */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
