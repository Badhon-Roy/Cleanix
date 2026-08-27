import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export interface ICoverageArea {
  id: string;
  _id?: string;
  zoneName: string;
  desc?: string;
  district: string;
  areasIncluded: string[];
  zipCodes?: string[];
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCoveragePayload {
  zoneName: string;
  desc?: string;
  district: string;
  areasIncluded: string[];
  zipCodes?: string[];
  isActive?: boolean;
}

export const mapCoverageArea = (c: any): ICoverageArea => ({
  id: c._id || c.id || "",
  _id: c._id || c.id || "",
  zoneName: c.zoneName || "",
  desc: c.desc || "",
  district: c.district || "Dhaka",
  areasIncluded: Array.isArray(c.areasIncluded) ? c.areasIncluded : [],
  zipCodes: Array.isArray(c.zipCodes) ? c.zipCodes : [],
  isActive: c.isActive !== false,
  isDeleted: c.isDeleted === true,
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
});

// Client-side API Calls
export const fetchAllCoveragesAPI = async (params?: {
  searchTerm?: string;
  district?: string;
  isActive?: boolean | string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<ICoverageArea[]> => {
  try {
    const baseUrl = getBaseUrl();
    const queryParams = new URLSearchParams();

    if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params?.district) queryParams.append("district", params.district);
    if (params?.isActive !== undefined && params?.isActive !== "")
      queryParams.append("isActive", String(params.isActive));
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `${baseUrl}/coverage${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapCoverageArea);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchAllCoveragesAPI:", error);
    return [];
  }
};

export const createCoverageAPI = async (payload: CreateCoveragePayload) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/coverage`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateCoverageAPI = async (id: string, payload: Partial<CreateCoveragePayload>) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/coverage/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteCoverageAPI = async (id: string) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/coverage/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
};
