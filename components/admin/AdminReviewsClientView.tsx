"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Trash2,
  Loader2,
  RefreshCw,
  Eye,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import {
  ReviewItem,
  fetchReviewsAPI,
  updateReviewStatusAPI,
  deleteReviewAPI,
} from "@/services/reviewService";

interface AdminReviewsClientViewProps {
  initialReviews?: ReviewItem[];
}

export default function AdminReviewsClientView({
  initialReviews = [],
}: AdminReviewsClientViewProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING" | "FEATURED">("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadReviews = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const data = await fetchReviewsAPI();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      if (showSpinner) toast.error("Failed to fetch reviews");
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialReviews || initialReviews.length === 0) {
      loadReviews(true);
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const handleRefresh = () => {
      loadReviews(false);
    };

    socket.on("review_created", handleRefresh);
    socket.on("review_updated", handleRefresh);

    return () => {
      socket.off("review_created", handleRefresh);
      socket.off("review_updated", handleRefresh);
      socket.disconnect();
    };
  }, []);

  const handleToggleApproval = async (review: ReviewItem) => {
    setUpdatingId(review._id);
    const newStatus = !review.isApproved;
    try {
      const res = await updateReviewStatusAPI(review._id, { isApproved: newStatus });
      if (res?.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === review._id ? { ...r, isApproved: newStatus } : r))
        );
        toast.success(
          newStatus
            ? "Review approved! Now visible on the service page."
            : "Review hidden from public view."
        );
      } else {
        toast.error(res?.message || "Failed to update review approval status");
      }
    } catch (err) {
      console.error("Error toggling approval:", err);
      toast.error("An error occurred while updating review approval");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (review: ReviewItem) => {
    setUpdatingId(review._id);
    const newStatus = !review.isFeatured;
    try {
      const res = await updateReviewStatusAPI(review._id, {
        isFeatured: newStatus,
        isApproved: newStatus ? true : review.isApproved, // Auto-approve if featured
      });
      if (res?.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === review._id
              ? {
                  ...r,
                  isFeatured: newStatus,
                  isApproved: newStatus ? true : r.isApproved,
                }
              : r
          )
        );
        toast.success(
          newStatus
            ? "🌟 Review is now Featured on Homepage Testimonials!"
            : "Review removed from Homepage Testimonials."
        );
      } else {
        toast.error(res?.message || "Failed to update featured status");
      }
    } catch (err) {
      console.error("Error toggling featured:", err);
      toast.error("An error occurred while updating featured status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) {
      return;
    }
    setUpdatingId(reviewId);
    try {
      const res = await deleteReviewAPI(reviewId);
      if (res?.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        toast.success("Review deleted successfully!");
      } else {
        toast.error(res?.message || "Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("An error occurred while deleting review");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const customerName = r.customer?.name || "";
    const feedbackText = r.feedback || "";
    const bookingRef = r.booking?.bookingRef || "";
    const serviceTitle = r.booking?.serviceType?.title || r.serviceType?.title || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedbackText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "APPROVED") {
      matchesStatus = r.isApproved === true;
    } else if (statusFilter === "PENDING") {
      matchesStatus = r.isApproved === false;
    } else if (statusFilter === "FEATURED") {
      matchesStatus = r.isFeatured === true;
    }

    return matchesSearch && matchesStatus;
  });

  const approvedCount = reviews.filter((r) => r.isApproved === true).length;
  const pendingCount = reviews.filter((r) => r.isApproved === false).length;
  const featuredCount = reviews.filter((r) => r.isFeatured === true).length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 stroke-[2.5]" />
              </div>
              Reviews &amp; Ratings Moderation
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              ⭐ SOCIAL PROOF &amp; CONTENT CONTROL
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Moderate customer ratings &amp; feedback. Control visibility on service details pages (isApproved) and feature top reviews on Homepage Testimonials (isFeatured).
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadReviews(true)}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-[#007eff] ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Controls Section: Search on Top + Full Width Filter Pills */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          {/* Top Row: Full Width Search System */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reviews by Customer Name, Booking Ref (#CLN-...), Feedback text, or Service Title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all shadow-xs"
              />
            </div>

            {/* Quick Result Summary Indicator */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 self-end sm:self-center flex-shrink-0 px-1">
              <span>Showing:</span>
              <span className="font-extrabold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                {filteredReviews.length} of {reviews.length} Reviews
              </span>
            </div>
          </div>

          {/* Bottom Row: Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap w-full pt-1">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                statusFilter === "ALL"
                  ? "bg-[#007eff] text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>ALL REVIEWS</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-700">
                {reviews.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("APPROVED")}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                statusFilter === "APPROVED"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>APPROVED &amp; PUBLIC</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                {approvedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                statusFilter === "PENDING"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : pendingCount > 0
                  ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>PENDING / HIDDEN</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
                {pendingCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("FEATURED")}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
                statusFilter === "FEATURED"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>HOMEPAGE FEATURED</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white">
                {featuredCount}
              </span>
            </button>
          </div>
        </div>

        {/* Reviews Cards List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <Loader2 className="w-8 h-8 text-[#007eff] animate-spin mx-auto" />
              <p className="font-extrabold text-slate-900 text-sm">Loading Reviews Database...</p>
            </div>
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((rev) => {
              const customerName = rev.customer?.name || "Customer";
              const avatarUrl =
                rev.customer?.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  customerName
                )}`;
              const bookingRef =
                rev.booking?.bookingRef ||
                `#CLN-${String(rev.booking?._id || rev._id).slice(-4)}`;
              const serviceTitle =
                rev.booking?.serviceType?.title ||
                rev.serviceType?.title ||
                "Cleaning Service";
              const isBusy = updatingId === rev._id;

              return (
                <div
                  key={rev._id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 shadow-xs ${
                    rev.isFeatured
                      ? "bg-indigo-50/20 border-indigo-300 ring-1 ring-indigo-500/20"
                      : rev.isApproved
                      ? "bg-[#F4FDFB] border-emerald-300/80 hover:border-emerald-400"
                      : "bg-amber-50/20 border-amber-300"
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-black text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200 font-mono">
                        {bookingRef.startsWith("#") ? bookingRef : `#${bookingRef}`}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                        {serviceTitle}
                      </h3>

                      {/* Approval Status Badge */}
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                          rev.isApproved
                            ? "bg-emerald-100/90 text-emerald-950 border-emerald-300"
                            : "bg-amber-100 text-amber-900 border-amber-300"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            rev.isApproved ? "bg-emerald-600" : "bg-amber-500 animate-pulse"
                          }`}
                        />
                        <span>{rev.isApproved ? "Approved (Public on Service Page)" : "Pending Moderation (Hidden)"}</span>
                      </span>

                      {/* Featured Badge */}
                      {rev.isFeatured && (
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 flex items-center gap-1.5 shadow-2xs">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Featured on Homepage</span>
                        </span>
                      )}
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-2xl shadow-2xs">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Number(rev.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-black text-slate-900 ml-1">
                        {Number(rev.rating || 5).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info & Feedback Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Left: Customer Info (col-span-4) */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-white flex-shrink-0 shadow-2xs">
                        <Image
                          src={avatarUrl}
                          alt={customerName}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {customerName}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{rev.customer?.phone || "Phone: N/A"}</p>
                        <p className="text-[11px] text-slate-400">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Feedback Quote (col-span-8) */}
                    <div className="md:col-span-8 bg-white/80 p-4 rounded-2xl border border-slate-200/80">
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium italic">
                        &ldquo;
                        {rev.feedback && rev.feedback.trim().length > 0
                          ? rev.feedback
                          : "Exceptional professional cleaning service! Highly recommended."}
                        &rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Action Moderation Controls Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="text-xs text-slate-500 font-medium">
                      Control visibility on service page or feature in Homepage Testimonials.
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Toggle isApproved Button: Clear Approve vs Hide actions */}
                      {rev.isApproved ? (
                        <button
                          type="button"
                          onClick={() => handleToggleApproval(rev)}
                          disabled={isBusy}
                          className="px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 text-amber-700" />
                          <span>Hide from Service Page (Make Hidden)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleApproval(rev)}
                          disabled={isBusy}
                          className="px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve (Make Public on Service Page)</span>
                        </button>
                      )}

                      {/* Toggle isFeatured Button (Admin Only): Clear Feature vs Unfeature actions */}
                      {rev.isFeatured ? (
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(rev)}
                          disabled={isBusy}
                          className="px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border border-indigo-300 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 text-indigo-700" />
                          <span>Remove from Homepage Testimonials</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(rev)}
                          disabled={isBusy}
                          className="px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Feature on Homepage Testimonials (Make Featured)</span>
                        </button>
                      )}

                      {/* Delete Review Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev._id)}
                        disabled={isBusy}
                        className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="font-extrabold text-slate-900 text-base">No Reviews Found</p>
              <p className="text-xs text-slate-500 font-medium">
                Try adjusting your search query or filter pills.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
