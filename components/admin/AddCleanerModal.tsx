"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { X, UserPlus, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Truck, ShieldCheck } from "lucide-react";

interface AddCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCleaner: NewCleanerFormData) => void;
}

export interface NewCleanerFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  hub: string;
  vehicleVan: string;
}

export default function AddCleanerModal({
  isOpen,
  onClose,
  onAdd,
}: AddCleanerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewCleanerFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "Senior Technician",
      hub: "Gulshan Hub",
      vehicleVan: "Toyota Van Unit #05",
    },
  });

  if (!isOpen || !mounted) return null;

  const onSubmitForm = (data: NewCleanerFormData) => {
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
              <UserPlus className="w-5 h-5 text-[#007eff]" /> Register New Cleaner Staff
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Add a certified pro cleaner to dispatch hubs.
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
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800">Cleaner Full Name:</label>
            <input
              type="text"
              placeholder="e.g. Shakil Ahmed"
              {...register("name", { required: "Cleaner name is required" })}
              className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:bg-white ${
                errors.name ? "border-red-400 bg-red-50/30" : "border-slate-200 focus:border-[#007eff]"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800">Email Address:</label>
              <input
                type="email"
                placeholder="shakil@cleanix.com"
                {...register("email", { required: "Email is required" })}
                className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:bg-white ${
                  errors.email ? "border-red-400 bg-red-50/30" : "border-slate-200 focus:border-[#007eff]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800">Phone Number:</label>
              <input
                type="text"
                placeholder="+880 1700-000000"
                {...register("phone", { required: "Phone number is required" })}
                className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:bg-white ${
                  errors.phone ? "border-red-400 bg-red-50/30" : "border-slate-200 focus:border-[#007eff]"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Role & Hub Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800">Role Designation:</label>
              <select
                {...register("role")}
                className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] cursor-pointer"
              >
                <option value="Team Supervisor">Team Supervisor</option>
                <option value="Senior Technician">Senior Technician</option>
                <option value="Equipment Operator">Equipment Operator</option>
                <option value="Junior Cleaner">Junior Cleaner</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800">Assigned Hub:</label>
              <select
                {...register("hub")}
                className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] cursor-pointer"
              >
                <option value="Gulshan Hub">Gulshan Hub</option>
                <option value="Dhanmondi Hub">Dhanmondi Hub</option>
                <option value="Banani Hub">Banani Hub</option>
                <option value="Uttara Hub">Uttara Hub</option>
              </select>
            </div>
          </div>

          {/* Vehicle Van */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800">Assigned Service Van:</label>
            <input
              type="text"
              placeholder="e.g. Toyota TownAce Unit #05"
              {...register("vehicleVan")}
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
              <span>Save & Activate Cleaner</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
