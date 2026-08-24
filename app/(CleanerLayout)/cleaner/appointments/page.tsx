"use client";

import React, { useState, useEffect } from "react";
import {
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  Sparkles,
  MapPin,
  RefreshCw,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  fetchMyAppointmentHistoryAPI,
  respondAppointmentAPI,
  LeaderAppointmentItem,
} from "@/services/appointmentService";
import { getAuthUser, setAuthUser, setAuthRole } from "@/utils/cookie";
import { slugifyTeamName } from "@/utils/slug";

export default function CleanerAppointmentsPage() {
  const [appointments, setAppointments] = useState<LeaderAppointmentItem[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "DECLINED">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: "ACCEPT" | "DECLINE";
    appointment: LeaderAppointmentItem | null;
  }>({
    isOpen: false,
    action: "ACCEPT",
    appointment: null,
  });

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMyAppointmentHistoryAPI();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointment notices:", err);
      toast.error("Failed to load appointment notices");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("leader_appointment_updated", () => {
      loadAppointments();
    });

    socket.on("team_updated", () => {
      loadAppointments();
    });

    return () => {
      socket.off("leader_appointment_updated");
      socket.off("team_updated");
      socket.disconnect();
    };
  }, []);

  const openConfirmModal = (
    appointment: LeaderAppointmentItem,
    action: "ACCEPT" | "DECLINE"
  ) => {
    setModalState({
      isOpen: true,
      action,
      appointment,
    });
  };

  const handleRespond = async (appointmentId: string, action: "ACCEPT" | "DECLINE") => {
    setRespondingId(appointmentId);
    try {
      const res = await respondAppointmentAPI(appointmentId, action);
      if (res?.success) {
        if (action === "ACCEPT") {
          toast.success("👑 Congratulations! You accepted Team Leader role!");
          const currentUser = getAuthUser();
          if (currentUser) {
            currentUser.role = "TEAM_LEADER";
            setAuthUser(currentUser);
          }
          setAuthRole("TEAM_LEADER");
          const targetTeamName = appointments.find((a) => a.id === appointmentId)?.team?.teamName;
          const teamNameSlug = slugifyTeamName(targetTeamName);
          setTimeout(() => {
            window.location.href = teamNameSlug ? `/team/${teamNameSlug}` : "/team";
          }, 800);
        } else {
          toast.info("Appointment request declined");
          loadAppointments();
        }
      } else {
        toast.error(res?.message || "Failed to respond to request");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to respond to request");
    } finally {
      setRespondingId(null);
    }
  };

  const filteredAppointments = appointments.filter((item) => {
    if (filter === "PENDING") return item.status === "PENDING";
    if (filter === "ACCEPTED") return item.status === "ACCEPTED";
    if (filter === "DECLINED") return item.status === "DECLINED";
    return true;
  });

  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const acceptedCount = appointments.filter((a) => a.status === "ACCEPTED").length;
  const declinedCount = appointments.filter((a) => a.status === "DECLINED").length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-yellow-600" />
              Appointment Notices & History
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Team Leader Appointment Notices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            View all official squad leader appointment requests, status updates, and history.
          </p>
        </div>

        <button
          onClick={loadAppointments}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Notices</span>
        </button>
      </div>

      {/* Filter Tabs & KPI Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              filter === "ALL"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Notices ({appointments.length})
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === "PENDING"
                ? "bg-[#F2D701] text-slate-950 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("ACCEPTED")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === "ACCEPTED"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted ({acceptedCount})
          </button>
          <button
            onClick={() => setFilter("DECLINED")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === "DECLINED"
                ? "bg-red-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Declined ({declinedCount})
          </button>
        </div>
      </div>

      {/* Appointment Notices List */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#007eff] animate-spin" />
          <p className="text-sm font-bold text-slate-600">Loading appointment notices...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto font-black text-2xl">
            👑
          </div>
          <h3 className="text-base font-bold text-slate-800">No Appointment Notices Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not have any appointment notices matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appt) => {
            const isPending = appt.status === "PENDING";
            const isAccepted = appt.status === "ACCEPTED";
            const isDeclined = appt.status === "DECLINED";

            return (
              <div
                key={appt.id}
                className={`rounded-3xl p-6 sm:p-8 transition-all border ${
                  isPending
                    ? "bg-[#F2D701] border-yellow-500/40 text-slate-950"
                    : isAccepted
                    ? "bg-white border-emerald-200 text-slate-900 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-900 opacity-80"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900/10">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl flex-shrink-0 ${
                        isPending
                          ? "bg-slate-900 text-[#F2D701]"
                          : isAccepted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      👑
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isPending && (
                          <span className="text-[11px] font-black px-3 py-1 rounded-full bg-slate-900 text-[#F2D701] uppercase flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-400" />
                            PENDING INVITATION
                          </span>
                        )}
                        {isAccepted && (
                          <span className="text-[11px] font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ACCEPTED • TEAM LEADER
                          </span>
                        )}
                        {isDeclined && (
                          <span className="text-[11px] font-black px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 uppercase flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-red-600" />
                            DECLINED
                          </span>
                        )}

                        <span
                          className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                            isPending
                              ? "bg-slate-900/10 text-slate-900 border-slate-900/20"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          ##{appt.team?.teamCode || "SQUAD"}
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-950">
                        Squad Leader Appointment: &apos;{appt.team?.teamName || "Team Squad"}&apos;
                      </h2>
                    </div>
                  </div>

                  {/* Actions for Pending Requests */}
                  {isPending && (
                    <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
                      <button
                        type="button"
                        disabled={respondingId === appt.id}
                        onClick={() => openConfirmModal(appt, "ACCEPT")}
                        className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {respondingId === appt.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                        )}
                        <span>Accept Leader Role</span>
                      </button>

                      <button
                        type="button"
                        disabled={respondingId === appt.id}
                        onClick={() => openConfirmModal(appt, "DECLINE")}
                        className="px-4 py-3 rounded-2xl bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 border border-slate-900/20 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-4 h-4 text-slate-900" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Team Details Row */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold mt-5 p-4 rounded-2xl border ${
                    isPending
                      ? "bg-slate-900/10 border-slate-900/15"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div>
                    <span className="text-slate-600 text-[10px] uppercase font-black block">
                      Leader Revenue Commission
                    </span>
                    <p className="text-sm font-black text-slate-950 mt-0.5">
                      {appt.team?.commissionRate || appt.commissionRate}% Leader Commission
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 text-[10px] uppercase font-black block">
                      Cleaner Squad Pool
                    </span>
                    <p className="text-sm font-black text-slate-950 mt-0.5">
                      {appt.team?.cleanerPoolShare || appt.cleanerPoolShare}% Cleaner Pool
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 text-[10px] uppercase font-black block">
                      Assigned Coverage Zone
                    </span>
                    <p className="text-sm font-black text-slate-950 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {appt.team?.zone?.zoneName || "Dhaka Zone"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Accept & Decline */}
      {modalState.isOpen && modalState.appointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  modalState.action === "ACCEPT"
                    ? "bg-[#F2D701] text-slate-950"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {modalState.action === "ACCEPT" ? "👑" : "⚠️"}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {modalState.action === "ACCEPT"
                    ? "Accept Team Leader Role?"
                    : "Decline Appointment Request?"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Squad: {modalState.appointment.team?.teamName || "Team Squad"} (##{modalState.appointment.team?.teamCode})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {modalState.action === "ACCEPT"
                ? `By accepting, you will officially become the Team Leader of '${modalState.appointment.team?.teamName}'. Your account role will be promoted immediately to Team Leader with dashboard access.`
                : `Are you sure you want to decline the appointment request for '${modalState.appointment.team?.teamName}'? The admin will be notified and this status will be saved as Declined.`}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalState({ ...modalState, isOpen: false })}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={Boolean(respondingId)}
                onClick={() => {
                  if (modalState.appointment) {
                    handleRespond(modalState.appointment.id, modalState.action);
                    setModalState({ ...modalState, isOpen: false });
                  }
                }}
                className={`flex-1 px-4 py-3 rounded-2xl font-extrabold text-xs text-white flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 ${
                  modalState.action === "ACCEPT"
                    ? "bg-slate-900 hover:bg-slate-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {modalState.action === "ACCEPT" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>Confirm & Accept</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-white" />
                    <span>Confirm & Decline</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
