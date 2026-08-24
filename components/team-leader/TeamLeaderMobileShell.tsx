"use client";

import React, { useState } from "react";
import TeamLeaderSidebar from "@/components/team-leader/TeamLeaderSidebar";
import TeamLeaderHeader from "@/components/team-leader/TeamLeaderHeader";
import TeamLeaderViewShell from "@/components/team-leader/TeamLeaderViewShell";

/**
 * TeamLeaderMobileShell
 *
 * Owns mobile sidebar toggle state + renders the full team leader UI.
 * TeamLeaderViewShell handles all view switching with zero navigation delay.
 */
export default function TeamLeaderMobileShell({ children }: { children?: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased selection:bg-[#007eff] selection:text-white">
      {/* Sidebar */}
      <TeamLeaderSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TeamLeaderHeader
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* SPA View Shell / Server Page Children */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-8">
          <TeamLeaderViewShell />
        </main>
      </div>
    </div>
  );
}
