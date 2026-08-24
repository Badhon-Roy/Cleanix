"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  ShieldCheck,
  PlusCircle,
  Search,
  MapPin,
  Check,
  X,
  Edit,
  Trash2,
  DollarSign,
  ImageIcon,
  UploadCloud,
  ChevronDown,
  Loader2,
  RefreshCw,
  FolderOpen,
} from "lucide-react";

import {
  TeamSquad,
  RegisteredCleaner,
  TeamMember,
  fetchAllTeamsAPI,
  fetchAllCleanersAPI,
  createTeamAPI,
  updateTeamAPI,
  deleteTeamAPI,
} from "@/services/teamService";

import {
  ICoverageArea,
  fetchAllCoveragesAPI,
} from "@/services/coverageService";

interface AdminTeamsClientViewProps {
  initialTeams: TeamSquad[];
  initialCleaners: RegisteredCleaner[];
  initialCoverages?: ICoverageArea[];
}

export default function AdminTeamsClientView({
  initialTeams = [],
  initialCleaners = [],
  initialCoverages = [],
}: AdminTeamsClientViewProps) {
  // Registered Cleaners State (Dynamic API state via Props Drilling)
  const [registeredCleaners, setRegisteredCleaners] = useState<RegisteredCleaner[]>(initialCleaners);

  // Teams State (Dynamic API state via Props Drilling)
  const [teams, setTeams] = useState<TeamSquad[]>(initialTeams);

  // UI & Form States
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  const [formTeamCode, setFormTeamCode] = useState("");
  const [formTeamName, setFormTeamName] = useState("");
  const [formTeamImage, setFormTeamImage] = useState("");
  const [formLeaderId, setFormLeaderId] = useState("");
  const [formZone, setFormZone] = useState("");
  const [selectedCleanerIds, setSelectedCleanerIds] = useState<string[]>([]);
  const [formCommissionRate, setFormCommissionRate] = useState<number>(10);
  const [formCleanerPoolShare, setFormCleanerPoolShare] = useState<number>(40);
  const [formAdminShare, setFormAdminShare] = useState<number>(50);

  // Custom Leader Dropdown State
  const [isLeaderDropdownOpen, setIsLeaderDropdownOpen] = useState(false);
  const leaderDropdownRef = useRef<HTMLDivElement>(null);

  // File Upload Ref & Handler for Team Squad Image Preview
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormTeamImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Search Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // Refresh Data manually from API
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [fetchedTeams, fetchedCleaners] = await Promise.all([
        fetchAllTeamsAPI(),
        fetchAllCleanersAPI(),
      ]);

      setTeams(fetchedTeams);
      setRegisteredCleaners(fetchedCleaners);
    } catch (err) {
      console.error("Error refreshing teams data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        leaderDropdownRef.current &&
        !leaderDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLeaderDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLeader =
    registeredCleaners.find(
      (c) => c.id === formLeaderId || c.userId === formLeaderId
    ) || registeredCleaners[0];

  // Coverage Areas Collection State
  const [coverageAreas, setCoverageAreas] = useState<ICoverageArea[]>(initialCoverages || []);

  useEffect(() => {
    fetchAllCoveragesAPI().then((covs) => {
      if (covs && covs.length > 0) setCoverageAreas(covs);
    });
  }, []);

  const openCreateModal = () => {
    setEditingTeamId(null);
    setFormTeamCode(`TEAM-SQUAD-${Math.floor(100 + Math.random() * 900)}`);
    setFormTeamName("");
    setFormTeamImage("");
    setFormLeaderId(registeredCleaners[0]?.id || registeredCleaners[0]?.userId || "");
    setFormZone(coverageAreas[0]?.id || "");
    setSelectedCleanerIds(registeredCleaners.slice(0, 2).map((c) => c.id));
    setFormCommissionRate(10);
    setFormCleanerPoolShare(40);
    setFormAdminShare(50);
    setIsModalOpen(true);
  };

  const openEditModal = (team: TeamSquad) => {
    setEditingTeamId(team.id);
    setFormTeamCode(team.teamCode);
    setFormTeamName(team.teamName);
    setFormTeamImage(team.teamImage);
    setFormLeaderId(team.leader.id || team.leader.userId);
    setFormZone(team.zoneId || (typeof team.zone === "string" ? team.zone : team.zone?.id || ""));
    setSelectedCleanerIds(team.members.map((m) => m.id));
    setFormCommissionRate(team.commissionRate || 10);
    setFormCleanerPoolShare(team.cleanerPoolShare || 40);
    setFormAdminShare(team.adminShare || 50);
    setIsModalOpen(true);
  };

  const toggleCleanerSelection = (id: string) => {
    setSelectedCleanerIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTeamName || !formTeamCode) {
      alert("Please provide Team Name and Team Code!");
      return;
    }

    if (selectedCleanerIds.length === 0) {
      alert("Please select at least one cleaner for the squad!");
      return;
    }

    const leaderObj =
      registeredCleaners.find(
        (c) => c.id === formLeaderId || c.userId === formLeaderId
      ) || registeredCleaners[0];

    const memberObjs: TeamMember[] = registeredCleaners
      .filter(
        (c) =>
          selectedCleanerIds.includes(c.id) ||
          selectedCleanerIds.includes(c.userId)
      )
      .map((c) => ({ id: c.id, name: c.name, phone: c.phone, role: "CLEANER" }));

    const payload = {
      teamCode: formTeamCode,
      teamName: formTeamName,
      teamImage:
        formTeamImage ||
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
      leader: leaderObj?.userId || leaderObj?.id || "",
      members: memberObjs.map((m) => m.id),
      zone: formZone,
      commissionRate: Number(formCommissionRate),
      cleanerPoolShare: Number(formCleanerPoolShare),
      adminShare: Number(formAdminShare),
      status: "ACTIVE" as const,
    };

    setIsSubmitting(true);
    try {
      if (editingTeamId) {
        await updateTeamAPI(editingTeamId, payload);
      } else {
        await createTeamAPI(payload);
      }

      setIsModalOpen(false);
      await refreshData();
    } catch (err: any) {
      console.error("Failed to save team:", err);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTeamStatus = async (id: string) => {
    const targetTeam = teams.find((t) => t.id === id);
    if (!targetTeam) return;

    const newStatus = targetTeam.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTeamAPI(id, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Team Squad?")) return;

    setTeams((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTeamAPI(id);
    } catch (err) {
      console.error("Failed to delete team:", err);
    }
  };

  const filteredTeams = teams.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const zoneText = typeof t.zone === "object" ? t.zone?.zoneName || "" : t.zone || "";
    return (
      t.teamCode.toLowerCase().includes(q) ||
      t.teamName.toLowerCase().includes(q) ||
      t.leader.name.toLowerCase().includes(q) ||
      zoneText.toLowerCase().includes(q)
    );
  });

  const promotedLeadersCount = registeredCleaners.filter(
    (c) => c.role === "TEAM_LEADER"
  ).length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Team & Squad Creation Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            টিম স্কোয়াড তৈরি, লিডার ও মেম্বার ক্লিনারদের দায়িত্ব বণ্টন এবং কমিশন স্প্লিট মডেল পরিচালনা করুন।
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={refreshData}
            title="Refresh Data"
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer border border-slate-200"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-[#007eff]" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-3 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Team Squad</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50/40 border border-blue-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">মোট সক্রিয় টিম স্কোয়াড</span>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#007eff] border border-blue-200 flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{teams.length} টি স্কোয়াড</p>
          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 inline-block">
            ⚡ জোন ভিত্তিক স্কোয়াড
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/40 border border-emerald-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">প্রোমোটেড টিম লিডার</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <UserCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{promotedLeadersCount} জন লিডার</p>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block">
            🛡️ 10% Cut Role Promoted
          </span>
        </div>

        <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50/40 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">মোট রেজিস্টার্ড ক্লিনার</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{registeredCleaners.length} জন স্টাফ</p>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block">
            ✓ সিস্টেম ডায়নামিক রেজিস্টার্ড
          </span>
        </div>

        <div className="bg-gradient-to-br from-purple-50/70 via-white to-slate-50/40 border border-purple-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">রাজস্ব মডেল নীতি</span>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">50 - 10 - 40%</p>
          <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-300 inline-block">
            💰 অটোমেটিক কমিশন স্প্লিট
          </span>
        </div>
      </div>

      {/* Main Teams List Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Users className="w-5 h-5 text-[#007eff]" /> সক্রিয় টিম স্কোয়াড তালিকা
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              ফিল্ডের দায়িত্ব প্রাপ্ত টিমসমূহ, মেম্বারদের অবস্থান ও কমিশন রুল পর্যালোচনা করুন।
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team code, name or zone..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#007eff] transition-all"
            />
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#007eff] mx-auto" />
            <p className="text-xs font-bold text-slate-500">ব্যাকএন্ড থেকে ডাইনামিক তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          /* Clean Production Empty State */
          <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50 p-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center mx-auto">
              <FolderOpen className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-800">কোন টিম স্কোয়াড পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                ডাটাবেসে এখনো কোনো টিম তৈরি করা হয়নি। নতুন টিম স্কোয়াড তৈরি করতে উপরের বাটনে ক্লিক করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-xl bg-[#007eff] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>প্রথম টিম তৈরি করুন</span>
            </button>
          </div>
        ) : (
          /* Squad Cards Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className={`p-6 rounded-3xl border transition-all space-y-5 flex flex-col justify-between overflow-hidden ${
                  team.status === "ACTIVE"
                    ? "bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30 border-slate-200 hover:border-blue-300 shadow-xs"
                    : "bg-slate-100/70 border-slate-200 opacity-75"
                }`}
              >
                <div className="space-y-4">
                  {/* Team Squad Banner Image & Header */}
                  <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img
                      src={team.teamImage || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600"}
                      alt={team.teamName}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black text-white bg-blue-600/90 px-2.5 py-0.5 rounded-full border border-blue-400/40 uppercase tracking-wider">
                          {team.teamCode}
                        </span>
                        <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5 drop-shadow-xs">
                          {team.teamName}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleTeamStatus(team.id)}
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          team.status === "ACTIVE"
                            ? "bg-emerald-500 text-white border-emerald-400 shadow-xs"
                            : "bg-slate-700 text-slate-200 border-slate-600"
                        }`}
                      >
                        {team.status}
                      </button>
                    </div>
                  </div>

                  {/* Coverage Zone Tag */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>
                      Coverage Zone:{" "}
                      {typeof team.zone === "object" && team.zone !== null
                        ? team.zone.zoneName
                        : team.zone || "Dhaka Zone"}
                    </span>
                  </div>

                  {/* Team Leader Box */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                        TL
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                          👑 Team Leader ({team.commissionRate}% Cut • Promoted Staff)
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{team.leader.name || "Assigned Leader"}</h4>
                        <span className="text-xs text-slate-500 font-medium">{team.leader.phone || "No Phone"}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ROLE: TEAM_LEADER
                    </span>
                  </div>

                  {/* Assigned Cleaners Squad Members */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Squad Cleaners ({team.members.length} Staff • {team.cleanerPoolShare}% Pool Share):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((member) => (
                        <span
                          key={member.id}
                          className="text-xs font-extrabold px-3 py-1 rounded-xl bg-white text-slate-800 border border-slate-200 flex items-center gap-1.5 shadow-2xs"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#007eff]" />
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Total Completed: <strong className="text-slate-900">{team.completedJobsCount} Jobs</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(team)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
                      title="Delete Squad"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className="bg-white w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-9 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {editingTeamId ? "টিম স্কোয়াড সম্পাদনা করুন" : "নতুন টিম স্কোয়াড তৈরি করুন"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs sm:text-sm block">Team Code</label>
                  <input
                    type="text"
                    value={formTeamCode}
                    onChange={(e) => setFormTeamCode(e.target.value)}
                    required
                    placeholder="e.g. TEAM-DELTA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs sm:text-sm block">Team Name</label>
                  <input
                    type="text"
                    value={formTeamName}
                    onChange={(e) => setFormTeamName(e.target.value)}
                    required
                    placeholder="e.g. Delta Dhanmondi Squad"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                  />
                </div>
              </div>

              {/* Image Preview & Upload Box (Matching Screenshot UI) */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#007eff]" />
                  <span>Team Squad Image</span>
                </label>

                <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                  {/* Left Square Thumbnail Preview */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xs flex-shrink-0 relative flex items-center justify-center">
                    {formTeamImage ? (
                      <img
                        src={formTeamImage}
                        alt="Squad Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[10px] font-bold">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Right Actions & URL Field */}
                  <div className="flex-1 space-y-3 w-full">
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-[#007eff] font-extrabold text-xs border border-blue-200 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                      >
                        <UploadCloud className="w-4 h-4 text-[#007eff]" />
                        <span>Choose Image File</span>
                      </button>

                      {formTeamImage && (
                        <button
                          type="button"
                          onClick={() => setFormTeamImage("")}
                          className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs border border-red-200 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    {/* URL Input Box */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        🔗 Or paste Image URL directly:
                      </span>
                      <input
                        type="text"
                        value={formTeamImage}
                        onChange={(e) => setFormTeamImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Select System for Assigning Team Leader */}
              <div className="space-y-1.5 relative z-30" ref={leaderDropdownRef}>
                <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                  Select Team Leader
                </label>

                {/* Select Trigger Box */}
                <button
                  type="button"
                  onClick={() => setIsLeaderDropdownOpen(!isLeaderDropdownOpen)}
                  className="w-full bg-slate-50 hover:bg-slate-100/90 border border-slate-200 focus:border-[#007eff] rounded-xl px-4 py-2.5 flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#007eff] text-white flex items-center justify-center font-black text-xs shadow-2xs flex-shrink-0">
                      TL
                    </div>
                    <div className="text-left truncate">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm block leading-tight truncate">
                        {selectedLeader?.name || "Select Registered Cleaner"}{" "}
                        {selectedLeader?.phone && (
                          <span className="font-medium text-slate-500 text-xs sm:text-sm">
                            ({selectedLeader?.phone})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isLeaderDropdownOpen ? "rotate-180 text-[#007eff]" : ""
                    }`}
                  />
                </button>

                {/* Floating Select Menu Popover */}
                {isLeaderDropdownOpen && (
                  <div
                    data-lenis-prevent="true"
                    data-lenis-prevent-wheel="true"
                    data-lenis-prevent-touch="true"
                    className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 space-y-1 animate-in fade-in duration-150 max-h-56 overflow-y-auto"
                  >
                    {registeredCleaners.map((cleaner) => {
                      const isSelected =
                        cleaner.id === formLeaderId ||
                        cleaner.userId === formLeaderId;
                      return (
                        <button
                          key={cleaner.id}
                          type="button"
                          onClick={() => {
                            setFormLeaderId(cleaner.id);
                            setIsLeaderDropdownOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-50/90 border border-[#007eff]/30 shadow-2xs"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-lg bg-[#007eff] text-white flex items-center justify-center font-black text-xs flex-shrink-0"
                            >
                              {cleaner.role === "TEAM_LEADER" ? "TL" : "CL"}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">
                                  {cleaner.name}
                                </span>
                                <span
                                  className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200"
                                >
                                  {cleaner.role === "TEAM_LEADER"
                                    ? "👑 TEAM LEADER"
                                    : "🧹 CLEANER"}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500 font-medium">
                                {cleaner.phone}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <span className="text-xs font-extrabold text-[#007eff] flex items-center gap-1">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Revenue Split Rates Section (% Commission Model) */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#007eff]" />
                    <span>Revenue Commission Split (% Model)</span>
                  </label>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                      Number(formCommissionRate) +
                        Number(formCleanerPoolShare) +
                        Number(formAdminShare) ===
                      100
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    Total:{" "}
                    {Number(formCommissionRate) +
                      Number(formCleanerPoolShare) +
                      Number(formAdminShare)}
                    %
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Leader Cut (%)
                    </label>
                    <input
                      type="number"
                      value={formCommissionRate}
                      onChange={(e) =>
                        setFormCommissionRate(Number(e.target.value))
                      }
                      required
                      min={0}
                      max={100}
                      placeholder="10"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Cleaner Pool (%)
                    </label>
                    <input
                      type="number"
                      value={formCleanerPoolShare}
                      onChange={(e) =>
                        setFormCleanerPoolShare(Number(e.target.value))
                      }
                      required
                      min={0}
                      max={100}
                      placeholder="40"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Admin Share (%)
                    </label>
                    <input
                      type="number"
                      value={formAdminShare}
                      onChange={(e) =>
                        setFormAdminShare(Number(e.target.value))
                      }
                      required
                      min={0}
                      max={100}
                      placeholder="50"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                  Coverage Area Zone (CoverageArea Collection ID)
                </label>
                <select
                  value={formZone}
                  onChange={(e) => setFormZone(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                >
                  <option value="">Select Operational Coverage Area</option>
                  {coverageAreas.map((cov) => (
                    <option key={cov.id} value={cov.id}>
                      {cov.zoneName} ({cov.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cleaners Checkbox Selector */}
              <div className="space-y-2 pt-1">
                <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                  Select Squad Cleaners (40% Pool Share):
                </label>
                <div
                  data-lenis-prevent="true"
                  data-lenis-prevent-wheel="true"
                  data-lenis-prevent-touch="true"
                  className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2.5 bg-slate-50 rounded-2xl border border-slate-200"
                >
                  {registeredCleaners.map((cleaner) => {
                    const isChecked = selectedCleanerIds.includes(cleaner.id);
                    return (
                      <label
                        key={cleaner.id}
                        onClick={() => toggleCleanerSelection(cleaner.id)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-blue-50 border-[#007eff] text-slate-900 font-bold"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? "bg-[#007eff] border-[#007eff] text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-bold truncate">{cleaner.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {editingTeamId ? "আপডেট সংরক্ষণ করুন" : "টিম সংরক্ষণ করুন"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
