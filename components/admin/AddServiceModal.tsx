"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { X, Sliders, CheckCircle2, AlertCircle, DollarSign, Sparkles } from "lucide-react";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newService: NewServiceFormData) => void;
}

export interface NewServiceFormData {
  title: string;
  price: string;
  category: string;
  visits: string;
  description: string;
}

export default function AddServiceModal({
  isOpen,
  onClose,
  onAdd,
}: AddServiceModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewServiceFormData>({
    defaultValues: {
      title: "",
      price: "",
      category: "SUBSCRIPTION",
      visits: "4 Visits / Month",
      description: "",
    },
  });

  if (!isOpen || !mounted) return null;

  const onSubmitForm = (data: NewServiceFormData) => {
    onAdd(data);
    reset();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#007eff]" /> Create / Edit Service Package
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Add new cleaning package or addon to Cleanix catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 text-xs sm:text-sm">
          {/* Package Title */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800">Package Title:</label>
            <input
              type="text"
              placeholder="e.g. ULTRA DEEP SANITIZATION PLAN"
              {...register("title", { required: "Package title is required" })}
              className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:bg-white ${
                errors.title ? "border-red-400 bg-red-50/30" : "border-slate-200 focus:border-[#007eff]"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title.message}
              </p>
            )}
          </div>

          {/* Price & Visits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800">Monthly Price (৳):</label>
              <input
                type="text"
                placeholder="e.g. ৳18,000"
                {...register("price", { required: "Price is required" })}
                className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:bg-white ${
                  errors.price ? "border-red-400 bg-red-50/30" : "border-slate-200 focus:border-[#007eff]"
                }`}
              />
              {errors.price && (
                <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800">Category Type:</label>
              <select
                {...register("category")}
                className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] cursor-pointer"
              >
                <option value="SUBSCRIPTION">Monthly Subscription</option>
                <option value="ONE_TIME">One-Time Service</option>
                <option value="ADDON">Add-on Service</option>
              </select>
            </div>
          </div>

          {/* Frequency Visits */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800">Included Visits / Frequency:</label>
            <input
              type="text"
              placeholder="e.g. 4 Visits / Month (Weekly 1 Visit)"
              {...register("visits")}
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800">Service Highlights & Scope:</label>
            <textarea
              rows={3}
              placeholder="Describe inclusions (e.g. Hospital-grade steam sanitization, furniture polish)"
              {...register("description")}
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-[#007eff] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Publish Package</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
