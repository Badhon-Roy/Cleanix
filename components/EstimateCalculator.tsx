"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Calculator,
  Check,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Sofa,
  UtensilsCrossed,
  Wind,
  ShieldAlert,
  Building2,
  Layers,
  BedDouble,
  Bath,
  Maximize2,
  Tag,
  Zap,
  Loader2,
} from "lucide-react";
import { io } from "socket.io-client";
import { fetchActiveAddonsAPI } from "@/services/addonService";
import {
  fetchPricingConfigAPI,
  IBookingPriceBreakdown,
} from "@/services/pricingService";
import { fetchActiveServicesAPI } from "@/services/serviceCategoryService";

interface EstimateCalculatorProps {
  initialServices?: any[];
  initialAddons?: any[];
  initialPricing?: any;
}

export default function EstimateCalculator({
  initialServices = [],
  initialAddons = [],
  initialPricing,
}: EstimateCalculatorProps) {
  // 1. Core Services State (Dynamic from MongoDB)
  const [coreServicesList, setCoreServicesList] = useState<any[]>(
    initialServices || []
  );
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>(() => {
    if (initialServices && initialServices.length > 0) {
      return (
        initialServices[0].slug ||
        initialServices[0].category ||
        initialServices[0]._id ||
        ""
      );
    }
    return "";
  });

  // 2. Dynamic Custom Field Values Record
  const [customFieldValues, setCustomFieldValues] = useState<
    Record<string, any>
  >({});

  // 3. Dynamic Add-ons State (Dynamic from MongoDB)
  const [addonsCatalog, setAddonsCatalog] = useState<any[]>(
    initialAddons || []
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // 4. Dynamic Pricing Multipliers Configuration
  const [pricingConfig, setPricingConfig] = useState<{
    baseFee: number;
    sqftRate: number;
    bedroomRate: number;
    bathroomRate: number;
  }>(() => ({
    baseFee: Number(initialPricing?.baseFee) || 1500,
    sqftRate: Number(initialPricing?.sqftRate) || 2.5,
    bedroomRate: Number(initialPricing?.bedroomRate) || 500,
    bathroomRate: Number(initialPricing?.bathroomRate) || 400,
  }));

  // 5. Real-time Backend Price Breakdown State
  const [priceBreakdown, setPriceBreakdown] =
    useState<IBookingPriceBreakdown | null>(null);
  const priceSocketRef = useRef<any>(null);

  // Synchronize initial props if updated from SSR
  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      setCoreServicesList(initialServices);
      if (!selectedServiceSlug) {
        setSelectedServiceSlug(
          initialServices[0].slug ||
            initialServices[0].category ||
            initialServices[0]._id ||
            ""
        );
      }
    }
  }, [initialServices, selectedServiceSlug]);

  useEffect(() => {
    if (initialAddons && initialAddons.length > 0) {
      setAddonsCatalog(initialAddons);
    }
  }, [initialAddons]);

  useEffect(() => {
    if (initialPricing) {
      setPricingConfig({
        baseFee: Number(initialPricing.baseFee) || 1500,
        sqftRate: Number(initialPricing.sqftRate) || 2.5,
        bedroomRate: Number(initialPricing.bedroomRate) || 500,
        bathroomRate: Number(initialPricing.bathroomRate) || 400,
      });
    }
  }, [initialPricing]);

  // Initial Client-side Fetching (Services, Pricing & Addons)
  useEffect(() => {
    // A. Fetch Active Core Services
    fetchActiveServicesAPI()
      .then((res) => {
        if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
          setCoreServicesList(res.data);
          setSelectedServiceSlug((prev) => {
            if (prev) return prev;
            return (
              res.data[0].slug ||
              res.data[0].category ||
              res.data[0]._id ||
              ""
            );
          });
        }
      })
      .catch(() => {});

    // B. Fetch Pricing Config
    fetchPricingConfigAPI()
      .then((res) => {
        if (res?.success && res?.data) {
          setPricingConfig({
            baseFee: Number(res.data.baseFee) || 1500,
            sqftRate: Number(res.data.sqftRate) || 2.5,
            bedroomRate: Number(res.data.bedroomRate) || 500,
            bathroomRate: Number(res.data.bathroomRate) || 400,
          });
        }
      })
      .catch(() => {});

    // C. Fetch Addons
    fetchActiveAddonsAPI()
      .then((res) => {
        if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
          setAddonsCatalog(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Real-time Socket.io Listeners (Pricing, Addons, Services, Calculations)
  useEffect(() => {
    let socket: any = null;
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
        "http://localhost:5000";

      socket = io(serverUrl, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      priceSocketRef.current = socket;

      // Real-time pricing config update
      socket.on("pricing_updated", (data: any) => {
        if (data && typeof data === "object") {
          setPricingConfig({
            baseFee: Number(data.baseFee) || 1500,
            sqftRate: Number(data.sqftRate) || 2.5,
            bedroomRate: Number(data.bedroomRate) || 500,
            bathroomRate: Number(data.bathroomRate) || 400,
          });
        } else {
          fetchPricingConfigAPI().then((res) => {
            if (res?.success && res?.data) {
              setPricingConfig({
                baseFee: Number(res.data.baseFee) || 1500,
                sqftRate: Number(res.data.sqftRate) || 2.5,
                bedroomRate: Number(res.data.bedroomRate) || 500,
                bathroomRate: Number(res.data.bathroomRate) || 400,
              });
            }
          });
        }
      });

      // Real-time addons catalog update
      socket.on("addon_updated", () => {
        fetchActiveAddonsAPI().then((res) => {
          if (res?.success && Array.isArray(res?.data)) {
            setAddonsCatalog(res.data);
          }
        });
      });

      // Real-time core services catalog update
      socket.on("service_catalog_updated", () => {
        fetchActiveServicesAPI().then((res) => {
          if (res?.success && Array.isArray(res?.data)) {
            setCoreServicesList(res.data);
          }
        });
      });

      // Real-time backend price calculation response
      socket.on(
        "booking_price_result",
        (res: { success: boolean; data?: IBookingPriceBreakdown }) => {
          if (res?.success && res?.data) {
            setPriceBreakdown(res.data);
          }
        }
      );
    } catch (e) {
      console.error("Socket error in EstimateCalculator:", e);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Find currently selected service object
  const selectedServiceObj = useMemo(() => {
    if (!coreServicesList || coreServicesList.length === 0) return null;
    return (
      coreServicesList.find(
        (s) =>
          s.slug === selectedServiceSlug ||
          s.category === selectedServiceSlug ||
          s._id === selectedServiceSlug
      ) || coreServicesList[0]
    );
  }, [coreServicesList, selectedServiceSlug]);

  // Synchronize customFieldValues whenever selectedServiceObj changes
  useEffect(() => {
    if (!selectedServiceObj) return;
    const fields = selectedServiceObj.fields || [];
    setCustomFieldValues((prev) => {
      const next: Record<string, any> = { ...prev };
      fields.forEach((f: any) => {
        if (next[f.id] === undefined || next[f.id] === null) {
          if (f.fieldType === "NUMBER") {
            next[f.id] =
              f.defaultValue ??
              (f.unit?.toLowerCase().includes("sqft") || f.id === "sqft"
                ? 1200
                : 100);
          } else if (f.fieldType === "COUNTER") {
            next[f.id] =
              f.defaultValue ??
              (f.id === "bedrooms" ? 3 : f.id === "bathrooms" ? 2 : 1);
          } else if (f.fieldType === "SELECT" || f.fieldType === "RADIO") {
            next[f.id] = f.defaultValue || f.options?.[0]?.value || "";
          } else {
            next[f.id] = f.defaultValue ?? "";
          }
        }
      });
      return next;
    });
  }, [selectedServiceSlug, selectedServiceObj]);

  // Handle custom field change
  const handleCustomFieldValueChange = (fieldId: string, val: any) => {
    setCustomFieldValues((prev) => ({ ...prev, [fieldId]: val }));
  };

  // Emit calculation to backend on input change
  useEffect(() => {
    if (!priceSocketRef.current || !selectedServiceObj) return;
    const activeAddonSlugs = selectedAddons;
    priceSocketRef.current.emit("calculate_booking_price", {
      serviceSlug: selectedServiceObj.slug || selectedServiceSlug,
      sqft: customFieldValues["sqft"] ?? 1200,
      bedrooms: customFieldValues["bedrooms"] ?? 3,
      bathrooms: customFieldValues["bathrooms"] ?? 2,
      customFieldValues: customFieldValues,
      selectedAddons: activeAddonSlugs,
    });
  }, [selectedServiceSlug, selectedServiceObj, customFieldValues, selectedAddons]);

  // Toggle addon selection
  const toggleAddon = (slugOrId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(slugOrId)
        ? prev.filter((item) => item !== slugOrId)
        : [...prev, slugOrId]
    );
  };

  // Helper for dynamic field icons
  const getFieldIcon = (fieldId: string, label: string) => {
    const key = `${fieldId} ${label}`.toLowerCase();
    if (key.includes("sqft") || key.includes("size") || key.includes("area"))
      return <Maximize2 className="w-5 h-5 stroke-[2.5]" />;
    if (key.includes("bed") || key.includes("room"))
      return <BedDouble className="w-5 h-5 stroke-[2.5]" />;
    if (key.includes("bath") || key.includes("restroom"))
      return <Bath className="w-5 h-5 stroke-[2.5]" />;
    if (key.includes("desk") || key.includes("workstation") || key.includes("office"))
      return <Building2 className="w-5 h-5 stroke-[2.5]" />;
    if (key.includes("floor"))
      return <Layers className="w-5 h-5 stroke-[2.5]" />;
    if (key.includes("window") || key.includes("glass"))
      return <Sparkles className="w-5 h-5 stroke-[2.5]" />;
    return <Zap className="w-5 h-5 stroke-[2.5]" />;
  };

  // Helper for addon icons
  const getAddonIcon = (name: string, iconName?: string) => {
    const key = `${iconName || ""} ${name}`.toLowerCase();
    if (key.includes("sofa") || key.includes("carpet"))
      return <Sofa className="w-4 h-4" />;
    if (key.includes("oven") || key.includes("kitchen"))
      return <UtensilsCrossed className="w-4 h-4" />;
    if (key.includes("fridge") || key.includes("refrigerator"))
      return <Wind className="w-4 h-4" />;
    if (key.includes("window") || key.includes("glass"))
      return <Sparkles className="w-4 h-4" />;
    if (key.includes("pet")) return <ShieldAlert className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  // Extract enabled fields for current service
  const activeFields = useMemo(() => {
    return Array.isArray(selectedServiceObj?.fields)
      ? selectedServiceObj.fields.filter((f: any) => f.enabled !== false)
      : [];
  }, [selectedServiceObj]);

  const numberFields = activeFields.filter((f: any) => f.fieldType === "NUMBER");
  const counterFields = activeFields.filter((f: any) => f.fieldType === "COUNTER");
  const selectFields = activeFields.filter(
    (f: any) => f.fieldType === "SELECT" || f.fieldType === "RADIO"
  );

  // Compute live breakdown & total
  const baseFee = priceBreakdown?.baseFee ?? (pricingConfig.baseFee || 1500);

  // Calculate dynamic breakdown items for each field
  const calculatedItems = useMemo(() => {
    return activeFields.map((field: any) => {
      const val = customFieldValues[field.id];
      if (field.fieldType === "NUMBER") {
        const numVal =
          Number(
            val ??
              (field.defaultValue !== undefined
                ? field.defaultValue
                : field.id === "sqft"
                ? 1200
                : 100)
          ) || 0;
        const rate = Number(
          field.unitPrice ??
            (field.id === "sqft" ? pricingConfig.sqftRate : 2.5)
        );
        const cost = Math.round(numVal * rate);
        return {
          id: field.id,
          label: `${field.label || "Area"} (${numVal.toLocaleString()} ${
            field.unit || "SqFt"
          } × ৳${rate}):`,
          cost,
        };
      }
      if (field.fieldType === "COUNTER") {
        const countVal =
          Number(
            val ??
              (field.defaultValue !== undefined
                ? field.defaultValue
                : field.id === "bedrooms"
                ? 3
                : field.id === "bathrooms"
                ? 2
                : 1)
          ) || 0;
        const rate = Number(
          field.unitPrice ??
            (field.id === "bedrooms"
              ? pricingConfig.bedroomRate
              : field.id === "bathrooms"
              ? pricingConfig.bathroomRate
              : 0)
        );
        const cost = Math.round(countVal * rate);
        return {
          id: field.id,
          label: `${field.label || "Count"} (${countVal} ${
            field.unit || "Unit"
          }):`,
          cost,
        };
      }
      if (field.fieldType === "SELECT" || field.fieldType === "RADIO") {
        const selectedOpt =
          (field.options || []).find(
            (opt: any) => String(opt.value) === String(val)
          ) || field.options?.[0];
        const cost = Number(selectedOpt?.price || 0);
        return {
          id: field.id,
          label: `${field.label || "Option"} (${
            selectedOpt?.label || "Standard"
          }):`,
          cost,
        };
      }
      return { id: field.id, label: field.label, cost: 0 };
    });
  }, [activeFields, customFieldValues, pricingConfig]);

  const fieldsTotalCost = calculatedItems.reduce(
    (sum: number, item: { id: string; label: string; cost: number }) =>
      sum + item.cost,
    0
  );

  const addonsCost = useMemo(() => {
    if (priceBreakdown?.addonsTotal !== undefined) {
      return priceBreakdown.addonsTotal;
    }
    return selectedAddons.reduce((acc, slug) => {
      const addon = addonsCatalog.find(
        (a) => (a.slug || a.id || a._id) === slug
      );
      return acc + (addon ? Number(addon.price) || 0 : 0);
    }, 0);
  }, [priceBreakdown, selectedAddons, addonsCatalog]);

  const totalEstimate = useMemo(() => {
    if (
      priceBreakdown?.totalAmount !== undefined &&
      priceBreakdown.totalAmount > 0
    ) {
      return priceBreakdown.totalAmount;
    }
    return Math.round(baseFee + fieldsTotalCost + addonsCost);
  }, [priceBreakdown, baseFee, fieldsTotalCost, addonsCost]);

  // Construct target link to /dashboard/new-booking with dynamic parameters
  const bookingUrl = useMemo(() => {
    const slug = selectedServiceObj?.slug || selectedServiceSlug;
    const params = new URLSearchParams();
    if (slug) params.set("service", slug);
    if (customFieldValues["sqft"] !== undefined) {
      params.set("sqft", String(customFieldValues["sqft"]));
    }
    if (customFieldValues["bedrooms"] !== undefined) {
      params.set("bedrooms", String(customFieldValues["bedrooms"]));
    }
    if (customFieldValues["bathrooms"] !== undefined) {
      params.set("bathrooms", String(customFieldValues["bathrooms"]));
    }
    if (selectedAddons.length > 0) {
      params.set("addons", selectedAddons.join(","));
    }
    return `/dashboard/new-booking?${params.toString()}`;
  }, [selectedServiceObj, selectedServiceSlug, customFieldValues, selectedAddons]);

  return (
    <section className="w-full bg-[#f8fafc] text-[#001837] py-14 md:py-20 px-4 sm:px-6 lg:px-12 border-t border-slate-100">
      <div className="container mx-auto bg-white text-[#001837] rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xl relative">
        {/* Subtle Background Radial Accent Glow in isolated overflow container */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#007eff]/10 rounded-full blur-[140px]" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Calculation Controls Part (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-4 py-1.5 mb-3 bg-blue-50/60 backdrop-blur-md">
                <Calculator className="w-3.5 h-3.5 text-[#007eff]" />
                <span>CUSTOM INSTANT ESTIMATE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#001837] tracking-tight">
                CALCULATE YOUR <span className="text-[#007eff]">CLEANING COST</span>
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
                সার্ভিস ক্যাটাগরি, স্পেসের সাইজ ও রুমের কনফিগারেশন অনুযায়ী স্বয়ংক্রিয়ভাবে সার্ভিস খরচের হিসাব দেখে নিন।
              </p>
            </div>

            {/* STEP 1: Service Category Selection */}
            {coreServicesList.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#007eff] text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    Select Service Category (সার্ভিস ক্যাটাগরি)
                  </span>
                  <span className="text-[11px] font-bold text-[#007eff] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    ধাপ ১ / ৩
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {coreServicesList.map((srv: any) => {
                    const slugKey = srv.slug || srv.category || srv._id;
                    const isSelected =
                      (selectedServiceObj?.slug || selectedServiceSlug) ===
                      slugKey;
                    return (
                      <button
                        key={srv._id || slugKey}
                        type="button"
                        onClick={() => setSelectedServiceSlug(slugKey)}
                        className={`group relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 min-h-[130px] border ${
                          isSelected
                            ? "bg-gradient-to-r from-[#007eff] via-blue-600 to-blue-700 text-white border-[#007eff] shadow-lg scale-[1.02]"
                            : "border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        {isSelected ? (
                          <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-white text-[#007eff] flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          srv.badge && (
                            <span className="absolute top-3.5 right-3.5 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              {srv.badge}
                            </span>
                          )
                        )}

                        <div className="pt-4">
                          <p
                            className={`text-sm font-black leading-snug tracking-tight ${
                              isSelected
                                ? "text-white"
                                : "text-slate-900 group-hover:text-[#007eff]"
                            }`}
                          >
                            {srv.title?.split("(")[0]?.trim() || srv.name}
                          </p>
                          <p
                            className={`text-[11px] font-medium mt-1.5 line-clamp-2 ${
                              isSelected ? "text-blue-100" : "text-slate-500"
                            }`}
                          >
                            {srv.shortDesc || "নিখুঁত ও প্রফেশনাল ডিপ ক্লিন"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#007eff]" />
                <span className="text-xs font-semibold">
                  সার্ভিস ক্যাটালগ লোড হচ্ছে...
                </span>
              </div>
            )}

            {/* STEP 2: Property Size & Dynamic Room Configuration */}
            {activeFields.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#007eff] text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    Property Size &amp; Room Configuration (স্পেসের মাপ ও কনফিগারেশন)
                  </span>
                  <span className="text-[11px] font-bold text-[#007eff] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    ধাপ ২ / ৩
                  </span>
                </div>

                {/* Dynamic Inputs Render */}
                <div className="space-y-5">
                  {/* NUMBER FIELDS (Property Size Slider & Input) */}
                  {numberFields.map((field: any) => {
                    const currentVal =
                      Number(
                        customFieldValues[field.id] ??
                          (field.defaultValue !== undefined
                            ? field.defaultValue
                            : field.id === "sqft"
                            ? 1200
                            : 100)
                      ) || 0;
                    const isSqft =
                      field.id === "sqft" ||
                      field.unit?.toLowerCase().includes("sqft");

                    return (
                      <div
                        key={field.id}
                        className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100/90 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-[#007eff] flex items-center justify-center shrink-0 shadow-2xs">
                              {getFieldIcon(field.id, field.label)}
                            </div>
                            <div>
                              <h4 className="text-sm sm:text-base font-black text-slate-900">
                                {field.label}
                              </h4>
                              <p className="text-xs text-slate-600 font-medium mt-0.5">
                                রেট: ৳
                                {field.unitPrice ??
                                  (field.id === "sqft"
                                    ? pricingConfig.sqftRate
                                    : 2.5)}{" "}
                                {field.unit
                                  ? `প্রতি ${field.unit}`
                                  : "প্রতি ইউনিট"}{" "}
                                (ইনপুট বা স্লাইডার ব্যবহার করুন)
                              </p>
                            </div>
                          </div>

                          <div className="bg-white border-2 border-[#007eff] px-3.5 py-1.5 rounded-xl text-center flex items-center gap-2 self-start sm:self-auto shadow-2xs">
                            <input
                              type="number"
                              min={0}
                              max={50000}
                              value={currentVal === 0 ? "" : currentVal}
                              onChange={(e) => {
                                const val =
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value);
                                if (!isNaN(val)) {
                                  handleCustomFieldValueChange(field.id, val);
                                }
                              }}
                              className="w-24 text-xl sm:text-2xl font-black text-[#007eff] bg-transparent text-right focus:outline-none font-mono"
                            />
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                              {field.unit || "SqFt"}
                            </span>
                          </div>
                        </div>

                        {isSqft && (
                          <div className="space-y-1.5 pt-1">
                            <input
                              type="range"
                              min={300}
                              max={8000}
                              step={50}
                              value={Math.min(8000, Math.max(300, currentVal))}
                              onChange={(e) =>
                                handleCustomFieldValueChange(
                                  field.id,
                                  Number(e.target.value)
                                )
                              }
                              className="w-full h-2.5 bg-slate-200 rounded-xl appearance-none cursor-pointer accent-[#007eff]"
                            />
                            <div className="flex justify-between text-[11px] font-bold text-slate-500">
                              <span>300 {field.unit || "SqFt"} (ছোট স্পেস)</span>
                              <span>4,000 {field.unit || "SqFt"} (মাঝারি অফিস)</span>
                              <span>8,000 {field.unit || "SqFt"} (বড় স্পেস)</span>
                            </div>
                          </div>
                        )}

                        {isSqft && (
                          <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-500 mr-1">
                              দ্রুত নির্বাচন করুন:
                            </span>
                            {[
                              {
                                label: `600 ${field.unit || "SqFt"}`,
                                val: 600,
                              },
                              {
                                label: `1,200 ${field.unit || "SqFt"}`,
                                val: 1200,
                              },
                              {
                                label: `2,000 ${field.unit || "SqFt"}`,
                                val: 2000,
                              },
                              {
                                label: `3,500 ${field.unit || "SqFt"}`,
                                val: 3500,
                              },
                              {
                                label: `5,000 ${field.unit || "SqFt"}`,
                                val: 5000,
                              },
                            ].map((preset) => (
                              <button
                                key={preset.val}
                                type="button"
                                onClick={() =>
                                  handleCustomFieldValueChange(
                                    field.id,
                                    preset.val
                                  )
                                }
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                  currentVal === preset.val
                                    ? "bg-[#007eff] text-white border-[#007eff] shadow-2xs"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* COUNTER FIELDS (Bedrooms, Bathrooms, Workstations, Glass Windows, Floors) */}
                  {counterFields.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {counterFields.map((field: any) => {
                        const countVal =
                          Number(
                            customFieldValues[field.id] ??
                              (field.defaultValue !== undefined
                                ? field.defaultValue
                                : field.id === "bedrooms"
                                ? 3
                                : field.id === "bathrooms"
                                ? 2
                                : 1)
                          ) || 0;
                        const rate = Number(
                          field.unitPrice ??
                            (field.id === "bedrooms"
                              ? pricingConfig.bedroomRate
                              : field.id === "bathrooms"
                              ? pricingConfig.bathroomRate
                              : 0)
                        );
                        return (
                          <div
                            key={field.id}
                            className="bg-slate-50 border border-slate-200/90 p-4 rounded-2xl flex items-center justify-between transition-all hover:border-slate-300"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#007eff] flex items-center justify-center shrink-0 shadow-2xs">
                                {getFieldIcon(field.id, field.label)}
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                  {field.label}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                  ৳{rate} / {field.unit || "Unit"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                              <button
                                type="button"
                                onClick={() =>
                                  handleCustomFieldValueChange(
                                    field.id,
                                    Math.max(0, countVal - 1)
                                  )
                                }
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#007eff] hover:text-white text-slate-800 flex items-center justify-center font-bold transition-colors cursor-pointer"
                                aria-label="Decrease"
                              >
                                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                              <span className="text-base font-black text-slate-900 w-6 text-center font-mono">
                                {countVal}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCustomFieldValueChange(
                                    field.id,
                                    countVal + 1
                                  )
                                }
                                className="w-7 h-7 rounded-lg bg-[#007eff] hover:bg-[#0066ee] text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                                aria-label="Increase"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* SELECT / RADIO FIELDS (Cleaning Level, Construction Stage, Debris Level, Property Status) */}
                  {selectFields.map((field: any) => {
                    const selectedOptVal = String(
                      customFieldValues[field.id] ??
                        field.defaultValue ??
                        field.options?.[0]?.value ??
                        ""
                    );
                    return (
                      <div
                        key={field.id}
                        className="bg-slate-50 border border-slate-200/90 p-4 sm:p-5 rounded-2xl space-y-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#007eff] flex items-center justify-center shrink-0 shadow-2xs">
                            <Tag className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {field.label}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              অপশন নির্বাচন করুন:
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {(field.options || []).map((opt: any) => {
                            const isOptSelected =
                              selectedOptVal === String(opt.value);
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() =>
                                  handleCustomFieldValueChange(
                                    field.id,
                                    opt.value
                                  )
                                }
                                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                                  isOptSelected
                                    ? "bg-blue-50/90 border-2 border-[#007eff] text-[#007eff] font-bold shadow-2xs"
                                    : "bg-white border-slate-200 text-slate-700 font-semibold hover:border-slate-300"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold truncate">
                                    {opt.label}
                                  </span>
                                  {isOptSelected && (
                                    <Check className="w-3.5 h-3.5 text-[#007eff] stroke-[3]" />
                                  )}
                                </div>
                                <span
                                  className={`text-[11px] font-mono font-black ${
                                    isOptSelected
                                      ? "text-[#007eff]"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {opt.price > 0
                                    ? `+৳${Number(
                                        opt.price
                                      ).toLocaleString()}`
                                    : "৳0 (Standard)"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Add-on Services Checkboxes */}
            {addonsCatalog && addonsCatalog.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#007eff] text-white text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    Select Add-on Services (ঐচ্ছিক অ্যাড-অন সার্ভিসেস)
                  </span>
                  <span className="text-[11px] font-bold text-[#007eff] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    ধাপ ৩ / ৩
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {addonsCatalog.map((addon) => {
                    const addonKey = addon.slug || addon.id || addon._id;
                    const isChecked = selectedAddons.includes(addonKey);
                    return (
                      <button
                        key={addonKey}
                        type="button"
                        onClick={() => toggleAddon(addonKey)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? "bg-[#007eff]/10 border-[#007eff] text-[#001837] font-bold shadow-2xs"
                            : "bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div
                            className={`w-4 h-4 shrink-0 rounded flex items-center justify-center border transition-colors ${
                              isChecked
                                ? "bg-[#007eff] border-[#007eff] text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isChecked && (
                              <Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-xs text-slate-400">
                              {getAddonIcon(addon.name, addon.iconName)}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold truncate">
                              {addon.name}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-[#007eff] font-black shrink-0 ml-1">
                          +৳{addon.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Price Summary Card (lg:col-span-4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 self-start bg-gradient-to-b from-[#0b2144] to-[#0d2853] text-white p-6 sm:p-8 rounded-3xl border border-slate-200/40 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden z-20">
            <div className="space-y-4">
              <span className="inline-block text-xs font-black uppercase tracking-wider text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full">
                ESTIMATED ONE-TIME COST
              </span>

              <div className="pt-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  ৳{totalEstimate.toLocaleString()}
                </span>
                <span className="block text-slate-400 text-xs sm:text-sm font-semibold mt-1">
                  (VAT &amp; Service Charge Included)
                </span>
              </div>

              {/* Dynamic Line-by-Line Cost Breakdown */}
              <div className="border-t border-white/10 pt-4 text-left space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                {/* Base Service Fee */}
                <div className="flex justify-between items-center">
                  <span>Base Service Fee:</span>
                  <span className="font-bold text-white">
                    ৳{baseFee.toLocaleString()}
                  </span>
                </div>

                {/* Dynamic Calculated Field Rows for Current Category */}
                {calculatedItems.map((item: { id: string; label: string; cost: number }) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <span className="line-clamp-1 mr-2">{item.label}</span>
                    <span className="font-bold text-white shrink-0">
                      {item.cost > 0
                        ? `৳${item.cost.toLocaleString()}`
                        : "৳0"}
                    </span>
                  </div>
                ))}

                {/* Selected Add-ons Total */}
                {selectedAddons.length > 0 && (
                  <div className="flex justify-between items-center border-t border-white/10 pt-2">
                    <span>Selected Add-ons ({selectedAddons.length}):</span>
                    <span className="font-bold text-[#007eff]">
                      +৳{addonsCost.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button: Book Estimate */}
            <div className="pt-6">
              <Link
                href={bookingUrl}
                className="bg-[#007eff] hover:bg-[#0066ee] text-white font-black text-xs sm:text-sm uppercase tracking-wider py-4 px-5 rounded-2xl w-full flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_25px_rgba(0,126,255,0.5)] hover:scale-[1.02]"
              >
                <span>BOOK CUSTOM ESTIMATE</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
