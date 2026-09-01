import NewBookingClientView from "./NewBookingClientView";
import { fetchMyLocationsServer } from "@/services/locationServerService";
import { fetchActiveAddonsServer } from "@/services/addonServerService";
import { fetchPricingConfigServer } from "@/services/pricingServerService";
import { fetchActiveServicesServer } from "@/services/serviceCategoryServerService";
import { fetchCoveragesServer } from "@/services/coverageServerService";

export default async function NewBookingPage() {
  const [initialLocations, initialAddons, initialPricing, initialCoreServices, initialCoverages] = await Promise.all([
    fetchMyLocationsServer(),
    fetchActiveAddonsServer(),
    fetchPricingConfigServer(),
    fetchActiveServicesServer(),
    fetchCoveragesServer(),
  ]);

  return (
    <NewBookingClientView
      initialLocations={initialLocations}
      initialAddons={initialAddons}
      initialPricing={initialPricing}
      initialCoreServices={initialCoreServices}
      initialCoverages={initialCoverages}
    />
  );
}
