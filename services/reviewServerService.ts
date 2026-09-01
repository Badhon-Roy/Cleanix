import { ReviewItem } from "./reviewService";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchFeaturedReviewsServer = async (): Promise<ReviewItem[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/reviews/featured`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (error: any) {
    console.error("Error fetching featured reviews on server side:", error);
  }
  return [];
};

export const fetchServiceReviewsServer = async (
  serviceSlug: string
): Promise<ReviewItem[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/reviews/service/${serviceSlug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json?.data)) {
        return json.data;
      }
    }
  } catch (error: any) {
    console.error("Error fetching service reviews on server side:", error);
  }
  return [];
};

export const fetchAllReviewsServer = async (
  query?: Record<string, any>
): Promise<ReviewItem[]> => {
  try {
    const baseUrl = getBaseUrl();
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          params.append(key, String(val));
        }
      });
    }
    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${baseUrl}/reviews${queryStr}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json?.data)) {
        return json.data;
      }
    }
  } catch (error: any) {
    console.error("Error fetching reviews on server side:", error);
  }
  return [];
};
