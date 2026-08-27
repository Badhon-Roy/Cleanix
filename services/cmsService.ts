import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && token.trim() !== "" ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchHomeCMSAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/home`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching Home CMS data from backend:", error);
    return { success: false, data: null };
  }
};

export const updateHomeCMSAPI = async (payload: any) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/home`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating Home CMS content:", error);
    return {
      success: false,
      message: error.message || "Failed to update Home CMS content",
    };
  }
};

export const fetchAboutCMSAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/about`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching About CMS data from backend:", error);
    return { success: false, data: null };
  }
};

export const updateAboutCMSAPI = async (payload: any) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/about`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating About CMS content:", error);
    return {
      success: false,
      message: error.message || "Failed to update About CMS content",
    };
  }
};

export const fetchServicesCMSAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/services`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching Services CMS data from backend:", error);
    return { success: false, data: null };
  }
};

export const updateServicesCMSAPI = async (payload: any) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/services`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating Services CMS content:", error);
    return {
      success: false,
      message: error.message || "Failed to update Services CMS content",
    };
  }
};

export const fetchProjectsCMSAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/projects`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching Projects CMS data from backend:", error);
    return { success: false, data: null };
  }
};

export const updateProjectsCMSAPI = async (payload: any) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/projects`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating Projects CMS content:", error);
    return {
      success: false,
      message: error.message || "Failed to update Projects CMS content",
    };
  }
};

export const fetchPricingCMSAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/pricing`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching Pricing CMS data from backend:", error);
    return { success: false, data: null };
  }
};

export const updatePricingCMSAPI = async (payload: any) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/pricing`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating Pricing CMS content:", error);
    return {
      success: false,
      message: error.message || "Failed to update Pricing CMS content",
    };
  }
};

export const fetchCoverageCMSAPI = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/coverage`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching Coverage CMS data from backend:", error);
    return { success: false, data: null };
  }
};

export const updateCoverageCMSAPI = async (payload: any) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/coverage`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error updating Coverage CMS content:", error);
    return {
      success: false,
      message: error.message || "Failed to update Coverage CMS content",
    };
  }
};
