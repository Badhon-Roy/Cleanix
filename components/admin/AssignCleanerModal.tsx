"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Truck, CheckCircle2, Loader2, Users, MapPin, Crown } from "lucide-react";
import { fetchAllTeamsAPI, TeamSquad } from "@/services/teamService";

interface AssignCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef: string;
  customerName: string;
  serviceTitle: string;
  onAssign: (teamId: string, teamName: string, notes?: string) => Promise<boolean | void> | boolean | void;
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
  const [teams, setTeams] = useState<TeamSquad[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [dispatchNote, setDispatchNote] = useState("");

  useEffect(() => {
    setMounted(true);
    const loadTeams = async () => {
      setLoadingTeams(true);
      try {
        const data = await fetchAllTeamsAPI(true);
        if (Array.isArray(data) && data.length > 0) {
          setTeams(data);
          setSelectedTeamId(data[0].id);
          setSelectedTeamName(`${data[0].teamName} (${data[0].teamCode})`);
        }
      } catch (err) {
        console.error("Error fetching teams for modal:", err);
      } finally {
        setLoadingTeams(false);
      }
    };

    if (isOpen) {
      loadTeams();
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = selectedTeamId || (teams.length > 0 ? teams[0].id : "");
    const targetName = selectedTeamName || (teams.length > 0 ? `${teams[0].teamName} (${teams[0].teamCode})` : "");

    if (!targetId && teams.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await onAssign(targetId, targetName, dispatchNote);
      if (res !== false) {
        onClose();
      }
    } catch (err) {
      console.error("Assign error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#007eff]" /> Assign Field Team
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Booking Ref: <span className="text-[#007eff] font-extrabold">{bookingRef}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
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

            {loadingTeams ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <Loader2 className="w-6 h-6 text-[#007eff] animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-600">Loading registered teams database...</p>
              </div>
            ) : teams.length > 0 ? (
              <div
                className="space-y-2.5 mt-2 max-h-60 overflow-y-auto pr-1"
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
              >
                {teams.map((t) => {
                  const displayName = `${t.teamName} (${t.teamCode})`;
                  const isSelected = selectedTeamId === t.id;
                  const memberCount = (t.members?.length || 0) + (t.leader ? 1 : 0);

                  return (
                    <label
                      key={t.id}
                      onClick={() => {
                        if (!isSubmitting) {
                          setSelectedTeamId(t.id);
                          setSelectedTeamName(displayName);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50 border-blue-400 ring-2 ring-blue-500/20"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-slate-900">{t.teamName}</p>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
                            {t.teamCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Crown className="w-3 h-3 text-amber-500" />
                            {t.leader?.name || "No Leader"} ({t.leader?.phone || "N/A"})
                          </span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3 h-3 text-red-400" />
                            {t.zone?.zoneName || "Dhaka Zone"}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Users className="w-3 h-3 text-blue-500" />
                            {memberCount} Members
                          </span>
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="team"
                        disabled={isSubmitting}
                        checked={isSelected}
                        onChange={() => {
                          setSelectedTeamId(t.id);
                          setSelectedTeamName(displayName);
                        }}
                        className="w-4 h-4 text-[#007eff] focus:ring-blue-500 flex-shrink-0"
                      />
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-700">No active field teams found</p>
                <p className="text-[11px] text-slate-500">Please register a team in Admin &gt; Teams panel first.</p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800">Dispatch Notes for Cleaner (Optional):</label>
            <textarea
              rows={2}
              value={dispatchNote}
              disabled={isSubmitting}
              onChange={(e) => setDispatchNote(e.target.value)}
              placeholder="e.g. Bring extra industrial carpet steamer for VIP living room"
              className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#007eff] focus:bg-white disabled:opacity-60"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loadingTeams || (teams.length > 0 && !selectedTeamId)}
              className="px-6 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-[#007eff] hover:bg-blue-600 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Team...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm &amp; Dispatch Team</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
