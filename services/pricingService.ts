import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && token.trim() !== "" ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface IPricingConfigItem {
  baseFee: number;
  sqftRate: number;
  bedroomRate: number;
  bathroomRate: number;
}

export const fetchPricingConfigAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/pricing`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching pricing config:", error);
    return {
      success: false,
      data: { baseFee: 1500, sqftRate: 2.5, bedroomRate: 500, bathroomRate: 400 },
    };
  }
};

export const updatePricingConfigAPI = async (payload: Partial<IPricingConfigItem>) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/pricing`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating pricing config:", error);
    return { success: false, message: error.message || "Failed to update pricing multipliers" };
  }
};
