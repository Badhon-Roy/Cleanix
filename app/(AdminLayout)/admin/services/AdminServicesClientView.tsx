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
  X,
  Layers,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Clock,
  Utensils,
  Home,
  AlertCircle,
  Loader2,
  UploadCloud,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";

export interface ServiceFormValues {
  title: string;
  category: string;
  badge: string;
  price: string | number;
  slaTime: string;
  heroImage: string;
  contentImage: string;
  shortDesc: string;
  introParagraph1: string;
  introParagraph2: string;
  offersTitle: string;
  offersDesc: string;
  whyChooseTitle: string;
  whyChooseDesc: string;
  status: "ACTIVE" | "INACTIVE";
}
import {
  ServiceDetail,
} from "@/lib/servicesData";
import {
  fetchAdminAddonsAPI,
  createAddonAPI,
  updateAddonAPI,
  deleteAddonAPI,
} from "@/services/addonService";
import { fetchPricingConfigAPI, updatePricingConfigAPI } from "@/services/pricingService";
import {
  fetchAdminServicesAPI,
  fetchServiceCatalogOverviewAPI,
  fetchSingleServiceBySlugAPI,
  createServiceAPI,
  updateServiceAPI,
  deleteServiceAPI,
} from "@/services/serviceCategoryService";

export default function AdminServicesClientView({
  initialAddons = [],
  initialPricing,
  initialCoreServices = [],
  initialOverview,
}: {
  initialAddons?: any[];
  initialPricing?: any;
  initialCoreServices?: any[];
  initialOverview?: any;
}) {
  const [services, setServices] = useState<any[]>(initialCoreServices);
  const [overviewStats, setOverviewStats] = useState<any>(
    initialOverview || {
      totalServices: initialCoreServices.length,
      activeServices: initialCoreServices.filter((s) => s.status === "ACTIVE").length,
      startingRate: "৳3,500",
      avgSlaResponse: "25-30 Mins",
    }
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isSubmittingService, setIsSubmittingService] = useState(false);

  // React Hook Form for Service Category Modal
  const {
    register,
    handleSubmit: handleHookFormSubmit,
    reset: resetServiceForm,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    defaultValues: {
      title: "",
      category: "HOME CARE",
      badge: "B2C HOME CLEANING",
      price: "3500",
      slaTime: "30 Mins SLA",
      heroImage: "/RESIDENTIAL-DEEP-CLEANING.png",
      contentImage: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
      shortDesc: "",
      introParagraph1: "",
      introParagraph2: "",
      offersTitle: "WHAT WE OFFER (আমাদের বিশেষ সেবাসমূহ)",
      offersDesc: "ঢাকার অ্যাপার্টমেন্ট ও কমার্শিয়াল ফ্লোরের জন্য ডিপ রিসেট সার্ভিস।",
      whyChooseTitle: "WHY CHOOSE OUR SERVICE",
      whyChooseDesc: "",
      status: "ACTIVE",
    },
  });

  // Watch live image values for preview
  const heroImageVal = watch("heroImage");
  const contentImageVal = watch("contentImage");

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("heroImage", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("contentImage", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Slug State
  const [formSlug, setFormSlug] = useState("");

  // Detailed Content Form States for Offers, Why Choose & FAQs
  const [formOffers, setFormOffers] = useState<{ title: string; desc: string }[]>([]);
  const [formWhyChoosePoints, setFormWhyChoosePoints] = useState<{ title: string; desc: string }[]>([]);
  const [formFaqs, setFormFaqs] = useState<{ num: string; question: string; answer: string }[]>([]);
  const [formFields, setFormFields] = useState<any[]>([]);

  // Predefined System Cleaning Fields Catalog
  const PREDEFINED_FIELDS_CATALOG = [
    { id: "sqft", label: "Property Size (SqFt)", fieldType: "NUMBER", unit: "SqFt", unitPrice: 2.5, isPredefined: true, enabled: true },
    { id: "bedrooms", label: "Bedrooms (বেডরুম)", fieldType: "COUNTER", unit: "Bedrooms", unitPrice: 500, isPredefined: true, enabled: true },
    { id: "bathrooms", label: "Bathrooms (বাথরুম)", fieldType: "COUNTER", unit: "Bathrooms", unitPrice: 400, isPredefined: true, enabled: true },
    { id: "floors", label: "Number of Floors (ফ্লোর সংখ্যা)", fieldType: "COUNTER", unit: "Floors", unitPrice: 800, isPredefined: true, enabled: true },
    { id: "workstations", label: "Workstations / Desks (ডেস্ক সংখ্যা)", fieldType: "COUNTER", unit: "Desks", unitPrice: 200, isPredefined: true, enabled: true },
    { id: "window_count", label: "Window Count (গ্লাসের সংখ্যা)", fieldType: "COUNTER", unit: "Windows", unitPrice: 350, isPredefined: true, enabled: true },
    { id: "carpet_area", label: "Carpet Area Size (SqFt)", fieldType: "NUMBER", unit: "SqFt", unitPrice: 15, isPredefined: true, enabled: true },
    { id: "guest_capacity", label: "Guest Capacity", fieldType: "COUNTER", unit: "Guests", unitPrice: 0, isPredefined: true, enabled: true },
    {
      id: "cleaning_level",
      label: "Cleaning Level (ক্লিনিংয়ের মাত্রা)",
      fieldType: "SELECT",
      isPredefined: true,
      enabled: true,
      options: [
        { label: "Standard Deep Reset (+৳0)", value: "standard", price: 0 },
        { label: "Deep Steam Reset (+৳1,500)", value: "steam", price: 1500 },
        { label: "Hospital Grade Sanitized (+৳3,000)", value: "sanitized", price: 3000 },
      ],
    },
    {
      id: "property_status",
      label: "Property Status (বাসার অবস্থা)",
      fieldType: "SELECT",
      isPredefined: true,
      enabled: true,
      options: [
        { label: "Vacant / Empty (+৳0)", value: "empty", price: 0 },
        { label: "Partially Furnished (+৳1,000)", value: "partial", price: 1000 },
        { label: "Fully Furnished (+৳2,500)", value: "furnished", price: 2500 },
      ],
    },
    {
      id: "construction_stage",
      label: "Construction Stage (কাজের পর্যায়)",
      fieldType: "SELECT",
      isPredefined: true,
      enabled: true,
      options: [
        { label: "Rough Clean (+৳0)", value: "rough", price: 0 },
        { label: "Final Clean (+৳2,000)", value: "final", price: 2000 },
        { label: "Touch-Up Clean (+৳1,000)", value: "touchup", price: 1000 },
      ],
    },
    {
      id: "debris_level",
      label: "Debris Level (ময়লার পরিমাণ)",
      fieldType: "SELECT",
      isPredefined: true,
      enabled: true,
      options: [
        { label: "Light Debris (+৳0)", value: "light", price: 0 },
        { label: "Medium Debris (+৳1,500)", value: "medium", price: 1500 },
        { label: "Heavy Debris (+৳3,500)", value: "heavy", price: 3500 },
      ],
    },
  ];

  const togglePredefinedField = (predefinedItem: any) => {
    setFormFields((prev) => {
      const exists = prev.find((f) => f.id === predefinedItem.id);
      if (exists) {
        return prev.filter((f) => f.id !== predefinedItem.id);
      } else {
        return [...prev, { ...predefinedItem }];
      }
    });
  };

  const addCustomField = () => {
    const newId = `custom_${Date.now()}`;
    setFormFields((prev) => [
      ...prev,
      {
        id: newId,
        label: "Solar Panel Count",
        fieldType: "COUNTER",
        isPredefined: false,
        required: true,
        unit: "Panels",
        unitPrice: 150,
        enabled: true,
        options: [],
      },
    ]);
  };

  const removeField = (fieldId: string) => {
    setFormFields((prev) => prev.filter((f) => f.id !== fieldId));
  };

  const handleFieldChange = (fieldId: string, key: string, val: any) => {
    setFormFields((prev) => {
      return prev.map((f) => (f.id === fieldId ? { ...f, [key]: val } : f));
    });
  };

  const handleAddOfferItem = () => {
    setFormOffers((prev) => [...prev, { title: "", desc: "" }]);
  };
  const handleRemoveOfferItem = (index: number) => {
    setFormOffers((prev) => prev.filter((_, i) => i !== index));
  };
  const handleOfferChange = (index: number, field: "title" | "desc", val: string) => {
    setFormOffers((prev) => {
      const updated = [...prev];
      updated[index][field] = val;
      return updated;
    });
  };

  const handleAddWhyPoint = () => {
    setFormWhyChoosePoints((prev) => [...prev, { title: "", desc: "" }]);
  };
  const handleRemoveWhyPoint = (index: number) => {
    setFormWhyChoosePoints((prev) => prev.filter((_, i) => i !== index));
  };
  const handleWhyPointChange = (index: number, field: "title" | "desc", val: string) => {
    setFormWhyChoosePoints((prev) => {
      const updated = [...prev];
      updated[index][field] = val;
      return updated;
    });
  };

  const handleAddFaqItem = () => {
    setFormFaqs((prev) => {
      const nextNum = String(prev.length + 1).padStart(2, "0");
      return [...prev, { num: nextNum, question: "", answer: "" }];
    });
  };
  const handleRemoveFaqItem = (index: number) => {
    setFormFaqs((prev) => prev.filter((_, i) => i !== index));
  };
  const handleFaqChange = (index: number, field: "num" | "question" | "answer", val: string) => {
    setFormFaqs((prev) => {
      const updated = [...prev];
      updated[index][field] = val;
      return updated;
    });
  };

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

  // Real-time Socket.io + BroadcastChannel listeners for Admin Services, Addons & Pricing
  useEffect(() => {
    let socket: any = null;
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      socket = io(serverUrl, { withCredentials: true });

      socket.on("service_catalog_updated", () => {
        refreshServices();
      });

      socket.on("addon_updated", () => {
        refreshAddons();
      });

      socket.on("pricing_updated", () => {
        fetchPricingConfigAPI().then((res) => {
          if (res?.success && res?.data) {
            setDynamicPricingConfig({
              baseFee: String(res.data.baseFee ?? 1500),
              sqftRate: String(res.data.sqftRate ?? 2.5),
              bedroomRate: String(res.data.bedroomRate ?? 500),
              bathroomRate: String(res.data.bathroomRate ?? 400),
            });
          }
        });
      });
    } catch (e) {
      console.error("Socket error in Admin services listener:", e);
    }

    let serviceChannel: BroadcastChannel | null = null;
    let addonChannel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        serviceChannel = new BroadcastChannel("cleanix_services_channel");
        serviceChannel.onmessage = () => refreshServices();

        addonChannel = new BroadcastChannel("cleanix_addons_channel");
        addonChannel.onmessage = () => refreshAddons();
      }
    } catch (e) {
      console.error("BroadcastChannel error in Admin services:", e);
    }

    const handleServicesUpdate = () => refreshServices();
    const handleAddonsUpdate = () => refreshAddons();

    window.addEventListener("cleanix_services_updated", handleServicesUpdate);
    window.addEventListener("cleanix_addons_updated", handleAddonsUpdate);

    return () => {
      if (socket) socket.disconnect();
      if (serviceChannel) serviceChannel.close();
      if (addonChannel) addonChannel.close();
      window.removeEventListener("cleanix_services_updated", handleServicesUpdate);
      window.removeEventListener("cleanix_addons_updated", handleAddonsUpdate);
    };
  }, []);

  // Prevent body scroll when any modal is open and handle Lenis smooth scroll prevention
  useEffect(() => {
    if (isModalOpen || isAddonModalOpen || addonToDelete || serviceToDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isAddonModalOpen, addonToDelete, serviceToDelete]);

  const refreshServices = async () => {
    const [resServices, resOverview] = await Promise.all([
      fetchAdminServicesAPI(),
      fetchServiceCatalogOverviewAPI(),
    ]);

    if (resServices?.success && Array.isArray(resServices?.data)) {
      setServices(resServices.data);
    }
    if (resOverview?.success && resOverview?.data) {
      setOverviewStats(resOverview.data);
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
    resetServiceForm({
      title: "",
      category: "HOME CARE",
      badge: "B2C HOME CLEANING",
      price: "3500",
      slaTime: "30 Mins SLA",
      heroImage: "/RESIDENTIAL-DEEP-CLEANING.png",
      contentImage:
        "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
      shortDesc: "",
      introParagraph1: "",
      introParagraph2: "",
      offersTitle: "WHAT WE OFFER (আমাদের বিশেষ সেবাসমূহ)",
      offersDesc: "ঢাকার অ্যাপার্টমেন্ট ও কমার্শিয়াল ফ্লোরের জন্য ডিপ রিসেট সার্ভিস।",
      whyChooseTitle: "WHY CHOOSE OUR SERVICE",
      whyChooseDesc: "Cleanix-এর ভেরিফাইড ক্লিনার টিম ও আধুনিক ভ্যাকুয়াম প্রযুক্তিতে শতভাগ নিশ্চিন্তি।",
      status: "ACTIVE",
    });
    setFormOffers([
      { title: "Detailed Deep Clean & Wash", desc: "প্রতিটি রুম, বাথরুম, কিচেন ও হাই-টাচ সারফেস জীবাণুমুক্ত ডাস্টিং।" },
      { title: "Anti-Bacterial Sanitization", desc: "আন্তর্জাতিক সার্টিফাইড ইকো কেমিক্যালস দ্বারা জীবাণুমুক্তকরণ।" },
    ]);
    setFormWhyChoosePoints([
      { title: "NID Verified Staff", desc: "সিকিউরিটি চেককৃত সুসজ্জিত টিম।" },
      { title: "Eco-Friendly Chemicals", desc: "শিশু ও পোষা প্রাণীর জন্য নিরাপদ।" },
    ]);
    setFormFaqs([
      { num: "01", question: "সার্ভিস শুরু হতে কত সময় লাগে?", answer: "আমাদের ট্র্যাকিং টিম ২৫-৩০ মিনিটের মধ্যে সার্ভিস লোকেশনে পৌঁছায়।" },
    ]);
    setFormFields([
      { id: "sqft", label: "Property Size (SqFt)", fieldType: "NUMBER", unit: "SqFt", unitPrice: 2.5, isPredefined: true, enabled: true },
      { id: "bedrooms", label: "Bedrooms (বেডরুম)", fieldType: "COUNTER", unit: "Bedrooms", unitPrice: 500, isPredefined: true, enabled: true },
      { id: "bathrooms", label: "Bathrooms (বাথরুম)", fieldType: "COUNTER", unit: "Bathrooms", unitPrice: 400, isPredefined: true, enabled: true },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (item: any) => {
    const targetSlugOrId = item.slug || item._id;
    setEditingSlug(targetSlugOrId);
    setFormSlug(item.slug || "");

    let activeItem = item;
    try {
      const res = await fetchSingleServiceBySlugAPI(targetSlugOrId);
      if (res?.success && res?.data) {
        activeItem = res.data;
      }
    } catch (e) {
      console.error("Error fetching single service detail:", e);
    }

    setEditingSlug(activeItem.slug || activeItem._id);
    setFormSlug(activeItem.slug || "");
    resetServiceForm({
      title: activeItem.title || "",
      category: activeItem.category || "HOME CARE",
      badge: activeItem.badge || "B2C HOME CLEANING",
      price: String(activeItem.price || "3500").replace(/[^0-9]/g, "") || "3500",
      slaTime: activeItem.slaTime || "30 Mins SLA",
      heroImage: activeItem.heroImage || "",
      contentImage: activeItem.contentImage || "",
      shortDesc: activeItem.shortDesc || "",
      introParagraph1: activeItem.introParagraph1 || "",
      introParagraph2: activeItem.introParagraph2 || "",
      offersTitle: activeItem.offersTitle || "WHAT WE OFFER (আমাদের বিশেষ সেবাসমূহ)",
      offersDesc: activeItem.offersDesc || "",
      whyChooseTitle: activeItem.whyChooseTitle || "WHY CHOOSE OUR SERVICE",
      whyChooseDesc: activeItem.whyChooseDesc || "",
      status: activeItem.status || "ACTIVE",
    });
    setFormOffers(Array.isArray(activeItem.offers) ? activeItem.offers : []);
    setFormWhyChoosePoints(Array.isArray(activeItem.whyChoosePoints) ? activeItem.whyChoosePoints : []);
    setFormFaqs(Array.isArray(activeItem.faqs) ? activeItem.faqs : []);

    const savedFields = Array.isArray(activeItem.fields) && activeItem.fields.length > 0
      ? activeItem.fields
      : Array.isArray(activeItem.customFields)
      ? activeItem.customFields
      : [];

    setFormFields(savedFields);
    setIsModalOpen(true);
  };

  const onSubmitServiceForm = async (data: ServiceFormValues) => {
    try {
      setIsSubmittingService(true);
      const computedSlug =
        formSlug.trim() ||
        data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const numPrice = Number(String(data.price).replace(/[^0-9]/g, "")) || 3500;
      const formattedPrice = `৳${numPrice.toLocaleString()}`;

      const serviceObj: any = {
        slug: computedSlug,
        title: data.title,
        category: data.category.toUpperCase(),
        badge: data.badge.toUpperCase(),
        price: formattedPrice,
        slaTime: data.slaTime,
        heroImage: data.heroImage,
        contentImage: data.contentImage,
        shortDesc: data.shortDesc,
        introParagraph1: data.introParagraph1,
        introParagraph2: data.introParagraph2,
        offersTitle: data.offersTitle,
        offersDesc: data.offersDesc,
        offers: formOffers,
        whyChooseTitle: data.whyChooseTitle,
        whyChooseDesc: data.whyChooseDesc,
        whyChoosePoints: formWhyChoosePoints,
        faqs: formFaqs,
        status: data.status,
        fields: formFields,
        customFields: formFields,
      };

      if (editingSlug) {
        const targetService = services.find((s) => s.slug === editingSlug || s._id === editingSlug);
        const targetId = targetService?._id || editingSlug;
        const res = await updateServiceAPI(targetId, serviceObj);
        if (res?.success) {
          toast.success(`Service "${data.title}" updated successfully!`);
          refreshServices();
          setIsModalOpen(false);
        } else {
          toast.error(res?.message || "Failed to update service.");
        }
      } else {
        const res = await createServiceAPI(serviceObj);
        if (res?.success) {
          toast.success(`New Service "${data.title}" created successfully!`);
          refreshServices();
          setIsModalOpen(false);
        } else {
          toast.error(res?.message || "Failed to create service.");
        }
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred while saving service offering.");
      console.error("Error submitting service offering:", err);
    } finally {
      setIsSubmittingService(false);
    }
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
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {overviewStats?.totalServices ?? totalCount} Services
          </p>
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
          <p className="text-3xl font-black text-emerald-950 tracking-tight">
            {overviewStats?.activeServices ?? activeCount} Live
          </p>
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
          <p className="text-3xl font-black text-blue-950 tracking-tight">
            {overviewStats?.startingRate || "৳3,500"}
          </p>
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
          <p className="text-3xl font-black text-amber-950 tracking-tight">
            {overviewStats?.avgSlaResponse || "25-30 Mins"}
          </p>
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
                    Starting Rate: {item.price ? item.price.replace(/\s*BDT\s*/gi, "") : "৳3,500"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 w-[94vw] max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-extrabold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {editingSlug ? "Edit Service Offering Catalog" : "Add New Service Offering"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {editingSlug ? editingSlug : "Configure complete core service offering details, pricing, content paragraphs, features & FAQs."}
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

            {/* FORM CONTAINER WITH INTEGRATED FOOTER */}
            <form onSubmit={handleHookFormSubmit(onSubmitServiceForm)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* SCROLLABLE FORM BODY (WITH LENIS SCROLL PREVENT) */}
              <div
                className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50/30 custom-scrollbar"
                data-lenis-prevent
                data-lenis-prevent-wheel
              >
                {/* 1. BASIC INFORMATION & PRICING */}
                <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#007eff]" /> 1. Basic Information & SLA
                  </h4>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800 block">
                      Service Title (Bangla / English) <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RESIDENTIAL DEEP CLEANING (আবাসিক ডিপ ক্লিনিং)"
                      {...register("title", { required: "Service Title is required" })}
                      className={`w-full bg-slate-50 border rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:bg-white transition-all ${
                        errors.title ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-[#007eff]"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">
                        Category Tag <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HOME CARE"
                        {...register("category", { required: "Category Tag is required" })}
                        className={`w-full bg-slate-50 border rounded-xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:bg-white transition-all ${
                          errors.category ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-[#007eff]"
                        }`}
                      />
                      {errors.category && (
                        <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1 animate-in fade-in">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">
                        Badge Title <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B2C HOME CLEANING"
                        {...register("badge", { required: "Badge Title is required" })}
                        className={`w-full bg-slate-50 border rounded-xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:bg-white transition-all ${
                          errors.badge ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-[#007eff]"
                        }`}
                      />
                      {errors.badge && (
                        <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1 animate-in fade-in">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.badge.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">
                        Starting Price (৳) <span className="text-red-500">*</span>:
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-900 text-sm">
                          ৳
                        </span>
                        <input
                          type="number"
                          min={0}
                          placeholder="3500"
                          {...register("price", {
                            required: "Starting Price is required",
                            min: { value: 0, message: "Price must be a positive number" },
                          })}
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-4 py-3 text-slate-900 font-bold focus:outline-none focus:bg-white transition-all ${
                            errors.price ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-[#007eff]"
                          }`}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1 animate-in fade-in">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">
                        SLA Response Time:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 30 Mins SLA"
                        {...register("slaTime")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800 block">
                      Service Status:
                    </label>
                    <select
                      {...register("status")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-extrabold focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                    >
                      <option value="ACTIVE">ACTIVE (Accepting Bookings)</option>
                      <option value="INACTIVE">INACTIVE (Temporarily Disabled)</option>
                    </select>
                  </div>

                  {/* ⚡ BOOKING FIELD CONFIGURATION (PREDEFINED & CUSTOM FIELDS) */}
                  <div className="pt-4 border-t border-slate-100 space-y-6">
                    {/* SECTION A: PREDEFINED FIELDS */}
                    {(!editingSlug || formFields.some((f) => f.isPredefined !== false)) && (
                      <div className="bg-slate-50/80 border border-slate-200/90 p-5 rounded-2xl space-y-4">
                        <div>
                          <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider text-[#007eff] flex items-center gap-2">
                            Section A: Predefined Fields (কমন ক্লিনিং ইনপুটসমূহ)
                          </h5>
                          <p className="text-xs text-slate-500 font-medium">
                            কমন ফিল্ডগুলো ১-ক্লিকে অন/অফ করুন এবং ফিল্ডের নাম, কন্ট্রোল টাইপ ও প্রাইসিং রেট পরিবর্তন করুন:
                          </p>
                        </div>

                        {/* QUICK TOGGLE BUTTONS CATALOG (Only show when creating a new service category) */}
                        {!editingSlug && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                            {PREDEFINED_FIELDS_CATALOG.map((predefinedItem) => {
                              const isEnabled = formFields.some((f) => f.id === predefinedItem.id);
                              return (
                                <button
                                  key={predefinedItem.id}
                                  type="button"
                                  onClick={() => togglePredefinedField(predefinedItem)}
                                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 cursor-pointer select-none ${
                                    isEnabled
                                      ? "bg-blue-50 border-[#007eff] ring-2 ring-blue-400/30 text-blue-900 font-bold"
                                      : "bg-white border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-bold truncate">{predefinedItem.label.split("(")[0]}</span>
                                    <input
                                      type="checkbox"
                                      checked={isEnabled}
                                      onChange={() => {}} // Handled by button onClick
                                      className="w-4 h-4 accent-[#007eff] rounded cursor-pointer"
                                    />
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                                    {predefinedItem.fieldType} {predefinedItem.unitPrice ? `(৳${predefinedItem.unitPrice})` : ""}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* ACTIVE PREDEFINED FIELDS CARDS (SAME TO SAME AS SECTION B) */}
                        <div className="space-y-3 pt-2">
                          {formFields.filter((f) => f.isPredefined !== false).map((field, fieldIdx) => (
                            <div
                              key={field.id || fieldIdx}
                              className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-2xs"
                            >
                              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                    Predefined Field #{fieldIdx + 1}
                                  </span>
                                  <span className="text-xs font-bold text-slate-700">{field.label}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeField(field.id)}
                                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Field Name / Label:</label>
                                  <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => handleFieldChange(field.id, "label", e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                                  />
                                </div>

                                <div>
                                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Control Type:</label>
                                  <select
                                    value={field.fieldType}
                                    onChange={(e) => handleFieldChange(field.id, "fieldType", e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                                  >
                                    <option value="COUNTER">COUNTER ([-] 20 [+])</option>
                                    <option value="NUMBER">NUMBER / SqFt Input</option>
                                    <option value="SELECT">SELECT (Dropdown Options)</option>
                                    <option value="RADIO">RADIO (Option Cards)</option>
                                    <option value="TEXT">TEXT (Note Input)</option>
                                  </select>
                                </div>

                                {(field.fieldType === "COUNTER" || field.fieldType === "NUMBER") && (
                                  <div>
                                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Pricing Rate (৳ per unit):</label>
                                    <input
                                      type="number"
                                      min={0}
                                      step="any"
                                      value={field.unitPrice ?? ""}
                                      onChange={(e) => handleFieldChange(field.id, "unitPrice", e.target.value === "" ? 0 : Number(e.target.value))}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Dropdown Options Editor for SELECT/RADIO */}
                              {(field.fieldType === "SELECT" || field.fieldType === "RADIO") && (
                                <div className="pt-2 border-t border-slate-100 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">Options & Pricing:</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const opts = field.options || [];
                                        handleFieldChange(field.id, "options", [
                                          ...opts,
                                          { label: "New Option", value: `opt_${Date.now()}`, price: 0 },
                                        ]);
                                      }}
                                      className="text-[11px] font-bold text-[#007eff] bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 hover:bg-blue-100"
                                    >
                                      + Add Option
                                    </button>
                                  </div>
                                  <div className="space-y-2">
                                    {(field.options || []).map((opt: any, optIdx: number) => (
                                      <div key={optIdx} className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          placeholder="Option Name"
                                          value={opt.label}
                                          onChange={(e) => {
                                            const updatedOpts = [...field.options];
                                            updatedOpts[optIdx].label = e.target.value;
                                            handleFieldChange(field.id, "options", updatedOpts);
                                          }}
                                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                                        />
                                        <input
                                          type="text"
                                          placeholder="value"
                                          value={opt.value}
                                          onChange={(e) => {
                                            const updatedOpts = [...field.options];
                                            updatedOpts[optIdx].value = e.target.value;
                                            handleFieldChange(field.id, "options", updatedOpts);
                                          }}
                                          className="w-24 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-700"
                                        />
                                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                                          <span className="text-xs font-bold text-slate-500">৳</span>
                                          <input
                                            type="number"
                                            min={0}
                                            step="any"
                                            value={opt.price ?? ""}
                                            onChange={(e) => {
                                              const updatedOpts = [...field.options];
                                              updatedOpts[optIdx].price = e.target.value === "" ? 0 : Number(e.target.value);
                                              handleFieldChange(field.id, "options", updatedOpts);
                                            }}
                                            className="w-16 text-xs font-bold text-slate-900 focus:outline-none"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedOpts = field.options.filter((_: any, i: number) => i !== optIdx);
                                            handleFieldChange(field.id, "options", updatedOpts);
                                          }}
                                          className="text-red-500 hover:text-red-700 p-1"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SECTION B: CUSTOM FIELDS BUILDER */}
                    <div className="bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/50 border border-blue-200/80 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                          Section B: Custom Fields Builder (+ Create Custom Field)
                          </h5>
                          <p className="text-xs text-slate-500 font-medium">
                            বিশেষ কোনো সার্ভিসের জন্য (যেমন: Solar Panel Count @ ৳150/panel) নতুন ফিল্ড তৈরি করুন:
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={addCustomField}
                          className="px-3.5 py-2 rounded-xl bg-[#007eff] hover:bg-[#0066ee] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Create Custom Field</span>
                        </button>
                      </div>

                      {/* ACTIVE CUSTOM FIELDS EDIT LIST */}
                      <div className="space-y-3">
                        {formFields.filter((f) => f.isPredefined === false).map((field, fieldIdx) => (
                          <div
                            key={field.id || fieldIdx}
                            className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-2xs"
                          >
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                                  Custom Field #{fieldIdx + 1}
                                </span>
                                <span className="text-xs font-bold text-slate-700">{field.label}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeField(field.id)}
                                className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Field Name / Label:</label>
                                <input
                                  type="text"
                                  value={field.label}
                                  onChange={(e) => handleFieldChange(field.id, "label", e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">Control Type:</label>
                                <select
                                  value={field.fieldType}
                                  onChange={(e) => handleFieldChange(field.id, "fieldType", e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                                >
                                  <option value="COUNTER">COUNTER ([-] 20 [+])</option>
                                  <option value="NUMBER">NUMBER / SqFt Input</option>
                                  <option value="SELECT">SELECT (Dropdown Options)</option>
                                  <option value="RADIO">RADIO (Option Cards)</option>
                                  <option value="TEXT">TEXT (Note Input)</option>
                                </select>
                              </div>

                              {(field.fieldType === "COUNTER" || field.fieldType === "NUMBER") && (
                                <div>
                                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Pricing Rate (৳ per unit):</label>
                                  <input
                                    type="number"
                                    min={0}
                                    step="any"
                                    value={field.unitPrice ?? ""}
                                    onChange={(e) => handleFieldChange(field.id, "unitPrice", e.target.value === "" ? 0 : Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff]"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Dropdown Options Editor for SELECT/RADIO */}
                            {(field.fieldType === "SELECT" || field.fieldType === "RADIO") && (
                              <div className="pt-2 border-t border-slate-100 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-700">Options & Pricing:</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const opts = field.options || [];
                                      handleFieldChange(field.id, "options", [
                                        ...opts,
                                        { label: "New Option", value: `opt_${Date.now()}`, price: 0 },
                                      ]);
                                    }}
                                    className="text-[11px] font-bold text-[#007eff] bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 hover:bg-blue-100"
                                  >
                                    + Add Option
                                  </button>
                                </div>
                                <div className="space-y-2">
                                  {(field.options || []).map((opt: any, optIdx: number) => (
                                    <div key={optIdx} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        placeholder="Option Name"
                                        value={opt.label}
                                        onChange={(e) => {
                                          const updatedOpts = [...field.options];
                                          updatedOpts[optIdx].label = e.target.value;
                                          handleFieldChange(field.id, "options", updatedOpts);
                                        }}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                                      />
                                      <input
                                        type="text"
                                        placeholder="value"
                                        value={opt.value}
                                        onChange={(e) => {
                                          const updatedOpts = [...field.options];
                                          updatedOpts[optIdx].value = e.target.value;
                                          handleFieldChange(field.id, "options", updatedOpts);
                                        }}
                                        className="w-24 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-700"
                                      />
                                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                                        <span className="text-xs font-bold text-slate-500">৳</span>
                                        <input
                                          type="number"
                                          min={0}
                                          step="any"
                                          value={opt.price ?? ""}
                                          onChange={(e) => {
                                            const updatedOpts = [...field.options];
                                            updatedOpts[optIdx].price = e.target.value === "" ? 0 : Number(e.target.value);
                                            handleFieldChange(field.id, "options", updatedOpts);
                                          }}
                                          className="w-16 text-xs font-bold text-slate-900 focus:outline-none"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedOpts = field.options.filter((_: any, i: number) => i !== optIdx);
                                          handleFieldChange(field.id, "options", updatedOpts);
                                        }}
                                        className="text-red-500 hover:text-red-700 p-1"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. IMAGES & INTRO PARAGRAPHS */}
                <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Layers className="w-4 h-4 text-[#007eff]" /> 2. Images & Overview Content
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* HERO COVER IMAGE PICKER & PREVIEW */}
                    <div className="space-y-2">
                      <label className="font-extrabold text-slate-800 block text-xs sm:text-sm">
                        Hero Cover Background Image:
                      </label>
                      <div className="border border-slate-200/90 bg-slate-50/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Preview Thumbnail */}
                        <div className="relative w-32 h-20 sm:h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center group shadow-2xs">
                          {heroImageVal ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={heroImageVal}
                              alt="Hero Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="text-center p-2 text-slate-400">
                              <UploadCloud className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                              <span className="text-[10px] font-bold block">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Action Controls & Input */}
                        <div className="flex-1 space-y-2.5 w-full">
                          <div className="flex items-center gap-2">
                            <label className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#007eff] hover:bg-blue-100 border border-blue-200 font-extrabold text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs">
                              <UploadCloud className="w-4 h-4 text-[#007eff]" />
                              <span>Choose Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleHeroFileUpload}
                                className="hidden"
                              />
                            </label>
                            {heroImageVal && (
                              <button
                                type="button"
                                onClick={() => setValue("heroImage", "", { shouldValidate: true })}
                                className="px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-extrabold text-xs cursor-pointer transition-all flex items-center gap-1.5"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                              <LinkIcon className="w-3 h-3" /> Or paste Image URL directly:
                            </span>
                            <input
                              type="text"
                              placeholder="/RESIDENTIAL-DEEP-CLEANING.png"
                              {...register("heroImage")}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff] transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONTENT BANNER IMAGE PICKER & PREVIEW */}
                    <div className="space-y-2">
                      <label className="font-extrabold text-slate-800 block text-xs sm:text-sm">
                        Content Banner Image:
                      </label>
                      <div className="border border-slate-200/90 bg-slate-50/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Preview Thumbnail */}
                        <div className="relative w-32 h-20 sm:h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center group shadow-2xs">
                          {contentImageVal ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={contentImageVal}
                              alt="Content Banner Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="text-center p-2 text-slate-400">
                              <UploadCloud className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                              <span className="text-[10px] font-bold block">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Action Controls & Input */}
                        <div className="flex-1 space-y-2.5 w-full">
                          <div className="flex items-center gap-2">
                            <label className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#007eff] hover:bg-blue-100 border border-blue-200 font-extrabold text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs">
                              <UploadCloud className="w-4 h-4 text-[#007eff]" />
                              <span>Choose Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleContentFileUpload}
                                className="hidden"
                              />
                            </label>
                            {contentImageVal && (
                              <button
                                type="button"
                                onClick={() => setValue("contentImage", "", { shouldValidate: true })}
                                className="px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-extrabold text-xs cursor-pointer transition-all flex items-center gap-1.5"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                              <LinkIcon className="w-3 h-3" /> Or paste Image URL directly:
                            </span>
                            <input
                              type="text"
                              placeholder="https://framerusercontent.com/..."
                              {...register("contentImage")}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#007eff] transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800 block">
                      Short Description (Catalog Card Text) <span className="text-red-500">*</span>:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. ঢাকার যেকোনো অ্যাপার্টমেন্ট ও আবাসিক বাড়ির জন্য সম্পূর্ণ রুম-বাই-রুম ডিপ রিফ্রেশ ক্লিনিং..."
                      {...register("shortDesc", { required: "Short Description is required" })}
                      className={`w-full bg-slate-50 border rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:bg-white transition-all ${
                        errors.shortDesc ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-[#007eff]"
                      }`}
                    />
                    {errors.shortDesc && (
                      <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.shortDesc.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">
                        Detailed Intro Paragraph 1:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Cleanix-এর আবাসিক ডিপ ক্লিনিং সার্ভিস আপনার বাসা বা অ্যাপার্টমেন্টকে করে তোলে সম্পূর্ণ জীবাণুমুক্ত..."
                        {...register("introParagraph1")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">
                        Detailed Intro Paragraph 2:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. গুলশান, বনানী, উত্তরা, ধানমন্ডি বা বসুন্ধরার যেকোনো অ্যাপার্টমেন্টের জন্য আমাদের এনআইডি ট্র্যাকিংকৃত এক্সপার্ট টিম..."
                        {...register("introParagraph2")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. DYNAMIC OFFERS LIST */}
                <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#007eff]" /> 3. What We Offer (আমাদের বিশেষ সেবাসমূহ)
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddOfferItem}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#007eff] hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Offer Item</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">Offers Section Title:</label>
                      <input
                        type="text"
                        placeholder="WHAT WE OFFER (আমাদের বিশেষ সেবাসমূহ)"
                        {...register("offersTitle")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">Offers Section Description:</label>
                      <input
                        type="text"
                        placeholder="ঢাকার অ্যাপার্টমেন্ট ও কমার্শিয়াল ফ্লোরের জন্য ডিপ রিসেট সার্ভিস।"
                        {...register("offersDesc")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Dynamic Offers Items List */}
                  <div className="space-y-3">
                    {formOffers.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5 relative group">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-xs text-slate-800">Offer Item #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveOfferItem(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove Offer Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Offer Title (e.g. Detailed Deep Clean & Wash)"
                            value={item.title}
                            onChange={(e) => handleOfferChange(idx, "title", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-[#007eff]"
                          />
                          <input
                            type="text"
                            placeholder="Offer Description (e.g. প্রতিটি রুম ও হাই-টাচ সারফেস জীবাণুমুক্তকরণ)"
                            value={item.desc}
                            onChange={(e) => handleOfferChange(idx, "desc", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#007eff]"
                          />
                        </div>
                      </div>
                    ))}

                    {formOffers.length === 0 && (
                      <div className="text-center py-4 text-xs text-slate-400 font-medium border border-dashed border-slate-200 rounded-xl">
                        No offer items added yet. Click &quot;Add Offer Item&quot; to configure features.
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. DYNAMIC WHY CHOOSE US & FAQS */}
                <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#007eff]" /> 4. Why Choose Us & FAQs
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddWhyPoint}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#007eff] hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Why Point</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAddFaqItem}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add FAQ</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">Why Choose Section Title:</label>
                      <input
                        type="text"
                        placeholder="WHY CHOOSE OUR SERVICE"
                        {...register("whyChooseTitle")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800 block">Why Choose Section Description:</label>
                      <input
                        type="text"
                        placeholder="Cleanix-এর ভেরিফাইড ক্লিনার টিম..."
                        {...register("whyChooseDesc")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Why Choose Points Items */}
                  <div className="space-y-3">
                    <span className="font-bold text-xs text-slate-700 block">Why Choose Points:</span>
                    {formWhyChoosePoints.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-xs text-slate-800">Why Point #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveWhyPoint(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Point Title (e.g. NID Verified Staff)"
                            value={item.title}
                            onChange={(e) => handleWhyPointChange(idx, "title", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-[#007eff]"
                          />
                          <input
                            type="text"
                            placeholder="Point Description (e.g. সিকিউরিটি চেককৃত টিম)"
                            value={item.desc}
                            onChange={(e) => handleWhyPointChange(idx, "desc", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#007eff]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FAQs Items */}
                  <div className="space-y-3 pt-2">
                    <span className="font-bold text-xs text-slate-700 block">Frequently Asked Questions (FAQs):</span>
                    {formFaqs.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-xs text-slate-800">FAQ #{item.num || idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFaqItem(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Question (e.g. সার্ভিস শুরু হতে কত সময় লাগে?)"
                            value={item.question}
                            onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-[#007eff]"
                          />
                          <textarea
                            rows={2}
                            placeholder="Answer (e.g. আমাদের ট্র্যাকিং টিম ২৫-৩০ মিনিটের মধ্যে...)"
                            value={item.answer}
                            onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#007eff]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FIXED MODAL FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white flex-shrink-0 z-20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingService}
                  className="px-6 py-2.5 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmittingService ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{editingSlug ? "Saving Changes..." : "Creating Offering..."}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingSlug ? "Save Changes" : "Create Service Offering"}</span>
                    </>
                  )}
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
