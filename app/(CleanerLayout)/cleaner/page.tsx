"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
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
  Check,
  X,
  Sparkles,
  Calendar,
  Loader2,
  CalendarCheck,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import ProofOfWorkModal from "@/components/cleaner/ProofOfWorkModal";
import {
  fetchAllTeamsAPI,
  respondLeaderRequestAPI,
  fetchMyTeamAssignmentsAPI,
  updateTeamAssignmentAPI,
  TeamSquad,
} from "@/services/teamService";
import {
  fetchMyPendingAppointmentAPI,
  respondAppointmentAPI,
  LeaderAppointmentItem,
} from "@/services/appointmentService";
import {
  fetchCleanerProfileMeAPI,
  toggleCleanerDutyStatusAPI,
  ICleanerProfile,
} from "@/services/cleanerService";
import { updateBookingProgressAPI } from "@/services/bookingService";
import { getAuthUser, setAuthUser, setAuthRole } from "@/utils/cookie";
import { slugifyTeamName } from "@/utils/slug";

interface JobItem {
  id: string;
  _assignmentId: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  area: string;
  serviceType: string;
  specs: string;
  timeSlot: string;
  scheduledDate?: string;
  status: "ASSIGNED" | "EN_ROUTE" | "IN_PROGRESS" | "COMPLETION_REQUESTED" | "COMPLETED";
  payout: number;
  addons: string[];
  teamName?: string;
  teamCode?: string;
  dispatchNotes?: string;
  review?: {
    rating: number;
    feedback?: string;
    isApproved?: boolean;
    isFeatured?: boolean;
    createdAt?: string;
  } | null;
}

export default function CleanerDashboardPage() {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [isTogglingDuty, setIsTogglingDuty] = useState(false);
  const [cleanerProfile, setCleanerProfile] = useState<ICleanerProfile | null>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [updatingJobId, setUpdatingJobId] = useState<string | null>(null);
  const [activeTeamInfo, setActiveTeamInfo] = useState<{ teamName: string; teamCode: string } | null>(null);

  // Active Selected Job for Proof Upload Modal
  const [selectedProofJob, setSelectedProofJob] = useState<JobItem | null>(null);

  // Pending Team Leader Appointment Invitation State
  const [pendingAppointment, setPendingAppointment] = useState<LeaderAppointmentItem | null>(null);
  const [pendingLeaderTeam, setPendingLeaderTeam] = useState<TeamSquad | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: "ACCEPT" | "DECLINE";
  }>({
    isOpen: false,
    action: "ACCEPT",
  });

  // Load Cleaner Profile & Duty Status
  const loadCleanerDutyProfile = useCallback(async () => {
    try {
      const prof = await fetchCleanerProfileMeAPI();
      if (prof) {
        setCleanerProfile(prof);
        setIsOnDuty(prof.dutyStatus === "ON_DUTY" || prof.dutyStatus === "IN_SERVICE");
      }
    } catch (err) {
      console.error("Failed to load cleaner profile:", err);
    }
  }, []);

  // Load Real Assigned Jobs for this cleaner / team
  const loadAssignedJobs = useCallback(async () => {
    try {
      setIsLoadingJobs(true);
      const assignments = await fetchMyTeamAssignmentsAPI();
      if (Array.isArray(assignments)) {
        if (assignments.length > 0 && assignments[0].team) {
          setActiveTeamInfo({
            teamName: assignments[0].team.teamName || "Squad Active",
            teamCode: assignments[0].team.teamCode || "",
          });
        }

        const mapped: JobItem[] = assignments.map((item: any) => {
          const booking = item.booking || {};
          const user = booking.user || {};
          const serviceType = booking.serviceType || {};
          const location = booking.locationId || {};
          const team = item.team || {};

          // Dynamic specs calculation
          const cFields = booking.customFields || {};
          const specsParts: string[] = [];
          if (cFields.sqft) specsParts.push(`${cFields.sqft} SqFt`);
          if (cFields.bedrooms) specsParts.push(`${cFields.bedrooms} Bedrooms`);
          if (cFields.bathrooms) specsParts.push(`${cFields.bathrooms} Bathrooms`);
          const specsString =
            specsParts.length > 0
              ? specsParts.join(" • ")
              : serviceType.category
              ? `${serviceType.category} Standard Clean`
              : "Standard Cleaning Visit";

          // Extract addons
          const addonsList: string[] = [];
          if (Array.isArray(booking.selectedAddons)) {
            booking.selectedAddons.forEach((ad: any) => {
              if (typeof ad === "string") addonsList.push(ad);
              else if (ad?.title) addonsList.push(ad.title);
              else if (ad?.name) addonsList.push(ad.name);
            });
          }

          const fullAddress =
            booking.address || location.address || "Customer location specified in booking";
          const area = location.city || team.zone?.zoneName || "Dhaka Zone";

          return {
            id: booking.bookingRef || item._id,
            _assignmentId: item._id,
            bookingId: booking._id || "",
            customerName: user.name || "Customer",
            customerPhone: user.phone || "+880 1700-000000",
            address: fullAddress,
            area: area,
            serviceType: serviceType.title || "Professional Cleaning Service",
            specs: specsString,
            timeSlot: booking.timeSlot || "Scheduled Slot",
            scheduledDate: booking.scheduledDate || "",
            status: (item.status || booking.status || "ASSIGNED") as any,
            payout: Number(item.cleanerPoolPayout) || 1200,
            addons: addonsList,
            teamName: team.teamName,
            teamCode: team.teamCode,
            dispatchNotes: item.dispatchNotes || booking.notes || "",
            review: item.review || booking.review || null,
          };
        });

        setJobs(mapped);
      }
    } catch (err) {
      console.error("Failed to load assigned jobs:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  // Duty Toggle Handler
  const handleToggleDuty = async () => {
    setIsTogglingDuty(true);
    try {
      const targetStatus = isOnDuty ? "OFF_DUTY" : "ON_DUTY";
      const res = await toggleCleanerDutyStatusAPI(targetStatus);
      if (res?.success && res?.data) {
        const newDuty = res.data.dutyStatus === "ON_DUTY" || res.data.dutyStatus === "IN_SERVICE";
        setIsOnDuty(newDuty);
        toast.success(
          newDuty
            ? "অন-ডিউটি চালু হয়েছে! আপনার নাম স্কোয়াডে অন-ডিউটিতে প্রদর্শিত হচ্ছে।"
            : "ডিউটি বন্ধ করা হয়েছে! সিস্টেমে আপনি এখন অফ-ডিউটিতে আছেন।"
        );
        await loadCleanerDutyProfile();
      } else {
        toast.error(res?.message || "ডিউটি স্ট্যাটাস পরিবর্তন করা যায়নি");
      }
    } catch (err: any) {
      console.error("Toggle duty error:", err);
      toast.error(err?.message || "ডিউটি স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে");
    } finally {
      setIsTogglingDuty(false);
    }
  };

  // Dynamic Status Update Handler (En Route, Check In, Completion Request, Complete)
  const updateJobStatus = async (
    job: JobItem,
    newStatus: JobItem["status"],
    proofData?: any,
  ) => {
    setUpdatingJobId(job.id);
    try {
      // Optimistic state update
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
      );

      if (job._assignmentId) {
        await updateTeamAssignmentAPI(job._assignmentId, { status: newStatus });
      }
      if (job.bookingId) {
        await updateBookingProgressAPI(job.bookingId, {
          status: newStatus,
          ...(proofData ? { proofOfWork: proofData } : {}),
        });
      }

      if (newStatus === "EN_ROUTE") {
        toast.success("🚗 স্ট্যাটাস আপডেট: আপনি কাস্টমারের ঠিকানায় রওনা দিয়েছেন!");
      } else if (newStatus === "IN_PROGRESS") {
        toast.success("⏱️ স্ট্যাটাস আপডেট: ক্লিনিং কাজ শুরু হয়েছে (In Progress)!");
      } else if (newStatus === "COMPLETION_REQUESTED") {
        toast.success("📤 কাজের ছবি আপলোড হয়েছে ও কাস্টমারের অনুমোদনের জন্য রিকোয়েস্ট পাঠানো হয়েছে!");
      } else if (newStatus === "COMPLETED") {
        toast.success("🎉 কাজ সফলভাবে সম্পন্ন হয়েছে ও ভেরিফিকেশন জমা দেওয়া হয়েছে!");
      }

      await loadAssignedJobs();
      await loadCleanerDutyProfile();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      toast.error(err?.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
      await loadAssignedJobs();
    } finally {
      setUpdatingJobId(null);
    }
  };

  // Check if current cleaner has a pending Team Leader assignment request
  const checkPendingLeaderRequest = useCallback(async () => {
    try {
      const user = getAuthUser();
      if (user) {
        setUserProfile(user);
      }

      // 1. First query dedicated LeaderAppointment collection API
      const appt = await fetchMyPendingAppointmentAPI();
      if (appt && appt.team) {
        setPendingAppointment(appt);
        setPendingLeaderTeam({
          id: appt.team.id,
          teamCode: appt.team.teamCode,
          teamName: appt.team.teamName,
          teamImage: appt.team.teamImage,
          leader: {
            id: appt.cleaner.id,
            userId: appt.cleaner.id,
            name: appt.cleaner.name,
            email: appt.cleaner.email,
            phone: appt.cleaner.phone,
            rating: 5.0,
          },
          members: [],
          zone: {
            id: appt.team.zone?.id || "",
            zoneName: appt.team.zone?.zoneName || "Coverage Zone",
            district: appt.team.zone?.district || "Dhaka",
          },
          zoneId: appt.team.zone?.id || "",
          commissionRate: appt.commissionRate,
          cleanerPoolShare: appt.cleanerPoolShare,
          adminShare: appt.adminShare,
          leaderRequestStatus: appt.status,
          status: (appt.team.status || "ACTIVE") as any,
          completedJobsCount: 0,
        });
        return;
      }

      // 2. Fallback to Team Squads API search
      const teams = await fetchAllTeamsAPI();
      if (!teams || teams.length === 0) {
        setPendingAppointment(null);
        setPendingLeaderTeam(null);
        return;
      }

      const pendingTeams = teams.filter((t) => t.leaderRequestStatus === "PENDING");
      if (pendingTeams.length === 0) {
        setPendingAppointment(null);
        setPendingLeaderTeam(null);
        return;
      }

      const userEmail = (user?.email || "").toLowerCase().trim();
      const userName = (user?.name || "").toLowerCase().trim();
      const userPhone = (user?.phone || "").trim();
      const userId = user?.id || user?._id || "";

      const invitation = pendingTeams.find((t) => {
        const leaderEmail = (t.leader?.email || (t.leader as any)?.user?.email || "").toLowerCase().trim();
        const leaderName = (t.leader?.name || (t.leader as any)?.user?.name || "").toLowerCase().trim();
        const leaderPhone = (t.leader?.phone || "").trim();
        const leaderId = t.leader?.userId || t.leader?.id || "";

        const isEmailMatch = Boolean(userEmail && leaderEmail && userEmail === leaderEmail);
        const isIdMatch = Boolean(userId && leaderId && userId === leaderId);
        const isPhoneMatch = Boolean(userPhone && leaderPhone && userPhone === leaderPhone);
        const isNameMatch = Boolean(userName && leaderName && userName === leaderName);

        return isEmailMatch || isIdMatch || isPhoneMatch || isNameMatch;
      });

      if (!invitation && pendingTeams.length > 0) {
        const fallbackName = (userName || userProfile?.name || "").toLowerCase().trim();
        const fallbackMatch = pendingTeams.find((t) => {
          const lName = (t.leader?.name || "").toLowerCase().trim();
          return Boolean(fallbackName && lName && fallbackName === lName);
        });

        if (fallbackMatch) {
          setPendingLeaderTeam(fallbackMatch);
          return;
        }

        if (pendingTeams.length > 0 && (user?.role === "CLEANER" || !user)) {
          setPendingLeaderTeam(pendingTeams[0]);
          return;
        }
      }

      setPendingLeaderTeam(invitation || null);
    } catch (err) {
      console.error("Failed to check pending leader request:", err);
    }
  }, [userProfile?.name]);

  // Initial Load and Socket.IO Subscriptions
  useEffect(() => {
    checkPendingLeaderRequest();
    loadCleanerDutyProfile();
    loadAssignedJobs();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("booking_updated", () => {
      loadAssignedJobs();
      loadCleanerDutyProfile();
    });

    socket.on("team_assignment_updated", () => {
      loadAssignedJobs();
    });

    socket.on("team_updated", () => {
      checkPendingLeaderRequest();
      loadAssignedJobs();
    });

    socket.on("leader_request_updated", () => {
      checkPendingLeaderRequest();
    });

    socket.on("leader_appointment_updated", () => {
      checkPendingLeaderRequest();
    });

    socket.on("cleaner_updated", () => {
      checkPendingLeaderRequest();
      loadCleanerDutyProfile();
    });

    socket.on("review_created", () => {
      loadAssignedJobs();
      loadCleanerDutyProfile();
    });

    socket.on("review_updated", () => {
      loadAssignedJobs();
      loadCleanerDutyProfile();
    });

    return () => {
      socket.off("booking_updated");
      socket.off("team_assignment_updated");
      socket.off("team_updated");
      socket.off("leader_request_updated");
      socket.off("leader_appointment_updated");
      socket.off("cleaner_updated");
      socket.off("review_created");
      socket.off("review_updated");
      socket.disconnect();
    };
  }, [checkPendingLeaderRequest, loadAssignedJobs, loadCleanerDutyProfile]);

  // Respond to Leader Assignment Request (ACCEPT / DECLINE)
  const handleRespondRequest = async (action: "ACCEPT" | "DECLINE") => {
    if (!pendingLeaderTeam && !pendingAppointment) return;
    setIsResponding(true);

    try {
      let res: any;
      if (pendingAppointment?.id) {
        res = await respondAppointmentAPI(pendingAppointment.id, action);
      } else if (pendingLeaderTeam?.id) {
        res = await respondLeaderRequestAPI(pendingLeaderTeam.id, action);
      }

      if (res?.success) {
        if (action === "ACCEPT") {
          toast.success(
            `👑 Congratulations! You accepted Team Leader role for squad '${pendingLeaderTeam?.teamName || "New Squad"}'!`,
          );

          // Update local Auth Cookie and Role to TEAM_LEADER
          const currentUser = getAuthUser();
          if (currentUser) {
            currentUser.role = "TEAM_LEADER";
            setAuthUser(currentUser);
          }
          setAuthRole("TEAM_LEADER");

          // Automatically redirect to Team Leader Dashboard with dynamic team slug
          const teamNameSlug = slugifyTeamName(pendingLeaderTeam?.teamName);
          setTimeout(() => {
            window.location.href = teamNameSlug ? `/team/${teamNameSlug}` : "/team";
          }, 800);
        } else {
          toast.info("You have declined the Team Leader appointment request.");
          setPendingAppointment(null);
          setPendingLeaderTeam(null);
        }
      } else {
        toast.error(res?.message || "Failed to respond to leader request");
      }
    } catch (err: any) {
      console.error("Error responding to leader request:", err);
      toast.error(err?.message || "Failed to respond to leader request");
    } finally {
      setIsResponding(false);
    }
  };

  // Dynamic KPI Metric Calculations
  const totalJobsCount = jobs.length;
  const completedCount = jobs.filter((j) => j.status === "COMPLETED").length;
  const totalEstimatedEarnings = jobs.reduce((sum, j) => sum + (Number(j.payout) || 0), 0);
  const reviewedJobs = jobs.filter((j) => j.review && j.review.rating);
  const ratingValue =
    reviewedJobs.length > 0
      ? (
          reviewedJobs.reduce((sum, j) => sum + Number(j.review!.rating), 0) /
          reviewedJobs.length
        ).toFixed(1)
      : cleanerProfile?.rating
      ? Number(cleanerProfile.rating).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* 👑 Team Leader Appointment Request Banner */}
      {pendingLeaderTeam && (
        <div className="bg-[#F2D701] rounded-3xl p-6 sm:p-8 text-slate-900 space-y-5 animate-in fade-in border border-yellow-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/15 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-[#F2D701] flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-md">
                👑
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-slate-900 text-[#F2D701] uppercase">
                    ⚡ TEAM LEADER APPOINTMENT REQUEST
                  </span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900/10 text-slate-900 border border-slate-900/20">
                    {pendingLeaderTeam.teamCode}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 mt-1">
                  Admin appointed you as Leader of &apos;
                  {pendingLeaderTeam.teamName}&apos;
                </h2>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                disabled={isResponding}
                onClick={() => setModalState({ isOpen: true, action: "ACCEPT" })}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Accept Leader Role & Redirect</span>
              </button>

              <button
                type="button"
                disabled={isResponding}
                onClick={() => setModalState({ isOpen: true, action: "DECLINE" })}
                className="px-4 py-3 rounded-2xl bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 border border-slate-900/20 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4 text-slate-900" />
                <span>Decline Request</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold bg-slate-900/10 p-4 rounded-2xl border border-slate-900/15">
            <div>
              <span className="text-slate-800 text-[10px] uppercase font-black block">
                Leader Revenue Cut
              </span>
              <p className="text-sm font-black text-slate-950 mt-0.5">
                {pendingLeaderTeam.commissionRate}% Leader Commission
              </p>
            </div>
            <div>
              <span className="text-slate-800 text-[10px] uppercase font-black block">
                Cleaner Squad Pool
              </span>
              <p className="text-sm font-black text-slate-950 mt-0.5">
                {pendingLeaderTeam.cleanerPoolShare}% Cleaner Pool
              </p>
            </div>
            <div>
              <span className="text-slate-800 text-[10px] uppercase font-black block">
                Assigned Coverage Zone
              </span>
              <p className="text-sm font-black text-slate-950 mt-0.5">
                {pendingLeaderTeam.zone?.zoneName || "Dhaka Zone"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Duty Status & Shift Banner */}
      <div className="bg-gradient-to-r from-[#0d274c] via-slate-900 to-[#007eff] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 border ${
                isOnDuty
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                  : "bg-amber-500/20 text-amber-300 border-amber-400/30"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnDuty ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              {isOnDuty ? "DISPATCH ACTIVE" : "OFFLINE SHIFT"}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
              {activeTeamInfo
                ? `${activeTeamInfo.teamName.toUpperCase()} • ${activeTeamInfo.teamCode || "FIELD SQUAD"}`
                : "CLEANIX FIELD SQUAD • ACTIVE"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Cleaner Field Dispatch Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
            স্বাগতম {cleanerProfile?.name || userProfile?.name || "ক্লিনার স্টাফ"}! আজকের অ্যাসাইন করা
            ক্লিনিং ডিউটি ম্যানেজ করুন, রিয়েল-টাইম স্ট্যাটাস আপডেট দিন এবং কাজের ছবি আপলোড করুন।
          </p>
        </div>

        {/* Shift Toggle CTA Box */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex items-center gap-4 self-start md:self-auto relative z-10">
          <div>
            <p className="text-xs text-slate-300 font-bold uppercase">
              বর্তমান ডিউটি অবস্থা
            </p>
            <p className="text-sm font-extrabold text-white mt-0.5 flex items-center gap-1.5">
              {isOnDuty ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  অন-ডিউটি চালু
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  অফ-ডিউটি বন্ধ
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            disabled={isTogglingDuty}
            onClick={handleToggleDuty}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer shadow-xs ${
              isOnDuty
                ? "bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-400"
                : "bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300"
            } disabled:opacity-50 flex items-center gap-1.5`}
          >
            {isTogglingDuty && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isOnDuty ? "অফলাইন যান" : "অনলাইন যান"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Today's Jobs Card */}
        <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50/40 border border-blue-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              আজকের মোট ডিউটি কাজ
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {totalJobsCount}{" "}
              <span className="text-xl font-bold text-slate-600">টি</span>
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-3 py-1.5 rounded-full border border-blue-300 inline-block">
                ⚡ ফিল্ড ডিসপ্যাচ অ্যাসাইনমেন্ট
              </span>
            </div>
          </div>
        </div>

        {/* Completed Jobs Card */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/40 border border-emerald-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              সম্পন্নকৃত কাজ
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {completedCount}{" "}
              <span className="text-xl font-bold text-slate-600">টি</span>
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-300 inline-block">
                ✓ যাচাইকৃত & সম্পন্ন
              </span>
            </div>
          </div>
        </div>

        {/* Daily Payout Card */}
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50/40 border border-amber-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              আজকের আনুমানিক আয়
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ৳{totalEstimatedEarnings.toLocaleString()}
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-300 inline-block">
                💰 স্কোয়াড পুল শেয়ার
              </span>
            </div>
          </div>
        </div>

        {/* Customer Rating Card */}
        <div className="bg-gradient-to-br from-purple-50/70 via-white to-slate-50/40 border border-purple-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              পারফরম্যান্স রেটিং
            </span>
            <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-purple-700 border border-purple-200 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 fill-purple-600 stroke-[1.5]" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {ratingValue} <span className="text-amber-500">★</span>
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-purple-800 bg-purple-100/80 px-3 py-1.5 rounded-full border border-purple-300 inline-block">
                ★ প্রফেশনাল গড় রেটিং
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Assigned Jobs List Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#007eff]" /> আজকের ডিসপ্যাচ সময়সূচী
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              এক ক্লিকে কাজের স্ট্যাটাস আপডেট করুন, গুগল ম্যাপস নেভিগেশন চালু করুন এবং কাজের ছবি আপলোড করুন।
            </p>
          </div>

          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
            {totalJobsCount} টির মধ্যে {completedCount} টি কাজ সম্পন্ন
          </span>
        </div>

        {/* Loading State Skeleton */}
        {isLoadingJobs ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#007eff]" />
            <p className="text-sm font-bold text-slate-600">
              আপনার অ্যাসাইন করা কাজসমূহ লোড হচ্ছে...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center mx-auto">
              <CalendarCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900">
                বর্তমানে কোনো অ্যাসাইন করা কাজ নেই
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                টিম লিডার বা অ্যাডমিন আপনার স্কোয়াডে কাজ বরাদ্দ করলে এখানে রিয়েল-টাইমে শো করবে। ডিউটি অন রাখুন যাতে নতুন নোটিফিকেশন পান।
              </p>
            </div>
          </div>
        ) : (
          /* Jobs List Grid */
          <div className="space-y-5">
            {jobs.map((job) => {
              const isJobUpdating = updatingJobId === job.id;

              const getStatusBadge = () => {
                switch (job.status) {
                  case "EN_ROUTE":
                    return (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
                        EN ROUTE (ON THE WAY)
                      </span>
                    );
                  case "IN_PROGRESS":
                    return (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        IN PROGRESS (CLEANING)
                      </span>
                    );
                  case "COMPLETION_REQUESTED":
                    return (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        AWAITING CUSTOMER APPROVAL (কাস্টমার অনুমোদনের অপেক্ষায়)
                      </span>
                    );
                  case "COMPLETED":
                    return (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        JOB COMPLETED & VERIFIED
                      </span>
                    );
                  default:
                    return (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        ASSIGNED (UPCOMING)
                      </span>
                    );
                }
              };

              return (
                <div
                  key={job.id}
                  className={`p-6 rounded-3xl border transition-all space-y-5 ${
                    job.status === "EN_ROUTE" || job.status === "IN_PROGRESS"
                      ? "bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border-blue-300 shadow-xs"
                      : job.status === "COMPLETION_REQUESTED"
                      ? "bg-amber-50/50 border-amber-300 shadow-xs"
                      : job.status === "COMPLETED"
                      ? "bg-slate-50/70 border-slate-200"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  {/* Row Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-[#007eff] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                        #{job.id}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                        {job.serviceType}
                      </h3>
                    </div>

                    {getStatusBadge()}
                  </div>

                  {/* Job Specs & Client Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                    {/* Column 1: Client & Phone */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">
                        Customer & Phone
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

                    {/* Column 2: Location & Maps Navigation */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">
                        Service Address
                      </span>
                      <p className="font-bold text-slate-900 leading-snug flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{job.address}</span>
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#007eff] hover:underline mt-1"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate via Google Maps ➔</span>
                      </a>
                    </div>

                    {/* Column 3: Specs & Time Slot */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase text-[11px]">
                        Time Slot & Payout
                      </span>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-500" /> {job.timeSlot}
                        {job.scheduledDate && (
                          <span className="text-slate-500 font-medium">({job.scheduledDate})</span>
                        )}
                      </p>
                      <p className="font-extrabold text-emerald-700 text-sm mt-0.5">
                        Job Payout: ৳{job.payout.toLocaleString()}
                      </p>
                      {job.addons.length > 0 && (
                        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                          {job.addons.map((addon, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
                            >
                              + {addon}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Review & Rating Block (Always visible to cleaner as soon as submitted) */}
                  {job.review ? (
                    <div className="bg-gradient-to-r from-amber-50/90 via-yellow-50/60 to-orange-50/70 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-950 bg-amber-200/90 px-3 py-1 rounded-xl border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                            <Star className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                            <span>কাস্টমার রেটিং ও মূল্যায়ন</span>
                          </span>
                          <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-amber-200 shadow-2xs">
                            ★ {Number(job.review.rating).toFixed(1)} / 5.0
                          </span>
                        </div>

                        {/* Star visual icons */}
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(Number(job.review?.rating || 5))
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {job.review.feedback && job.review.feedback.trim().length > 0 ? (
                        <p className="text-xs sm:text-sm text-slate-800 font-medium italic bg-white/90 p-3 rounded-xl border border-amber-200/80 leading-relaxed">
                          &ldquo;{job.review.feedback}&rdquo;
                        </p>
                      ) : (
                        <p className="text-xs text-slate-600 font-medium italic bg-white/70 p-2.5 rounded-xl border border-amber-200/50">
                          কাস্টমার কোনো লিখিত মন্তব্য দেননি, ★ {Number(job.review.rating).toFixed(1)} রেটিং দিয়েছেন।
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-1 border-t border-amber-200/60">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ভেরিফাইড কাস্টমার ফিডব্যাক
                        </span>
                        {job.review.createdAt && (
                          <span>
                            {new Date(job.review.createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : job.status === "COMPLETED" ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        কাজ সম্পন্ন হয়েছে — কাস্টমারের রিভিউ ও রেটিংয়ের অপেক্ষায় আছে...
                      </span>
                    </div>
                  ) : null}

                  {/* Status Update CTA Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500 font-medium">
                      Property Specs:{" "}
                      <span className="font-bold text-slate-800">
                        {job.specs}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status Button 1: En Route */}
                      {job.status === "ASSIGNED" && (
                        <button
                          type="button"
                          disabled={isJobUpdating}
                          onClick={() => updateJobStatus(job, "EN_ROUTE")}
                          className="bg-blue-50 hover:bg-blue-100 text-[#007eff] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-blue-200 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isJobUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Truck className="w-4 h-4" />
                          )}
                          <span>রওয়ানা হয়েছি</span>
                        </button>
                      )}

                      {/* Status Button 2: Check in / In Progress */}
                      {job.status === "EN_ROUTE" && (
                        <button
                          type="button"
                          disabled={isJobUpdating}
                          onClick={() => updateJobStatus(job, "IN_PROGRESS")}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-amber-300 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isJobUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                          <span>কাজে উপস্থিত হয়েছি</span>
                        </button>
                      )}

                      {/* Status Button 3: Upload Proof & Complete */}
                      {(job.status === "IN_PROGRESS" || job.status === "EN_ROUTE") && (
                        <button
                          type="button"
                          onClick={() => setSelectedProofJob(job)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-2xl border border-emerald-500 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                        >
                          <Camera className="w-4 h-4" />
                          <span>ছবি আপলোড ও কাজ সম্পূর্ণ করুন</span>
                        </button>
                      )}

                      {/* Status Button 4: Awaiting Customer Approval */}
                      {job.status === "COMPLETION_REQUESTED" && (
                        <button
                          type="button"
                          onClick={() => setSelectedProofJob(job)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-amber-300 flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                          <span>কাস্টমার অনুমোদনের অপেক্ষায় (ছবি দেখুন)</span>
                        </button>
                      )}

                      {job.status === "COMPLETED" && (
                        <button
                          type="button"
                          onClick={() => setSelectedProofJob(job)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>কাজের ছবি দেখুন</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Proof of Work Modal */}
      {selectedProofJob && (
        <ProofOfWorkModal
          isOpen={selectedProofJob !== null}
          onClose={() => setSelectedProofJob(null)}
          jobId={selectedProofJob.id}
          jobTitle={selectedProofJob.serviceType}
          customerAddress={selectedProofJob.address}
          onSubmitComplete={async (proofData) => {
            await updateJobStatus(selectedProofJob, "COMPLETION_REQUESTED", proofData);
          }}
        />
      )}

      {/* Confirmation Modal for Accept & Decline */}
      {modalState.isOpen && pendingLeaderTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 text-slate-900">
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
                  Squad: {pendingLeaderTeam.teamName} (#{pendingLeaderTeam.teamCode})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {modalState.action === "ACCEPT"
                ? `By accepting, you will officially become the Team Leader of '${pendingLeaderTeam.teamName}'. Your account role will be promoted immediately to Team Leader with dashboard access.`
                : `Are you sure you want to decline the appointment request for '${pendingLeaderTeam.teamName}'? The admin will be notified and this status will be saved as Declined.`}
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
                disabled={isResponding}
                onClick={() => {
                  handleRespondRequest(modalState.action);
                  setModalState({ ...modalState, isOpen: false });
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
