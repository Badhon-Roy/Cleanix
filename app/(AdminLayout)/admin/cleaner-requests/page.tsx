import React from "react";
import AdminCleanerRequestsClientView from "@/components/admin/AdminCleanerRequestsClientView";
import { fetchCleanersServer } from "@/services/cleanerServerService";

export const metadata = {
  title: "Cleaner Registration Requests & Approval | Cleanix Admin",
  description: "Inspect new cleaner registration requests, verify credentials, and approve certified staff for service dispatch.",
};

export default async function AdminCleanerRequestsPage() {
  const initialCleaners = await fetchCleanersServer();

  return <AdminCleanerRequestsClientView initialCleaners={initialCleaners} />;
}
