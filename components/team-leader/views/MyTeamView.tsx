"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Search,
  Crown,
  Percent,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sparkles,
  User,
  BadgeCheck,
  Building2,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { io } from "socket.io-client";
import {
  fetchTeamByIdOrSlugAPI,
  fetchAllTeamsAPI,
  TeamSquad,
  TeamMember,
} from "@/services/teamService";
import { getAuthUser } from "@/utils/cookie";

function calculateWorkDuration(startDateStr?: string) {
  const startDate = startDateStr ? new Date(startDateStr) : new Date("2025-01-01T00:00:00Z");
  const now = new Date();

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    years = 0;
    months = 0;
    days = 1;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "Year" : "Years"}`);
  if (months > 0 || years > 0) parts.push(`${months} ${months === 1 ? "Month" : "Months"}`);
  parts.push(`${days} ${days === 1 ? "Day" : "Days"}`);

  return parts.join(" ");
}

interface MyTeamViewProps {
  teamSlug: string;
  initialTeam?: TeamSquad | null;
}

export default function MyTeamView({ teamSlug, initialTeam = null }: MyTeamViewProps) {
  const [team, setTeam] = useState<TeamSquad | null>(initialTeam);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LEADER" | "CLEANER">("ALL");

  const silentFetchTeamData = useCallback(async () => {
    try {
      // First try to fetch specific team by slug
      let result = await fetchTeamByIdOrSlugAPI(teamSlug);

      // Fallback: If not found by slug, fetch all user's teams and pick the led one
      if (!result) {
        const teams = await fetchAllTeamsAPI();
        const authUser = getAuthUser();
        const myLedTeam = teams.find(
          (t) =>
            t.leader?.userId === authUser?.id ||
            t.leader?.id === authUser?.id ||
            t.teamCode.toLowerCase() === teamSlug.toLowerCase()
        );
        if (myLedTeam) {
          result = myLedTeam;
        } else if (teams.length > 0) {
          result = teams[0];
        }
      }

      if (result) {
        setTeam(result);
        setError(null);
      } else if (!team) {
        setError("Team details not found or access restricted.");
      }
    } catch (err: any) {
      console.error("Silent socket sync failed for team:", err);
      if (!team) {
        setError("Failed to load team squad details.");
      }
    }
  }, [teamSlug]);

  // Real-time Socket.IO Live Data Synchronization (No page reload, no visible loading spinner)
  useEffect(() => {
    silentFetchTeamData();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("⚡ MyTeam Socket connected:", socket.id);
    });

    socket.on("team_updated", () => silentFetchTeamData());
    socket.on("leader_appointment_updated", () => silentFetchTeamData());
    socket.on("leader_request_updated", () => silentFetchTeamData());
    socket.on("cleaner_updated", () => silentFetchTeamData());
    socket.on("coverage_updated", () => silentFetchTeamData());

    return () => {
      socket.off("team_updated");
      socket.off("leader_appointment_updated");
      socket.off("leader_request_updated");
      socket.off("cleaner_updated");
      socket.off("coverage_updated");
      socket.disconnect();
    };
  }, [teamSlug, silentFetchTeamData]);

  // Combined member list including leader + squad cleaners for comprehensive roster view
  const allMembers = useMemo(() => {
    if (!team) return [];

    const list: (TeamMember & { isLeader?: boolean })[] = [];

    // Add Leader
    if (team.leader && team.leader.name) {
      list.push({
        id: team.leader.id || team.leader.userId || "leader",
        name: team.leader.name,
        email: team.leader.email,
        phone: team.leader.phone,
        role: "TEAM_LEADER",
        status: "APPROVED",
        isLeader: true,
      });
    }

    // Add Cleaner Members
    if (Array.isArray(team.members)) {
      team.members.forEach((m) => {
        // avoid duplication if leader is also in members array
        if (m.id !== team.leader?.id && m.phone !== team.leader?.phone) {
          list.push({
            ...m,
            isLeader: false,
          });
        }
      });
    }

    return list;
  }, [team]);

  // Filtered members based on search and status
  const filteredMembers = useMemo(() => {
    return allMembers.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.phone && m.phone.includes(searchQuery)) ||
        (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === "LEADER") return m.isLeader;
      if (statusFilter === "CLEANER") return !m.isLeader;

      return true;
    });
  }, [allMembers, searchQuery, statusFilter]);

  if (!team) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center max-w-xl mx-auto shadow-sm my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Connecting to Real-Time Team Squad...</h3>
        <p className="text-slate-500 text-sm mb-6">{error || "Syncing field squad details over live websocket channel..."}</p>
        <button
          onClick={silentFetchTeamData}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007eff] text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Now</span>
        </button>
      </div>
    );
  }

  const leader = team.leader;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Card Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a1e3b] via-[#0d2e5a] to-[#12427a] text-white p-6 sm:p-8 shadow-xl shadow-blue-950/20 border border-blue-900/40">
        {/* Decorative Background Accents */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-56 h-56 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{team.status || "ACTIVE"}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{team.teamName || "Field Team Squad"}</span>
              <span className="text-sm sm:text-base font-bold text-blue-300 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
                {team.teamCode}
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>
                  Zone: <strong className="text-white">{team.zone?.zoneName || "Dhaka Zone"}</strong>{" "}
                  {team.zone?.district ? `(${team.zone.district})` : ""}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-blue-400" />
                <span>
                  Total Roster: <strong className="text-white">{allMembers.length} Cleaners</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-shrink-0">
            <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Team Work Duration</p>
                <p className="text-xs sm:text-sm font-extrabold text-white">{calculateWorkDuration(team.createdAt)}</p>
              </div>
            </div>

            <button
              onClick={silentFetchTeamData}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer"
              title="Refresh Team Info"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Members</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{allMembers.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">1 Leader + {team.members.length} Squad Cleaners</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leader Cut Share</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{team.commissionRate}%</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Direct Team Leader Override</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cleaner Pool Share</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{team.cleanerPoolShare}%</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Distributed to Squad Cleaners</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leader Appointment</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900 uppercase">
            {team.leaderRequestStatus || "ACCEPTED"}
          </p>
          <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Leadership Status</span>
          </p>
        </div>
      </div>

      {/* Team Leader Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Team Leader Profile</h2>
              <p className="text-xs text-slate-500 font-medium">Field Squad Commander & Operations Manager</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-amber-600" />
            <span>TEAM LEADER</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center flex-shrink-0">
              {leader.name ? leader.name.charAt(0).toUpperCase() : "L"}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Leader Name</p>
              <p className="text-sm font-extrabold text-slate-900 truncate">{leader.name || "Assigned Leader"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email Address</p>
              <p className="text-sm font-bold text-slate-900 break-all">{leader.email || "No email available"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Contact Phone</p>
              <p className="text-sm font-bold text-slate-900 truncate">{leader.phone || "No phone registered"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Cleaners Roster Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Users className="w-5 h-5 text-[#007eff]" />
              <span>Squad Cleaners Roster</span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {allMembers.length} Members
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cleaners assigned to {team.teamName} field operations.
            </p>
          </div>

          {/* Controls: Search & Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cleaner name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs font-semibold rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-56 sm:w-64 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({allMembers.length})
              </button>
              <button
                onClick={() => setStatusFilter("LEADER")}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  statusFilter === "LEADER"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Leader
              </button>
              <button
                onClick={() => setStatusFilter("CLEANER")}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  statusFilter === "CLEANER"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Cleaners ({team.members.length})
              </button>
            </div>
          </div>
        </div>

        {/* Cleaners Roster List */}
        {filteredMembers.length === 0 ? (
          <div className="py-12 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
            <UserCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">No cleaners found matching filter</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or switching filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => {
              const isLeader = member.isLeader;

              return (
                <div
                  key={member.id || member.phone}
                  className={`rounded-2xl p-5 border transition-all duration-200 hover:shadow-md relative overflow-hidden ${
                    isLeader
                      ? "bg-gradient-to-br from-amber-50/70 to-slate-50 border-amber-200/80"
                      : "bg-white border-slate-200/80 hover:border-blue-300/80"
                  }`}
                >
                  {isLeader && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                      LEADER
                    </div>
                  )}

                  <div className="flex items-center gap-3.5 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-xs flex-shrink-0 ${
                        isLeader
                          ? "bg-amber-500 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {member.name ? member.name.charAt(0).toUpperCase() : "C"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {member.name || "Cleaner Member"}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            isLeader
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {member.role || "CLEANER"}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    {member.phone && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          Phone:
                        </span>
                        <a
                          href={`tel:${member.phone}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}

                    {member.email && (
                      <div className="flex items-start justify-between gap-2 text-slate-600">
                        <span className="font-semibold flex items-center gap-1.5 text-slate-500 flex-shrink-0">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          Email:
                        </span>
                        <a
                          href={`mailto:${member.email}`}
                          className="font-bold text-slate-800 hover:text-blue-600 break-all text-right"
                          title={member.email}
                        >
                          {member.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {member.phone && (
                    <div className="mt-4 pt-3 border-t border-slate-100/80">
                      <a
                        href={`tel:${member.phone}`}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                        <span>Call Cleaner</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
