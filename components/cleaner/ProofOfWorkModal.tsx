"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Lenis from "lenis";
import {
  Camera,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Sparkles,
  ShieldCheck,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ProofOfWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  customerAddress: string;
  onSubmitComplete: (data?: {
    beforePhotos: string[];
    afterPhotos: string[];
    notes: string;
    checklist: any[];
  }) => Promise<void> | void;
}

export default function ProofOfWorkModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  customerAddress,
  onSubmitComplete,
}: ProofOfWorkModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Photos State
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, text: "High-Touch Surface Sanitization & Disinfection", done: true },
    { id: 2, text: "Sofa, Carpet & Mattress HEPA Vacuuming", done: true },
    { id: 3, text: "Kitchen Chimney, Oven & Stove Degreasing", done: true },
    { id: 4, text: "Bathroom Anti-Bacterial Tile & Glass Scrub", done: true },
    { id: 5, text: "Dust Repellent Spray & Polish Application", done: true },
    { id: 6, text: "Windows & Property Doors Secured", done: true },
  ]);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

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

  const handleBeforeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert("Photo size must be less than 5MB.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setBeforePhotos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAfterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert("Photo size must be less than 5MB.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setAfterPhotos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const toggleCheckitem = (id: number) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (beforePhotos.length === 0 || afterPhotos.length === 0) {
      toast.error(
        "অনুগ্রহ করে অন্তত ১টি পূর্বের (Before) এবং ১টি পরের (After) কাজের ছবি আপলোড করুন।"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitComplete({
        beforePhotos,
        afterPhotos,
        notes,
        checklist,
      });
      toast.success("🎉 কাজের ছবি ও ভেরিফিকেশন সফলভাবে সাবমিট হয়েছে!");
      onClose();
    } catch (err: any) {
      console.error("Proof submission error:", err);
      toast.error(err?.message || "ভেরিফিকেশন সাবমিট করতে সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150 overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl lg:max-w-5xl w-full border border-slate-200 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200 max-h-[88vh] overflow-y-auto overscroll-contain"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">Upload Proof of Work</h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {jobId}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {jobTitle} • {customerAddress}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
          {/* Section 1: Photos Grid (Before & After) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Before Photos Box */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                  Before Cleaning Photos
                </h4>
                <span className="text-[11px] font-bold text-amber-700">
                  {beforePhotos.length} Added
                </span>
              </div>

              <input
                type="file"
                ref={beforeInputRef}
                accept="image/*"
                multiple
                onChange={handleBeforeUpload}
                className="hidden"
              />

              {beforePhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {beforePhotos.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-amber-300 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="Before" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setBeforePhotos(beforePhotos.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => beforeInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-amber-300 bg-amber-100/50 text-amber-700 flex flex-col items-center justify-center font-bold text-xs hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mb-1" />
                    <span>+ Add</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => beforeInputRef.current?.click()}
                  className="w-full py-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-100/40 text-amber-800 font-bold flex flex-col items-center justify-center gap-1 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-amber-600" />
                  <span>Upload Before Photos</span>
                  <span className="text-[10px] text-amber-600 font-medium">Click to select images</span>
                </button>
              )}
            </div>

            {/* After Photos Box */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5">
                After Cleaning Photos
                </h4>
                <span className="text-[11px] font-bold text-emerald-700">
                  {afterPhotos.length} Added
                </span>
              </div>

              <input
                type="file"
                ref={afterInputRef}
                accept="image/*"
                multiple
                onChange={handleAfterUpload}
                className="hidden"
              />

              {afterPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {afterPhotos.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-300 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="After" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAfterPhotos(afterPhotos.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => afterInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-100/50 text-emerald-700 flex flex-col items-center justify-center font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mb-1" />
                    <span>+ Add</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => afterInputRef.current?.click()}
                  className="w-full py-6 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-100/40 text-emerald-800 font-bold flex flex-col items-center justify-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-emerald-600" />
                  <span>Upload After Photos</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Click to select images</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Quality Inspection Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#007eff]" /> Quality Checklist Verification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheckitem(item.id)}
                  className={`p-2.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    item.done
                      ? "bg-emerald-50/80 border-emerald-300 text-emerald-900 font-bold"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      item.done
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-slate-300"
                    }`}
                  >
                    {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Supervisor Notes */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Cleaning Supervisor Notes (Optional):</label>
            <textarea
              rows={2}
              placeholder="Add any specific notes for client or dispatcher..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium text-xs sm:text-sm focus:outline-none focus:border-[#007eff] focus:bg-white"
            />
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-2 border border-emerald-500 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>সাবমিট হচ্ছে ও প্রসেস চলছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Submit Proof & Mark Completed</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
