export interface ProjectDetail {
  slug: string;
  title: string;
  category: string;
  heroImage: string;
  benefitImage: string;
  client: string;
  categoryFull: string;
  startDate: string;
  endDate: string;
  projectValue: string;
  introParagraph: string;
  section2Title: string;
  section2Paragraph: string;
  benefitsTitle: string;
  benefitsPoints: string[];
  section4Title: string;
  section4Paragraph: string;
}

export const projectsData: Record<string, ProjectDetail> = {
  "residential-deep-cleaning": {
    slug: "residential-deep-cleaning",
    title: "RENTAL DEEP CLEAN COMPLETED FOR A TURNOVER-READY UNIT",
    category: "RESIDENTIAL",
    heroImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    benefitImage: "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630",
    client: "Rental Deep Clean",
    categoryFull: "Rental Turnover / Deep Cleaning",
    startDate: "05 February, 2026",
    endDate: "07 February, 2026",
    projectValue: "$1,250.00",
    introParagraph:
      "Rental Deep Clean was completed for a property manager preparing a two-bedroom rental for new tenants. The project focused on kitchen buildup, bathroom detail, cabinet interiors, floors, baseboards, and high-touch surfaces so the unit could be photographed, inspected, and handed over without delay.",
    section2Title: "A FRESH RESET BETWEEN TENANTS",
    section2Paragraph:
      "The cleaning plan was built around a tight turnover window. After the previous tenant moved out, our team completed a full top-to-bottom clean, removed visible residue from heavy-use areas, refreshed the bathroom and kitchen, and completed a final walkthrough with the property manager.",
    benefitsTitle: "PROJECT BENEFITS",
    benefitsPoints: [
      "Full Rental Turnover Cleaning",
      "Kitchen & Appliance Detail",
      "Bathroom Sanitizing",
      "Cabinet & Closet Wipe-Down",
      "Floor & Baseboard Refresh",
      "Final Walkthrough Support",
    ],
    section4Title: "A RENTAL UNIT READY FOR THE NEXT MOVE-IN",
    section4Paragraph:
      "The completed unit looked fresh, neutral, and move-in ready. The property manager was able to move forward with listing photos and tenant handover the same week.",
  },

  "commercial-office-cleaning": {
    slug: "commercial-office-cleaning",
    title: "BANANI CORPORATE TECH HQ FULL FLOOR SANITIZATION",
    category: "COMMERCIAL",
    heroImage: "https://framerusercontent.com/images/2xPMy5ZILkyS0vKBXtkUtkotq4.png?width=536&height=491",
    benefitImage: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80",
    client: "TechVision Bangladesh",
    categoryFull: "Corporate Office / Sanitization",
    startDate: "12 January, 2026",
    endDate: "15 January, 2026",
    projectValue: "$3,400.00",
    introParagraph:
      "Full floor deep sanitization and workstation hygiene refresh completed for a 12,000 sq ft corporate office in Banani. The project targeted high-touch surfaces, conference rooms, carpets, and executive restrooms during weekend off-hours.",
    section2Title: "ZERO DISRUPTION TO DAILY WORKFLOW",
    section2Paragraph:
      "Our uniformed night-shift team operated with hospital-grade disinfectant fogging and silent vacuuming. Monitors, keyboards, and pantry equipment were micro-cleaned without disturbing confidential desk files.",
    benefitsTitle: "PROJECT BENEFITS",
    benefitsPoints: [
      "HEPA Filtration Carpet Vacuuming",
      "High-Touch Surface Disinfection",
      "Restroom & Pantry Deep Reset",
      "Weekend Night Shift Execution",
      "Certified Eco Disinfectants",
      "Supervisor Hygiene Audit Report",
    ],
    section4Title: "HYGIENIC & PRODUCTIVE WORKSPACE RESULT",
    section4Paragraph:
      "The client reported 100% staff satisfaction on Monday morning with zero operational downtime and fresh indoor air quality.",
  },

  "post-construction-cleaning": {
    slug: "post-construction-cleaning",
    title: "DHANMONDI LUXURY APARTMENT COMPLEX POST-RENOVATION CLEANUP",
    category: "RENOVATION",
    heroImage: "https://framerusercontent.com/images/rkv30jJZdslMW9PEgMFVtHvybU.png?width=536&height=491",
    benefitImage: "https://framerusercontent.com/images/P64qFbW7sjXKqLCWX5Fd9KuqA.png?width=600&height=400",
    client: "Apex Real Estate Ltd",
    categoryFull: "Post-Construction / Renovation",
    startDate: "20 June, 2026",
    endDate: "24 June, 2026",
    projectValue: "$2,850.00",
    introParagraph:
      "Heavy-duty post-renovation cleanup for an 8,500 sq ft luxury multi-story residential building. Our team cleared drywall dust, paint drops, and construction adhesives from marble floors and glass windows.",
    section2Title: "INDUSTRIAL POWER & SCRUBBING CARE",
    section2Paragraph:
      "Utilizing industrial wet/dry HEPA vacuums and specialized tile cleaners, our crew eliminated stubborn grout haze without scratching high-end imported bath fixtures.",
    benefitsTitle: "PROJECT BENEFITS",
    benefitsPoints: [
      "Heavy Cement & Dust Extraction",
      "Paint & Grout Residue Scrubbing",
      "Marble Floor Buffer & Polish",
      "Window Frame & Glass Detailing",
      "Debris & Package Disposal",
      "Client Handover Inspection Ready",
    ],
    section4Title: "SPOTLESS HANDOVER READY FOR LANDLORD",
    section4Paragraph:
      "The building passed final interior designer inspection flawlessly, enabling immediate key handover to luxury buyers.",
  },

  "move-out-cleaning": {
    slug: "move-out-cleaning",
    title: "UTTARA SECTOR 7 TURNOVER CLEANING FOR DEPOSIT GUARANTEE",
    category: "TURNOVER",
    heroImage: "https://framerusercontent.com/images/VPbp0YEDNhSD4N9sL93WPqjBM2o.png?width=536&height=491",
    benefitImage: "https://framerusercontent.com/images/gRwXdPkLkyjS5JXnK04q3ttVLk.png?width=600&height=400",
    client: "Expat Relocation Client",
    categoryFull: "Move-Out / Tenant Turnover",
    startDate: "01 August, 2026",
    endDate: "02 August, 2026",
    projectValue: "$980.00",
    introParagraph:
      "Express move-out turnover deep clean for a vacant 2,800 sq ft apartment in Uttara. The client needed a flawless inspection to secure their full security deposit refund from the landlord.",
    section2Title: "TIME-CRITICAL SAME DAY TURNOVER",
    section2Paragraph:
      "Our 4-person specialist team cleaned inside kitchen cabinets, scrubbed oven interiors, removed wall scuffs, and sanitized all window tracks within 6 hours.",
    benefitsTitle: "PROJECT BENEFITS",
    benefitsPoints: [
      "100% Security Deposit Return",
      "Inside Cabinet & Oven Scrub",
      "Full Bathroom Limescale Removal",
      "Wall Scuff & Mark Cleaning",
      "Same-Day Rapid Turnover",
      "Digital Video Walkthrough",
    ],
    section4Title: "FULL SECURITY DEPOSIT REFUNDED",
    section4Paragraph:
      "The landlord approved the final walkthrough condition instantly and returned the full security deposit on the spot.",
  },
};
