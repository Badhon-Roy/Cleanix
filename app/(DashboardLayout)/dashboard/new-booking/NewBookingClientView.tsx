"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Calculator,
  MapPin,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
  Home,
  Building2,
  Truck,
  HardHat,
  Sofa,
  UtensilsCrossed,
  Wind,
  ShieldAlert,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  ChevronRight,
  Layers,
  Check,
  Tag,
  BedDouble,
  Bath,
  Maximize2,
  ChevronDown,
  ChevronLeft,
  Zap,
  Sun,
  Sunrise,
  Sunset,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { io } from "socket.io-client";
import { createBookingAPI } from "@/services/bookingService";
import { fetchActiveAddonsAPI } from "@/services/addonService";
import {
  fetchPricingConfigAPI,
  IBookingPriceBreakdown,
} from "@/services/pricingService";
import { fetchActiveServicesAPI } from "@/services/serviceCategoryService";

export default function NewBookingClientView({
  initialLocations = [],
  initialAddons = [],
  initialPricing,
  initialCoreServices = [],
}: {
  initialLocations?: any[];
  initialAddons?: any[];
  initialPricing?: any;
  initialCoreServices?: any[];
}) {
  const [serviceType, setServiceType] = useState<string>("RESIDENTIAL");
  const [sqft, setSqft] = useState<number>(1200);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [scheduledDate, setScheduledDate] = useState<string>("2026-08-25");
  const [timeSlot, setTimeSlot] = useState<string>("09:00 AM - 11:00 AM");
  const [paymentMethod, setPaymentMethod] = useState<string>("BKASH");
  const [address, setAddress] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  // Pre-fill address from default location if available
  useEffect(() => {
    if (initialLocations && initialLocations.length > 0) {
      const defaultLoc =
        initialLocations.find((l) => l.isDefault) || initialLocations[0];
      if (defaultLoc) {
        const fullAddr = `${defaultLoc.street}, ${defaultLoc.area}, ${defaultLoc.city}${defaultLoc.zip ? ` - ${defaultLoc.zip}` : ""}`;
        setAddress(fullAddr);
        setSelectedLocationId(String(defaultLoc._id || defaultLoc.id));
      }
    } else {
      setAddress("House 42, Road 11, Block D, Gulshan-2, Dhaka");
    }
  }, [initialLocations]);

  // Custom Calendar & Time Slot Dropdown States
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState<boolean>(false);
  const [currentCalendarYear, setCurrentCalendarYear] = useState<number>(2026);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<number>(7); // 0-indexed (7 = August)

  const calendarRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  // Time Slot Presets Definition
  const timeSlotOptions = [
    {
      id: "09:00 AM - 11:00 AM",
      label: "09:00 AM - 11:00 AM",
      tag: "MORNING",
      sub: "সকালের প্রথম শিফট",
      renderIcon: (active: boolean) => (
        <Sunrise
          className={`w-4 h-4 ${active ? "text-white" : "text-amber-500"}`}
        />
      ),
    },
    {
      id: "11:00 AM - 01:00 PM",
      label: "11:00 AM - 01:00 PM",
      tag: "MID-DAY",
      sub: "দুপুরের শিফট",
      renderIcon: (active: boolean) => (
        <Sun
          className={`w-4 h-4 ${active ? "text-white" : "text-amber-500"}`}
        />
      ),
    },
    {
      id: "02:00 PM - 04:00 PM",
      label: "02:00 PM - 04:00 PM",
      tag: "AFTERNOON",
      sub: "বিকেলের শিফট",
      renderIcon: (active: boolean) => (
        <Sun
          className={`w-4 h-4 ${active ? "text-white" : "text-orange-500"}`}
        />
      ),
    },
    {
      id: "04:00 PM - 06:00 PM",
      label: "04:00 PM - 06:00 PM",
      tag: "EVENING",
      sub: "সন্ধ্যা শিফট",
      renderIcon: (active: boolean) => (
        <Sunset
          className={`w-4 h-4 ${active ? "text-white" : "text-[#007eff]"}`}
        />
      ),
    },
  ];

  // Close custom dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setTimeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Service category label mapping
  const categoryLabels: Record<string, { name: string; sub: string }> = {
    RESIDENTIAL: { name: "Residential Home", sub: "বাসাবাড়ি ও অ্যাপার্টমেন্ট" },
    COMMERCIAL: { name: "Commercial Office", sub: "অফিস ও কর্পোরেট স্পেস" },
    MOVE_IN_OUT: { name: "Move-In / Out", sub: "বাসা শিফটিং ডিপ ক্লিন" },
    POST_CONSTRUCTION: {
      name: "Post Construction",
      sub: "নতুন বিল্ডিং ফিনিশিং",
    },
  };

  // Dynamic Add-ons List from Backend / Props Drilling
  const [activeAddonsCatalog, setActiveAddonsCatalog] = useState<any[]>(
    initialAddons && initialAddons.length > 0
      ? initialAddons
      : [
          {
            slug: "sofa",
            name: "Sofa & Carpet Wash",
            subLabel: "শ্যাম্পু ওয়াশ ও ডিপ মেট্রেস ড্রায়ার",
            price: 2000,
            tag: "MOST POPULAR",
            iconName: "sofa",
          },
          {
            slug: "oven",
            name: "Kitchen Oven & Chimney",
            subLabel: "ওভেন ও কিচেন চিমনি গ্রিজ ওয়াশ",
            price: 1200,
            tag: "KITCHEN CARE",
            iconName: "oven",
          },
          {
            slug: "fridge",
            name: "Refrigerator Deep Clean",
            subLabel: "ফ্রিজ অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজ",
            price: 1000,
            tag: "HYGIENE",
            iconName: "fridge",
          },
          {
            slug: "window",
            name: "Glass & Window Polish",
            subLabel: "ইনটেরিয়র গ্লাস ও উইন্ডো স্যানিটাইজিং",
            price: 800,
            tag: "SHINE CARE",
            iconName: "window",
          },
          {
            slug: "pet",
            name: "Pet Hygiene & Odor Clean",
            subLabel: "পেট হেয়ার ও গন্ধ দূরীকরণ ট্রিমেন্ট",
            price: 1500,
            tag: "PET CARE",
            iconName: "pet",
          },
        ],
  );

  // Sync with initialAddons prop if updated from SSR
  useEffect(() => {
    if (initialAddons && initialAddons.length > 0) {
      setActiveAddonsCatalog(initialAddons);
    }
  }, [initialAddons]);

  // Real-time synchronization (Socket.io + BroadcastChannel + Window Event Listener)
  useEffect(() => {
    const fetchLatestActiveAddons = async () => {
      try {
        const res = await fetchActiveAddonsAPI();
        if (res?.success && Array.isArray(res?.data)) {
          setActiveAddonsCatalog(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch active addons in real-time:", err);
      }
    };

    // 1. Socket.io Real-time Connection
    let socket: any = null;
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      socket = io(serverUrl, { withCredentials: true });
      socket.on("addon_updated", () => {
        fetchLatestActiveAddons();
      });
    } catch (e) {
      console.error("Socket connection error:", e);
    }

    // 2. BroadcastChannel cross-tab listener
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel("cleanix_addons_channel");
        channel.onmessage = () => {
          fetchLatestActiveAddons();
        };
      }
    } catch (e) {
      console.error("BroadcastChannel error:", e);
    }

    // 3. Custom window event listener
    const handleWindowUpdate = () => {
      fetchLatestActiveAddons();
    };
    window.addEventListener("cleanix_addons_updated", handleWindowUpdate);

    return () => {
      if (socket) socket.disconnect();
      if (channel) channel.close();
      window.removeEventListener("cleanix_addons_updated", handleWindowUpdate);
    };
  }, []);

  // Dynamic Pricing Config State from Backend / Props Drilling
  const [pricingConfig, setPricingConfig] = useState<any>(
    initialPricing || {
      baseFee: 1500,
      sqftRate: 2.5,
      bedroomRate: 500,
      bathroomRate: 400,
    },
  );

  useEffect(() => {
    if (initialPricing) {
      setPricingConfig(initialPricing);
    }
  }, [initialPricing]);

  // Real-time pricing synchronization (Socket.io + BroadcastChannel + Window Event Listener)
  useEffect(() => {
    const fetchLatestPricingConfig = async () => {
      try {
        const res = await fetchPricingConfigAPI();
        if (res?.success && res?.data) {
          setPricingConfig(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch pricing config in real-time:", err);
      }
    };

    let socket: any = null;
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      socket = io(serverUrl, { withCredentials: true });
      socket.on("pricing_updated", (data: any) => {
        if (data && typeof data === "object") {
          setPricingConfig(data);
        } else {
          fetchLatestPricingConfig();
        }
      });
    } catch (e) {
      console.error("Socket error in pricing listener:", e);
    }

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel("cleanix_pricing_channel");
        channel.onmessage = () => {
          fetchLatestPricingConfig();
        };
      }
    } catch (e) {
      console.error("BroadcastChannel error in pricing listener:", e);
    }

    const handlePricingWindowUpdate = () => {
      fetchLatestPricingConfig();
    };
    window.addEventListener(
      "cleanix_pricing_updated",
      handlePricingWindowUpdate,
    );

    return () => {
      if (socket) socket.disconnect();
      if (channel) channel.close();
      window.removeEventListener(
        "cleanix_pricing_updated",
        handlePricingWindowUpdate,
      );
    };
  }, []);

  // Core Services Catalog State & Real-time Listener (Socket.io + BroadcastChannel + Window Event)
  const [coreServicesList, setCoreServicesList] = useState<any[]>(
    initialCoreServices || [],
  );

  useEffect(() => {
    if (initialCoreServices && initialCoreServices.length > 0) {
      setCoreServicesList(initialCoreServices);
    }
  }, [initialCoreServices]);

  useEffect(() => {
    const fetchLatestActiveServices = async () => {
      try {
        const res = await fetchActiveServicesAPI();
        if (res?.success && Array.isArray(res?.data)) {
          setCoreServicesList(res.data);
        }
      } catch (err) {
        console.error(
          "Failed to fetch active core services in real-time:",
          err,
        );
      }
    };

    // 1. Socket.io Listener
    let socket: any = null;
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      socket = io(serverUrl, { withCredentials: true });
      socket.on("service_catalog_updated", () => {
        fetchLatestActiveServices();
      });
    } catch (e) {
      console.error("Socket error in core services listener:", e);
    }

    // 2. BroadcastChannel Listener
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel("cleanix_services_channel");
        channel.onmessage = () => {
          fetchLatestActiveServices();
        };
      }
    } catch (e) {
      console.error("BroadcastChannel error in core services:", e);
    }

    // 3. Custom Window Event Listener
    const handleServicesUpdate = () => {
      fetchLatestActiveServices();
    };
    window.addEventListener("cleanix_services_updated", handleServicesUpdate);

    return () => {
      if (socket) socket.disconnect();
      if (channel) channel.close();
      window.removeEventListener(
        "cleanix_services_updated",
        handleServicesUpdate,
      );
    };
  }, []);

  const getCategoryIcon = (category: string, title: string, slug: string) => {
    const text = `${category} ${title} ${slug}`.toLowerCase();
    if (text.includes("commercial") || text.includes("office"))
      return <Building2 className="w-6 h-6 stroke-[2]" />;
    if (
      text.includes("move") ||
      text.includes("out") ||
      text.includes("relocation")
    )
      return <Truck className="w-6 h-6 stroke-[2]" />;
    if (
      text.includes("construction") ||
      text.includes("build") ||
      text.includes("renovation")
    )
      return <HardHat className="w-6 h-6 stroke-[2]" />;
    if (
      text.includes("sofa") ||
      text.includes("carpet") ||
      text.includes("furniture")
    )
      return <Sofa className="w-6 h-6 stroke-[2]" />;
    return <Home className="w-6 h-6 stroke-[2]" />;
  };

  // Helper for dynamic addon icons
  const getAddonIcon = (name: string, iconName?: string) => {
    const key = (iconName || name).toLowerCase();
    if (key.includes("sofa") || key.includes("carpet"))
      return <Sofa className="w-6 h-6 stroke-[2]" />;
    if (key.includes("oven") || key.includes("kitchen"))
      return <UtensilsCrossed className="w-6 h-6 stroke-[2]" />;
    if (key.includes("fridge") || key.includes("refrigerator"))
      return <Wind className="w-6 h-6 stroke-[2]" />;
    if (key.includes("window") || key.includes("glass"))
      return <Sparkles className="w-6 h-6 stroke-[2]" />;
    if (key.includes("pet"))
      return <ShieldAlert className="w-6 h-6 stroke-[2]" />;
    return <Sparkles className="w-6 h-6 stroke-[2]" />;
  };

  // Selected add-ons state
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(
    {},
  );

  const toggleAddon = (key: string) => {
    setSelectedAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Real-time Backend Price Calculation via Socket.io ────────────────────
  const defaultBreakdown: IBookingPriceBreakdown = {
    categoryName: "",
    baseFee: 0,
    sqft: 0,
    sqftRate: 0,
    sqftCost: 0,
    bedrooms: 0,
    bedroomRate: 0,
    bedroomCost: 0,
    bathrooms: 0,
    bathroomRate: 0,
    bathroomCost: 0,
    addons: [],
    addonsTotal: 0,
    totalAmount: 0,
  };

  const [priceBreakdown, setPriceBreakdown] =
    useState<IBookingPriceBreakdown>(defaultBreakdown);
  const priceSocketRef = useRef<any>(null);

  // Connect once on mount, listen for results
  useEffect(() => {
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    const sock = io(serverUrl, { withCredentials: true });
    priceSocketRef.current = sock;

    sock.on(
      "booking_price_result",
      (res: { success: boolean; data?: IBookingPriceBreakdown }) => {
        if (res?.success && res?.data) {
          setPriceBreakdown(res.data);
        }
      },
    );

    return () => {
      sock.disconnect();
    };
  }, []);

  // Emit whenever inputs change
  useEffect(() => {
    if (!priceSocketRef.current) return;
    const activeAddonSlugs = Object.keys(selectedAddons).filter(
      (k) => selectedAddons[k],
    );
    priceSocketRef.current.emit("calculate_booking_price", {
      serviceSlug: serviceType,
      sqft,
      bedrooms,
      bathrooms,
      selectedAddons: activeAddonSlugs,
    });
  }, [serviceType, sqft, bedrooms, bathrooms, selectedAddons]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("অনুগ্রহ করে আপনার সার্ভিস ঠিকানা দিন।");
      return;
    }

    setIsSubmitting(true);

    const activeAddonsList = Object.keys(selectedAddons).filter(
      (key) => selectedAddons[key],
    );

    const payload = {
      serviceType: serviceType as any,
      sqft,
      bedrooms,
      bathrooms,
      selectedAddons: activeAddonsList,
      scheduledDate,
      timeSlot,
      address,
      locationId: selectedLocationId || undefined,
      paymentMethod: paymentMethod as any,
    };

    const res = await createBookingAPI(payload);
    setIsSubmitting(false);

    if (res?.success && res?.data) {
      setCreatedBooking(res.data);
      setBookingSuccess(true);
      toast.success(res?.message || "Booking confirmed successfully!");
    } else {
      toast.error(res?.message || "Failed to confirm booking.");
    }
  };

  // Format YYYY-MM-DD into readable date string
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "তারিখ নির্বাচন করুন";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Custom Calendar Calculation Helper
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentCalendarYear,
    currentCalendarMonth + 1,
    0,
  ).getDate();
  const firstDayOfWeek = new Date(
    currentCalendarYear,
    currentCalendarMonth,
    1,
  ).getDay();

  const handlePrevMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11);
      setCurrentCalendarYear((prev) => prev - 1);
    } else {
      setCurrentCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0);
      setCurrentCalendarYear((prev) => prev + 1);
    } else {
      setCurrentCalendarMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const monthStr = String(currentCalendarMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateFormatted = `${currentCalendarYear}-${monthStr}-${dayStr}`;
    setScheduledDate(dateFormatted);
    setCalendarOpen(false);
  };

  const handleQuickPreset = (offsetDays: number) => {
    const target = new Date(2026, 7, 21 + offsetDays);
    const mStr = String(target.getMonth() + 1).padStart(2, "0");
    const dStr = String(target.getDate()).padStart(2, "0");
    setScheduledDate(`${target.getFullYear()}-${mStr}-${dStr}`);
    setCurrentCalendarYear(target.getFullYear());
    setCurrentCalendarMonth(target.getMonth());
    setCalendarOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Calculator className="w-6 h-6 stroke-[2.5]" />
              </div>
              Instant Booking & Price Calculator
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ DYNAMIC CALCULATION
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            আপনার ফ্ল্যাট বা অফিসের সাইজ অনুযায়ী কাস্টমাইজড ক্লিন সার্ভিস শিডিউল
            করুন এবং ইনস্ট্যান্ট কোট পান।
          </p>
        </div>

        <Link
          href="/dashboard/bookings"
          className="text-xs font-bold text-[#007eff] hover:bg-blue-100 bg-blue-50 px-4 py-2.5 rounded-2xl border border-blue-200 self-start sm:self-auto transition-colors cursor-pointer flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          <span>My Booking List দেখুন</span>
        </Link>
      </div>

      {/* INFORMATIONAL GUIDE BANNER: SUBSCRIPTION VS NEW BOOKING */}
      <div className="bg-gradient-to-r from-red-50/80 via-white to-red-50/80 border border-red-400/90 rounded p-6 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                কখন New Booking এবং কখন Subscription সার্ভিস নেবেন?
              </h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                আপনার প্রয়োজন অনুযায়ী সবচেয়ে উপযোগী ও সাশ্রয়ী অপশনটি বেছে নিতে
                নিচের গাইডটি সাহায্য করবে:
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/subscription"
            className="text-xs sm:text-sm font-extrabold text-white bg-[#007eff] hover:bg-[#0066ee] px-5 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto flex-shrink-0 border border-blue-400"
          >
            <span>মাসিক প্যাকেজগুলো দেখুন</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Option 1: New Booking */}
          <div className="bg-white border border-blue-300/80 p-5 rounded-lg space-y-2 flex items-center gap-4 transition-all hover:border-blue-300">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                New Booking (এককালীন / অন-ডিমান্ড)
              </h4>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-1">
                হঠাৎ জরুরি প্রয়োজনে, কোনো ইভেন্টের আগে তাৎক্ষণিক ডিপ ক্লিন, বাসা
                শিফটিং বা অতিরিক্ত কাস্টম কাজের জন্য বুক করুন।
              </p>
            </div>
          </div>

          {/* Option 2: Subscription */}
          <div className="bg-white border border-emerald-200/80 p-5 rounded-lg space-y-2 flex items-center gap-4 transition-all hover:border-emerald-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CalendarIcon className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="ttext-base font-semibold text-slate-900 flex items-center gap-2">
                Subscription (মাসিক রুটিন প্ল্যান)
              </h4>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-1">
                প্রতি সপ্তাহে বা মাসে ২-৪ বার ফিক্সড শিডিউলে বাসা বা অফিস নিয়মিত
                পরিষ্কার রাখতে সবচেয়ে সাশ্রয়ী মাসিক প্ল্যান বেছে নিন।
              </p>
            </div>
          </div>
        </div>
      </div>

      {bookingSuccess ? (
        /* ULTRA-MODERN SUCCESS CONFIRMATION STATE */
        <div className="bg-white border-2 border-emerald-400 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-mono text-[#007eff] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 font-extrabold">
              BOOKING REF: {createdBooking?.bookingRef || "#CLN-2026-9042"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Booking Confirmed & Time Slot Locked! 🎉
            </h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              আপনার শিডিউলকৃত সার্ভিস{" "}
              <strong className="text-slate-900 font-bold">
                {scheduledDate} ({timeSlot})
              </strong>{" "}
              সময়সীমার জন্য বুক করা হয়েছে। কনফার্মেশন ইনভয়েস ইমেইলে পাঠিয়ে দেওয়া
              হয়েছে।
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard/bookings"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <span>My Booking এ স্ট্যাটাস ট্র্যাক করুন</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <button
              onClick={() => {
                setBookingSuccess(false);
                setCreatedBooking(null);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-2xl border border-slate-200 cursor-pointer transition-colors"
            >
              নতুন আর একটি সার্ভিস বুক করুন
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmitBooking}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Configuration Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Service Category Selector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-2xl bg-[#007eff] text-white text-sm font-bold flex items-center justify-center">
                    1
                  </span>
                  Select Service Category (সার্ভিস ক্যাটাগরি)
                </h3>
                <span className="text-xs font-bold text-[#007eff] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                  ধাপ ১ / ৪
                </span>
              </div>

              {/* Grid of Dynamic Category Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {coreServicesList.map((s) => {
                  const isSelected =
                    serviceType === s.slug || serviceType === s.category;
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => setServiceType(s.slug)}
                      className={`group relative p-5 sm:p-6 rounded-3xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 min-h-[160px] ${
                        isSelected
                          ? "bg-gradient-to-r from-[#007eff] via-blue-600 to-blue-700 text-white border-2 border-blue-400 shadow-md"
                          : "border border-slate-200/90 bg-white hover:bg-slate-50/80 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      {isSelected ? (
                        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white text-[#007eff] flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        s.badge && (
                          <span className="absolute top-4 right-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            {s.badge}
                          </span>
                        )
                      )}

                      <div className="pt-8">
                        <p
                          className={`text-base font-bold leading-snug ${
                            isSelected
                              ? "text-white"
                              : "text-slate-900 group-hover:text-[#007eff]"
                          }`}
                        >
                          {s.title.split("(")[0].trim()}
                        </p>
                        <p
                          className={`text-xs font-semibold mt-2 line-clamp-1 ${
                            isSelected ? "text-blue-100" : "text-slate-500"
                          }`}
                        >
                          {s.shortDesc ||
                            s.introParagraph1 ||
                            "সম্পূর্ণ সার্ভিস প্রসেস"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Property Specs */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-2xl bg-[#007eff] text-white text-sm font-bold flex items-center justify-center">
                    2
                  </span>
                  Property Size & Room Configuration (স্পেসের মাপ)
                </h3>
                <span className="text-xs font-bold text-[#007eff] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                  ধাপ ২ / ৪
                </span>
              </div>

              {/* High-End SqFt Interactive Control Container */}
              <div className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 p-6 sm:p-7 rounded-3xl border border-blue-100/90 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 text-[#007eff] flex items-center justify-center flex-shrink-0">
                      <Maximize2 className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                        ফ্ল্যাট বা স্পেসের আয়তন
                      </h4>
                      <p className="text-sm text-slate-700 font-medium mt-1">
                        রেট: ৳{pricingConfig.sqftRate ?? 2.5} প্রতি SqFt
                        (ম্যানুয়ালি ইনপুট বা স্লাইডার ব্যবহার করুন)
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-[#007eff] px-4 py-2 rounded-2xl text-center flex items-center gap-2 self-start sm:self-auto focus-within:ring-2 focus-within:ring-blue-400">
                    <input
                      type="number"
                      min={100}
                      max={20000}
                      value={sqft === 0 ? "" : sqft}
                      onChange={(e) => {
                        const val =
                          e.target.value === "" ? 0 : Number(e.target.value);
                        if (!isNaN(val)) {
                          setSqft(val);
                        }
                      }}
                      className="w-28 text-2xl sm:text-3xl font-bold text-[#007eff] bg-transparent text-right focus:outline-none font-mono"
                    />
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      SqFt
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <input
                    type="range"
                    min={300}
                    max={8000}
                    step={50}
                    value={Math.min(8000, Math.max(300, sqft))}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full h-3.5 bg-slate-200 rounded-xl appearance-none cursor-pointer accent-[#007eff]"
                  />
                  <div className="flex justify-between text-xs font-extrabold text-slate-500">
                    <span>300 SqFt (ছোট ফ্ল্যাট)</span>
                    <span>4,000 SqFt (মাঝারি অফিস)</span>
                    <span>8,000 SqFt (বড় ডুপ্লেক্স)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 mr-1">
                    দ্রুত নির্বাচন করুন:
                  </span>
                  {[
                    { label: "600 SqFt (1 Bed)", val: 600 },
                    { label: "1,200 SqFt (2 Bed)", val: 1200 },
                    { label: "2,000 SqFt (3 Bed)", val: 2000 },
                    { label: "3,500 SqFt (4 Bed)", val: 3500 },
                    { label: "5,000 SqFt (Office)", val: 5000 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setSqft(preset.val)}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        sqft === preset.val
                          ? "bg-[#007eff] text-white border-[#007eff]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms & Bathrooms Steppers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-slate-50/90 border border-slate-200/90 p-5 sm:p-6 rounded-3xl flex items-center justify-between transition-all hover:border-slate-300">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#007eff] flex items-center justify-center flex-shrink-0">
                      <BedDouble className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Bedrooms (বেডরুম)
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        ৳{pricingConfig.bedroomRate ?? 500} / Bedroom
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white p-1.5 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#007eff] hover:text-white text-slate-800 flex items-center justify-center font-bold transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span className="text-xl font-bold text-slate-900 w-8 text-center">
                      {bedrooms}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBedrooms(bedrooms + 1)}
                      className="w-9 h-9 rounded-xl bg-[#007eff] hover:bg-[#0066ee] text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/90 border border-slate-200/90 p-5 sm:p-6 rounded-3xl flex items-center justify-between transition-all hover:border-slate-300">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#007eff] flex items-center justify-center flex-shrink-0">
                      <Bath className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Bathrooms (বাথরুম)
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        ৳{pricingConfig.bathroomRate ?? 400} / Bathroom
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white p-1.5 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#007eff] hover:text-white text-slate-800 flex items-center justify-center font-bold transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span className="text-xl font-bold text-slate-900 w-8 text-center">
                      {bathrooms}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBathrooms(bathrooms + 1)}
                      className="w-9 h-9 rounded-xl bg-[#007eff] hover:bg-[#0066ee] text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Service Add-Ons */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-2xl bg-[#007eff] text-white text-sm font-bold flex items-center justify-center">
                    3
                  </span>
                  Service Add-Ons (অতিরিক্ত সার্ভিস অপশন)
                </h3>
                <span className="text-xs font-bold text-[#007eff] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                  ধাপ ৩ / ৪
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeAddonsCatalog.map((item: any) => {
                  const key = item.slug || String(item._id);
                  const isChecked = !!selectedAddons[key];

                  return (
                    <div
                      key={key}
                      onClick={() => toggleAddon(key)}
                      className={`group relative p-5 sm:p-6 rounded-3xl border cursor-pointer flex items-center justify-between transition-all duration-300 ${
                        isChecked
                          ? "bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white border-2 border-emerald-400"
                          : "border border-slate-200/90 bg-white hover:bg-slate-50/80 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            isChecked
                              ? "bg-white/20 text-white backdrop-blur-md"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-105"
                          }`}
                        >
                          {getAddonIcon(item.name, item.iconName)}
                        </div>
                        <div>
                          <p
                            className={`text-base font-bold leading-snug ${
                              isChecked
                                ? "text-white"
                                : "text-slate-900 group-hover:text-emerald-600"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p
                            className={`text-xs font-medium mt-1 ${
                              isChecked ? "text-emerald-100" : "text-slate-500"
                            }`}
                          >
                            {item.subLabel}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span
                          className={`text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-xl transition-colors ${
                            isChecked
                              ? "bg-white text-emerald-900"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          +৳{(item.price || 0).toLocaleString()}
                        </span>

                        {isChecked && (
                          <div className="w-7 h-7 rounded-full bg-white text-emerald-600 flex items-center justify-center">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: Schedule, Time Slot & Address */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-[#007eff] text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  Schedule & Location (তারিখ ও ঠিকানা)
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  ধাপ ৪ / ৪
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                {/* COMPACT CUSTOM REACT CALENDAR CONTAINER */}
                <div className="space-y-2 relative" ref={calendarRef}>
                  <label className="font-bold text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#007eff]" /> তারিখ
                    নির্বাচন করুন:
                  </label>

                  <div
                    onClick={() => {
                      setCalendarOpen(!calendarOpen);
                      setTimeDropdownOpen(false);
                    }}
                    className="relative bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-[#007eff] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#007eff] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <CalendarIcon className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {formatDisplayDate(scheduledDate)}
                      </span>
                    </div>

                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#007eff] stroke-[2.5]" />
                  </div>

                  {calendarOpen && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 w-72 bg-white border border-slate-200 rounded-3xl p-3.5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#007eff] hover:text-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {monthNames[currentCalendarMonth]}{" "}
                          {currentCalendarYear}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#007eff] hover:text-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center">
                        {Array.from({ length: firstDayOfWeek }).map(
                          (_, idx) => (
                            <div key={`empty-${idx}`} className="h-7" />
                          ),
                        )}

                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const mStr = String(
                            currentCalendarMonth + 1,
                          ).padStart(2, "0");
                          const dStr = String(dayNum).padStart(2, "0");
                          const thisDateFormatted = `${currentCalendarYear}-${mStr}-${dStr}`;
                          const isSelected =
                            scheduledDate === thisDateFormatted;
                          const isToday = thisDateFormatted === "2026-08-21";

                          return (
                            <button
                              key={dayNum}
                              type="button"
                              onClick={() => handleSelectDay(dayNum)}
                              className={`h-7 w-7 mx-auto rounded-lg flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#007eff] text-white font-extrabold shadow-sm scale-105"
                                  : isToday
                                    ? "border border-[#007eff] text-[#007eff] font-bold bg-blue-50/50"
                                    : "text-slate-700 hover:bg-blue-50 hover:text-[#007eff]"
                              }`}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickPreset(0)}
                          className="group py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-[#007eff] border border-blue-200 text-[#007eff] hover:text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 group-hover:text-amber-300 group-hover:fill-amber-300 transition-colors" />
                          <span>আজ (Today)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPreset(1)}
                          className="group py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-[#007eff] border border-slate-200 text-slate-700 hover:text-white hover:border-[#007eff] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <CalendarIcon className="w-3.5 h-3.5 text-[#007eff] group-hover:text-white transition-colors" />
                          <span>আগামীকাল</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* TIME SLOT SELECTOR */}
                <div className="space-y-2 relative" ref={timeRef}>
                  <label className="font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#007eff]" /> সময় নির্ধারণ
                    করুন:
                  </label>

                  <div
                    onClick={() => {
                      setTimeDropdownOpen(!timeDropdownOpen);
                      setCalendarOpen(false);
                    }}
                    className="relative bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-[#007eff] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#007eff] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Clock className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {timeSlot}
                      </span>
                    </div>

                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#007eff] stroke-[2.5]" />
                  </div>

                  {timeDropdownOpen && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 w-full bg-white border border-slate-200 rounded-3xl p-3 shadow-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                        <span>AVAILABLE TIME SLOTS</span>
                        <span className="text-[#007eff]">4 Slots</span>
                      </div>

                      <div className="space-y-1.5">
                        {timeSlotOptions.map((option) => {
                          const isSelected = timeSlot === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                setTimeSlot(option.id);
                                setTimeDropdownOpen(false);
                              }}
                              className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-r from-[#007eff] via-blue-600 to-blue-700 text-white border-2 border-blue-400 font-extrabold"
                                  : "border-slate-200 bg-slate-50 hover:bg-blue-50/70 hover:border-blue-200 text-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                                    isSelected
                                      ? "bg-white/20 text-white backdrop-blur-md"
                                      : "bg-white text-slate-700 border border-slate-200"
                                  }`}
                                >
                                  {option.renderIcon(isSelected)}
                                </div>
                                <div>
                                  <p
                                    className={`text-xs font-extrabold ${isSelected ? "text-[#007eff]" : "text-slate-900"}`}
                                  >
                                    {option.label}
                                  </p>
                                  <p
                                    className={`text-[10px] font-medium ${isSelected ? "text-blue-100" : "text-slate-500"}`}
                                  >
                                    {option.sub}
                                  </p>
                                </div>
                              </div>

                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-white text-[#007eff] flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Address Selection / Input */}
              <div className="space-y-2 text-xs sm:text-sm pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#007eff]" /> সার্ভিস লোকেশন
                    ঠিকানা:
                  </label>
                  {initialLocations && initialLocations.length > 0 && (
                    <span className="text-[11px] font-bold text-[#007eff]">
                      সেভ করা ঠিকানা নির্বাচন করুন
                    </span>
                  )}
                </div>

                {initialLocations && initialLocations.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                    {initialLocations.map((loc) => {
                      const fullLocStr = `${loc.street}, ${loc.area}, ${loc.city}${loc.zip ? ` - ${loc.zip}` : ""}`;
                      const isSelected = address === fullLocStr;
                      return (
                        <button
                          key={loc._id || loc.id}
                          type="button"
                          onClick={() => {
                            setAddress(fullLocStr);
                            setSelectedLocationId(String(loc._id || loc.id));
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex-shrink-0 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#007eff] text-white border-[#007eff] shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          📍 {loc.tag}
                        </button>
                      );
                    })}
                  </div>
                )}

                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setSelectedLocationId("");
                  }}
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন (যেমন: হাউস ৪২, রোড ১১, গুলশান-২, ঢাকা)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Right Summary & Checkout Box */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 z-20">
            <div className="bg-white border border-dashed border-[#007eff] rounded p-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#007eff] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  LIVE CALCULATION
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  Instant Bill Summary
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  স্বয়ংক্রিয় রিয়েল-টাইম হিসাব
                </p>
              </div>

              {/* Itemized Calculation Breakdown Table */}
              <div className="space-y-3 text-xs sm:text-sm border-y border-slate-100 py-4 font-medium">
                {/* Selected Category Badge */}
                <div className="flex justify-between items-center bg-blue-50/80 p-3 rounded-2xl border border-blue-200 mb-2">
                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#007eff]" /> Selected
                    Category:
                  </span>
                  <span className="font-bold text-[#007eff] text-xs uppercase bg-white px-2.5 py-1 rounded-xl border border-blue-200">
                    {priceBreakdown.categoryName || "—"}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>
                    বেসিক সার্ভিস ফি ({priceBreakdown.categoryName || "—"}):
                  </span>
                  <span className="font-bold text-slate-900">
                    ৳{priceBreakdown.baseFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>
                    SqFt চার্জ ({priceBreakdown.sqft} × ৳
                    {priceBreakdown.sqftRate}):
                  </span>
                  <span className="font-bold text-slate-900">
                    ৳{priceBreakdown.sqftCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>
                    বেডরুম ({priceBreakdown.bedrooms} × ৳
                    {priceBreakdown.bedroomRate}):
                  </span>
                  <span className="font-bold text-slate-900">
                    ৳{priceBreakdown.bedroomCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>
                    বাথরুম ({priceBreakdown.bathrooms} × ৳
                    {priceBreakdown.bathroomRate}):
                  </span>
                  <span className="font-bold text-slate-900">
                    ৳{priceBreakdown.bathroomCost.toLocaleString()}
                  </span>
                </div>

                {priceBreakdown.addons.length > 0 && (
                  <div className="pt-3 border-t border-dashed border-slate-200 space-y-2">
                    {priceBreakdown.addons.map((addon) => (
                      <div
                        key={addon.slug}
                        className="flex justify-between text-emerald-800 font-semibold"
                      >
                        <span>+ {addon.name}:</span>
                        <span className="font-bold text-emerald-700">
                          +৳{addon.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-base sm:text-lg font-bold text-slate-900">
                  <span>মোট প্রদেয় বিল:</span>
                  <span className="text-[#007eff] text-2xl font-bold">
                    ৳{priceBreakdown.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Time Slot Lock Notice */}
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#007eff]" />
                <span className="font-semibold leading-relaxed">
                  <strong>১০-মিনিট Time Slot Lock:</strong> বুকিং কনফার্ম করলে
                  উক্ত সময়সূচীতে আপনার টিমের ক্লিন টিম রিজার্ভ রাখা হবে।
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#007eff]" /> পেমেন্ট মেথড
                  নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "BKASH", label: "bKash" },
                    { id: "NAGAD", label: "Nagad" },
                    { id: "STRIPE", label: "Card / Stripe" },
                    { id: "COD", label: "Cash on Delivery" },
                  ].map((p) => {
                    const isSelected = paymentMethod === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id)}
                        className={`p-3.5 rounded-2xl text-xs font-bold text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#007eff] via-blue-600 to-blue-700 text-white border-2 border-blue-400 shadow-md"
                            : "border border-slate-200 bg-slate-50/90 text-slate-700 hover:bg-slate-100 font-bold"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-none border border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>
                      Confirm & Pay ৳
                      {priceBreakdown.totalAmount.toLocaleString()}
                    </span>
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
