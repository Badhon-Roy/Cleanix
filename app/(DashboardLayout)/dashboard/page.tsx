import React from "react";
import DashboardClientView from "./DashboardClientView";
import { fetchMyBookingsServer, fetchAdminBookingsServer } from "@/services/bookingServerService";
import { fetchMySubscriptionsServer } from "@/services/subscriptionServerService";

export default async function CustomerDashboardPage() {
  const [initialBookings, initialSubscriptions, initialAdminBookings] = await Promise.all([
    fetchMyBookingsServer(),
    fetchMySubscriptionsServer(),
    fetchAdminBookingsServer(),
  ]);

  return (
    <DashboardClientView
      initialBookings={initialBookings}
      initialSubscriptions={initialSubscriptions}
      initialAdminBookings={initialAdminBookings}
    />
  );
}
