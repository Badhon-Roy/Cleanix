import AdminServicesClientView from "./AdminServicesClientView";
import { fetchAdminAddonsServer } from "@/services/addonServerService";

export default async function AdminServicesPage() {
  const initialAddons = await fetchAdminAddonsServer();

  return <AdminServicesClientView initialAddons={initialAddons} />;
}
