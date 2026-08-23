import { cookies } from "next/headers";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchActiveAddonsServer = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/addons`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error in fetchActiveAddonsServer:", error);
    return [];
  }
};

export const fetchAdminAddonsServer = async () => {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("cleanix_token")?.value ||
      cookieStore.get("accessToken")?.value;

    if (!token) return [];

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/addons/admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error in fetchAdminAddonsServer:", error);
    return [];
  }
};
