"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  Pencil,
} from "lucide-react";
import AddLocationModal, { NewAddressFormData } from "@/components/dashboard/AddLocationModal";
import DeleteConfirmModal from "@/components/dashboard/DeleteConfirmModal";
import DeleteAccountModal from "@/components/dashboard/DeleteAccountModal";
import { fetchCustomerProfileAPI, updateCustomerProfileAPI } from "@/services/customerService";
import { changePasswordAPI } from "@/services/authService";
import {
  fetchMyLocationsAPI,
  createLocationAPI,
  updateLocationAPI,
  setDefaultLocationAPI,
  deleteLocationAPI,
} from "@/services/locationService";
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

export default function SettingsClientView({
  initialData,
  initialLocations = [],
}: {
  initialData?: any;
  initialLocations?: any[];
}) {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSavedSuccess, setPasswordSavedSuccess] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any | null>(null);
  const [deleteAddressId, setDeleteAddressId] = useState<string | number | null>(null);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  // Loading & Customer Profile States initialized from SSR initialData
  const [customerData, setCustomerData] = useState<any>(initialData || null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(!initialData);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Visibility & Updating States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // React Hook Form for Profile Info
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    watch: watchProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
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

  // Avatar Upload State initialized from initialData
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData?.avatar || null);
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
        const newAvatar = reader.result as string;
        setAvatarUrl(newAvatar);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("cleanix_user_avatar", newAvatar);
          } catch {}
          window.dispatchEvent(
            new CustomEvent("user-profile-updated", {
              detail: { avatar: newAvatar },
            })
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("cleanix_user_avatar");
      } catch {}
      window.dispatchEvent(
        new CustomEvent("user-profile-updated", {
          detail: { avatar: "" },
        })
      );
    }
  };

  // Address Book State initialized from initialLocations
  const [addresses, setAddresses] = useState<any[]>(initialLocations || []);

  // Sync locations from SSR props
  useEffect(() => {
    setAddresses(initialLocations || []);
  }, [initialLocations]);

  const handleSetDefaultLocation = async (addr: any) => {
    const targetId = String(addr._id || addr.id);
    const res = await setDefaultLocationAPI(targetId);
    if (res?.success) {
      toast.success(res?.message || "Default location updated!");
      const fresh = await fetchMyLocationsAPI();
      if (fresh?.success && Array.isArray(fresh?.data)) {
        setAddresses(fresh.data);
      }
    } else {
      toast.error(res?.message || "Failed to set default location");
    }
  };

  const handleAddOrUpdateLocationSubmit = async (formData: NewAddressFormData) => {
    if (editingLocation) {
      const locId = String(editingLocation._id || editingLocation.id);
      const payload = {
        tag: formData.tag,
        type: formData.type,
        street: formData.street,
        area: formData.area,
        city: formData.city,
        zip: formData.zip || "1200",
      };
      const res = await updateLocationAPI(locId, payload);
      if (res?.success) {
        toast.success(res?.message || "Service location updated successfully!");
        setIsAddressModalOpen(false);
        setEditingLocation(null);
        const fresh = await fetchMyLocationsAPI();
        if (fresh?.success && Array.isArray(fresh?.data)) {
          setAddresses(fresh.data);
        }
      } else {
        toast.error(res?.message || "Failed to update location");
      }
    } else {
      const payload = {
        tag: formData.tag,
        type: formData.type,
        street: formData.street,
        area: formData.area,
        city: formData.city,
        zip: formData.zip || "1200",
        isDefault: false,
      };
      const res = await createLocationAPI(payload);
      if (res?.success) {
        toast.success(res?.message || "Service location added successfully!");
        setIsAddressModalOpen(false);
        const fresh = await fetchMyLocationsAPI();
        if (fresh?.success && Array.isArray(fresh?.data)) {
          setAddresses(fresh.data);
        }
      } else {
        toast.error(res?.message || "Failed to add service location");
      }
    }
  };

  const handleDeleteLocationConfirm = async () => {
    if (deleteAddressId !== null) {
      const targetId = String(deleteAddressId);
      const res = await deleteLocationAPI(targetId);
      if (res?.success) {
        toast.success(res?.message || "Service location deleted!");
        const fresh = await fetchMyLocationsAPI();
        if (fresh?.success && Array.isArray(fresh?.data)) {
          setAddresses(fresh.data);
        }
      } else {
        toast.error(res?.message || "Failed to delete location");
      }
      setDeleteAddressId(null);
    }
  };

  // Notifications State
  const [notifications, setNotifications] = useState({
    cleanerEnRouteSms: true,
    invoiceEmail: true,
    marketingOffer: false,
    weeklyScheduleReminder: true,
  });

  // Sync profile data from SSR props
  useEffect(() => {
    if (initialData) {
      setCustomerData(initialData);
      resetProfile({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
      });
      if (initialData.avatar) {
        setAvatarUrl(initialData.avatar);
      }
    }
  }, [initialData, resetProfile]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    const res = await updateCustomerProfileAPI({
      name: data.name,
      phone: data.phone,
      avatar: avatarUrl || "",
    });
    setIsUpdatingProfile(false);

    if (res?.success) {
      setSavedSuccess(true);
      if (res?.data) {
        setCustomerData(res.data);
        resetProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
      }

      const currentUser = getAuthUser();
      if (currentUser) {
        setAuthUser({
          ...currentUser,
          name: data.name,
          phone: data.phone,
          avatar: avatarUrl || currentUser.avatar,
        });
      }

      if (typeof window !== "undefined") {
        try {
          if (avatarUrl) {
            localStorage.setItem("cleanix_user_avatar", avatarUrl);
          } else {
            localStorage.removeItem("cleanix_user_avatar");
          }
        } catch {}
        window.dispatchEvent(
          new CustomEvent("user-profile-updated", {
            detail: {
              name: data.name,
              phone: data.phone,
              avatar: avatarUrl || "",
            },
          })
        );
      }

      setTimeout(() => setSavedSuccess(false), 4000);
    } else {
      toast.error(res?.message || "Failed to update personal information.");
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdatingPassword(true);
    const res = await changePasswordAPI({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    setIsUpdatingPassword(false);

    if (res?.success) {
      setPasswordSavedSuccess(true);
      resetPasswordForm();
      setTimeout(() => setPasswordSavedSuccess(false), 4000);
    } else {
      toast.error(res?.message || "Failed to update password!");
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-[#007eff]" /> Account Settings
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your personal details, service addresses, password security, and notification preferences.
          </p>
        </div>
      </div>

      {/* Settings Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Personal Info Form & Address Book (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION 1: Personal Information Form */}
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
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                customerData?.membershipBadge === 'VIP Subscriber'
                  ? 'text-amber-800 bg-amber-50 border-amber-300'
                  : customerData?.membershipBadge?.includes('Subscriber')
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-slate-700 bg-slate-100 border-slate-200'
              }`}>
                {customerData?.membershipBadge || "Free Member"}
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
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarUrl(null)}
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

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {savedSuccess ? (
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Personal info saved successfully!</span>
                </div>
              ) : (
                <span className="text-xs text-slate-600 font-semibold">
                  Click save to persist your profile updates.
                </span>
              )}

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold px-6 py-3.5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm transition-all hover:scale-[1.01] cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* SECTION 2: Saved Address Book Management */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-[#007eff]" /> Saved Service Locations
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  দ্রুত ও সহজে সার্ভিস বুকিং করতে আপনার বাসা বা অফিসের ঠিকানা যোগ ও পরিচালনা করুন।
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingLocation(null);
                  setIsAddressModalOpen(true);
                }}
                className="bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add New Location
              </button>
            </div>

            {/* Address Cards List */}
            {addresses.length === 0 ? (
              <div className="p-10 rounded-3xl border-2 border-dashed border-blue-200/80 bg-gradient-to-b from-blue-50/40 to-slate-50/60 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-100/70 text-[#007eff] flex items-center justify-center mx-auto border border-blue-200 shadow-sm">
                  <MapPin className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">কোনো সংরক্ষিত ঠিকানা নেই</h4>
                  <p className="text-sm sm:text-base text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                    আপনি এখনও কোনো সার্ভিস ঠিকানা যুক্ত করেননি। আপনার বাসা বা অফিসের প্রাথমিক ঠিকানা যোগ করতে <strong>&quot;+ Add New Location&quot;</strong> এ ক্লিক করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm sm:text-base px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/25 hover:scale-[1.02] cursor-pointer mt-2"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                  <span>Add First Location</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const addrId = addr._id || addr.id;
                  return (
                    <div
                      key={addrId}
                      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                        addr.isDefault
                          ? "border-[#007eff]/50 bg-blue-50/30 shadow-sm"
                          : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
                              {addr.type === "home" ? (
                                <Home className="w-4.5 h-4.5 text-[#007eff]" />
                              ) : (
                                <Building className="w-4.5 h-4.5 text-indigo-600" />
                              )}
                              <span>{addr.tag}</span>
                            </span>

                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                              <span className="text-slate-500">Property Type:</span>
                              <span className="text-slate-900 font-extrabold capitalize">
                                {addr.type === "home"
                                  ? "Home / Apartment"
                                  : addr.type === "office"
                                  ? "Commercial Office"
                                  : addr.type || "Home"}
                              </span>
                            </div>
                          </div>

                          {addr.isDefault && (
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500 text-white flex-shrink-0">
                              Primary
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed pt-0.5">
                          {addr.street}, {addr.area}, {addr.city} - {addr.zip || "1200"}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
                        {!addr.isDefault ? (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultLocation(addr)}
                            className="text-[#007eff] hover:text-blue-700 font-extrabold flex items-center gap-1.5 hover:underline transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#007eff]" />
                            <span>Set as Primary Default</span>
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-extrabold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Primary Default Selected</span>
                          </span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLocation(addr);
                              setIsAddressModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#007eff] hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Location"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteAddressId(addrId)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Location"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preferences, Password Security & Danger Zone (Span 1) */}
        <div className="space-y-8">
          {/* SECTION 3: Notification Preferences */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#007eff]" /> Notification Alerts
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ক্লিনারের লাইভ আপডেট ও ইনভয়েসের অ্যালার্ট নোটিফিকেশন সেটিংস
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {[
                {
                  key: "cleanerEnRouteSms",
                  title: "Cleaner Team Dispatch SMS",
                  desc: "এসএমএস-এর মাধ্যমে টিম রওনা হওয়ার রিয়েল-টাইম অ্যালার্ট",
                },
                {
                  key: "invoiceEmail",
                  title: "PDF Invoice Email Alerts",
                  desc: "সার্ভিস সম্পন্নের পর অটোমেটিক ইমেইল ইনভয়েস",
                },
                {
                  key: "weeklyScheduleReminder",
                  title: "Weekly Visit Reminder",
                  desc: "সাপ্তাহিক রুটিন ক্লিনিং এর ১ দিন আগে রিমাইন্ডার",
                },
                {
                  key: "marketingOffer",
                  title: "Special Offer & Coupons",
                  desc: "বিশেষ অফার ও কুপন ডিসকাউন্ট নোটিফিকেশন",
                },
              ].map((item) => {
                const isChecked = notifications[item.key as keyof typeof notifications];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                    className="flex items-start justify-between p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="space-y-0.5 pr-2">
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-snug">{item.desc}</p>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 mt-0.5 ${
                        isChecked ? "bg-[#007eff]" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          isChecked ? "left-5" : "left-1"
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
                অ্যাকাউন্টের সিকিউরিটি নিশ্চিত করতে পাসওয়ার্ড ম্যানেজ করুন।
              </p>
            </div>

            {customerData?.isGoogleUser && (
              <div className="bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/90 p-4 rounded-2xl border border-blue-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
                  <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-xs text-[11px] font-black text-[#007eff]">G</span>
                  <span>Google Single Sign-On Active</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  You logged in with <strong>Google OAuth</strong>. You do not need a current password. You can set a new password below to enable standard password login anytime.
                </p>
              </div>
            )}

            {passwordSavedSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4 text-xs sm:text-sm">
              {/* Current Password Field (Only required for normal password accounts) */}
              {!customerData?.isGoogleUser && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800">Current Password:</label>
                    <Link
                      href={`/forgot-password?email=${encodeURIComponent(customerData?.email || "")}`}
                      className="text-xs font-extrabold text-[#007eff] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      {...registerPassword("currentPassword", {
                        required: customerData?.isGoogleUser ? false : "Current password is required",
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
              )}

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">
                  {customerData?.isGoogleUser ? "Set Account Password:" : "New Password:"}
                </label>
                <div className="relative mt-2">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder={customerData?.isGoogleUser ? "Enter new account password" : "Enter new password"}
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
                disabled={isUpdatingPassword}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>{customerData?.isGoogleUser ? "Set Account Password" : "Update Password"}</span>
                )}
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

      {/* Add / Edit Location Popup Modal with React Hook Form */}
      <AddLocationModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingLocation(null);
        }}
        onAddLocation={handleAddOrUpdateLocationSubmit}
        initialValues={editingLocation}
      />

      {/* Delete Address Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteAddressId !== null}
        itemTitle={
          addresses.find((a) => (a._id || a.id) === deleteAddressId)
            ? `${addresses.find((a) => (a._id || a.id) === deleteAddressId)?.tag} - ${
                addresses.find((a) => (a._id || a.id) === deleteAddressId)?.street
              }`
            : ""
        }
        onClose={() => setDeleteAddressId(null)}
        onConfirm={handleDeleteLocationConfirm}
      />

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
      />
    </div>
  );
}
