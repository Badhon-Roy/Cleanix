"use client";

export interface ProjectsCMSContent {
  // Section 1: Projects Hero Banner
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroImage: string;

  // Section 2: Projects Overview Story
  overviewBadge: string;
  overviewTitleLine1: string;
  overviewTitleLine2: string;
  overviewTitleHighlight: string;
  overviewTitleLine3: string;
  overviewFeatureImage: string;
  overviewDesc: string;
  overviewChecks: string[];
}

export const defaultProjectsCMSData: ProjectsCMSContent = {
  heroBadge: "OUR RECENT WORK & PORTFOLIO",
  heroTitleLine1: "EXPLORE OUR",
  heroTitleHighlight: "SUCCESSFUL",
  heroTitleLine2: "CLEANING PROJECTS",
  heroSubtitle:
    "ঢাকার বিভিন্ন অভিজাত অ্যাপার্টমেন্ট, করপোরেট অফিস, শোরুম ও রেনোভেশন পরবর্তী স্থানে সম্পন্নকৃত আমাদের কিছু উল্লেখযোগ্য কাজের বাস্তব পোর্টফোলিও দেখুন।",
  heroImage:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",

  overviewBadge: "1,200+ COMPLETED PROJECTS IN DHAKA",
  overviewTitleLine1: "DELIVERING CLEANER,",
  overviewTitleLine2: "HEALTHIER SPACES WITH",
  overviewTitleHighlight: "PROFESSIONAL",
  overviewTitleLine3: "CARE",
  overviewFeatureImage:
    "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630",
  overviewDesc:
    "<p>গুলশান, বনানী, উত্তরা, ধানমন্ডি ও বসুন্ধরার অভিজাত আবাসন ও কর্পোরেট হেডকোয়ার্টারে ১,২০০+ প্রজেক্ট সফলভাবে সম্পন্ন করার অভিজ্ঞতা নিয়ে Cleanix আপনার যেকোনো স্থানের জন্য নির্ভরযোগ্য স্যানিটাইজেশন নিশ্চিত করে।</p><p>আবাসিক বাড়ি থেকে শুরু করে কমার্শিয়াল শোরুম ও পোস্ট-কনস্ট্রাকশন সাইট—প্রতিটি প্রজেক্টে এনআইডি ট্র্যাকিংকৃত ক্লিনার, আধুনিক ইকো-ফ্রেন্ডলি কেমিক্যালস এবং অনলাইন বিটুবি সাবস্ক্রিপশন সুবিধা প্রদান করা হয়।</p>",
  overviewChecks: [
    "Residential Deep Cleaning",
    "End-to-End Sanitation",
    "Eco-Friendly Safe Chemicals",
    "Real-Time SMS & GPS Tracking",
  ],
};
