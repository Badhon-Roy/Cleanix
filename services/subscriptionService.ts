import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export interface ISubscriptionPurchasePayload {
  selectedPlanId: string;
  selectedAddonIds?: string[];
  selectedZone: string;
  streetAddress: string;
  firstVisitDate: string;
  selectedSlotId?: string;
  timeSlot?: string;
  specialInstructions?: string;
  paymentMethod: "BKASH" | "NAGAD" | "SSLCOMMERZ" | "COD" | "STRIPE";
  bkashPhone?: string;
  bkashTrxId?: string;
}

export const createSubscriptionAPI = async (payload: ISubscriptionPurchasePayload) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/subscriptions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    return { success: false, message: error.message || "Failed to activate subscription" };
  }
};

export const fetchMySubscriptionsAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/subscriptions/me`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);
    return { success: false, message: error.message || "Failed to fetch subscriptions" };
  }
};

export const cancelSubscriptionAPI = async (subscriptionId: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    return { success: false, message: error.message || "Failed to cancel subscription" };
  }
};

export const downloadSubscriptionPDFAPI = async (subscriptionId: string, filename = "Cleanix-Subscription-Invoice.pdf") => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/pdf`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || "Failed to download PDF invoice");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return { success: true };
  } catch (error: any) {
    console.error("Error downloading subscription PDF:", error);
    alert(error?.message || "Failed to download PDF invoice. Please ensure you are logged in.");
    return { success: false, message: error.message };
  }
};

