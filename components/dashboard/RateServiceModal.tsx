"use client";

import React, { useState } from "react";
import { X, Star, CheckCircle2, MessageSquare, ThumbsUp } from "lucide-react";

interface RateServiceModalProps {
  bookingNumber: string | null;
  serviceTitle: string;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}

export default function RateServiceModal({
  bookingNumber,
  serviceTitle,
  onClose,
  onSubmit,
}: RateServiceModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!bookingNumber) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(rating, review);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden text-slate-900 p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-600 font-medium">
              Your 5-star review has been posted and shared with Cleaner Team Captain Rahat Karim.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-xs font-mono text-[#007eff] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-bold">
                #{bookingNumber}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">Rate Your Cleaning Service</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">{serviceTitle}</p>
            </div>

            {/* Star Picker */}
            <div className="flex flex-col items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoverRating || rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 fill-slate-200"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-600">
                {rating === 5 && "Outstanding 5-Star Clean!"}
                {rating === 4 && "Great Service"}
                {rating === 3 && "Good Clean"}
                {rating <= 2 && "Needs Improvement"}
              </span>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#007eff]" />
                <span>Write a brief review (Optional):</span>
              </label>
              <textarea
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with the cleaner team, chemical quality, or punctuality..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Submit Rating</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
