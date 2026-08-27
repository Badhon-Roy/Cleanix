import { cookies } from "next/headers";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchActiveServicesServer = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/services/active`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error in fetchActiveServicesServer:", error);
    return [];
  }
};

export const fetchAdminServicesServer = async () => {
  try {
    const baseUrl = getBaseUrl();
    const cookieStore = await cookies();
    const token =
      cookieStore.get("accessToken")?.value ||
      cookieStore.get("cleanix_token")?.value ||
      "";

    const res = await fetch(`${baseUrl}/services/admin`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error in fetchAdminServicesServer:", error);
    return [];
  }
};

export const fetchServiceCatalogOverviewServer = async () => {
  try {
    const baseUrl = getBaseUrl();
    const cookieStore = await cookies();
    const token =
      cookieStore.get("accessToken")?.value ||
      cookieStore.get("cleanix_token")?.value ||
      "";

    const res = await fetch(`${baseUrl}/services/overview`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    if (data?.success && data?.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error in fetchServiceCatalogOverviewServer:", error);
    return null;
  }
};

export const fetchSingleServiceBySlugServer = async (slug: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/services/slug/${slug}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && data?.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error in fetchSingleServiceBySlugServer:", error);
    return null;
  }
};
