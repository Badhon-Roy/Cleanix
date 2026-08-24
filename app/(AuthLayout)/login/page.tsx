"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { SwirlLogo } from "@/components/Navbar";
import { loginUserAPI, getGoogleAuthUrl } from "@/services/authService";
import { setAuthUser, setAuthRole, setAuthToken } from "@/utils/cookie";

export interface ILoginForm {
  email: string;
  password: string;
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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

export default function LoginPage() {
  const router = useRouter();

  // React Hook Form
  const {
    register: registerLogin,
    handleSubmit: handleRHFSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<ILoginForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Submit Email/Password Handler
  const onLoginSubmit = async (data: ILoginForm) => {
    setIsLoading(true);

    try {
      const res = await loginUserAPI({ email: data.email, password: data.password });

      if (!res?.success) {
        toast.error(res?.message || "Sign-in failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      const token = res.data?.accessToken || res.accessToken;
      if (token) {
        setAuthToken(token);
      }

      const role = res.data?.user?.role || "CUSTOMER";
      const status = res.data?.user?.status || "APPROVED";
      const isApproved = res.data?.user?.isApproved !== undefined ? res.data?.user?.isApproved : true;

      // Store user auth in cookies
      const userData = {
        id: res.data?.user?._id || res.data?.user?.id || "",
        email: res.data?.user?.email || data.email,
        name: res.data?.user?.name || data.email.split("@")[0],
        phone: res.data?.user?.phone || "",
        role,
        status,
        isApproved,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      };

      setAuthUser(userData);
      setAuthRole(role);

      if (res?.message) {
        toast.success(res.message);
      }

      if (role === "ADMIN") {
        setTimeout(() => {
          router.push("/admin");
        }, 800);
      } else if (role === "TEAM_LEADER") {
        setTimeout(() => {
          router.push("/team-leader");
        }, 800);
      } else if (role === "CLEANER" && (!isApproved || status === "PENDING_APPROVAL")) {
        setTimeout(() => {
          router.push("/waiting-approval");
        }, 800);
      } else if (role === "CLEANER") {
        setTimeout(() => {
          router.push("/cleaner");
        }, 800);
      } else {
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (error: any) {
      toast.error(error?.message || "Sign-in failed. Please check your credentials.");
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
      window.location.href = `${googleUrl}?role=CUSTOMER`;
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

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-slate-600 hover:text-[#11233F] text-sm font-medium transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Back to Home</span>
          </Link>
          <Link
            href="/pricing"
            className="bg-white hover:bg-slate-100 text-[#11233F] border border-slate-200 shadow-xs px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Pricing</span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
          </Link>
        </div>
      </header>

      {/* Main Grid Container */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-auto">
        {/* LEFT COLUMN: Visual Brand Showcase */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left pr-0 lg:pr-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold w-fit shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Next-Gen SaaS Cleaning & Dispatch Ecosystem</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11233F] tracking-tight leading-[1.15]">
              Sparkling Clean Spaces, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007eff] via-blue-600 to-cyan-600">
                Automated & Effortless.
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Log in to manage eco-friendly deep cleaning bookings, field staff dispatch, instant estimates, and high-standard space maintenance.
            </p>
          </div>

          {/* Hero Visual Card with Image & Floating Widgets */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 group">
            {/* Background Accent glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/60 via-transparent to-transparent z-0 pointer-events-none" />

            <div className="relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
              {/* Image Container */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-md flex-shrink-0 bg-slate-100">
                <Image
                  src="/hero-cleaner.png"
                  alt="Certified Cleanix Professional"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text & Stats */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-[#11233F] ml-1.5">
                    4.9 / 5 Rating
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#11233F]">
                  Verified Cleaners & Supervisors
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time GPS tracking, background checks, and automated task execution for all residential and commercial jobs.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>NID Verified</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    <span>Background Checked</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-100/90 border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Dhaka City Metropolitan Coverage</span>
              </span>
              <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>15,000+ Completed Jobs</span>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Clean Light Mode Login Form */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-300/30 relative overflow-hidden">
            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-transparent via-[#007eff] to-transparent" />

            {/* Form Title */}
            <div className="text-center space-y-1.5 mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11233F]">
                Sign In to Cleanix
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your details to access your account dashboard
              </p>
            </div>

            {/* Login Form */}
            <form noValidate onSubmit={handleRHFSubmitLogin(onLoginSubmit)} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-base font-bold text-[#11233F] mb-1.5 cursor-pointer">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    {...registerLogin("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={`w-full bg-slate-50/80 border rounded-full pl-11 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#11233F] placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-medium ${
                      loginErrors.email
                        ? "border-red-500 focus:border-red-600 ring-2 ring-red-500/20"
                        : "border-slate-200 focus:border-[#007eff] focus:ring-4 focus:ring-[#007eff]/15"
                    }`}
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 ml-3 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{loginErrors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-base font-bold text-[#11233F] cursor-pointer">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...registerLogin("password", {
                      required: "Password is required",
                    })}
                    className={`w-full bg-slate-50/80 border rounded-full pl-11 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm text-[#11233F] placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-medium ${
                      loginErrors.password
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
                {loginErrors.password && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 ml-3 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{loginErrors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-[#007eff] focus:ring-offset-0 focus:ring-blue-500 accent-[#007eff] cursor-pointer"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-gradient-to-r from-[#007eff] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                  OR
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-white hover:bg-slate-50 active:scale-[0.99] text-[#11233F] font-bold py-3 px-4 rounded-full border border-slate-300 hover:border-slate-400 transition-all duration-200 flex items-center justify-center gap-3 text-sm shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span>Continue with Google</span>
            </button>

            {/* Register Footer Link */}
            <div className="mt-8 text-center text-xs text-slate-600">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="text-[#007eff] hover:text-blue-700 font-bold hover:underline cursor-pointer"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}