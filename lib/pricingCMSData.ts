"use client";

export interface PricingCMSContent {
  // Section 1: Hero Banner Settings
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroImage: string;

  // Section 2: Pricing Section Settings
  sectionBadge: string;
  sectionTitle: string;
  sectionAssetImage: string;
}

export const defaultPricingCMSData: PricingCMSContent = {
  heroBadge: "TRANSPARENT SAAS PRICING & ESTIMATE",
  heroTitleLine1: "AFFORDABLE & FLEXIBLE",
  heroTitleHighlight: "PRICING",
  heroTitleLine2: "PLANS",
  heroSubtitle:
    "আবাসিক বাসা, কমার্শিয়াল অফিস ও স্থানান্তরিত স্পেসের জন্য স্বচ্ছ সাবস্ক্রিপশন প্যাকেজ অথবা ডাইনামিক লাইভ ক্যালকুলেটর থেকে তাৎক্ষণিক বাজেট বের করুন।",
  heroImage:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",

  sectionBadge: "PRICING",
  sectionTitle: "FLEXIBLE PRICING PLANS CLEANING SERVICES",
  sectionAssetImage: "/cleaning-bucket.png",
};

export const PRICING_CMS_STORAGE_KEY = "cleanix_pricing_cms_v1";

export function getStoredPricingCMSData(): PricingCMSContent {
  if (typeof window === "undefined") return defaultPricingCMSData;
  try {
    const raw = localStorage.getItem(PRICING_CMS_STORAGE_KEY);
    if (!raw) return defaultPricingCMSData;
    const parsed = JSON.parse(raw);
    return { ...defaultPricingCMSData, ...parsed };
  } catch (err) {
    console.error("Failed to parse Pricing CMS data:", err);
    return defaultPricingCMSData;
  }
}

export function savePricingCMSData(data: PricingCMSContent): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRICING_CMS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("cleanix_pricing_cms_updated"));
  } catch (err) {
    console.error("Failed to save Pricing CMS data:", err);
  }
}
