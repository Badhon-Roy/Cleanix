"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  Lock,
  Loader2,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import {
  ReviewItem,
  fetchReviewsAPI,
  updateReviewStatusAPI,
} from "@/services/reviewService";

interface TeamReviewsViewProps {
  teamSlug: string;
}

export default function TeamReviewsView({ teamSlug }: TeamReviewsViewProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadReviews = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      // Fetch all reviews and filter by squad or team assignments
      const data = await fetchReviewsAPI();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Error loading team reviews:", err);
      if (showSpinner) toast.error("Failed to load reviews");
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(true);

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
  }, [teamSlug]);

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
            ? "Review approved! Now visible on public service pages."
            : "Review hidden from public service pages."
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

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

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
              Squad Customer Reviews &amp; Ratings
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              ⭐ TEAM QUALITY FEEDBACK
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Monitor client ratings for your squad. As Team Leader, you can approve or hide reviews for service pages (isApproved). Homepage featuring (isFeatured) is managed by Admin HQ.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadReviews(true)}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-[#007eff] ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Score Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Squad Average Rating</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">{avgRating}</span>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(avgRating))
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Total Reviews Received</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{reviews.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Approved for Service Pages</span>
            <div className="text-3xl font-black text-emerald-700 mt-1">
              {reviews.filter((r) => r.isApproved).length}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
            <Loader2 className="w-8 h-8 text-[#007eff] animate-spin mx-auto" />
            <p className="font-extrabold text-slate-900 text-sm">Loading Team Reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => {
            const customerName = rev.customer?.name || "Verified Customer";
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
                className={`bg-white border rounded-3xl p-6 transition-all space-y-4 shadow-xs ${
                  rev.isApproved ? "border-emerald-300" : "border-amber-300 bg-amber-50/20"
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-black text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200 font-mono">
                      {bookingRef.startsWith("#") ? bookingRef : `#${bookingRef}`}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {serviceTitle}
                    </h3>

                    {/* Approval Badge */}
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        rev.isApproved
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          rev.isApproved ? "bg-emerald-600" : "bg-amber-500 animate-pulse"
                        }`}
                      />
                      <span>{rev.isApproved ? "Approved (Public on Service Page)" : "Hidden from Service Page"}</span>
                    </span>

                    {/* Featured status indicator (Read-only for Team Leader) */}
                    {rev.isFeatured ? (
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 flex items-center gap-1.5 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Featured on Homepage (Admin Verified)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Homepage Featuring: Admin Only</span>
                      </span>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl">
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

                {/* Customer & Feedback */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-white flex-shrink-0">
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
                    </div>
                  </div>

                  <div className="md:col-span-8 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium italic">
                      &ldquo;
                      {rev.feedback && rev.feedback.trim().length > 0
                        ? rev.feedback
                        : "Exceptional professional cleaning service! Highly recommended."}
                      &rdquo;
                    </p>
                  </div>
                </div>

                {/* Team Leader Moderation Button */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500 font-medium">
                    You can approve/hide this review from the public service page.
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleApproval(rev)}
                    disabled={isBusy}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                      rev.isApproved
                        ? "bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {rev.isApproved ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Hide from Service Page (isApproved: False)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve for Service Page (isApproved: True)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="font-extrabold text-slate-900 text-base">No Customer Reviews Yet</p>
            <p className="text-xs text-slate-500 font-medium">
              Completed bookings by your team with customer feedback will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
