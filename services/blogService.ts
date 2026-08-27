import { BlogDetail } from "@/lib/blogsData";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("cleanix_auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchBlogsAPI = async (): Promise<{ success: boolean; data: BlogDetail[] }> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/blogs`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.data)) {
      return { success: true, data: data.data };
    }
    return { success: false, data: [] };
  } catch (error: any) {
    console.error("Error fetching blogs from API:", error);
    return { success: false, data: [] };
  }
};

export const fetchBlogBySlugAPI = async (slug: string): Promise<{ success: boolean; data: BlogDetail | null }> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/blogs/${slug}`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    if (data && data.success && data.data) {
      return { success: true, data: data.data };
    }
    return { success: false, data: null };
  } catch (error: any) {
    console.error(`Error fetching blog ${slug} from API:`, error);
    return { success: false, data: null };
  }
};

export const createBlogAPI = async (payload: BlogDetail): Promise<any> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/blogs`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return {
      success: false,
      message: error.message || "Failed to create blog post",
    };
  }
};

export const updateBlogAPI = async (slug: string, payload: Partial<BlogDetail>): Promise<any> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/blogs/${slug}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(`Error updating blog post ${slug}:`, error);
    return {
      success: false,
      message: error.message || "Failed to update blog post",
    };
  }
};

export const deleteBlogAPI = async (slug: string): Promise<any> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/blogs/${slug}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(`Error deleting blog post ${slug}:`, error);
    return {
      success: false,
      message: error.message || "Failed to delete blog post",
    };
  }
};
