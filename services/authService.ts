"use server";

import { cookies } from "next/headers";
import { IGoogleLoginPayload, ILoginPayload, IRegisterPayload } from "@/types";
import { setAuthToken, removeAuthToken, getAuthToken, setAuthUser, getAuthUser, setAuthRole, removeAuthUser, removeAuthRole } from "@/utils/cookie";

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NEXT_PUBLIC_SERVER_URL
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`
      : "http://localhost:5000/api/v1")
  );
};

const getHeaders = async () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let token: string | undefined = undefined;

  try {
    const cookieStore = await cookies();
    token =
      cookieStore.get("cleanix_token")?.value ||
      cookieStore.get("accessToken")?.value;
  } catch {
    token = getAuthToken();
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const getGoogleAuthUrl = async () => {
  return `${getBaseUrl()}/auth/google`;
};

export const googleLoginAPI = async (payload: IGoogleLoginPayload) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include", // 👈 Enables automatic HttpOnly cookie storage
    });
    const data = await res.json();

    if (data?.success && (data?.data?.accessToken || data?.accessToken)) {
      const token = data?.data?.accessToken || data?.accessToken;
      setAuthToken(token);
    }

    return data;
  } catch (error: any) {
    console.error("Error in googleLoginAPI:", error);
    return { success: false, message: error.message };
  }
};

export const registerUserAPI = async (payload: IRegisterPayload | FormData) => {
  try {
    const baseUrl = getBaseUrl();
    let body: any;
    let headers: Record<string, string> = {};

    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (typeof FormData !== "undefined" && payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      const obj = (payload || {}) as Record<string, any>;
      Object.keys(obj).forEach((key) => {
        if (obj[key] !== undefined && obj[key] !== null) {
          body.append(key, String(obj[key]));
        }
      });
    }

    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers,
      body,
      credentials: "include", // 👈 Enables automatic HttpOnly cookie storage from Backend
    });
    const data = await res.json();
    if (data?.success && (data?.data?.accessToken || data?.accessToken)) {
      const token = data?.data?.accessToken || data?.accessToken;
      setAuthToken(token);
    }
    return data;
  } catch (error: any) {
    console.error("Error in registerUserAPI:", error);
    return { success: false, message: error.message || "Registration failed" };
  }
};

export const loginUserAPI = async (payload: ILoginPayload) => {
  try {
    const baseUrl = getBaseUrl();
    const headers = await getHeaders();
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      credentials: "include", // 👈 Enables automatic HttpOnly cookie storage from Backend
    });
    const data = await res.json();
    if (data?.success && (data?.data?.accessToken || data?.accessToken)) {
      const token = data?.data?.accessToken || data?.accessToken;
      setAuthToken(token);
    }
    return data;
  } catch (error: any) {
    console.error("Error in loginUserAPI:", error);
    return { success: false, message: error.message || "Login failed" };
  }
};

export const fetchUserProfileAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const headers = await getHeaders();
    const res = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers,
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error in fetchUserProfileAPI:", error);
    return { success: false, data: null };
  }
};

export const getCurrentUser = async () => {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("cleanix_token")?.value ||
      cookieStore.get("accessToken")?.value;

    if (!token) {
      return null;
    }

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && data?.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error in server-side getCurrentUser:", error);
    return null;
  }
};

export const logoutUser = async (redirectUrl: string = "/login") => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("cleanix_token");
    cookieStore.delete("accessToken");
    cookieStore.delete("cleanix_user");
    cookieStore.delete("cleanix_role");
  } catch {
    // Ignore error if invoked client-side
  }

  removeAuthToken();
  removeAuthUser();
  removeAuthRole();

  if (typeof window !== "undefined") {
    window.location.href = redirectUrl;
  }
};

export const changePasswordAPI = async (payload: Record<string, any>) => {
  try {
    const baseUrl = getBaseUrl();
    const headers = await getHeaders();
    const res = await fetch(`${baseUrl}/auth/change-password`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error in changePasswordAPI:", error);
    return { success: false, message: error.message || "Password update failed" };
  }
};

export const forgotPasswordAPI = async (email: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error in forgotPasswordAPI:", error);
    return { success: false, message: error.message || "Failed to send OTP" };
  }
};

export const verifyOtpAPI = async (email: string, otp: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error in verifyOtpAPI:", error);
    return { success: false, message: error.message || "OTP verification failed" };
  }
};

export const resetPasswordAPI = async (payload: { email: string; otp: string; newPassword: string }) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error in resetPasswordAPI:", error);
    return { success: false, message: error.message || "Password reset failed" };
  }
};

export const sendRegisterOtpAPI = async (email: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/send-register-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error in sendRegisterOtpAPI:", error);
    return { success: false, message: error.message || "Failed to send registration OTP" };
  }
};

export const verifyRegisterOtpAPI = async (email: string, otp: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/verify-register-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error in verifyRegisterOtpAPI:", error);
    return { success: false, message: error.message || "Registration OTP verification failed" };
  }
};
