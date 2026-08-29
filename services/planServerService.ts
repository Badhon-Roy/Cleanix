import { IPlan } from "./planService";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

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
    isAddonFree: item.isAddonFree ?? false,
    ctaText: item.ctaText || "Select Plan",
    ctaHref: item.ctaHref || "/subscribe",
    features: Array.isArray(item.features) ? item.features : [],
    order: item.order || 0,
  };
};

export const fetchPlansServer = async (activeOnly = true): Promise<IPlan[]> => {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/plans${activeOnly ? "?active=true" : ""}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapPlan);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchPlansServer:", error);
    return [];
  }
};
