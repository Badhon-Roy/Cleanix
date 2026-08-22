"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Info,
  Save,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  UserCheck,
  Truck,
  Star,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Milestone,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";
import {
  AboutContent,
  TeamMemberItem,
  JourneyStepItem,
  getStoredAboutData,
  saveAboutData,
} from "@/lib/aboutData";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function AboutCMSManager() {
  const { register, handleSubmit, reset, control, watch, setValue, getValues } =
    useForm<AboutContent>({
      defaultValues: getStoredAboutData(),
    });

  const formData = watch();

  useEffect(() => {
    reset(getStoredAboutData());

    const handleUpdate = () => {
      reset(getStoredAboutData());
    };

    window.addEventListener("cleanix_about_updated", handleUpdate);
    return () => {
      window.removeEventListener("cleanix_about_updated", handleUpdate);
    };
  }, [reset]);

  const [draggedCheckIndex, setDraggedCheckIndex] = useState<number | null>(null);

  // Form Submit Handler
  const onSubmit = (data: AboutContent) => {
    saveAboutData(data);
    toast.success("About Us Page CMS updated successfully! (Changes Live)");
  };

  // Dynamic Checkmarks Handlers
  const handleAddCheckmark = () => {
    const current = getValues("ctaChecks") || [];
    setValue("ctaChecks", [...current, "NEW CHECKMARK ITEM"]);
  };

  const handleUpdateCheckmark = (index: number, text: string) => {
    const current = [...(getValues("ctaChecks") || [])];
    current[index] = text;
    setValue("ctaChecks", current);
  };

  const handleDeleteCheckmark = (index: number) => {
    const current = (getValues("ctaChecks") || []).filter((_, i) => i !== index);
    setValue("ctaChecks", current);
  };

  const handleCheckDragStart = (index: number) => {
    setDraggedCheckIndex(index);
  };

  const handleCheckDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedCheckIndex === null || draggedCheckIndex === targetIndex) return;

    const current = [...(getValues("ctaChecks") || [])];
    const itemToMove = current[draggedCheckIndex];
    current.splice(draggedCheckIndex, 1);
    current.splice(targetIndex, 0, itemToMove);

    setDraggedCheckIndex(targetIndex);
    setValue("ctaChecks", current);
  };

  const handleCheckDragEnd = () => {
    setDraggedCheckIndex(null);
  };

  const handleMoveCheckmark = (index: number, direction: "left" | "right") => {
    const current = [...(getValues("ctaChecks") || [])];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;

    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    setValue("ctaChecks", current);
  };

  // Team Member Modal State & Handlers
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberImage, setMemberImage] = useState("");
  const [memberNidVerified, setMemberNidVerified] = useState(true);
  const [memberBio, setMemberBio] = useState("");

  const handleOpenAddTeamModal = () => {
    setEditingMemberId(null);
    setMemberName("");
    setMemberRole("SENIOR SPECIALIST");
    setMemberImage(
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
    );
    setMemberNidVerified(true);
    setMemberBio("");
    setIsTeamModalOpen(true);
  };

  const handleOpenEditTeamModal = (item: TeamMemberItem) => {
    setEditingMemberId(item.id);
    setMemberName(item.name);
    setMemberRole(item.role);
    setMemberImage(item.image);
    setMemberNidVerified(item.nidVerified);
    setMemberBio(item.bio);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberName.trim() || !memberRole.trim()) {
      toast.error("Please provide Team Member Name and Role.");
      return;
    }

    const currentMembers = getValues("teamMembers") || [];
    let updatedMembers: TeamMemberItem[] = [];

    if (editingMemberId) {
      updatedMembers = currentMembers.map((m) =>
        m.id === editingMemberId
          ? {
              ...m,
              name: memberName,
              role: memberRole,
              image: memberImage,
              nidVerified: memberNidVerified,
              bio: memberBio,
            }
          : m
      );
      toast.success(`Team Member "${memberName}" updated.`);
    } else {
      const newMember: TeamMemberItem = {
        id: `TM-${Date.now()}`,
        name: memberName,
        role: memberRole,
        image: memberImage,
        nidVerified: memberNidVerified,
        bio: memberBio,
      };
      updatedMembers = [newMember, ...currentMembers];
      toast.success(`New Team Member "${memberName}" added.`);
    }

    setValue("teamMembers", updatedMembers);
    saveAboutData(getValues());
    setIsTeamModalOpen(false);
  };

  // Journey Stepper Modal State & Handlers
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [editingJourneyId, setEditingJourneyId] = useState<string | null>(null);
  const [stepNumber, setStepNumber] = useState("01");
  const [stepYear, setStepYear] = useState("2025–2026");
  const [stepSide, setStepSide] = useState<"left" | "right">("right");
  const [stepTitle, setStepTitle] = useState("");
  const [stepDesc, setStepDesc] = useState("");

  const handleOpenAddJourneyModal = () => {
    setEditingJourneyId(null);
    const nextNum = (getValues("journeySteps")?.length || 0) + 1;
    setStepNumber(nextNum < 10 ? `0${nextNum}` : `${nextNum}`);
    setStepYear("2025–2026");
    setStepSide(nextNum % 2 === 0 ? "left" : "right");
    setStepTitle("");
    setStepDesc("");
    setIsJourneyModalOpen(true);
  };

  const handleOpenEditJourneyModal = (item: JourneyStepItem) => {
    setEditingJourneyId(item.id);
    setStepNumber(item.number);
    setStepYear(item.year);
    setStepSide(item.side);
    setStepTitle(item.title);
    setStepDesc(item.desc);
    setIsJourneyModalOpen(true);
  };

  const handleSaveJourneyStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepTitle.trim() || !stepDesc.trim()) {
      toast.error("Please enter a title and description for the milestone!");
      return;
    }

    const currentSteps = getValues("journeySteps") || [];

    if (editingJourneyId) {
      const updated = currentSteps.map((step) =>
        step.id === editingJourneyId
          ? {
              ...step,
              number: stepNumber,
              year: stepYear,
              side: stepSide,
              title: stepTitle,
              desc: stepDesc,
            }
          : step
      );
      setValue("journeySteps", updated);
      saveAboutData(getValues());
      toast.success("Journey milestone updated successfully!");
    } else {
      const newStep: JourneyStepItem = {
        id: `JS-${Date.now()}`,
        number: stepNumber,
        year: stepYear,
        side: stepSide,
        title: stepTitle,
        desc: stepDesc,
      };
      const updated = [...currentSteps, newStep];
      setValue("journeySteps", updated);
      saveAboutData(getValues());
      toast.success("New journey milestone added!");
    }

    setIsJourneyModalOpen(false);
  };

  // Delete Confirm Modal State & Handlers
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    type: "team" | "journey";
    id: string;
    title: string;
  } | null>(null);

  const requestDeleteJourneyStep = (id: string, title: string) => {
    setDeleteConfirmModal({ type: "journey", id, title });
  };

  const requestDeleteTeamMember = (id: string, name: string) => {
    setDeleteConfirmModal({ type: "team", id, title: name });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmModal) return;

    if (deleteConfirmModal.type === "team") {
      const updatedMembers = (getValues("teamMembers") || []).filter(
        (m) => m.id !== deleteConfirmModal.id
      );
      setValue("teamMembers", updatedMembers);
      saveAboutData(getValues());
      toast.error(`Team Member "${deleteConfirmModal.title}" removed.`);
    } else if (deleteConfirmModal.type === "journey") {
      const updated = (getValues("journeySteps") || []).filter(
        (s) => s.id !== deleteConfirmModal.id
      );
      setValue("journeySteps", updated);
      saveAboutData(getValues());
      toast.error(`Journey Milestone "${deleteConfirmModal.title}" removed.`);
    }

    setDeleteConfirmModal(null);
  };

  const handleMoveJourneyStep = (index: number, direction: "up" | "down") => {
    const current = [...(getValues("journeySteps") || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;

    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;

    setValue("journeySteps", current);
    saveAboutData(getValues());
  };

  return (
    <div className="space-y-8 w-full">
      {/* Action Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#11233F] flex items-center gap-2.5">
            <Info className="w-5 h-5 text-[#007eff]" /> About Us Page Dynamic CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage public About Us page headlines, company story, statistics counters, and executive team roster.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/about"
            target="_blank"
            className="px-4 py-2 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Public View</span>
          </Link>

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="px-5 py-2 rounded-2xl font-bold text-xs bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Live</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECTION 1: HERO BANNER SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#007eff]" /> 1. Hero Banner Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Main hero title, pill badge, subtitle, and cover background image on `/about`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Hero Pill Badge (e.g. ABOUT CLEANIX):
              </label>
              <input
                type="text"
                {...register("heroBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. REDEFINING CLEANLINESS WITH):
              </label>
              <input
                type="text"
                {...register("heroTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Highlight Word (e.g. TECHNOLOGY):
              </label>
              <input
                type="text"
                {...register("heroTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-2">
              <Controller
                name="heroImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Hero Cover Background Image:"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="Recommended: 1920x800px"
                    aspectRatio="banner"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Subtitle Paragraph (Bangla / English):
              </label>
              <textarea
                rows={2}
                {...register("heroSubtitle")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-medium focus:outline-none focus:border-[#007eff]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPANY OVERVIEW STORY & COUNTER CARDS SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Info className="w-5 h-5 text-[#007eff]" /> 2. Company Overview Story &amp; Counter Cards Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Overview headline, description text, side images, and the 3 bottom statistic counter cards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Overview Pill Badge (e.g. COMPANY OVERVIEW):
              </label>
              <input
                type="text"
                {...register("overviewBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. PROFESSIONAL CLEANING):
              </label>
              <input
                type="text"
                {...register("overviewTitle1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Highlight Word (e.g. SERVICE NETWORK):
              </label>
              <input
                type="text"
                {...register("overviewTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-1">
              <Controller
                name="overviewLeftImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Overview Left Side Image:"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="Recommended: 600x600px"
                    aspectRatio="square"
                  />
                )}
              />
            </div>

            <div className="sm:col-span-1">
              <Controller
                name="overviewRightImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Overview Right Side Image:"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="Recommended: 600x600px"
                    aspectRatio="square"
                  />
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <Controller
                name="overviewDesc"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    label="Overview Description Paragraph (Supports HTML & Formatting):"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter company overview description..."
                  />
                )}
              />
            </div>
          </div>

          {/* Embedded Company Overview Counter Cards Block */}
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <label className="font-bold text-[#11233F] text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#007eff]" /> Company Overview Bottom Counter Cards (Cleanings, Clients, Rating):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Card 1: Cleanings Completed */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4 text-slate-700" />
                    <span>1. Cleanings Completed</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                    Navy Card
                  </span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Count Number / Value:</label>
                    <input
                      type="text"
                      placeholder="e.g. 16K+"
                      {...register("stat1Count")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold text-lg focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Label Text:</label>
                    <input
                      type="text"
                      placeholder="e.g. Cleanings Completed"
                      {...register("stat1Label")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 font-bold text-xs focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Satisfied Clients */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                  <span className="text-xs font-bold text-[#007eff] uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#007eff]" />
                    <span>2. Satisfied Clients</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#007eff] text-white">
                    Blue Card
                  </span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">Count Number / Value:</label>
                    <input
                      type="text"
                      placeholder="e.g. 1,200+"
                      {...register("stat2Count")}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold text-lg focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">Label Text:</label>
                    <input
                      type="text"
                      placeholder="e.g. Satisfied Clients"
                      {...register("stat2Label")}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-bold text-xs focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Average Client Rating */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>3. Average Client Rating</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                    Navy Card
                  </span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Rating Score / Value:</label>
                    <input
                      type="text"
                      placeholder="e.g. 4.9 / 5"
                      {...register("stat3Count")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold text-lg focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Label Text:</label>
                    <input
                      type="text"
                      placeholder="e.g. Average Client Rating"
                      {...register("stat3Label")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 font-bold text-xs focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: WHO WE ARE & COMPANY MISSION SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#007eff]" /> 3. Who We Are &amp; Company Mission Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage headlines, feature image, experience stats, who we are description paragraphs, and checklist items.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Section Pill Badge (e.g. ABOUT OUR COMPANY):
              </label>
              <input
                type="text"
                {...register("whoWeAreBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Main Headline Text (3/4 width) */}
            <div className="space-y-1.5 sm:col-span-9">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Main Headline Text:
              </label>
              <input
                type="text"
                {...register("whoWeAreTitle")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Headline Highlight Word (1/4 width) */}
            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Highlight Word:
              </label>
              <input
                type="text"
                {...register("whoWeAreHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="whoWeAreFeatureImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Who We Are Main Feature Image:"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="Recommended: 1200x800px"
                    aspectRatio="banner"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Years of Experience Value (e.g. 10+):
              </label>
              <input
                type="text"
                {...register("whoWeAreExpYears")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Years of Experience Label:
              </label>
              <input
                type="text"
                {...register("whoWeAreExpLabel")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Happy Clients Count Badge:
              </label>
              <input
                type="text"
                {...register("whoWeAreClientsCount")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Google Rating Score (e.g. 4.8/5.0):
              </label>
              <input
                type="text"
                {...register("whoWeAreRatingScore")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Subheading Title (e.g. আমরা কারা? (Who We Are)):
              </label>
              <input
                type="text"
                {...register("whoWeAreSubheading")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="whoWeArePara1"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    label="Company Story & Description Paragraphs (Press Enter for line breaks, HTML supported):"
                    value={field.value}
                    onChange={field.onChange}
                    rows={6}
                    placeholder="Type your description text here... Press Enter to create new line breaks or paragraphs."
                  />
                )}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Checklist Item 1:
              </label>
              <input
                type="text"
                {...register("whoWeAreCheck1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Checklist Item 2:
              </label>
              <input
                type="text"
                {...register("whoWeAreCheck2")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Checklist Item 3:
              </label>
              <input
                type="text"
                {...register("whoWeAreCheck3")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Checklist Item 4:
              </label>
              <input
                type="text"
                {...register("whoWeAreCheck4")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: TEAM MEMBERS & SPECIALISTS ROSTER */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
                <Users className="w-5 h-5 text-[#007eff]" /> 4. Executive &amp; Specialist Team Roster ({(formData.teamMembers || []).length} Members)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage team specialists, photos, roles, NID badges, and bios displayed on `/about`.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddTeamModal}
              className="px-4 py-2 rounded-2xl font-bold text-xs bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Team Specialist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(formData.teamMembers || []).map((member) => (
              <div
                key={member.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between hover:border-[#007eff]/60 transition-all"
              >
                <div className="space-y-3">
                  <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {member.nidVerified && (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full border border-emerald-700">
                        NID VERIFIED
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                    <p className="text-xs font-bold text-[#007eff] uppercase tracking-wider">{member.role}</p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1 line-clamp-2">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditTeamModal(member)}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-colors cursor-pointer"
                    title="Edit Team Member"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => requestDeleteTeamMember(member.id, member.name)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                    title="Delete Team Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {(!formData.teamMembers || formData.teamMembers.length === 0) && (
              <div className="col-span-full py-8 text-center text-slate-500 font-medium">
                No team specialists added yet. Click &quot;Add Team Specialist&quot; to add one.
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: PROFESSIONAL CLEANING PROMO CTA BANNER SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#007eff]" /> 5. Professional Cleaning Promo CTA Banner Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage bottom promo banner background image, spinning badge text, main headline, checkmarks, and CTA button.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="sm:col-span-12">
              <Controller
                name="ctaBannerImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Promo CTA Banner Background Image:"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="Recommended: 1920x600px"
                    aspectRatio="banner"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Rotating Top Badge Text (e.g. • CLEANING • DEEP CLEAN • HOME CARE • SANITIZE):
              </label>
              <input
                type="text"
                {...register("ctaBadgeText")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Promo Card Headline Title:
              </label>
              <input
                type="text"
                {...register("ctaTitle")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Dynamic Checkmarks Block */}
            <div className="space-y-3 sm:col-span-12 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007eff]" />
                  <span>Promo Card Dynamic Checkmarks ({(formData.ctaChecks || []).length} Items):</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddCheckmark}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Checkmark Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(formData.ctaChecks || []).map((checkItem, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleCheckDragStart(index)}
                    onDragOver={(e) => handleCheckDragOver(e, index)}
                    onDragEnd={handleCheckDragEnd}
                    className={`flex items-center gap-1.5 bg-white p-2 rounded-2xl border ${
                      draggedCheckIndex === index
                        ? "border-[#007eff] bg-blue-50/50"
                        : "border-slate-200"
                    } transition-all cursor-grab active:cursor-grabbing`}
                  >
                    <div
                      className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1"
                      title="Drag to reorder index"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-bold text-slate-400">#{index + 1}</span>

                    <input
                      type="text"
                      value={checkItem}
                      onChange={(e) => handleUpdateCheckmark(index, e.target.value)}
                      className="flex-1 min-w-0 bg-transparent p-1.5 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none uppercase"
                    />

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveCheckmark(index, "left")}
                        className="p-1 rounded-lg text-slate-400 hover:text-[#007eff] hover:bg-blue-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={index === (formData.ctaChecks?.length || 1) - 1}
                        onClick={() => handleMoveCheckmark(index, "right")}
                        className="p-1 rounded-lg text-slate-400 hover:text-[#007eff] hover:bg-blue-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="Move Right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCheckmark(index)}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Checkmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!formData.ctaChecks || formData.ctaChecks.length === 0) && (
                  <div className="col-span-full text-center py-4 text-xs font-bold text-slate-400">
                    No checkmark items added yet. Click &quot;Add Checkmark Item&quot; to add one.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: COMPANY JOURNEY TIMELINE SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
                <Milestone className="w-5 h-5 text-[#007eff]" /> 6. Company Journey Timeline Settings ({(formData.journeySteps?.length || 0)} Milestones)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage section pill badge, headline, and timeline milestone cards displayed on `/about`.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddJourneyModal}
              className="px-4 py-2 rounded-2xl font-bold text-xs bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Journey Milestone</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Section Pill Badge (e.g. OUR JOURNEY):
              </label>
              <input
                type="text"
                {...register("journeyBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Main Title Line 1 (3/4 width) */}
            <div className="space-y-1.5 sm:col-span-9">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Main Headline Text:
              </label>
              <input
                type="text"
                {...register("journeyTitle")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Headline Highlight Word (1/4 width) */}
            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Highlight Word:
              </label>
              <input
                type="text"
                {...register("journeyHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>
          </div>

          {/* Timeline Milestones Cards List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#11233F] text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#007eff]" /> Timeline Milestone Cards List ({(formData.journeySteps?.length || 0)} Items):
              </label>

              <button
                type="button"
                onClick={handleOpenAddJourneyModal}
                className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {(formData.journeySteps || []).map((step, index) => (
                <div
                  key={step.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#007eff]/60 transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                      {step.number}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                          {step.year}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#007eff] uppercase">
                          {step.side === "left" ? "Left Side Column" : "Right Side Column"}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveJourneyStep(index, "up")}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowLeft className="w-4 h-4 rotate-90" />
                    </button>

                    <button
                      type="button"
                      disabled={index === (formData.journeySteps?.length || 1) - 1}
                      onClick={() => handleMoveJourneyStep(index, "down")}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditJourneyModal(step)}
                      className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-colors cursor-pointer"
                      title="Edit Milestone"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => requestDeleteJourneyStep(step.id, step.title)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {(!formData.journeySteps || formData.journeySteps.length === 0) && (
                <div className="text-center py-6 text-xs font-bold text-slate-400">
                  No journey milestone steps added yet. Click &quot;Add Journey Milestone&quot; to add one.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SAVE BUTTON */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl font-bold text-sm bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save All Changes Live</span>
          </button>
        </div>
      </form>

      {/* ADD / EDIT TEAM SPECIALIST MODAL */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingMemberId ? "Edit Team Specialist" : "Add Team Specialist"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Configure specialist profile details for `/about`
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTeamModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamMember} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-[#11233F] block">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariqul Islam"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#11233F] block">Job Role / Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Head of Operations & Quality Audit"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <ImageUploadPreview
                  label="Team Specialist Photo Image:"
                  value={memberImage}
                  onChange={(newUrl) => setMemberImage(newUrl)}
                  recommendedSize="Recommended: 600x600px"
                  aspectRatio="square"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="nidVerified"
                  checked={memberNidVerified}
                  onChange={(e) => setMemberNidVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-[#007eff] focus:ring-[#007eff]"
                />
                <label htmlFor="nidVerified" className="font-bold text-[#11233F] cursor-pointer">
                  Display &quot;NID Verified&quot; Badge
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#11233F] block">Short Bio / Description:</label>
                <textarea
                  rows={3}
                  placeholder="e.g. ১০ বছরের ফিল্ড সার্ভিস অভিজ্ঞতা সহ প্রজেক্ট ইনসপেকশন এক্সপার্ট।"
                  value={memberBio}
                  onChange={(e) => setMemberBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMemberId ? "Save Member" : "Add Member"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT JOURNEY MILESTONE MODAL */}
      {isJourneyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-bold">
                  <Milestone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#11233F]">
                    {editingJourneyId ? "Edit Journey Milestone" : "Add Journey Milestone"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Configure timeline milestone step for `/about`
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsJourneyModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJourneyStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#11233F] text-xs">
                    Step Number Badge (e.g. 01):
                  </label>
                  <input
                    type="text"
                    required
                    value={stepNumber}
                    onChange={(e) => setStepNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-black focus:outline-none focus:border-[#007eff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#11233F] text-xs">
                    Year Range Badge (e.g. 2025–2026):
                  </label>
                  <input
                    type="text"
                    required
                    value={stepYear}
                    onChange={(e) => setStepYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 text-xs">
                  Display Side Position:
                </label>
                <select
                  value={stepSide}
                  onChange={(e) => setStepSide(e.target.value as "left" | "right")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                >
                  <option value="right">Right Side Column</option>
                  <option value="left">Left Side Column</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 text-xs">
                  Milestone Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Expanding Smart SaaS Automation Across Dhaka City"
                  value={stepTitle}
                  onChange={(e) => setStepTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 text-xs">
                  Description Details:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe key achievements..."
                  value={stepDesc}
                  onChange={(e) => setStepDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium text-xs focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsJourneyModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#007eff] hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingJourneyId ? "Update Milestone" : "Save Milestone"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL POPUP */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 relative text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 text-red-500 border border-red-200 flex items-center justify-center font-bold">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#11233F]">
                Confirm Deletion
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-bold text-[#11233F]">
                  &quot;{deleteConfirmModal.title}&quot;
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
