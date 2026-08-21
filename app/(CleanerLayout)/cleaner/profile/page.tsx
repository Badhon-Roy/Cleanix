"use client";

import React, { useState, useRef } from "react";
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
} from "lucide-react";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function CleanerProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Visibility Toggle State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSavedSuccess, setPasswordSavedSuccess] = useState(false);

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

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log("Cleaner Password Submitted via React Hook Form:", data);
    setPasswordSavedSuccess(true);
    resetPasswordForm();
    setTimeout(() => setPasswordSavedSuccess(false), 4000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
              Cleaner Supervisor Profile & Security
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ⚡ CERTIFIED PRO CLEANER
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Manage your supervisor profile, security password credentials, assigned team members, and equipment inventory.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal & Team Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <UserCheck className="w-5 h-5 text-[#007eff]" /> Personal & Duty Information
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Supervisor badge details and dispatch contact credentials.
                </p>
              </div>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Team Lead (Level 3)
              </span>
            </div>

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
                  <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 text-white flex items-center justify-center font-bold text-2xl border-2 border-white">
                    RK
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white text-[#007eff] border border-slate-200 flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  Rahat Karim (Supervisor)
                </h4>
                <p className="text-xs text-slate-600 font-semibold">
                  Certified Senior Cleaner • Cleanix Employee ID #880
                </p>
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#007eff] bg-white hover:bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Upload New Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Read-Only Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Full Name:</label>
                <input
                  type="text"
                  value="Rahat Karim"
                  disabled
                  className="mt-2 w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-slate-800 font-bold cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Email Address:</label>
                <input
                  type="text"
                  value="rahat.karim@cleanix.com"
                  disabled
                  className="mt-2 w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-slate-800 font-bold cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Dispatch Phone:</label>
                <input
                  type="text"
                  value="+880 1700-999888"
                  disabled
                  className="mt-2 w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-slate-800 font-bold cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Assigned Hub Location:</label>
                <input
                  type="text"
                  value="Gulshan Sector Hub - Dhaka"
                  disabled
                  className="mt-2 w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-slate-800 font-bold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Assigned Team Members Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#007eff]" /> Team Delta Members (3 Staff)
              </h3>
              <p className="text-sm text-slate-600 font-semibold mt-1">
                Supervisor Rahat Karim-এর আন্ডারে কাজ করা সার্ভিস টিম মেম্বারবৃন্দ।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Rahat Karim", role: "Team Supervisor", phone: "+880 1700-999888" },
                { name: "Selim Reza", role: "Senior Technician", phone: "+880 1811-223344" },
                { name: "Shakil Ahmed", role: "Equipment Operator", phone: "+880 1911-556677" },
              ].map((member, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#007eff] flex items-center justify-center font-bold text-xs">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                  <p className="text-xs text-slate-500 font-semibold">{member.role}</p>
                  <p className="text-[11px] text-[#007eff] font-bold">{member.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Password Security & Equipment (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Change Password & Security Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#007eff]" /> Password & Security
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ক্লিনার ড্যাশবোর্ড সিকিউরিটির জন্য নতুন পাসওয়ার্ড আপডেট করুন।
              </p>
            </div>

            {passwordSavedSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! (Password Updated Successfully)</span>
              </div>
            )}

            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4 text-xs sm:text-sm">
              {/* Current Password Field */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Current Password:</label>
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
                      e.stopPropagation();
                      setShowCurrentPassword((prev) => !prev);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007eff] transition-colors cursor-pointer p-1.5 z-10"
                    title={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4 text-[#007eff]" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">New Password:</label>
                <div className="relative mt-2">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="নতুন পাসওয়ার্ড লিখুন"
                    {...registerPassword("newPassword", {
                      required: "নতুন পাসওয়ার্ড আবশ্যক",
                      minLength: { value: 6, message: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে" },
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
                      e.stopPropagation();
                      setShowNewPassword((prev) => !prev);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007eff] transition-colors cursor-pointer p-1.5 z-10"
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4 text-[#007eff]" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Confirm New Password:</label>
                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
                    {...registerPassword("confirmPassword", {
                      required: "পাসওয়ার্ড নিশ্চিতকরণ আবশ্যক",
                      validate: (val) => val === newPasswordValue || "পাসওয়ার্ড দুটি মিলছে না",
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
                      e.stopPropagation();
                      setShowConfirmPassword((prev) => !prev);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007eff] transition-colors cursor-pointer p-1.5 z-10"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-[#007eff]" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-[#007eff] to-blue-700 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>পাসওয়ার্ড আপডেট করুন (Update Password)</span>
              </button>
            </form>
          </div>

          {/* Vehicle & Equipment Inventory */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#007eff]" /> Vehicle & Kit Inventory
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Equipment assigned to Vehicle Unit #04.
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {[
                { title: "Service Van Unit #04", desc: "Toyota TownAce (Dhaka Metro-GA-11-2233)" },
                { title: "Industrial Steam Extractor", desc: "Kärcher SG 4/4 Heavy Duty Steamer" },
                { title: "HEPA Dry Vacuum Cleaner", desc: "Nilfisk VP300 Anti-Allergen Filtration" },
                { title: "Anti-Bacterial Chemical Kit", desc: "Diversey Hospital-Grade Sanitizer Set" },
                { title: "Upholstery Shampoo Washer", desc: "Professional Carpet & Mattress Extractor" },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
