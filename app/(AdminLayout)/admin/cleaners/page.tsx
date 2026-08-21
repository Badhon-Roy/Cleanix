"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Truck,
  Star,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
} from "lucide-react";
import AddCleanerModal, { NewCleanerFormData } from "@/components/admin/AddCleanerModal";

export default function AdminCleanersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hubFilter, setHubFilter] = useState("ALL");

  const [cleanersList, setCleanersList] = useState([
    {
      id: "CLN-STAFF-101",
      name: "Rahat Karim",
      role: "Team Supervisor",
      email: "rahat.karim@cleanix.com",
      phone: "+880 1700-999888",
      hub: "Gulshan Hub",
      van: "Toyota Van Unit #04",
      completedJobs: 48,
      rating: 4.95,
      dutyStatus: "ON_DUTY",
      active: true,
    },
    {
      id: "CLN-STAFF-102",
      name: "Selim Reza",
      role: "Senior Technician",
      email: "selim.reza@cleanix.com",
      phone: "+880 1811-223344",
      hub: "Dhanmondi Hub",
      van: "Toyota Van Unit #01",
      completedJobs: 36,
      rating: 4.92,
      dutyStatus: "ON_DUTY",
      active: true,
    },
    {
      id: "CLN-STAFF-103",
      name: "Shakil Ahmed",
      role: "Equipment Operator",
      email: "shakil.ahmed@cleanix.com",
      phone: "+880 1911-556677",
      hub: "Banani Hub",
      van: "Nissan Van Unit #02",
      completedJobs: 29,
      rating: 4.88,
      dutyStatus: "OFF_DUTY",
      active: true,
    },
    {
      id: "CLN-STAFF-104",
      name: "Anisur Rahman",
      role: "Senior Cleaner",
      email: "anisur.r@cleanix.com",
      phone: "+880 1912-334455",
      hub: "Uttara Hub",
      van: "HiAce Van Unit #03",
      completedJobs: 52,
      rating: 4.98,
      dutyStatus: "ON_DUTY",
      active: true,
    },
  ]);

  const handleAddCleaner = (data: NewCleanerFormData) => {
    const newEntry = {
      id: `CLN-STAFF-${101 + cleanersList.length}`,
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      hub: data.hub,
      van: data.vehicleVan,
      completedJobs: 0,
      rating: 5.0,
      dutyStatus: "ON_DUTY",
      active: true,
    };
    setCleanersList((prev) => [newEntry, ...prev]);
  };

  const toggleCleanerActive = (id: string) => {
    setCleanersList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const filteredCleaners = cleanersList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHub = hubFilter === "ALL" ? true : c.hub === hubFilter;

    return matchesSearch && matchesHub;
  });

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              Pro Cleaner Staff CRM Directory
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ⚡ 16 CERTIFIED CLEANERS
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Manage cleaner staff profiles, assigned service vans, hub dispatch locations, and active duty status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#007eff] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Register New Cleaner</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Hub Filter Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Filter Hub:</span>
            <select
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff] cursor-pointer"
            >
              <option value="ALL">All Hub Locations</option>
              <option value="Gulshan Hub">Gulshan Hub</option>
              <option value="Dhanmondi Hub">Dhanmondi Hub</option>
              <option value="Banani Hub">Banani Hub</option>
              <option value="Uttara Hub">Uttara Hub</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Cleaner Name or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Cleaners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCleaners.map((c) => (
            <div
              key={c.id}
              className={`p-6 rounded-3xl border transition-all space-y-4 ${
                c.active
                  ? "bg-white border-slate-200 hover:border-blue-300"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#007eff] text-white flex items-center justify-center font-black text-base border-2 border-white shadow-xs">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      {c.name}
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {c.rating} ★
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{c.role} • {c.id}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCleanerActive(c.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold cursor-pointer border transition-colors ${
                    c.active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                      : "bg-red-50 text-red-700 border-red-200 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {c.active ? "ACTIVE STAFF" : "SUSPENDED"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Contact Info:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#007eff]" /> {c.phone}
                  </p>
                  <p className="text-slate-600 font-medium">{c.email}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Hub & Vehicle:</span>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" /> {c.hub}
                  </p>
                  <p className="text-[#007eff] font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#007eff]" /> {c.van}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Total Jobs Completed: <strong className="text-slate-900 font-black">{c.completedJobs}</strong></span>
                <span className={c.dutyStatus === "ON_DUTY" ? "text-emerald-700 font-black" : "text-slate-400 font-medium"}>
                  {c.dutyStatus === "ON_DUTY" ? "⚡ ONLINE / ON-DUTY" : "OFF-DUTY"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Render Add Cleaner Portal Modal */}
      <AddCleanerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCleaner}
      />
    </div>
  );
}
