"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sliders,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  Layers,
} from "lucide-react";
import EditPackageModal, { PackageData } from "@/components/admin/EditPackageModal";
import DeleteCardConfirmModal from "@/components/admin/DeleteCardConfirmModal";

export function PricingStarIcon() {
  return (
    <div className="w-8 h-8 text-[#007eff] flex items-center justify-center mb-4">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
      </svg>
    </div>
  );
}

export default function ManagePlansPage() {
  const [selectedPackageForEdit, setSelectedPackageForEdit] = useState<PackageData | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<PackageData | null>(null);

  // Package Catalog List
  const [packagesList, setPackagesList] = useState<PackageData[]>([
    {
      id: "BASIC",
      title: "BASIC",
      price: "৳6,000",
      visits: "2 Visits / Month (Bi-Weekly)",
      description: "ছোট বাসা বা ছোট স্টার্টআপ অফিস",
      category: "SUBSCRIPTION",
      active: true,
      isPopular: false,
      features: [
        "মাসে ২ বার রুটিন হোম ক্লিনিং",
        "ফ্লোর মোছা, ভ্যাকুয়াম ও ডাস্টিং",
        "রান্নাঘর ও বাথরুম ডিপ রিফ্রেশ",
        "অনলাইন সাপোর্ট ও ইনভয়েস",
        "রিয়েল-টাইম ট্র্যাকিং অ্যালার্ট",
      ],
    },
    {
      id: "STANDARD",
      title: "STANDARD",
      price: "৳14,000",
      visits: "4 Visits / Month (Weekly 1 Visit)",
      description: "মাঝারি পরিবার ও কমার্শিয়াল শোরুমের পছন্দ",
      category: "SUBSCRIPTION",
      active: true,
      isPopular: true,
      features: [
        "মাসে ৪ বার (সাপ্তাহিক ১ বার) ডিপ ক্লিন",
        "অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজেশন",
        "সোফা, কার্পেট ও মেট্রেস ড্রায়ার",
        "গ্লাস ও উইন্ডো স্যানিটাইজিং",
        "২৪/৭ ডেডিকেটেড ফোন ও চ্যাট",
      ],
    },
    {
      id: "PREMIUM",
      title: "PREMIUM",
      price: "৳30,000",
      visits: "8 Visits / Month (Bi-Weekly 2 Visits)",
      description: "বড় কর্পোরেট অফিস ও ডুপ্লেক্স ভিলা",
      category: "SUBSCRIPTION",
      active: true,
      isPopular: false,
      features: [
        "মাসে ৮ বার মাস্টার ক্লিনিং",
        "হসপিটাল-গ্রেড স্টিম স্যানিটাইজ",
        "ওভেন, ফ্রিজ ও কিচেন চিমনি কেয়ার",
        "ভিআইপি কনসিয়ার্জ ও লাইভ জিপিএস",
        "সাপ্তাহিক কোয়ালিটি রিপোর্ট",
      ],
    },
  ]);

  const handleSaveEditedPackage = (updatedPkg: PackageData) => {
    setPackagesList((prev) => {
      const exists = prev.some((p) => p.id === updatedPkg.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p));
      }
      return [...prev, updatedPkg];
    });
  };

  const handleConfirmDelete = () => {
    if (!packageToDelete) return;
    setPackagesList((prev) => prev.filter((p) => p.id !== packageToDelete.id));
    setPackageToDelete(null);
  };

  const togglePackageActive = (id: string) => {
    setPackagesList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleAddNewPackage = () => {
    const newPkg: PackageData = {
      id: `PKG-${Date.now()}`,
      title: "CUSTOM PLAN",
      price: "৳10,000",
      visits: "3 Visits / Month",
      description: "Custom subscription package created by admin",
      category: "SUBSCRIPTION",
      active: true,
      isPopular: false,
      features: ["Full deep sanitization included", "Professional cleaner team", "24/7 support"],
    };
    setSelectedPackageForEdit(newPkg);
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header with Breadcrumb Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#007eff] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Customers & Plans
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Sliders className="w-6 h-6 stroke-[2.5]" />
              </div>
              Pricing Grid & Subscription Plans Manager
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Manage subscription pricing grid cards, package feature lists, rates, and active statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNewPackage}
          className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#007eff] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Plan Card</span>
        </button>
      </div>

      {/* Pricing Cards Grid Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#007eff]" /> Active Pricing Grid Cards ({packagesList.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              These plan cards match the exact visual design served across the platform pricing grid.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {packagesList.map((plan) => {
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 sm:p-9 bg-white flex flex-col justify-between relative transition-all duration-300 ${
                  isPopular
                    ? "border-2 border-[#007eff] md:-translate-y-2 z-10"
                    : "border border-slate-200/90"
                } ${!plan.active ? "opacity-60 bg-slate-50" : ""}`}
              >
                {/* Top Badges */}
                {isPopular && (
                  <span className="bg-[#007eff] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full px-4 py-1.5 absolute -top-3.5 right-7 border border-blue-400">
                    ★ MOST POPULAR
                  </span>
                )}

                {/* Active Status Badge / Toggle */}
                <button
                  type="button"
                  onClick={() => togglePackageActive(plan.id)}
                  className={`absolute top-7 right-7 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border cursor-pointer transition-colors ${
                    plan.active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-slate-100 text-slate-500 border-slate-300"
                  }`}
                >
                  {plan.active ? "✓ ACTIVE" : "HIDDEN"}
                </button>

                <div>
                  <PricingStarIcon />

                  <h3 className="text-[#001837] font-black text-2xl tracking-wide uppercase mb-1">
                    {plan.title}
                  </h3>

                  <p
                    className={`font-extrabold text-xs sm:text-sm mb-6 ${
                      isPopular ? "text-[#007eff]" : "text-slate-500"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#001837] tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                      / মাস (Monthly)
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 border-t border-slate-100 pt-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                        <span className="text-[#001837] font-bold text-xs sm:text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Card Action Buttons */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPackageForEdit(plan)}
                    className="flex-1 font-semibold text-xs sm:text-sm py-3 px-5 rounded-full bg-[#007eff] hover:bg-[#0066ee] text-white border border-blue-400 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Features & Price</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPackageToDelete(plan)}
                    className="p-3 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                    title="Delete Package Card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Render Edit Package Portal Modal when editing/adding */}
      {selectedPackageForEdit && (
        <EditPackageModal
          isOpen={!!selectedPackageForEdit}
          onClose={() => setSelectedPackageForEdit(null)}
          packageData={selectedPackageForEdit}
          onSave={handleSaveEditedPackage}
        />
      )}

      {/* Render Delete Confirmation Modal */}
      {packageToDelete && (
        <DeleteCardConfirmModal
          isOpen={!!packageToDelete}
          onClose={() => setPackageToDelete(null)}
          onConfirm={handleConfirmDelete}
          cardTitle={packageToDelete.title}
        />
      )}
    </div>
  );
}
