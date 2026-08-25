import AdminTeamsClientView from "@/components/admin/AdminTeamsClientView";
import { fetchTeamsServer, fetchCleanersServer } from "@/services/teamServerService";

export const metadata = {
  title: "Teams & Squads Management HQ | Cleanix Admin",
  description: "Manage teams, squad leaders, cleaner assignments, and revenue split models.",
};

export default async function AdminTeamsPage() {
  // Server-side Data Fetching
  const [teams, cleaners] = await Promise.all([
    fetchTeamsServer(),
    fetchCleanersServer(),
  ]);

  return (
    <AdminTeamsClientView
      initialTeams={teams}
      initialCleaners={cleaners}
    />
  );
}
