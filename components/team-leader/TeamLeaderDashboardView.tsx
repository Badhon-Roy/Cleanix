"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Navigation,
  Camera,
  Star,
  DollarSign,
  User,
  UserCheck,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  ChevronRight,
  Search,
  Building,
  Calendar,
  X,
  Check,
  Wallet,
  Eye,
  Sliders,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { slugifyTeamName } from "@/utils/slug";
import {
  fetchMyTeamAssignmentsAPI,
  updateTeamAssignmentAPI,
  fetchTeamByIdOrSlugAPI,
} from "@/services/teamService";

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  status: "ON_DUTY" | "OFF_DUTY" | "IN_SERVICE";
  dutyStartedAt?: string | null;
  totalDutyMinutes?: number;
  rating: number;
  completedJobs: number;
  currentJob?: string;
  singleTeamVerified: boolean;
}

interface TeamBooking {
  id: string;
  _assignmentId?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  area: string;
  serviceType: string;
  packageType: string;
  timeSlot: string;
  specs: string;
  assignedCleaners: string[];
  status: "PENDING_DISPATCH" | "IN_PROGRESS" | "COMPLETED";
  totalPrice: number;
  leaderCommission: number;
  cleanerPoolShare: number;
  addons?: string[];
}

interface TeamLeaderDashboardViewProps {
  teamSlug: string;
  displayTeamName: string;
}

export default function TeamLeaderDashboardView({
  teamSlug,
  displayTeamName,
}: TeamLeaderDashboardViewProps) {
  const basePath = `/team/${teamSlug}`;

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [teamBookings, setTeamBookings] = useState<TeamBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isUpdatingDispatch, setIsUpdatingDispatch] = useState(false);

  const [dispatchModalBooking, setDispatchModalBooking] = useState<TeamBooking | null>(null);
  const [selectedCleanerNames, setSelectedCleanerNames] = useState<string[]>([]);

  const loadDashboardAssignments = useCallback(
    async (showSpinner = false) => {
      try {
        if (showSpinner) setIsLoadingBookings(true);
        const data = await fetchMyTeamAssignmentsAPI(teamSlug);
        if (Array.isArray(data)) {
          const mapped: TeamBooking[] = data.map((item: any) => {
            const b = item.booking || {};
            const customerName = b.user?.name || "Customer";
            const customerPhone = b.user?.phone || b.phone || "N/A";
            const bookingRef = b.bookingRef || b._id || item._id;
            const serviceType = b.serviceType?.title || "Standard Cleaning Service";
            const packageType = b.packageType?.title || b.packageType || "Assigned Service";
            const address = b.address || "Dhaka, Bangladesh";
            const area = b.area || b.zone?.zoneName || "Dhaka";
            const timeSlot = b.timeSlot || "Scheduled Slot";
            const sqftVal = b.sqft ? `${b.sqft.toLocaleString()} SqFt` : "";
            const specParts = [
              sqftVal,
              b.bedrooms ? `${b.bedrooms} Beds` : "",
              b.bathrooms ? `${b.bathrooms} Baths` : "",
            ].filter(Boolean);
            const specs = specParts.join(" • ") || "Residential Cleaning";

            const assignedCleaners = Array.isArray(item.assignedCleaners)
              ? item.assignedCleaners.map((c: any) =>
                  typeof c === "object" ? c.name : c
                )
              : [];

            const totalPrice = b.totalAmount || 0;
            const leaderCommission = Math.round(totalPrice * 0.1);
            const cleanerPoolShare = Math.round(totalPrice * 0.4);

            const addonsList = Array.isArray(b.addons)
              ? b.addons.map((a: any) => (typeof a === "object" ? a.title : a))
              : [];

            return {
              id: bookingRef,
              _assignmentId: item._id || item.id,
              customerName,
              customerPhone,
              address,
              area,
              serviceType,
              packageType,
              timeSlot,
              specs,
              assignedCleaners,
              status:
                item.status === "COMPLETED"
                  ? "COMPLETED"
                  : item.status === "IN_PROGRESS" || (assignedCleaners.length > 0 && item.status !== "COMPLETED")
                  ? "IN_PROGRESS"
                  : "PENDING_DISPATCH",
              totalPrice,
              leaderCommission,
              cleanerPoolShare,
              addons: addonsList,
            };
          });
          setTeamBookings(mapped);
        }
      } catch (err) {
        console.error("Failed to load dashboard team assignments:", err);
      } finally {
        setIsLoadingBookings(false);
      }
    },
    [teamSlug]
  );

  const loadTeamMembers = useCallback(async () => {
    try {
      const teamData = await fetchTeamByIdOrSlugAPI(teamSlug);
      if (teamData && Array.isArray(teamData.members)) {
        const mappedMembers: TeamMember[] = teamData.members.map((m: any) => ({
          id: m.id || m._id || "",
          name: m.name || "Cleaner Staff",
          phone: m.phone || "N/A",
          status:
            m.dutyStatus === "IN_SERVICE"
              ? "IN_SERVICE"
              : m.dutyStatus === "ON_DUTY"
              ? "ON_DUTY"
              : "OFF_DUTY",
          dutyStartedAt: m.dutyStartedAt || null,
          totalDutyMinutes: m.totalDutyMinutes || 0,
          rating: m.rating ?? 4.9,
          completedJobs: m.completedJobs ?? 0,
          singleTeamVerified: true,
        }));
        setTeamMembers(mappedMembers);
      }
    } catch (err) {
      console.error("Failed to load team roster members:", err);
    }
  }, [teamSlug]);

  useEffect(() => {
    loadDashboardAssignments(teamBookings.length === 0);
    loadTeamMembers();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const handleSilentRefresh = () => {
      loadDashboardAssignments(false);
      loadTeamMembers();
    };

    socket.on("booking_updated", handleSilentRefresh);
    socket.on("booking_created", handleSilentRefresh);
    socket.on("team_updated", handleSilentRefresh);
    socket.on("cleaner_updated", handleSilentRefresh);
    socket.on("leader_request_updated", handleSilentRefresh);

    return () => {
      socket.off("booking_updated", handleSilentRefresh);
      socket.off("booking_created", handleSilentRefresh);
      socket.off("team_updated", handleSilentRefresh);
      socket.off("cleaner_updated", handleSilentRefresh);
      socket.off("leader_request_updated", handleSilentRefresh);
      socket.disconnect();
    };
  }, [loadDashboardAssignments, loadTeamMembers]);

  const activeOnDutyCount = teamMembers.filter((m) => m.status !== "OFF_DUTY").length;
  const pendingDispatchCount = teamBookings.filter((b) => b.status === "PENDING_DISPATCH").length;
  const completedCount = teamBookings.filter((b) => b.status === "COMPLETED").length;

  const openDispatchModal = (booking: TeamBooking) => {
    setDispatchModalBooking(booking);
    setSelectedCleanerNames(booking.assignedCleaners);
  };

  const toggleCleanerInModal = (name: string) => {
    setSelectedCleanerNames((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleSaveDispatch = async () => {
    if (!dispatchModalBooking || !dispatchModalBooking._assignmentId) return;

    setIsUpdatingDispatch(true);
    try {
      const assignmentId = dispatchModalBooking._assignmentId;
      const targetStatus = selectedCleanerNames.length > 0 ? "IN_PROGRESS" : "ASSIGNED";

      const res = await updateTeamAssignmentAPI(assignmentId, {
        assignedCleaners: selectedCleanerNames,
        status: targetStatus,
      });

      if (res?.success) {
        toast.success("সফলভাবে ক্লিনার বরাদ্দ ও ডিসপ্যাচ আপডেট করা হয়েছে!");
        setDispatchModalBooking(null);
        await loadDashboardAssignments(false);
      } else {
        toast.error(res?.message || "ডিসপ্যাচ আপডেট করতে ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      console.error("Save dispatch error:", err);
      toast.error(err?.message || "An error occurred while saving cleaner allocation");
    } finally {
      setIsUpdatingDispatch(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d274c] via-slate-900 to-[#007eff] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              DISPATCH HQ ACTIVE
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
              {displayTeamName}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              10% LEADER COMMISSION RATE
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Team Leader Command & Dispatch HQ
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
            স্বাগতম টিম লিডার! আপনার অধীনস্থ ক্লিনার টিম সামলান, ফিল্ডে সার্ভিস বন্টন করুন।
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto">
          <Link
            href={`${basePath}/bookings`}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>ফিল্ড ডিসপ্যাচ ম্যানেজার</span>
          </Link>
          <Link
            href={`${basePath}/available-bookings`}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>নতুন জব রিকোয়েস্ট</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50/40 border border-blue-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">টিম মেম্বার রোস্টার</span>
            <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{teamMembers.length} <span className="text-xl font-bold text-slate-600">জন</span></p>
            <div className="pt-2"><span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-3 py-1.5 rounded-full border border-blue-300 inline-block">🛡️ 1-Team সিঙ্গেল ভেরিফাইড</span></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/40 border border-emerald-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">অন-ডিউটি সক্রিয় স্টাফ</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{activeOnDutyCount} / {teamMembers.length} <span className="text-xl font-bold text-slate-600">প্রস্তুত</span></p>
            <div className="pt-2"><span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-300 inline-block">✓ কাজ গ্রহণের জন্য রেডি</span></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50/40 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">মুলতুবি ডিসপ্যাচ কাজ</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{pendingDispatchCount} <span className="text-xl font-bold text-slate-600">টি</span></p>
            <div className="pt-2"><span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-300 inline-block">⚡ ক্লিনার বরাদ্দ আবশ্যক</span></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50/70 via-white to-slate-50/40 border border-purple-200 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">১০% লিডার কমিশন ওয়ালেট</span>
            <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-purple-700 border border-purple-200 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳১৮,৪৫০</p>
            <div className="pt-2"><span className="text-xs font-bold text-purple-800 bg-purple-100/80 px-3 py-1.5 rounded-full border border-purple-300 inline-block">💰 ৫০%-১০%-৪০% কমিশন</span></div>
          </div>
        </div>
      </div>

      {/* Revenue Split Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0d274c] to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-blue-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">Official Revenue Commission Split Model (50% - 10% - 40%)</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              কাস্টমার পেমেন্ট: <strong>100%</strong> | অ্যাডমিন মার্জিন: <strong>50%</strong> | টিম লিডার কমিশন: <strong>10%</strong> | ক্লিনার স্টাফ পেমেন্ট: <strong>40%</strong>।
            </p>
          </div>
        </div>
        <Link href={`${basePath}/earnings`} className="px-4 py-2.5 rounded-xl bg-white text-[#0d274c] font-black text-xs hover:bg-blue-50 transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer">
          View Wallet Details →
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Roster */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#007eff]" /> {displayTeamName} Roster
              </h2>
              <p className="text-xs text-slate-500 font-medium">অ্যাডমিন কর্তৃক নিয়োজিত ক্লিনারের তালিকা</p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">{teamMembers.length} Cleaners</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
            {teamMembers.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 font-medium">
                টিমে এখনো কোনো ক্লিনার স্টাফ যোগ করা হয়নি
              </div>
            ) : (
              teamMembers.map((member) => {
                const getDutyBadge = () => {
                  if (member.status === "IN_SERVICE") {
                    return (
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#007eff] animate-pulse" />
                        In Service
                      </span>
                    );
                  }
                  if (member.status === "ON_DUTY") {
                    let timeLabel = "On Duty";
                    if (member.dutyStartedAt) {
                      const start = new Date(member.dutyStartedAt).getTime();
                      const diffMs = Math.max(0, Date.now() - start);
                      const mins = Math.floor(diffMs / (1000 * 60));
                      const hrs = Math.floor(mins / 60);
                      const remMins = mins % 60;
                      if (hrs > 0) timeLabel = `Active ${hrs}h ${remMins}m`;
                      else if (mins > 0) timeLabel = `Active ${mins}m`;
                      else timeLabel = `Active Just Now`;
                    }
                    return (
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        {timeLabel}
                      </span>
                    );
                  }
                  return (
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 bg-slate-100 text-slate-500 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Off Duty
                    </span>
                  );
                };

                return (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#007eff]/10 border border-[#007eff]/20 text-[#007eff] flex items-center justify-center font-black text-sm">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">
                            {member.name}
                          </h3>
                          <a
                            href={`tel:${member.phone}`}
                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="w-3 h-3" /> {member.phone}
                          </a>
                        </div>
                      </div>
                      {getDutyBadge()}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {member.rating} ({member.completedJobs} Jobs)
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        1-Team Verified
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bookings Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#007eff]" /> আজকের টিম ডিসপ্যাচ সময়সূচী
              </h2>
              <p className="text-xs text-slate-500 font-medium">অ্যাডমিন কর্তৃক {displayTeamName}য় নিয়োজিত সার্ভিস</p>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              {teamBookings.length} টির মধ্যে {completedCount} টি সম্পূর্ণ
            </span>
          </div>

          <div className="space-y-5">
            {isLoadingBookings && teamBookings.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-white border border-slate-200 rounded-3xl">
                <Loader2 className="w-8 h-8 animate-spin text-[#007eff] mx-auto" />
                <p className="text-xs font-bold text-slate-500">
                  আজকের ডিসপ্যাচ সময়সূচী লোড করা হচ্ছে...
                </p>
              </div>
            ) : teamBookings.length === 0 ? (
              <div className="py-12 text-center space-y-3 border border-dashed border-slate-200 rounded-3xl bg-white p-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center mx-auto">
                  <FolderOpen className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-800">
                    কোনো অ্যাসাইন করা বুকিং পাওয়া যায়নি
                  </h3>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                    বর্তমানে আপনার টিমে কোনো বুকিং সার্ভিস নিয়োজিত নেই। অ্যাডমিন কর্তৃক আপনার টিমে বুকিং হ্যান্ডওভার করা হলে এখানে রিয়েল-টাইম শো করবে।
                  </p>
                </div>
              </div>
            ) : (
              teamBookings.map((job) => {
                const getStatusBadge = () => {
                  switch (job.status) {
                    case "IN_PROGRESS":
                      return (
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                          IN PROGRESS
                        </span>
                      );
                    case "COMPLETED":
                      return (
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          COMPLETED
                        </span>
                      );
                    default:
                      return (
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          PENDING DISPATCH
                        </span>
                      );
                  }
                };
                return (
                  <div
                    key={job.id}
                    className={`p-6 rounded-3xl border transition-all space-y-5 ${
                      job.status === "IN_PROGRESS"
                        ? "bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border-blue-300 shadow-xs"
                        : job.status === "COMPLETED"
                        ? "bg-slate-50/70 border-slate-200"
                        : "bg-white border-amber-300 shadow-xs"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                          #{job.id}
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                            {job.serviceType}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {job.packageType}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge()}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400 uppercase text-[11px]">
                          Customer &amp; Contact
                        </span>
                        <p className="font-extrabold text-slate-900 flex items-center gap-2">
                          <User className="w-4 h-4 text-[#007eff]" /> {job.customerName}
                        </p>
                        <a
                          href={`tel:${job.customerPhone}`}
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5"
                        >
                          <Phone className="w-3.5 h-3.5" /> {job.customerPhone}
                        </a>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400 uppercase text-[11px]">
                          Service Address
                        </span>
                        <p className="font-bold text-slate-900 leading-snug flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{job.address}</span>
                        </p>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(
                            job.address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#007eff] hover:underline mt-1"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Google Maps ➔</span>
                        </a>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400 uppercase text-[11px]">
                          Time Slot &amp; Payout
                        </span>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-500" /> {job.timeSlot}
                        </p>
                        <div className="pt-0.5">
                          <span className="text-xs font-extrabold text-emerald-700">
                            Leader Cut: +৳{job.leaderCommission} (10%)
                          </span>
                        </div>
                        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                          {job.addons?.map((addon, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
                            >
                              + {addon}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-500">
                          Assigned Cleaners:
                        </span>
                        {job.assignedCleaners.length > 0 ? (
                          job.assignedCleaners.map((cleaner) => (
                            <span
                              key={cleaner}
                              className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200 flex items-center gap-1"
                            >
                              <UserCheck className="w-3 h-3" /> {cleaner}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            ⚠️ No Cleaners Assigned
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => openDispatchModal(job)}
                          className="px-4 py-2 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>
                            {job.assignedCleaners.length > 0
                              ? "ক্লিনার পরিবর্তন"
                              : "ক্লিনার বরাদ্দ"}
                          </span>
                        </button>
                        {job.status === "COMPLETED" && (
                          <Link
                            href={`${basePath}/proofs`}
                            className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                          >
                            <Camera className="w-3.5 h-3.5 text-emerald-600" />
                            <span>কাজের ছবি</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl sm:max-w-2xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-[#007eff] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">#{dispatchModalBooking.id}</span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">ক্লিনার স্টাফ বরাদ্দ ও ডিসপ্যাচ</h3>
                <p className="text-xs text-slate-500 font-medium">{dispatchModalBooking.serviceType} • {dispatchModalBooking.area}</p>
              </div>
              <button type="button" onClick={() => setDispatchModalBooking(null)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Team Cleaners for Dispatch (40% Pool Shared):</p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {teamMembers.map((cleaner) => {
                  const isChecked = selectedCleanerNames.includes(cleaner.name);
                  return (
                    <label key={cleaner.id} onClick={() => toggleCleanerInModal(cleaner.name)} className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${isChecked ? "bg-blue-50/80 border-[#007eff] shadow-xs" : "bg-slate-50 border-slate-200 hover:border-slate-300"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked ? "bg-[#007eff] border-[#007eff] text-white" : "border-slate-300 bg-white"}`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-slate-900 block">{cleaner.name}</span>
                          <span className="text-xs text-slate-500 font-medium">⭐ {cleaner.rating} • {cleaner.completedJobs} Jobs</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${cleaner.status === "ON_DUTY" ? "bg-emerald-100 text-emerald-800" : cleaner.status === "IN_SERVICE" ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-600"}`}>{cleaner.status}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button type="button" onClick={() => setDispatchModalBooking(null)} className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">বাতিল করুন</button>
              <button type="button" onClick={handleSaveDispatch} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs">ডিসপ্যাচ কনফার্ম করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
