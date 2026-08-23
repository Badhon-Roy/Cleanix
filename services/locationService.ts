import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export interface ILocationData {
  _id?: string;
  id?: string | number;
  tag: string;
  type: "home" | "office" | "other";
  street: string;
  area: string;
  city: string;
  zip?: string;
  isDefault: boolean;
}

export const fetchMyLocationsAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/locations/me`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return {
        ...data,
        data: data.data.map((loc: any) => ({
          ...loc,
          id: loc._id || loc.id,
        })),
      };
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching locations:", error);
    return { success: false, message: error.message || "Failed to fetch locations" };
  }
};

export const createLocationAPI = async (payload: Partial<ILocationData>) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/locations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error creating location:", error);
    return { success: false, message: error.message || "Failed to create location" };
  }
};

export const updateLocationAPI = async (locationId: string, payload: Partial<ILocationData>) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/locations/${locationId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating location:", error);
    return { success: false, message: error.message || "Failed to update location" };
  }
};

export const setDefaultLocationAPI = async (locationId: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/locations/${locationId}/default`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error setting default location:", error);
    return { success: false, message: error.message || "Failed to set default location" };
  }
};

export const deleteLocationAPI = async (locationId: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/locations/${locationId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error deleting location:", error);
    return { success: false, message: error.message || "Failed to delete location" };
  }
};
