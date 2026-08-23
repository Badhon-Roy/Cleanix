"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { MapPin, X, Home, Building, Plus, AlertCircle, Save } from "lucide-react";
import { ILocationData } from "@/services/locationService";

export interface NewAddressFormData {
  tag: string;
  street: string;
  area: string;
  city: string;
  zip: string;
  type: "home" | "office";
}

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (data: NewAddressFormData) => void;
  initialValues?: ILocationData | null;
}

export default function AddLocationModal({
  isOpen,
  onClose,
  onAddLocation,
  initialValues,
}: AddLocationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewAddressFormData>({
    defaultValues: {
      tag: "",
      street: "",
      area: "Gulshan-2",
      city: "Dhaka",
      zip: "1212",
      type: "home",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        tag: initialValues.tag || "",
        street: initialValues.street || "",
        area: initialValues.area || "Gulshan-2",
        city: initialValues.city || "Dhaka",
        zip: initialValues.zip || "1212",
        type: (initialValues.type as "home" | "office") || "home",
      });
    } else {
      reset({
        tag: "",
        street: "",
        area: "Gulshan-2",
        city: "Dhaka",
        zip: "1212",
        type: "home",
      });
    }
  }, [initialValues, isOpen, reset]);

  const selectedType = watch("type");

  if (!isOpen || !mounted) return null;

  const onSubmitForm = (data: NewAddressFormData) => {
    onAddLocation(data);
  };

  const isEditing = !!initialValues;

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {isEditing ? "Edit Service Location" : "Add New Service Location"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isEditing
                  ? "সার্ভিস লোকেশনের তথ্য আপডেট করুন।"
                  : "নতুন সার্ভিস ডিলিভারি লোকেশন যুক্ত করুন।"}
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

        {/* Modal Form using React Hook Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 text-xs sm:text-sm">
          {/* Location Type Buttons */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">Property Type:</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => setValue("type", "home")}
                className={`py-2.5 px-4 rounded-2xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedType === "home"
                    ? "bg-[#007eff] text-white border-[#007eff]"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home / Apartment</span>
              </button>

              <button
                type="button"
                onClick={() => setValue("type", "office")}
                className={`py-2.5 px-4 rounded-2xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedType === "office"
                    ? "bg-[#007eff] text-white border-[#007eff]"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Commercial Office</span>
              </button>
            </div>
          </div>

          {/* Location Name / Tag */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">Location Tag / Title:</label>
            <input
              type="text"
              placeholder="e.g. Home (Primary), Beach House, Banani Office"
              {...register("tag", {
                required: "Location title tag is required",
                minLength: { value: 2, message: "Tag must be at least 2 characters" },
              })}
              className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3.5 text-slate-900 font-bold focus:outline-none focus:bg-white ${
                errors.tag ? "border-red-400 focus:border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#007eff]"
              }`}
            />
            {errors.tag && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.tag.message}
              </p>
            )}
          </div>

          {/* Street Address */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">Street & House Address:</label>
            <input
              type="text"
              placeholder="House 42, Road 11, Block D"
              {...register("street", {
                required: "Street address is required",
              })}
              className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3.5 text-slate-900 font-bold focus:outline-none focus:bg-white ${
                errors.street ? "border-red-400 focus:border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#007eff]"
              }`}
            />
            {errors.street && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.street.message}
              </p>
            )}
          </div>

          {/* Area, City & Zip Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Area:</label>
              <input
                type="text"
                placeholder="Gulshan-2"
                {...register("area", { required: "Area required" })}
                className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">City:</label>
              <input
                type="text"
                placeholder="Dhaka"
                {...register("city", { required: "City required" })}
                className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Zip:</label>
              <input
                type="text"
                placeholder="1212"
                {...register("zip")}
                className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] focus:bg-white"
              />
            </div>
          </div>

          {/* Buttons CTA */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 border border-blue-400"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Location</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Save & Add Location</span>
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
