"use client";

export interface ServicesCMSContent {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight1: string;
  heroTitleMiddle: string;
  heroTitleHighlight2: string;
  heroSubtitle: string;
  heroImage: string;
}

export const defaultServicesCMSData: ServicesCMSContent = {
  heroBadge: "WORLD-CLASS CLEANING SOLUTIONS",
  heroTitleLine1: "EXPERT CLEANING SERVICES FOR",
  heroTitleHighlight1: "HOMES",
  heroTitleMiddle: "&",
  heroTitleHighlight2: "BUSINESSES",
  heroSubtitle:
    "আবাসিক বাসা, প্রিমিয়াম অ্যাপার্টমেন্ট, করপোরেট অফিস, স্থানান্তরযোগ্য স্থান ও রেনোভেশন পরবর্তী জায়গা পরিষ্কারের জন্য প্রস্তুত আমাদের ভেরিফাইড প্রফেশনাল টিম। আপনার চাহিদা অনুযায়ী সেরা সেবাটি বেছে নিন।",
  heroImage: "/COMMERCIAL-OFFICE-CLEANING.png",
};

export const SERVICES_CMS_STORAGE_KEY = "cleanix_services_cms_v1";

export function getStoredServicesCMSData(): ServicesCMSContent {
  if (typeof window === "undefined") return defaultServicesCMSData;
  try {
    const raw = localStorage.getItem(SERVICES_CMS_STORAGE_KEY);
    if (!raw) return defaultServicesCMSData;
    const parsed = JSON.parse(raw);
    return { ...defaultServicesCMSData, ...parsed };
  } catch (err) {
    console.error("Failed to parse Services CMS data:", err);
    return defaultServicesCMSData;
  }
}

export function saveServicesCMSData(data: ServicesCMSContent): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SERVICES_CMS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("cleanix_services_cms_updated"));
  } catch (err) {
    console.error("Failed to save Services CMS data:", err);
  }
}
