export interface IPlan {
  _id?: string;
  id: string;
  title: string;
  subtitleBn: string;
  price: string;
  pricePeriodBn?: string;
  category?: string;
  active: boolean;
  isPopular: boolean;
  popularLabel?: string;
  vipBadge?: string;
  ctaText?: string;
  ctaHref?: string;
  features: string[];
  order?: number;
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

const mapPlan = (item: any): IPlan => {
  return {
    _id: item._id || item.id,
    id: item.id || item._id,
    title: item.title || "CUSTOM PLAN",
    subtitleBn: item.subtitleBn || "",
    price: item.price || "৳0",
    pricePeriodBn: item.pricePeriodBn || "/ মাস (Monthly)",
    category: item.category || "SUBSCRIPTION",
    active: item.active ?? true,
    isPopular: item.isPopular ?? false,
    popularLabel: item.popularLabel || "★ MOST POPULAR",
    vipBadge: item.vipBadge || "",
    ctaText: item.ctaText || "Select Plan",
    ctaHref: item.ctaHref || "/contact",
    features: Array.isArray(item.features) ? item.features : [],
    order: item.order || 0,
  };
};

export const fetchAllPlansAPI = async (activeOnly = false): Promise<IPlan[]> => {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/plans${activeOnly ? "?active=true" : ""}`;
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapPlan);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchAllPlansAPI:", error);
    return [];
  }
};

export const createPlanAPI = async (payload: Partial<IPlan>) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/plans`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in createPlanAPI:", error);
    return { success: false, message: "Network error creating pricing plan" };
  }
};

export const updatePlanAPI = async (id: string, payload: Partial<IPlan>) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/plans/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in updatePlanAPI:", error);
    return { success: false, message: "Failed to update pricing plan" };
  }
};

export const deletePlanAPI = async (id: string) => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/plans/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in deletePlanAPI:", error);
    return { success: false, message: "Failed to delete pricing plan" };
  }
};
