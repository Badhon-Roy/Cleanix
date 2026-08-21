"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Truck, UserCheck, CheckCircle2, ShieldCheck, Phone } from "lucide-react";

interface AssignCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef: string;
  customerName: string;
  serviceTitle: string;
  onAssign: (teamName: string) => void;
}

export default function AssignCleanerModal({
  isOpen,
  onClose,
  bookingRef,
  customerName,
  serviceTitle,
  onAssign,
}: AssignCleanerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("Team Delta (Supervisor Rahat)");
  const [dispatchNote, setDispatchNote] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const teams = [
    {
      id: "delta",
      name: "Team Delta (Supervisor Rahat)",
      lead: "Rahat Karim (+880 1700-999888)",
      van: "Toyota Van Unit #04",
      hub: "Gulshan Hub",
    },
    {
      id: "alpha",
      name: "Team Alpha (Supervisor Selim)",
      lead: "Selim Reza (+880 1811-223344)",
      van: "Toyota Van Unit #01",
      hub: "Dhanmondi Hub",
    },
    {
      id: "bravo",
      name: "Team Bravo (Supervisor Shakil)",
      lead: "Shakil Ahmed (+880 1911-556677)",
      van: "Nissan Van Unit #02",
      hub: "Banani Hub",
    },
    {
      id: "echo",
      name: "Team Echo (Supervisor Anisur)",
      lead: "Anisur Rahman (+880 1912-334455)",
      van: "HiAce Van Unit #03",
      hub: "Uttara Hub",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(selectedTeam);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#007eff]" /> Assign Cleaner Team
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Booking Ref: <span className="text-[#007eff] font-extrabold">{bookingRef}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Summary Box */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 space-y-1">
          <p className="text-xs font-extrabold text-blue-900">Service: {serviceTitle}</p>
          <p className="text-xs text-slate-700 font-medium">Customer: <span className="font-bold">{customerName}</span></p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800">Select Field Cleaner Team:</label>
            <div className="space-y-2.5 mt-2">
              {teams.map((t) => (
                <label
                  key={t.id}
                  onClick={() => setSelectedTeam(t.name)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedTeam === t.name
                      ? "bg-blue-50 border-blue-400 ring-2 ring-blue-500/20"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{t.lead} • {t.hub}</p>
                  </div>
                  <input
                    type="radio"
                    name="team"
                    checked={selectedTeam === t.name}
                    onChange={() => setSelectedTeam(t.name)}
                    className="w-4 h-4 text-[#007eff] focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800">Dispatch Notes for Cleaner (Optional):</label>
            <textarea
              rows={2}
              value={dispatchNote}
              onChange={(e) => setDispatchNote(e.target.value)}
              placeholder="e.g. Bring extra industrial carpet steamer for VIP living room"
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-[#007eff] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Dispatch Team</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
