import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export interface ReviewItem {
  _id: string;
  booking?: {
    _id: string;
    bookingRef?: string;
    totalAmount?: number;
    scheduledDate?: string;
    serviceType?: {
      _id: string;
      title: string;
      slug?: string;
      category?: string;
      badge?: string;
      heroImage?: string;
    };
    assignedTeam?: {
      _id: string;
      teamName: string;
      teamCode: string;
      rating?: number;
      leader?: any;
    };
  };
  customer?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  serviceType?: {
    _id: string;
    title: string;
    slug?: string;
    category?: string;
    badge?: string;
    heroImage?: string;
  };
  team?: {
    _id: string;
    teamName: string;
    teamCode: string;
    rating?: number;
  };
  cleaners?: Array<{
    _id: string;
    name: string;
    rating?: number;
    avatar?: string;
  }>;
  rating: number;
  feedback?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const fetchReviewsAPI = async (
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
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const fetchFeaturedReviewsAPI = async (): Promise<ReviewItem[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/reviews/featured`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    return [];
  }
};

export const fetchServiceReviewsAPI = async (
  serviceSlug: string
): Promise<ReviewItem[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/reviews/service/${serviceSlug}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching service reviews:", error);
    return [];
  }
};

export const fetchTeamReviewsAPI = async (
  teamId: string
): Promise<ReviewItem[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/reviews/team/${teamId}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching team reviews:", error);
    return [];
  }
};

export const fetchMyReviewsAPI = async (): Promise<ReviewItem[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/reviews/my-reviews`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching my reviews:", error);
    return [];
  }
};

export const fetchBookingReviewAPI = async (
  bookingId: string
): Promise<ReviewItem | null> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/reviews/booking/${bookingId}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && data?.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching booking review:", error);
    return null;
  }
};

export const createReviewAPI = async (payload: {
  bookingId: string;
  rating: number;
  feedback?: string;
  photos?: string[];
}) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/reviews`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateReviewStatusAPI = async (
  reviewId: string,
  payload: { isApproved?: boolean; isFeatured?: boolean }
) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/reviews/${reviewId}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteReviewAPI = async (reviewId: string) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
};
