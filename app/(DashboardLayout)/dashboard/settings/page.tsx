"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  User,
  MapPin,
  Shield,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Phone,
  Mail,
  Home,
  Building,
  Lock,
  Bell,
  Camera,
  Sliders,
  Upload,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import AddLocationModal, { NewAddressFormData } from "@/components/dashboard/AddLocationModal";
import DeleteConfirmModal from "@/components/dashboard/DeleteConfirmModal";
import DeleteAccountModal from "@/components/dashboard/DeleteAccountModal";
import { fetchCustomerProfileAPI, updateCustomerProfileAPI } from "@/services/customerService";
import { getAuthUser, setAuthUser } from "@/utils/cookie";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
}

export default function CustomerSettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSavedSuccess, setPasswordSavedSuccess] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState<number | null>(null);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  // Loading & Customer Profile States
  const [customerData, setCustomerData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Visibility Toggle State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // React Hook Form for Profile Info
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    watch: watchProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Watch full name for live avatar display
  const watchedName = watchProfile("name");

  // React Hook Form for Password Security
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  // Avatar Upload State & Ref
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Avatar Image File Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ফাইল সাইজ ৫MB এর বড় হওয়া যাবে না। দয়া করে ছোট ছবি নির্বাচন করুন।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Address Book State
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      tag: "Home (Primary)",
      street: "House 42, Road 11, Block D",
      area: "Gulshan-2",
      city: "Dhaka",
      zip: "1212",
      isDefault: true,
      type: "home",
    },
    {
      id: 2,
      tag: "Corporate Office",
      street: "Level 4, City Tower, Commercial Avenue",
      area: "Motijheel C/A",
      city: "Dhaka",
      zip: "1000",
      isDefault: false,
      type: "office",
    },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState({
    cleanerEnRouteSms: true,
    invoiceEmail: true,
    marketingOffer: false,
    weeklyScheduleReminder: true,
  });

  // Fetch Customer Profile on Component Mount
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      const res = await fetchCustomerProfileAPI();
      if (res?.success && res?.data) {
        setCustomerData(res.data);
        resetProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
        if (res.data.avatar) {
          setAvatarUrl(res.data.avatar);
        }
      }
      setIsLoadingProfile(false);
    };

    loadProfile();
  }, [resetProfile]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    const res = await updateCustomerProfileAPI({
      name: data.name,
      phone: data.phone,
      avatar: avatarUrl || "",
    });
    setIsUpdatingProfile(false);

    if (res?.success) {
      const currentUser = getAuthUser();
      if (currentUser) {
        setAuthUser({
          ...currentUser,
          name: data.name,
          avatar: avatarUrl || currentUser.avatar,
        });
      }

      toast.success(res.message || "Personal Information updated successfully!");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } else {
      toast.error(res?.message || "Failed to update profile!");
    }
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log("Password Data Submitted via React Hook Form:", data);
    setPasswordSavedSuccess(true);
    resetPasswordForm();
    setTimeout(() => setPasswordSavedSuccess(false), 3500);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Sliders className="w-6 h-6 stroke-[2.5]" />
              </div>
              Account Settings & Preferences
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ PROFILE CONTROL
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Update personal details, manage saved cleaning delivery addresses, and set communication alerts.
          </p>
        </div>
      </div>

      {/* Success Notification Alert Banner */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 sm:p-5 rounded-3xl text-emerald-900 text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Changes Saved Successfully!</p>
            <p className="text-xs text-emerald-700 font-medium">Your account profile details and settings have been updated.</p>
          </div>
        </div>
      )}

      {/* Main Settings Container (Grid Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal Profile & Address Book (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 1: Personal Profile Form using React Hook Form */}
          <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                  <User className="w-5 h-5 text-[#007eff]" /> Personal Information
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Manage your account name, email address, and primary contact phone number.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {customerData?.membershipBadge || "Customer Member"}
              </span>
            </div>

            {/* Profile Avatar Upload Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 p-5 rounded-3xl border border-blue-100/80">
              {/* HIDDEN FILE INPUT */}
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
                    <img
                      src={avatarUrl}
                      alt="Uploaded Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#007eff] via-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl border-2 border-white">
                    {watchedName ? watchedName.slice(0, 2).toUpperCase() : "CU"}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white text-[#007eff] border border-slate-200 flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Upload / Change Photo"
                >
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  {watchedName || customerData?.name || "Customer"}
                </h4>
                <p className="text-xs text-slate-600 font-semibold">
                  Customer Account • {customerData?.memberSince || "Member since 2026"}
                </p>
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#007eff] bg-white hover:bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Upload New Avatar</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-xs font-bold text-red-600 bg-white hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}

                  <span className="text-[11px] text-slate-400 font-medium">JPG or PNG (Max 5MB)</span>
                </div>
              </div>
            </div>

            {/* Editable Fields Grid registered with React Hook Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#007eff]" /> Full Name:
                </label>
                <input
                  type="text"
                  {...registerProfile("name", {
                    required: "Full Name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" },
                  })}
                  className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3.5 sm:p-4 text-slate-900 font-bold focus:outline-none focus:bg-white transition-all ${
                    profileErrors.name
                      ? "border-red-400 focus:border-red-500 bg-red-50/30"
                      : "border-slate-200 focus:border-[#007eff]"
                  }`}
                />
                {profileErrors.name && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {profileErrors.name.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#007eff]" /> Email Address:
                </label>
                <input
                  type="email"
                  {...registerProfile("email", {
                    required: "Email Address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Enter a valid email address",
                    },
                  })}
                  className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3.5 sm:p-4 text-slate-900 font-bold focus:outline-none focus:bg-white transition-all ${
                    profileErrors.email
                      ? "border-red-400 focus:border-red-500 bg-red-50/30"
                      : "border-slate-200 focus:border-[#007eff]"
                  }`}
                />
                {profileErrors.email && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {profileErrors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#007eff]" /> Phone Number:
                </label>
                <input
                  type="text"
                  {...registerProfile("phone", {
                    required: "Phone number is required",
                    minLength: { value: 8, message: "Enter a valid phone number" },
                  })}
                  className={`mt-2 w-full bg-slate-50 border rounded-2xl p-3.5 sm:p-4 text-slate-900 font-bold focus:outline-none focus:bg-white transition-all ${
                    profileErrors.phone
                      ? "border-red-400 focus:border-red-500 bg-red-50/30"
                      : "border-slate-200 focus:border-[#007eff]"
                  }`}
                />
                {profileErrors.phone && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {profileErrors.phone.message}
                  </p>
                )}
              </div>

              {/* Account Role */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#007eff]" /> Account Membership:
                </label>
                <input
                  type="text"
                  value={customerData?.membershipPlan || "Standard Customer (Active Account)"}
                  disabled
                  className="mt-2 w-full bg-slate-100/90 border border-slate-200 rounded-2xl p-3.5 sm:p-4 text-slate-600 font-bold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Save Profile Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl flex items-center gap-2 transition-all hover:scale-[1.01] cursor-pointer border border-blue-400 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* SECTION 2: Saved Address Book */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-[#007eff]" /> Saved Service Locations
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  বুকিং করার সময় দ্রুত সিলেক্ট করার জন্য ঠিকানা সেইভ করে রাখুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="bg-blue-50 hover:bg-blue-100 text-[#007eff] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-blue-200 flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Location</span>
              </button>
            </div>

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-3xl border transition-all space-y-3 relative ${
                    addr.isDefault
                      ? "bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/90 border-blue-200"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#007eff] flex items-center justify-center">
                        {addr.type === "home" ? (
                          <Home className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <Building className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{addr.tag}</span>
                    </div>

                    {addr.isDefault ? (
                      <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteAddressId(addr.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Delete Location"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <p className="text-slate-900 font-bold text-sm leading-snug">{addr.street}</p>
                    <p className="text-slate-600 font-medium text-xs mt-1">
                      {addr.area}, {addr.city} - {addr.zip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security & Communication Alerts (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* SECTION 3: Notification & SMS Preferences */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#007eff]" /> SMS & Email Alerts
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                সার্ভিস ও ক্লিন টিমের অটোমেটিক আপডেট কীভাবে পাবেন তা কন্ট্রোল করুন।
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "cleanerEnRouteSms" as const,
                  title: "Cleaner En-Route SMS Alert",
                  sub: "টিম রওনা হলে সাথে সাথে মোবাইল এসএমএস পাবেন",
                },
                {
                  key: "weeklyScheduleReminder" as const,
                  title: "Weekly Visit Reminder",
                  sub: "সার্ভিসের ২৪ ঘন্টা আগে ইমেইল ও এসএমএস নোটিফিকেশন",
                },
                {
                  key: "invoiceEmail" as const,
                  title: "Automated Invoice PDF",
                  sub: "পেমেন্ট হওয়ার সাথে সাথে ইমেইলে ইনভয়েস পাবেন",
                },
                {
                  key: "marketingOffer" as const,
                  title: "Exclusive Promotional Discounts",
                  sub: "বিশেষ অফার ও কুপন ডিসকাউন্ট নোটিফিকেশন",
                },
              ].map((item) => {
                const isEnabled = notifications[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleNotification(item.key)}
                    className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 cursor-pointer transition-all"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.sub}</p>
                    </div>

                    <div
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center flex-shrink-0 mt-0.5 ${
                        isEnabled ? "bg-[#007eff]" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          isEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: Security & Password Update */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#007eff]" /> Password & Security
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                অ্যাকাউন্টের সিকিউরিটি নিশ্চিত করতে নতুন পাসওয়ার্ড সেট করুন।
              </p>
            </div>

            {passwordSavedSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4 text-xs sm:text-sm">
              {/* Current Password Field */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">Current Password:</label>
                <div className="relative mt-2">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    {...registerPassword("currentPassword", {
                      required: "Current password is required",
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
                <label className="font-semibold text-slate-800">New Password:</label>
                <div className="relative mt-2">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...registerPassword("newPassword", {
                      required: "New password is required",
                      minLength: { value: 6, message: "New password must be at least 6 characters" },
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

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* SECTION 5: Danger Zone & Account Deletion */}
          <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 space-y-4">
            <div className="border-b border-red-200/60 pb-3.5">
              <h3 className="text-lg font-extrabold text-red-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" /> Delete Your Account
              </h3>
              <p className="text-xs text-red-700 font-medium mt-0.5">
                Permanently close and delete your Cleanix customer account profile and booking data.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Deleting your account will deactivate your saved addresses, active subscriptions, and profile information.
              </p>

              <button
                type="button"
                onClick={() => setIsDeleteAccountModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-500/20 border border-red-500 hover:scale-[1.01]"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
                <span>Delete Your Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Location Popup Modal with React Hook Form */}
      <AddLocationModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddLocation={(newLoc: NewAddressFormData) => {
          const newAddrObj = {
            id: Date.now(),
            tag: newLoc.tag,
            street: newLoc.street,
            area: newLoc.area,
            city: newLoc.city,
            zip: newLoc.zip || "1200",
            isDefault: false,
            type: newLoc.type,
          };
          setAddresses((prev) => [...prev, newAddrObj]);
          setIsAddressModalOpen(false);
        }}
      />

      {/* Delete Address Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteAddressId !== null}
        itemTitle={
          addresses.find((a) => a.id === deleteAddressId)
            ? `${addresses.find((a) => a.id === deleteAddressId)?.tag} - ${
                addresses.find((a) => a.id === deleteAddressId)?.street
              }`
            : ""
        }
        onClose={() => setDeleteAddressId(null)}
        onConfirm={() => {
          if (deleteAddressId !== null) {
            setAddresses((prev) => prev.filter((a) => a.id !== deleteAddressId));
            setDeleteAddressId(null);
          }
        }}
      />

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
      />
    </div>
  );
}
