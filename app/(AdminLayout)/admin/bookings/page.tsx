import AdminBookingsClientView from "./AdminBookingsClientView";
import { fetchAdminBookingsServer } from "@/services/bookingServerService";

export default async function AdminBookingsPage() {
  const initialBookings = await fetchAdminBookingsServer();

  return <AdminBookingsClientView initialBookings={initialBookings} />;
}
