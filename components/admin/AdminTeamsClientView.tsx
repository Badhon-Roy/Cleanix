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
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

interface TeamFormValues {
  teamCode: string;
  teamName: string;
  teamImage: string;
  leader: string;
  zone: string;
  commissionRate: number;
  cleanerPoolShare: number;
  adminShare: number;
}

export default function AdminTeamsClientView({
  initialTeams = [],
  initialCleaners = [],
  initialCoverages = [],
}: AdminTeamsClientViewProps) {
  // Registered Cleaners State (Dynamic API state via Props Drilling)
  const [registeredCleaners, setRegisteredCleaners] =
    useState<RegisteredCleaner[]>(initialCleaners);

  // Teams State (Dynamic API state via Props Drilling)
  const [teams, setTeams] = useState<TeamSquad[]>(initialTeams);

  // UI & Form States
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  const [selectedCleanerIds, setSelectedCleanerIds] = useState<string[]>([]);

  // React Hook Form Integration
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    defaultValues: {
      teamCode: "",
      teamName: "",
      teamImage: "",
      leader: "",
      zone: "",
      commissionRate: 10,
      cleanerPoolShare: 40,
      adminShare: 50,
    },
  });

  const formLeaderId = watch("leader");
  const formTeamImage = watch("teamImage");
  const formCommissionRate = watch("commissionRate");
  const formCleanerPoolShare = watch("cleanerPoolShare");
  const formAdminShare = watch("adminShare");

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
          setValue("teamImage", reader.result);
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
      (c) => c.id === formLeaderId || c.userId === formLeaderId,
    ) || registeredCleaners[0];

  // Coverage Areas Collection State
  const [coverageAreas, setCoverageAreas] = useState<ICoverageArea[]>(
    initialCoverages || [],
  );

  useEffect(() => {
    fetchAllCoveragesAPI().then((covs) => {
      if (covs && covs.length > 0) setCoverageAreas(covs);
    });
  }, []);

  const openCreateModal = () => {
    setEditingTeamId(null);
    setSelectedCleanerIds(registeredCleaners.slice(0, 2).map((c) => c.id));
    reset({
      teamCode: `TEAM-SQUAD-${Math.floor(100 + Math.random() * 900)}`,
      teamName: "",
      teamImage: "",
      leader: registeredCleaners[0]?.id || registeredCleaners[0]?.userId || "",
      zone: coverageAreas[0]?.id || "",
      commissionRate: 10,
      cleanerPoolShare: 40,
      adminShare: 50,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (team: TeamSquad) => {
    setEditingTeamId(team.id);
    setSelectedCleanerIds(team.members.map((m) => m.id));
    reset({
      teamCode: team.teamCode,
      teamName: team.teamName,
      teamImage: team.teamImage,
      leader: team.leader.id || team.leader.userId,
      zone:
        team.zoneId ||
        (typeof team.zone === "string" ? team.zone : team.zone?.id || ""),
      commissionRate: team.commissionRate || 10,
      cleanerPoolShare: team.cleanerPoolShare || 40,
      adminShare: team.adminShare || 50,
    });
    setIsModalOpen(true);
  };

  const toggleCleanerSelection = (id: string) => {
    setSelectedCleanerIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const onSubmit = async (data: TeamFormValues) => {
    if (selectedCleanerIds.length === 0) {
      toast.error("Please select at least one cleaner for the squad!");
      return;
    }

    const leaderObj =
      registeredCleaners.find(
        (c) => c.id === data.leader || c.userId === data.leader,
      ) || registeredCleaners[0];

    const memberObjs: TeamMember[] = registeredCleaners
      .filter(
        (c) =>
          selectedCleanerIds.includes(c.id) ||
          selectedCleanerIds.includes(c.userId),
      )
      .map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        role: "CLEANER",
      }));

    const payload = {
      teamCode: data.teamCode,
      teamName: data.teamName,
      teamImage:
        data.teamImage ||
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
      leader: leaderObj?.userId || leaderObj?.id || "",
      members: memberObjs.map((m) => m.id),
      zone: data.zone,
      commissionRate: Number(data.commissionRate),
      cleanerPoolShare: Number(data.cleanerPoolShare),
      adminShare: Number(data.adminShare),
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
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
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
    const zoneText =
      typeof t.zone === "object" ? t.zone?.zoneName || "" : t.zone || "";
    return (
      t.teamCode.toLowerCase().includes(q) ||
      t.teamName.toLowerCase().includes(q) ||
      t.leader.name.toLowerCase().includes(q) ||
      zoneText.toLowerCase().includes(q)
    );
  });

  const promotedLeadersCount = registeredCleaners.filter(
    (c) => c.role === "TEAM_LEADER",
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
            টিম স্কোয়াড তৈরি, লিডার ও মেম্বার ক্লিনারদের দায়িত্ব বণ্টন এবং কমিশন
            স্প্লিট মডেল পরিচালনা করুন।
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
            <span className="text-sm font-extrabold text-slate-800">
              মোট সক্রিয় টিম স্কোয়াড
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#007eff] border border-blue-200 flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {teams.length} টি স্কোয়াড
          </p>
          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 inline-block">
            ⚡ জোন ভিত্তিক স্কোয়াড
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/40 border border-emerald-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">
              প্রোমোটেড টিম লিডার
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <UserCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {promotedLeadersCount} জন লিডার
          </p>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block">
            🛡️ 10% Cut Role Promoted
          </span>
        </div>

        <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50/40 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">
              মোট রেজিস্টার্ড ক্লিনার
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {registeredCleaners.length} জন স্টাফ
          </p>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block">
            ✓ সিস্টেম ডায়নামিক রেজিস্টার্ড
          </span>
        </div>

        <div className="bg-gradient-to-br from-purple-50/70 via-white to-slate-50/40 border border-purple-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">
              রাজস্ব মডেল নীতি
            </span>
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
              <Users className="w-5 h-5 text-[#007eff]" /> সক্রিয় টিম স্কোয়াড
              তালিকা
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              ফিল্ডের দায়িত্ব প্রাপ্ত টিমসমূহ, মেম্বারদের অবস্থান ও কমিশন রুল
              পর্যালোচনা করুন।
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
            <p className="text-xs font-bold text-slate-500">
              ব্যাকএন্ড থেকে ডাইনামিক তথ্য লোড হচ্ছে...
            </p>
          </div>
        ) : filteredTeams.length === 0 ? (
          /* Clean Production Empty State */
          <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50 p-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center mx-auto">
              <FolderOpen className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-800">
                কোন টিম স্কোয়াড পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                ডাটাবেসে এখনো কোনো টিম তৈরি করা হয়নি। নতুন টিম স্কোয়াড তৈরি করতে
                উপরের বাটনে ক্লিক করুন।
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
          /* Squad Cards List (Matching Image 2 Layout) */
          <div className="space-y-4">
            {filteredTeams.map((team) => {
              const zoneText =
                typeof team.zone === "object" && team.zone !== null
                  ? team.zone.zoneName
                  : team.zone || "Dhaka Coverage Zone";

              return (
                <div
                  key={team.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all space-y-5"
                >
                  {/* Top Header Row (Matching Image 2 + Enlarged Team Image) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      {/* Team Image Avatar Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 shadow-2xs">
                        <img
                          src={
                            team.teamImage ||
                            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600"
                          }
                          alt={team.teamName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-0.5 rounded-xl bg-blue-50 text-[#007eff] font-black text-xs border border-blue-200">
                            ##{team.teamCode}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                          {team.teamName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {/* Status Switch / Badge */}
                      <button
                        type="button"
                        onClick={() => toggleTeamStatus(team.id)}
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                          team.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        STATUS: {team.status}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEditModal(team)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-[#007eff] text-xs font-extrabold border border-blue-200 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Squad</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                        title="Delete Squad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 4-Column Horizontal Grid Details (Matching Image 2) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* Column 1: Team Leader */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Team Leader & Contact
                      </span>
                      <div className="flex items-center gap-2.5 mt-1">
                        <div className="w-8 h-8 rounded-xl bg-[#007eff] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                          TL
                        </div>
                        <div className="min-w-0">
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm block truncate">
                            {team.leader.name || "Assigned Leader"}
                          </span>
                          <span className="text-slate-500 font-medium text-xs block">
                            {team.leader.phone || "No Phone"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Location & Coverage */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Location & Coverage
                      </span>
                      <div className="flex items-start gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">
                            {zoneText}
                          </span>
                          <span className="text-slate-500 font-medium text-xs">
                            Operational Service Zone
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Commission & Jobs */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Commission & Jobs
                      </span>
                      <div className="space-y-0.5 mt-1">
                        <div className="flex items-center gap-1 font-extrabold text-slate-900 text-xs sm:text-sm">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span>Leader: {team.commissionRate || 10}%</span>
                          <span className="text-slate-400 font-normal text-xs">| Pool: {team.cleanerPoolShare || 40}%</span>
                        </div>
                        <span className="text-slate-500 font-medium text-xs block">
                          Total Completed: <strong className="text-slate-900">{team.completedJobsCount} Jobs</strong>
                        </span>
                      </div>
                    </div>

                    {/* Column 4: Squad Cleaners */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Squad Cleaners ({team.members.length} Staff)
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1 max-h-16 overflow-y-auto">
                        {team.members.length > 0 ? (
                          team.members.map((member) => (
                            <span
                              key={member.id}
                              className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200"
                            >
                              {member.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 font-medium text-xs">Unassigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  {editingTeamId
                    ? "টিম স্কোয়াড সম্পাদনা করুন"
                    : "নতুন টিম স্কোয়াড তৈরি করুন"}
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

            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                    Team Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("teamCode", { required: "Team Code is required" })}
                    placeholder="e.g. TEAM-DELTA"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none ${
                      errors.teamCode
                        ? "border-red-500 focus:border-red-600 bg-red-50/20"
                        : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.teamCode && (
                    <span className="text-red-500 text-xs font-bold mt-1 block">
                      {errors.teamCode.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("teamName", { required: "Team Name is required" })}
                    placeholder="e.g. Delta Dhanmondi Squad"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none ${
                      errors.teamName
                        ? "border-red-500 focus:border-red-600 bg-red-50/20"
                        : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.teamName && (
                    <span className="text-red-500 text-xs font-bold mt-1 block">
                      {errors.teamName.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Image Preview & Upload Box (Matching Screenshot UI) */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#007eff]" />
                  <span>Team Squad Image</span>
                </label>

                <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                  {/* Left Square Thumbnail Preview (Enlarged) */}
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xs flex-shrink-0 relative flex items-center justify-center">
                    {formTeamImage ? (
                      <img
                        src={formTeamImage}
                        alt="Squad Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs font-bold">No Image</span>
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
                          onClick={() => setValue("teamImage", "")}
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
                        {...register("teamImage")}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Select System for Assigning Team Leader */}
              <div
                className="space-y-1.5 relative z-30"
                ref={leaderDropdownRef}
              >
                <label className="font-bold text-slate-800 text-xs sm:text-sm block">
                  Select Team Leader <span className="text-red-500">*</span>
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
                            setValue("leader", cleaner.id);
                            setIsLeaderDropdownOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-50/90 border border-[#007eff]/30 shadow-2xs"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#007eff] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                              {cleaner.role === "TEAM_LEADER" ? "TL" : "CL"}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">
                                  {cleaner.name}
                                </span>
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
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
                      {...register("commissionRate", { valueAsNumber: true })}
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
                      {...register("cleanerPoolShare", { valueAsNumber: true })}
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
                      {...register("adminShare", { valueAsNumber: true })}
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
                  Coverage Area Zone (CoverageArea Collection ID) <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("zone", { required: "Coverage Area Zone is required" })}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none ${
                    errors.zone
                      ? "border-red-500 focus:border-red-600 bg-red-50/20"
                      : "border-slate-200 focus:border-[#007eff]"
                  }`}
                >
                  <option value="">Select Operational Coverage Area</option>
                  {coverageAreas.map((cov) => (
                    <option key={cov.id} value={cov.id}>
                      {cov.zoneName} ({cov.district})
                    </option>
                  ))}
                </select>
                {errors.zone && (
                  <span className="text-red-500 text-xs font-bold mt-1 block">
                    {errors.zone.message}
                  </span>
                )}
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
                          {isChecked && (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-bold truncate">
                          {cleaner.name}
                        </span>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {editingTeamId ? "Save Updates" : "Save Team Squad"}
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
