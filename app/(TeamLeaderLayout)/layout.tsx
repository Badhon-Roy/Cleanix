import React from "react";
import TeamLeaderMobileShell from "@/components/team-leader/TeamLeaderMobileShell";

export default function TeamLeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeamLeaderMobileShell>{children}</TeamLeaderMobileShell>;
}
