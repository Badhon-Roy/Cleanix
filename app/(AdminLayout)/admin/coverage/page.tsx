"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Navigation,
  X,
  Save,
  Check,
  Power,
  Sparkles,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  CoverageAreaItem,
  getStoredCoverageAreas,
  addCoverageArea,
  updateCoverageArea,
  deleteCoverageArea,
} from "@/lib/coverageData";

export default function AdminCoverageManagementPage() {
  const [areas, setAreas] = useState<CoverageAreaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CoverageAreaItem | null>(null);

  // Form State matching exact fields
  const [formArea, setFormArea] = useState("");
  const [formTag, setFormTag] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formBtnLabel, setFormBtnLabel] = useState("");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const loadData = () => {
    setAreas(getStoredCoverageAreas());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("cleanix_coverage_areas_updated", handleUpdate);
    return () => {
      window.removeEventListener("cleanix_coverage_areas_updated", handleUpdate);
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormArea("");
    setFormTag("RESIDENTIAL & MEDICAL");
    setFormTime("30 Mins SLA");
    setFormDesc("");
    setFormBtnLabel("");
    setFormStatus("ACTIVE");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CoverageAreaItem) => {
    setEditingItem(item);
    setFormArea(item.area);
    setFormTag(item.tag);
    setFormTime(item.time);
    setFormDesc(item.desc);
    setFormBtnLabel(item.btnLabel || `Book in ${item.area.split(" ")[0]}`);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formArea.trim() || !formDesc.trim()) {
      toast.error("Please fill in the Area Name and Description.");
      return;
    }

    const computedBtnLabel =
      formBtnLabel.trim() || `Book in ${formArea.trim().split(" ")[0]}`;

    if (editingItem) {
      // Update
      const updated = updateCoverageArea(editingItem.id, {
        area: formArea,
        tag: formTag,
        time: formTime,
        desc: formDesc,
        btnLabel: computedBtnLabel,
        status: formStatus,
      });
      setAreas(updated);
      toast.success(`Coverage Area "${formArea}" updated successfully!`);
    } else {
      // Add
      addCoverageArea({
        area: formArea,
        tag: formTag,
        time: formTime,
        desc: formDesc,
        btnLabel: computedBtnLabel,
        status: formStatus,
      });
      toast.success(`New Coverage Area "${formArea}" added successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (item: CoverageAreaItem) => {
    const nextStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const updated = updateCoverageArea(item.id, { status: nextStatus });
    setAreas(updated);
    toast.info(`"${item.area}" status changed to ${nextStatus}`);
  };

  const handleDelete = (id: string, areaName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${areaName}" from coverage zones?`
    );
    if (confirmDelete) {
      const updated = deleteCoverageArea(id);
      setAreas(updated);
      toast.error(`"${areaName}" removed from coverage zones.`);
    }
  };

  // Search & Filter Logic
  const filteredAreas = areas.filter((item) => {
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.area.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q) ||
      (item.btnLabel && item.btnLabel.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const totalCount = areas.length;
  const activeCount = areas.filter((a) => a.status === "ACTIVE").length;
  const inactiveCount = areas.filter((a) => a.status === "INACTIVE").length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Clean Header Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 stroke-[2.5]" />
              </div>
              Coverage Area & Dispatch Zones Manager
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ LIVE ZONE DISPATCH
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Add new coverage areas, configure response SLA times (e.g., 30 Mins SLA), button labels, and manage active Dhaka dispatch hubs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Coverage Area</span>
        </button>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Covered Zones */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Covered Zones
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{totalCount} Areas</p>
          <p className="text-xs font-semibold text-slate-500">Full Dhaka Metropolitan Network</p>
        </div>

        {/* Active Dispatch Hubs */}
        <div className="bg-emerald-50/40 border border-emerald-300/80 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
              Active Dispatch Hubs
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-950 tracking-tight">{activeCount} Zones</p>
          <p className="text-xs font-bold text-emerald-800">Live booking acceptance enabled</p>
        </div>

        {/* Average SLA Time */}
        <div className="bg-blue-50/40 border border-blue-300/80 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900">
              Average SLA Response
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-950 tracking-tight">25-30 Mins</p>
          <p className="text-xs font-medium text-slate-500">Cleaner team dispatch SLA</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: `All Zones (${totalCount})` },
              { id: "ACTIVE", label: `Active (${activeCount})` },
              { id: "INACTIVE", label: `Inactive (${inactiveCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-[#007eff] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Area, Tag, SLA Time..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Coverage Cards Grid (Matching Website Design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAreas.map((item) => {
            const buttonText =
              item.btnLabel || `Book in ${item.area.split(" ")[0]}`;

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all relative overflow-hidden ${
                  item.status === "ACTIVE"
                    ? "border-slate-200/80 hover:border-[#007eff]/60"
                    : "border-slate-200 bg-slate-50/60 opacity-75"
                }`}
              >
                {/* Top SLA Badge Pill (Matching Website Top Right Corner) */}
                <div className="absolute top-0 right-0 bg-[#0d274c] text-white text-[10px] sm:text-xs font-black uppercase px-4 py-1.5 rounded-bl-2xl border-b border-l border-white/20">
                  ★ {item.time}
                </div>

                {/* Card Main Content */}
                <div className="pt-2 space-y-3">
                  {/* Map Pin Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-[#007eff]/10 text-[#007eff] flex items-center justify-center mb-4 border border-[#007eff]/20">
                    <MapPin className="w-6 h-6 stroke-[2.5]" />
                  </div>

                  {/* Area Title */}
                  <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-[#001837] leading-snug">
                    {item.area}
                  </h3>

                  {/* Subtitle Category Tag */}
                  <p className="text-[#007eff] font-extrabold text-xs uppercase tracking-wider">
                    {item.tag}
                  </p>

                  {/* Bengali / English Description */}
                  <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>

                {/* Card Footer: Button Preview & Admin Control Bar */}
                <div className="space-y-4 pt-2">
                  {/* Book Button Preview */}
                  <div className="bg-[#0d274c] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl w-full flex items-center justify-between">
                    <span>{buttonText}</span>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#007eff] text-white">
                      <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Admin Control Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                        item.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                      }`}
                      title="Toggle Active / Inactive"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{item.status === "ACTIVE" ? "Active" : "Disabled"}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-colors cursor-pointer"
                        title="Edit Area Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.area)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                        title="Delete Area"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAreas.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium">
              No coverage zones found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT COVERAGE AREA MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-extrabold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingItem ? "Edit Coverage Area" : "Add New Coverage Area"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {editingItem ? editingItem.id : "Create new Dhaka service hub zone"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Area Name (e.g. DHANMONDI & LALMATIA):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHANMONDI & LALMATIA"
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Category Tag:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RESIDENTIAL & MEDICAL"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    SLA Response Time:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 Mins SLA"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Booking Button Text (e.g. Book in Dhanmondi):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Book in Dhanmondi"
                  value={formBtnLabel}
                  onChange={(e) => setFormBtnLabel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Description / Service Details (Bangla / English):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. ধানমন্ডি ও লালমাটিয়া এলাকার ডুপ্লেক্স ও রেনোভেশন ক্লিনিং কেয়ার।"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Zone Status:
                </label>
                <CustomZoneStatusDropdown
                  value={formStatus}
                  onChange={(val) => setFormStatus(val)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? "Save Changes" : "Create Area"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomZoneStatusDropdown({
  value,
  onChange,
}: {
  value: "ACTIVE" | "INACTIVE";
  onChange: (val: "ACTIVE" | "INACTIVE") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { value: "ACTIVE" | "INACTIVE"; label: string; desc: string }[] = [
    {
      value: "ACTIVE",
      label: "ACTIVE",
      desc: "Accepting Bookings",
    },
    {
      value: "INACTIVE",
      label: "INACTIVE",
      desc: "Temporarily Disabled",
    },
  ];

  const currentOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] flex items-center justify-between cursor-pointer transition-all hover:bg-slate-100/60"
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              value === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          <span className="text-xs sm:text-sm font-extrabold">
            {currentOption.label} <span className="text-slate-500 font-semibold">({currentOption.desc})</span>
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-2 z-50 bg-white border border-slate-200/90 rounded-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-between transition-colors cursor-pointer ${
                value === opt.value
                  ? "bg-blue-50 text-[#007eff]"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    opt.value === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                <span>
                  {opt.label} <span className="text-slate-500 font-medium">({opt.desc})</span>
                </span>
              </div>
              {value === opt.value && <Check className="w-4 h-4 text-[#007eff]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
