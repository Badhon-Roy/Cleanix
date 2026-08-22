"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  ExternalLink,
  Sparkles,
  Layers,
  Info,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  Home,
  Building2,
  HelpCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import {
  getStoredServicesCMSData,
  saveServicesCMSData,
  ServicesCMSContent,
  HowItWorksStepItem,
} from "@/lib/servicesCMSData";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function ServicesCMSManager() {
  const { register, handleSubmit, reset, control, watch, setValue, getValues } =
    useForm<ServicesCMSContent>({
      defaultValues: getStoredServicesCMSData(),
    });

  const formData = watch();

  useEffect(() => {
    reset(getStoredServicesCMSData());
  }, [reset]);

  const [dragCard1Index, setDragCard1Index] = useState<number | null>(null);
  const [dragCard2Index, setDragCard2Index] = useState<number | null>(null);

  // How It Works Step Modal State
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [stepBadgeText, setStepBadgeText] = useState("STEP 01");
  const [stepTitleText, setStepTitleText] = useState("");
  const [stepDescText, setStepDescText] = useState("");
  const [stepImageText, setStepImageText] = useState("");

  // Delete Confirm Modal
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const onSubmit = (data: ServicesCMSContent) => {
    saveServicesCMSData(data);
    toast.success("Services Page CMS updated live!");
  };

  // Card 1 Checkmark Handlers
  const handleAddCard1Check = () => {
    const current = getValues("card1Checks") || [];
    setValue("card1Checks", [...current, "New Residential Feature"]);
  };

  const handleUpdateCard1Check = (index: number, text: string) => {
    const current = [...(getValues("card1Checks") || [])];
    current[index] = text;
    setValue("card1Checks", current);
  };

  const handleDeleteCard1Check = (index: number) => {
    const current = (getValues("card1Checks") || []).filter((_, i) => i !== index);
    setValue("card1Checks", current);
  };

  const handleCard1DragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragCard1Index === null || dragCard1Index === targetIndex) return;

    const current = [...(getValues("card1Checks") || [])];
    const itemToMove = current[dragCard1Index];
    current.splice(dragCard1Index, 1);
    current.splice(targetIndex, 0, itemToMove);

    setDragCard1Index(targetIndex);
    setValue("card1Checks", current);
  };

  // Card 2 Checkmark Handlers
  const handleAddCard2Check = () => {
    const current = getValues("card2Checks") || [];
    setValue("card2Checks", [...current, "New Commercial Feature"]);
  };

  const handleUpdateCard2Check = (index: number, text: string) => {
    const current = [...(getValues("card2Checks") || [])];
    current[index] = text;
    setValue("card2Checks", current);
  };

  const handleDeleteCard2Check = (index: number) => {
    const current = (getValues("card2Checks") || []).filter((_, i) => i !== index);
    setValue("card2Checks", current);
  };

  const handleCard2DragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragCard2Index === null || dragCard2Index === targetIndex) return;

    const current = [...(getValues("card2Checks") || [])];
    const itemToMove = current[dragCard2Index];
    current.splice(dragCard2Index, 1);
    current.splice(targetIndex, 0, itemToMove);

    setDragCard2Index(targetIndex);
    setValue("card2Checks", current);
  };

  // How It Works Steps Handlers
  const handleOpenAddStepModal = () => {
    setEditingStepId(null);
    const count = (getValues("howItWorksSteps") || []).length + 1;
    setStepBadgeText(count < 10 ? `STEP 0${count}` : `STEP ${count}`);
    setStepTitleText("");
    setStepDescText("");
    setStepImageText(
      "https://framerusercontent.com/images/iP0bB1oMamNlkOzNJQUNBhTRiU.png?width=464&height=320"
    );
    setIsStepModalOpen(true);
  };

  const handleOpenEditStepModal = (item: HowItWorksStepItem) => {
    setEditingStepId(item.id);
    setStepBadgeText(item.step);
    setStepTitleText(item.title);
    setStepDescText(item.description);
    setStepImageText(item.image);
    setIsStepModalOpen(true);
  };

  const handleSaveStepItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepTitleText.trim() || !stepDescText.trim()) {
      toast.error("Please provide title and description for the step.");
      return;
    }

    const currentSteps = getValues("howItWorksSteps") || [];
    let updated: HowItWorksStepItem[] = [];

    if (editingStepId) {
      updated = currentSteps.map((s) =>
        s.id === editingStepId
          ? {
              ...s,
              step: stepBadgeText,
              title: stepTitleText,
              description: stepDescText,
              image: stepImageText,
            }
          : s
      );
      toast.success("Step card updated successfully!");
    } else {
      const newStep: HowItWorksStepItem = {
        id: `HW-${Date.now()}`,
        step: stepBadgeText,
        title: stepTitleText,
        description: stepDescText,
        image: stepImageText,
      };
      updated = [...currentSteps, newStep];
      toast.success("New step card added!");
    }

    setValue("howItWorksSteps", updated);
    saveServicesCMSData(getValues());
    setIsStepModalOpen(false);
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const current = [...(getValues("howItWorksSteps") || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;

    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;

    setValue("howItWorksSteps", current);
    saveServicesCMSData(getValues());
  };

  const handleConfirmDeleteStep = () => {
    if (!deleteConfirmTarget) return;

    const current = (getValues("howItWorksSteps") || []).filter(
      (s) => s.id !== deleteConfirmTarget.id
    );
    setValue("howItWorksSteps", current);
    saveServicesCMSData(getValues());
    toast.error(`Step "${deleteConfirmTarget.title}" deleted.`);
    setDeleteConfirmTarget(null);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Action Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#11233F] flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#007eff]" /> Services Page Dynamic CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage public Services page (`/services`) hero banner, overview story, feature cards, core services, and How It Works steps.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/services"
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
        {/* SECTION 1: SERVICES HERO BANNER SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#007eff]" /> 1. Services Hero Banner Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Main hero title, pill badge, highlight words, description, and cover image on `/services`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Hero Pill Badge (e.g. WORLD-CLASS CLEANING SOLUTIONS):
              </label>
              <input
                type="text"
                {...register("heroBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Headline Line 1 (3/4 width) */}
            <div className="space-y-1.5 sm:col-span-9">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. EXPERT CLEANING SERVICES FOR):
              </label>
              <input
                type="text"
                {...register("heroTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Headline Highlight Word 1 (1/4 width) */}
            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word 1 (e.g. HOMES):
              </label>
              <input
                type="text"
                {...register("heroTitleHighlight1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Middle Word/Symbol (1/4 width) */}
            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Middle Symbol/Text (e.g. &amp;):
              </label>
              <input
                type="text"
                {...register("heroTitleMiddle")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Headline Highlight Word 2 (3/4 width) */}
            <div className="space-y-1.5 sm:col-span-9">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word 2 (e.g. BUSINESSES):
              </label>
              <input
                type="text"
                {...register("heroTitleHighlight2")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="heroImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Hero Cover Background Image:"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="Recommended: 1920x800px (JPG, PNG or WebP)"
                    aspectRatio="banner"
                  />
                )}
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="heroSubtitle"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    label="Subtitle Description Paragraph (Supports HTML & Formatting):"
                    value={field.value}
                    onChange={field.onChange}
                    rows={4}
                    placeholder="Enter services hero subtitle..."
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: SERVICES OVERVIEW STORY & FEATURE CARDS SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Info className="w-5 h-5 text-[#007eff]" /> 2. Services Overview Story &amp; Feature Cards Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage section pill badge, main headline, side feature image, description, and Residential/Commercial feature cards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Overview Pill Badge (e.g. SERVICES OVERVIEW):
              </label>
              <input
                type="text"
                {...register("overviewBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. COMPLETE HOME &amp; BUSINESS):
              </label>
              <input
                type="text"
                {...register("overviewTitle1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Highlight Word:
              </label>
              <input
                type="text"
                {...register("overviewTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 2 (e.g. CARE):
              </label>
              <input
                type="text"
                {...register("overviewTitle2")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="overviewFeatureImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Services Overview Left Feature Image:"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="Recommended: 600x640px (Transparent PNG)"
                    aspectRatio="portrait"
                  />
                )}
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="overviewDesc"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    label="Overview Description Paragraph (Supports HTML & Formatting):"
                    value={field.value}
                    onChange={field.onChange}
                    rows={3}
                    placeholder="Enter overview description..."
                  />
                )}
              />
            </div>
          </div>

          {/* TWO FEATURE CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200/80">
            {/* CARD 1: RESIDENTIAL B2C */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <Home className="w-5 h-5 text-[#007eff]" />
                <h4 className="font-bold text-[#11233F] text-base">Card 1: Residential Cleaning (B2C)</h4>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#11233F] text-xs">Card Title:</label>
                <input
                  type="text"
                  {...register("card1Title")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-sm focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#11233F] text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#007eff]" />
                    <span>Card 1 Checklist Items ({(formData.card1Checks || []).length}):</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleAddCard1Check}
                    className="px-3 py-1 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.card1Checks || []).map((item, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => setDragCard1Index(idx)}
                      onDragOver={(e) => handleCard1DragOver(e, idx)}
                      onDragEnd={() => setDragCard1Index(null)}
                      className={`flex items-center gap-2 bg-slate-50 p-2 rounded-xl border ${
                        dragCard1Index === idx ? "border-[#007eff] bg-blue-50" : "border-slate-200"
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateCard1Check(idx, e.target.value)}
                        className="flex-1 bg-transparent text-xs font-bold text-[#11233F] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteCard1Check(idx)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 2: COMMERCIAL B2B */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <Building2 className="w-5 h-5 text-[#007eff]" />
                <h4 className="font-bold text-[#11233F] text-base">Card 2: Commercial Cleaning (B2B)</h4>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#11233F] text-xs">Card Title:</label>
                <input
                  type="text"
                  {...register("card2Title")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-sm focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#11233F] text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#007eff]" />
                    <span>Card 2 Checklist Items ({(formData.card2Checks || []).length}):</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleAddCard2Check}
                    className="px-3 py-1 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.card2Checks || []).map((item, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => setDragCard2Index(idx)}
                      onDragOver={(e) => handleCard2DragOver(e, idx)}
                      onDragEnd={() => setDragCard2Index(null)}
                      className={`flex items-center gap-2 bg-slate-50 p-2 rounded-xl border ${
                        dragCard2Index === idx ? "border-[#007eff] bg-blue-50" : "border-slate-200"
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateCard2Check(idx, e.target.value)}
                        className="flex-1 bg-transparent text-xs font-bold text-[#11233F] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteCard2Check(idx)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CORE SERVICES CARDS LIST & SECTION SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#007eff]" /> 3. Core Services Cards Section Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage core services section pill badge, headline, and highlight word displayed on `/services`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Section Pill Badge (e.g. OUR CORE SERVICES):
              </label>
              <input
                type="text"
                {...register("coreBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-9">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. RELIABLE HOME &amp; COMMERCIAL):
              </label>
              <input
                type="text"
                {...register("coreTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word (e.g. CLEANING):
              </label>
              <input
                type="text"
                {...register("coreTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 2 (e.g. SERVICES):
              </label>
              <input
                type="text"
                {...register("coreTitleLine2")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: HOW IT WORKS 3-STEP CARDS SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-[#007eff]" /> 4. How It Works Steps &amp; Section Settings ({(formData.howItWorksSteps?.length || 0)} Steps)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage section headlines, description, and the 3-step booking process cards.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddStepModal}
              className="px-4 py-2 rounded-2xl font-bold text-xs bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Step Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Section Pill Badge (e.g. HOW IT WORKS):
              </label>
              <input
                type="text"
                {...register("howItWorksBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-9">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Text (e.g. EASY STEPS TO BOOK YOUR):
              </label>
              <input
                type="text"
                {...register("howItWorksTitle")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word (e.g. CLEANING):
              </label>
              <input
                type="text"
                {...register("howItWorksHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Header Right Subtitle Description:
              </label>
              <textarea
                rows={2}
                {...register("howItWorksRightDesc")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-medium focus:outline-none focus:border-[#007eff]"
              />
            </div>
          </div>

          {/* STEP CARDS LIST */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#11233F] text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#007eff]" /> Step Cards List ({(formData.howItWorksSteps?.length || 0)} Items):
              </label>

              <button
                type="button"
                onClick={handleOpenAddStepModal}
                className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Step Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {(formData.howItWorksSteps || []).map((stepItem, index) => (
                <div
                  key={stepItem.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between hover:border-[#007eff]/60 transition-all"
                >
                  <div className="space-y-3">
                    <div className="relative w-full h-[140px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                      <Image
                        src={stepItem.image}
                        alt={stepItem.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#007eff] text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow-xs">
                        {stepItem.step}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#11233F] text-sm uppercase leading-snug">
                        {stepItem.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1 line-clamp-2">
                        {stepItem.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveStep(index, "up")}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === (formData.howItWorksSteps?.length || 1) - 1}
                        onClick={() => handleMoveStep(index, "down")}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move Right"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditStepModal(stepItem)}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-colors cursor-pointer"
                        title="Edit Step"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmTarget({ id: stepItem.id, title: stepItem.title })}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                        title="Delete Step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
            <span>Save Services CMS Live</span>
          </button>
        </div>
      </form>

      {/* ADD / EDIT STEP CARD MODAL */}
      {isStepModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#11233F]">
                    {editingStepId ? "Edit Step Card" : "Add New Step Card"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Configure step badge, title, description, and cover photo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStepModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStepItem} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-[#11233F] block">Step Badge (e.g. STEP 01):</label>
                <input
                  type="text"
                  required
                  value={stepBadgeText}
                  onChange={(e) => setStepBadgeText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#11233F] block">Step Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INSTANT BOOKING & ESTIMATE"
                  value={stepTitleText}
                  onChange={(e) => setStepTitleText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1">
                <ImageUploadPreview
                  label="Step Card Cover Photo:"
                  value={stepImageText}
                  onChange={(newUrl) => setStepImageText(newUrl)}
                  recommendedSize="Recommended: 464x320px"
                  aspectRatio="banner"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#11233F] block">Step Description Details:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what the customer needs to do in this step..."
                  value={stepDescText}
                  onChange={(e) => setStepDescText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium text-xs focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStepModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#007eff] hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingStepId ? "Update Step Card" : "Save Step Card"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmTarget && (
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
                Are you sure you want to delete step{" "}
                <span className="font-bold text-[#11233F]">
                  &quot;{deleteConfirmTarget.title}&quot;
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStep}
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
