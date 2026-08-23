"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Building2,
  Home as HomeIcon,
  Check,
  Camera,
  Calendar as CalendarIcon,
  UserCheck,
  ChevronLeft,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { SwirlLogo } from "@/components/Navbar";
import {
  registerUserAPI,
  googleLoginAPI,
  getGoogleAuthUrl,
  sendRegisterOtpAPI,
  verifyRegisterOtpAPI,
} from "@/services/authService";
import { setAuthUser, setAuthRole, setAuthToken } from "@/utils/cookie";

export interface IRegisterStep2Form {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

function GoogleIcon() {
  return (
    <svg className="w-4.5 h-4.5 flex-shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

type AccountType = "CUSTOMER" | "CLEANER";
type Gender = "Male" | "Female" | "Other";
type Step = 1 | 2 | 3 | 4;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pure React State - Guarantees 100% instant reactivity regardless of navigation path or URL entry
  const [step, setStep] = useState<Step>(1);
  const [accountType, setAccountType] = useState<AccountType>("CUSTOMER");

  // React Hook Form for Step 2 Credentials
  const {
    register: registerField,
    handleSubmit: handleRHFSubmitStep2,
    formState: { errors: formErrors },
    watch,
  } = useForm<IRegisterStep2Form>({
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});

  // Cleaner Verification Fields (Step 3)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [dob, setDob] = useState(""); // Format: YYYY-MM-DD
  const [gender, setGender] = useState<Gender>("Male");

  // Custom Dropdown Controls
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isDobOpen, setIsDobOpen] = useState(false);
  const genderRef = useRef<HTMLDivElement>(null);
  const dobRef = useRef<HTMLDivElement>(null);

  // Custom Calendar State
  const [currentViewDate, setCurrentViewDate] = useState(new Date(1998, 0, 1));

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Email OTP Verification States & Modal
  const [pendingStep2Data, setPendingStep2Data] = useState<IRegisterStep2Form | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [canResendOtp, setCanResendOtp] = useState(false);

  const registerOtpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    let interval: any;
    if (isOtpModalOpen && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds <= 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtpDigits(newOtp);
      const nextIdx = Math.min(pasted.length, 5);
      registerOtpRefs[nextIdx].current?.focus();
      return;
    }

    const digit = value.replace(/\D/g, "");
    const newOtp = [...otpDigits];
    newOtp[index] = digit;
    setOtpDigits(newOtp);

    if (digit && index < 5) {
      registerOtpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      registerOtpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const pastedArr = pastedData.split("");
      const newOtp = ["", "", "", "", "", ""];
      pastedArr.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtpDigits(newOtp);
      const focusIndex = Math.min(pastedArr.length, 5);
      registerOtpRefs[focusIndex].current?.focus();
    }
  };

  const handleSendEmailOtp = async (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address first");
      return;
    }
    setIsSendingOtp(true);

    const res = await sendRegisterOtpAPI(email);
    setIsSendingOtp(false);

    if (res?.success) {
      setTimerSeconds(300);
      setCanResendOtp(false);
      setOtpDigits(["", "", "", "", "", ""]);
      setStep(3);
      toast.success(res?.message || "Verification OTP Sent!");
      setTimeout(() => registerOtpRefs[0].current?.focus(), 350);
    } else {
      toast.error(res?.message || "Failed to send verification OTP");
    }
  };

  const handleVerifyEmailOtp = async (email: string) => {
    const fullCode = otpDigits.join("");
    if (fullCode.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP code");
      return;
    }
    setIsVerifyingOtp(true);
    const res = await verifyRegisterOtpAPI(email, fullCode);
    setIsVerifyingOtp(false);

    if (res?.success) {
      setIsEmailVerified(true);
      toast.success(res?.message || "Email Address Verified Successfully!");

      const step2FormData = pendingStep2Data || watch();
      if (accountType === "CLEANER") {
        setStep(4);
      } else {
        handleFinalRegistration(step2FormData);
      }
    } else {
      toast.error(res?.message || "Invalid or expired OTP code");
    }
  };

  // Direct, instant role selection handler
  const handleSelectRole = (role: AccountType) => {
    setAccountType(role);
  };

  // Close custom dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genderRef.current && !genderRef.current.contains(event.target as Node)) {
        setIsGenderOpen(false);
      }
      if (dobRef.current && !dobRef.current.contains(event.target as Node)) {
        setIsDobOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Step 1 -> Step 2
  const handleProceedToStep2 = () => {
    setStep(2);
  };

  // Step 2 Valid Submission Handler (Triggered by React Hook Form)
  const handleStep2Submit = (data: IRegisterStep2Form) => {
    if (!isEmailVerified) {
      setPendingStep2Data(data);
      handleSendEmailOtp(data.email);
      return;
    }
    if (accountType === "CLEANER") {
      setStep(3);
    } else {
      handleFinalRegistration(data);
    }
  };

  // Avatar Upload Handler (Supports all image formats: PNG, JPG, JPEG, WEBP, GIF, SVG, HEIC, AVIF)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Date Handler
  const handleSelectDate = (day: number) => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    setDob(dateStr);
    setIsDobOpen(false);
    if (step3Errors.dob) setStep3Errors((prev) => ({ ...prev, dob: "" }));
  };

  // Helper for generating calendar grid
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Final Form Submission
  const handleFinalRegistration = async (step2Data?: IRegisterStep2Form) => {
    if (accountType === "CLEANER") {
      const newErrors: Record<string, string> = {};
      if (!dob) newErrors.dob = "Please select your Date of Birth";
      if (!gender) newErrors.gender = "Please select your Gender";
      if (!agreeTerms) newErrors.agreeTerms = "You must agree to the Terms of Service & Privacy Policy";
      setStep3Errors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        toast.error("Please fix the highlighted errors below");
        return;
      }
    }

    setIsLoading(true);

    try {
      const isCleaner = accountType === "CLEANER";
      const approvalStatus = isCleaner ? "PENDING_APPROVAL" : "APPROVED";
      const isApproved = !isCleaner;

      // Extract values from step2Data, pendingStep2Data, or watch()
      const credentials = step2Data || pendingStep2Data || watch();

      if (!credentials.email || !credentials.fullName || !credentials.phone || !credentials.password) {
        toast.error("Account credentials missing. Please return to Step 2 to enter your details.");
        setIsLoading(false);
        setStep(2);
        return;
      }

      const formData = new FormData();
      formData.append("name", credentials.fullName);
      formData.append("email", credentials.email);
      formData.append("phone", credentials.phone);
      formData.append("password", credentials.password);
      formData.append("role", accountType);
      if (avatarPreview) formData.append("avatar", avatarPreview);
      if (isCleaner && dob) formData.append("dob", dob);
      if (isCleaner && gender) formData.append("gender", gender);

      const res = await registerUserAPI(formData);

      if (!res?.success) {
        toast.error(res?.message || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success(res?.message || "User registered successfully!");

      // Store Access Token in Cookie (Instant Automatic Login)
      const token = res?.data?.accessToken || res?.accessToken;
      if (token) {
        setAuthToken(token);
      }

      // Store user auth in cookies
      const userData = {
        name: res.data?.user?.name || credentials.fullName,
        email: res.data?.user?.email || credentials.email,
        phone: res.data?.user?.phone || credentials.phone,
        role: res.data?.user?.role || accountType,
        avatar: avatarPreview,
        dob: isCleaner ? dob : undefined,
        gender: isCleaner ? gender : undefined,
        status: res.data?.user?.status || approvalStatus,
        isApproved: res.data?.user?.isApproved !== undefined ? res.data?.user?.isApproved : isApproved,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      };

      setAuthUser(userData);
      setAuthRole(userData.role);

      // Auto-login: Redirect directly to application pages based on role
      if (userData.role === "ADMIN") {
        setTimeout(() => {
          router.push("/admin");
        }, 800);
      } else if (isCleaner) {
        setTimeout(() => {
          router.push("/waiting-approval");
        }, 800);
      } else {
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (error: any) {
      toast.error(error?.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    toast.info("Redirecting to Google Sign-In...", {
      description: "Connecting to Google OAuth 2.0 service",
    });
    try {
      const googleUrl = await getGoogleAuthUrl();
      window.location.href = `${googleUrl}?role=${accountType}`;
    } catch (error) {
      console.error("Failed to get Google Auth URL:", error);
      toast.error("Failed to connect to Google OAuth service.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between py-2 mb-4 lg:mb-6">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <SwirlLogo />
            <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur-sm -z-10 group-hover:bg-blue-500/30 transition-all" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#11233F] text-2xl font-bold tracking-tight group-hover:text-[#007eff] transition-colors">
              Cleanix
            </span>
            <span className="text-[10px] uppercase tracking-wider text-blue-600 font-semibold -mt-1">
              Field & Space Automation
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-slate-600 hover:text-[#11233F] text-xs sm:text-sm font-medium transition-colors hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <span>Already have an account?</span>
            <span className="text-[#007eff] font-bold">Sign In</span>
          </Link>
          <Link
            href="/pricing"
            className="bg-white hover:bg-slate-100 text-[#11233F] border border-slate-200/80 shadow-xs hover:shadow-md px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Pricing</span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
          </Link>
        </div>
      </header>

      {/* Main Centered Container */}
      <main className="flex-1 flex items-center justify-center my-auto py-4 sm:py-6">
        <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
          {/* Main Card Container with Same Border & Top Glow as Login */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-300/30 relative">
            {/* Top Glowing Edge (Same as Login Page) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-transparent via-[#007eff] to-transparent" />

            {/* Stepper Progress Bar */}
            <div className="mb-7 flex items-center justify-between border-b border-slate-100 pb-4">
              {/* Step 1 Pill */}
              <div
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  step === 1
                    ? "text-[#007eff] font-bold"
                    : "text-emerald-600 hover:text-emerald-700 font-semibold"
                }`}
              >
                <span
                  className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center text-xs sm:text-sm font-extrabold transition-all duration-150 cursor-pointer ${
                    step === 1
                      ? "bg-[#007eff] text-white shadow-md shadow-blue-500/35 ring-4 ring-blue-500/15"
                      : "bg-emerald-100 text-emerald-700 shadow-xs"
                  }`}
                >
                  {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : "1"}
                </span>
                <span className="text-xs sm:text-sm tracking-tight font-bold cursor-pointer">
                  1. Select Role
                </span>
              </div>

              <div className="flex-1 h-[2px] mx-2 sm:mx-3 bg-gradient-to-r from-slate-200 via-blue-100 to-slate-200 rounded-full" />

              {/* Step 2 Pill */}
              <div
                onClick={() => {
                  if (step > 2) setStep(2);
                }}
                className={`flex items-center gap-2 transition-all cursor-pointer ${
                  step === 2
                    ? "text-[#007eff] font-bold"
                    : step > 2
                    ? "text-emerald-600 hover:text-emerald-700 font-semibold"
                    : "text-slate-400 font-medium"
                }`}
              >
                <span
                  className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center text-xs sm:text-sm font-extrabold transition-all duration-150 cursor-pointer ${
                    step === 2
                      ? "bg-[#007eff] text-white shadow-md shadow-blue-500/35 ring-4 ring-blue-500/15"
                      : step > 2
                      ? "bg-emerald-100 text-emerald-700 shadow-xs"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : "2"}
                </span>
                <span className="text-xs sm:text-sm tracking-tight font-bold cursor-pointer">
                  2. Account Info
                </span>
              </div>

              <div className="flex-1 h-[2px] mx-2 sm:mx-3 bg-gradient-to-r from-slate-200 via-blue-100 to-slate-200 rounded-full" />

              {/* Step 3 Pill (Email Verification) */}
              <div
                onClick={() => {
                  if (step > 3 || (step === 2 && pendingStep2Data)) setStep(3);
                }}
                className={`flex items-center gap-2 transition-all cursor-pointer ${
                  step === 3
                    ? "text-[#007eff] font-bold"
                    : step > 3
                    ? "text-emerald-600 hover:text-emerald-700 font-semibold"
                    : "text-slate-400 font-medium"
                }`}
              >
                <span
                  className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center text-xs sm:text-sm font-extrabold transition-all duration-150 cursor-pointer ${
                    step === 3
                      ? "bg-[#007eff] text-white shadow-md shadow-blue-500/35 ring-4 ring-blue-500/15"
                      : step > 3
                      ? "bg-emerald-100 text-emerald-700 shadow-xs"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : "3"}
                </span>
                <span className="text-xs sm:text-sm tracking-tight font-bold cursor-pointer">
                  3. Verify Email
                </span>
              </div>

              {/* Step 4 Pill (Cleaner Profile - Only for CLEANER) */}
              {accountType === "CLEANER" && (
                <>
                  <div className="flex-1 h-[2px] mx-2 sm:mx-3 bg-gradient-to-r from-slate-200 via-blue-100 to-slate-200 rounded-full" />

                  <div
                    onClick={() => {
                      if (isEmailVerified) setStep(4);
                    }}
                    className={`flex items-center gap-2 transition-all cursor-pointer ${
                      step === 4
                        ? "text-[#007eff] font-bold"
                        : "text-slate-400 font-medium"
                    }`}
                  >
                    <span
                      className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center text-xs sm:text-sm font-extrabold transition-all duration-150 cursor-pointer ${
                        step === 4
                          ? "bg-[#007eff] text-white shadow-md shadow-blue-500/35 ring-4 ring-blue-500/15"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      4
                    </span>
                    <span className="text-xs sm:text-sm tracking-tight font-bold cursor-pointer">
                      4. Cleaner Profile
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* STEP 1: SELECT ROLE */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-1 mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cleanix Account Setup</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#11233F] tracking-tight">
                    Choose Your Role
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Select how you would like to use the Cleanix platform
                  </p>
                </div>

                {/* Role Choice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Customer Card */}
                  <div
                    onClick={() => handleSelectRole("CUSTOMER")}
                    className={`w-full text-left cursor-pointer rounded-3xl p-5 sm:p-6 border-2 transition-all duration-150 relative flex flex-col justify-between select-none ${
                      accountType === "CUSTOMER"
                        ? "bg-gradient-to-br from-[#007eff] via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/30 ring-4 ring-[#007eff]/20 scale-[1.01]"
                        : "bg-slate-50/70 hover:bg-white border-slate-200/90 hover:border-blue-300 text-[#11233F] shadow-xs hover:shadow-md"
                    }`}
                  >
                    {accountType === "CUSTOMER" && (
                      <div className="absolute top-4 right-4 w-6.5 h-6.5 rounded-full bg-white text-[#007eff] flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                    <div className="space-y-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          accountType === "CUSTOMER"
                            ? "bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}
                      >
                        <HomeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-extrabold ${
                            accountType === "CUSTOMER"
                              ? "text-white"
                              : "text-[#11233F]"
                          }`}
                        >
                          Customer
                        </h3>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            accountType === "CUSTOMER"
                              ? "text-blue-100 font-medium"
                              : "text-slate-600 font-normal"
                          }`}
                        >
                          আবাসিক বাড়ি ও অফিসের জন্য অটোমেটেড ক্লিনিং বুকিং, স্টাফ ট্র্যাকিং ও ইনভয়েস ম্যানেজমেন্টের জন্য।
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-5 pt-3 border-t text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        accountType === "CUSTOMER"
                          ? "border-white/20 text-cyan-200"
                          : "border-slate-200 text-blue-600"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                      <span>Client Portal Access</span>
                    </div>
                  </div>

                  {/* Cleaner Card */}
                  <div
                    onClick={() => handleSelectRole("CLEANER")}
                    className={`w-full text-left cursor-pointer rounded-3xl p-5 sm:p-6 border-2 transition-all duration-150 relative flex flex-col justify-between select-none ${
                      accountType === "CLEANER"
                        ? "bg-gradient-to-br from-[#007eff] via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/30 ring-4 ring-[#007eff]/20 scale-[1.01]"
                        : "bg-slate-50/70 hover:bg-white border-slate-200/90 hover:border-blue-300 text-[#11233F] shadow-xs hover:shadow-md"
                    }`}
                  >
                    {accountType === "CLEANER" && (
                      <div className="absolute top-4 right-4 w-6.5 h-6.5 rounded-full bg-white text-[#007eff] flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                    <div className="space-y-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          accountType === "CLEANER"
                            ? "bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}
                      >
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-extrabold ${
                            accountType === "CLEANER"
                              ? "text-white"
                              : "text-[#11233F]"
                          }`}
                        >
                          Cleaner
                        </h3>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            accountType === "CLEANER"
                              ? "text-blue-100 font-medium"
                              : "text-slate-600 font-normal"
                          }`}
                        >
                          সার্টিফাইড ক্লিনার ও সুপারভাইজারদের কাজের অ্যাসাইনমেন্ট এবং লাইভ জিপিএস ডিসপ্যাচের জন্য।
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-5 pt-3 border-t text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        accountType === "CLEANER"
                          ? "border-white/20 text-cyan-200"
                          : "border-slate-200 text-blue-600"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                      <span>Field Staff Portal</span>
                    </div>
                  </div>
                </div>

                {/* Continue CTA */}
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="w-full bg-gradient-to-r from-[#007eff] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-150 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer select-none"
                >
                  <span>Continue as {accountType === "CUSTOMER" ? "Customer" : "Cleaner"}</span>
                  <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>

                {/* Divider */}
                <div className="relative my-3 sm:my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                      OR
                    </span>
                  </div>
                </div>

                {/* Google Signup Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-white hover:bg-slate-50 active:scale-[0.99] text-[#11233F] font-bold py-2.5 sm:py-3 px-4 rounded-full border border-slate-300 hover:border-slate-400 transition-all duration-150 flex items-center justify-center gap-2.5 text-xs sm:text-sm shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span>Continue with Google as {accountType === "CUSTOMER" ? "Customer" : "Cleaner"}</span>
                </button>

                <div className="pt-1 text-center text-xs text-slate-600">
                  Already have a Cleanix account?{" "}
                  <Link
                    href="/login"
                    className="text-[#007eff] hover:text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}

            {/* STEP 2: ACCOUNT DETAILS FORM */}
            {step === 2 && (
              <div>
                {/* Back to Step 1 & Role Context Bar */}
                <div className="flex items-center justify-between mb-5 bg-slate-50 p-2.5 sm:p-3 rounded-full border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-600 hover:text-[#11233F] font-bold flex items-center gap-1.5 pl-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                    <span>Change Role</span>
                  </button>

                  <div className="flex items-center gap-2 pr-1.5">
                    <span className="text-slate-500 font-medium">Selected:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#007eff] text-white font-extrabold text-xs">
                      {accountType === "CUSTOMER" ? "Customer" : "Cleaner Staff"}
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-1 mb-5">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#11233F]">
                    Account Information
                  </h2>
                  <p className="text-xs text-slate-500">
                    Enter your credentials to create your Cleanix login
                  </p>
                </div>

                {/* Form */}
                <form noValidate onSubmit={handleRHFSubmitStep2(handleStep2Submit)} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-base font-bold text-[#11233F] mb-1.5 ml-1 cursor-pointer">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        {...registerField("fullName", {
                          required: "Full Name is required",
                        })}
                        className={`w-full bg-slate-50/80 border rounded-full pl-11 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#11233F] placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-medium ${
                          formErrors.fullName
                            ? "border-red-500 focus:border-red-600 ring-2 ring-red-500/20"
                            : "border-slate-200 focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15"
                        }`}
                      />
                    </div>
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs font-semibold mt-1.5 ml-3 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{formErrors.fullName.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Grid 2 Cols: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Email Address with OTP Verification */}
                    {/* Email Address with Dedicated OTP Verification Modal */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5 ml-1">
                        <label className="block text-base font-bold text-[#11233F] cursor-pointer">
                          Email Address
                        </label>
                        {isEmailVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Verified ✓</span>
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          disabled={isEmailVerified}
                          placeholder="Enter email address"
                          {...registerField("email", {
                            required: "Email address is required",
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message: "Please enter a valid email address",
                            },
                          })}
                          className={`w-full bg-slate-50/80 border rounded-full pl-11 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#11233F] placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-medium ${
                            isEmailVerified
                              ? "border-emerald-500 bg-emerald-50/30 text-emerald-900 font-semibold"
                              : formErrors.email
                              ? "border-red-500 focus:border-red-600 ring-2 ring-red-500/20"
                              : "border-slate-200 focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15"
                          }`}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5 ml-3 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formErrors.email.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-base font-bold text-[#11233F] mb-1.5 ml-1 cursor-pointer">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          {...registerField("phone", {
                            required: "Phone number is required",
                          })}
                          className={`w-full bg-slate-50/80 border rounded-full pl-11 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#11233F] placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-medium ${
                            formErrors.phone
                              ? "border-red-500 focus:border-red-600 ring-2 ring-red-500/20"
                              : "border-slate-200 focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15"
                          }`}
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5 ml-3 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formErrors.phone.message}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Grid 2 Cols: Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Password */}
                    <div>
                      <label className="block text-base font-bold text-[#11233F] mb-1.5 ml-1 cursor-pointer">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...registerField("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                          className={`w-full bg-slate-50/80 border rounded-full pl-11 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm text-[#11233F] placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-medium ${
                            formErrors.password
                              ? "border-red-500 focus:border-red-600 ring-2 ring-red-500/20"
                              : "border-slate-200 focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {formErrors.password && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5 ml-3 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formErrors.password.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-base font-bold text-[#11233F] mb-1.5 ml-1 cursor-pointer">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          {...registerField("confirmPassword", {
                            required: "Confirm password is required",
                            validate: (val: string) => {
                              if (watchPassword !== val) {
                                return "Passwords do not match";
                              }
                            },
                          })}
                          className={`w-full bg-slate-50/80 border rounded-full pl-11 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm text-[#11233F] placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-medium ${
                            formErrors.confirmPassword
                              ? "border-red-500 focus:border-red-600 ring-2 ring-red-500/20"
                              : "border-slate-200 focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5 ml-3 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formErrors.confirmPassword.message}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Agree Terms Checkbox for Customer */}
                  {accountType === "CUSTOMER" && (
                    <div className="pt-1 pl-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-[#007eff] focus:ring-offset-0 focus:ring-blue-500 accent-[#007eff] cursor-pointer"
                        />
                        <span>
                          I agree to the Cleanix{" "}
                          <Link href="/terms" className="text-blue-600 hover:underline font-bold cursor-pointer">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-blue-600 hover:underline font-bold cursor-pointer">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Step 2 CTA */}
                  <button
                    type="submit"
                    disabled={isLoading || isGoogleLoading || isSendingOtp}
                    className="w-full mt-2 bg-gradient-to-r from-[#007eff] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold py-3 sm:py-3.5 px-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-150 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSendingOtp ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Verification OTP...</span>
                      </>
                    ) : isLoading ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : accountType === "CLEANER" ? (
                      <>
                        <span>Next: Cleaner Verification</span>
                        <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                      </>
                    ) : (
                      <>
                        <span>Create Cleanix Account</span>
                        <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                      OR
                    </span>
                  </div>
                </div>

                {/* Google Signup Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-white hover:bg-slate-50 active:scale-[0.99] text-[#11233F] font-bold py-2.5 sm:py-3 px-4 rounded-full border border-slate-300 hover:border-slate-400 transition-all duration-150 flex items-center justify-center gap-2.5 text-xs sm:text-sm shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span>Continue with Google as {accountType === "CUSTOMER" ? "Customer" : "Cleaner"}</span>
                </button>
              </div>
            )}

            {/* STEP 3: EMAIL OTP VERIFICATION */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Back to Step 2 Header */}
                <div className="flex items-center justify-between mb-5 bg-slate-50 p-2.5 sm:p-3 rounded-full border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-slate-600 hover:text-[#11233F] font-bold flex items-center gap-1.5 pl-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                    <span>Back to Account Info</span>
                  </button>

                  <div className="flex items-center gap-2 pr-1.5">
                    <span className="text-slate-500 font-medium">Selected Role:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#007eff] text-white font-extrabold text-xs">
                      {accountType === "CUSTOMER" ? "Customer" : "Cleaner Staff"}
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-1.5 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-2 shadow-xs">
                    <ShieldCheck className="w-7 h-7 text-[#007eff]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#11233F] tracking-tight">
                    Verify Your Email Address
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    We have sent a 6-digit verification code to: <br />
                    <strong className="text-[#11233F] font-bold">
                      {pendingStep2Data?.email || watch("email")}
                    </strong>
                  </p>
                </div>

                {/* 6 Digit Input Grid */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={registerOtpRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpDigitKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-11 h-12 sm:w-13 sm:h-14 bg-slate-50 border border-slate-300 focus:border-[#007eff] focus:bg-white focus:ring-4 focus:ring-blue-500/15 rounded-xl text-center text-xl sm:text-2xl font-bold font-mono text-[#11233F] transition-all"
                    />
                  ))}
                </div>

                {/* Timer & Resend Option */}
                <div className="flex items-center justify-between text-xs px-2 max-w-sm mx-auto">
                  <span className="text-slate-500 font-medium">
                    Expires in: <strong className="text-blue-600 font-mono font-bold">{formatTimer(timerSeconds)}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSendEmailOtp(pendingStep2Data?.email || watch("email"))}
                    disabled={!canResendOtp || isSendingOtp}
                    className="font-bold text-[#007eff] hover:text-blue-700 hover:underline cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                  >
                    {isSendingOtp && <RefreshCw className="w-3 h-3 animate-spin" />}
                    <span>Resend Code</span>
                  </button>
                </div>

                {/* Submit CTA */}
                <div className="pt-2 space-y-3 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => handleVerifyEmailOtp(pendingStep2Data?.email || watch("email"))}
                    disabled={isVerifyingOtp || otpDigits.join("").length !== 6}
                    className="w-full bg-gradient-to-r from-[#007eff] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold py-3 sm:py-3.5 px-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-150 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : accountType === "CLEANER" ? (
                      <>
                        <span>Verify & Continue to Profile</span>
                        <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                      </>
                    ) : (
                      <>
                        <span>Verify & Complete Registration</span>
                        <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CLEANER VERIFICATION PROFILE (Cleaner Only) */}
            {step === 4 && accountType === "CLEANER" && (
              <div>
                {/* Back to Step 2 */}
                <div className="flex items-center justify-between mb-5 bg-slate-50 p-2.5 sm:p-3 rounded-full border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-slate-600 hover:text-[#11233F] font-bold flex items-center gap-1.5 pl-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                    <span>Back to Email Verification</span>
                  </button>

                  <div className="flex items-center gap-2 pr-1.5">
                    <span className="text-slate-500 font-medium">Role:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#007eff] text-white font-extrabold text-xs">
                      Cleaner Staff
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-1 mb-5">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#11233F]">
                    Cleaner Staff Profile
                  </h2>
                  <p className="text-xs text-slate-500">
                    Provide your date of birth, gender, and profile photo for ID verification
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleFinalRegistration(); }} className="space-y-4">
                  {/* Avatar Upload Section */}
                  <div className="flex items-center gap-4 bg-blue-50/60 border border-blue-200/80 p-4 rounded-3xl">
                    <div className="relative flex-shrink-0">
                      <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-[#007eff] bg-white flex items-center justify-center shadow-md">
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt="Cleaner Avatar"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-9 h-9 text-slate-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#007eff] text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <label className="block text-base font-bold text-[#11233F] cursor-pointer">
                        Profile Photo / Avatar <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-slate-500 leading-normal">
                        Upload a clear front-facing picture for cleaner dispatch verification.
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.heic,.heif,.avif"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-[#007eff] hover:underline inline-block pt-0.5 cursor-pointer"
                      >
                        {avatarPreview ? "Change Photo" : "Upload Photo"}
                      </button>
                    </div>
                  </div>

                  {/* Grid 2 Cols: DOB & Gender with Custom Cleanix Components */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* CUSTOM DATE OF BIRTH PICKER */}
                    <div className="relative" ref={dobRef}>
                      <label className="block text-base font-bold text-[#11233F] mb-1.5 ml-1 cursor-pointer">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>

                      {/* Trigger Box */}
                      <button
                        type="button"
                        onClick={() => setIsDobOpen(!isDobOpen)}
                        className="w-full bg-slate-50/80 hover:bg-white border border-slate-200 rounded-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left flex items-center justify-between focus:outline-none focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <CalendarIcon className="w-4 h-4 text-slate-400 group-hover:text-[#007eff] transition-colors" />
                          <span className={dob ? "text-[#11233F] font-medium" : "text-slate-400"}>
                            {dob
                              ? `${dob.split("-")[2]} ${MONTH_NAMES[parseInt(dob.split("-")[1], 10) - 1]} ${dob.split("-")[0]}`
                              : "Select Date of Birth"}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isDobOpen ? "rotate-180 text-[#007eff]" : ""
                          }`}
                        />
                      </button>

                      {/* Custom Floating Cleanix Calendar Popover */}
                      {isDobOpen && (
                        <div className="absolute bottom-full left-0 mb-2 z-50 w-72 bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-slate-900/5">
                          {/* Calendar Header Navigation */}
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentViewDate(
                                  new Date(
                                    currentViewDate.getFullYear(),
                                    currentViewDate.getMonth() - 1,
                                    1
                                  )
                                )
                              }
                              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Month & Year Selectors */}
                            <div className="flex items-center gap-1">
                              {/* Month Selector */}
                              <select
                                value={currentViewDate.getMonth()}
                                onChange={(e) =>
                                  setCurrentViewDate(
                                    new Date(
                                      currentViewDate.getFullYear(),
                                      parseInt(e.target.value, 10),
                                      1
                                    )
                                  )
                                }
                                className="text-xs font-bold text-[#11233F] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md border-none focus:outline-none cursor-pointer"
                              >
                                {MONTH_NAMES.map((m, idx) => (
                                  <option key={m} value={idx}>
                                    {m}
                                  </option>
                                ))}
                              </select>

                              {/* Year Selector */}
                              <select
                                value={currentViewDate.getFullYear()}
                                onChange={(e) =>
                                  setCurrentViewDate(
                                    new Date(
                                      parseInt(e.target.value, 10),
                                      currentViewDate.getMonth(),
                                      1
                                    )
                                  )
                                }
                                className="text-xs font-bold text-[#11233F] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md border-none focus:outline-none cursor-pointer"
                              >
                                {Array.from({ length: 65 }, (_, i) => 1950 + i).map((y) => (
                                  <option key={y} value={y}>
                                    {y}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setCurrentViewDate(
                                  new Date(
                                    currentViewDate.getFullYear(),
                                    currentViewDate.getMonth() + 1,
                                    1
                                  )
                                )
                              }
                              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Day Headers */}
                          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 mb-2">
                            <span>Su</span>
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                          </div>

                          {/* Day Cells Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {/* Empty offset cells */}
                            {Array.from({
                              length: getFirstDayOfMonth(
                                currentViewDate.getFullYear(),
                                currentViewDate.getMonth()
                              ),
                            }).map((_, i) => (
                              <div key={`empty-${i}`} />
                            ))}

                            {/* Actual Days */}
                            {Array.from({
                              length: getDaysInMonth(
                                currentViewDate.getFullYear(),
                                currentViewDate.getMonth()
                              ),
                            }).map((_, i) => {
                              const dayNum = i + 1;
                              const currentYear = currentViewDate.getFullYear();
                              const currentMonth = String(
                                currentViewDate.getMonth() + 1
                              ).padStart(2, "0");
                              const formattedDayNum = String(dayNum).padStart(2, "0");
                              const dateStr = `${currentYear}-${currentMonth}-${formattedDayNum}`;
                              const isSelected = dob === dateStr;

                              return (
                                <button
                                  key={dayNum}
                                  type="button"
                                  onClick={() => handleSelectDate(dayNum)}
                                  className={`w-7 h-7 mx-auto rounded-lg font-bold flex items-center justify-center transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#007eff] text-white shadow-md shadow-blue-500/30"
                                      : "hover:bg-blue-50 hover:text-[#007eff] text-[#11233F]"
                                  }`}
                                >
                                  {dayNum}
                                </button>
                              );
                            })}
                          </div>

                          {/* Action Footer */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                setDob("");
                                setIsDobOpen(false);
                              }}
                              className="text-slate-400 hover:text-[#11233F] cursor-pointer"
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const today = new Date(1995, 5, 15);
                                setCurrentViewDate(today);
                              }}
                              className="text-[#007eff] hover:underline cursor-pointer"
                            >
                              Quick 1995
                            </button>
                          </div>
                        </div>
                      )}
                      {step3Errors.dob && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5 ml-3 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{step3Errors.dob}</span>
                        </p>
                      )}
                    </div>

                    {/* CUSTOM GENDER DROPDOWN */}
                    <div className="relative" ref={genderRef}>
                      <label className="block text-base font-bold text-[#11233F] mb-1.5 ml-1 cursor-pointer">
                        Gender <span className="text-red-500">*</span>
                      </label>

                      {/* Trigger Box */}
                      <button
                        type="button"
                        onClick={() => setIsGenderOpen(!isGenderOpen)}
                        className={`w-full bg-slate-50/80 hover:bg-white border rounded-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left flex items-center justify-between focus:outline-none transition-all group cursor-pointer ${
                          step3Errors.gender
                            ? "border-red-500 ring-2 ring-red-500/20"
                            : "border-slate-200 focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-[#007eff] transition-colors" />
                          <span className="text-[#11233F] font-medium">{gender}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isGenderOpen ? "rotate-180 text-[#007eff]" : ""
                          }`}
                        />
                      </button>

                      {/* Floating Custom Cleanix Options Card */}
                      {isGenderOpen && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-slate-900/5">
                          {(["Male", "Female", "Other"] as Gender[]).map((g) => {
                            const isSelected = gender === g;
                            return (
                              <button
                                key={g}
                                type="button"
                                onClick={() => {
                                  setGender(g);
                                  setIsGenderOpen(false);
                                  if (step3Errors.gender) setStep3Errors((prev) => ({ ...prev, gender: "" }));
                                }}
                                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-blue-50 text-[#007eff]"
                                    : "text-[#11233F] hover:bg-slate-50"
                                }`}
                              >
                                <span>{g}</span>
                                {isSelected && (
                                  <Check className="w-4 h-4 stroke-[2.5] text-[#007eff]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {step3Errors.gender && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5 ml-3 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{step3Errors.gender}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pt-1 pl-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          if (step3Errors.agreeTerms) setStep3Errors((prev) => ({ ...prev, agreeTerms: "" }));
                        }}
                        className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-[#007eff] focus:ring-offset-0 focus:ring-blue-500 accent-[#007eff] cursor-pointer"
                      />
                      <span>
                        I agree to the Cleanix{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline font-bold cursor-pointer">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline font-bold cursor-pointer">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {step3Errors.agreeTerms && (
                      <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{step3Errors.agreeTerms}</span>
                      </p>
                    )}
                  </div>

                  {/* Final Submit CTA */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-gradient-to-r from-[#007eff] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold py-3 sm:py-3.5 px-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-150 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Cleaner Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Cleaner Application</span>
                        <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
