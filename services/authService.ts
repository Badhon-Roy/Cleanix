"use server";

import { IGoogleLoginPayload, ILoginPayload, IRegisterPayload } from "@/types";
import { setAuthToken, removeAuthToken, getAuthToken } from "@/utils/cookie";

export { setAuthToken, removeAuthToken, getAuthToken };

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NEXT_PUBLIC_SERVER_URL
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`
      : "http://localhost:5000/api/v1")
  );
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const getGoogleAuthUrl = () => {
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

    if (typeof window !== "undefined" && payload instanceof FormData) {
      body = payload;
      // Do not set Content-Type header so browser automatically sets boundary
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(payload);
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
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
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
    const res = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: getHeaders(),
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

export const changePasswordAPI = async (payload: Record<string, any>) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/change-password`, {
      method: "POST",
      headers: getHeaders(),
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
