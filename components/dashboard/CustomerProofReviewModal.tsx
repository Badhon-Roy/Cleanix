"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Lenis from "lenis";
import {
  Camera,
  X,
  CheckCircle2,
  Star,
  FileCheck,
  Sparkles,
  ShieldCheck,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { confirmBookingCompletionAPI } from "@/services/bookingService";

interface CustomerProofReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingRef: string;
  serviceTitle: string;
  customerAddress: string;
  proofOfWork?: {
    beforePhotos?: string[];
    afterPhotos?: string[];
    notes?: string;
    checklist?: { id: number; text: string; done: boolean }[];
    submittedAt?: string;
  };
  onCompletionSuccess: () => void;
}

export default function CustomerProofReviewModal({
  isOpen,
  onClose,
  bookingId,
  bookingRef,
  serviceTitle,
  customerAddress,
  proofOfWork,
  onCompletionSuccess,
}: CustomerProofReviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize Lenis Smooth Scrolling on the modal scroll container
  useEffect(() => {
    if (!isOpen || !mounted || !scrollContainerRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: (scrollContainerRef.current.firstElementChild as HTMLElement) || scrollContainerRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [isOpen, mounted]);

  if (!isOpen || !mounted) return null;

  const beforePhotos = proofOfWork?.beforePhotos || [];
  const afterPhotos = proofOfWork?.afterPhotos || [];
  const checklist = proofOfWork?.checklist || [
    { id: 1, text: "High-Touch Surface Sanitization & Disinfection", done: true },
    { id: 2, text: "Sofa, Carpet & Mattress HEPA Vacuuming", done: true },
    { id: 3, text: "Kitchen Chimney, Oven & Stove Degreasing", done: true },
    { id: 4, text: "Bathroom Anti-Bacterial Tile & Glass Scrub", done: true },
    { id: 5, text: "Dust Repellent Spray & Polish Application", done: true },
    { id: 6, text: "Windows & Property Doors Secured", done: true },
  ];
  const supervisorNotes = proofOfWork?.notes || "Cleanix certified standard deep cleaning protocol executed.";

  const handleConfirmCompletion = async () => {
    setIsConfirming(true);
    try {
      const res = await confirmBookingCompletionAPI(bookingId, {
        rating,
        feedback: feedback.trim(),
      });

      if (res?.success) {
        toast.success("🎉 ধন্যবাদ! আপনার সার্ভিস সফলভাবে সম্পন্ন ও নিশ্চিত করা হয়েছে।");
        onCompletionSuccess();
        onClose();
      } else {
        toast.error(res?.message || "সার্ভিস সম্পন্ন নিশ্চিত করতে সমস্যা হয়েছে");
      }
    } catch (err: any) {
      console.error("Confirm completion error:", err);
      toast.error(err?.message || "সার্ভিস সম্পন্ন নিশ্চিত করতে সমস্যা হয়েছে");
    } finally {
      setIsConfirming(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150 overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl lg:max-w-5xl w-full border border-slate-200 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200 max-h-[88vh] overflow-y-auto overscroll-contain text-slate-900"
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    কাজের মান যাচাই ও সার্ভিস সম্পন্ন নিশ্চিতকরণ
                  </h3>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-mono">
                    {bookingRef}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                  {serviceTitle} • {customerAddress}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isConfirming}
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Notice Banner */}
          <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 mb-6">
            <Sparkles className="w-5 h-5 text-[#007eff] flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p className="font-extrabold text-slate-900">
                ক্লিনার আপনার প্রপার্টির ক্লিনিং কাজ শেষ করে প্রমাণস্বরূপ ছবি আপলোড করেছেন।
              </p>
              <p className="mt-0.5 text-slate-600">
                অনুগ্রহ করে নিচের বিফোর/আফটার ছবি ও চেকলিস্ট পর্যালোচনা করে আপনার রেটিং দিয়ে সার্ভিসটি সম্পন্ন করুন।
              </p>
            </div>
          </div>

        {/* Section 1: Before & After Photos */}
        <div className="space-y-4">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#007eff]" /> কাজের প্রমাণস্বরূপ ছবি (Proof Photos)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before Photos */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  কাজের পূর্বের ছবি (Before)
                </span>
                <span className="text-[11px] font-extrabold text-amber-700">
                  {beforePhotos.length} টি ছবি
                </span>
              </div>

              {beforePhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {beforePhotos.map((src, idx) => (
                    <a
                      key={idx}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-square rounded-xl overflow-hidden border border-amber-300 group block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Before ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-amber-700 font-medium">
                  বিফোর ছবি আপলোড করা হয়নি
                </div>
              )}
            </div>

            {/* After Photos */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  কাজের পরের ছবি (After)
                </span>
                <span className="text-[11px] font-extrabold text-emerald-700">
                  {afterPhotos.length} টি ছবি
                </span>
              </div>

              {afterPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {afterPhotos.map((src, idx) => (
                    <a
                      key={idx}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-square rounded-xl overflow-hidden border border-emerald-300 group block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`After ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-emerald-700 font-medium">
                  আফটার ছবি আপলোড করা হয়নি
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Quality Checklist */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#007eff]" /> ক্লিনার কর্তৃক সম্পন্নকৃত চেকলিস্ট
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2 text-slate-700"
              >
                <div className="w-4 h-4 rounded-md bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>

          {supervisorNotes && (
            <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100 mt-2">
              <span className="font-bold text-slate-700 not-italic">ক্লিনার নোট: </span>
              {supervisorNotes}
            </p>
          )}
        </div>

        {/* Section 3: Customer Star Rating & Feedback */}
        <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                সার্ভিস রেটিং ও অভিজ্ঞতা (Customer Rating)
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                ক্লিনারের কাজের মান অনুযায়ী স্টার রেটিং সিলেক্ট করুন
              </p>
            </div>

            {/* Star selector */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-black text-amber-700 ml-1">
                {rating}.0 ★
              </span>
            </div>
          </div>

          <textarea
            rows={2}
            placeholder="সার্ভিস সম্পর্কিত কোনো মন্তব্য থাকলে এখানে লিখুন (ঐচ্ছিক)..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-medium text-xs sm:text-sm focus:outline-none focus:border-[#007eff]"
          />
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            disabled={isConfirming}
            onClick={onClose}
            className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            পরে সম্পন্ন করব
          </button>

          <button
            type="button"
            disabled={isConfirming}
            onClick={handleConfirmCompletion}
            className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-2 border border-emerald-500 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>নিশ্চিতকরণ সম্পন্ন হচ্ছে...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>কাজ সম্পন্ন হয়েছে ও সন্তুষ্ট (Confirm & Complete)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body
);
}
