"use client";

export interface ContactMessage {
  id: string;
  _id?: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  submittedAt: string;
  createdAt?: string;
  status: "NEW" | "CONTACTED" | "RESOLVED" | "ARCHIVED";
  notes?: string;
}
