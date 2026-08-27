import { BlogDetail, defaultBlogsList } from "@/lib/blogsData";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchBlogsServer = async (): Promise<BlogDetail[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/blogs`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (error: any) {
    console.error("Error fetching blogs on server side:", error);
  }
  return defaultBlogsList;
};

export const fetchBlogBySlugServer = async (slug: string): Promise<BlogDetail | null> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/blogs/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return json.data;
      }
    }
  } catch (error: any) {
    console.error(`Error fetching blog ${slug} on server side:`, error);
  }
  // Fallback to default list match if available
  const match = defaultBlogsList.find((b) => b.slug === slug);
  return match || null;
};
