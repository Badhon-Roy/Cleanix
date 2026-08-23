import NewBookingClientView from "./NewBookingClientView";
import { fetchMyLocationsServer } from "@/services/locationServerService";
import { fetchActiveAddonsServer } from "@/services/addonServerService";
import { fetchPricingConfigServer } from "@/services/pricingServerService";
import { fetchActiveServicesServer } from "@/services/serviceCategoryServerService";

export default async function NewBookingPage() {
  const [initialLocations, initialAddons, initialPricing, initialCoreServices] = await Promise.all([
    fetchMyLocationsServer(),
    fetchActiveAddonsServer(),
    fetchPricingConfigServer(),
    fetchActiveServicesServer(),
  ]);

  return (
    <NewBookingClientView
      initialLocations={initialLocations}
      initialAddons={initialAddons}
      initialPricing={initialPricing}
      initialCoreServices={initialCoreServices}
    />
  );
}
