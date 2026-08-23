"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { SwirlLogo } from "@/components/Navbar";
import { verifyRegisterOtpAPI, sendRegisterOtpAPI, verifyOtpAPI, forgotPasswordAPI } from "@/services/authService";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email") || "";
  const typeParam = searchParams.get("type") || "register"; // "register" | "forgot"

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // 5-minute Countdown Timer (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);

  // OTP 6 Input Refs for auto-focus navigation
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // OTP Code Single Digit Input Handler & Paste Handler
  const handleOtpChange = (index: number, value: string) => {
    // Handle Paste of 6 digits
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(pasted.length, 5);
      otpRefs[nextIdx].current?.focus();
      return;
    }

    const digit = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next box
    if (digit && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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

  // Verify OTP Handler
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP code");
      return;
    }

    if (!email) {
      toast.error("Missing email address for verification");
      return;
    }

    setIsVerifying(true);

    try {
      let res: any;
      if (typeParam === "forgot") {
        res = await verifyOtpAPI(email, fullOtp);
      } else {
        res = await verifyRegisterOtpAPI(email, fullOtp);
      }

      setIsVerifying(false);

      if (res?.success) {
        toast.success(res?.message || "OTP Verified Successfully!");
        if (typeParam === "forgot") {
          setTimeout(() => {
            router.push(`/forgot-password?step=reset&email=${encodeURIComponent(email)}&otp=${encodeURIComponent(fullOtp)}`);
          }, 800);
        } else {
          setTimeout(() => {
            router.push(`/register?emailVerified=true&email=${encodeURIComponent(email)}`);
          }, 800);
        }
      } else {
        toast.error(res?.message || "OTP verification failed");
      }
    } catch (error: any) {
      toast.error(error?.message || "Verification failed");
      setIsVerifying(false);
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Missing email address");
      return;
    }

    setIsResending(true);

    try {
      let res: any;
      if (typeParam === "forgot") {
        res = await forgotPasswordAPI(email);
      } else {
        res = await sendRegisterOtpAPI(email);
      }

      setIsResending(false);

      if (res?.success) {
        setTimeLeft(300);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        otpRefs[0].current?.focus();
        toast.success(res?.message || "Verification OTP Sent!");
      } else {
        toast.error(res?.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to resend OTP");
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between py-2 mb-4 lg:mb-6">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <SwirlLogo />
          <div className="flex flex-col">
            <span className="text-[#11233F] text-2xl font-bold tracking-tight group-hover:text-[#007eff] transition-colors">
              Cleanix
            </span>
            <span className="text-[10px] uppercase tracking-wider text-blue-600 font-semibold -mt-1">
              Field & Space Automation
            </span>
          </div>
        </Link>

        <Link
          href="/login"
          className="text-slate-600 hover:text-[#11233F] text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to Login</span>
        </Link>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center my-auto py-6">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-300/30 relative overflow-hidden text-center">
            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-transparent via-[#007eff] to-transparent" />

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <ShieldCheck className="w-8 h-8 text-[#007eff]" />
            </div>

            {/* Header Text */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11233F] tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
              We have sent a 6-digit verification code to: <br />
              <strong className="text-[#11233F] font-bold">{email || "your email address"}</strong>
            </p>

            {/* Form */}
            <form onSubmit={handleVerifySubmit} className="mt-6 space-y-6">
              {/* 6 Digit Input Grid */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="w-11 h-12 sm:w-12 sm:h-14 bg-slate-50 border border-slate-300 focus:border-[#007eff] focus:bg-white focus:ring-4 focus:ring-blue-500/15 rounded-xl text-center text-xl sm:text-2xl font-bold font-mono text-[#11233F] transition-all"
                  />
                ))}
              </div>

              {/* Countdown Timer & Resend Button */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-slate-500 font-medium">
                  Code expires in: <strong className="text-blue-600 font-mono font-bold">{formatTime(timeLeft)}</strong>
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || isResending}
                  className="font-bold text-[#007eff] hover:text-blue-700 hover:underline cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                >
                  {isResending && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>Resend OTP Code</span>
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isVerifying || otp.join("").length !== 6}
                className="w-full bg-gradient-to-r from-[#007eff] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code & Proceed</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
