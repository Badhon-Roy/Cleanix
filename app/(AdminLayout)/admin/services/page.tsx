import AdminServicesClientView from "./AdminServicesClientView";
import { fetchAdminAddonsServer } from "@/services/addonServerService";
import { fetchPricingConfigServer } from "@/services/pricingServerService";

export default async function AdminServicesPage() {
  const [initialAddons, initialPricing] = await Promise.all([
    fetchAdminAddonsServer(),
    fetchPricingConfigServer(),
  ]);

  return (
    <AdminServicesClientView
      initialAddons={initialAddons}
      initialPricing={initialPricing}
    />
  );
}
