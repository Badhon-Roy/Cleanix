"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { setAuthToken, setAuthUser, setAuthRole } from "@/utils/cookie";
import { SwirlLogo } from "@/components/Navbar";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) return;

    const token = searchParams.get("token");
    const role = searchParams.get("role") || "CUSTOMER";
    const status = searchParams.get("status") || "APPROVED";
    const isApprovedStr = searchParams.get("isApproved");
    const error = searchParams.get("error");

    if (error) {
      hasProcessedRef.current = true;
      toast.dismiss();
      toast.error("Google Sign-In failed. Please try again.");
      router.push("/login");
      return;
    }

    if (token) {
      hasProcessedRef.current = true;

      // 1. Save JWT Access Token to Cookie
      setAuthToken(token);

      const isApproved = isApprovedStr === "true" || isApprovedStr === null;

      const name = searchParams.get("name") || "Google Verified User";
      const avatar = searchParams.get("avatar") || undefined;
      const email = searchParams.get("email") || "";

      // 2. Store User Data in Cookies
      const googleUser = {
        name,
        email,
        avatar,
        role,
        status,
        isApproved,
        isLoggedIn: true,
        provider: "google",
        loginTime: new Date().toISOString(),
      };

      setAuthUser(googleUser);
      setAuthRole(role);

      const msg = searchParams.get("message");
      if (msg) {
        toast.dismiss();
        toast.success(msg);
      }

      // 3. Role-Based Navigation
      const redirectUrl = searchParams.get("redirect");

      let targetPath = "/dashboard";
      if (role === "ADMIN") {
        targetPath = redirectUrl && redirectUrl.startsWith("/admin") ? redirectUrl : "/admin";
      } else if (role === "CLEANER" && (!isApproved || status === "PENDING_APPROVAL")) {
        targetPath = "/waiting-approval";
      } else if (role === "CLEANER") {
        targetPath = redirectUrl && redirectUrl.startsWith("/cleaner") ? redirectUrl : "/cleaner";
      } else if (role === "TEAM_LEADER") {
        targetPath = redirectUrl && redirectUrl.startsWith("/team") ? redirectUrl : "/team";
      } else {
        targetPath = redirectUrl && redirectUrl.startsWith("/dashboard") ? redirectUrl : "/dashboard";
      }

      setTimeout(() => router.push(targetPath), 800);
    } else {
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <SwirlLogo />
        <div className="absolute -inset-2 rounded-full bg-blue-500/20 blur-md -z-10 animate-pulse" />
      </div>
      <div className="w-8 h-8 border-3 border-[#007eff] border-t-transparent rounded-full animate-spin mt-4" />
      <div className="text-center">
        <h3 className="text-lg font-bold text-[#11233F]">Authenticating with Google...</h3>
        <p className="text-xs text-slate-500 mt-1">Verifying credentials and preparing your Cleanix portal</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#007eff] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading Google Auth Callback...</p>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}
