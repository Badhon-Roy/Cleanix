import NewBookingClientView from "./NewBookingClientView";
import { fetchMyLocationsServer } from "@/services/locationServerService";
import { fetchActiveAddonsServer } from "@/services/addonServerService";
import { fetchPricingConfigServer } from "@/services/pricingServerService";

export default async function NewBookingPage() {
  const [initialLocations, initialAddons, initialPricing] = await Promise.all([
    fetchMyLocationsServer(),
    fetchActiveAddonsServer(),
    fetchPricingConfigServer(),
  ]);

  return (
    <NewBookingClientView
      initialLocations={initialLocations}
      initialAddons={initialAddons}
      initialPricing={initialPricing}
    />
  );
}
