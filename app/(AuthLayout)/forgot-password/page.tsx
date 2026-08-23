"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { SwirlLogo } from "@/components/Navbar";
import { forgotPasswordAPI, verifyOtpAPI, resetPasswordAPI } from "@/services/authService";

type Step = "EMAIL" | "OTP" | "RESET" | "SUCCESS";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const emailParam = searchParams.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  // OTP input refs
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // ----------------------------------------------------
  // STEP 1: Send OTP to Email
  // ----------------------------------------------------
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email address");
      return;
    }

    setIsLoading(true);

    try {
      const res = await forgotPasswordAPI(email);
      setIsLoading(false);

      if (res?.success) {
        setCurrentStep("OTP");
        toast.success(res?.message || "Verification code dispatched!");
      } else {
        toast.error(res?.message || "Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to send OTP. Please try again.");
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // STEP 2: Verify OTP Code
  // ----------------------------------------------------
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling
      const pasted = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpRefs[nextIndex].current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance cursor
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
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
      setOtp(newOtp);
      const focusIndex = Math.min(pastedArr.length, 5);
      otpRefs[focusIndex].current?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      toast.error("Please enter the full 6-digit OTP verification code");
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyOtpAPI(email, fullOtp);
      setIsLoading(false);

      if (res?.success) {
        setCurrentStep("RESET");
        toast.success(res?.message || "OTP Verified Successfully!");
      } else {
        toast.error(res?.message || "Invalid verification code. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Invalid verification code. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    const res = await forgotPasswordAPI(email);
    if (res?.success) {
      toast.success(res?.message || "OTP resent successfully!");
    } else {
      toast.error(res?.message || "Failed to resend OTP");
    }
  };

  // ----------------------------------------------------
  // STEP 3: Reset / Change Password
  // ----------------------------------------------------
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPasswordAPI({ email, otp: fullOtp, newPassword });
      setIsLoading(false);

      if (res?.success) {
        setCurrentStep("SUCCESS");
        toast.success(res?.message || "Password Updated Successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(res?.message || "Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to reset password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between py-2 mb-4 lg:mb-6">
        <Link href="/" className="flex items-center gap-3 group">
          <SwirlLogo />
          <div className="flex flex-col">
            <span className="text-slate-900 text-2xl font-bold tracking-tight group-hover:text-[#007eff] transition-colors">
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
            className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Back to Sign In</span>
          </Link>
          <Link
            href="/pricing"
            className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm px-4 py-2 rounded-full text-xs font-semibold transition-all hidden sm:flex items-center gap-1.5"
          >
            <span>View Pricing</span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
          </Link>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center my-auto py-6">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-300/30 relative overflow-hidden">
            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-transparent via-[#007eff] to-transparent" />

            {/* Stepper Progress Bar */}
            {currentStep !== "SUCCESS" && (
              <div className="mb-6 flex items-center justify-between text-xs font-semibold px-2">
                <div
                  className={`flex items-center gap-1.5 ${
                    currentStep === "EMAIL"
                      ? "text-[#007eff]"
                      : "text-emerald-600"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentStep === "EMAIL"
                        ? "bg-[#007eff] text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    1
                  </span>
                  <span>Email</span>
                </div>

                <div className="flex-1 h-[2px] mx-2 bg-slate-200" />

                <div
                  className={`flex items-center gap-1.5 ${
                    currentStep === "OTP"
                      ? "text-[#007eff]"
                      : currentStep === "RESET"
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentStep === "OTP"
                        ? "bg-[#007eff] text-white"
                        : currentStep === "RESET"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    2
                  </span>
                  <span>Verify OTP</span>
                </div>

                <div className="flex-1 h-[2px] mx-2 bg-slate-200" />

                <div
                  className={`flex items-center gap-1.5 ${
                    currentStep === "RESET"
                      ? "text-[#007eff]"
                      : "text-slate-400"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentStep === "RESET"
                        ? "bg-[#007eff] text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    3
                  </span>
                  <span>New Password</span>
                </div>
              </div>
            )}

            {/* STEP 1: EMAIL ADDRESS INPUT */}
            {currentStep === "EMAIL" && (
              <>
                <div className="flex flex-col items-center text-center space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#007eff] shadow-xs mb-1">
                    <KeyRound className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Forgot Password?
                  </h1>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Enter your registered email address and we will send a 6-digit OTP code to verify your request.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#007eff] hover:bg-[#0066ee] active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending OTP Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: VERIFY 6-DIGIT OTP */}
            {currentStep === "OTP" && (
              <>
                <div className="flex flex-col items-center text-center space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#007eff] shadow-xs mb-1">
                    <Mail className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Enter OTP Code
                  </h1>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    We sent a 6-digit verification code to: <br />
                    <strong className="text-slate-900 font-semibold">{email}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* 6-Digit OTP Box Grid */}
                  <div className="flex items-center justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg font-extrabold text-[#11233F] bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15 focus:outline-none transition-all"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#007eff] hover:bg-[#0066ee] active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify OTP & Continue</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 text-center flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("EMAIL")}
                    className="text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: RESET / CHANGE PASSWORD */}
            {currentStep === "RESET" && (
              <>
                <div className="flex flex-col items-center text-center space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#007eff] shadow-xs mb-1">
                    <Lock className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Set New Password
                  </h1>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Create a strong new password for <strong className="text-slate-800">{email}</strong>.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-[#007eff] hover:bg-[#0066ee] active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* STEP 4: SUCCESS STATE & AUTOMATIC REDIRECT */}
            {currentStep === "SUCCESS" && (
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm mb-1">
                  <CheckCircle2 className="w-9 h-9 stroke-[2]" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Password Changed!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xs leading-relaxed">
                  Your Cleanix password has been updated successfully.
                </p>

                <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800 flex items-center justify-center gap-2 my-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting to Sign In page...</span>
                </div>

                <Link
                  href="/login"
                  className="w-full bg-[#007eff] hover:bg-[#0066ee] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm transition-all"
                >
                  <span>Go to Login Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer support note */}
      <footer className="text-center py-4 text-xs text-slate-500 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          256-bit Encrypted Security
        </span>
        <span>•</span>
        <Link
          href="/contact"
          className="hover:text-slate-900 transition-colors text-[11px] flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Contact Support</span>
        </Link>
      </footer>
    </div>
  );
}
