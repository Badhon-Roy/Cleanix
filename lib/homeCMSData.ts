"use client";

export interface HomeCMSContent {
  // Hero Banner Section
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroImage: string;
  heroBtn1Text: string;
  heroBtn1Href: string;
  heroBtn2Text: string;
  heroBtn2Href: string;

  // Impact & Numbers Section
  impactBadge: string;
  impactTitleLine1: string;
  impactTitleHighlight: string;
  impactSubtitle: string;
  impactLeftImage: string;
  impactRightImage: string;

  impactStat1Value: string;
  impactStat1Label: string;
  impactStat2Value: string;
  impactStat2Label: string;
  impactStat3Value: string;
  impactStat3Label: string;

  // Why Choose Us Section
  whyUsBadge: string;
  whyUsTitleLine1: string;
  whyUsTitleHighlight: string;
  whyUsTitleLine2: string;
  whyUsCleanerImage: string;

  // Why Choose Us - 4 Dynamic Feature Cards
  whyUsCard1Title: string;
  whyUsCard1Checks: string[];

  whyUsCard2Title: string;
  whyUsCard2Checks: string[];

  whyUsCard3Title: string;
  whyUsCard3Checks: string[];

  whyUsCard4Title: string;
  whyUsCard4Checks: string[];

  // Core Services Section Header
  servicesBadge: string;
  servicesTitleLine1: string;
  servicesTitleHighlight: string;
  servicesTitleLine2: string;

  // FAQ Section Header
  faqBadge: string;
  faqTitle: string;
  faqHotlinePhone: string;
}

export const defaultHomeCMSData: HomeCMSContent = {
  heroBadge: "BANGLADESH'S #1 HYBRID CLEANING PLATFORM",
  heroTitleLine1: "RELIABLE CLEANING,",
  heroTitleLine2: "HOMES & OFFICES",
  heroDescription:
    "আবাসিক বাসা এবং কর্পোরেট অফিসের জন্য প্রিমিয়াম ডিপ ক্লিনিং সার্ভিস। দক্ষ টিম, অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজেশন ও সহজ বুকিং।",
  heroImage: "/hero-cleaner.png",
  heroBtn1Text: "Our Services",
  heroBtn1Href: "/services",
  heroBtn2Text: "Get Free Quote",
  heroBtn2Href: "/contact",

  impactBadge: "OUR IMPACT & NUMBERS",
  impactTitleLine1: "REAL NUMBERS BEHIND OUR",
  impactTitleHighlight: "CLEANING EXCELLENCE",
  impactSubtitle:
    "বাংলাদেশের প্রতিটি বাসা ও কর্পোরেট অফিস স্পেসকে শতভাগ জীবাণুমুক্ত ও ঝকঝকে রাখার নির্ভরযোগ্য ডিজিটাল সমাধান।",
  impactLeftImage:
    "https://framerusercontent.com/images/7kuxPVTjMLe1PbETJGXV0BIBB6s.png?scale-down-to=512&width=901&height=826",
  impactRightImage:
    "https://framerusercontent.com/images/RakXiRCu0eigdFvdHDqHa9us9PQ.png?width=855&height=858",

  impactStat1Value: "2,500+",
  impactStat1Label: "ক্লিন করা বাসা ও অফিস",
  impactStat2Value: "150+",
  impactStat2Label: "ভেরিফাইড প্রফেশনাল ক্লিনার",
  impactStat3Value: "99.2%",
  impactStat3Label: "সন্তোষজনক কাস্টমার রেটিং",

  whyUsBadge: "WHY CHOOSE US",
  whyUsTitleLine1: "WHY CHOOSE OUR CLEANIX",
  whyUsTitleHighlight: "CLEANING",
  whyUsTitleLine2: "SERVICES",
  whyUsCleanerImage: "/why-choose-cleaner.png",

  whyUsCard1Title: "Verified Professional Cleaners",
  whyUsCard1Checks: [
    "NID ও পুলিশ ব্যাকগ্রাউন্ড ভেরিফাইড",
    "আন্তর্জাতিক স্ট্যান্ডার্ড ট্রেনিংপ্রাপ্ত",
  ],

  whyUsCard2Title: "Safe & Eco-Friendly Solutions",
  whyUsCard2Checks: [
    "শিশু ও পোষা প্রাণীর জন্য শতভাগ নিরাপদ",
    "অ্যান্টি-ব্যাকটেরিয়াল কেমিক্যাল স্যানিটাইজ",
  ],

  whyUsCard3Title: "Flexible Subscriptions & Slots",
  whyUsCard3Checks: [
    "মাসিক প্যাকেজ ও ইনস্ট্যান্ট এককালীন বুকিং",
    "আপনার সময় অনুযায়ী স্লট সিলেক্টর",
  ],

  whyUsCard4Title: "24/7 Dedicated Support",
  whyUsCard4Checks: [
    "হটলাইন, হোয়াটসঅ্যাপ ও চ্যাট সাপোর্ট",
    "১০০% সার্ভিস স্যাটিস্ফেকশন গ্যারান্টি",
  ],

  servicesBadge: "OUR CORE SERVICES",
  servicesTitleLine1: "PROFESSIONAL",
  servicesTitleHighlight: "CLEANING",
  servicesTitleLine2: "SERVICES FOR EVERY SPACE",

  faqBadge: "FAQ & HELP",
  faqTitle: "FREQUENTLY ASKED QUESTIONS",
  faqHotlinePhone: "+880 1774-500815",
};

export const HOME_CMS_STORAGE_KEY = "cleanix_home_cms_v4";

export function getStoredHomeCMSData(): HomeCMSContent {
  if (typeof window === "undefined") return defaultHomeCMSData;
  try {
    const raw = localStorage.getItem(HOME_CMS_STORAGE_KEY);
    if (!raw) return defaultHomeCMSData;
    const parsed = JSON.parse(raw);
    return { ...defaultHomeCMSData, ...parsed };
  } catch (err) {
    console.error("Failed to parse Home CMS data:", err);
    return defaultHomeCMSData;
  }
}

export function saveHomeCMSData(data: HomeCMSContent): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HOME_CMS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("cleanix_home_cms_updated"));
  } catch (err) {
    console.error("Failed to save Home CMS data:", err);
  }
}
