"use client";

import React, { useState } from "react";
import {
  Truck, MapPin, Clock, Phone, UserCheck, Users, Search, Check, X, DollarSign,
} from "lucide-react";

interface TeamBooking {
  id: string; customerName: string; customerPhone: string; address: string;
  area: string; serviceType: string; packageType: string; timeSlot: string;
  status: "PENDING_DISPATCH" | "IN_PROGRESS" | "COMPLETED";
  assignedCleaners: string[]; totalPrice: number; leaderCommission: number; cleanerPayout: number;
}
interface TeamCleaner { id: string; name: string; phone: string; status: "ON_DUTY" | "IN_SERVICE" | "OFF_DUTY"; }

interface Props { teamSlug: string; }

export default function TeamBookingsView({ teamSlug }: Props) {
  const [filter, setFilter] = useState<"ALL" | "PENDING_DISPATCH" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookingForDispatch, setSelectedBookingForDispatch] = useState<TeamBooking | null>(null);
  const [selectedCleanersForDispatch, setSelectedCleanersForDispatch] = useState<string[]>([]);
  const [availableCleaners] = useState<TeamCleaner[]>([
    { id: "CLN-101", name: "Asif Khan", phone: "+880 1711-123456", status: "IN_SERVICE" },
    { id: "CLN-102", name: "Kamrul Islam", phone: "+880 1819-234567", status: "ON_DUTY" },
    { id: "CLN-103", name: "Sajjad Hossain", phone: "+880 1912-345678", status: "ON_DUTY" },
    { id: "CLN-104", name: "Mahfuzur Rahman", phone: "+880 1611-456789", status: "ON_DUTY" },
  ]);
  const [bookings, setBookings] = useState<TeamBooking[]>([
    { id: "CLN-2026-8891", customerName: "Tanvir Hasan", customerPhone: "+880 1711-223344", address: "House 42, Road 11, Block D, Gulshan-2", area: "Gulshan-2", serviceType: "Standard Plan Visit #2 - Bi-weekly", packageType: "Standard Plan (৳14,000/mo)", timeSlot: "10:00 AM - 01:00 PM", status: "IN_PROGRESS", assignedCleaners: ["Asif Khan", "Kamrul Islam"], totalPrice: 14000, leaderCommission: 350, cleanerPayout: 1400 },
    { id: "CLN-2026-8894", customerName: "Mahmudul Haq", customerPhone: "+880 1822-445566", address: "Suite 7B, Concord Tower, Banani", area: "Banani", serviceType: "Commercial Office Deep Clean", packageType: "Custom One-Time Booking", timeSlot: "02:30 PM - 05:30 PM", status: "PENDING_DISPATCH", assignedCleaners: [], totalPrice: 8500, leaderCommission: 850, cleanerPayout: 3400 },
    { id: "CLN-2026-8890", customerName: "Anisur Rahman", customerPhone: "+880 1912-334455", address: "Apartment 5B, Navana Tower, Gulshan-1", area: "Gulshan-1", serviceType: "Premium Plan Visit #4 - Master Clean", packageType: "Premium Plan (৳30,000/mo)", timeSlot: "09:00 AM - 12:00 PM", status: "COMPLETED", assignedCleaners: ["Sajjad Hossain", "Asif Khan"], totalPrice: 30000, leaderCommission: 375, cleanerPayout: 1500 },
  ]);

  const openDispatchModal = (booking: TeamBooking) => { setSelectedBookingForDispatch(booking); setSelectedCleanersForDispatch(booking.assignedCleaners); };
  const toggleCleanerSelection = (name: string) => setSelectedCleanersForDispatch(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  const handleSaveDispatch = () => {
    if (!selectedBookingForDispatch) return;
    setBookings(prev => prev.map(b => b.id === selectedBookingForDispatch.id ? { ...b, assignedCleaners: selectedCleanersForDispatch, status: selectedCleanersForDispatch.length > 0 ? "IN_PROGRESS" : "PENDING_DISPATCH" } : b));
    setSelectedBookingForDispatch(null);
  };
  const filteredBookings = bookings.filter(b => {
    if (filter !== "ALL" && b.status !== filter) return false;
    if (searchQuery) { const q = searchQuery.toLowerCase(); return b.id.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q) || b.area.toLowerCase().includes(q); }
    return true;
  });

  return (
    <div className="space-y-8 pb-12 w-full">
      <div className="bg-gradient-to-r from-[#0d274c] via-slate-900 to-[#007eff] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />TEAM ALPHA DISPATCH HUB</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">50% - 10% - 40% Split Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Assigned Team Bookings &amp; Dispatch Manager</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">অ্যাডমিন কর্তৃক টিম আলফায় অ্যাসাইন হওয়া সার্ভিসসমূহ পর্যালোচনা করুন এবং টিমের ১ বা একাধিক ক্লিনার সিলেক্ট করে কাজ বন্টন করুন।</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["ALL", "PENDING_DISPATCH", "IN_PROGRESS", "COMPLETED"] as const).map(st => (
            <button key={st} type="button" onClick={() => setFilter(st)} className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer ${filter === st ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"}`}>
              {st === "ALL" ? "All Jobs" : st === "PENDING_DISPATCH" ? "Pending Allocation" : st === "IN_PROGRESS" ? "In Progress" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by job ID, customer name, or area..." className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#007eff] transition-all shadow-xs" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBookings.map(booking => (
          <div key={booking.id} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div><span className="text-xs font-black text-[#007eff] uppercase tracking-wider">{booking.id}</span><h3 className="font-extrabold text-slate-900 text-base mt-0.5">{booking.customerName}</h3></div>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${booking.status === "PENDING_DISPATCH" ? "bg-amber-100 text-amber-800 border border-amber-200" : booking.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`}>
                  {booking.status === "PENDING_DISPATCH" ? "Pending Cleaner Allocation" : booking.status === "IN_PROGRESS" ? "In Progress" : "Completed"}
                </span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100"><p className="font-extrabold text-slate-900 text-sm">{booking.serviceType}</p><p className="text-slate-500 font-medium mt-0.5">{booking.packageType}</p></div>
                <div className="flex items-start gap-2 pt-1"><MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" /><span className="font-medium text-slate-800">{booking.address}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400 flex-shrink-0" /><span>Time Slot: <strong className="text-slate-800">{booking.timeSlot}</strong></span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400 flex-shrink-0" /><span>Phone: <strong className="text-slate-800">{booking.customerPhone}</strong></span></div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#007eff]" />Assigned Team Cleaners:</span>
                  <span className="text-[11px] font-black text-[#007eff]">{booking.assignedCleaners.length} Cleaner(s)</span>
                </div>
                {booking.assignedCleaners.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">{booking.assignedCleaners.map(c => <span key={c} className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white text-slate-800 border border-blue-200">✓ {c}</span>)}</div>
                ) : <p className="text-[11px] font-bold text-amber-700">⚠ No cleaners assigned yet. Click below to allocate team members.</p>}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100"><span className="text-slate-500 font-bold block text-[10px] uppercase">Leader 10% Cut</span><span className="text-emerald-700 font-black text-sm">৳{booking.leaderCommission}</span></div>
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100"><span className="text-slate-500 font-bold block text-[10px] uppercase">Cleaner 40% Pool</span><span className="text-blue-700 font-black text-sm">৳{booking.cleanerPayout}</span></div>
              </div>
            </div>
            <div className="pt-4">
              <button type="button" onClick={() => openDispatchModal(booking)} className="w-full py-3 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20">
                <UserCheck className="w-4 h-4" /><span>{booking.assignedCleaners.length > 0 ? "Update Assigned Cleaners" : "Assign Cleaners to Job"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedBookingForDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div><span className="text-xs font-black text-[#007eff] uppercase">JOB #{selectedBookingForDispatch.id}</span><h3 className="text-lg font-extrabold text-slate-900">Assign Team Cleaners</h3></div>
              <button type="button" onClick={() => setSelectedBookingForDispatch(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">টিম আলফার অধীনস্থ ১ জন বা একাধিক সার্টিফাইড ক্লিনার নির্বাচন করুন যারা এই সার্ভিসটিতে কাজ করবে:</p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableCleaners.map(cleaner => {
                  const isSelected = selectedCleanersForDispatch.includes(cleaner.name);
                  return (
                    <div key={cleaner.id} onClick={() => toggleCleanerSelection(cleaner.name)} className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${isSelected ? "bg-blue-50/80 border-[#007eff] shadow-xs" : "bg-slate-50 border-slate-200 hover:border-slate-300"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${isSelected ? "bg-[#007eff] border-[#007eff] text-white" : "bg-white border-slate-300"}`}>{isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}</div>
                        <div><p className="text-xs font-extrabold text-slate-900">{cleaner.name}</p><p className="text-[11px] text-slate-500 font-medium">{cleaner.phone}</p></div>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${cleaner.status === "ON_DUTY" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>{cleaner.status === "ON_DUTY" ? "On Duty" : "In Service"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => setSelectedBookingForDispatch(null)} className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">Cancel</button>
              <button type="button" onClick={handleSaveDispatch} className="flex-1 py-3 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md shadow-blue-500/20">Confirm Allocation ({selectedCleanersForDispatch.length})</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
