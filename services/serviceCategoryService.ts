import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && token.trim() !== "" ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchActiveServicesAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/services/active`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching active services:", error);
    return { success: false, data: [] };
  }
};

export const fetchAdminServicesAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/services/admin`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching admin services:", error);
    return { success: false, data: [] };
  }
};

export const createServiceAPI = async (payload: any) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/services`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error creating service category:", error);
    return { success: false, message: error.message || "Failed to create service category" };
  }
};

export const updateServiceAPI = async (serviceId: string, payload: any) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/services/${serviceId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating service category:", error);
    return { success: false, message: error.message || "Failed to update service category" };
  }
};

export const deleteServiceAPI = async (serviceId: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/services/${serviceId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error deleting service category:", error);
    return { success: false, message: error.message || "Failed to delete service category" };
  }
};

export const fetchServiceCatalogOverviewAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/services/overview`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching service catalog overview:", error);
    return { success: false, data: null };
  }
};

export const fetchSingleServiceBySlugAPI = async (slugOrId: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/services/slug/${slugOrId}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching single service category:", error);
    return { success: false, data: null };
  }
};
