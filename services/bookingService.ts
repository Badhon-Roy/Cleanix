import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export interface IBookingPayload {
  serviceType: string; // ServiceCategory _id (ObjectId string)
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  selectedAddons?: string[];
  customFieldValues?: Record<string, any>;
  scheduledDate: string;
  timeSlot: string;
  address: string;
  locationId?: string;
  paymentMethod: "BKASH" | "NAGAD" | "STRIPE" | "COD";
  notes?: string;
}

export const createBookingAPI = async (payload: IBookingPayload) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return { success: false, message: error.message || "Failed to confirm booking" };
  }
};

export const fetchMyBookingsAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings/me`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return { success: false, message: error.message || "Failed to fetch bookings" };
  }
};

export const cancelBookingAPI = async (bookingId: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings/${bookingId}/cancel`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return { success: false, message: error.message || "Failed to cancel booking" };
  }
};
