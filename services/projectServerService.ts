import { ProjectDetail } from "@/lib/projectsData";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchProjectsServer = async (): Promise<ProjectDetail[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/projects`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json?.data)) {
        return json.data;
      }
    }
  } catch (error: any) {
    console.error("Error fetching projects on server side:", error);
  }
  return [];
};

export const fetchProjectBySlugServer = async (slug: string): Promise<ProjectDetail | null> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/projects/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return json.data;
      }
    }
  } catch (error: any) {
    console.error(`Error fetching project ${slug} on server side:`, error);
  }
  return null;
};
