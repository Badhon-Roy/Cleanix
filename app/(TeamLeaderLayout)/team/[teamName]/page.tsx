"use client";

import { use} from "react";
import { unslugifyTeamName } from "@/utils/slug";
import TeamLeaderDashboardView from "@/components/team-leader/TeamLeaderDashboardView";

export default function DynamicTeamLeaderDashboardPage({
  params,
}: {
  params: Promise<{ teamName: string }>;
}) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams?.teamName || "";
  const displayTeamName = unslugifyTeamName(rawSlug);

  return <TeamLeaderDashboardView teamSlug={rawSlug} displayTeamName={displayTeamName} />;
}
