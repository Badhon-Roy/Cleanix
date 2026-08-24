import AdminSidebarClientView from "./AdminSidebarClientView";
import { fetchCleanersServer } from "@/services/cleanerServerService";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default async function AdminSidebar({
  mobileOpen = false,
  setMobileOpen,
}: AdminSidebarProps) {
  // Fetch initial cleaner profiles on server side for SSR
  const initialCleaners = await fetchCleanersServer();
  const initialPendingCount = initialCleaners.filter(
    (c) => c.status === "PENDING_APPROVAL"
  ).length;

  return (
    <AdminSidebarClientView
      initialPendingCount={initialPendingCount}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
    />
  );
}
