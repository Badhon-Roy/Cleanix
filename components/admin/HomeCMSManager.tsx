"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  ExternalLink,
  Sparkles,
  Sliders,
  ShieldCheck,
  HelpCircle,
  Home as HomeIcon,
  BarChart3,
  Plus,
  Trash2,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  defaultHomeCMSData,
  HomeCMSContent,
  FaqItem,
} from "@/lib/homeCMSData";
import { fetchHomeCMSAPI, updateHomeCMSAPI } from "@/services/cmsService";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";
import DeleteCardConfirmModal from "@/components/admin/DeleteCardConfirmModal";

interface HomeCMSManagerProps {
  activeTab: "homePage" | "hero" | "impact" | "services" | "whyUs" | "cta" | "faq";
}

function ChecklistArrayEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const handleAdd = () => {
    const hasEmptyLine = safeItems.some((item) => !item?.trim());
    if (hasEmptyLine) {
      toast.error("আগে খালি চেকমার্ক লাইনটি ফিল-আপ করুন!");
      return;
    }
    onChange([...safeItems, ""]);
  };

  const handleConfirmDelete = () => {
    if (deleteIdx !== null) {
      onChange(safeItems.filter((_, i) => i !== deleteIdx));
      setDeleteIdx(null);
    }
  };

  const handleChange = (index: number, val: string) => {
    const next = [...safeItems];
    next[index] = val;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#11233F]">{label}:</label>
        <button
          type="button"
          onClick={handleAdd}
          className="text-[11px] font-extrabold text-[#007eff] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Checkmark Line</span>
        </button>
      </div>

      <div className="space-y-2">
        {safeItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder={`Checkmark Line ${idx + 1}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium text-xs focus:outline-none focus:border-[#007eff]"
            />
            <button
              type="button"
              onClick={() => setDeleteIdx(idx)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex-shrink-0"
              title="Remove Checkmark"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {safeItems.length === 0 && (
          <p className="text-[11px] text-slate-400 italic">No checkmark lines added yet. Click &quot;Add Checkmark Line&quot; to add one.</p>
        )}
      </div>

      <DeleteCardConfirmModal
        isOpen={deleteIdx !== null}
        onClose={() => setDeleteIdx(null)}
        onConfirm={handleConfirmDelete}
        cardTitle={
          deleteIdx !== null && safeItems[deleteIdx]
            ? `Checkmark Line "${safeItems[deleteIdx] || 'Untitled Item'}"`
            : "this checkmark line"
        }
      />
    </div>
  );
}

export default function HomeCMSManager({ activeTab }: HomeCMSManagerProps) {
  const [currentSection, setCurrentSection] = useState<
    "hero" | "impact" | "services" | "whyUs" | "cta" | "faq"
  >(activeTab === "homePage" ? "hero" : (activeTab as any));

  const [deleteFaqIdx, setDeleteFaqIdx] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentSection(activeTab === "homePage" ? "hero" : (activeTab as any));
  }, [activeTab]);

  const { register, handleSubmit, reset, control, watch, getValues } = useForm<HomeCMSContent>({
    defaultValues: defaultHomeCMSData,
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: "faqItems",
  });

  useEffect(() => {
    // Initial fetch directly from backend API & reset form
    fetchHomeCMSAPI().then((res) => {
      if (res && res.success && res.data) {
        reset({ ...defaultHomeCMSData, ...res.data });
      }
    });
  }, [reset]);

  const onSubmit = async (data: HomeCMSContent) => {
    setIsSaving(true);
    try {
      // Direct update to backend API database
      const res = await updateHomeCMSAPI(data);
      if (res && res.success) {
        toast.success("Home Page CMS updated live on MongoDB database!");
      } else {
        toast.error(res?.message || "Failed to update Home Page CMS on database");
      }
    } catch (err: any) {
      console.error("Error submitting Home CMS:", err);
      toast.error("Failed to update Home Page CMS");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFaq = () => {
    const currentFaqs = getValues("faqItems") || [];
    const hasEmptyFaq = currentFaqs.some(
      (item) => !item?.question?.trim() || !item?.answer?.trim()
    );

    if (hasEmptyFaq) {
      toast.error("আগে আগের FAQ-এর প্রশ্ন ও উত্তর ফিল-আপ করুন!");
      return;
    }

    appendFaq({ id: Date.now(), question: "", answer: "" });
  };

  const handleConfirmDeleteFaq = () => {
    if (deleteFaqIdx !== null) {
      removeFaq(deleteFaqIdx);
      toast.success("FAQ item deleted");
      setDeleteFaqIdx(null);
    }
  };

  const currentFaqItems = watch("faqItems") || [];

  return (
    <div className="space-y-8 w-full">
      {/* Action Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#11233F] flex items-center gap-2.5">
            <HomeIcon className="w-5 h-5 text-[#007eff]" /> Home Page Dynamic CMS Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage public Home page (`http://localhost:3000/`) section titles, badges, stats, and cover assets.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/"
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

      {/* Sub-Section Switcher for Home Page */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-slate-100/70 p-2 rounded-2xl border border-slate-200/80">
        {[
          { id: "hero", label: "1. Hero Banner", icon: Sparkles },
          { id: "impact", label: "2. Impact & Numbers", icon: BarChart3 },
          { id: "whyUs", label: "3. Why Choose Us", icon: ShieldCheck },
          { id: "services", label: "4. Core Services", icon: Sliders },
          { id: "faq", label: "5. FAQ", icon: HelpCircle },
          { id: "cta", label: "6. CTA Banner", icon: Megaphone },
        ].map((sec) => {
          const IconComp = sec.icon;
          const isActive = currentSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setCurrentSection(sec.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#007eff] text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-white/60"
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. HERO BANNER SECTION */}
        {currentSection === "hero" && (
          <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200/80 pb-4">
              <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#007eff]" /> 1. Hero Banner Section Settings
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage hero title, pill badge tagline, description, cover image, and CTA buttons.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              <div className="space-y-1.5 sm:col-span-12">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Hero Pill Badge (e.g. BANGLADESH&apos;S #1 HYBRID CLEANING PLATFORM):
                </label>
                <input
                  type="text"
                  {...register("heroBadge")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Headline Line 1 (e.g. RELIABLE CLEANING,):
                </label>
                <input
                  type="text"
                  {...register("heroTitleLine1")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Headline Line 2 (e.g. HOMES &amp; OFFICES):
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
                      recommendedSize="Recommended: 1920x1080px (PNG, JPG or WebP)"
                      aspectRatio="banner"
                    />
                  )}
                />
              </div>

              <div className="sm:col-span-12">
                <Controller
                  name="heroDescription"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      label="Hero Subtitle Description (Supports HTML & Formatting):"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
                      placeholder="Enter hero description..."
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Button 1 Text (e.g. Our Services):
                </label>
                <input
                  type="text"
                  {...register("heroBtn1Text")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Button 1 Link Href (e.g. /services):
                </label>
                <input
                  type="text"
                  {...register("heroBtn1Href")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Button 2 Text (e.g. Get Free Quote):
                </label>
                <input
                  type="text"
                  {...register("heroBtn2Text")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Button 2 Link Href (e.g. /contact):
                </label>
                <input
                  type="text"
                  {...register("heroBtn2Href")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. OUR IMPACT & NUMBERS SECTION */}
        {currentSection === "impact" && (
          <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200/80 pb-4">
              <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-[#007eff]" /> 2. Our Impact &amp; Numbers Section Settings
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage section badge, headline, subtitle, left/right exterior photos, and 3 key metrics stat cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              <div className="space-y-1.5 sm:col-span-12">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Section Badge (e.g. OUR IMPACT &amp; NUMBERS):
                </label>
                <input
                  type="text"
                  {...register("impactBadge")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Headline Line 1 (e.g. REAL NUMBERS BEHIND OUR):
                </label>
                <input
                  type="text"
                  {...register("impactTitleLine1")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Highlight Word (e.g. CLEANING EXCELLENCE):
                </label>
                <input
                  type="text"
                  {...register("impactTitleHighlight")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="sm:col-span-12">
                <Controller
                  name="impactSubtitle"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      label="Header Right Subtitle Description (Supports HTML & Formatting):"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
                      placeholder="Enter subtitle..."
                    />
                  )}
                />
              </div>

              {/* Left and Right Photos Upload */}
              <div className="sm:col-span-6">
                <Controller
                  name="impactLeftImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadPreview
                      label="Left Column Modern Property Photo:"
                      value={field.value}
                      onChange={field.onChange}
                      recommendedSize="Recommended: 900x820px (PNG, JPG)"
                      aspectRatio="square"
                    />
                  )}
                />
              </div>

              <div className="sm:col-span-6">
                <Controller
                  name="impactRightImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadPreview
                      label="Right Column Modern Property Photo:"
                      value={field.value}
                      onChange={field.onChange}
                      recommendedSize="Recommended: 850x850px (PNG, JPG)"
                      aspectRatio="square"
                    />
                  )}
                />
              </div>

              {/* 3 Stat Metric Cards */}
              <div className="sm:col-span-12 border-t border-slate-200 pt-5">
                <h4 className="font-bold text-[#11233F] text-sm mb-4">Center 3 Key Metric Cards:</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Stat Card 1 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-extrabold text-[#007eff]">Metric Card 1</span>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Value (e.g. 2,500+):</label>
                      <input
                        type="text"
                        {...register("impactStat1Value")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#007eff] font-black text-sm focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Label Text:</label>
                      <input
                        type="text"
                        {...register("impactStat1Label")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-extrabold text-[#007eff]">Metric Card 2</span>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Value (e.g. 150+):</label>
                      <input
                        type="text"
                        {...register("impactStat2Value")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#007eff] font-black text-sm focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Label Text:</label>
                      <input
                        type="text"
                        {...register("impactStat2Label")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-extrabold text-[#007eff]">Metric Card 3</span>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Value (e.g. 99.2%):</label>
                      <input
                        type="text"
                        {...register("impactStat3Value")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#007eff] font-black text-sm focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Label Text:</label>
                      <input
                        type="text"
                        {...register("impactStat3Label")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. WHY CHOOSE US SECTION */}
        {currentSection === "whyUs" && (
          <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200/80 pb-4">
              <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#007eff]" /> 3. Why Choose Us Section Settings
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage section pill badge, headline, cleaner feature image, and dynamic checkmark bullet lists for each feature card.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              <div className="space-y-1.5 sm:col-span-12">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Why Us Pill Badge (e.g. WHY CHOOSE US):
                </label>
                <input
                  type="text"
                  {...register("whyUsBadge")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-4">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Headline Line 1 (e.g. WHY CHOOSE OUR CLEANIX):
                </label>
                <input
                  type="text"
                  {...register("whyUsTitleLine1")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-4">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Highlight Word (e.g. CLEANING):
                </label>
                <input
                  type="text"
                  {...register("whyUsTitleHighlight")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-4">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Headline Line 2 (e.g. SERVICES):
                </label>
                <input
                  type="text"
                  {...register("whyUsTitleLine2")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="sm:col-span-12">
                <Controller
                  name="whyUsCleanerImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadPreview
                      label="Why Choose Us Cleaner Feature Image:"
                      value={field.value}
                      onChange={field.onChange}
                      recommendedSize="Recommended: 460x620px (Transparent PNG)"
                      aspectRatio="portrait"
                    />
                  )}
                />
              </div>

              {/* 4 Dynamic Feature Cards Manager */}
              <div className="sm:col-span-12 border-t border-slate-200 pt-5 space-y-4">
                <h4 className="font-bold text-[#11233F] text-sm">2x2 Feature Grid Cards Settings (Dynamic Checkmarks):</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Card 1 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                    <span className="text-xs font-extrabold text-[#007eff] uppercase tracking-wider block border-b border-slate-100 pb-2">
                      Card 1: Professional Cleaners
                    </span>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#11233F]">Card Header Title:</label>
                      <input
                        type="text"
                        {...register("whyUsCard1Title")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                    <Controller
                      name="whyUsCard1Checks"
                      control={control}
                      render={({ field }) => (
                        <ChecklistArrayEditor
                          label="Checkmark Feature Items"
                          items={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                    <span className="text-xs font-extrabold text-[#007eff] uppercase tracking-wider block border-b border-slate-100 pb-2">
                      Card 2: Eco-Friendly Solutions
                    </span>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#11233F]">Card Header Title:</label>
                      <input
                        type="text"
                        {...register("whyUsCard2Title")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                    <Controller
                      name="whyUsCard2Checks"
                      control={control}
                      render={({ field }) => (
                        <ChecklistArrayEditor
                          label="Checkmark Feature Items"
                          items={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                    <span className="text-xs font-extrabold text-[#007eff] uppercase tracking-wider block border-b border-slate-100 pb-2">
                      Card 3: Flexible Subscriptions
                    </span>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#11233F]">Card Header Title:</label>
                      <input
                        type="text"
                        {...register("whyUsCard3Title")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                    <Controller
                      name="whyUsCard3Checks"
                      control={control}
                      render={({ field }) => (
                        <ChecklistArrayEditor
                          label="Checkmark Feature Items"
                          items={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                    <span className="text-xs font-extrabold text-[#007eff] uppercase tracking-wider block border-b border-slate-100 pb-2">
                      Card 4: Dedicated Support
                    </span>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#11233F]">Card Header Title:</label>
                      <input
                        type="text"
                        {...register("whyUsCard4Title")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                    <Controller
                      name="whyUsCard4Checks"
                      control={control}
                      render={({ field }) => (
                        <ChecklistArrayEditor
                          label="Checkmark Feature Items"
                          items={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. CORE SERVICES SECTION */}
        {currentSection === "services" && (
          <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200/80 pb-4">
              <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-[#007eff]" /> 4. Core Services Section Header Settings
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage section pill badge, headline, and highlight word on the home page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              <div className="space-y-1.5 sm:col-span-12">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Services Section Pill Badge (e.g. OUR CORE SERVICES):
                </label>
                <input
                  type="text"
                  {...register("servicesBadge")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-4">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Headline Line 1 (e.g. PROFESSIONAL):
                </label>
                <input
                  type="text"
                  {...register("servicesTitleLine1")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-4">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Highlight Word (e.g. CLEANING):
                </label>
                <input
                  type="text"
                  {...register("servicesTitleHighlight")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-4">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Headline Line 2 (e.g. SERVICES FOR EVERY SPACE):
                </label>
                <input
                  type="text"
                  {...register("servicesTitleLine2")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="sm:col-span-12">
                <Controller
                  name="servicesSubtitle"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      label="Header Right Subtitle Description (Supports Bengali & HTML Formatting):"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
                      placeholder="Enter subtitle description..."
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. FAQ SECTION */}
        {currentSection === "faq" && (
          <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200/80 pb-4">
              <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-[#007eff]" /> 5. FAQ Section Settings
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage FAQ section pill badge, main title, right feature photo, and dynamic FAQ questions list.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  FAQ Pill Badge (e.g. FAQ &amp; HELP):
                </label>
                <input
                  type="text"
                  {...register("faqBadge")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Main FAQ Title:
                </label>
                <input
                  type="text"
                  {...register("faqTitle")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="sm:col-span-12">
                <Controller
                  name="faqImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadPreview
                      label="FAQ Right Column Feature Photo:"
                      value={field.value}
                      onChange={field.onChange}
                      recommendedSize="Recommended: 708x450px (PNG, JPG)"
                      aspectRatio="banner"
                    />
                  )}
                />
              </div>

              {/* Dynamic FAQ List with useFieldArray */}
              <div className="sm:col-span-12 pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-bold text-[#11233F] text-sm">Interactive FAQ Accordion Questions List</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Add new FAQs, edit questions &amp; answers, or delete items live.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-[#007eff] hover:bg-blue-600 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New FAQ</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {faqFields.map((fieldItem, idx) => (
                    <div key={fieldItem.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-black text-[#007eff]">
                          FAQ #{String(idx + 1).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDeleteFaqIdx(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#11233F]">FAQ Question Text:</label>
                          <textarea
                            rows={3}
                            {...register(`faqItems.${idx}.question` as const)}
                            placeholder="Enter FAQ question in Bangla or English..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff] min-h-[80px]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#11233F]">FAQ Answer Text:</label>
                          <textarea
                            rows={3}
                            {...register(`faqItems.${idx}.answer` as const)}
                            placeholder="Enter detailed answer..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium text-xs focus:outline-none focus:border-[#007eff] min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {faqFields.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No FAQ items added yet. Click &quot;Add New FAQ&quot; to add one.</p>
                  )}
                </div>

                <DeleteCardConfirmModal
                  isOpen={deleteFaqIdx !== null}
                  onClose={() => setDeleteFaqIdx(null)}
                  onConfirm={handleConfirmDeleteFaq}
                  cardTitle={
                    deleteFaqIdx !== null && currentFaqItems[deleteFaqIdx]
                      ? `FAQ #${String(deleteFaqIdx + 1).padStart(2, "0")} (${currentFaqItems[deleteFaqIdx].question || "Untitled Question"})`
                      : "this FAQ item"
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. CTA BANNER SECTION */}
        {currentSection === "cta" && (
          <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200/80 pb-4">
              <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-[#007eff]" /> 6. CTA Banner Section Settings
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage full-width blue CTA banner pill badge, main title, subtitle description, and action button.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              <div className="space-y-1.5 sm:col-span-12">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  CTA Pill Badge (e.g. GET IN TOUCH TODAY):
                </label>
                <input
                  type="text"
                  {...register("ctaBadge")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-12">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Main Headline Title (e.g. READY FOR A SPOTLESS &amp; HEALTHY SPACE?):
                </label>
                <input
                  type="text"
                  {...register("ctaTitle")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="sm:col-span-12">
                <Controller
                  name="ctaSubtitle"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      label="Subtitle Description (Supports Bengali &amp; HTML Formatting):"
                      value={field.value}
                      onChange={field.onChange}
                      rows={3}
                      placeholder="Enter CTA banner description..."
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Action Button Text (e.g. Book Service Now):
                </label>
                <input
                  type="text"
                  {...register("ctaBtnText")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-6">
                <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                  Action Button Link Href (e.g. /contact):
                </label>
                <input
                  type="text"
                  {...register("ctaBtnHref")}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SAVE BUTTON */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl font-bold text-sm bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Home CMS Live</span>
          </button>
        </div>
      </form>
    </div>
  );
}
