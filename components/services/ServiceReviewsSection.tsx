"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ShieldCheck, MessageSquare, Sparkles } from "lucide-react";
import { io } from "socket.io-client";
import { ReviewItem, fetchServiceReviewsAPI } from "@/services/reviewService";

interface ServiceReviewsSectionProps {
  serviceSlug: string;
  serviceTitle: string;
  initialReviews?: ReviewItem[];
}

export default function ServiceReviewsSection({
  serviceSlug,
  serviceTitle,
  initialReviews = [],
}: ServiceReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);

  const loadReviews = async () => {
    try {
      const data = await fetchServiceReviewsAPI(serviceSlug);
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to load service reviews:", err);
    }
  };

  useEffect(() => {
    if (!initialReviews || initialReviews.length === 0) {
      loadReviews();
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
      loadReviews();
    };

    socket.on("review_created", handleRefresh);
    socket.on("review_updated", handleRefresh);

    return () => {
      socket.off("review_created", handleRefresh);
      socket.off("review_updated", handleRefresh);
      socket.disconnect();
    };
  }, [serviceSlug]);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="pt-8 space-y-6">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 border border-[#007eff]/30 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-3.5 py-1 mb-2 bg-blue-50/70">
            <Sparkles className="w-3.5 h-3.5 text-[#007eff]" />
            <span>CUSTOMER EXPERIENCES</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-[#001837] tracking-tight">
            Verified Customer Reviews
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Real feedback from clients who booked {serviceTitle}.
          </p>
        </div>

        {/* Aggregate Rating Score Card */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl px-4 py-2.5 self-start sm:self-auto">
            <div className="text-2xl sm:text-3xl font-black text-[#001837] tracking-tight">
              {avgRating}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(Number(avgRating))
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-500">
                Based on {reviews.length} approved review{reviews.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const customerName = rev.customer?.name || "Verified Customer";
            const avatarUrl =
              rev.customer?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                customerName
              )}`;
            const feedbackText =
              rev.feedback && rev.feedback.trim().length > 0
                ? rev.feedback
                : "Excellent professional cleaning service! The team was on time, well-equipped, and left the property spotless.";

            const dateStr = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recently Verified";

            return (
              <div
                key={rev._id}
                className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-3.5 hover:border-[#007eff]/40 transition-all duration-200 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Customer Info */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 bg-white flex-shrink-0">
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
                        <h4 className="font-extrabold text-sm sm:text-base text-[#001837]">
                          {customerName}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100/80 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Client</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {dateStr}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating Badge */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Number(rev.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-900 ml-1">
                      {Number(rev.rating || 5).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Feedback Quote */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal italic">
                  &ldquo;{feedbackText}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 sm:p-10 text-center bg-[#f8fafc] border border-slate-200/80 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">
            No Customer Reviews Yet for this Service
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
            Be among the first to book {serviceTitle} and receive our guaranteed professional cleaning standard!
          </p>
        </div>
      )}
    </div>
  );
}
