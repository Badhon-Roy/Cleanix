"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Check,
  X,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CleanerJobRequest {
  id: string;
  cleanerId: string;
  cleanerName: string;
  cleanerPhone: string;
  cleanerRating: number;
  completedJobs: number;
  bookingId: string;
  customerName: string;
  serviceType: string;
  address: string;
  timeSlot: string;
  requestedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function CleanerRequestsPage() {
  const [requests, setRequests] = useState<CleanerJobRequest[]>([
    {
      id: "REQ-901",
      cleanerId: "CLN-101",
      cleanerName: "Asif Khan",
      cleanerPhone: "+880 1711-123456",
      cleanerRating: 4.9,
      completedJobs: 48,
      bookingId: "CLN-2026-8894",
      customerName: "Mahmudul Haq",
      serviceType: "Commercial Office Deep Clean",
      address: "Suite 7B, Concord Tower, Banani",
      timeSlot: "02:30 PM - 05:30 PM",
      requestedAt: "15 mins ago",
      status: "PENDING",
    },
    {
      id: "REQ-902",
      cleanerId: "CLN-102",
      cleanerName: "Kamrul Islam",
      cleanerPhone: "+880 1819-234567",
      cleanerRating: 4.8,
      completedJobs: 35,
      bookingId: "CLN-2026-8894",
      customerName: "Mahmudul Haq",
      serviceType: "Commercial Office Deep Clean",
      address: "Suite 7B, Concord Tower, Banani",
      timeSlot: "02:30 PM - 05:30 PM",
      requestedAt: "8 mins ago",
      status: "PENDING",
    },
    {
      id: "REQ-900",
      cleanerId: "CLN-103",
      cleanerName: "Sajjad Hossain",
      cleanerPhone: "+880 1912-345678",
      cleanerRating: 4.9,
      completedJobs: 52,
      bookingId: "CLN-2026-8891",
      customerName: "Tanvir Hasan",
      serviceType: "Standard Plan Visit #2",
      address: "House 42, Road 11, Gulshan-2",
      timeSlot: "10:00 AM - 01:00 PM",
      requestedAt: "2 hours ago",
      status: "APPROVED",
    },
  ]);

  const handleAction = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              INTRA-TEAM DISPATCH APPROVAL
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {pendingCount} Pending Request(s)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Cleaner Job Requests Approval Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            টিম আলফার ক্লিনাররা জবে কাজ করার জন্য যে আবেদন পাঠিয়েছে তা পর্যালোচনা করে এপ্রুভ বা রিজেক্ট করুন।
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className={`p-6 rounded-3xl border transition-all shadow-xs ${
              req.status === "PENDING"
                ? "bg-white border-amber-200 hover:border-amber-300"
                : req.status === "APPROVED"
                ? "bg-emerald-50/40 border-emerald-200"
                : "bg-slate-50 border-slate-200 opacity-70"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Cleaner Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#007eff] text-white flex items-center justify-center font-black text-base flex-shrink-0 shadow-xs">
                  {req.cleanerName.substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-base">{req.cleanerName}</h3>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
                      ⭐ {req.cleanerRating} ({req.completedJobs} Jobs)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Requested {req.requestedAt}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">Phone: {req.cleanerPhone}</p>

                  <div className="pt-2">
                    <span className="text-xs font-black text-[#007eff] uppercase">Target Job #{req.bookingId}:</span>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">{req.serviceType} • {req.customerName}</p>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {req.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status or Actions */}
              <div className="flex items-center gap-3 self-end lg:self-auto">
                {req.status === "PENDING" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAction(req.id, "REJECTED")}
                      className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(req.id, "APPROVED")}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Approve & Assign Job
                    </button>
                  </>
                ) : (
                  <span
                    className={`text-xs font-extrabold px-4 py-2 rounded-2xl flex items-center gap-1.5 ${
                      req.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {req.status === "APPROVED" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved & Assigned
                      </>
                    ) : (
                      "Rejected"
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
