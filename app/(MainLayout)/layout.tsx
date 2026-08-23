import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/services/authService";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#001837] text-white flex flex-col font-sans selection:bg-[#007eff] selection:text-white">
      <Navbar user={user} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
