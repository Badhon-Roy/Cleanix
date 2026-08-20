export interface ServiceDetail {
  slug: string;
  title: string;
  category: string;
  badge: string;
  heroImage: string;
  contentImage: string;
  shortDesc: string;
  introParagraph1: string;
  introParagraph2: string;
  offersTitle: string;
  offersDesc: string;
  offers: {
    iconName: string;
    title: string;
    desc: string;
  }[];
  whyChooseTitle: string;
  whyChooseDesc: string;
  whyChoosePoints: {
    title: string;
    desc: string;
  }[];
  faqs: {
    num: string;
    question: string;
    answer: string;
  }[];
}

export const servicesData: Record<string, ServiceDetail> = {
  "residential-deep-cleaning": {
    slug: "residential-deep-cleaning",
    title: "RESIDENTIAL DEEP CLEANING",
    category: "HOME CARE",
    badge: "B2C HOME CLEANING",
    heroImage: "/RESIDENTIAL-DEEP-CLEANING.png",
    contentImage: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
    shortDesc:
      "Comprehensive room-by-room deep cleaning and sanitization for houses, apartments, and luxury villas.",
    introParagraph1:
      "Our residential deep cleaning service is designed for homes that need more than a standard tidy up. We clean kitchens, bathrooms, bedrooms, living areas, baseboards, fixtures, and high-touch surfaces with a detailed checklist built around your home.",
    introParagraph2:
      "Whether you are preparing for guests, resetting after a busy season, or catching up on hard-to-reach areas, our trained cleaners arrive with the right supplies, protect your surfaces, and complete a final walkthrough before leaving.",
    offersTitle: "WHAT WE OFFER",
    offersDesc:
      "We provide flexible deep cleaning for apartments, family homes, and townhouses that need careful attention without disrupting daily life. Every visit is planned around your room priorities, surface types, and preferred schedule.",
    offers: [
      {
        iconName: "Sparkles",
        title: "Detailed Room Cleaning",
        desc: "Bedrooms, living areas, baseboards, surfaces, mirrors, and high touch points cleaned with care.",
      },
      {
        iconName: "Utensils",
        title: "Kitchen & Bath Reset",
        desc: "Grease, sinks, fixtures, counters, showers, tubs, and toilets cleaned for a fresher home.",
      },
      {
        iconName: "Clock",
        title: "Flexible Scheduling",
        desc: "One-time deep cleans, seasonal refreshes, and recurring add-ons scheduled around your routine.",
      },
    ],
    whyChooseTitle: "WHY CHOOSE OUR RESIDENTIAL DEEP CLEANING",
    whyChooseDesc:
      "Residential deep cleaning is ideal when your home needs a full reset, detailed dust removal, bathroom and kitchen sanitizing, and careful cleaning of corners that regular weekly service can miss.",
    whyChoosePoints: [
      {
        title: "Room-By-Room Checklist",
        desc: "Every bedroom, bathroom, kitchen, and common area follows a clear cleaning plan.",
      },
      {
        title: "Kitchen & Bath Detail",
        desc: "Grease, soap residue, fixtures, mirrors, sinks, and high-touch points receive focused care.",
      },
      {
        title: "Trained Home Cleaners",
        desc: "Friendly professionals arrive prepared, work carefully, and respect your space.",
      },
      {
        title: "Fresh Home Finish",
        desc: "We complete a walkthrough so the final result feels clean, reset, and guest-ready.",
      },
    ],
    faqs: [
      {
        num: "01",
        question: "How long does a residential deep clean take?",
        answer:
          "Most homes take between three and six hours depending on size, condition, and selected add-ons. We confirm timing before the shift.",
      },
      {
        num: "02",
        question: "Do I need to provide cleaning supplies?",
        answer:
          "No, our verified cleaning professionals arrive equipped with hospital-grade, eco-friendly supplies and specialized tools.",
      },
      {
        num: "03",
        question: "What areas are included in deep cleaning?",
        answer:
          "All bedrooms, bathrooms, living rooms, kitchen surfaces, cabinets exterior, appliances exterior, baseboards, and high-touch light switches.",
      },
    ],
  },

  "commercial-office-cleaning": {
    slug: "commercial-office-cleaning",
    title: "COMMERCIAL OFFICE CLEANING",
    category: "OFFICE",
    badge: "B2B CORPORATE SOLUTIONS",
    heroImage: "/COMMERCIAL-OFFICE-CLEANING.png",
    contentImage: "https://framerusercontent.com/images/71kz5iX4crWQYqbcukrbVWogYA.png?width=600&height=400",
    shortDesc:
      "Tailored daily and weekly sanitization programs for corporate offices, retail spaces, and commercial buildings.",
    introParagraph1:
      "Our commercial office cleaning service maintains a healthy, hygienic, and professional work environment for your employees and visiting clients. We focus on high-touch office areas, workstations, conference rooms, and restrooms.",
    introParagraph2:
      "We offer after-hours and weekend cleaning shifts so your corporate operations run smoothly without any noise or workflow interruptions.",
    offersTitle: "WHAT WE OFFER",
    offersDesc:
      "Dedicated commercial cleaning contracts engineered for modern office spaces, tech hubs, financial institutions, and retail outlets in Dhaka.",
    offers: [
      {
        iconName: "Building2",
        title: "Workstation Sanitizing",
        desc: "Desks, keyboards, monitors, and shared office equipment disinfected thoroughly.",
      },
      {
        iconName: "ShieldCheck",
        title: "Restroom Hygiene",
        desc: "Hospital-grade sanitization for restrooms, sinks, soap dispensers, and door handles.",
      },
      {
        iconName: "Calendar",
        title: "Flexible Shift Hours",
        desc: "Night shifts, early morning cleaning, or weekend contracts to fit your office hours.",
      },
    ],
    whyChooseTitle: "WHY CHOOSE OUR COMMERCIAL CLEANING",
    whyChooseDesc:
      "A clean office boosts employee productivity, reduces sick leaves, and creates a stellar first impression for visiting corporate stakeholders.",
    whyChoosePoints: [
      {
        title: "Customized SLAs",
        desc: "Service agreements tailored to your office floor area and staff headcounts.",
      },
      {
        title: "Vetted & Uniformed Staff",
        desc: "Background-checked cleaners trained in office confidentiality and security protocol.",
      },
      {
        title: "High-Touch Point Focus",
        desc: "Elevators, door handles, handrails, and pantry areas sanitized continuously.",
      },
      {
        title: "Monthly Hygiene Audits",
        desc: "Quality supervisors conduct regular site inspections to ensure standards.",
      },
    ],
    faqs: [
      {
        num: "01",
        question: "Can cleaning be done after business hours?",
        answer:
          "Yes! We offer flexible night and weekend shifts so your workplace is completely clean before your team arrives in the morning.",
      },
      {
        num: "02",
        question: "Are your cleaners background checked?",
        answer:
          "Yes, 100% of Cleanix field personnel undergo criminal background checks and NID verification before deployment.",
      },
      {
        num: "03",
        question: "Do you offer recurring corporate contracts?",
        answer:
          "We offer daily, bi-weekly, and monthly recurring corporate contracts with customized billing options.",
      },
    ],
  },

  "post-construction-cleaning": {
    slug: "post-construction-cleaning",
    title: "POST-CONSTRUCTION CLEANING",
    category: "RENOVATION",
    badge: "CONSTRUCTION & BUILD",
    heroImage: "https://framerusercontent.com/images/P64qFbW7sjXKqLCWX5Fd9KuqA.png?width=600&height=400",
    contentImage: "https://framerusercontent.com/images/hykQu8sbeIwxfZ3UXUa3Ce7b47E.png?width=1880&height=750",
    shortDesc:
      "Heavy-duty dust, paint splatter, and construction debris removal for newly built or renovated properties.",
    introParagraph1:
      "Newly constructed or renovated spaces leave behind heavy cement dust, paint splatters, sawdust, and residue. Our post-construction cleaning team uses heavy-duty vacuums and specialized scrubbers to transform raw sites into move-in ready spaces.",
    introParagraph2:
      "We work with real estate developers, interior designers, contractors, and homeowners to ensure every inch of tile, window, and fixture shines.",
    offersTitle: "WHAT WE OFFER",
    offersDesc:
      "Three-phase post-construction cleanup including rough clean, light clean, and final touch-up polish for pristine handover.",
    offers: [
      {
        iconName: "Wrench",
        title: "Dust & Fine Particles Removal",
        desc: "HEPA filtration vacuums suck fine drywall and concrete dust from all cracks.",
      },
      {
        iconName: "Sparkles",
        title: "Paint & Glue Scrubbing",
        desc: "Careful removal of paint drops, grout residue, and sticker labels from glass and tiles.",
      },
      {
        iconName: "ShieldCheck",
        title: "Final Handover Polish",
        desc: "Sanitizing all fixtures, door frames, and floors for immediate client handover.",
      },
    ],
    whyChooseTitle: "WHY CHOOSE OUR POST-CONSTRUCTION CLEANING",
    whyChooseDesc:
      "Standard cleaning methods cannot tackle toxic fine construction dust and adhesive residues. We bring commercial power equipment.",
    whyChoosePoints: [
      {
        title: "Industrial Grade Equipment",
        desc: "Commercial wet/dry HEPA vacuums, floor buffers, and glass scraper tools.",
      },
      {
        title: "Safety First Protocol",
        desc: "Cleaners equipped with PPE, masks, and eye protection for hazardous dust handling.",
      },
      {
        title: "Fast Turnaround Time",
        desc: "Rapid deployment teams to meet tight property handover deadlines.",
      },
      {
        title: "Surface Protection Care",
        desc: "Specialized non-abrasive chemicals that clean without scratching expensive marble or glass.",
      },
    ],
    faqs: [
      {
        num: "01",
        question: "When should post-construction cleaning be scheduled?",
        answer:
          "Ideally after all construction, electric, and plumbing work is 100% completed and workers have vacated the site.",
      },
      {
        num: "02",
        question: "Does it include trash and heavy debris removal?",
        answer:
          "Yes, we remove leftover drywall pieces, cardboard, packaging materials, and fine dust.",
      },
      {
        num: "03",
        question: "Will cement and grout stains be completely removed?",
        answer:
          "We use specialized acidic tiles cleaners that dissolve dried grout, cement haze, and paint drops without damaging your tiles.",
      },
    ],
  },

  "move-out-cleaning": {
    slug: "move-out-cleaning",
    title: "MOVE-OUT CLEANING",
    category: "TURNOVER",
    badge: "RELOCATION & TURNOVER",
    heroImage: "/SANITIZATION-DISINFECTION.png",
    contentImage: "https://framerusercontent.com/images/gRwXdPkLkyjS5JXnK04q3ttVLk.png?width=600&height=400",
    shortDesc:
      "Deep turnover cleaning for tenants, landlords, and property managers ensuring full security deposit refunds.",
    introParagraph1:
      "Moving out of an apartment or house is stressful. Our move-out cleaning service guarantees a spotless handover so you can get your security deposit back or prepare your property for new tenants quickly.",
    introParagraph2:
      "We scrub inside empty kitchen cabinets, clean oven interiors, sanitize bathrooms top-to-bottom, and leave the property smelling fresh.",
    offersTitle: "WHAT WE OFFER",
    offersDesc:
      "Top-to-bottom turnover deep cleaning designed specifically for vacant residential and commercial rental properties.",
    offers: [
      {
        iconName: "Home",
        title: "Inside Cabinet & Appliance Clean",
        desc: "Deep cleaning inside empty wardrobes, kitchen drawers, and refrigerator shelves.",
      },
      {
        iconName: "Sparkles",
        title: "Full Bathroom Scrub",
        desc: "Limescale removal from tiles, taps, mirrors, and deep toilet bowl sanitization.",
      },
      {
        iconName: "Clock",
        title: "Same-Day Rapid Service",
        desc: "Urgent booking availability for last-minute relocation deadlines.",
      },
    ],
    whyChooseTitle: "WHY CHOOSE OUR MOVE-OUT CLEANING",
    whyChooseDesc:
      "Property managers and landlords have strict move-out standards. We ensure your rental property passes inspection with flying colors.",
    whyChoosePoints: [
      {
        title: "Deposit Back Guarantee",
        desc: "Cleaning standards aligned with landlord and property manager handover checklists.",
      },
      {
        title: "Complete Empty Space Detail",
        desc: "Corners, light fixtures, vents, and inside closets cleaned impeccably.",
      },
      {
        title: "Grease & Stain Dissolution",
        desc: "Heavy degreasing for kitchen hoods, stoves, and tiles.",
      },
      {
        title: "Key Handover Ready",
        desc: "Final walkthrough video shared so you can hand over keys stress-free.",
      },
    ],
    faqs: [
      {
        num: "01",
        question: "Does the property need to be completely empty?",
        answer:
          "Yes, for best results, all personal belongings and furniture should be removed before the move-out cleaning begins.",
      },
      {
        num: "02",
        question: "Is electricity and running water required?",
        answer:
          "Yes, our cleaning equipment and scrubbing tools require functional running water and electricity at the premises.",
      },
      {
        num: "03",
        question: "What if the landlord finds something missed?",
        answer:
          "We offer a 24-hour re-clean guarantee if any checklist item needs a quick touch-up after landlord inspection.",
      },
    ],
  },
};
