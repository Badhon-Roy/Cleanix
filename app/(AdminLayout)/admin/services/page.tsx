import AdminServicesClientView from "./AdminServicesClientView";
import { fetchAdminAddonsServer } from "@/services/addonServerService";
import { fetchPricingConfigServer } from "@/services/pricingServerService";
import {
  fetchAdminServicesServer,
  fetchServiceCatalogOverviewServer,
} from "@/services/serviceCategoryServerService";

export default async function AdminServicesPage() {
  const [initialAddons, initialPricing, initialCoreServices, initialOverview] = await Promise.all([
    fetchAdminAddonsServer(),
    fetchPricingConfigServer(),
    fetchAdminServicesServer(),
    fetchServiceCatalogOverviewServer(),
  ]);

  return (
    <AdminServicesClientView
      initialAddons={initialAddons}
      initialPricing={initialPricing}
      initialCoreServices={initialCoreServices}
      initialOverview={initialOverview}
    />
  );
}
