"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Sliders,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Tag,
  DollarSign,
  Star,
  Eye,
  EyeOff,
  Gift,
} from "lucide-react";

export interface PackageData {
  id: string;
  title: string;
  price: string;
  visits?: string;
  description: string;
  category?: string;
  active: boolean;
  isPopular: boolean;
  isAddonFree?: boolean;
  features: string[];
}

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: PackageData;
  onSave: (updatedPackage: PackageData) => void;
}

export default function EditPackageModal({
  isOpen,
  onClose,
  packageData,
  onSave,
}: EditPackageModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState(packageData.title || "");
  const [price, setPrice] = useState(packageData.price?.replace(/^৳\s*/, "") || "");
  const [description, setDescription] = useState(packageData.description || "");
  const [active, setActive] = useState<boolean>(packageData.active ?? true);
  const [isPopular, setIsPopular] = useState<boolean>(packageData.isPopular ?? false);
  const [isAddonFree, setIsAddonFree] = useState<boolean>(packageData.isAddonFree ?? false);
  const [features, setFeatures] = useState<string[]>(packageData.features || []);
  const [newFeatureInput, setNewFeatureInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (packageData) {
      setTitle(packageData.title || "");
      setPrice(packageData.price?.replace(/^৳\s*/, "") || "");
      setDescription(packageData.description || "");
      setActive(packageData.active ?? true);
      setIsPopular(packageData.isPopular ?? false);
      setIsAddonFree(packageData.isAddonFree ?? false);
      setFeatures(packageData.features || []);
    }
  }, [packageData]);

  if (!isOpen || !mounted) return null;

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFeatures((prev) => [...prev, newFeatureInput.trim()]);
    setNewFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFeatures((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPriceVal = price.trim().replace(/^৳\s*/, "");
    const formattedPrice = cleanPriceVal ? `৳${cleanPriceVal}` : packageData.price;

    onSave({
      ...packageData,
      title: title.trim() || packageData.title,
      price: formattedPrice,
      description: description.trim() || packageData.description,
      category: packageData.category || "SUBSCRIPTION",
      active,
      isPopular,
      isAddonFree,
      features: features.filter((f) => f.trim().length > 0),
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6 scroll-smooth"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Sliders className="w-6 h-6 stroke-[2.5]" />
              </div>
              Edit Package Details
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Modify pricing, feature list, and active visibility for <span className="text-[#007eff] font-bold">{packageData.title}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
          {/* Top Field Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Package Title */}
            <div className="space-y-2">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <Tag className="w-4 h-4 text-[#007eff]" /> Package Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. BASIC, STANDARD, PREMIUM"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-bold text-sm focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
              />
            </div>

            {/* Price Tag with Auto ৳ Prefix Badge */}
            <div className="space-y-2">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <DollarSign className="w-4 h-4 text-[#007eff]" /> Price Tag:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-900 font-black text-base select-none pointer-events-none">
                  ৳
                </span>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/^৳\s*/, ""))}
                  placeholder="14,000"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Status Toggles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-5">
            <div className="flex items-center justify-between sm:justify-center gap-3 p-3 bg-white rounded-2xl border border-slate-200">
              <span className="font-extrabold text-slate-700 text-xs sm:text-sm flex items-center gap-1.5">
                {active ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />} Status:
              </span>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer border transition-colors ${
                  active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-slate-100 text-slate-500 border-slate-300"
                }`}
              >
                {active ? "ACTIVE" : "HIDDEN"}
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-center gap-3 p-3 bg-white rounded-2xl border border-slate-200">
              <span className="font-extrabold text-slate-700 text-xs sm:text-sm flex items-center gap-1.5">
                <Star className={`w-4 h-4 ${isPopular ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} /> Highlight:
              </span>
              <button
                type="button"
                onClick={() => setIsPopular(!isPopular)}
                className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer border transition-colors ${
                  isPopular
                    ? "bg-amber-50 text-amber-700 border-amber-300"
                    : "bg-slate-100 text-slate-500 border-slate-300"
                }`}
              >
                {isPopular ? "POPULAR" : "NORMAL"}
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-center gap-3 p-3 bg-white rounded-2xl border border-slate-200">
              <span className="font-extrabold text-slate-700 text-xs sm:text-sm flex items-center gap-1.5">
                <Gift className={`w-4 h-4 ${isAddonFree ? "text-emerald-600" : "text-slate-400"}`} /> Free Addons:
              </span>
              <button
                type="button"
                onClick={() => setIsAddonFree(!isAddonFree)}
                className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer border transition-colors ${
                  isAddonFree
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-slate-100 text-slate-500 border-slate-300"
                }`}
              >
                {isAddonFree ? "🎁 100% FREE" : "PAID ADDONS"}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm">Package Description & Scope:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter brief target customer or scope (e.g. ছোট বাসা বা ছোট স্টার্টআপ অফিস)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-medium text-sm focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>

          {/* Package Features List */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#007eff]" /> Included Feature Bullets ({features.length}):
              </span>
            </label>

            {/* Feature Add Input */}
            <div className="flex gap-3 max-w-3xl">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Type a new feature bullet and press Add..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-6 py-3 bg-[#007eff] hover:bg-blue-600 text-white rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Bullet
              </button>
            </div>

            {/* Feature Items Grid */}
            <div
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 pt-2 scroll-smooth"
            >
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-3 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#007eff] flex-shrink-0" />
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 cursor-pointer transition-colors"
                    title="Remove feature bullet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {features.length === 0 && (
                <p className="col-span-full text-xs text-slate-400 italic py-3 text-center border border-dashed border-slate-200 rounded-2xl">
                  No feature bullets added yet. Add some above.
                </p>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-[#007eff] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
