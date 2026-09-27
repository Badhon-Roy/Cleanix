"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  UserCheck,
  Truck,
  ShieldCheck,
  Star,
  Camera,
  Upload,
  X,
  Phone,
  Mail,
  CheckCircle2,
  Sliders,
  Wrench,
  Users,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Sparkles,
  MapPin,
} from "lucide-react";
import { getAuthUser } from "@/utils/cookie";
import {
  fetchCleanerProfileMeAPI,
  ICleanerProfile,
} from "@/services/cleanerService";
import { fetchAllTeamsAPI, TeamSquad } from "@/services/teamService";
import { changePasswordAPI } from "@/services/authService";
import { uploadImageAPI } from "@/services/uploadService";
import { toast } from "sonner";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function CleanerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [cleanerProfile, setCleanerProfile] = useState<ICleanerProfile | null>(
    null,
  );
  const [myTeam, setMyTeam] = useState<TeamSquad | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState<string>("");
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [profileFeedback, setProfileFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Visibility Toggle State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // React Hook Form for Password Security
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watchPassword("newPassword");

  const loadProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      const authUser = getAuthUser();
      setUser(authUser);

      const [prof, teams] = await Promise.all([
        fetchCleanerProfileMeAPI(),
        fetchAllTeamsAPI(),
      ]);

      if (prof) {
        setCleanerProfile(prof);
        setNameInput(prof.name || authUser?.name || "");
        setPhoneInput(prof.phone || authUser?.phone || "");
        if (prof.avatar) {
          setAvatarUrl(prof.avatar);
        }
      } else if (authUser) {
        setNameInput(authUser.name || "");
        setPhoneInput(authUser.phone || "");
        if (authUser.avatar) {
          setAvatarUrl(authUser.avatar);
        }
      }

      if (Array.isArray(teams)) {
        const cleanerIdStr = prof?.id ? String(prof.id) : "";
        const userIdStr =
          authUser?.id || authUser?._id
            ? String(authUser.id || authUser._id)
            : "";

        const foundTeam = teams.find((t) => {
          const isLeader =
            String(t.leader?.id || "") === cleanerIdStr ||
            String(t.leader?.userId || "") === userIdStr;
          const isMember =
            Array.isArray(t.members) &&
            t.members.some(
              (m) =>
                String(m.id || "") === cleanerIdStr ||
                String(m.id || "") === userIdStr,
            );
          return isLeader || isMember;
        });

        setMyTeam(foundTeam || null);
      }
    } catch (err) {
      console.error("Failed to load cleaner profile page data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setProfileFeedback({
        type: "error",
        message: "নাম ফাঁকা রাখা যাবে না (Full Name is required)",
      });
      return;
    }
    if (!phoneInput.trim()) {
      setProfileFeedback({
        type: "error",
        message: "ফোন নম্বর ফাঁকা রাখা যাবে না (Phone Number is required)",
      });
      return;
    }

    setIsUpdatingProfile(true);
    setProfileFeedback(null);
    try {
      const { updateCleanerProfileMeAPI } =
        await import("@/services/cleanerService");
      const res = await updateCleanerProfileMeAPI({
        name: nameInput.trim(),
        phone: phoneInput.trim(),
        avatar: avatarUrl || null,
      });

      if (res?.success) {
        setProfileFeedback({
          type: "success",
          message:
            "প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে! (Profile Updated Successfully)",
        });
        const currAuth = getAuthUser();
        if (currAuth) {
          const { setAuthUser } = await import("@/utils/cookie");
          setAuthUser({
            ...currAuth,
            name: nameInput.trim(),
            phone: phoneInput.trim(),
            avatar: avatarUrl || null,
          });
        }
        await loadProfileData();
        setTimeout(() => setProfileFeedback(null), 5000);
      } else {
        setProfileFeedback({
          type: "error",
          message: res?.message || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।",
        });
      }
    } catch (err: any) {
      setProfileFeedback({
        type: "error",
        message: err?.message || "একটি ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdatingPassword(true);
    setPasswordFeedback(null);
    try {
      const res = await changePasswordAPI({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (res?.success) {
        setPasswordFeedback({
          type: "success",
          message:
            "পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে! (Password Updated Successfully)",
        });
        resetPasswordForm();
        setTimeout(() => setPasswordFeedback(null), 5000);
      } else {
        setPasswordFeedback({
          type: "error",
          message:
            res?.message ||
            "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে। বর্তমান পাসওয়ার্ড সঠিক দিন।",
        });
      }
    } catch (err: any) {
      setPasswordFeedback({
        type: "error",
        message: err?.message || "একটি ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("ছবির সাইজ ১০MB এর কম হতে হবে (File size must be less than 10MB)");
        return;
      }
      setIsUploadingAvatar(true);
      try {
        const res = await uploadImageAPI(file, "cleanix_avatars");
        if (res.success && res.url) {
          setAvatarUrl(res.url);
          toast.success("ছবি ক্লাউডে সফলভাবে আপলোড হয়েছে! পরিবর্তন নিশ্চিত করতে 'প্রোফাইল আপডেট করুন' বাটনে ক্লিক করুন।");
        } else {
          toast.error(res.message || "ছবি আপলোড ব্যর্থ হয়েছে।");
        }
      } catch (err) {
        toast.error("ছবি আপলোড করার সময় ত্রুটি ঘটেছে।");
      } finally {
        setIsUploadingAvatar(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const displayName =
    nameInput || cleanerProfile?.name || user?.name || "Cleaner Staff";
  const displayEmail = cleanerProfile?.email || user?.email || "N/A";
  const displayPhone =
    phoneInput || cleanerProfile?.phone || user?.phone || "N/A";
  const displayInitials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const displayCoverage =
    cleanerProfile?.coverageArea && cleanerProfile.coverageArea.length > 0
      ? cleanerProfile.coverageArea.join(", ")
      : "Gulshan, Banani, Dhanmondi, Uttara";
  const cleanerIdSnippet = String(
    cleanerProfile?.id || user?.id || user?._id || "880",
  )
    .slice(-6)
    .toUpperCase();

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              Cleaner Staff Profile &amp; Security
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ⚡{" "}
              {cleanerProfile?.isApproved
                ? "VERIFIED CLEANER"
                : "CLEANIX STAFF"}
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            আপনার ব্যক্তিগত তথ্য (নাম, ফোন, ছবি), পাসওয়ার্ড সিকিউরিটি, ফিল্ড
            কভারেজ এবং স্কোয়াড পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={loadProfileData}
          disabled={isLoading}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin text-[#007eff]" : ""}`}
          />
          <span>Sync Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal & Team Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <UserCheck className="w-5 h-5 text-[#007eff]" /> Personal
                  &amp; Duty Information
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  প্রোফাইল ছবি, নাম এবং ফোন নম্বর পরিবর্তন করে সংরক্ষণ করতে
                  পারেন।
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {myTeam ? `Squad: ${myTeam.teamName}` : "Field Operations"}
              </span>
            </div>

            {profileFeedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  profileFeedback.type === "success"
                    ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                    : "bg-red-50 border border-red-300 text-red-800"
                }`}
              >
                {profileFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span>{profileFeedback.message}</span>
              </div>
            )}

            {/* Avatar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gradient-to-r from-blue-50/70 via-slate-50 to-emerald-50/70 p-5 rounded-3xl border border-blue-100/80">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <div className="relative group flex-shrink-0">
                {avatarUrl ? (
                  <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-white shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 text-white flex items-center justify-center font-black text-2xl border-2 border-white shadow-xs">
                    {displayInitials}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload profile picture"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white text-[#007eff] border border-slate-200 flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {nameInput || displayName}
                </h4>
                <p className="text-xs text-slate-600 font-semibold">
                  Certified Field Cleaner • Cleanix Staff ID #{cleanerIdSnippet}
                </p>
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#007eff] bg-white hover:bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>
                      {avatarUrl
                        ? "নতুন ছবি নির্বাচন করুন"
                        : "Upload New Photo"}
                    </span>
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(null)}
                      className="text-xs font-bold text-red-600 bg-white hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>ছবি মুছুন</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Editable & Read-Only Form Grid */}
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Full Name:</span>
                    <span className="text-[11px] font-semibold text-[#007eff]">
                      ✏️ পরিবর্তনযোগ্য
                    </span>
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    required
                    className="mt-2 w-full bg-slate-50 border border-slate-200 focus:border-[#007eff] focus:bg-white rounded-2xl p-3 text-slate-900 font-bold focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Email Address:</span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      🔒 অপরিবর্তনযোগ্য
                    </span>
                  </label>
                  <input
                    type="text"
                    value={displayEmail}
                    disabled
                    className="mt-2 w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-slate-500 font-semibold cursor-not-allowed select-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Dispatch Phone:</span>
                    <span className="text-[11px] font-semibold text-[#007eff]">
                      ✏️ পরিবর্তনযোগ্য
                    </span>
                  </label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="ডিসপ্যাচ ফোন নম্বর লিখুন"
                    required
                    className="mt-2 w-full bg-slate-50 border border-slate-200 focus:border-[#007eff] focus:bg-white rounded-2xl p-3 text-slate-900 font-bold focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Assigned Coverage Area:</span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      🔒 এডমিন নির্ধারিত
                    </span>
                  </label>
                  <input
                    type="text"
                    value={displayCoverage}
                    disabled
                    className="mt-2 w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-slate-500 font-semibold cursor-not-allowed select-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isUpdatingProfile ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>প্রোফাইল আপডেট করুন (Save Changes)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Assigned Team Squad Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#007eff]" />
                <span>
                  {myTeam
                    ? `Assigned Squad: ${myTeam.teamName} (${(myTeam.members?.length || 0) + 1} Staff)`
                    : "Cleaner Field Squad Details"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                {myTeam
                  ? `Zone: ${myTeam.zone?.zoneName || "Dhaka"} • Leader: ${myTeam.leader?.name || "Supervisor"}`
                  : "আপনি বর্তমানে স্বাধীন ফিল্ড স্টাফ হিসেবে নিবন্ধিত আছেন।"}
              </p>
            </div>

            {myTeam ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Team Leader */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    👑
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    {myTeam.leader?.name || "Supervisor"}
                  </p>
                  <p className="text-xs text-[#007eff] font-bold">
                    Team Leader
                  </p>
                  <p className="text-[11px] text-slate-600 font-semibold">
                    {myTeam.leader?.phone || "N/A"}
                  </p>
                </div>

                {/* Team Members */}
                {Array.isArray(myTeam.members) &&
                  myTeam.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#007eff] flex items-center justify-center font-bold text-xs">
                        {member.name
                          ? member.name.slice(0, 2).toUpperCase()
                          : "ST"}
                      </div>
                      <p className="font-bold text-slate-900 text-sm">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-500 font-semibold">
                        {member.role || "Cleaning Staff"}
                      </p>
                      <p className="text-[11px] text-[#007eff] font-bold">
                        {member.phone}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
                  বর্তমানে আপনাকে কোনো নির্দিষ্ট স্কোয়াডে যুক্ত করা হয়নি। এডমিন
                  আপনাকে স্কোয়াডে অ্যাসাইন করলে সাথে সাথে এখানে টিম মেম্বারদের
                  তালিকা দেখতে পাবেন।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Password Security & Equipment (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Change Password & Security Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#007eff]" /> Password &amp;
                Security
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ক্লিনার একাউন্ট সুরক্ষার জন্য নতুন পাসওয়ার্ড সেট করুন।
              </p>
            </div>

            {passwordFeedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  passwordFeedback.type === "success"
                    ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                    : "bg-red-50 border border-red-300 text-red-800"
                }`}
              >
                {passwordFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span>{passwordFeedback.message}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmitPassword(onPasswordSubmit)}
              className="space-y-4 text-xs sm:text-sm"
            >
              {/* Current Password Field */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  Current Password:
                </label>
                <div className="relative mt-2">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                    {...registerPassword("currentPassword", {
                      required: "বর্তমান পাসওয়ার্ড আবশ্যক",
                    })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 pr-11 text-slate-900 font-medium focus:outline-none focus:bg-white ${
                      passwordErrors.currentPassword
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCurrentPassword((prev) => !prev);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007eff] transition-colors cursor-pointer p-1.5"
                    title={
                      showCurrentPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4 text-[#007eff]" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  New Password:
                </label>
                <div className="relative mt-2">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="নতুন পাসওয়ার্ড লিখুন"
                    {...registerPassword("newPassword", {
                      required: "নতুন পাসওয়ার্ড আবশ্যক",
                      minLength: {
                        value: 6,
                        message: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে",
                      },
                    })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 pr-11 text-slate-900 font-medium focus:outline-none focus:bg-white ${
                      passwordErrors.newPassword
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowNewPassword((prev) => !prev);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007eff] transition-colors cursor-pointer p-1.5"
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 text-[#007eff]" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  Confirm New Password:
                </label>
                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
                    {...registerPassword("confirmPassword", {
                      required: "পাসওয়ার্ড নিশ্চিতকরণ আবশ্যক",
                      validate: (val) =>
                        val === newPasswordValue || "পাসওয়ার্ড দুটি মিলছে না",
                    })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 pr-11 text-slate-900 font-medium focus:outline-none focus:bg-white ${
                      passwordErrors.confirmPassword
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmPassword((prev) => !prev);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007eff] transition-colors cursor-pointer p-1.5"
                    title={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-[#007eff]" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full py-3 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {isUpdatingPassword ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>পাসওয়ার্ড আপডেট করুন</span>
              </button>
            </form>
          </div>

          {/* Vehicle & Equipment Inventory */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#007eff]" /> Standard Kit
                Checklist
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                ফিল্ড সার্ভিসে বহনকৃত প্রয়োজনীয় ইকুইপমেন্ট।
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {[
                {
                  title: "Industrial Steam Extractor",
                  desc: "Heavy Duty Steam Sanitizer Unit",
                },
                {
                  title: "HEPA Dry Vacuum Cleaner",
                  desc: "Anti-Allergen Deep Suction Machine",
                },
                {
                  title: "Hospital-Grade Chemical Kit",
                  desc: "Eco-Friendly Anti-Bacterial Disinfectant",
                },
                {
                  title: "Carpet & Sofa Wash Extractor",
                  desc: "Fabric & Upholstery Deep Washer",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5"
                >
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
