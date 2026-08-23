import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export interface IAddonItem {
  _id?: string;
  slug: string;
  name: string;
  subLabel: string;
  price: number;
  tag?: string;
  iconName?: string;
  active: boolean;
}

export const fetchActiveAddonsAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/addons`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching active addons:", error);
    return { success: false, message: error.message || "Failed to fetch add-on services" };
  }
};

export const fetchAdminAddonsAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/addons/admin`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching admin addons catalog:", error);
    return { success: false, message: error.message || "Failed to fetch admin add-ons catalog" };
  }
};

export const createAddonAPI = async (payload: Partial<IAddonItem>) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/addons`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error creating addon:", error);
    return { success: false, message: error.message || "Failed to create add-on service" };
  }
};

export const updateAddonAPI = async (addonId: string, payload: Partial<IAddonItem>) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/addons/${addonId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating addon:", error);
    return { success: false, message: error.message || "Failed to update add-on service" };
  }
};

export const deleteAddonAPI = async (addonId: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/addons/${addonId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error deleting addon:", error);
    return { success: false, message: error.message || "Failed to delete add-on service" };
  }
};
