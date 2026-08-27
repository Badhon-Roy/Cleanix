"use client";

export interface HowItWorksStepItem {
  id: string;
  step: string;
  title: string;
  description: string;
  image: string;
}

export interface ServicesCMSContent {
  // Section 1: Services Hero Banner
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight1: string;
  heroTitleMiddle: string;
  heroTitleHighlight2: string;
  heroSubtitle: string;
  heroImage: string;

  // Section 2: Services Overview Story
  overviewBadge: string;
  overviewTitle1: string;
  overviewTitleHighlight: string;
  overviewTitle2: string;
  overviewDesc: string;
  overviewFeatureImage: string;

  // Overview Feature Cards
  card1Title: string;
  card1Checks: string[];

  card2Title: string;
  card2Checks: string[];

  // Section 3: Core Services Section Settings
  coreBadge: string;
  coreTitleLine1: string;
  coreTitleHighlight: string;
  coreTitleLine2: string;

  // Section 4: How It Works Settings
  howItWorksBadge: string;
  howItWorksTitle: string;
  howItWorksHighlight: string;
  howItWorksRightDesc: string;
  howItWorksSteps: HowItWorksStepItem[];
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

  overviewBadge: "SERVICES OVERVIEW",
  overviewTitle1: "COMPLETE HOME & BUSINESS",
  overviewTitleHighlight: "CLEANING",
  overviewTitle2: "CARE",
  overviewDesc:
    "ঢাকার যেকোনো রেসিডেন্সিয়াল হোম, অ্যাপার্টমেন্ট, করপোরেট অফিস, শোরুম ও রেনোভেশন পরবর্তী স্পেসের জন্য আধুনিক SaaS প্ল্যাটফর্মের মাধ্যমে নির্ভরযোগ্য স্যানিটাইজেশন ও ডিপ ক্লিনিং সুবিধা।",
  overviewFeatureImage:
    "https://framerusercontent.com/images/c5y1nznyANddYfGro1eQOAip3bc.png?width=588&height=640",

  card1Title: "Residential Cleaning (B2C)",
  card1Checks: [
    "Room-by-Room Deep Clean",
    "Kitchen & Bathroom Reset",
    "Sofa & Carpet Vacuuming",
  ],

  card2Title: "Commercial Cleaning (B2B)",
  card2Checks: [
    "Workstation Sanitization",
    "Off-Hour & Weekend Shifts",
    "Monthly Corporate SLAs",
  ],

  coreBadge: "OUR CORE SERVICES",
  coreTitleLine1: "RELIABLE HOME & COMMERCIAL",
  coreTitleHighlight: "CLEANING",
  coreTitleLine2: "SERVICES",

  howItWorksBadge: "HOW IT WORKS",
  howItWorksTitle: "EASY STEPS TO BOOK YOUR",
  howItWorksHighlight: "CLEANING",
  howItWorksRightDesc:
    "সহজ বুকিং প্রসেস, ক্লিনারদের লাইভ জিপিএস ট্র্যাকিং এবং কোয়ালিটি গ্যারান্টি নিয়ে আপনার সেবা নিশ্চিত করুন ৩টি সহজ ধাপে।",
  howItWorksSteps: [
    {
      id: "HW-1",
      step: "STEP 01",
      title: "INSTANT BOOKING & ESTIMATE",
      description:
        "আপনার স্পেসের সাইজ (SqFt), রুম সংখ্যা এবং সুবিধাজনক সময় বেছে নিয়ে কয়েক সেকেন্ডে ডাইনামিক কোটেশন পেয়ে যান।",
      image:
        "https://framerusercontent.com/images/iP0bB1oMamNlkOzNJQUNBhTRiU.png?width=464&height=320",
    },
    {
      id: "HW-2",
      step: "STEP 02",
      title: "VERIFIED TEAM VISIT",
      description:
        "আমাদের ভেরিফাইড ক্লিনার টিম নির্ধারিত সময়ে পৌঁছে আন্তর্জাতিক মানের সেফ কেমিক্যালস দিয়ে সেবা প্রদান করবে।",
      image:
        "https://framerusercontent.com/images/qQZSYnMAEFCtGMlduHTBAQmANg.png?width=464&height=320",
    },
    {
      id: "HW-3",
      step: "STEP 03",
      title: "QUALITY CHECK & INVOICE",
      description:
        "কাজ শেষে বিফোর/আফটার ফটো ইনসপেকশন, ইনস্ট্যান্ট কাস্টমার রেটিং এবং অ্যাপ থেকে অটোমেটেড ইনভয়েস ডাউনলোড করুন।",
      image:
        "https://framerusercontent.com/images/2Zn55hKsUUZQoQR8DfeD1PUXY78.png?width=464&height=320",
    },
  ],
};
