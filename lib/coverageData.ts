"use client";

export interface CoverageAreaItem {
  id: string;
  area: string;
  tag: string;
  time: string;
  desc: string;
  btnLabel?: string;
  status: "ACTIVE" | "INACTIVE";
}
