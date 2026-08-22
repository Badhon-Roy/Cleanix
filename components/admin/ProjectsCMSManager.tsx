"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  ExternalLink,
  Sparkles,
  FolderCheck,
  Info,
  CheckCircle2,
  Plus,
  Trash2,
  GripVertical,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import {
  getStoredProjectsCMSData,
  saveProjectsCMSData,
  ProjectsCMSContent,
} from "@/lib/projectsCMSData";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function ProjectsCMSManager() {
  const { register, handleSubmit, reset, control, watch, setValue, getValues } =
    useForm<ProjectsCMSContent>({
      defaultValues: getStoredProjectsCMSData(),
    });

  const formData = watch();

  useEffect(() => {
    reset(getStoredProjectsCMSData());
  }, [reset]);

  const [draggedCheckIndex, setDraggedCheckIndex] = useState<number | null>(null);

  const onSubmit = (data: ProjectsCMSContent) => {
    saveProjectsCMSData(data);
    toast.success("Projects Page CMS updated live!");
  };

  // Dynamic Checklist Handlers
  const handleAddCheckmark = () => {
    const current = getValues("overviewChecks") || [];
    setValue("overviewChecks", [...current, "NEW PORTFOLIO FEATURE"]);
  };

  const handleUpdateCheckmark = (index: number, text: string) => {
    const current = [...(getValues("overviewChecks") || [])];
    current[index] = text;
    setValue("overviewChecks", current);
  };

  const handleDeleteCheckmark = (index: number) => {
    const current = (getValues("overviewChecks") || []).filter((_, i) => i !== index);
    setValue("overviewChecks", current);
  };

  const handleCheckDragStart = (index: number) => {
    setDraggedCheckIndex(index);
  };

  const handleCheckDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedCheckIndex === null || draggedCheckIndex === targetIndex) return;

    const current = [...(getValues("overviewChecks") || [])];
    const itemToMove = current[draggedCheckIndex];
    current.splice(draggedCheckIndex, 1);
    current.splice(targetIndex, 0, itemToMove);

    setDraggedCheckIndex(targetIndex);
    setValue("overviewChecks", current);
  };

  const handleCheckDragEnd = () => {
    setDraggedCheckIndex(null);
  };

  const handleMoveCheckmark = (index: number, direction: "left" | "right") => {
    const current = [...(getValues("overviewChecks") || [])];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;

    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    setValue("overviewChecks", current);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Action Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#11233F] flex items-center gap-2.5">
            <FolderCheck className="w-5 h-5 text-[#007eff]" /> Projects Page Dynamic CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage public Projects page (`/projects`) hero banner, portfolio headlines, and overview section.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/projects"
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
        {/* SECTION 1: PROJECTS HERO BANNER SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#007eff]" /> 1. Projects Hero Banner Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Main portfolio hero title, pill badge, highlight word, description, and cover background image on `/projects`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Hero Pill Badge (e.g. OUR RECENT WORK &amp; PORTFOLIO):
              </label>
              <input
                type="text"
                {...register("heroBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-4">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. EXPLORE OUR):
              </label>
              <input
                type="text"
                {...register("heroTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-4">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word (e.g. SUCCESSFUL):
              </label>
              <input
                type="text"
                {...register("heroTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-4">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 2 (e.g. CLEANING PROJECTS):
              </label>
              <input
                type="text"
                {...register("heroTitleLine2")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
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
                    rows={3}
                    placeholder="Enter projects hero subtitle..."
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PROJECTS OVERVIEW STORY SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Info className="w-5 h-5 text-[#007eff]" /> 2. Projects Overview Story &amp; Dynamic Checklist Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage section pill badge, headline, side feature image, single description editor, and dynamic checklist points.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Overview Pill Badge (e.g. 1,200+ COMPLETED PROJECTS IN DHAKA):
              </label>
              <input
                type="text"
                {...register("overviewBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. DELIVERING CLEANER,):
              </label>
              <input
                type="text"
                {...register("overviewTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 2 (e.g. HEALTHIER SPACES WITH):
              </label>
              <input
                type="text"
                {...register("overviewTitleLine2")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word (e.g. PROFESSIONAL):
              </label>
              <input
                type="text"
                {...register("overviewTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 3 (e.g. CARE):
              </label>
              <input
                type="text"
                {...register("overviewTitleLine3")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="overviewFeatureImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Projects Overview Left Feature Image:"
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
                    label="Overview Description Paragraph (Supports HTML & Multiple Paragraphs):"
                    value={field.value}
                    onChange={field.onChange}
                    rows={6}
                    placeholder="Enter overview description paragraphs... Press Enter for line breaks."
                  />
                )}
              />
            </div>

            {/* Dynamic Checklist Items Block */}
            <div className="space-y-3 sm:col-span-12 pt-4 border-t border-slate-200/80">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007eff]" />
                  <span>Feature Checklist Items ({(formData.overviewChecks || []).length} Items):</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddCheckmark}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Checklist Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(formData.overviewChecks || []).map((checkItem, index) => (
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
                      className="flex-1 min-w-0 bg-transparent p-1.5 text-[#11233F] font-bold text-xs sm:text-sm focus:outline-none"
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
                        disabled={index === (formData.overviewChecks?.length || 1) - 1}
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
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!formData.overviewChecks || formData.overviewChecks.length === 0) && (
                  <div className="col-span-full text-center py-4 text-xs font-bold text-slate-400">
                    No checklist items added yet. Click &quot;Add Checklist Item&quot; to add one.
                  </div>
                )}
              </div>
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
            <span>Save Projects CMS Live</span>
          </button>
        </div>
      </form>
    </div>
  );
}
