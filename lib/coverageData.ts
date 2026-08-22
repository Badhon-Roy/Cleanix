"use client";

export interface CoverageAreaItem {
  id: string;
  area: string;
  tag: string;
  time: string;
  desc: string;
  btnLabel?: string;
  status: "ACTIVE" | "INACTIVE";
}

export const initialCoverageAreas: CoverageAreaItem[] = [
  {
    id: "COV-101",
    area: "Gulshan 1 & 2",
    tag: "VIP DUPLEX & EMBASSY",
    time: "25 Mins SLA",
    desc: "গুলশান ১ ও ২ এরিয়া এবং ডিপ্লোম্যাটিক এম্বাসি জোনের স্পেশাল সার্ভিস।",
    btnLabel: "Book in Gulshan",
    status: "ACTIVE",
  },
  {
    id: "COV-102",
    area: "Banani & DOHS",
    tag: "CORPORATE & TECH HUB",
    time: "25 Mins SLA",
    desc: "কর্পোরেট আইটি অফিস, স্টার্টআপ ও টেক হাবের নাইট শিফট স্যানিটাইজিং।",
    btnLabel: "Book in Banani",
    status: "ACTIVE",
  },
  {
    id: "COV-103",
    area: "Uttara (Sec 1-14)",
    tag: "RESIDENTIAL & TURNOVER",
    time: "30 Mins SLA",
    desc: "সেক্টর ১-১৪ এর রেসিডেন্সিয়াল অ্যাপার্টমেন্ট মুভ-ইন/মুভ-আউট সলিউশন।",
    btnLabel: "Book in Uttara",
    status: "ACTIVE",
  },
  {
    id: "COV-104",
    area: "Dhanmondi & Lalmatia",
    tag: "RESIDENTIAL & MEDICAL",
    time: "30 Mins SLA",
    desc: "ধানমন্ডি ও লালমাটিয়া এলাকার ডুপ্লেক্স ও রেনোভেশন ক্লিনিং কেয়ার।",
    btnLabel: "Book in Dhanmondi",
    status: "ACTIVE",
  },
  {
    id: "COV-105",
    area: "Bashundhara R/A",
    tag: "LUXURY CONDO & VILLA",
    time: "30 Mins SLA",
    desc: "বসুন্ধরা আর/এ এর লাক্সারি কন্ডো ও প্রাইভেট ভিলার প্রিমিয়াম কেয়ার।",
    btnLabel: "Book in Bashundhara",
    status: "ACTIVE",
  },
  {
    id: "COV-106",
    area: "Mohammadpur & Adabor",
    tag: "RESIDENTIAL & HOUSING",
    time: "30 Mins SLA",
    desc: "মোহাম্মদপুর ও আদাবর হাউজিং এলাকার রুটিন হোম কেয়ার ও ভ্যাকুয়াম।",
    btnLabel: "Book in Mohammadpur",
    status: "ACTIVE",
  },
  {
    id: "COV-107",
    area: "Badda & Rampura",
    tag: "COMMERCIAL & RESIDENTIAL",
    time: "25 Mins SLA",
    desc: "বাড্ডা, রামপুরা ও প্রগতি সরণি কমার্শিয়াল ফ্লোর ও হোম স্যানিটাইজ।",
    btnLabel: "Book in Badda",
    status: "ACTIVE",
  },
  {
    id: "COV-108",
    area: "Motijheel & Dilkusha",
    tag: "FINANCIAL & BANKING",
    time: "35 Mins SLA",
    desc: "মতিঝিল ও দিলকুশা ব্যাংকিং অ্যান্ড ফাইন্যান্সিয়াল অফ-আওয়ার্স কেয়ার।",
    btnLabel: "Book in Motijheel",
    status: "ACTIVE",
  },
  {
    id: "COV-109",
    area: "Mirpur & Pallabi",
    tag: "HIGH DENSITY HOUSING",
    time: "35 Mins SLA",
    desc: "মিরপুর ও পল্লবী কলোনি ও অ্যাপার্টমেন্টের দ্রুত সার্ভিস ডেলিভারি।",
    btnLabel: "Book in Mirpur",
    status: "ACTIVE",
  },
  {
    id: "COV-110",
    area: "Mohakhali & Tejgaon",
    tag: "SHOWROOM & COMMERCIAL",
    time: "25 Mins SLA",
    desc: "মহাখালী ও তেজগাঁও শোরুম গ্লাস ও ফ্লোর হ্যাভি-ডিউটি পলিশ সার্ভিস।",
    btnLabel: "Book in Mohakhali",
    status: "ACTIVE",
  },
];

const STORAGE_KEY = "cleanix_coverage_areas_v2";

export function getStoredCoverageAreas(): CoverageAreaItem[] {
  if (typeof window === "undefined") return initialCoverageAreas;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCoverageAreas));
      return initialCoverageAreas;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load coverage areas from localStorage:", e);
    return initialCoverageAreas;
  }
}

export function saveCoverageAreas(areas: CoverageAreaItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(areas));
    window.dispatchEvent(new Event("cleanix_coverage_areas_updated"));
  } catch (e) {
    console.error("Failed to save coverage areas to localStorage:", e);
  }
}

export function addCoverageArea(item: Omit<CoverageAreaItem, "id">): CoverageAreaItem {
  const current = getStoredCoverageAreas();
  const newItem: CoverageAreaItem = {
    ...item,
    id: `COV-${101 + current.length}`,
  };
  const updated = [...current, newItem];
  saveCoverageAreas(updated);
  return newItem;
}

export function updateCoverageArea(id: string, updatedFields: Partial<CoverageAreaItem>): CoverageAreaItem[] {
  const current = getStoredCoverageAreas();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
  saveCoverageAreas(updated);
  return updated;
}

export function deleteCoverageArea(id: string): CoverageAreaItem[] {
  const current = getStoredCoverageAreas();
  const updated = current.filter((item) => item.id !== id);
  saveCoverageAreas(updated);
  return updated;
}
