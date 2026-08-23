import AdminServicesClientView from "./AdminServicesClientView";
import { fetchAdminAddonsServer } from "@/services/addonServerService";
import { fetchPricingConfigServer } from "@/services/pricingServerService";
import { fetchAdminServicesServer } from "@/services/serviceCategoryServerService";

export default async function AdminServicesPage() {
  const [initialAddons, initialPricing, initialCoreServices] = await Promise.all([
    fetchAdminAddonsServer(),
    fetchPricingConfigServer(),
    fetchAdminServicesServer(),
  ]);

  return (
    <AdminServicesClientView
      initialAddons={initialAddons}
      initialPricing={initialPricing}
      initialCoreServices={initialCoreServices}
    />
  );
}
