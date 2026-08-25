import React from "react";
import AdminCleanersClientView from "@/components/admin/AdminCleanersClientView";
import { fetchCleanersServer } from "@/services/cleanerServerService";

export const metadata = {
  title: "Cleaner Staff Approval & CRM | Cleanix Admin",
  description: "Review and approve cleaner staff registration requests, verify credentials, and manage duty access.",
};

export default async function AdminCleanersPage() {
  const initialCleaners = await fetchCleanersServer();

  return <AdminCleanersClientView initialCleaners={initialCleaners} />;
}
