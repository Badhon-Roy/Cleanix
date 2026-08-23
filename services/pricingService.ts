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

export interface ICustomFieldBreakdownItem {
  fieldId: string;
  label: string;
  detailLabel?: string;
  value: any;
  cost: number;
}

export interface IBookingPriceBreakdown {
  categoryName: string;
  categoryFields?: any[];
  customFieldsBreakdown?: ICustomFieldBreakdownItem[];
  customFieldsTotal?: number;
  baseFee: number;
  sqft: number;
  sqftRate: number;
  sqftCost: number;
  bedrooms: number;
  bedroomRate: number;
  bedroomCost: number;
  bathrooms: number;
  bathroomRate: number;
  bathroomCost: number;
  addons: { slug: string; name: string; price: number }[];
  addonsTotal: number;
  totalAmount: number;
}

export const calculateBookingPriceAPI = async (payload: {
  serviceSlug?: string;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  selectedAddons?: string[];
}): Promise<{ success: boolean; data?: IBookingPriceBreakdown; message?: string }> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/pricing/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error calculating booking price:", error);
    return { success: false, message: error.message || "Failed to calculate price" };
  }
};

