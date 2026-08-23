"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sliders,
  DollarSign,
  Plus,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calculator,
  Save,
  Check,
  X,
  Layers,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Power,
  Clock,
  Building2,
  Utensils,
  Wrench,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import {
  ServiceDetail,
  getStoredServices,
  addService,
  updateService,
  deleteService,
} from "@/lib/servicesData";
import {
  fetchAdminAddonsAPI,
  createAddonAPI,
  updateAddonAPI,
  deleteAddonAPI,
} from "@/services/addonService";
import { updatePricingConfigAPI } from "@/services/pricingService";
import {
  fetchAdminServicesAPI,
  createServiceAPI,
  updateServiceAPI,
  deleteServiceAPI,
} from "@/services/serviceCategoryService";

export default function AdminServicesClientView({
  initialAddons = [],
  initialPricing,
  initialCoreServices = [],
}: {
  initialAddons?: any[];
  initialPricing?: any;
  initialCoreServices?: any[];
}) {
  const [services, setServices] = useState<any[]>(initialCoreServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // Form State
  const [formSlug, setFormSlug] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("HOME CARE");
  const [formBadge, setFormBadge] = useState("B2C HOME CLEANING");
  const [formPrice, setFormPrice] = useState("৳3,500 BDT");
  const [formSlaTime, setFormSlaTime] = useState("30 Mins SLA");
  const [formHeroImage, setFormHeroImage] = useState("");
  const [formContentImage, setFormContentImage] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formIntroParagraph1, setFormIntroParagraph1] = useState("");
  const [formIntroParagraph2, setFormIntroParagraph2] = useState("");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Dynamic Pricing Multiplier Formula State
  const [dynamicPricingConfig, setDynamicPricingConfig] = useState({
    baseFee: String(initialPricing?.baseFee ?? 1500),
    sqftRate: String(initialPricing?.sqftRate ?? 2.5),
    bedroomRate: String(initialPricing?.bedroomRate ?? 500),
    bathroomRate: String(initialPricing?.bathroomRate ?? 400),
  });

  useEffect(() => {
    if (initialPricing) {
      setDynamicPricingConfig({
        baseFee: String(initialPricing.baseFee ?? 1500),
        sqftRate: String(initialPricing.sqftRate ?? 2.5),
        bedroomRate: String(initialPricing.bedroomRate ?? 500),
        bathroomRate: String(initialPricing.bathroomRate ?? 400),
      });
    }
  }, [initialPricing]);

  // Add-on Services Catalog State - Initialized directly from SSR props
  const [addonsList, setAddonsList] = useState<any[]>(initialAddons);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [addonFormName, setAddonFormName] = useState("");
  const [addonFormPrice, setAddonFormPrice] = useState("");
  const [addonFormSubLabel, setAddonFormSubLabel] = useState("");
  const [addonFormTag, setAddonFormTag] = useState("ADD-ON");
  const [isSubmittingAddon, setIsSubmittingAddon] = useState(false);

  // Delete Confirmation Modal States
  const [addonToDelete, setAddonToDelete] = useState<any | null>(null);
  const [isDeletingAddon, setIsDeletingAddon] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<{ slug: string; title: string } | null>(null);

  // Sync services state with initialCoreServices prop
  useEffect(() => {
    if (initialCoreServices && initialCoreServices.length > 0) {
      setServices(initialCoreServices);
    }
  }, [initialCoreServices]);

  const refreshServices = async () => {
    const res = await fetchAdminServicesAPI();
    if (res?.success && Array.isArray(res?.data)) {
      setServices(res.data);
    }
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("cleanix_services_channel");
        channel.postMessage({ type: "SERVICES_UPDATED", timestamp: Date.now() });
        channel.close();
      }
      window.dispatchEvent(new CustomEvent("cleanix_services_updated"));
    } catch (e) {
      console.error("Error broadcasting service update:", e);
    }
  };

  const refreshAddons = async () => {
    const res = await fetchAdminAddonsAPI();
    if (res?.success && Array.isArray(res?.data)) {
      setAddonsList(res.data);
    }
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("cleanix_addons_channel");
        channel.postMessage({ type: "ADDON_UPDATED", timestamp: Date.now() });
        channel.close();
      }
      window.dispatchEvent(new CustomEvent("cleanix_addons_updated"));
    } catch (e) {
      console.error("Error broadcasting addon update:", e);
    }
  };

  const handleOpenAddModal = () => {
    setEditingSlug(null);
    setFormSlug("");
    setFormTitle("");
    setFormCategory("HOME CARE");
    setFormBadge("B2C HOME CLEANING");
    setFormPrice("৳3,500 BDT");
    setFormSlaTime("30 Mins SLA");
    setFormHeroImage("/RESIDENTIAL-DEEP-CLEANING.png");
    setFormContentImage(
      "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400"
    );
    setFormShortDesc("");
    setFormIntroParagraph1("");
    setFormIntroParagraph2("");
    setFormStatus("ACTIVE");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ServiceDetail) => {
    setEditingSlug(item.slug);
    setFormSlug(item.slug);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormBadge(item.badge);
    setFormPrice(item.price || "৳3,500 BDT");
    setFormSlaTime(item.slaTime || "30 Mins SLA");
    setFormHeroImage(item.heroImage);
    setFormContentImage(item.contentImage);
    setFormShortDesc(item.shortDesc);
    setFormIntroParagraph1(item.introParagraph1);
    setFormIntroParagraph2(item.introParagraph2);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formShortDesc.trim()) {
      toast.error("Please fill in Service Title and Short Description.");
      return;
    }

    const computedSlug =
      formSlug.trim() ||
      formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const serviceObj: ServiceDetail = {
      slug: computedSlug,
      title: formTitle,
      category: formCategory.toUpperCase(),
      badge: formBadge.toUpperCase(),
      price: formPrice,
      slaTime: formSlaTime,
      heroImage: formHeroImage,
      contentImage: formContentImage,
      shortDesc: formShortDesc,
      introParagraph1: formIntroParagraph1 || formShortDesc,
      introParagraph2: formIntroParagraph2,
      offersTitle: "WHAT WE OFFER (আমাদের বিশেষ সেবাসমূহ)",
      offersDesc: "ঢাকার অ্যাপার্টমেন্ট ও কমার্শিয়াল ফ্লোরের জন্য ডিপ রিসেট সার্ভিস।",
      offers: [
        {
          iconName: "Sparkles",
          title: "Detailed Deep Clean & Wash",
          desc: "প্রতিটি রুম, বাথরুম, কিচেন ও হাই-টাচ সারফেস জীবাণুমুক্ত ডাস্টিং।",
        },
        {
          iconName: "ShieldCheck",
          title: "Anti-Bacterial Sanitization",
          desc: "আন্তর্জাতিক সার্টিফাইড ইকো কেমিক্যালস দ্বারা জীবাণুমুক্তকরণ।",
        },
      ],
      whyChooseTitle: "WHY CHOOSE OUR SERVICE",
      whyChooseDesc: "Cleanix-এর ভেরিফাইড ক্লিনার টিম ও আধুনিক ভ্যাকুয়াম প্রযুক্তিতে শতভাগ নিশ্চিন্তি।",
      whyChoosePoints: [
        { title: "NID Verified Staff", desc: "সিকিউরিটি চেককৃত সুসজ্জিত টিম।" },
        { title: "Eco-Friendly Chemicals", desc: "শিশু ও পোষা প্রাণীর জন্য নিরাপদ।" },
      ],
      faqs: [
        {
          num: "01",
          question: "সার্ভিস শুরু হতে কত সময় লাগে?",
          answer: "আমাদের ট্র্যাকিং টিম ২৫-৩০ মিনিটের মধ্যে সার্ভিস লোকেশনে পৌঁছায়।",
        },
      ],
      status: formStatus,
    };

    if (editingSlug) {
      const targetService = services.find((s) => s.slug === editingSlug || s._id === editingSlug);
      const targetId = targetService?._id || editingSlug;
      const res = await updateServiceAPI(targetId, serviceObj);
      if (res?.success) {
        toast.success(`Service "${formTitle}" updated successfully!`);
        refreshServices();
      } else {
        toast.error(res?.message || "Failed to update service.");
      }
    } else {
      const res = await createServiceAPI(serviceObj);
      if (res?.success) {
        toast.success(`New Service "${formTitle}" created successfully!`);
        refreshServices();
      } else {
        toast.error(res?.message || "Failed to create service.");
      }
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = async (item: any) => {
    const serviceId = item._id || item.slug;
    const nextStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const res = await updateServiceAPI(serviceId, { status: nextStatus });
    if (res?.success) {
      toast.info(`Service "${item.title}" set to ${nextStatus}`);
      refreshServices();
    } else {
      toast.error(res?.message || "Failed to update service status.");
    }
  };

  const promptDeleteService = (slug: string, title: string) => {
    setServiceToDelete({ slug, title });
  };

  const confirmExecuteDeleteService = async () => {
    if (!serviceToDelete) return;
    const targetService = services.find((s) => s.slug === serviceToDelete.slug || s._id === serviceToDelete.slug);
    const targetId = targetService?._id || serviceToDelete.slug;
    const res = await deleteServiceAPI(targetId);
    if (res?.success) {
      toast.error(`Service "${serviceToDelete.title}" deleted.`);
      refreshServices();
    } else {
      toast.error(res?.message || "Failed to delete service.");
    }
    setServiceToDelete(null);
  };

  const handleSaveDynamicConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updatePricingConfigAPI({
      baseFee: Number(dynamicPricingConfig.baseFee),
      sqftRate: Number(dynamicPricingConfig.sqftRate),
      bedroomRate: Number(dynamicPricingConfig.bedroomRate),
      bathroomRate: Number(dynamicPricingConfig.bathroomRate),
    });

    if (res?.success) {
      toast.success("Dynamic pricing engine formula saved successfully!");
      try {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const channel = new BroadcastChannel("cleanix_pricing_channel");
          channel.postMessage({ type: "PRICING_UPDATED", timestamp: Date.now() });
          channel.close();
        }
        window.dispatchEvent(new CustomEvent("cleanix_pricing_updated"));
      } catch (err) {
        console.error("Error broadcasting pricing update:", err);
      }
    } else {
      toast.error(res?.message || "Failed to update dynamic pricing formula.");
    }
  };

  const toggleAddonActive = async (addon: any) => {
    const addonId = addon._id || addon.id;
    const newStatus = !addon.active;
    const res = await updateAddonAPI(addonId, { active: newStatus });
    if (res?.success) {
      toast.success(`Add-on "${addon.name}" set to ${newStatus ? "ACTIVE" : "DISABLED"}`);
      refreshAddons();
    } else {
      toast.error(res?.message || "Failed to update add-on status.");
    }
  };

  const promptDeleteAddon = (addon: any) => {
    setAddonToDelete(addon);
  };

  const confirmExecuteDeleteAddon = async () => {
    if (!addonToDelete) return;
    setIsDeletingAddon(true);
    const addonId = addonToDelete._id || addonToDelete.id;
    const res = await deleteAddonAPI(addonId);
    setIsDeletingAddon(false);
    if (res?.success) {
      toast.success(`Add-on service "${addonToDelete.name}" deleted successfully.`);
      setAddonToDelete(null);
      refreshAddons();
    } else {
      toast.error(res?.message || "Failed to delete add-on.");
    }
  };

  const getAddonIcon = (name: string, iconName?: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes("sofa") || n.includes("carpet") || iconName === "sofa") {
      return <Home className="w-5 h-5" />;
    }
    if (n.includes("oven") || n.includes("kitchen") || n.includes("chimney") || iconName === "oven") {
      return <Utensils className="w-5 h-5" />;
    }
    if (n.includes("fridge") || n.includes("refrigerator") || iconName === "fridge") {
      return <Layers className="w-5 h-5" />;
    }
    if (n.includes("window") || n.includes("glass") || iconName === "window") {
      return <Sparkles className="w-5 h-5" />;
    }
    if (n.includes("pet") || iconName === "pet") {
      return <ShieldCheck className="w-5 h-5" />;
    }
    return <Sparkles className="w-5 h-5" />;
  };

  const handleOpenAddAddonModal = () => {
    setEditingAddonId(null);
    setAddonFormName("");
    setAddonFormPrice("");
    setAddonFormSubLabel("");
    setAddonFormTag("ADD-ON");
    setIsAddonModalOpen(true);
  };

  const handleOpenEditAddonModal = (addon: any) => {
    setEditingAddonId(addon._id || addon.id);
    setAddonFormName(addon.name || "");
    setAddonFormPrice(String(addon.price || ""));
    setAddonFormSubLabel(addon.subLabel || "");
    setAddonFormTag(addon.tag || "ADD-ON");
    setIsAddonModalOpen(true);
  };

  const handleSaveAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addonFormName || !addonFormPrice) {
      toast.error("Please provide Add-on Name and Price!");
      return;
    }
    setIsSubmittingAddon(true);
    const numPrice = Number(String(addonFormPrice).replace(/[^0-9]/g, ""));

    let res: any;
    if (editingAddonId) {
      res = await updateAddonAPI(editingAddonId, {
        name: addonFormName,
        price: numPrice || 1000,
        subLabel: addonFormSubLabel || "সার্ভিস বিবরণ",
        tag: addonFormTag || "ADD-ON",
      });
    } else {
      res = await createAddonAPI({
        name: addonFormName,
        price: numPrice || 1000,
        subLabel: addonFormSubLabel || "সার্ভিস বিবরণ",
        tag: addonFormTag || "ADD-ON",
        active: true,
      });
    }

    setIsSubmittingAddon(false);
    if (res?.success) {
      toast.success(
        editingAddonId
          ? "Add-On Cleaning Service updated successfully!"
          : "New Add-On Cleaning Service created successfully!"
      );
      setIsAddonModalOpen(false);
      setEditingAddonId(null);
      setAddonFormName("");
      setAddonFormPrice("");
      setAddonFormSubLabel("");
      refreshAddons();
    } else {
      toast.error(res?.message || "Failed to save Add-on service.");
    }
  };

  // Search & Filter Logic
  const filteredServices = services.filter((item) => {
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.shortDesc.toLowerCase().includes(q) ||
      (item.price && item.price.toLowerCase().includes(q)) ||
      (item.slaTime && item.slaTime.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const totalCount = services.length;
  const activeCount = services.filter((s) => s.status === "ACTIVE").length;
  const inactiveCount = services.filter((s) => s.status === "INACTIVE").length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Sliders className="w-6 h-6 stroke-[2.5]" />
              </div>
              Services Catalog & Dynamic Pricing Manager
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ LIVE SERVICE CATALOG
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Add, edit, enable/disable, or remove core cleaning service offerings, starting prices, SLAs, and dynamic pricing formula multipliers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Service Offering</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Service Offerings
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Sliders className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{totalCount} Services</p>
          <p className="text-xs font-semibold text-slate-500">Core platform catalog</p>
        </div>

        <div className="bg-emerald-50/40 border border-emerald-300/80 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
              Active Service Lines
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-950 tracking-tight">{activeCount} Live</p>
          <p className="text-xs font-bold text-emerald-800">Accepting online bookings</p>
        </div>

        <div className="bg-blue-50/40 border border-blue-300/80 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900">
              Starting Rate
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-950 tracking-tight">৳3,500 BDT</p>
          <p className="text-xs font-medium text-slate-500">Base deep clean rate</p>
        </div>

        <div className="bg-amber-50/40 border border-amber-300/80 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
              Average SLA Response
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-950 tracking-tight">25-30 Mins</p>
          <p className="text-xs font-semibold text-amber-800">Cleaner arrival SLA</p>
        </div>
      </div>

      {/* CORE SERVICE OFFERINGS MANAGEMENT */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: `All Services (${totalCount})` },
              { id: "ACTIVE", label: `Active (${activeCount})` },
              { id: "INACTIVE", label: `Disabled (${inactiveCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-[#007eff] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Service, Tag, Price..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((item) => (
            <div
              key={item.slug}
              className={`bg-white border rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all ${
                item.status === "ACTIVE"
                  ? "border-slate-200/90 hover:border-[#007eff]/60"
                  : "border-slate-200 bg-slate-50/60 opacity-80"
              }`}
            >
              <div className="space-y-4">
                <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                  <Image
                    src={item.heroImage}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                    <span className="bg-[#007eff] text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-2xs">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                        item.status === "ACTIVE"
                          ? "bg-emerald-600 text-white border-emerald-700"
                          : "bg-slate-900 text-white border-slate-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-white/20">
                    ★ {item.slaTime || "30 Mins SLA"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black text-slate-900 text-base uppercase tracking-tight leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs font-black text-[#007eff]">
                    Starting Rate: {item.price || "৳3,500 BDT"}
                  </p>

                  <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed pt-1">
                    {item.shortDesc}
                  </p>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <Link
                  href={`/services/${item.slug}`}
                  target="_blank"
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </Link>

                <div className="flex items-center gap-2.5">
                  {/* Modern Sliding Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      item.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    title={item.status === "ACTIVE" ? "Click to Disable" : "Click to Enable"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        item.status === "ACTIVE" ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-colors cursor-pointer"
                    title="Edit Service Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => promptDeleteService(item.slug, item.title)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredServices.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium">
              No services found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC PRICING ENGINE FORMULA CONFIGURATOR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#007eff]" /> Instant Estimate Dynamic Pricing Multipliers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Formula: Base Service Fee + (SqFt × Rate) + (Bedrooms × Rate) + (Bathrooms × Rate) + Addons
          </p>
        </div>

        <form onSubmit={handleSaveDynamicConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm">Base Service Fee (৳):</label>
            <input
              type="text"
              value={dynamicPricingConfig.baseFee}
              onChange={(e) => setDynamicPricingConfig({ ...dynamicPricingConfig, baseFee: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-black text-sm focus:outline-none focus:border-[#007eff]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm">Per SqFt Rate (৳):</label>
            <input
              type="text"
              value={dynamicPricingConfig.sqftRate}
              onChange={(e) => setDynamicPricingConfig({ ...dynamicPricingConfig, sqftRate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-black text-sm focus:outline-none focus:border-[#007eff]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm">Per Bedroom Rate (৳):</label>
            <input
              type="text"
              value={dynamicPricingConfig.bedroomRate}
              onChange={(e) => setDynamicPricingConfig({ ...dynamicPricingConfig, bedroomRate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-black text-sm focus:outline-none focus:border-[#007eff]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 text-xs sm:text-sm">Per Bathroom Rate (৳):</label>
            <input
              type="text"
              value={dynamicPricingConfig.bathroomRate}
              onChange={(e) => setDynamicPricingConfig({ ...dynamicPricingConfig, bathroomRate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-black text-sm focus:outline-none focus:border-[#007eff]"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-blue-400" />
              <span>Update Pricing Formula</span>
            </button>
          </div>
        </form>
      </div>

      {/* ADD-ON SERVICES CATALOG */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#007eff]" /> Add-On Cleaning Services Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Add new add-on services or enable/disable existing ones for dynamic booking checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddAddonModal}
            className="px-4 py-2 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Add-On Service</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addonsList.map((addon) => (
            <div
              key={addon._id || addon.id}
              className={`p-5 sm:p-6 rounded-3xl border flex items-center justify-between transition-all duration-300 ${
                addon.active
                  ? "bg-white border-slate-200/90 shadow-2xs hover:border-slate-300"
                  : "bg-slate-50/80 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                    addon.active
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-slate-200 text-slate-500 border border-slate-300"
                  }`}
                >
                  {getAddonIcon(addon.name, addon.iconName)}
                </div>

                <div>
                  <p className="text-base font-bold text-slate-900 leading-snug">
                    {addon.name}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    {addon.subLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <span
                  className={`text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-xl transition-colors ${
                    addon.active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-200 text-slate-600 border border-slate-300"
                  }`}
                >
                  +৳{(addon.price || 0).toLocaleString()}
                </span>

                {/* Modern Sliding Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleAddonActive(addon)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 cursor-pointer flex items-center shadow-inner ${
                    addon.active ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                  title={addon.active ? "Click to Disable" : "Click to Enable"}
                >
                  <span
                    className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-300 block ${
                      addon.active ? "translate-x-[22px]" : "translate-x-0"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEditAddonModal(addon)}
                  className="w-8 h-8 rounded-xl bg-blue-50 text-[#007eff] hover:bg-blue-100 border border-blue-200 flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Add-On Details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => promptDeleteAddon(addon)}
                  className="w-8 h-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center justify-center transition-colors cursor-pointer"
                  title="Delete Add-On"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT ADD-ON MODAL */}
      {isAddonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#007eff]" />
                {editingAddonId ? "Edit Add-On Service" : "Add New Add-On Service"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddonModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddon} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Service Add-On Title (নাম):</label>
                <input
                  type="text"
                  required
                  value={addonFormName}
                  onChange={(e) => setAddonFormName(e.target.value)}
                  placeholder="e.g. Balcony Deep Pressure Wash"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Price (৳):</label>
                <input
                  type="number"
                  required
                  value={addonFormPrice}
                  onChange={(e) => setAddonFormPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Short Sub-Label (বিবরণ):</label>
                <input
                  type="text"
                  value={addonFormSubLabel}
                  onChange={(e) => setAddonFormSubLabel(e.target.value)}
                  placeholder="e.g. হাই-প্রেসার ওয়াটার স্যানিটাইজিং"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddonModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAddon}
                  className="px-5 py-2.5 rounded-xl bg-[#007eff] hover:bg-[#0066ee] text-white text-xs font-extrabold cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAddon
                    ? "Saving..."
                    : editingAddonId
                    ? "Update Add-On Service"
                    : "Save Add-On Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT SERVICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 relative my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-extrabold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingSlug ? "Edit Service Offering" : "Add New Service Offering"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {editingSlug ? editingSlug : "Configure new core service offering"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Service Title (Bangla / English):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RESIDENTIAL DEEP CLEANING (আবাসিক ডিপ ক্লিনিং)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Category Tag (e.g. HOME CARE, OFFICE):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HOME CARE"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Badge Title (e.g. B2C HOME CLEANING):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B2C HOME CLEANING"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Starting Price (e.g. ৳3,500 BDT):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ৳3,500 BDT"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    SLA Response Time:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 Mins SLA"
                    value={formSlaTime}
                    onChange={(e) => setFormSlaTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Hero Cover Image Path / URL:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /RESIDENTIAL-DEEP-CLEANING.png"
                  value={formHeroImage}
                  onChange={(e) => setFormHeroImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Short Description (Bangla / English):
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. ঢাকার যেকোনো অ্যাপার্টমেন্ট ও আবাসিক বাড়ির জন্য সম্পূর্ণ রুম-বাই-রুম ডিপ রিফ্রেশ ক্লিনিং..."
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Service Status:
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold focus:outline-none focus:border-[#007eff]"
                >
                  <option value="ACTIVE">ACTIVE (Accepting Bookings)</option>
                  <option value="INACTIVE">INACTIVE (Temporarily Disabled)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSlug ? "Save Changes" : "Create Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE ADD-ON CONFIRMATION MODAL */}
      {addonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-6 text-center relative shadow-2xl">
            <button
              type="button"
              onClick={() => setAddonToDelete(null)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center absolute top-4 right-4 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto mt-2">
              <Trash2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Delete Add-On Service?
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-600 px-2 leading-relaxed">
                Are you sure you want to delete add-on service{" "}
                <span className="font-bold text-slate-900">&quot;{addonToDelete.name}&quot;</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAddonToDelete(null)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer w-1/2"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingAddon}
                onClick={confirmExecuteDeleteAddon}
                className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 w-1/2 disabled:opacity-50 shadow-lg shadow-red-500/20"
              >
                {isDeletingAddon ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CORE SERVICE CONFIRMATION MODAL */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-6 text-center relative shadow-2xl">
            <button
              type="button"
              onClick={() => setServiceToDelete(null)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center absolute top-4 right-4 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto mt-2">
              <Trash2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Delete Service Offering?
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-600 px-2 leading-relaxed">
                Are you sure you want to delete service offering{" "}
                <span className="font-bold text-slate-900">&quot;{serviceToDelete.title}&quot;</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer w-1/2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmExecuteDeleteService}
                className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 w-1/2 shadow-lg shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
