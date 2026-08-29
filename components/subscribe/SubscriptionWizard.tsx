"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Sparkles,
  Download,
  FileText,
  Check,
  ArrowRight,
  Sliders,
  Sun,
  Sunrise,
  Sunset,
  PhoneCall,
  Lock,
  Loader2,
  Search,
  ChevronDown,
  X,
  AlertCircle,
} from "lucide-react";
import { fetchAllPlansAPI, IPlan } from "@/services/planService";
import { fetchActiveAddonsAPI } from "@/services/addonService";
import { fetchAllCoveragesAPI, ICoverageArea } from "@/services/coverageService";
import { io } from "socket.io-client";

export interface ISubscriptionPlanOption {
  id: string;
  title: string;
  subtitleBn: string;
  price: number;
  priceStr: string;
  visitsStr: string;
  popular?: boolean;
  isAddonFree?: boolean;
  features: string[];
}

interface AddonOption {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  priceStr: string;
  icon: string;
  desc: string;
}

export interface ICoverageZoneOption {
  id: string;
  name: string;
  district: string;
}

export interface ISubscriptionFormValues {
  selectedPlanId: string;
  selectedAddonIds: string[];
  selectedZone: string;
  streetAddress: string;
  firstVisitDate: string;
  selectedSlotId: string;
  specialInstructions: string;
  paymentMethod: "BKASH" | "NAGAD" | "SSLCOMMERZ" | "COD";
  bkashPhone: string;
  bkashTrxId: string;
}

const TIME_SLOT_OPTIONS = [
  {
    id: "morning",
    label: "09:00 AM - 11:00 AM",
    titleBn: "সকাল স্লট (Morning)",
    icon: Sunrise,
    desc: "দিনের শুরুতেই ফ্রেশ ক্লিনিং",
  },
  {
    id: "noon",
    label: "11:30 AM - 01:30 PM",
    titleBn: "দুপুর স্লট (Afternoon)",
    icon: Sun,
    desc: "দুপুরের সুবিধাজনক সময়ে",
  },
  {
    id: "evening",
    label: "03:00 PM - 05:00 PM",
    titleBn: "বিকেল স্লট (Evening)",
    icon: Sunset,
    desc: "অফিস বা কাজের শেষ ভাগে",
  },
];

const parsePriceNumber = (priceStr: any): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
};

const mapApiPlansToOptions = (apiPlans: IPlan[]): ISubscriptionPlanOption[] => {
  if (!Array.isArray(apiPlans) || apiPlans.length === 0) return [];
  return apiPlans.map((p) => {
    const numPrice = parsePriceNumber(p.price);
    const rawId = (p.id || p._id || p.title).toLowerCase();
    return {
      id: rawId,
      title: p.title.toUpperCase(),
      subtitleBn: p.subtitleBn || "প্রফেশনাল হোম ও অফিস ক্লিনিং প্যাকেজ",
      price: numPrice,
      priceStr: typeof p.price === "string" && p.price.includes("৳") ? p.price : `৳${numPrice.toLocaleString()}`,
      visitsStr: p.features?.[0] || "নিয়মিত স্যানিটাইজেশন ও ক্লিনিং ভিজিট",
      popular: p.isPopular,
      isAddonFree: p.isAddonFree ?? (rawId.includes("premium") || p.title.includes("PREMIUM")),
      features: p.features || [],
    };
  });
};

const mapApiAddonsToOptions = (apiAddons: any[]): AddonOption[] => {
  if (!Array.isArray(apiAddons) || apiAddons.length === 0) return [];
  return apiAddons.map((a: any) => ({
    id: a.slug || a._id,
    name: a.name,
    nameBn: a.name || a.subLabel,
    price: a.price || 0,
    priceStr: `৳${(a.price || 0).toLocaleString()}`,
    icon: a.iconImage || "",
    desc: a.subLabel || "প্রফেশনাল ডিপ সার্ভিস স্যানিটাইজিং",
  }));
};

const mapCoverageAreasToOptions = (coverages: ICoverageArea[]): ICoverageZoneOption[] => {
  if (!Array.isArray(coverages) || coverages.length === 0) return [];
  return coverages
    .filter((c) => c.isActive !== false)
    .map((c) => {
      const areasStr = Array.isArray(c.areasIncluded) && c.areasIncluded.length > 0
        ? ` (${c.areasIncluded.slice(0, 3).join(", ")})`
        : "";
      return {
        id: c.id || c._id || c.zoneName.toLowerCase(),
        name: `${c.zoneName}${areasStr}`,
        district: c.district || "Dhaka",
      };
    });
};

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return "Select First Cleaning Date";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  const d = new Date(year, month - 1, day);
  const monthsBn = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const daysBn = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  return `${day} ${monthsBn[d.getMonth()]}, ${year} (${daysBn[d.getDay()]})`;
};

interface SubscriptionWizardProps {
  initialPlanId?: string;
  initialPlans?: IPlan[];
  initialAddons?: any[];
  initialCoverages?: ICoverageArea[];
}

export default function SubscriptionWizard({
  initialPlanId = "standard",
  initialPlans,
  initialAddons,
  initialCoverages,
}: SubscriptionWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>("");

  // Dynamic Data States initialized 100% from Server-Fetched MongoDB API Props
  const [plansList, setPlansList] = useState<ISubscriptionPlanOption[]>(() =>
    initialPlans && initialPlans.length > 0 ? mapApiPlansToOptions(initialPlans) : []
  );

  const [addonsList, setAddonsList] = useState<AddonOption[]>(() =>
    initialAddons && initialAddons.length > 0 ? mapApiAddonsToOptions(initialAddons) : []
  );

  const [coverageZonesList, setCoverageZonesList] = useState<ICoverageZoneOption[]>(() =>
    initialCoverages && initialCoverages.length > 0 ? mapCoverageAreasToOptions(initialCoverages) : []
  );

  const [loadingDynamicData, setLoadingDynamicData] = useState<boolean>(
    !initialPlans || initialPlans.length === 0
  );

  // React Hook Form Initialization for persistent form state
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ISubscriptionFormValues>({
    defaultValues: {
      selectedPlanId: initialPlanId.toLowerCase(),
      selectedAddonIds: [],
      selectedZone: initialCoverages && initialCoverages.length > 0 ? (initialCoverages[0].id || initialCoverages[0]._id || "") : "",
      streetAddress: "House 42, Road 11, Block D, Flat 5B",
      firstVisitDate: "2026-09-01",
      selectedSlotId: "morning",
      specialInstructions: "",
      paymentMethod: "BKASH",
      bkashPhone: "01711223344",
      bkashTrxId: "TRX9812401",
    },
  });

  // Watched Form States
  const selectedPlanId = watch("selectedPlanId");
  const selectedAddonIds = watch("selectedAddonIds");
  const selectedZone = watch("selectedZone");
  const selectedSlotId = watch("selectedSlotId");
  const paymentMethod = watch("paymentMethod");
  const firstVisitDate = watch("firstVisitDate");
  const streetAddress = watch("streetAddress");

  // Searchable Zone Combobox Dropdown State
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState<boolean>(false);
  const [zoneSearchQuery, setZoneSearchQuery] = useState<string>("");
  const zoneDropdownRef = useRef<HTMLDivElement>(null);

  // Custom Calendar State
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [calMonth, setCalMonth] = useState<Date>(() => new Date(2026, 8, 1)); // Default Sep 2026
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close Popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(event.target as Node)) {
        setIsZoneDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute Calendar Grid Days
  const calendarGridDays = useMemo(() => {
    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate();

    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);

    const daysArr = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArr.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const thisDate = new Date(year, month, d);
      thisDate.setHours(0, 0, 0, 0);

      const yyyy = year;
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const fullStr = `${yyyy}-${mm}-${dd}`;

      const isPast = thisDate < todayObj;
      const isToday = thisDate.getTime() === todayObj.getTime();
      const isSelected = firstVisitDate === fullStr;

      daysArr.push({
        dayNum: d,
        fullStr,
        isPast,
        isToday,
        isSelected,
      });
    }

    return daysArr;
  }, [calMonth, firstVisitDate]);

  // Fetch Dynamic Plans, Addons, and Coverage Zones client-side or on Socket updates
  const loadDynamicData = useCallback(async () => {
    try {
      setLoadingDynamicData(true);
      const [apiPlans, apiAddonsRes, apiCoverages] = await Promise.all([
        fetchAllPlansAPI(true),
        fetchActiveAddonsAPI(),
        fetchAllCoveragesAPI({ isActive: true }),
      ]);

      if (Array.isArray(apiPlans) && apiPlans.length > 0) {
        setPlansList(mapApiPlansToOptions(apiPlans));
      }

      if (apiAddonsRes?.success && Array.isArray(apiAddonsRes?.data)) {
        setAddonsList(mapApiAddonsToOptions(apiAddonsRes.data));
      }

      if (Array.isArray(apiCoverages) && apiCoverages.length > 0) {
        const mappedZones = mapCoverageAreasToOptions(apiCoverages);
        setCoverageZonesList(mappedZones);
        if (!selectedZone && mappedZones.length > 0) {
          setValue("selectedZone", mappedZones[0].id);
        }
      }
    } catch (err) {
      console.error("Error updating dynamic plans/addons/coverages in SubscriptionWizard:", err);
    } finally {
      setLoadingDynamicData(false);
    }
  }, [selectedZone, setValue]);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("plan_updated", () => {
      loadDynamicData();
    });

    socket.on("addon_updated", () => {
      loadDynamicData();
    });

    socket.on("coverage_updated", () => {
      loadDynamicData();
    });

    return () => {
      socket.off("plan_updated");
      socket.off("addon_updated");
      socket.off("coverage_updated");
      socket.disconnect();
    };
  }, [loadDynamicData]);

  // Selected Plan Data
  const currentPlan =
    plansList.find(
      (p) =>
        p.id === selectedPlanId ||
        p.id.includes(selectedPlanId) ||
        selectedPlanId.includes(p.id)
    ) || plansList[0] || null;

  const isPremium = currentPlan
    ? currentPlan.isAddonFree ?? (currentPlan.id.includes("premium") || currentPlan.title.includes("PREMIUM"))
    : false;

  // Calculated Addons Total
  const selectedAddonsObj = addonsList.filter((a) => selectedAddonIds.includes(a.id));
  const addonsTotal = isPremium ? 0 : selectedAddonsObj.reduce((sum, a) => sum + a.price, 0);

  // Grand Total Calculation
  const grandTotal = (currentPlan?.price || 0) + addonsTotal;

  const selectedSlot = TIME_SLOT_OPTIONS.find((s) => s.id === selectedSlotId) || TIME_SLOT_OPTIONS[0];
  const selectedZoneObj = coverageZonesList.find((z) => z.id === selectedZone) || coverageZonesList[0];

  // Filtered Coverage Zones based on live Search Bar input
  const filteredZones = coverageZonesList.filter(
    (z) =>
      z.name.toLowerCase().includes(zoneSearchQuery.toLowerCase()) ||
      z.district.toLowerCase().includes(zoneSearchQuery.toLowerCase())
  );

  const toggleAddon = (addonId: string) => {
    if (selectedAddonIds.includes(addonId)) {
      setValue("selectedAddonIds", selectedAddonIds.filter((id) => id !== addonId));
    } else {
      setValue("selectedAddonIds", [...selectedAddonIds, addonId]);
    }
  };

  // Step 1 -> Step 2 Validation Handler
  const handleProceedToStep2 = () => {
    if (!selectedPlanId || !currentPlan) {
      setValidationError("অনুগ্রহ করে সামনে অগ্রসর হওয়ার জন্য একটি সাবস্ক্রিপশন প্যাকেজ সিলেক্ট করুন।");
      return;
    }
    setValidationError("");
    setMaxStepReached((prev) => Math.max(prev, 2));
    setCurrentStep(2);
  };

  // Step 2 -> Step 3 Validation Handler
  const handleProceedToStep3 = () => {
    if (!selectedZone) {
      setValidationError("অনুগ্রহ করে আপনার ঢাকা কাভারেজ এলাকা নির্বাচন করুন।");
      return;
    }
    if (!streetAddress || streetAddress.trim().length < 5) {
      setValidationError("অনুগ্রহ করে আপনার পূর্ণাঙ্গ বাসার ঠিকানা প্রদান করুন।");
      return;
    }
    if (!firstVisitDate) {
      setValidationError("অনুগ্রহ করে প্রথম ক্লিনিং ভিজিটের তারিখ নির্ধারণ করুন।");
      return;
    }
    setValidationError("");
    setMaxStepReached((prev) => Math.max(prev, 3));
    setCurrentStep(3);
  };

  const onSubmitForm = (data: ISubscriptionFormValues) => {
    console.log("Subscription Order Submitted via React Hook Form:", data);
    setMaxStepReached(4);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Page Title & Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-[#007eff] font-bold text-xs tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#007eff] animate-pulse" />
            <span>CLEANIX MONTHLY SUBSCRIPTION CHECKOUT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Subscribe to Professional Cleaning
          </h1>

          <p className="text-slate-600 font-medium text-sm sm:text-base max-w-2xl mx-auto">
            আপনার ঢাকা লোকেশন বেছে নিয়ে ১-ক্লিকে পেশাদার হোম ও অফিস ক্লিনিং সাবস্ক্রিপশন চালু করুন।
          </p>
        </div>

        {/* State-of-the-Art 4-Step Stepper Component with Memory Navigation */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="relative">
            {/* Dynamic Progress Track Line (Hidden on Mobile) */}
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-1 bg-slate-100 rounded-full -z-0">
              <div
                className="h-full bg-gradient-to-r from-[#007eff] via-blue-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{
                  width:
                    currentStep === 1
                      ? "0%"
                      : currentStep === 2
                      ? "33.33%"
                      : currentStep === 3
                      ? "66.66%"
                      : "100%",
                }}
              />
            </div>

            {/* Stepper Grid Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
              {[
                { num: 1, stepCode: "01", title: "Select Plan & Addons", sub: "প্যাকেজ ও সুবিধা", icon: Sliders },
                { num: 2, stepCode: "02", title: "Address & Schedule", sub: "ঠিকানা ও সময়", icon: MapPin },
                { num: 3, stepCode: "03", title: "Payment Method", sub: "পেমেন্ট চ্যানেল", icon: CreditCard },
                { num: 4, stepCode: "04", title: "Invoice & Order", sub: "কনফার্মেশন", icon: CheckCircle2 },
              ].map((step) => {
                const isActive = currentStep === step.num;
                const isNavigable = step.num <= maxStepReached;
                const isCompleted = step.num < currentStep || (step.num < maxStepReached);
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.num}
                    onClick={() => {
                      if (isNavigable) {
                        setValidationError("");
                        setCurrentStep(step.num);
                      }
                    }}
                    className={`group flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl transition-all duration-300 ${
                      isNavigable
                        ? "cursor-pointer hover:bg-blue-50/40"
                        : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    {/* Step Icon Badge */}
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 relative mb-3 ${
                        isActive
                          ? "bg-[#007eff] text-white ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/25 scale-105"
                          : isCompleted
                          ? "bg-emerald-500 text-white ring-4 ring-emerald-500/10 shadow-xs"
                          : "bg-slate-100 border border-slate-200 text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6 stroke-[2]" />
                      ) : (
                        <IconComponent className={`w-5 h-5 ${isActive ? "stroke-[2]" : "stroke-[1.75]"}`} />
                      )}

                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-2 ring-white animate-ping" />
                      )}
                    </div>

                    {/* Step Labels */}
                    <div className="space-y-0.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider block ${
                          isActive ? "text-[#007eff]" : isCompleted ? "text-emerald-700" : "text-slate-400"
                        }`}
                      >
                        {isCompleted ? "✓ REACHED" : `STEP ${step.stepCode}`}
                      </span>

                      <p
                        className={`text-xs sm:text-sm font-bold tracking-tight leading-snug ${
                          isActive ? "text-slate-900" : isCompleted ? "text-slate-800" : "text-slate-500"
                        }`}
                      >
                        {step.title}
                      </p>

                      <p
                        className={`text-[11px] font-bold ${
                          isActive ? "text-[#007eff]" : isCompleted ? "text-emerald-800" : "text-slate-400"
                        }`}
                      >
                        {step.sub}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Layout (React Hook Form Container + Billing Summary Sidebar) */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Wizard Forms (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200 shadow-xs">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* STEP 1: CHOOSE PLAN & ADDONS (100% DYNAMIC MONGODB DATA) */}
            {currentStep === 1 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                      <Sliders className="w-5 h-5 text-[#007eff]" /> Step 1: Select Subscription Plan
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      আপনার বাসা বা অফিসের আকৃতি অনুযায়ী মান্থলি প্যাকেজ পছন্দ করুন।
                    </p>
                  </div>

                  {loadingDynamicData && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#007eff] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing Live MongoDB Plans...</span>
                    </div>
                  )}
                </div>

                {/* Dynamic Plan Selection Cards Grid */}
                {plansList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {plansList.map((plan) => {
                      const isSelected =
                        selectedPlanId === plan.id ||
                        selectedPlanId.includes(plan.id) ||
                        plan.id.includes(selectedPlanId);
                      const isDark = plan.id.includes("premium") || plan.title.includes("PREMIUM");

                      return (
                        <div
                          key={plan.id}
                          onClick={() => {
                            setValidationError("");
                            setValue("selectedPlanId", plan.id);
                          }}
                          className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-5 relative ${
                            isSelected
                              ? isDark
                                ? "bg-[#001837] border-blue-500 ring-2 ring-blue-500/30 text-white shadow-xl"
                                : "bg-blue-50/70 border-[#007eff] ring-2 ring-blue-500/20 shadow-md"
                              : isDark
                              ? "bg-slate-900 border-slate-800 text-white hover:border-slate-700"
                              : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {plan.popular && (
                            <span className="bg-[#007eff] text-white font-bold text-[9px] uppercase tracking-wider rounded-full px-3 py-1 absolute -top-3 right-4 shadow-sm border border-blue-300">
                              ★ MOST POPULAR
                            </span>
                          )}

                          {isDark && (
                            <span className="bg-purple-600 text-white font-bold text-[9px] uppercase tracking-wider rounded-full px-3 py-1 absolute -top-3 right-4 shadow-sm">
                              👑 VIP CARE
                            </span>
                          )}

                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-bold text-lg uppercase tracking-wide ${
                                  isDark ? "text-white" : "text-slate-900"
                                }`}
                              >
                                {plan.title}
                              </span>
                              <div
                                className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? "border-[#007eff] bg-[#007eff] text-white"
                                    : isDark
                                    ? "border-slate-700"
                                    : "border-slate-300"
                                }`}
                              >
                                {isSelected && <Check className="w-4 h-4 stroke-[2]" />}
                              </div>
                            </div>

                            <p
                              className={`text-xs font-medium line-clamp-2 ${
                                isDark ? "text-slate-300" : "text-slate-600"
                              }`}
                            >
                              {plan.subtitleBn}
                            </p>

                            <div className="pt-2">
                              <span
                                className={`text-3xl font-bold ${
                                  isDark ? "text-blue-400" : "text-[#007eff]"
                                }`}
                              >
                                {plan.priceStr}
                              </span>
                              <span
                                className={`text-xs font-medium ml-1 ${
                                  isDark ? "text-slate-400" : "text-slate-500"
                                }`}
                              >
                                / মাস
                              </span>
                            </div>
                          </div>

                          <div
                            className={`pt-3 border-t text-xs font-semibold ${
                              isDark
                                ? "border-slate-800 text-slate-300"
                                : "border-slate-200/80 text-slate-700"
                            }`}
                          >
                            ✓ {plan.visitsStr}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-slate-500 text-xs sm:text-sm font-semibold space-y-2">
                    <Loader2 className="w-6 h-6 text-[#007eff] animate-spin mx-auto" />
                    <p>Loading pricing packages from database...</p>
                  </div>
                )}

                {/* Optional Extra Add-ons Selection (100% Dynamic) */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Optional Add-on Extras (অতিরিক্ত সুবিধাসমূহ)
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        প্রয়োজন অনুযায়ী আপনার প্যাকেজে সাব-সার্ভিস যুক্ত করতে পারেন।
                      </p>
                    </div>

                    {isPremium && (
                      <span className="text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 self-start sm:self-auto flex items-center gap-1">
                        🎁 PREMIUM PRIVILEGE: ALL ADD-ONS 100% FREE!
                      </span>
                    )}
                  </div>

                  {isPremium && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-950 flex items-center gap-2.5 animate-in fade-in">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>
                        VIP Care Advantage: Premium Plan (৳৩০,০০০/মাস) এর সাথে ওভেন, ফ্রিজ ও ডিপ স্যানিটাইজেশন সম্পূর্ণ বিনামূল্যে যুক্ত থাকবে!
                      </span>
                    </div>
                  )}

                  {addonsList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {addonsList.map((addon) => {
                        const isChecked = selectedAddonIds.includes(addon.id);

                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddon(addon.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isChecked
                                ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 shadow-xs"
                                : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {addon.icon ? (
                                addon.icon.startsWith("http") || addon.icon.startsWith("/") || addon.icon.startsWith("data:") ? (
                                  <img src={addon.icon} alt={addon.name} className="w-8 h-8 object-contain rounded-lg flex-shrink-0" />
                                ) : (
                                  <span className="text-2xl flex-shrink-0">{addon.icon}</span>
                                )
                              ) : (
                                <Sparkles className="w-6 h-6 text-[#007eff] flex-shrink-0" />
                              )}
                              <div className="min-w-0 space-y-0.5">
                                <p className="font-bold text-xs text-slate-900 truncate">{addon.nameBn}</p>
                                <p className="text-[11px] font-semibold text-slate-500 truncate">{addon.desc}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isPremium ? (
                                <span className="font-bold text-[10px] px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 uppercase">
                                  FREE (INCLUDED)
                                </span>
                              ) : (
                                <span className="font-bold text-xs text-emerald-700">+{addon.priceStr}</span>
                              )}
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                  isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                                }`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[2]" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs font-semibold">
                      No Add-on Extras available at the moment.
                    </div>
                  )}
                </div>

                {/* Step 1 Action Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToStep2}
                    className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#007eff] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Next: Address &amp; Schedule</span>
                    <ChevronRight className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS & SCHEDULE (SEARCHABLE COMBBOX ZONE + CUSTOM CALENDAR) */}
            {currentStep === 2 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                    <MapPin className="w-5 h-5 text-red-500" /> Step 2: Location &amp; First Visit Schedule
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                    আপনার ঢাকা কাভারেজ এরিয়া, বাসার ঠিকানা এবং প্রথম ক্লিনিং ভিজিটের পছন্দসই সময় নির্বাচন করুন।
                  </p>
                </div>

                <div className="space-y-6 text-xs sm:text-sm">
                  {/* Ultra-Modern Searchable Zone Combobox Component */}
                  <div className="space-y-2 relative" ref={zoneDropdownRef}>
                    <label className="font-bold text-slate-800 flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-red-500" /> Select Dhaka Coverage Zone (এলাকা খুঁজুন):
                      </span>
                      {selectedZoneObj && (
                        <span className="text-[11px] font-bold text-[#007eff] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                          ✓ {selectedZoneObj.district}
                        </span>
                      )}
                    </label>

                    {/* Combobox Trigger Button with mt-2 */}
                    <button
                      type="button"
                      onClick={() => setIsZoneDropdownOpen((prev) => !prev)}
                      className="w-full mt-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-[#007eff] rounded-2xl p-4 text-left font-bold text-slate-900 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm">
                          {selectedZoneObj ? `${selectedZoneObj.name}` : "Search & Select Dhaka Coverage Area..."}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                          isZoneDropdownOpen ? "rotate-180 text-[#007eff]" : ""
                        }`}
                      />
                    </button>

                    {/* Searchable Dropdown Popover Menu */}
                    {isZoneDropdownOpen && (
                      <div
                        data-lenis-prevent="true"
                        data-lenis-prevent-wheel="true"
                        data-lenis-prevent-touch="true"
                        className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 space-y-2 p-3.5"
                      >
                        {/* Instant Search Bar with mt-2 */}
                        <div className="relative flex items-center mt-2">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                          <input
                            type="text"
                            value={zoneSearchQuery}
                            onChange={(e) => setZoneSearchQuery(e.target.value)}
                            placeholder="Type area name (e.g. Gulshan, Uttara, Banani, Mirpur)..."
                            autoFocus
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                          />
                          {zoneSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setZoneSearchQuery("")}
                              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Filtered Zones Results List */}
                        <div
                          data-lenis-prevent="true"
                          data-lenis-prevent-wheel="true"
                          data-lenis-prevent-touch="true"
                          className="max-h-64 overflow-y-auto space-y-1 pr-1 scroll-smooth"
                        >
                          {filteredZones.length > 0 ? (
                            filteredZones.map((zone) => {
                              const isSelected = selectedZone === zone.id;
                              return (
                                <div
                                  key={zone.id}
                                  onClick={() => {
                                    setValidationError("");
                                    setValue("selectedZone", zone.id);
                                    setIsZoneDropdownOpen(false);
                                    setZoneSearchQuery("");
                                  }}
                                  className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs sm:text-sm font-bold ${
                                    isSelected
                                      ? "bg-blue-50 text-[#007eff] border border-blue-200 shadow-xs"
                                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <MapPin className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-[#007eff]" : "text-slate-400"}`} />
                                    <span className="truncate">{zone.name}</span>
                                  </div>
                                  {isSelected && <Check className="w-4 h-4 text-[#007eff] stroke-[2] flex-shrink-0" />}
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-5 text-center text-xs text-slate-400 font-semibold italic space-y-1">
                              <p>No coverage zones matching "{zoneSearchQuery}" found.</p>
                              <p className="text-[11px] text-slate-400 font-normal">Try searching with another keyword.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Street Address Input with mt-2 */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 block"> Complete House &amp; Building Address (পূর্ণাঙ্গ ঠিকানা):</label>
                    <textarea
                      rows={2}
                      {...register("streetAddress")}
                      onChange={(e) => {
                        setValidationError("");
                        register("streetAddress").onChange(e);
                      }}
                      placeholder="e.g. House 42, Road 11, Block D, Flat 5B, Gulshan-2, Dhaka"
                      className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-semibold focus:outline-none focus:border-[#007eff] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Custom Cleanix Interactive Calendar Component */}
                  <div className="space-y-2 relative" ref={calendarRef}>
                    <label className="font-bold text-slate-800 flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#007eff]" /> Select First Cleaning Date (প্রথম ভিজিটের তারিখ):
                      </span>
                      {firstVisitDate && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          ✓ {firstVisitDate}
                        </span>
                      )}
                    </label>

                    {/* Custom Calendar Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen((prev) => !prev)}
                      className="w-full mt-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-[#007eff] rounded-2xl p-4 text-left font-bold text-slate-900 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#007eff] flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {formatDisplayDate(firstVisitDate)}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500">
                            প্রথম ক্লিনিং সার্ভিস টিম পৌঁছানোর তারিখ
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                          isCalendarOpen ? "rotate-180 text-[#007eff]" : ""
                        }`}
                      />
                    </button>

                    {/* Custom Popover Calendar Dialog */}
                    {isCalendarOpen && (
                      <div
                        data-lenis-prevent="true"
                        data-lenis-prevent-wheel="true"
                        data-lenis-prevent-touch="true"
                        className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-5 space-y-4 max-w-sm sm:max-w-md mx-auto"
                      >
                        {/* Quick Date Shortcuts */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                          {[
                            { label: "Today", getVal: () => new Date() },
                            { label: "Tomorrow", getVal: () => { const d = new Date(); d.setDate(d.getDate() + 1); return d; } },
                            { label: "+3 Days", getVal: () => { const d = new Date(); d.setDate(d.getDate() + 3); return d; } },
                            { label: "Next Week", getVal: () => { const d = new Date(); d.setDate(d.getDate() + 7); return d; } },
                          ].map((sc) => {
                            const dateObj = sc.getVal();
                            const yyyy = dateObj.getFullYear();
                            const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                            const dd = String(dateObj.getDate()).padStart(2, "0");
                            const formattedStr = `${yyyy}-${mm}-${dd}`;
                            const isSelected = firstVisitDate === formattedStr;

                            return (
                              <button
                                key={sc.label}
                                type="button"
                                onClick={() => {
                                  setValue("firstVisitDate", formattedStr);
                                  setValidationError("");
                                  setIsCalendarOpen(false);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                  isSelected
                                    ? "bg-[#007eff] text-white shadow-xs"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }`}
                              >
                                {sc.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Calendar Month Navigation Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <button
                            type="button"
                            onClick={() => {
                              const newDate = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
                              setCalMonth(newDate);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4 stroke-[2]" />
                          </button>

                          <span className="font-bold text-sm text-slate-900">
                            {calMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              const newDate = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
                              setCalMonth(newDate);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4 stroke-[2]" />
                          </button>
                        </div>

                        {/* Days of Week Label Header Row */}
                        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 uppercase">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                            <div key={d} className="py-1">{d}</div>
                          ))}
                        </div>

                        {/* Interactive Calendar Days Grid */}
                        <div className="grid grid-cols-7 gap-1.5 text-xs text-center font-bold">
                          {calendarGridDays.map((item, idx) => {
                            if (!item) {
                              return <div key={`empty-${idx}`} className="p-2" />;
                            }

                            const { dayNum, fullStr, isPast, isToday, isSelected } = item;

                            return (
                              <button
                                key={fullStr}
                                type="button"
                                disabled={isPast}
                                onClick={() => {
                                  setValue("firstVisitDate", fullStr);
                                  setValidationError("");
                                  setIsCalendarOpen(false);
                                }}
                                className={`py-2 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                                  isSelected
                                    ? "bg-[#007eff] text-white font-bold shadow-md shadow-blue-500/25 scale-105"
                                    : isPast
                                    ? "text-slate-300 opacity-40 cursor-not-allowed"
                                    : "text-slate-800 hover:bg-blue-50 hover:text-[#007eff]"
                                }`}
                              >
                                <span>{dayNum}</span>
                                {isToday && !isSelected && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#007eff] absolute bottom-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Time Slot Cards */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" /> Preferred Time Slot (পছন্দের সময় স্লট):
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 mt-2">
                      {TIME_SLOT_OPTIONS.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        const IconComp = slot.icon;

                        return (
                          <div
                            key={slot.id}
                            onClick={() => setValue("selectedSlotId", slot.id)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                              isSelected
                                ? "bg-blue-50/70 border-[#007eff] ring-2 ring-blue-500/20 shadow-xs"
                                : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <IconComp className={`w-5 h-5 ${isSelected ? "text-[#007eff]" : "text-slate-500"}`} />
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? "bg-[#007eff] border-[#007eff] text-white" : "border-slate-300"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[2]" />}
                              </div>
                            </div>

                            <div>
                              <p className="font-bold text-slate-900 text-xs">{slot.label}</p>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{slot.titleBn}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Special Crew Instructions with mt-2 */}
                  <div className="space-y-2 pt-2">
                    <label className="font-bold text-slate-800 block"> Special Directions / Note (ঐচ্ছিক নির্দেশনা):</label>
                    <input
                      type="text"
                      {...register("specialInstructions")}
                      placeholder="e.g. Call 15 mins before arrival at main gate"
                      className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Step 2 Buttons */}
                <div className="pt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setValidationError("");
                      setCurrentStep(1);
                    }}
                    className="px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2]" />
                    <span>Back to Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#007eff] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Next: Payment Method</span>
                    <ChevronRight className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {currentStep === 3 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-emerald-600" /> Step 3: Select Payment Method
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    বাংলাদেশে ব্যবহারের জন্য আপনার সুবিধাজনক পেমেন্ট চ্যানেল সিলেক্ট করুন।
                  </p>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* bKash */}
                  <div
                    onClick={() => setValue("paymentMethod", "BKASH")}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all space-y-2 relative ${
                      paymentMethod === "BKASH"
                        ? "bg-pink-50/70 border-pink-500 ring-2 ring-pink-500/20 shadow-xs"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pink-700 text-base flex items-center gap-2">
                        <span>bKash Direct</span>
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-pink-100 text-pink-900">
                        মোবাইল ব্যাংকিং
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      bKash Merchant Account (01700-999888) এ পেমেন্ট করুন।
                    </p>
                  </div>

                  {/* Nagad */}
                  <div
                    onClick={() => setValue("paymentMethod", "NAGAD")}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all space-y-2 relative ${
                      paymentMethod === "NAGAD"
                        ? "bg-orange-50/70 border-orange-500 ring-2 ring-orange-500/20 shadow-xs"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-700 text-base">Nagad Merchant</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-900">
                        নগদ
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      Nagad Merchant Account এ ইনস্ট্যান্ট পেমেন্ট।
                    </p>
                  </div>

                  {/* SSLCommerz */}
                  <div
                    onClick={() => setValue("paymentMethod", "SSLCOMMERZ")}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all space-y-2 relative ${
                      paymentMethod === "SSLCOMMERZ"
                        ? "bg-[#007eff]/10 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700 text-base">SSLCommerz Gateway</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900">
                        কার্ড / ব্যাংক
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      Visa, MasterCard, Amex, City Bank, DBBL Cards.
                    </p>
                  </div>

                  {/* Cash on First Visit (COD) */}
                  <div
                    onClick={() => setValue("paymentMethod", "COD")}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all space-y-2 relative ${
                      paymentMethod === "COD"
                        ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 text-base">Cash on First Visit</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                        ক্যাশ অন ডেলিভারি
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      প্রথম ক্লিনিং ভিজিট শেষে টিম লিডারের কাছে নগদে দিন।
                    </p>
                  </div>
                </div>

                {/* bKash Payment Form Input Fields with mt-2 */}
                {paymentMethod === "BKASH" && (
                  <div className="p-5 rounded-2xl bg-pink-50/90 border border-pink-200 space-y-3.5 animate-in fade-in">
                    <p className="text-xs font-bold text-pink-950 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-pink-700" /> bKash Merchant Pay Instructions (01700-999888):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block">Your bKash Phone Number:</label>
                        <input
                          type="text"
                          {...register("bkashPhone")}
                          className="w-full mt-2 bg-white border border-pink-300 rounded-xl p-3 font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block">Transaction ID (TrxID):</label>
                        <input
                          type="text"
                          {...register("bkashTrxId")}
                          className="w-full mt-2 bg-white border border-pink-300 rounded-xl p-3 font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 Buttons */}
                <div className="pt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setValidationError("");
                      setCurrentStep(2);
                    }}
                    className="px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2]" />
                    <span>Back to Schedule</span>
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                    <span>Confirm &amp; Subscribe</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: ORDER CONFIRMATION & INVOICE */}
            {currentStep === 4 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 text-center animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-200 shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-12 h-12 stroke-[2]" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase tracking-wide">
                    🎉 SUBSCRIPTION CONFIRMED
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                    Thank You for Subscribing to Cleanix!
                  </h2>
                  <p className="text-slate-600 font-medium text-xs sm:text-sm max-w-lg mx-auto">
                    আপনার <span className="font-bold text-[#007eff]">{currentPlan?.title || "SELECTED PLAN"}</span> সাবস্ক্রিপশন অর্ডারটি সফলভাবে রেজিস্ট্রেশন করা হয়েছে।
                  </p>
                </div>

                {/* Digital Invoice Receipt Card */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 text-left max-w-md mx-auto space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Subscription Invoice Ref:
                      </p>
                      <p className="font-mono font-bold text-[#007eff] text-lg">#SUB-2026-9812</p>
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                      ACTIVE
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Plan Selected:</span>
                      <span className="font-bold text-slate-900">{currentPlan?.title || "CUSTOM PLAN"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Monthly Rate:</span>
                      <span className="font-bold text-slate-900">{currentPlan?.priceStr || "৳0"} / month</span>
                    </div>
                    {selectedAddonsObj.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Addon Extras:</span>
                        {isPremium ? (
                          <span className="font-bold text-emerald-700">FREE (Included)</span>
                        ) : (
                          <span className="font-bold text-slate-900">৳{addonsTotal.toLocaleString()}</span>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-emerald-700">
                      <span>Total Billed Amount:</span>
                      <span>৳{grandTotal.toLocaleString()} BDT</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1 font-medium">
                    <p>📍 Location Zone: {selectedZoneObj?.name || "Dhaka Coverage Zone"}</p>
                    <p>🗓️ First Visit Date: {formatDisplayDate(firstVisitDate)}</p>
                    <p>⏱️ Preferred Slot: {selectedSlot.label}</p>
                  </div>
                </div>

                {/* Redirect Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => alert("Simulating Invoice PDF download...")}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#007eff]" />
                    <span>Download PDF Invoice</span>
                  </button>

                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs text-white bg-[#007eff] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Go to Customer Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Billing Summary Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#007eff]" /> Order Billing Summary
                </h3>
              </div>

              {/* Selected Plan Summary Tile */}
              {currentPlan ? (
                <div
                  className={`p-4 rounded-2xl border space-y-2 ${
                    isPremium
                      ? "bg-[#001837] border-slate-800 text-white"
                      : "bg-blue-50/80 border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold text-sm uppercase ${
                        isPremium ? "text-blue-400" : "text-[#007eff]"
                      }`}
                    >
                      {currentPlan.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                        isPremium
                          ? "bg-slate-800 border-slate-700 text-slate-300"
                          : "bg-white border-blue-200 text-slate-600"
                      }`}
                    >
                      Monthly
                    </span>
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      isPremium ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {currentPlan.subtitleBn}
                  </p>
                  <div
                    className={`pt-1 text-2xl font-bold ${
                      isPremium ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {currentPlan.priceStr}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400 italic text-center">
                  Select a plan to view billing summary
                </div>
              )}

              {/* Selected Add-ons Summary List */}
              {selectedAddonsObj.length > 0 && (
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Selected Addon Extras:
                    </span>
                    {isPremium && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        FREE IN PREMIUM
                      </span>
                    )}
                  </div>
                  {selectedAddonsObj.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between font-bold text-slate-800">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span>{addon.icon}</span>
                        <span className="truncate">{addon.nameBn}</span>
                      </span>
                      {isPremium ? (
                        <span className="text-emerald-700 font-bold text-[11px]">FREE (৳0)</span>
                      ) : (
                        <span>+{addon.priceStr}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing Breakdown Ledger */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Base Plan Rate:</span>
                  <span className="font-bold text-slate-900">৳{(currentPlan?.price || 0).toLocaleString()}</span>
                </div>

                {selectedAddonsObj.length > 0 && (
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Add-ons Subtotal:</span>
                    {isPremium ? (
                      <span className="font-bold text-emerald-700">FREE (৳0)</span>
                    ) : (
                      <span className="font-bold text-slate-900">৳{addonsTotal.toLocaleString()}</span>
                    )}
                  </div>
                )}

                <div className="flex justify-between font-medium text-slate-600">
                  <span>Platform VAT &amp; Tax:</span>
                  <span className="font-bold text-emerald-700">INCLUDED (0%)</span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-emerald-700 font-mono text-lg">৳{grandTotal.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Guarantees & Hotline Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Quality &amp; Safety Guarantee</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  সার্টিফাইড ইকো-ফ্রেন্ডলি কেমিক্যাল ও প্রশিক্ষিত ক্লিনিং স্টাফ দিয়ে সার্ভিস প্রদান নিশ্চিত করা হয়।
                </p>

                <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-slate-800 font-bold text-[11px]">
                  <PhoneCall className="w-3.5 h-3.5 text-[#007eff]" />
                  <span>Displacement Hotline: +880 1700-999888</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
