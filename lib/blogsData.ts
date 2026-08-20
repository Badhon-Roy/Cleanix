export interface BlogDetail {
  slug: string;
  title: string;
  category: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  shortDesc: string;
  introParagraph: string;
  sections: {
    title: string;
    paragraphs: string[];
  }[];
}

export const blogsData: Record<string, BlogDetail> = {
  "how-regular-cleaning-improves-comfort": {
    slug: "how-regular-cleaning-improves-comfort",
    title: "How Regular Cleaning Improves Comfort",
    category: "HOME HYGIENE",
    date: "MAY 2, 2025",
    author: {
      name: "Cleanix Editorial Team",
      avatar: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=342&height=292",
    },
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    shortDesc:
      "Discover how a routine cleaning schedule removes allergens, reduces visual stress, and creates a peaceful living environment.",
    introParagraph:
      "A clean home or workplace changes how a space feels the moment someone walks in. Regular cleaning removes dust, odors, clutter, and surface buildup before they become harmful, helping rooms feel calmer, brighter, and easier to use every day.",
    sections: [
      {
        title: "Cleaner Air and Easier Breathing",
        paragraphs: [
          "Dust, pet hair, pollen, and small particles settle quickly on floors, shelves, upholstery, vents, and corners. When cleaning happens on a routine schedule, those irritants are removed before they circulate through the room or collect on surfaces people touch often.",
          "This is especially helpful for families, office teams, and rental properties where many people share the same space. Consistent vacuuming, mopping, wiping, and sanitizing can make the environment feel fresher without needing a major deep clean every week.",
        ],
      },
      {
        title: "Less Visual Stress",
        paragraphs: [
          "Comfort is not only about hygiene; it is also about how organized and manageable a room feels. Clear counters, tidy floors, polished fixtures, and dust-free surfaces create a sense of order that makes it easier to relax at home or focus at work.",
          "Regular cleaning also prevents small messes from turning into bigger jobs. Grease in the kitchen, soap residue in bathrooms, and dust along baseboards are much easier to manage when they are handled consistently.",
        ],
      },
      {
        title: "A Better Routine for Everyday Living",
        paragraphs: [
          "For many clients, the biggest benefit is peace of mind. A regular cleaning schedule means the most used rooms stay guest-ready, high-touch points are sanitized, and the space feels maintained instead of neglected. That comfort builds over time and makes the property easier to enjoy.",
        ],
      },
    ],
  },

  "top-10-ways-to-keep-offices-fresh": {
    slug: "top-10-ways-to-keep-offices-fresh",
    title: "Top 10 Ways to Keep Offices Fresh",
    category: "OFFICE WELLNESS",
    date: "MAY 2, 2025",
    author: {
      name: "Cleanix Editorial Team",
      avatar: "https://framerusercontent.com/images/71kz5iX4crWQYqbcukrbVWogYA.png?width=342&height=292",
    },
    image: "https://framerusercontent.com/images/2xPMy5ZILkyS0vKBXtkUtkotq4.png?width=536&height=491",
    shortDesc:
      "Maintain high employee productivity and hygiene with these ten corporate cleaning strategies for high-density office floors.",
    introParagraph:
      "An office environment directly impacts staff productivity, health, and corporate brand reputation. Implementing daily and weekly cleaning routines keeps communal areas, workstations, and meeting rooms pristine.",
    sections: [
      {
        title: "High-Touch Surface Sanitization",
        paragraphs: [
          "Keyboards, mice, elevator buttons, door handles, and printer touchscreens harbor millions of bacteria daily. Daily alcohol-based wipes drastically cut down flu transmission.",
          "Desk organization protocols ensure cleaners can thoroughly wipe down surface tops without mishandling confidential office documents.",
        ],
      },
      {
        title: "Restroom & Pantry Deep Reset",
        paragraphs: [
          "Coffee station spills and pantry microwaves require midday sanitization. Fresh air diffusers and automatic soap dispensers keep employee restrooms inviting.",
        ],
      },
    ],
  },

  "top-10-cleaning-tips-for-busy-spaces": {
    slug: "top-10-cleaning-tips-for-busy-spaces",
    title: "Top 10 Cleaning Tips for Busy Spaces",
    category: "EXPRESS CLEANING",
    date: "MAY 2, 2025",
    author: {
      name: "Cleanix Editorial Team",
      avatar: "https://framerusercontent.com/images/gRwXdPkLkyjS5JXnK04q3ttVLk.png?width=342&height=292",
    },
    image: "https://framerusercontent.com/images/FoR4cz0nZxw4SE4IdXGcBqFVo.png?width=536&height=491",
    shortDesc:
      "Fast, effective cleaning hacks for high-traffic commercial venues, retail showrooms, and active households.",
    introParagraph:
      "High-traffic spaces accumulate dirt rapidly. Smart prioritization and microfiber technology allow cleaning teams to maintain spotless standards in record time.",
    sections: [
      {
        title: "The Top-Down Cleaning Method",
        paragraphs: [
          "Always start cleaning high shelves, light fixtures, and ceiling fans first before vacuuming floors. Gravity brings falling dust downward onto surfaces you haven't cleaned yet.",
          "Using HEPA-filtered commercial vacuums traps micro-particles rather than blowing them back into indoor air.",
        ],
      },
      {
        title: "Microfiber Color Coding",
        paragraphs: [
          "Assign specific cloth colors for bathrooms, kitchens, and glass surfaces to eliminate cross-contamination risks entirely.",
        ],
      },
    ],
  },

  "post-renovation-cleaning-guide-2026": {
    slug: "post-renovation-cleaning-guide-2026",
    title: "Complete Guide to Post-Renovation Cleanup",
    category: "RENOVATION",
    date: "APRIL 18, 2026",
    author: {
      name: "Cleanix Editorial Team",
      avatar: "https://framerusercontent.com/images/P64qFbW7sjXKqLCWX5Fd9KuqA.png?width=347&height=292",
    },
    image: "https://framerusercontent.com/images/rkv30jJZdslMW9PEgMFVtHvybU.png?width=536&height=491",
    shortDesc:
      "How to tackle heavy drywall dust, grout haze, and paint splatters safely after home or office construction.",
    introParagraph:
      "Renovation projects leave behind fine silica dust that settles inside vents, electrical sockets, and cabinet hinges. Professional post-construction cleanup requires a structured multi-pass procedure.",
    sections: [
      {
        title: "HEPA Extraction & Chemical Degreasing",
        paragraphs: [
          "Standard home vacuums clog instantly when exposed to concrete powder. Commercial wet/dry HEPA vacuuming must precede all wet mopping.",
          "Non-acidic chemical cleaners dissolve grout haze from marble and porcelain tiles without causing surface etching.",
        ],
      },
    ],
  },

  "move-out-cleaning-checklist-for-tenants": {
    slug: "move-out-cleaning-checklist-for-tenants",
    title: "Move-Out Cleaning Checklist for Full Deposit Refund",
    category: "RELOCATION",
    date: "MARCH 25, 2026",
    author: {
      name: "Cleanix Editorial Team",
      avatar: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=342&height=292",
    },
    image: "https://framerusercontent.com/images/VPbp0YEDNhSD4N9sL93WPqjBM2o.png?width=536&height=491",
    shortDesc:
      "Ensure your landlord approves your handover inspection with our tenant turnover deep clean checklist.",
    introParagraph:
      "Getting 100% of your security deposit returned requires meeting strict landlord move-out checklists. Empty property cleaning focuses on overlooked details like oven interiors and light fixture covers.",
    sections: [
      {
        title: "The Unfurnished Deep Scrub Protocol",
        paragraphs: [
          "Once furniture is removed, pay special attention to wall scuffs, baseboard grime, inside wardrobe shelves, and limescale buildup on bathroom glass.",
        ],
      },
    ],
  },

  "eco-friendly-sanitization-techniques": {
    slug: "eco-friendly-sanitization-techniques",
    title: "Eco-Friendly Sanitization & Safe Household Cleaners",
    category: "GREEN CLEANING",
    date: "FEBRUARY 10, 2026",
    author: {
      name: "Cleanix Editorial Team",
      avatar: "https://framerusercontent.com/images/71kz5iX4crWQYqbcukrbVWogYA.png?width=342&height=292",
    },
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80",
    shortDesc:
      "Protect your children and pets with non-toxic, plant-based disinfectant solutions that kill 99.9% of bacteria.",
    introParagraph:
      "Chemical-heavy bleach products can release toxic VOC fumes into closed indoor spaces. Modern eco-friendly sanitizers use hydrogen peroxide and botanical extracts to achieve hospital-grade hygiene safely.",
    sections: [
      {
        title: "Plant-Based Disinfection Power",
        paragraphs: [
          "Biodegradable formulas break down naturally without leaving chemical residue on kitchen countertops or floor surfaces where children play.",
        ],
      },
    ],
  },
};
