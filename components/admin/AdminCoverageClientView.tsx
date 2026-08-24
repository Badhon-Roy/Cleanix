"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  PlusCircle,
  Search,
  Check,
  X,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  FolderOpen,
  Building,
  Globe,
  Tag,
  Hash,
  ShieldCheck,
  Navigation,
  ChevronRight,
  Clock,
} from "lucide-react";

import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  ICoverageArea,
  CreateCoveragePayload,
  fetchAllCoveragesAPI,
  createCoverageAPI,
  updateCoverageAPI,
  deleteCoverageAPI,
} from "@/services/coverageService";

interface AdminCoverageClientViewProps {
  initialCoverages: ICoverageArea[];
}

interface CoverageFormValues {
  zoneName: string;
  district: string;
  desc: string;
}

export default function AdminCoverageClientView({
  initialCoverages = [],
}: AdminCoverageClientViewProps) {
  // Coverage Areas State
  const [coverages, setCoverages] = useState<ICoverageArea[]>(initialCoverages);

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // React Hook Form Integration
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CoverageFormValues>({
    defaultValues: {
      zoneName: "",
      district: "Dhaka",
      desc: "",
    },
  });

  const [formAreasIncluded, setFormAreasIncluded] = useState<string[]>([]);
  const [formAreaInput, setFormAreaInput] = useState("");
  const [formZipCodes, setFormZipCodes] = useState<string[]>([]);
  const [formZipInput, setFormZipInput] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Search Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // Re-fetch Data manually
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const fetched = await fetchAllCoveragesAPI();
      setCoverages(fetched);
    } catch (err) {
      console.error("Error refreshing coverages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time Socket.IO Live Data Synchronization (No page reload)
  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("⚡ Coverage Socket connected:", socket.id);
    });

    socket.on("coverage_updated", async () => {
      try {
        const updated = await fetchAllCoveragesAPI();
        setCoverages(updated);
      } catch (err) {
        console.error("Socket update fetch failed:", err);
      }
    });

    return () => {
      socket.off("coverage_updated");
      socket.disconnect();
    };
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      zoneName: "",
      district: "Dhaka",
      desc: "",
    });
    setFormAreasIncluded(["Gulshan 1", "Gulshan 2", "Banani"]);
    setFormAreaInput("");
    setFormZipCodes(["1212", "1213"]);
    setFormZipInput("");
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (coverage: ICoverageArea) => {
    setEditingId(coverage.id);
    reset({
      zoneName: coverage.zoneName,
      district: coverage.district || "Dhaka",
      desc: coverage.desc || "",
    });
    setFormAreasIncluded(coverage.areasIncluded || []);
    setFormAreaInput("");
    setFormZipCodes(coverage.zipCodes || []);
    setFormZipInput("");
    setFormIsActive(coverage.isActive !== false);
    setIsModalOpen(true);
  };

  // Add Area Tag
  const handleAddAreaTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formAreaInput.trim()) return;
    if (!formAreasIncluded.includes(formAreaInput.trim())) {
      setFormAreasIncluded([...formAreasIncluded, formAreaInput.trim()]);
    }
    setFormAreaInput("");
  };

  // Remove Area Tag
  const handleRemoveAreaTag = (areaToRemove: string) => {
    setFormAreasIncluded(formAreasIncluded.filter((a) => a !== areaToRemove));
  };

  // Add Zip Tag
  const handleAddZipTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formZipInput.trim()) return;
    if (!formZipCodes.includes(formZipInput.trim())) {
      setFormZipCodes([...formZipCodes, formZipInput.trim()]);
    }
    setFormZipInput("");
  };

  // Remove Zip Tag
  const handleRemoveZipTag = (zipToRemove: string) => {
    setFormZipCodes(formZipCodes.filter((z) => z !== zipToRemove));
  };

  const onSubmit = async (data: CoverageFormValues) => {
    if (formAreasIncluded.length === 0) {
      toast.error("Please add at least one sub-area included in this zone!");
      return;
    }

    const payload: CreateCoveragePayload = {
      zoneName: data.zoneName.trim(),
      desc: data.desc.trim(),
      district: data.district.trim(),
      areasIncluded: formAreasIncluded,
      zipCodes: formZipCodes,
      isActive: formIsActive,
    };

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateCoverageAPI(editingId, payload);
      } else {
        await createCoverageAPI(payload);
      }

      setIsModalOpen(false);
      await refreshData();
    } catch (err) {
      console.error("Failed to save coverage area:", err);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCoverageStatus = async (coverage: ICoverageArea) => {
    const newStatus = !coverage.isActive;
    setCoverages((prev) =>
      prev.map((c) =>
        c.id === coverage.id ? { ...c, isActive: newStatus } : c,
      ),
    );

    try {
      await updateCoverageAPI(coverage.id, { isActive: newStatus });
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDeleteCoverage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coverage area zone?"))
      return;

    setCoverages((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteCoverageAPI(id);
    } catch (err) {
      console.error("Failed to delete coverage area:", err);
    }
  };

  const filteredCoverages = coverages.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.zoneName.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.areasIncluded.some((a) => a.toLowerCase().includes(q))
    );
  });

  const totalDistricts = new Set(coverages.map((c) => c.district)).size;
  const totalSubAreas = coverages.reduce(
    (acc, c) => acc + (c.areasIncluded?.length || 0),
    0,
  );
  const activeCount = coverages.filter((c) => c.isActive).length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Service Coverage Area Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            ক্লিনিক্স সার্ভিসের কভারেজ জোন, জেলা ও সকল অন্তর্ভুক্ত সাব-এরিয়া
            সমূহের রিয়েল-টাইম তথ্য পরিচালনা করুন।
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={refreshData}
            title="Refresh Data"
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer border border-slate-200"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-[#007eff]" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-3 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Coverage Zone</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50/40 border border-blue-200 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">
              মোট কভারেজ জোন
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#007eff] border border-blue-200 flex items-center justify-center">
              <MapPin className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {coverages.length} টি জোন
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/40 border border-emerald-200 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">
              সক্রিয় কভারেজ এলাকা
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {activeCount} টি সক্রিয়
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50/70 via-white to-slate-50/40 border border-purple-200 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">
              মোট সাব-এরিয়া অন্তর্ভুক্ত
            </span>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center">
              <Navigation className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {totalSubAreas} টি এলাকা
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50/40 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">
              অন্তর্ভুক্ত জেলা
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center">
              <Globe className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {totalDistricts} টি জেলা
          </p>
        </div>
      </div>

      {/* Main Coverage List Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#007eff]" /> কভারেজ এরিয়া তালিকা
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              প্রজেক্টের কভারেজ জোন, এলাকা এবং জিপকোডের ডাটাবেস তথ্য।
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search zone, district or sub-area..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#007eff] transition-all"
            />
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#007eff] mx-auto" />
            <p className="text-xs font-bold text-slate-500">
              কভারেজ ডাটাবেস থেকে তথ্য লোড হচ্ছে...
            </p>
          </div>
        ) : filteredCoverages.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50 p-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center mx-auto">
              <FolderOpen className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-800">
                কোন কভারেজ জোন পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                ডাটাবেসে এখনো কোনো কভারেজ এরিয়া যুক্ত করা হয়নি। নতুন কভারেজ জোন
                তৈরি করতে উপরের বাটনে ক্লিক করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-xl bg-[#007eff] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>প্রথম কভারেজ জোন যোগ করুন</span>
            </button>
          </div>
        ) : (
          /* Coverage Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCoverages.map((coverage) => (
              <div
                key={coverage.id}
                className={`p-6 rounded-3xl border transition-all space-y-4 flex flex-col justify-between ${
                  coverage.isActive
                    ? "bg-white border-slate-200 hover:border-blue-300"
                    : "bg-slate-50 border-slate-200 opacity-75"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-100 flex items-center justify-center font-black flex-shrink-0">
                        <MapPin className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                          {coverage.zoneName}
                        </h3>
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                          <Globe className="w-3 h-3 text-blue-500" />
                          District: {coverage.district}
                        </span>
                      </div>
                    </div>

                    {/* Real UI Sliding Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCoverageStatus(coverage)}
                        role="switch"
                        aria-checked={coverage.isActive}
                        title={`Click to ${coverage.isActive ? "deactivate" : "activate"} zone`}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          coverage.isActive ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            coverage.isActive
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider ${coverage.isActive ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {coverage.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                  </div>

                  {/* Included Sub-Areas Section */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#007eff]" />
                      Included Areas ({coverage.areasIncluded.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {coverage.areasIncluded.map((area, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200/60"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Zip Codes if present */}
                  {coverage.zipCodes && coverage.zipCodes.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <Hash className="w-3 h-3 text-slate-400" />
                        Zip Codes:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {coverage.zipCodes.map((zip, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            {zip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description if present */}
                  {coverage.desc && (
                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                      {coverage.desc}
                    </p>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(coverage)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCoverage(coverage.id)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
                    title="Delete Coverage Zone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Coverage Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className="bg-white w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-9 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {editingId
                    ? "কভারেজ জোন সম্পাদনা করুন"
                    : "নতুন কভারেজ জোন যোগ করুন"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  জোন নাম, জেলা এবং অন্তর্ভুক্ত সকল সাব-এরিয়া যুক্ত করুন।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                    Zone Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("zoneName", { required: "Zone Name is required" })}
                    placeholder="e.g. Gulshan & Banani Zone"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none ${
                      errors.zoneName
                        ? "border-red-500 focus:border-red-600 bg-red-50/20"
                        : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.zoneName && (
                    <span className="text-red-500 text-xs font-bold mt-1 block">
                      {errors.zoneName.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("district", { required: "District is required" })}
                    placeholder="e.g. Dhaka"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none ${
                      errors.district
                        ? "border-red-500 focus:border-red-600 bg-red-50/20"
                        : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.district && (
                    <span className="text-red-500 text-xs font-bold mt-1 block">
                      {errors.district.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                  Description (Optional)
                </label>
                <textarea
                  {...register("desc")}
                  rows={2}
                  placeholder="e.g. Premium house cleaning service zone covering Gulshan and Banani."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              {/* Interactive Tag Adder for Sub-Areas Included */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                  Included Sub-Areas (Add area & press enter or click Add)
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formAreaInput}
                    onChange={(e) => setFormAreaInput(e.target.value)}
                    placeholder="e.g. Gulshan 2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAreaTag();
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                  />
                  <button
                    type="button"
                    onClick={handleAddAreaTag}
                    className="px-4 py-2.5 rounded-xl bg-blue-50 text-[#007eff] font-bold text-xs sm:text-sm border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    + Add Area
                  </button>
                </div>

                {/* Sub-Areas Pill Cloud */}
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 min-h-[50px]">
                  {formAreasIncluded.map((area, idx) => (
                    <span
                      key={idx}
                      className="text-xs sm:text-sm font-bold px-3 py-1 rounded-xl bg-white text-blue-900 border border-blue-200 flex items-center gap-1.5 shadow-2xs"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveAreaTag(area)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Tag Adder for Zip Codes */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                  Zip Codes (Optional)
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formZipInput}
                    onChange={(e) => setFormZipInput(e.target.value)}
                    placeholder="e.g. 1212"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddZipTag();
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                  />
                  <button
                    type="button"
                    onClick={handleAddZipTag}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    + Add Zip
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {formZipCodes.map((zip, idx) => (
                    <span
                      key={idx}
                      className="text-xs sm:text-sm font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5"
                    >
                      {zip}
                      <button
                        type="button"
                        onClick={() => handleRemoveZipTag(zip)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#007eff] focus:ring-0 cursor-pointer"
                />
                <label
                  htmlFor="isActiveToggle"
                  className="font-bold text-slate-800 text-xs sm:text-sm cursor-pointer"
                >
                  Is Operational Active Zone
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {editingId ? "আপডেট সংরক্ষণ করুন" : "জোন সংরক্ষণ করুন"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
