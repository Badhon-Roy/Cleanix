import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const fetchCustomerProfileAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/customers/me`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching customer profile:", error);
    return { success: false, message: error.message || "Failed to fetch profile" };
  }
};

export const updateCustomerProfileAPI = async (payload: {
  name?: string;
  phone?: string;
  avatar?: string;
}) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/customers/me`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating customer profile:", error);
    return { success: false, message: error.message || "Failed to update profile" };
  }
};

export const deleteCustomerAccountAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/customers/me`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error deleting customer account:", error);
    return { success: false, message: error.message || "Failed to delete account" };
  }
};
