"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

interface AdminLayoutClientShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminLayoutClientShell({
  sidebar,
  children,
}: AdminLayoutClientShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* Admin Sidebar Navigation Server Node */}
      {sidebar}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMobileMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-8 w-full">{children}</main>
      </div>
    </div>
  );
}
