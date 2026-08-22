"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Truck,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Sliders,
  DollarSign,
  Info,
} from "lucide-react";

export interface BookingDetailRecord {
  id: string;
  customer: string;
  phone: string;
  email: string;
  service: string;
  area: string;
  address: string;
  sqft: number;
  specs: string;
  addons: string[];
  amount: string;
  paymentStatus: string;
  date: string;
  time: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
  cleanerTeam: string;
}

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetailRecord | null;
  onStatusChange: (newStatus: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED") => void;
  onOpenAssignModal: () => void;
}

export default function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
  onStatusChange,
  onOpenAssignModal,
}: BookingDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !booking) return null;

  const stages = [
    { key: "PENDING", label: "Pending Dispatch", desc: "Waiting for team assignment" },
    { key: "ASSIGNED", label: "Team Assigned", desc: "Cleaner team dispatched" },
    { key: "IN_PROGRESS", label: "In Progress", desc: "Cleaners on site working" },
    { key: "COMPLETED", label: "Completed", desc: "Work completed & verified" },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === booking.status);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        className="relative max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl text-slate-900 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      >
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#007eff] flex items-center justify-center flex-shrink-0">
            <Truck className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-[#007eff] bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
                #{booking.id}
              </span>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {booking.paymentStatus}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {booking.service}
            </h3>
          </div>
        </div>

        {/* Status Stage Progress Bar */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="text-xs font-extrabold text-[#11233F] uppercase tracking-wider block">
            Service Progress Stage Tracker:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stages.map((st, idx) => {
              const isActive = idx <= currentStageIndex;
              const isCurrent = st.key === booking.status;

              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => onStatusChange(st.key as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[#007eff] text-white border-[#007eff] shadow-sm"
                      : isActive
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="text-xs font-black leading-tight">{idx + 1}. {st.label}</p>
                  <p className={`text-[10px] mt-0.5 font-medium ${isCurrent ? "text-blue-100" : "text-slate-500"}`}>
                    {st.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
          {/* Customer & Address */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="font-extrabold text-[#11233F] text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
              Customer &amp; Location:
            </h4>
            <div className="space-y-1">
              <p className="font-extrabold text-slate-900 text-sm">{booking.customer}</p>
              <p className="font-bold text-[#007eff] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {booking.phone}
              </p>
              <p className="text-slate-600 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {booking.email}
              </p>
              <p className="text-slate-700 font-semibold pt-1 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{booking.area} — {booking.address}</span>
              </p>
            </div>
          </div>

          {/* Property & Addons */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="font-extrabold text-[#11233F] text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
              Property Specs &amp; Add-ons:
            </h4>
            <div className="space-y-1">
              <p className="font-extrabold text-slate-900">{booking.specs}</p>
              <p className="text-xs text-[#007eff] font-bold">Total Area: {booking.sqft} sqft</p>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Selected Add-on Wash Services:</span>
                <div className="flex flex-wrap gap-1">
                  {booking.addons.map((ad, i) => (
                    <span key={i} className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                      + {ad}
                    </span>
                  ))}
                  {booking.addons.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No add-ons selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule & Billing */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="font-extrabold text-[#11233F] text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
              Schedule &amp; Billing:
            </h4>
            <div className="space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" /> {booking.date}
              </p>
              <p className="text-xs text-amber-700 font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" /> {booking.time}
              </p>
              <p className="font-black text-emerald-700 text-lg pt-1">
                {booking.amount}
              </p>
            </div>
          </div>

          {/* Cleaner Team Assignment */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-[#11233F] text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                Assigned Cleaner Team:
              </h4>
              <p className="font-extrabold text-slate-900 text-sm mt-2">{booking.cleanerTeam}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAssignModal();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Truck className="w-4 h-4" />
              <span>{booking.cleanerTeam === "Unassigned" ? "Assign Cleaner Team" : "Reassign Team"}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
