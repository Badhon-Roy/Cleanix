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

export const fetchAdminBookingsAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching admin bookings:", error);
    return { success: false, message: error.message || "Failed to fetch admin bookings" };
  }
};

export const updateAdminBookingStatusAPI = async (
  bookingId: string,
  payload: { status?: string; cleanerTeam?: string; teamId?: string }
) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating booking status:", error);
    return { success: false, message: error.message || "Failed to update booking status" };
  }
};

export const assignTeamToBookingAPI = async (
  bookingId: string,
  payload: { teamId?: string; cleanerTeam?: string; notes?: string }
) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings/${bookingId}/assign-team`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error assigning team to booking:", error);
    return { success: false, message: error.message || "Failed to assign team to booking" };
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

export const downloadBookingPDFAPI = async (bookingId: string, filename = "Cleanix-Booking-Invoice.pdf") => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings/${bookingId}/pdf`, {
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
    console.error("Error downloading booking PDF:", error);
    alert(error?.message || "Failed to download PDF invoice. Please ensure you are logged in.");
    return { success: false, message: error.message };
  }
};

export const updateBookingProgressAPI = async (
  bookingId: string,
  payload: {
    status?: string;
    notes?: string;
    proofOfWork?: {
      beforePhotos?: string[];
      afterPhotos?: string[];
      notes?: string;
      checklist?: { id: number; text: string; done: boolean }[];
    };
  }
) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings/${bookingId}/progress`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating booking progress:", error);
    return { success: false, message: error.message || "Failed to update booking progress" };
  }
};

export const confirmBookingCompletionAPI = async (
  bookingId: string,
  payload?: { rating?: number; feedback?: string }
) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings/${bookingId}/confirm-completion`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload || {}),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error confirming booking completion:", error);
    return { success: false, message: error.message || "Failed to confirm completion" };
  }
};

export const requestBookingByTeamAPI = async (bookingId: string, teamSlug?: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/bookings/${bookingId}/request`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ teamSlug }),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error requesting booking for team:", error);
    return { success: false, message: error.message || "Failed to request booking for team" };
  }
};


