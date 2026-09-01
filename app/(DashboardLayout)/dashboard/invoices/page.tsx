import InvoicesClientView from "./InvoicesClientView";
import { fetchMyBookingsServer } from "@/services/bookingServerService";
import { fetchMySubscriptionsServer } from "@/services/subscriptionServerService";

export default async function CustomerInvoicesPage() {
  const [initialBookings, initialSubscriptions] = await Promise.all([
    fetchMyBookingsServer(),
    fetchMySubscriptionsServer(),
  ]);

  return (
    <InvoicesClientView
      initialBookings={initialBookings}
      initialSubscriptions={initialSubscriptions}
    />
  );
}
