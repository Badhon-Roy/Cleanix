import { ProjectDetail } from "@/lib/projectsData";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("cleanix_auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchProjectsAPI = async (): Promise<{ success: boolean; data: ProjectDetail[] }> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/projects`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.data)) {
      return { success: true, data: data.data };
    }
    return { success: false, data: [] };
  } catch (error: any) {
    console.error("Error fetching projects from API:", error);
    return { success: false, data: [] };
  }
};

export const fetchProjectBySlugAPI = async (
  slug: string
): Promise<{ success: boolean; data: ProjectDetail | null }> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/projects/${slug}`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    if (data && data.success && data.data) {
      return { success: true, data: data.data };
    }
    return { success: false, data: null };
  } catch (error: any) {
    console.error(`Error fetching project ${slug} from API:`, error);
    return { success: false, data: null };
  }
};

export const createProjectAPI = async (payload: ProjectDetail): Promise<any> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/projects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error creating project:", error);
    return {
      success: false,
      message: error.message || "Failed to create project",
    };
  }
};

export const updateProjectAPI = async (slug: string, payload: Partial<ProjectDetail>): Promise<any> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/projects/${slug}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(`Error updating project ${slug}:`, error);
    return {
      success: false,
      message: error.message || "Failed to update project",
    };
  }
};

export const deleteProjectAPI = async (slug: string): Promise<any> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/projects/${slug}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(`Error deleting project ${slug}:`, error);
    return {
      success: false,
      message: error.message || "Failed to delete project",
    };
  }
};
