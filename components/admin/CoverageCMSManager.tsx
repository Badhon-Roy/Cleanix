"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Save, ExternalLink, Sparkles, Navigation, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import {
  getStoredCoverageCMSData,
  saveCoverageCMSData,
  CoverageCMSContent,
} from "@/lib/coverageCMSData";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function CoverageCMSManager() {
  const { register, handleSubmit, reset, control } = useForm<CoverageCMSContent>({
    defaultValues: getStoredCoverageCMSData(),
  });

  useEffect(() => {
    reset(getStoredCoverageCMSData());
  }, [reset]);

  const onSubmit = (data: CoverageCMSContent) => {
    saveCoverageCMSData(data);
    toast.success("Coverage Page CMS updated live!");
  };

  return (
    <div className="space-y-8 w-full">
      {/* Action Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#11233F] flex items-center gap-2.5">
            <Navigation className="w-5 h-5 text-[#007eff]" /> Coverage Page Dynamic CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage public Coverage page (`/coverage`) hero banner, headlines, and coverage map section.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin/coverage"
            className="px-4 py-2 rounded-2xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-all flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>Manage Dhaka Areas</span>
          </Link>

          <Link
            href="/coverage"
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
        {/* SECTION 1: COVERAGE HERO BANNER SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#007eff]" /> 1. Coverage Hero Banner Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Main hero title, pill badge, highlight word, description, and cover background image on `/coverage`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Hero Pill Badge (e.g. 24/7 ACTIVE GPS FLEET COVERAGE):
              </label>
              <input
                type="text"
                {...register("heroBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-4">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. DHAKA CITY):
              </label>
              <input
                type="text"
                {...register("heroTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-4">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word (e.g. COVERAGE AREA):
              </label>
              <input
                type="text"
                {...register("heroTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-4">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 2 (e.g. MAP):
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
                    placeholder="Enter coverage hero subtitle..."
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: COVERAGE GRID SECTION SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#007eff]" /> 2. Coverage Grid Section Headlines &amp; Subtitle
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage section pill badge, main headline, highlight word, and subtitle paragraph.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Section Pill Badge (e.g. COVERAGE AREA MAP):
              </label>
              <input
                type="text"
                {...register("sectionBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. PROUDLY SERVING ALL MAJOR):
              </label>
              <input
                type="text"
                {...register("sectionTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word (e.g. NEIGHBORHOODS):
              </label>
              <input
                type="text"
                {...register("sectionTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 2 (e.g. IN DHAKA):
              </label>
              <input
                type="text"
                {...register("sectionTitleLine2")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="sectionSubtitle"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    label="Section Subtitle Paragraph (Supports HTML & Formatting):"
                    value={field.value}
                    onChange={field.onChange}
                    rows={2}
                    placeholder="Enter coverage section subtitle..."
                  />
                )}
              />
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
            <span>Save Coverage CMS Live</span>
          </button>
        </div>
      </form>
    </div>
  );
}
