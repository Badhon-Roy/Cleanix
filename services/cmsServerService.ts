import { HomeCMSContent, defaultHomeCMSData } from "@/lib/homeCMSData";
import { AboutContent, defaultAboutData } from "@/lib/aboutData";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchHomeCMSServer = async (): Promise<HomeCMSContent> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/home`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return { ...defaultHomeCMSData, ...json.data };
      }
    }
  } catch (error: any) {
    console.error("Error fetching Home CMS on server side:", error);
  }
  return defaultHomeCMSData;
};

export const fetchAboutCMSServer = async (): Promise<AboutContent> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/about`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return { ...defaultAboutData, ...json.data };
      }
    }
  } catch (error: any) {
    console.error("Error fetching About CMS on server side:", error);
  }
  return defaultAboutData;
};
