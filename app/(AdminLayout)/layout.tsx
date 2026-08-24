import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLayoutClientShell from "@/components/admin/AdminLayoutClientShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutClientShell sidebar={<AdminSidebar />}>
      {children}
    </AdminLayoutClientShell>
  );
}
