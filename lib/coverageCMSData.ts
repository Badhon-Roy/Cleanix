"use client";

export interface CoverageCMSContent {
  // Section 1: Hero Banner Settings
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroImage: string;

  // Section 2: Coverage Grid Section Settings
  sectionBadge: string;
  sectionTitleLine1: string;
  sectionTitleHighlight: string;
  sectionTitleLine2: string;
  sectionSubtitle: string;
}

export const defaultCoverageCMSData: CoverageCMSContent = {
  heroBadge: "24/7 ACTIVE GPS FLEET COVERAGE",
  heroTitleLine1: "DHAKA CITY",
  heroTitleHighlight: "COVERAGE AREA",
  heroTitleLine2: "MAP",
  heroSubtitle:
    "ঢাকার ১০টি প্রধান এলাকায় আমাদের এনআইডি-ভেরিফাইড ক্লিনার বহর জরুরি ২৫-৩০ মিনিটের মধ্যে পৌঁছে যায়। আপনার এলাকা নির্বাচন করে সার্ভিস স্পট বুক করুন।",
  heroImage:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",

  sectionBadge: "COVERAGE AREA MAP",
  sectionTitleLine1: "PROUDLY SERVING ALL MAJOR",
  sectionTitleHighlight: "NEIGHBORHOODS",
  sectionTitleLine2: "IN DHAKA",
  sectionSubtitle:
    "আমাদের জিপিএস ট্র্যাকিংকৃত ক্লিনার বহর ঢাকার প্রতিটি প্রধান এলাকায় জরুরি ২৫-৩০ মিনিটের মধ্যে পৌঁছে যায়।",
};
