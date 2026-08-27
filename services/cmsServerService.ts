import { HomeCMSContent, defaultHomeCMSData } from "@/lib/homeCMSData";
import { AboutContent, defaultAboutData } from "@/lib/aboutData";
import { ServicesCMSContent, defaultServicesCMSData } from "@/lib/servicesCMSData";
import { ProjectsCMSContent, defaultProjectsCMSData } from "@/lib/projectsCMSData";
import { PricingCMSContent, defaultPricingCMSData } from "@/lib/pricingCMSData";
import { CoverageCMSContent, defaultCoverageCMSData } from "@/lib/coverageCMSData";
import { ContactCMSContent, defaultContactCMSData } from "@/lib/contactCMSData";
import { BlogCMSContent, defaultBlogCMSData } from "@/lib/blogsData";

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

export const fetchServicesCMSServer = async (): Promise<ServicesCMSContent> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/services`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return { ...defaultServicesCMSData, ...json.data };
      }
    }
  } catch (error: any) {
    console.error("Error fetching Services CMS on server side:", error);
  }
  return defaultServicesCMSData;
};

export const fetchProjectsCMSServer = async (): Promise<ProjectsCMSContent> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/projects`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return { ...defaultProjectsCMSData, ...json.data };
      }
    }
  } catch (error: any) {
    console.error("Error fetching Projects CMS on server side:", error);
  }
  return defaultProjectsCMSData;
};

export const fetchPricingCMSServer = async (): Promise<PricingCMSContent> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/pricing`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return { ...defaultPricingCMSData, ...json.data };
      }
    }
  } catch (error: any) {
    console.error("Error fetching Pricing CMS on server side:", error);
  }
  return defaultPricingCMSData;
};

export const fetchCoverageCMSServer = async (): Promise<CoverageCMSContent> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/coverage`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return { ...defaultCoverageCMSData, ...json.data };
      }
    }
  } catch (error: any) {
    console.error("Error fetching Coverage CMS on server side:", error);
  }
  return defaultCoverageCMSData;
};

export const fetchContactCMSServer = async (): Promise<ContactCMSContent> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/contact`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return { ...defaultContactCMSData, ...json.data };
      }
    }
  } catch (error: any) {
    console.error("Error fetching Contact CMS on server side:", error);
  }
  return defaultContactCMSData;
};

export const fetchBlogCMSServer = async (): Promise<BlogCMSContent> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cms/blog`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        return { ...defaultBlogCMSData, ...json.data };
      }
    }
  } catch (error: any) {
    console.error("Error fetching Blog CMS on server side:", error);
  }
  return defaultBlogCMSData;
};
