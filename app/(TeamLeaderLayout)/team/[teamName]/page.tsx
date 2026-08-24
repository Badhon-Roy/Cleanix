"use client";

import React, { use, useState, useEffect } from "react";
import TeamLeaderDashboardView from "@/components/team-leader/TeamLeaderDashboardView";
import { unslugifyTeamName } from "@/utils/slug";

export default function DynamicTeamLeaderDashboardPage({
  params,
}: {
  params: Promise<{ teamName: string }>;
}) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams?.teamName || "team-squad";
  const displayTeamName = unslugifyTeamName(rawSlug);

  return <TeamLeaderDashboardView teamSlug={rawSlug} displayTeamName={displayTeamName} />;
}
