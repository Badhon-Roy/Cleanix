import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Cleanix Platform",
  description:
    "Sign in to your Cleanix portal to manage home & office cleaning bookings, track field staff dispatch, or manage operations.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col relative overflow-x-hidden selection:bg-[#007eff] selection:text-white">
      {/* Decorative Light Mode Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Left Soft Blue Glow */}
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[140px]" />
        {/* Bottom Right Soft Sky/Cyan Glow */}
        <div className="absolute -bottom-40 -right-40 w-[35rem] h-[35rem] bg-sky-400/15 rounded-full blur-[160px]" />
        {/* Center Subtle Indigo Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-300/10 rounded-full blur-[120px]" />
        
        {/* Subtle Light Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
    </div>
  );
}
