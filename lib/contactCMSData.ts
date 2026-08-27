"use client";

export interface ContactCMSContent {
  // Section 1: Hero Banner Settings
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroImage: string;

  // Section 2: Contact Form Section Settings
  formBadge: string;
  formTitleLine1: string;
  formTitleLine2: string;
  formTitleHighlight: string;
  formTitleLine3: string;
  formCleanerImage: string;

  // Section 3: Bottom Info Cards Settings
  locationTitle: string;
  locationText: string;
  supportTitle: string;
  supportText: string;
  hoursTitle: string;
  hoursText: string;
}

export const defaultContactCMSData: ContactCMSContent = {
  heroBadge: "24/7 CUSTOMER SUPPORT & QUOTE REQUEST",
  heroTitleLine1: "GET IN TOUCH WITH",
  heroTitleHighlight: "OUR TEAM",
  heroSubtitle:
    "আপনার বাসা বা কর্পোরেট স্পেস পরিষ্কারের জন্য যেকোনো প্রশ্ন, ফ্রি কোটেশন বা ইনস্ট্যান্ট শিডিউল বুকিংয়ের জন্য আমাদের এক্সপার্ট টিমের সাথে যোগাযোগ করুন।",
  heroImage:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",

  formBadge: "CONTACT REQUEST",
  formTitleLine1: "READY TO SHIP",
  formTitleLine2: "SMARTER",
  formTitleHighlight: "CONTACT",
  formTitleLine3: "OUR TEAM",
  formCleanerImage:
    "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630",

  locationTitle: "Location",
  locationText: "House 42, Road 11, Block D, Gulshan 2\nDhaka-1212, Bangladesh",
  supportTitle: "Support Clients",
  supportText: "+880 1774-500815\n+880 1894-654254",
  hoursTitle: "Opening Hours",
  hoursText: "Saturday - Thursday\n09 : 00 AM - 10 : 30 PM",
};
