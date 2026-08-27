"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Sliders,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  Layers,
  Loader2,
} from "lucide-react";
import EditPackageModal, { PackageData } from "@/components/admin/EditPackageModal";
import DeleteCardConfirmModal from "@/components/admin/DeleteCardConfirmModal";
import {
  IPlan,
  fetchAllPlansAPI,
  createPlanAPI,
  updatePlanAPI,
  deletePlanAPI,
} from "@/services/planService";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

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
  const [packagesList, setPackagesList] = useState<IPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackageForEdit, setSelectedPackageForEdit] = useState<PackageData | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<PackageData | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllPlansAPI();
      setPackagesList(data);
    } catch (err) {
      console.error("Error loading plans:", err);
      toast.error("Failed to load pricing plans");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ [manage-plans] Socket connected:", socket.id);
    });

    socket.on("plan_updated", () => {
      loadPlans();
    });

    socket.on("disconnect", () => {
      console.log("🔌 [manage-plans] Socket disconnected");
    });

    return () => {
      socket.off("plan_updated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loadPlans]);

  const handleSaveEditedPackage = async (updatedPkg: PackageData) => {
    try {
      if (isNewPlan) {
        const res = await createPlanAPI({
          id: updatedPkg.id,
          title: updatedPkg.title,
          price: updatedPkg.price,
          subtitleBn: updatedPkg.description,
          category: updatedPkg.category || "SUBSCRIPTION",
          active: updatedPkg.active,
          isPopular: updatedPkg.isPopular,
          features: updatedPkg.features,
        });
        if (res && res.success) {
          toast.success("New pricing plan created successfully!");
          loadPlans();
        } else {
          toast.error(res?.message || "Failed to create plan");
        }
      } else {
        const targetId = (updatedPkg as any)._id || updatedPkg.id;
        const res = await updatePlanAPI(targetId, {
          title: updatedPkg.title,
          price: updatedPkg.price,
          subtitleBn: updatedPkg.description,
          active: updatedPkg.active,
          isPopular: updatedPkg.isPopular,
          features: updatedPkg.features,
        });
        if (res && res.success) {
          toast.success("Pricing plan updated successfully!");
          loadPlans();
        } else {
          toast.error(res?.message || "Failed to update plan");
        }
      }
    } catch (err) {
      console.error("Error saving plan:", err);
      toast.error("Error saving plan");
    } finally {
      setSelectedPackageForEdit(null);
      setIsNewPlan(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!packageToDelete) return;
    try {
      const targetId = (packageToDelete as any)._id || packageToDelete.id;
      const res = await deletePlanAPI(targetId);
      if (res && res.success) {
        toast.success("Pricing plan deleted successfully.");
        loadPlans();
      } else {
        toast.error(res?.message || "Failed to delete plan");
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
      toast.error("Error deleting plan");
    } finally {
      setPackageToDelete(null);
    }
  };

  const togglePackageActive = async (plan: IPlan) => {
    try {
      const targetId = plan._id || plan.id;
      const res = await updatePlanAPI(targetId, { active: !plan.active });
      if (res && res.success) {
        toast.success(`Plan ${plan.title} is now ${!plan.active ? "ACTIVE" : "HIDDEN"}`);
        setPackagesList((prev) =>
          prev.map((p) => (p.id === plan.id || p._id === targetId ? { ...p, active: !p.active } : p))
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handleAddNewPackage = () => {
    setIsNewPlan(true);
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
                  onClick={() => togglePackageActive(plan)}
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
                    {plan.subtitleBn}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#001837] tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                      {plan.pricePeriodBn || "/ মাস (Monthly)"}
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
                    onClick={() => {
                      setIsNewPlan(false);
                      setSelectedPackageForEdit({
                        id: plan.id,
                        title: plan.title,
                        price: plan.price,
                        description: plan.subtitleBn || "",
                        category: plan.category || "SUBSCRIPTION",
                        active: plan.active,
                        isPopular: plan.isPopular,
                        features: plan.features,
                        _id: plan._id,
                      } as any);
                    }}
                    className="flex-1 font-semibold text-xs sm:text-sm py-3 px-5 rounded-full bg-[#007eff] hover:bg-[#0066ee] text-white border border-blue-400 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Features & Price</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPackageToDelete({
                        id: plan.id,
                        title: plan.title,
                        price: plan.price,
                        description: plan.subtitleBn || "",
                        category: plan.category || "SUBSCRIPTION",
                        active: plan.active,
                        isPopular: plan.isPopular,
                        features: plan.features,
                        _id: plan._id,
                      } as any)
                    }
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
