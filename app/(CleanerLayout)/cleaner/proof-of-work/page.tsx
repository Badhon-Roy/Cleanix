"use client";

import React, { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Star,
  Search,
  Calendar,
  User,
  MapPin,
  Sparkles,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

export default function ProofOfWorkHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const proofHistory = [
    {
      id: "CLN-2026-8890",
      jobTitle: "Move-In / Move-Out Deep Clean",
      customer: "Anisur Rahman",
      date: "Aug 20, 2026",
      rating: 5,
      review: "Team Delta did an amazing job! The kitchen chimny and sofa look spotless. Highly recommended!",
      beforePhoto: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      afterPhoto: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80",
      checklistCount: "6 of 6 Verified",
    },
    {
      id: "CLN-2026-8888",
      jobTitle: "Residential Bi-Weekly Cleaning",
      customer: "Mahmud Hasan",
      date: "Aug 18, 2026",
      rating: 5,
      review: "Very professional cleaners. On time check-in and dust repellent treatment worked great.",
      beforePhoto: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      afterPhoto: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      checklistCount: "6 of 6 Verified",
    },
  ];

  const filteredHistory = proofHistory.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 stroke-[2.5]" />
              </div>
              Proof of Work Photo Archive
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ BEFORE & AFTER PROOF
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Review uploaded before/after inspection photos and client rating feedback.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Job ID or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
          />
        </div>

        {/* Gallery Cards List */}
        <div className="space-y-6">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl border border-slate-200 bg-white space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                      #{item.id}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {item.jobTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Client: {item.customer} • Completed on {item.date}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 self-start sm:self-auto font-extrabold text-xs">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{item.rating}.0 Client Rating</span>
                </div>
              </div>

              {/* Before vs After Photos Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Photo */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
                    📸 BEFORE CLEANING
                  </span>
                  <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.beforePhoto}
                      alt="Before cleaning"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* After Photo */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                    ✨ AFTER CLEANING
                  </span>
                  <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.afterPhoto}
                      alt="After cleaning"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Review Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Client Feedback Review:</span>
                <p className="font-medium text-slate-800 italic">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
