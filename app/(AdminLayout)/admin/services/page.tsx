"use client";

import React, { useState } from "react";
import {
  Sliders,
  DollarSign,
  Plus,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calculator,
  Save,
  Check,
  X,
  Layers,
} from "lucide-react";
import AddServiceModal, { NewServiceFormData } from "@/components/admin/AddServiceModal";

export default function AdminServicesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pricingSavedSuccess, setPricingSavedSuccess] = useState(false);

  // Dynamic Pricing Multiplier Formula State
  const [dynamicPricingConfig, setDynamicPricingConfig] = useState({
    baseFee: "1500",
    sqftRate: "2.5",
    bedroomRate: "500",
    bathroomRate: "400",
  });

  // Package Catalog List
  const [packagesList, setPackagesList] = useState([
    {
      id: "PKG-BASIC",
      title: "BASIC PLAN",
      price: "৳6,000 / mo",
      visits: "2 Visits / Month (Bi-Weekly)",
      description: "Suitable for small apartments, 2 bedroom flats or small startup offices.",
      category: "SUBSCRIPTION",
      active: true,
      features: [
        "Bi-weekly routine cleaning visit",
        "Standard floor vacuum & damp mopping",
        "Kitchen & bathroom deep refresh spray",
        "Digital invoice & real-time tracking",
      ],
    },
    {
      id: "PKG-STANDARD",
      title: "STANDARD PLAN (POPULAR)",
      price: "৳14,000 / mo",
      visits: "4 Visits / Month (Weekly 1 Visit)",
      description: "Popular for medium & large families, commercial showrooms & office spaces.",
      category: "SUBSCRIPTION",
      active: true,
      features: [
        "Weekly deep cleaning visit (4 visits)",
        "Full kitchen & bathroom anti-bacterial sanitization",
        "Sofa, carpet & mattress dry vacuuming",
        "Interior window & glass sanitizing",
        "24/7 dedicated support team",
      ],
    },
    {
      id: "PKG-PREMIUM",
      title: "PREMIUM PLAN (VIP)",
      price: "৳30,000 / mo",
      visits: "8 Visits / Month (Bi-Weekly 2 Visits)",
      description: "High-end duplex villas, luxury corporate headquarters & VIP residences.",
      category: "SUBSCRIPTION",
      active: true,
      features: [
        "Bi-weekly 2 visits (8 total visits / month)",
        "Hospital-grade chemical & steam sanitization",
        "Oven, fridge & kitchen chimney deep care included",
        "Furniture wood/leather polish treatment",
        "Dedicated VIP Concierge Manager & Live GPS",
      ],
    },
  ]);

  // Add-on Services Catalog
  const [addonsList, setAddonsList] = useState([
    { id: "ADDON-1", name: "Oven Deep Wash & Degrease", price: "৳800", active: true },
    { id: "ADDON-2", name: "Refrigerator Deep Sanitization", price: "৳1,000", active: true },
    { id: "ADDON-3", name: "Sofa Shampoo & Steam Extraction", price: "৳1,500", active: true },
    { id: "ADDON-4", name: "Interior Window & Glass Polish", price: "৳1,200", active: true },
    { id: "ADDON-5", name: "Pet Hair & Hygiene Treatment", price: "৳900", active: true },
  ]);

  const handleSaveDynamicConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setPricingSavedSuccess(true);
    setTimeout(() => setPricingSavedSuccess(false), 3000);
  };

  const handleAddService = (data: NewServiceFormData) => {
    const newPkg = {
      id: `PKG-${Date.now()}`,
      title: data.title,
      price: data.price,
      visits: data.visits,
      description: data.description,
      category: data.category,
      active: true,
      features: ["Full deep sanitization included", "Professional cleaner team", "Satisfaction guaranteed"],
    };
    setPackagesList((prev) => [newPkg, ...prev]);
  };

  const togglePackageActive = (id: string) => {
    setPackagesList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const toggleAddonActive = (id: string) => {
    setAddonsList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Sliders className="w-6 h-6 stroke-[2.5]" />
              </div>
              Service Catalog & Dynamic Pricing Engine
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ LIVE PRICING ENGINE
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Configure monthly subscription packages, dynamic price calculation multipliers, and add-on services.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#007eff] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Service Package</span>
        </button>
      </div>

      {/* DYNAMIC PRICING ENGINE FORMULA CONFIGURATOR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#007eff]" /> Instant Estimate Dynamic Pricing Calculator Multipliers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Formula: Base Service Fee + (SqFt × Rate) + (Bedrooms × Rate) + (Bathrooms × Rate) + Addons
          </p>
        </div>

        {pricingSavedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Dynamic pricing engine multipliers saved successfully! (Changes live across calculator)</span>
          </div>
        )}

        <form onSubmit={handleSaveDynamicConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm">Base Service Fee (৳):</label>
            <input
              type="text"
              value={dynamicPricingConfig.baseFee}
              onChange={(e) => setDynamicPricingConfig({ ...dynamicPricingConfig, baseFee: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-black text-sm focus:outline-none focus:border-[#007eff]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm">Per SqFt Rate (৳):</label>
            <input
              type="text"
              value={dynamicPricingConfig.sqftRate}
              onChange={(e) => setDynamicPricingConfig({ ...dynamicPricingConfig, sqftRate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-black text-sm focus:outline-none focus:border-[#007eff]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm">Per Bedroom Rate (৳):</label>
            <input
              type="text"
              value={dynamicPricingConfig.bedroomRate}
              onChange={(e) => setDynamicPricingConfig({ ...dynamicPricingConfig, bedroomRate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-black text-sm focus:outline-none focus:border-[#007eff]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm">Per Bathroom Rate (৳):</label>
            <input
              type="text"
              value={dynamicPricingConfig.bathroomRate}
              onChange={(e) => setDynamicPricingConfig({ ...dynamicPricingConfig, bathroomRate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-black text-sm focus:outline-none focus:border-[#007eff]"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-blue-400" />
              <span>Update Pricing Formula</span>
            </button>
          </div>
        </form>
      </div>

      {/* PACKAGE CATALOG MANAGEMENT */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#007eff]" /> Monthly Subscription Packages Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage packages displayed on customer subscription section and instant estimator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packagesList.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-5 transition-all ${
                pkg.active
                  ? "bg-white border-slate-200 hover:border-blue-300"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-base">{pkg.title}</h3>
                  <button
                    type="button"
                    onClick={() => togglePackageActive(pkg.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold cursor-pointer border ${
                      pkg.active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {pkg.active ? "ACTIVE" : "HIDDEN"}
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl font-black text-[#007eff]">{pkg.price}</p>
                  <p className="text-xs font-extrabold text-slate-700">{pkg.visits}</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">{pkg.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  {pkg.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007eff] flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => togglePackageActive(pkg.id)}
                  className="w-full py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  {pkg.active ? "Disable Package" : "Enable Package"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD-ON SERVICES CATALOG */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-600" /> Add-On Cleaning Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Enable or disable extra add-on services for dynamic booking checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {addonsList.map((addon) => (
            <div
              key={addon.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{addon.name}</p>
                <p className="text-xs font-black text-purple-700">{addon.price}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleAddonActive(addon.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold cursor-pointer border ${
                  addon.active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-200 text-slate-600 border-slate-300"
                }`}
              >
                {addon.active ? "ON" : "OFF"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Render Add Service Portal Modal */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddService}
      />
    </div>
  );
}
