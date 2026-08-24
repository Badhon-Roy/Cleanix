import { use } from "react";
import { fetchTeamByIdOrSlugServer } from "@/services/teamServerService";
import MyTeamView from "@/components/team-leader/views/MyTeamView";

export default function MyTeamPage({
  params,
}: {
  params: Promise<{ teamName: string }>;
}) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams?.teamName || "team-squad";
  const initialTeam = use(fetchTeamByIdOrSlugServer(rawSlug));

  return <MyTeamView teamSlug={rawSlug} initialTeam={initialTeam} />;
}
