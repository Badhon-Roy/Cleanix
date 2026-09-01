import React from "react";
import type { Metadata } from "next";
import AdminReviewsClientView from "@/components/admin/AdminReviewsClientView";
import { fetchAllReviewsServer } from "@/services/reviewServerService";

export const metadata: Metadata = {
  title: "Reviews & Ratings Moderation | Cleanix Admin HQ",
  description:
    "Manage customer reviews, moderate service visibility (isApproved), and feature top ratings on Homepage Testimonials (isFeatured).",
};

export default async function AdminReviewsPage() {
  const reviews = await fetchAllReviewsServer();

  return <AdminReviewsClientView initialReviews={reviews} />;
}
