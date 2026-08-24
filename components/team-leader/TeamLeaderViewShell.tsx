"use client";

/**
 * TeamLeaderViewShell — True SPA-style navigation shell.
 *
 * All sub-view components are imported STATICALLY at the top level.
 * This means they are bundled into ONE JS chunk with the layout, so switching
 * between views is purely a React state change — zero network round trips,
 * zero chunk loading, genuinely instantaneous.
 *
 * How it works:
 *  - Reads `usePathname()` to know which view is active
 *  - Uses `router.push()` when sidebar navigation happens — but since the
 *    layout + shell stays mounted, Next.js only updates the URL bar and
 *    re-renders this shell (no page teardown / remount)
 *  - All view components are always in memory once the layout loads
 */

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { unslugifyTeamName } from "@/utils/slug";

// ─── All views imported statically (single JS bundle, no lazy loading) ───────
import TeamLeaderDashboardView from "@/components/team-leader/TeamLeaderDashboardView";
import AvailableBookingsView from "./views/AvailableBookingsView";
import CleanerRequestsView from "./views/CleanerRequestsView";
import TeamBookingsView from "./views/TeamBookingsView";
import TeamEarningsView from "./views/TeamEarningsView";
import TeamProofsView from "./views/TeamProofsView";
import MyTeamView from "./views/MyTeamView";

export default function TeamLeaderViewShell() {
  const pathname = usePathname();

  // Derive teamSlug from URL: /team/[teamSlug]/...
  const teamSlug = useMemo(() => {
    const match = pathname.match(/^\/team\/([^/]+)/);
    return match ? match[1] : "team-alpha";
  }, [pathname]);

  const displayTeamName = unslugifyTeamName(teamSlug);

  // Determine active view from pathname suffix
  const activeView = useMemo(() => {
    if (pathname.endsWith("/my-team")) return "my-team";
    if (pathname.endsWith("/bookings")) return "bookings";
    if (pathname.endsWith("/requests")) return "requests";
    if (pathname.endsWith("/available-bookings")) return "available-bookings";
    if (pathname.endsWith("/earnings")) return "earnings";
    if (pathname.endsWith("/proofs")) return "proofs";
    return "overview"; // default: overview & roster
  }, [pathname]);

  // Render active view — all other views stay in memory but are hidden via CSS
  // so next switch is truly instant (no unmount/remount cycle)
  return (
    <div className="w-full">
      <div style={{ display: activeView === "overview" ? "block" : "none" }}>
        <TeamLeaderDashboardView
          teamSlug={teamSlug}
          displayTeamName={displayTeamName}
        />
      </div>

      <div style={{ display: activeView === "my-team" ? "block" : "none" }}>
        <MyTeamView teamSlug={teamSlug} />
      </div>

      <div style={{ display: activeView === "bookings" ? "block" : "none" }}>
        <TeamBookingsView teamSlug={teamSlug} />
      </div>

      <div style={{ display: activeView === "requests" ? "block" : "none" }}>
        <CleanerRequestsView teamSlug={teamSlug} />
      </div>

      <div style={{ display: activeView === "available-bookings" ? "block" : "none" }}>
        <AvailableBookingsView teamSlug={teamSlug} />
      </div>

      <div style={{ display: activeView === "earnings" ? "block" : "none" }}>
        <TeamEarningsView teamSlug={teamSlug} />
      </div>

      <div style={{ display: activeView === "proofs" ? "block" : "none" }}>
        <TeamProofsView teamSlug={teamSlug} />
      </div>
    </div>
  );
}
