import SettingsClientView from "./SettingsClientView";
import { fetchCustomerProfileServer } from "@/services/customerServerService";
import { fetchMyLocationsServer } from "@/services/locationServerService";

export default async function CustomerSettingsPage() {
  const [customerData, initialLocations] = await Promise.all([
    fetchCustomerProfileServer(),
    fetchMyLocationsServer(),
  ]);

  return (
    <SettingsClientView
      initialData={customerData}
      initialLocations={initialLocations}
    />
  );
}
