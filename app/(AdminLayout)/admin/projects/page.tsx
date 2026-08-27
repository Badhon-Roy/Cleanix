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
} from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { ProjectDetail } from "@/lib/projectsData";
import {
  fetchProjectsAPI,
  createProjectAPI,
  updateProjectAPI,
  deleteProjectAPI,
} from "@/services/projectService";

export default function AdminProjectsManagementPage() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // Form State
  const [formSlug, setFormSlug] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("RESIDENTIAL");
  const [formCategoryFull, setFormCategoryFull] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formHeroImage, setFormHeroImage] = useState("");
  const [formBenefitImage, setFormBenefitImage] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formProjectValue, setFormProjectValue] = useState("");
  const [formIntroParagraph, setFormIntroParagraph] = useState("");
  const [formSection2Title, setFormSection2Title] = useState("");
  const [formSection2Paragraph, setFormSection2Paragraph] = useState("");
  const [formBenefitsTitle, setFormBenefitsTitle] = useState("");
  const [formBenefitsPointsStr, setFormBenefitsPointsStr] = useState("");
  const [formSection4Title, setFormSection4Title] = useState("");
  const [formSection4Paragraph, setFormSection4Paragraph] = useState("");
  const [formStatus, setFormStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [isSaving, setIsSaving] = useState(false);

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
    setFormSlug("");
    setFormTitle("");
    setFormCategory("RESIDENTIAL");
    setFormCategoryFull("Residential Deep Cleaning / Care");
    setFormClient("");
    setFormHeroImage(
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"
    );
    setFormBenefitImage(
      "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630"
    );
    setFormStartDate("10 February, 2026");
    setFormEndDate("12 February, 2026");
    setFormProjectValue("৳20,000 BDT");
    setFormIntroParagraph("");
    setFormSection2Title("COMPLETE DEEP RESET FOR PREMISES");
    setFormSection2Paragraph("");
    setFormBenefitsTitle("PROJECT BENEFITS (প্রজেক্টের বিশেষ সুবিধাসমূহ)");
    setFormBenefitsPointsStr(
      "Full Room-by-Room Deep Clean, High-Touch Disinfection, Certified Eco Disinfectants, Supervisor Quality Audit"
    );
    setFormSection4Title("SPOTLESS RESULT & CLIENT SATISFACTION");
    setFormSection4Paragraph("");
    setFormStatus("PUBLISHED");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ProjectDetail) => {
    setEditingSlug(item.slug);
    setFormSlug(item.slug);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormCategoryFull(item.categoryFull);
    setFormClient(item.client);
    setFormHeroImage(item.heroImage);
    setFormBenefitImage(item.benefitImage);
    setFormStartDate(item.startDate);
    setFormEndDate(item.endDate);
    setFormProjectValue(item.projectValue);
    setFormIntroParagraph(item.introParagraph);
    setFormSection2Title(item.section2Title);
    setFormSection2Paragraph(item.section2Paragraph);
    setFormBenefitsTitle(item.benefitsTitle);
    setFormBenefitsPointsStr(
      Array.isArray(item.benefitsPoints) ? item.benefitsPoints.join(", ") : ""
    );
    setFormSection4Title(item.section4Title);
    setFormSection4Paragraph(item.section4Paragraph);
    setFormStatus(item.status || "PUBLISHED");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formIntroParagraph.trim()) {
      toast.error("Please fill in Project Title and Intro Paragraph.");
      return;
    }

    setIsSaving(true);

    const computedSlug =
      formSlug.trim() ||
      formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `project-${Date.now()}`;

    const benefitsPoints = formBenefitsPointsStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const projectObj: ProjectDetail = {
      slug: computedSlug,
      title: formTitle.toUpperCase(),
      category: formCategory.toUpperCase(),
      categoryFull: formCategoryFull,
      client: formClient,
      heroImage: formHeroImage,
      benefitImage: formBenefitImage,
      startDate: formStartDate,
      endDate: formEndDate,
      projectValue: formProjectValue,
      introParagraph: formIntroParagraph,
      section2Title: formSection2Title,
      section2Paragraph: formSection2Paragraph,
      benefitsTitle: formBenefitsTitle,
      benefitsPoints: benefitsPoints.length > 0 ? benefitsPoints : ["Full Deep Cleaning"],
      section4Title: formSection4Title,
      section4Paragraph: formSection4Paragraph,
      status: formStatus,
    };

    try {
      if (editingSlug) {
        const res = await updateProjectAPI(editingSlug, projectObj);
        if (res && res.success) {
          toast.success(`Project "${formTitle}" updated successfully live!`);
          loadData();
          setIsModalOpen(false);
        } else {
          toast.error(res?.message || "Failed to update project");
        }
      } else {
        const res = await createProjectAPI(projectObj);
        if (res && res.success) {
          toast.success(`New Project "${formTitle}" published successfully live!`);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 space-y-6 relative my-8 max-h-[90vh] overflow-y-auto">
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

            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 block">
                    Project Title (e.g. GULSHAN 2 DUPLEX VILLA FULL DEEP CLEAN):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GULSHAN 2 DUPLEX VILLA FULL DEEP CLEAN"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Category Tag (e.g. RESIDENTIAL, COMMERCIAL):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RESIDENTIAL"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Full Category Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Residential Turnover / Deep Cleaning"
                    value={formCategoryFull}
                    onChange={(e) => setFormCategoryFull(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Client Name & Location:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chowdhury Residence (Gulshan 2)"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Project Value / Budget:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ৳18,500 BDT"
                    value={formProjectValue}
                    onChange={(e) => setFormProjectValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Start Date:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 05 February, 2026"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 block">
                    Completion Date:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 07 February, 2026"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 block">
                    Hero Cover Image URL:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={formHeroImage}
                    onChange={(e) => setFormHeroImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 block">
                    Benefit / Secondary Image URL:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://framerusercontent.com/..."
                    value={formBenefitImage}
                    onChange={(e) => setFormBenefitImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Intro Paragraph (Bangla / English):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. গুলশান ২ এর ৪,৫০০ স্কয়ার ফিট ডুপ্লেক্স ভিলার জন্য কাস্টমাইজড ডিপ ক্লিনিং..."
                  value={formIntroParagraph}
                  onChange={(e) => setFormIntroParagraph(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 block">
                    Section 2 Heading:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. COMPLETE FRESH RESET FOR LUXURY HOMES"
                    value={formSection2Title}
                    onChange={(e) => setFormSection2Title(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-extrabold text-slate-800 block">
                    Section 2 Description:
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. ব্যস্ততার কারণে নিয়মিত ঝাড়ু-মোছায় জমে থাকা জেদি ধুলো..."
                    value={formSection2Paragraph}
                    onChange={(e) => setFormSection2Paragraph(e.target.value)}
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
                  required
                  placeholder="e.g. Full Villa Room-by-Room Deep Clean, Kitchen Hood Degreasing, Anti-Bacterial Sanitizing"
                  value={formBenefitsPointsStr}
                  onChange={(e) => setFormBenefitsPointsStr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">
                  Publication Status:
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "PUBLISHED" | "DRAFT")}
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
