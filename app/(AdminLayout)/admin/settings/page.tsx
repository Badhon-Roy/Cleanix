"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Settings,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  CreditCard,
  Building,
  Save,
} from "lucide-react";

interface AdminPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminSettingsPage() {
  const [passwordSavedSuccess, setPasswordSavedSuccess] = useState(false);
  const [configSavedSuccess, setConfigSavedSuccess] = useState(false);

  // Password Visibility State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // General Config State
  const [generalConfig, setGeneralConfig] = useState({
    companyName: "Cleanix Cleaning Services Ltd.",
    hotline: "+880 1700-999888",
    supportEmail: "support@cleanix.com",
    hubAddress: "House 12, Road 90, Gulshan-2, Dhaka 1212",
  });

  // Payment Gateways State
  const [paymentGateways, setPaymentGateways] = useState({
    stripe: true,
    sslcommerz: true,
    bkash: true,
    cod: true,
  });

  // React Hook Form for Password Change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<AdminPasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watchPassword("newPassword");

  const onPasswordSubmit = (data: AdminPasswordFormData) => {
    console.log("Admin Password Submitted via React Hook Form:", data);
    setPasswordSavedSuccess(true);
    resetPasswordForm();
    setTimeout(() => setPasswordSavedSuccess(false), 4000);
  };

  const handleGeneralConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSavedSuccess(true);
    setTimeout(() => setConfigSavedSuccess(false), 3000);
  };

  const toggleGateway = (gateway: keyof typeof paymentGateways) => {
    setPaymentGateways((prev) => ({
      ...prev,
      [gateway]: !prev[gateway],
    }));
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 stroke-[2.5]" />
              </div>
              System Settings & Platform Security
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ MASTER SYSTEM CONFIG
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Configure platform branding details, payment gateway integrations, and admin security credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: General & Payment Configuration (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* General Platform Config */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <Building className="w-5 h-5 text-[#007eff]" /> Platform General Info & Support Hotline
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Dispatch contact numbers and corporate headquarters info.
              </p>
            </div>

            {configSavedSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>General configuration saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleGeneralConfigSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800">Company Legal Name:</label>
                <input
                  type="text"
                  value={generalConfig.companyName}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, companyName: e.target.value })}
                  className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800">Dispatch Hotline Number:</label>
                  <input
                    type="text"
                    value={generalConfig.hotline}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, hotline: e.target.value })}
                    className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800">Support Email:</label>
                  <input
                    type="email"
                    value={generalConfig.supportEmail}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })}
                    className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800">HQ Central Hub Address:</label>
                <input
                  type="text"
                  value={generalConfig.hubAddress}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, hubAddress: e.target.value })}
                  className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-blue-400" />
                  <span>Save General Info</span>
                </button>
              </div>
            </form>
          </div>

          {/* Payment Gateways Config */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-[#007eff]" /> Payment Gateway Integrations
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Enable or disable checkout payment channels.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { key: "stripe" as const, name: "Stripe API (Visa, MasterCard, Amex)", desc: "Global Credit/Debit Cards & Subscriptions" },
                { key: "sslcommerz" as const, name: "SSLCommerz Local Gateway", desc: "Bangladeshi Banks & Mobile Banking" },
                { key: "bkash" as const, name: "bKash Direct Gateway API", desc: "bKash Tokenized Checkout" },
                { key: "cod" as const, name: "Cash on Delivery / Field Collect", desc: "Pay cash after cleaning completion" },
              ].map((gw) => (
                <div
                  key={gw.key}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{gw.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{gw.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleGateway(gw.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer border transition-colors ${
                      paymentGateways[gw.key]
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-200 text-slate-600 border-slate-300"
                    }`}
                  >
                    {paymentGateways[gw.key] ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Password Security Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#007eff]" /> Admin Change Password
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                অ্যাডমিন অ্যাকাউন্ট নিরাপত্তার জন্য পাসওয়ার্ড আপডেট করুন।
              </p>
            </div>

            {passwordSavedSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! (Password Updated)</span>
              </div>
            )}

            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4 text-xs sm:text-sm">
              {/* Current Password Field */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800">Current Admin Password:</label>
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
                <label className="font-extrabold text-slate-800">New Admin Password:</label>
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
                <label className="font-extrabold text-slate-800">Confirm New Password:</label>
                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
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
                className="w-full py-3 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-[#007eff] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                <span>Update Admin Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
