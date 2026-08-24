import React from "react";
import AdminCoverageClientView from "@/components/admin/AdminCoverageClientView";
import { fetchCoveragesServer } from "@/services/coverageServerService";

export const metadata = {
  title: "Coverage Areas Control Center | Cleanix Admin",
  description: "Manage operational service coverage zones, districts, sub-areas, and zip codes.",
};

export default async function AdminCoveragePage() {
  // Server-side Data Fetching from Backend CoverageArea Collection
  const coverages = await fetchCoveragesServer();

  return <AdminCoverageClientView initialCoverages={coverages} />;
}
