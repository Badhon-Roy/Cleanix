"use client";

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  image: string;
  nidVerified: boolean;
  bio: string;
}

export interface JourneyStepItem {
  id: string;
  number: string;
  year: string;
  side: "left" | "right";
  title: string;
  desc: string;
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

  // Section 5: Professional CTA Banner Data
  ctaBannerImage: string;
  ctaBadgeText: string;
  ctaTitle: string;
  ctaCheck1: string;
  ctaCheck2: string;
  ctaCheck3: string;
  ctaChecks: string[];
  ctaButtonText: string;
  ctaButtonLink: string;

  // Section 6: Our Journey Timeline Data
  journeyBadge: string;
  journeyTitle: string;
  journeyHighlight: string;
  journeySteps: JourneyStepItem[];
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

  ctaBannerImage: "https://framerusercontent.com/images/hykQu8sbeIwxfZ3UXUa3Ce7b47E.png?width=1880&height=750",
  ctaBadgeText: "• CLEANING • DEEP CLEAN • HOME CARE • SANITIZE",
  ctaTitle: "LET'S MOVE YOUR CLEANING WITH PROFESSIONAL",
  ctaCheck1: "RESIDENTIAL CLEANING SERVICES",
  ctaCheck2: "COMMERCIAL CLEANING SOLUTIONS",
  ctaCheck3: "ECO-FRIENDLY CLEANING PRODUCTS",
  ctaChecks: [
    "RESIDENTIAL CLEANING SERVICES",
    "COMMERCIAL CLEANING SOLUTIONS",
    "ECO-FRIENDLY CLEANING PRODUCTS",
  ],
  ctaButtonText: "Get a Quote",
  ctaButtonLink: "/#quote",

  // Section 6 Initial Data
  journeyBadge: "OUR JOURNEY",
  journeyTitle: "BUILDING CLEANER SPACES",
  journeyHighlight: "WITH EVERY SERVICE",
  journeySteps: [
    {
      id: "JS-101",
      number: "01",
      year: "2025–2026",
      side: "right",
      title: "Expanding Smart SaaS Automation Across Dhaka City",
      desc: "গুলশান, বনানী, উত্তরা, ধানমন্ডি ও মতিঝিলে আমাদের ১,২০০+ সক্রিয় বিটুবি ও বিটুসি গ্রাহকদের জন্য রিয়েল-টাইম জিপিএস ট্র্যাকিং, অনলাইন বিটুবি সাবস্ক্রিপশন ও ডিজিটাল ইনভয়েসিং সিস্টেম চালু।",
    },
    {
      id: "JS-102",
      number: "02",
      year: "2022–2023",
      side: "left",
      title: "Hospital-Grade Chemical & HEPA Scrubbers Setup",
      desc: "বাংলাদেশি বাসাবাড়ি ও অফিসের জন্য বিশ্বমানের অ্যান্টি-ব্যাকটেরিয়াল ইকো কেমিক্যালস, ইন্ডাস্ট্রিয়াল ফ্লোর বাফার ও ১০০% এনআইডি-ভেরিফাইড প্রফেশনাল ক্লিনার টিম গঠন।",
    },
    {
      id: "JS-103",
      number: "03",
      year: "2020–2021",
      side: "right",
      title: "Company Founded in Dhaka",
      desc: "ঢাকার ব্যস্ত পরিবার ও করপোরেট প্রতিষ্ঠানকে সাশ্রয়ী খরচে (৳6,000 / ৳14,000 / ৳30,000 প্যাকেজে) নিখুঁত ও নির্ভরযোগ্য ক্লিনিং সেবা দেওয়ার ভিশন নিয়ে ক্লিনিক্সের শুভ সূচনা।",
    },
  ],
};

export const defaultAboutData = initialAboutData;
