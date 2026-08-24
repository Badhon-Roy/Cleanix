"use client";

import React, { useState } from "react";
import TeamLeaderSidebar from "@/components/team-leader/TeamLeaderSidebar";
import TeamLeaderHeader from "@/components/team-leader/TeamLeaderHeader";

export default function TeamLeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased selection:bg-[#007eff] selection:text-white">
      {/* Team Leader Sidebar */}
      <TeamLeaderSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Team Leader Header */}
        <TeamLeaderHeader
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
