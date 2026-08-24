import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export type TCleanerStatus = "PENDING_APPROVAL" | "APPROVED" | "BLOCKED";

export interface ICleanerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  nidNumber?: string;
  status: TCleanerStatus;
  isApproved: boolean;
  isAvailable: boolean;
  rating: number;
  totalJobsDone: number;
  totalEarnings: number;
  coverageArea?: string[];
  createdAt?: string;
}

export const mapCleanerProfile = (c: any): ICleanerProfile => ({
  id: c._id || c.id || "",
  userId: c.user?._id || c.user?.id || c.user || "",
  name: c.user?.name || c.name || "Cleaner Staff",
  email: c.user?.email || c.email || "N/A",
  phone: c.user?.phone || c.phone || "N/A",
  avatar: c.avatar || c.user?.avatar || "",
  dob: c.dob || "N/A",
  gender: c.gender || "Male",
  nidNumber: c.nidNumber || "N/A",
  status: (c.status || "PENDING_APPROVAL") as TCleanerStatus,
  isApproved: c.isApproved ?? false,
  isAvailable: c.isAvailable ?? true,
  rating: c.rating ?? 5.0,
  totalJobsDone: c.totalJobsDone ?? 0,
  totalEarnings: c.totalEarnings ?? 0,
  coverageArea: Array.isArray(c.coverageArea) ? c.coverageArea : [],
  createdAt: c.createdAt || new Date().toISOString(),
});

export const fetchAllCleanersAPI = async (statusQuery?: string): Promise<ICleanerProfile[]> => {
  try {
    const baseUrl = getBaseUrl();
    const url = statusQuery ? `${baseUrl}/cleaners?status=${statusQuery}` : `${baseUrl}/cleaners`;
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapCleanerProfile);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchAllCleanersAPI:", error);
    return [];
  }
};

export const updateCleanerApprovalAPI = async (
  cleanerId: string,
  payload: { status: TCleanerStatus; isApproved: boolean }
) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/cleaners/${cleanerId}/approval`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
};
