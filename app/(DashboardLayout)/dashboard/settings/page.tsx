import SettingsClientView from "./SettingsClientView";
import { fetchCustomerProfileServer } from "@/services/customerServerService";

export default async function CustomerSettingsPage() {
  const customerData = await fetchCustomerProfileServer();

  return <SettingsClientView initialData={customerData} />;
}
