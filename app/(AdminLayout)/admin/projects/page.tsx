"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Save,
  Check,
  Power,
  Sparkles,
  ChevronDown,
  DollarSign,
  Calendar,
  User,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useForm, Controller } from "react-hook-form";
import { ProjectDetail } from "@/lib/projectsData";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";
import {
  fetchProjectsAPI,
  createProjectAPI,
  updateProjectAPI,
  deleteProjectAPI,
} from "@/services/projectService";

export interface ProjectFormData {
  slug: string;
  title: string;
  category: string;
  categoryFull: string;
  client: string;
  projectValue: string;
  startDate: string;
  endDate: string;
  heroImage: string;
  benefitImage: string;
  introParagraph: string;
  section2Title: string;
  section2Paragraph: string;
  benefitsTitle: string;
  benefitsPointsStr: string;
  section4Title: string;
  section4Paragraph: string;
  status: "PUBLISHED" | "DRAFT";
}

export default function AdminProjectsManagementPage() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      slug: "",
      title: "",
      category: "RESIDENTIAL",
      categoryFull: "Residential Deep Cleaning / Care",
      client: "",
      projectValue: "৳20,000 BDT",
      startDate: "10 February, 2026",
      endDate: "12 February, 2026",
      heroImage:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
      benefitImage:
        "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630",
      introParagraph: "",
      section2Title: "COMPLETE DEEP RESET FOR PREMISES",
      section2Paragraph: "",
      benefitsTitle: "PROJECT BENEFITS (প্রজেক্টের বিশেষ সুবিধাসমূহ)",
      benefitsPointsStr:
        "Full Room-by-Room Deep Clean, High-Touch Disinfection, Certified Eco Disinfectants, Supervisor Quality Audit",
      section4Title: "SPOTLESS RESULT & CLIENT SATISFACTION",
      section4Paragraph: "",
      status: "PUBLISHED",
    },
  });

  const loadData = () => {
    fetchProjectsAPI().then((res) => {
      if (res && res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        setProjects([]);
      }
    });
  };

  useEffect(() => {
    loadData();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("cms_updated", (payload: any) => {
      if (payload?.page === "projects") {
        loadData();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingSlug(null);
    reset({
      slug: "",
      title: "",
      category: "RESIDENTIAL",
      categoryFull: "Residential Deep Cleaning / Care",
      client: "",
      heroImage:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
      benefitImage:
        "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630",
      startDate: "10 February, 2026",
      endDate: "12 February, 2026",
      projectValue: "৳20,000 BDT",
      introParagraph: "",
      section2Title: "COMPLETE DEEP RESET FOR PREMISES",
      section2Paragraph: "",
      benefitsTitle: "PROJECT BENEFITS (প্রজেক্টের বিশেষ সুবিধাসমূহ)",
      benefitsPointsStr:
        "Full Room-by-Room Deep Clean, High-Touch Disinfection, Certified Eco Disinfectants, Supervisor Quality Audit",
      section4Title: "SPOTLESS RESULT & CLIENT SATISFACTION",
      section4Paragraph: "",
      status: "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ProjectDetail) => {
    setEditingSlug(item.slug);
    reset({
      slug: item.slug,
      title: item.title,
      category: item.category,
      categoryFull: item.categoryFull,
      client: item.client,
      heroImage: item.heroImage,
      benefitImage: item.benefitImage,
      startDate: item.startDate,
      endDate: item.endDate,
      projectValue: item.projectValue,
      introParagraph: item.introParagraph,
      section2Title: item.section2Title || "",
      section2Paragraph: item.section2Paragraph || "",
      benefitsTitle: item.benefitsTitle || "",
      benefitsPointsStr: Array.isArray(item.benefitsPoints)
        ? item.benefitsPoints.join(", ")
        : "",
      section4Title: item.section4Title || "",
      section4Paragraph: item.section4Paragraph || "",
      status: item.status || "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const onSubmitForm = async (formData: ProjectFormData) => {
    setIsSaving(true);

    const computedSlug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `project-${Date.now()}`;

    const benefitsPoints = (formData.benefitsPointsStr || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const projectObj: ProjectDetail = {
      slug: computedSlug,
      title: formData.title.trim().toUpperCase(),
      category: formData.category.trim().toUpperCase(),
      categoryFull: formData.categoryFull.trim(),
      client: formData.client.trim(),
      heroImage: formData.heroImage.trim(),
      benefitImage: formData.benefitImage.trim(),
      startDate: formData.startDate.trim(),
      endDate: formData.endDate.trim(),
      projectValue: formData.projectValue.trim(),
      introParagraph: formData.introParagraph.trim(),
      section2Title: formData.section2Title.trim(),
      section2Paragraph: formData.section2Paragraph.trim(),
      benefitsTitle: formData.benefitsTitle.trim(),
      benefitsPoints: benefitsPoints.length > 0 ? benefitsPoints : ["Full Deep Cleaning"],
      section4Title: formData.section4Title.trim(),
      section4Paragraph: formData.section4Paragraph.trim(),
      status: formData.status,
    };

    try {
      if (editingSlug) {
        const res = await updateProjectAPI(editingSlug, projectObj);
        if (res && res.success) {
          toast.success(`Project "${formData.title}" updated successfully live!`);
          loadData();
          setIsModalOpen(false);
        } else {
          toast.error(res?.message || "Failed to update project");
        }
      } else {
        const res = await createProjectAPI(projectObj);
        if (res && res.success) {
          toast.success(`New Project "${formData.title}" published successfully live!`);
          loadData();
          setIsModalOpen(false);
        } else {
          toast.error(res?.message || "Failed to publish project");
        }
      }
    } catch (err: any) {
      console.error("Error saving project:", err);
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (item: ProjectDetail) => {
    const nextStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await updateProjectAPI(item.slug, { status: nextStatus });
      if (res && res.success) {
        toast.info(`Project "${item.title}" status set to ${nextStatus}`);
        setProjects((prev) =>
          prev.map((p) => (p.slug === item.slug ? { ...p, status: nextStatus } : p))
        );
      }
    } catch (err) {
      console.error("Error toggling project status:", err);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete project case study "${title}"?`
    );
    if (confirmDelete) {
      try {
        const res = await deleteProjectAPI(slug);
        if (res && res.success) {
          toast.success(`Project "${title}" deleted live from database.`);
          setProjects((prev) => prev.filter((p) => p.slug !== slug));
        } else {
          toast.error(res?.message || "Failed to delete project");
        }
      } catch (err) {
        console.error("Error deleting project:", err);
        toast.error("Failed to delete project");
      }
    }
  };

  // Search & Filter Logic
  const filteredProjects = projects.filter((item) => {
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.client.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.projectValue.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.status === "PUBLISHED").length;
  const draftCount = projects.filter((p) => p.status === "DRAFT").length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Clean Header Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 stroke-[2.5]" />
              </div>
              Projects Portfolio & Case Studies Manager
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ LIVE CASE STUDIES CMS
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Manage showcase cleaning projects in Gulshan, Banani, Uttara, & Dhanmondi. Add client names, project values, and before/after details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Showcase Projects */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Portfolio Items
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{totalCount} Projects</p>
          <p className="text-xs font-semibold text-slate-500">Real-world case studies</p>
        </div>

        {/* Live Published */}
        <div className="bg-emerald-50/40 border border-emerald-300/80 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
              Published On Website
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-950 tracking-tight">{publishedCount} Live</p>
          <p className="text-xs font-bold text-emerald-800">Visible on `/projects` page</p>
        </div>

        {/* Drafts */}
        <div className="bg-amber-50/40 border border-amber-300/80 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
              Draft / Hidden
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-950 tracking-tight">{draftCount} Drafts</p>
          <p className="text-xs font-semibold text-amber-800">Internal preview only</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: `All Projects (${totalCount})` },
              { id: "PUBLISHED", label: `Published (${publishedCount})` },
              { id: "DRAFT", label: `Drafts (${draftCount})` },
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
              placeholder="Search Title, Client, Value..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((item) => (
            <div
              key={item.slug}
              className={`bg-white border rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all ${
                item.status === "PUBLISHED"
                  ? "border-slate-200/90 hover:border-[#007eff]/60"
                  : "border-slate-200 bg-slate-50/60 opacity-80"
              }`}
            >
              {/* Image Preview Header */}
              <div className="space-y-4">
                <div className="relative w-full h-[200px] sm:h-[220px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
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
                        item.status === "PUBLISHED"
                          ? "bg-emerald-600 text-white border-emerald-700"
                          : "bg-slate-900 text-white border-slate-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-1.5 text-slate-700 min-w-0 flex-1">
                      <User className="w-3.5 h-3.5 text-[#007eff] flex-shrink-0" />
                      <span className="truncate">{item.client}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 font-extrabold flex-shrink-0">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{item.projectValue}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed pt-1">
                    {item.introParagraph}
                  </p>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <Link
                  href={`/projects/${item.slug}`}
                  target="_blank"
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className={`px-3 py-2 rounded-xl font-extrabold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                      item.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{item.status === "PUBLISHED" ? "Published" : "Draft"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-colors cursor-pointer"
                    title="Edit Case Study"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.slug, item.title)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium">
              No project case studies found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 space-y-6 relative my-8 max-h-[85vh] overflow-y-auto"
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-extrabold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingSlug ? "Edit Project Case Study" : "Add New Showcase Project"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {editingSlug ? editingSlug : "Create new portfolio case study"}
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

            <form noValidate onSubmit={handleSubmit(onSubmitForm)} className="space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 block">
                    Project Title (e.g. GULSHAN 2 DUPLEX VILLA FULL DEEP CLEAN):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GULSHAN 2 DUPLEX VILLA FULL DEEP CLEAN"
                    {...register("title", {
                      required: "Project title is required",
                      onChange: (e) => {
                        if (!editingSlug) {
                          const val = e.target.value;
                          const generatedSlug = val
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "");
                          setValue("slug", generatedSlug);
                        }
                      },
                    })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:bg-white ${
                      errors.title ? "border-red-400 bg-red-50/40" : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Category Tag (e.g. RESIDENTIAL, COMMERCIAL):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RESIDENTIAL"
                    {...register("category", { required: "Category tag is required" })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:bg-white ${
                      errors.category ? "border-red-400 bg-red-50/40" : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.category && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Full Category Name:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Residential Turnover / Deep Cleaning"
                    {...register("categoryFull", { required: "Full category name is required" })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:bg-white ${
                      errors.categoryFull ? "border-red-400 bg-red-50/40" : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.categoryFull && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.categoryFull.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Client Name & Location:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chowdhury Residence (Gulshan 2)"
                    {...register("client", { required: "Client name is required" })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:bg-white ${
                      errors.client ? "border-red-400 bg-red-50/40" : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.client && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.client.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Project Value / Budget:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ৳18,500 BDT"
                    {...register("projectValue", { required: "Project value is required" })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:bg-white ${
                      errors.projectValue ? "border-red-400 bg-red-50/40" : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.projectValue && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.projectValue.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Start Date:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 05 February, 2026"
                    {...register("startDate", { required: "Start date is required" })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:bg-white ${
                      errors.startDate ? "border-red-400 bg-red-50/40" : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Completion Date:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 07 February, 2026"
                    {...register("endDate", { required: "Completion date is required" })}
                    className={`w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:bg-white ${
                      errors.endDate ? "border-red-400 bg-red-50/40" : "border-slate-200 focus:border-[#007eff]"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.endDate.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Controller
                    name="heroImage"
                    control={control}
                    rules={{ required: "Hero cover background image is required" }}
                    render={({ field }) => (
                      <div>
                        <ImageUploadPreview
                          label="Hero Cover Background Image:"
                          value={field.value}
                          onChange={(val) => field.onChange(val)}
                          recommendedSize="Recommended 1600x900 WebP/JPG format"
                          aspectRatio="banner"
                        />
                        {errors.heroImage && (
                          <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.heroImage.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Controller
                    name="benefitImage"
                    control={control}
                    render={({ field }) => (
                      <ImageUploadPreview
                        label="Benefit / Secondary Image:"
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        recommendedSize="Recommended 600x600 WebP/PNG format"
                        aspectRatio="banner"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Intro Paragraph (Bangla / English):
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. গুলশান ২ এর ৪,৫০০ স্কয়ার ফিট ডুপ্লেক্স ভিলার জন্য কাস্টমাইজড ডিপ ক্লিনিং..."
                  {...register("introParagraph", { required: "Intro paragraph is required" })}
                  className={`w-full bg-slate-50 border rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:bg-white ${
                    errors.introParagraph ? "border-red-400 bg-red-50/40" : "border-slate-200 focus:border-[#007eff]"
                  }`}
                />
                {errors.introParagraph && (
                  <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.introParagraph.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 block">
                    Section 2 Heading:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. COMPLETE FRESH RESET FOR LUXURY HOMES"
                    {...register("section2Title")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 block">
                    Section 2 Description:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. ব্যস্ততার কারণে নিয়মিত ঝাড়ু-মোছায় জমে থাকা জেদি ধুলো..."
                    {...register("section2Paragraph")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Project Benefits Points (Comma-separated list):
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Full Villa Room-by-Room Deep Clean, Kitchen Hood Degreasing, Anti-Bacterial Sanitizing"
                  {...register("benefitsPointsStr")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Publication Status:
                </label>
                <select
                  {...register("status")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold focus:outline-none focus:border-[#007eff]"
                >
                  <option value="PUBLISHED">PUBLISHED (Visible on Website)</option>
                  <option value="DRAFT">DRAFT (Hidden from Public)</option>
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
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-2xl bg-[#007eff] hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>
                    {isSaving
                      ? "Saving..."
                      : editingSlug
                      ? "Save Changes"
                      : "Publish Project"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
