import NewBookingClientView from "./NewBookingClientView";
import { fetchMyLocationsServer } from "@/services/locationServerService";
import { fetchActiveAddonsServer } from "@/services/addonServerService";

export default async function NewBookingPage() {
  const [initialLocations, initialAddons] = await Promise.all([
    fetchMyLocationsServer(),
    fetchActiveAddonsServer(),
  ]);

  return (
    <NewBookingClientView
      initialLocations={initialLocations}
      initialAddons={initialAddons}
    />
  );
}
