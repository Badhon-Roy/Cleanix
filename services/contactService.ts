export type TContactStatus = 'NEW' | 'CONTACTED' | 'RESOLVED' | 'ARCHIVED';

export interface IContact {
  id: string;
  _id?: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: TContactStatus;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  notes?: string;
}

export interface CreateContactPayload {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

const mapContact = (item: any): IContact => {
  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    name: item.name || "Anonymous",
    phone: item.phone || "N/A",
    email: item.email || "N/A",
    subject: item.subject || "General Contact Inquiry",
    message: item.message || "",
    status: (item.status as TContactStatus) || "NEW",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt,
  };
};

export const createContactAPI = async (payload: CreateContactPayload) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/contacts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in createContactAPI:", error);
    return { success: false, message: "Network error submitting contact inquiry" };
  }
};

export const fetchAllContactsAPI = async (params?: {
  status?: string;
  searchTerm?: string;
}): Promise<IContact[]> => {
  try {
    const baseUrl = getBaseUrl();
    const queryParams = new URLSearchParams();
    if (params?.status && params.status !== "ALL") {
      queryParams.append("status", params.status);
    }
    if (params?.searchTerm) {
      queryParams.append("searchTerm", params.searchTerm);
    }

    const queryString = queryParams.toString();
    const url = `${baseUrl}/contacts${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapContact);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchAllContactsAPI:", error);
    return [];
  }
};

export const updateContactStatusAPI = async (id: string, status: TContactStatus) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/contacts/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in updateContactStatusAPI:", error);
    return { success: false, message: "Failed to update contact status" };
  }
};

export const deleteContactAPI = async (id: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/contacts/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in deleteContactAPI:", error);
    return { success: false, message: "Failed to delete contact" };
  }
};
