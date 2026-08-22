"use client";

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  image: string;
  nidVerified: boolean;
  bio: string;
}

export interface AboutContent {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroImage: string;

  overviewBadge: string;
  overviewTitle1: string;
  overviewTitleHighlight: string;
  overviewDesc: string;
  overviewLeftImage: string;
  overviewRightImage: string;

  stat1Count: string;
  stat1Label: string;
  stat2Count: string;
  stat2Label: string;
  stat3Count: string;
  stat3Label: string;

  // Who We Are & Mission Section Data
  whoWeAreBadge: string;
  whoWeAreTitle: string;
  whoWeAreHighlight: string;
  whoWeAreFeatureImage: string;
  whoWeAreExpYears: string;
  whoWeAreExpLabel: string;
  whoWeAreClientsCount: string;
  whoWeAreRatingScore: string;
  whoWeAreSubheading: string;
  whoWeArePara1: string;
  whoWeArePara2: string;
  whoWeAreCheck1: string;
  whoWeAreCheck2: string;
  whoWeAreCheck3: string;
  whoWeAreCheck4: string;

  teamMembers: TeamMemberItem[];
}

export const initialAboutData: AboutContent = {
  heroBadge: "ABOUT CLEANIX",
  heroTitleLine1: "REDEFINING CLEANLINESS WITH",
  heroTitleHighlight: "TECHNOLOGY",
  heroSubtitle:
    "বাংলাদেশের প্রথম SaaS-চালিত অন-ডিমান্ড স্মার্ট ফিল্ড সার্ভিস প্ল্যাটফর্ম—যেখানে প্রতিটি সেবা শতভাগ স্বচ্ছ, নিখুঁত এবং নিরাপদ।",
  heroImage: "/hero-cleaner.png",

  overviewBadge: "COMPANY OVERVIEW",
  overviewTitle1: "PROFESSIONAL CLEANING",
  overviewTitleHighlight: "SERVICE NETWORK",
  overviewDesc:
    "ঢাকার যেকোনো রেসিডেন্সিয়াল হোম, করপোরেট অফিস, শোরুম ও স্থানান্তরিত স্পেসের জন্য এনআইডি ভেরিফাইড টিম, সার্টিফাইড কেমিক্যালস এবং অটোমেটেড অ্যাপ সাবস্ক্রিপশন সুবিধা।",
  overviewLeftImage: "/RESIDENTIAL-DEEP-CLEANING.png",
  overviewRightImage: "/COMMERCIAL-OFFICE-CLEANING.png",

  stat1Count: "16K+",
  stat1Label: "Cleanings Completed",
  stat2Count: "1,200+",
  stat2Label: "Satisfied Clients",
  stat3Count: "4.9 / 5",
  stat3Label: "Average Client Rating",

  // Who We Are Initial Data
  whoWeAreBadge: "ABOUT OUR COMPANY",
  whoWeAreTitle: "DELIVERING RELIABLE CLEANING SOLUTIONS WITH PROFESSIONAL CARE & LASTING",
  whoWeAreHighlight: "QUALITY",
  whoWeAreFeatureImage: "/about-cleaner.png",
  whoWeAreExpYears: "10+",
  whoWeAreExpLabel: "Years of Cleaning Experience",
  whoWeAreClientsCount: "1,250+ Happy Clients",
  whoWeAreRatingScore: "4.8/5.0",
  whoWeAreSubheading: "আমরা কারা? (Who We Are)",
  whoWeArePara1:
    "Cleanix হলো বাংলাদেশের প্রথম SaaS-চালিত হাইব্রিড স্মার্ট ক্লিনিং প্ল্যাটফর্ম। আমরা আবাসিক বাসা এবং গুলশান, বনানী, মতিঝিল ও উত্তরায় যেকোনো আকারের কর্পোরেট অফিসের জন্য বিশ্বমানের জীবাণুমুক্তকরণ ও প্রিমিয়াম ডিপ ক্লিনিং সেবা প্রদান করি।\n\nআমাদের রয়েছে ব্যাকগ্রাউন্ড-ভেরিফাইড দক্ষ টিম, আন্তর্জাতিক মানের ইকো-ফ্রেন্ডলি সেফ কেমিক্যালস এবং লাইভ জিপিএস ট্র্যাকিং সিস্টেম—যা নিশ্চিত করে শতভাগ হাইজিন ও সময়নিষ্ঠতা।",
  whoWeArePara2: "",
  whoWeAreCheck1: "98% ON-TIME ARRIVAL IN DHAKA",
  whoWeAreCheck2: "1,250+ SATISFIED CLIENTS",
  whoWeAreCheck3: "100% VERIFIED CLEANER TEAMS",
  whoWeAreCheck4: "24/7 DEDICATED SUPPORT",

  teamMembers: [
    {
      id: "TM-101",
      name: "Tariqul Islam",
      role: "Head of Operations & Quality Audit",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
      nidVerified: true,
      bio: "১০ বছরের ফিল্ড সার্ভিস অভিজ্ঞতা সহ প্রতিটি ডিপ ক্লিনিং প্রজেক্ট ইনসপেকশনের দায়িত্বপ্রাপ্ত কর্মকর্তা।",
    },
    {
      id: "TM-102",
      name: "Nusrat Jahan",
      role: "Customer Success & Concierge Director",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      nidVerified: true,
      bio: "ভিআইপি কাস্টমার হ্যান্ডলিং ও অনলাইন বুকিং অ্যাসিস্ট্যান্স পরিচালনা কর্মকর্তা।",
    },
    {
      id: "TM-103",
      name: "Rafiq Ahmed",
      role: "Senior Safety & Chemical Hygiene Specialist",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
      nidVerified: true,
      bio: "ইকো-ফ্রেন্ডলি সার্টিফাইড অর্গানিক কেমিক্যাল ও স্টিম অ্যাপ্লায়েন্স কেয়ার এক্সপার্ট।",
    },
  ],
};

const STORAGE_KEY = "cleanix_about_data_v5";

export function getStoredAboutData(): AboutContent {
  if (typeof window === "undefined") return initialAboutData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAboutData));
      return initialAboutData;
    }
    const parsed = JSON.parse(raw);
    return { ...initialAboutData, ...parsed };
  } catch (e) {
    console.error("Failed to load about content from localStorage:", e);
    return initialAboutData;
  }
}

export function saveAboutData(data: AboutContent): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("cleanix_about_updated"));
  } catch (e) {
    console.error("Failed to save about content to localStorage:", e);
  }
}
