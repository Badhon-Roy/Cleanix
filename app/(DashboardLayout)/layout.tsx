import React from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getCurrentUser } from "@/services/authService";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased selection:bg-[#007eff] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar user={user} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Dashboard Header */}
        <DashboardHeader user={user} />

        {/* Page Content Container - Full Width */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
