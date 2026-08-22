"use client";

export interface ServiceOfferItem {
  iconName: string;
  title: string;
  desc: string;
}

export interface ServiceWhyPoint {
  title: string;
  desc: string;
}

export interface ServiceFaqItem {
  num: string;
  question: string;
  answer: string;
}

export interface ServiceDetail {
  slug: string;
  title: string;
  category: string;
  badge: string;
  price: string;
  slaTime: string;
  heroImage: string;
  contentImage: string;
  shortDesc: string;
  introParagraph1: string;
  introParagraph2: string;
  offersTitle: string;
  offersDesc: string;
  offers: ServiceOfferItem[];
  whyChooseTitle: string;
  whyChooseDesc: string;
  whyChoosePoints: ServiceWhyPoint[];
  faqs: ServiceFaqItem[];
  status: "ACTIVE" | "INACTIVE";
}

export const initialServicesList: ServiceDetail[] = [
  {
    slug: "residential-deep-cleaning",
    title: "RESIDENTIAL DEEP CLEANING (আবাসিক ডিপ ক্লিনিং)",
    category: "HOME CARE",
    badge: "B2C HOME CLEANING",
    price: "৳3,500 BDT",
    slaTime: "30 Mins SLA",
    heroImage: "/RESIDENTIAL-DEEP-CLEANING.png",
    contentImage: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
    shortDesc:
      "ঢাকার যেকোনো অ্যাপার্টমেন্ট ও আবাসিক বাড়ির জন্য সম্পূর্ণ রুম-বাই-রুম ডিপ রিফ্রেশ ক্লিনিং ও অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজেশন।",
    introParagraph1:
      "Cleanix-এর আবাসিক ডিপ ক্লিনিং সার্ভিস আপনার বাসা বা অ্যাপার্টমেন্টকে করে তোলে সম্পূর্ণ জীবাণুমুক্ত ও ঝকঝকে। আমরা বেডরুম, কিচেন চিমনি, বাথরুম টাইলস, সোফা ভ্যাকুয়ামিং এবং হাই-টাচ সারফেসগুলোর জন্য স্পেশাল ডাস্ট রিপেলেন্ট স্প্রে ও সেফ কেমিক্যালস ব্যবহার করি।",
    introParagraph2:
      "গুলশান, বনানী, উত্তরা, ধানমন্ডি বা বসুন্ধরার যেকোনো অ্যাপার্টমেন্টের জন্য আমাদের এনআইডি ট্র্যাকিংকৃত এক্সপার্ট ক্লিনার টিম স্পেশাল কেয়ার ও রিয়েল-টাইম লাইভ আপডেটের মাধ্যমে সর্বোচ্চ কোয়ালিটি নিশ্চিত করে।",
    offersTitle: "WHAT WE OFFER (আমাদের বিশেষ সেবাসমূহ)",
    offersDesc:
      "ঢাকার ব্যস্ত পরিবারের জন্য নমনীয় সময়সূচী অনুযায়ী ডিপ ক্লিনিং প্যাকেজ। প্রতিটি ভিজিটে নিশ্চিত করা হয় আন্তর্জাতিক মানের হাইজিন ও ডিপ রিসেট।",
    offers: [
      {
        iconName: "Sparkles",
        title: "Detailed Room-By-Room Cleaning",
        desc: "বেডরুম, লিভিং রুম, ডাইনিং টেবিল, ব্যালકની ও উইন্ডো গ্লাস ডিপ ডাস্টিং ও ভ্যাকুয়ামিং।",
      },
      {
        iconName: "Utensils",
        title: "Kitchen & Bathroom Sanitization",
        desc: "বাথরুম টাইলসের জেদি দাগ দূর করা এবং কিচেন ওভেন, সিঙ্ক ও ফিটিংস অ্যান্টি-ব্যাকটেরিয়াল ওয়াশ।",
      },
      {
        iconName: "Clock",
        title: "Flexible Scheduling & Subscriptions",
        desc: "৳6,000 বা ৳14,000 মান্থলি প্যাকেজে অথবা ওয়ান-টাইম ইন্সট্যান্ট বুকিংয়ের সুবিধা।",
      },
    ],
    whyChooseTitle: "WHY CHOOSE OUR RESIDENTIAL DEEP CLEANING",
    whyChooseDesc:
      "সাধারণ দৈনিক মোছামুছিতে বাসার গভীর ধুলোবালি ও জীবাণু দূর হয় না। Cleanix-এর ডিপ ক্লিনিং আপনার বাসার প্রতিটি কোণ সুরক্ষিত ও মেহমান-প্রস্তুত রাখে।",
    whyChoosePoints: [
      {
        title: "NID Verified Staff",
        desc: "১০০% ব্যাকগ্রাউন্ড ভেরিফাইড এবং সুসজ্জিত পোশাক পরিহিত বিশ্বস্ত ক্লিনিং টিম।",
      },
      {
        title: "Eco-Friendly Safe Chemicals",
        desc: "শিশু ও পোষা প্রাণীর জন্য সম্পূর্ণ নিরাপদ, আন্তর্জাতিক সার্টিফাইড ইকো কেমিক্যালস।",
      },
      {
        title: "Real-Time Job Tracking",
        desc: "ক্লিনার আসার সময় ও কাজের অগ্রগতি সম্পর্কে রিয়েল-টাইম এসএমএস নোটিফিকেশন।",
      },
      {
        title: "Digital Invoice & Local Payments",
        desc: "bKash, Nagad, SSLCommerz বা ক্যাশ অন ডেলিভারিতে ঝামেলাহীন পেমেন্ট সুবিধা।",
      },
    ],
    faqs: [
      {
        num: "01",
        question: "আবাসিক ডিপ ক্লিনিং করতে কত সময় লাগে?",
        answer:
          "সাধারণত ২ থেকে ৪ বেডরুমের অ্যাপার্টমেন্টের জন্য ৩ থেকে ৫ ঘণ্টা সময় লাগে। টিম আসার আগেই সময় নিশ্চিত করা হয়।",
      },
      {
        num: "02",
        question: "আমাকে কি ক্লিনিং সলিউশন বা ভ্যাকুয়াম মেশিন দিতে হবে?",
        answer:
          "না, Cleanix টিম তাদের সাথে আধুনিক ভ্যাকুয়াম ক্লিনার, স্টিমার ও প্রয়োজনীয় কেমিক্যাল সঙ্গে নিয়ে আসে।",
      },
      {
        num: "03",
        question: "ঢাকায় কোন কোন এলাকায় এই সার্ভিস পাওয়া যায়?",
        answer:
          "গুলশান, বনানী, উত্তরা, ধানমন্ডি, বসুন্ধরা, মিরপুর, মহাখালী সহ সমগ্র ঢাকা সিটিতে সার্ভিস প্রদান করা হয়।",
      },
    ],
    status: "ACTIVE",
  },

  {
    slug: "commercial-office-cleaning",
    title: "COMMERCIAL OFFICE CLEANING (কমার্শিয়াল অফিস ক্লিনিং)",
    category: "OFFICE",
    badge: "B2B CORPORATE SOLUTIONS",
    price: "৳8,500 BDT",
    slaTime: "25 Mins SLA",
    heroImage: "/COMMERCIAL-OFFICE-CLEANING.png",
    contentImage: "https://framerusercontent.com/images/71kz5iX4crWQYqbcukrbVWogYA.png?width=600&height=400",
    shortDesc:
      "ঢাকার করপোরেট অফিস, আইটি হাব, ব্যাংক ও শোরুমের জন্য দৈনিক বা সাপ্তাহিক সাবস্ক্রিপশন ভিত্তিক হাইজিন স্যানিটাইজেশন।",
    introParagraph1:
      "একটি পরিচ্ছন্ন অফিস পরিবেশ কর্মচারীদের উৎপাদনশীলতা বাড়ায় এবং ক্লায়েন্টদের মনে ইতিবাচক প্রভাব তৈরি করে। Cleanix B2B সাবস্ক্রিপশন মডেলে ঢাকার করপোরেট প্রতিষ্ঠানগুলোর জন্য হাই-স্পেক কমার্শিয়াল ক্লিনিং সুবিধা প্রদান করে।",
    introParagraph2:
      "অফিস চলাকালীন কাজের যাতে কোনো ব্যাঘাত না ঘটে, সে জন্য আমরা নাইট শিফট এবং উইকেন্ড ব্যাক-টু-ব্যাক ডিপ স্যানিটাইজেশন প্রোগ্রাম পরিচালনা করি।",
    offersTitle: "WHAT WE OFFER (করপোরেট সেবা সমুহ)",
    offersDesc:
      "মতিঝিল, কারওয়ান বাজার, গুলশান ও বনানীর আধুনিক অফিসগুলোর জন্য স্পেশাল সার্ভিস এগ্রিমেন্ট (SLA) ভিত্তিক চুক্তি।",
    offers: [
      {
        iconName: "Building2",
        title: "Workstation & Keyboard Sanitizing",
        desc: "ডেস্ক, কিবোর্ড, মনিটর ও প্রিন্টার সারফেস জীবাণুমুক্ত স্প্রে দ্বারা নিখুঁত ওয়াশ।",
      },
      {
        iconName: "ShieldCheck",
        title: "Restroom & Pantry Deep Reset",
        desc: "অফিস বাথরুম টাইলস, পানির ফিটিংস ও প্যান্ট্রি স্পেসের হসপিটাল-গ্রেড ডিসইনফেকশন।",
      },
      {
        iconName: "Calendar",
        title: "Off-Hour & Weekend Shift Execution",
        desc: "অফিস সময় শেষের পর বা ছুটির দিনে কাস্টমাইজড শিফট বুকিংয়ের সুবিধা।",
      },
    ],
    whyChooseTitle: "WHY CHOOSE OUR COMMERCIAL CLEANING",
    whyChooseDesc:
      "Cleanix কমার্শিয়াল ক্লিনিং আপনার অফিসের কর্মপরিবেশ ফ্রেশ রাখে, স্টাফদের অসুস্থতাজনিত ছুটি কমায় এবং ব্র্যান্ড ভ্যালু বাড়ায়।",
    whyChoosePoints: [
      {
        title: "Custom B2B Monthly SLAs",
        desc: "৳14,000 বা ৳30,000 মান্থলি কর্পোরেট প্যাকেজে ফ্ল্যাট সাইজ অনুযায়ী কাস্টম চুক্তি।",
      },
      {
        title: "Confidentiality & Security Protocol",
        desc: "অফিস নথি ও ইকুইপমেন্টের নিরাপত্তা রক্ষায় বিশেষ প্রশিক্ষিত ইউনিফর্ম পরিহিত ক্লিনার।",
      },
      {
        title: "High-Touch Elevator & Door Sanitizing",
        desc: "লিফট বাটন, ডোর হ্যান্ডেল ও কনফারেন্স টেবিলের নিরবচ্ছিন্ন স্যানিটাইজেশন।",
      },
      {
        title: "Monthly Inspection & Audit Reports",
        desc: "প্রতি মাসে সুপারভাইজার দ্বারা সার্ভিস ইনসপেকশন ও বিস্তারিত কোয়ালিটি রিপোর্ট প্রদান।",
      },
    ],
    faqs: [
      {
        num: "01",
        question: "অফিস ছুটির পর রাতে ক্লিনিং করানো সম্ভব কি?",
        answer:
          "হ্যাঁ, আমাদের নাইট শিফট টিম রয়েছে যাতে অফিসের নিয়মিত কাজের কোনো ব্যাঘাত ছাড়াই সকালের আগেই সব ফ্রেশ হয়ে যায়।",
      },
      {
        num: "02",
        question: "কর্পোরেট বিলিং বা ডিজিটাল ইনভয়েস পাওয়া যাবে কি?",
        answer:
          "হ্যাঁ, আমরা প্রতিটি সার্ভিসের পর ইমেইল ও হোয়াটসঅ্যাপে ই-ইনভয়েস পাঠাই এবং ব্যাংক ট্রান্সফার বা SSLCommerz গ্রহণ করি।",
      },
      {
        num: "03",
        question: "টিম কি গোপনীয়তা ও সিকিউরিটি রুলস মেনে চলে?",
        answer:
          "আমাদের সকল ক্লিনার সিকিউরিটি ভেরিফাইড এবং কর্পোরেট এথিক্স মেনে চলায় শতভাগ প্রতিশ্রুতিবদ্ধ।",
      },
    ],
    status: "ACTIVE",
  },

  {
    slug: "post-construction-cleaning",
    title: "POST-CONSTRUCTION CLEANING (পোস্ট-কনস্ট্রাকশন ক্লিনিং)",
    category: "RENOVATION",
    badge: "CONSTRUCTION & BUILD",
    price: "৳6,000 BDT",
    slaTime: "35 Mins SLA",
    heroImage: "/POST-CONSTRUCTION CLEANING.png",
    contentImage: "https://framerusercontent.com/images/hykQu8sbeIwxfZ3UXUa3Ce7b47E.png?width=1880&height=750",
    shortDesc:
      "নতুন বিল্ডিং বা রেনোভেশনের পর জমে থাকা সিমেন্টের ধুলোবালি, রঙের দাগ ও সিভিল কেমিক্যাল দ্রুত পরিষ্কারের জন্য হেভি-ডিউটি স্পেস ক্লিনিং।",
    introParagraph1:
      "নতুন বাসা বা অফিসের সংস্কার কাজ শেষ হওয়ার পর চারদিকে রঙের ফোটা, সিমেন্ট ও ভারী ধুলোবালি জমে থাকে। সাধারণ ঝাড়ু বা মোছা দিয়ে এগুলো পরিষ্কার করা সম্ভব নয়। Cleanix-এর হেভি-ডিউটি টিম পোস্ট-কনস্ট্রাকশন স্থানকে করে তোলে শতভাগ হ্যান্ডওভার প্রস্তুত।",
    introParagraph2:
      "রিয়েল এস্টেট ডেভেলপার, ইন্টেরিয়র ডিজাইনার এবং বাসা মালিকদের জন্য আমাদের স্পেশালাইজড ভ্যাকুয়ামিং ও ফ্লোর বাফিং ট্রিটমেন্ট অত্যন্ত জনপ্রিয়।",
    offersTitle: "WHAT WE OFFER (হেভি-ডিউটি সেবাসমূহ)",
    offersDesc:
      "তিন ধাপে সম্পূর্ণ ক্লিনিং—রাফ ডাস্ট ক্লিয়ারেন্স, টাইলস অ্যান্ড উইন্ডো স্ক্রাবিং এবং ফাইনাল পলিশিং হ্যান্ডওভার।",
    offers: [
      {
        iconName: "Wrench",
        title: "HEPA Concrete & Fine Dust Vacuuming",
        desc: "হেভি-ডিউটি ভ্যাকুয়াম মেশিন দিয়ে দেয়াল ও মেঝের সুক্ষ্ম সিমেন্ট ধুলো অপসারণ।",
      },
      {
        iconName: "Sparkles",
        title: "Paint & Grout Residue Scrubbing",
        desc: "টাইলস ও গ্লাসের গা থেকে কেমিক্যাল দিয়ে রঙের দাগ ও কসমেটিক কাস্টম পলিশিং।",
      },
      {
        iconName: "ShieldCheck",
        title: "Instant Move-In Ready Polish",
        desc: "দরজা, উইন্ডো ফ্রেম ও ফ্লোর বাফিং শেষে সরাসরি বাসায় শিফট হওয়ার মতো পরিবেশ।",
      },
    ],
    whyChooseTitle: "WHY CHOOSE OUR POST-CONSTRUCTION CLEANING",
    whyChooseDesc:
      "নতুন টাইলস বা দামী ফিটিংস সাধারণ ক্ষতিকর কেমিক্যাল দিয়ে স্ক্রাব করলে দাগ পড়ে যেতে পারে। Cleanix ব্যবহার করে সারফেস-সেফ কেমিক্যালস।",
    whyChoosePoints: [
      {
        title: "Industrial Grade Scrubbers & Buffers",
        desc: "কমার্সিয়াল ওয়েট/ড্রাই ভ্যাকুয়াম এবং স্ক্রাবিং মেশিন ব্যবহারে দ্রুত ফলাফল।",
      },
      {
        title: "Safe Non-Acidic Stain Removers",
        desc: "মার্বেল ও সিরামিক টাইলসের কোনো ক্ষতি না করে রঙের জেদি দাগ দ্রবীভূতকরণ।",
      },
      {
        title: "Fast Turnaround Deadline Support",
        desc: "জরুরি ডেডলাইনের মধ্যে হ্যান্ডওভার দিতে দ্রুত টিম ডেসপ্যাচ সুবিধা।",
      },
      {
        title: "Interior Designer Approved Finish",
        desc: "অভিজাত ইন্টেরিয়র ডিজাইন প্রজেক্টের ফিনিশিং স্ট্যান্ডার্ড অনুযায়ী কোয়ালিটি নিশ্চয়তা।",
      },
    ],
    faqs: [
      {
        num: "01",
        question: "পোস্ট-কনস্ট্রাকশন ক্লিনিং কখন বুক করা উচিত?",
        answer:
          "বিল্ডিং বা বাসার সব ধরনের সিভিল, ইলেকট্রিক ও পেইন্টিং কাজ ১০০% শেষ হওয়ার পর বুক করাই সেরা।",
      },
      {
        num: "02",
        question: "টিম কি নির্মাণ সামগ্রীর ভারী ময়লা সরিয়ে দেবে?",
        answer:
          "হ্যাঁ, ধুলোবালি, মেঝের রঙের ফোটা, প্লাস্টিক প্যাকেট ও সূক্ষ্ম কণা সম্পূর্ণ পরিষ্কার করা হয়।",
      },
      {
        num: "03",
        question: "টাইলসের রঙের দাগ বা সিমেন্টের আস্তর উঠবে কি?",
        answer:
          "আমাদের সারফেস সেফ অর্গানিক স্ক্রাবার রঙের ফোঁটা ও সিমেন্টের সূক্ষ্ম আস্তর সহজেই তুলে ফেলে।",
      },
    ],
    status: "ACTIVE",
  },

  {
    slug: "move-out-cleaning",
    title: "MOVE-IN / MOVE-OUT CLEANING (মুভ-ইন / আউট ক্লিনিং)",
    category: "TURNOVER",
    badge: "RELOCATION & TURNOVER",
    price: "৳4,000 BDT",
    slaTime: "25 Mins SLA",
    heroImage: "/MOVE-OUT-CLEANING.png",
    contentImage: "https://framerusercontent.com/images/gRwXdPkLkyJS5JXnK04q3ttVLk.png?width=600&height=400",
    shortDesc:
      "নতুন বাসায় ওঠার আগে বা পুরোনো বাসা ছাড়ার সময় সম্পূর্ণ সিকিউরিটি ডিপোজিট রিফান্ড ও জীবাণুমুক্ত হ্যান্ডওভার সার্ভিস।",
    introParagraph1:
      "বাসা স্থানান্তর করা অত্যন্ত মানসিক চাপের বিষয়। নতুন বাসায় উঠার আগে পূর্বের বাসিন্দার জমে থাকা ময়লা ও জীবাণু দূর করা জরুরি। আবার বাসা ছাড়ার সময় বাড়িওয়ালার কাছে সিকিউরিটি ডিপোজিট ফেরত পেতে ঝকঝকে হ্যান্ডওভার দিতে হয়।",
    introParagraph2:
      "Cleanix মুভ-ইন/আউট সার্ভিসে খালি বাসার ক্যাবিনেটের ভেতর, ওভেন, কিচেন হুড ও বাথরুম নিখুঁতভাবে রিফ্রেশ করে দেয়।",
    offersTitle: "WHAT WE OFFER (স্থানান্তর বিশেষ সেবা)",
    offersDesc:
      "খালি ফ্ল্যাট ও কমার্শিয়াল স্পেসের জন্য ডিজাইনকৃত টপ-টু-বটম টার্নওভার ডিপ ক্লিনিং সার্ভিস।",
    offers: [
      {
        iconName: "Home",
        title: "Inside Cabinet & Drawer Deep Clean",
        desc: "খালি আলমারি, কিচেন ড্রয়ার ও ওয়্যারড্রবের ভেতরের জীবাণুমুক্ত ডাস্টিং।",
      },
      {
        iconName: "Sparkles",
        title: "Full Kitchen Hood & Bathroom Scrub",
        desc: "কিচেন চিমনি ও বাথরুম গ্রিজ, সাবানের দাগ দূর করে ফ্রেশ সুবাস নিশ্চিতকরণ।",
      },
      {
        iconName: "Clock",
        title: "Same-Day Emergency Booking Available",
        desc: "জরুরি স্থানান্তর প্রয়োজনে একই দিনে ক্লিনিং সার্ভিস সুবিধা।",
      },
    ],
    whyChooseTitle: "WHY CHOOSE OUR MOVE-OUT CLEANING",
    whyChooseDesc:
      "বাসা পরিবর্তনের ব্যস্ততায় পরিষ্কারের জন্য সময় বের করা কঠিন। Cleanix চাবিসমেত হ্যান্ডওভারের জন্য আপনার স্থানকে প্রস্তুত করে দেয়।",
    whyChoosePoints: [
      {
        title: "Full Security Deposit Back Assurance",
        desc: "বাড়িওয়ালার ইনসপেকশনে পাশ করার উপযোগী নিখুঁত ফিনিশিং স্ট্যান্ডার্ড।",
      },
      {
        title: "Deep Scrubbing of Unfurnished Spaces",
        desc: "ফার্নিচার বিহীন বাসার ফ্লোর, দেয়ালের ছোপ দাগ ও লাইট ফিটিংস ক্লিন।",
      },
      {
        title: "Kitchen Grease & Appliance Degreasing",
        desc: "চুলা, কিচেন হুড ও টাইলসের দীর্ঘদিনের তেল চিটচিটে দাগ দূরীকরণ।",
      },
      {
        title: "Video Walkthrough Proof of Work",
        desc: "কাজের আগে ও পরের ছবি/ভিডিও রেকর্ড ক্লায়েন্টকে ডিজিটাল ইমেইলে প্রদান।",
      },
    ],
    faqs: [
      {
        num: "01",
        question: "বাসার সব আসবাবপত্র সরানোর পর সার্ভিস নেওয়া ভালো কি?",
        answer:
          "হ্যাঁ, ফার্নিচার সরানোর পর খালি মেঝের সব কোণা ও ড্রয়ার সহজে ও নিখুঁতভাবে পরিষ্কার করা যায়।",
      },
      {
        num: "02",
        question: "লুকায়ে থাকা ময়লা বা দাগ দূর করার গ্যারান্টি আছে কি?",
        answer:
          "আমাদের ২৪-ঘণ্টা রি-ক্লিন সাপোর্ট রয়েছে। ইনসপেকশনে কোনো খামতি থাকলে তা সাথে সাথে সমাধান করা হয়।",
      },
      {
        num: "03",
        question: "পেমেন্ট কীভাবে করা যায়?",
        answer:
          "কাজ শেষে বিকাশ (bKash), নগদ (Nagad), অনলাইন কালেকশন বা ক্যাশে পেমেন্ট করতে পারবেন।",
      },
    ],
    status: "ACTIVE",
  },
];

export const servicesData: Record<string, ServiceDetail> = initialServicesList.reduce(
  (acc, item) => {
    acc[item.slug] = item;
    return acc;
  },
  {} as Record<string, ServiceDetail>
);

const STORAGE_KEY = "cleanix_services_catalog_v2";

export function getStoredServices(): ServiceDetail[] {
  if (typeof window === "undefined") return initialServicesList;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialServicesList));
      return initialServicesList;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load services from localStorage:", e);
    return initialServicesList;
  }
}

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  const all = getStoredServices();
  return all.find((s) => s.slug === slug);
}

export function saveServices(services: ServiceDetail[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    window.dispatchEvent(new Event("cleanix_services_updated"));
  } catch (e) {
    console.error("Failed to save services to localStorage:", e);
  }
}

export function addService(service: ServiceDetail): ServiceDetail[] {
  const current = getStoredServices();
  const updated = [service, ...current];
  saveServices(updated);
  return updated;
}

export function updateService(slug: string, fields: Partial<ServiceDetail>): ServiceDetail[] {
  const current = getStoredServices();
  const updated = current.map((item) => (item.slug === slug ? { ...item, ...fields } : item));
  saveServices(updated);
  return updated;
}

export function deleteService(slug: string): ServiceDetail[] {
  const current = getStoredServices();
  const updated = current.filter((item) => item.slug !== slug);
  saveServices(updated);
  return updated;
}
