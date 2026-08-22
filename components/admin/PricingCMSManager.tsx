"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Save, ExternalLink, Sparkles, BadgePercent, Tag, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import {
  getStoredPricingCMSData,
  savePricingCMSData,
  PricingCMSContent,
} from "@/lib/pricingCMSData";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function PricingCMSManager() {
  const { register, handleSubmit, reset, control } = useForm<PricingCMSContent>({
    defaultValues: getStoredPricingCMSData(),
  });

  useEffect(() => {
    reset(getStoredPricingCMSData());
  }, [reset]);

  const onSubmit = (data: PricingCMSContent) => {
    savePricingCMSData(data);
    toast.success("Pricing Page CMS updated live!");
  };

  return (
    <div className="space-y-8 w-full">
      {/* Action Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#11233F] flex items-center gap-2.5">
            <BadgePercent className="w-5 h-5 text-[#007eff]" /> Pricing Page Dynamic CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage public Pricing page (`/pricing`) hero banner, section headlines, and assets.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin/pricing"
            className="px-4 py-2 rounded-2xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-all flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>Manage Pricing Packages</span>
          </Link>

          <Link
            href="/pricing"
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
        {/* SECTION 1: PRICING HERO BANNER SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#007eff]" /> 1. Pricing Hero Banner Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Main hero title, pill badge, highlight word, description, and cover background image on `/pricing`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Hero Pill Badge (e.g. TRANSPARENT SAAS PRICING &amp; ESTIMATE):
              </label>
              <input
                type="text"
                {...register("heroBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-4">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. AFFORDABLE &amp; FLEXIBLE):
              </label>
              <input
                type="text"
                {...register("heroTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-4">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word (e.g. PRICING):
              </label>
              <input
                type="text"
                {...register("heroTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-4">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 2 (e.g. PLANS):
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
                    placeholder="Enter pricing hero subtitle..."
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PRICING SECTION HEADLINE & ASSETS SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Tag className="w-5 h-5 text-[#007eff]" /> 2. Pricing Section Headlines &amp; Asset Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage section pill badge, headline, and cleaning bucket asset image on the pricing page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Section Pill Badge (e.g. PRICING):
              </label>
              <input
                type="text"
                {...register("sectionBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Main Headline Title:
              </label>
              <input
                type="text"
                {...register("sectionTitle")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="sectionAssetImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Pricing Section Bucket Asset Image:"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="Recommended: 320x300px (Transparent PNG)"
                    aspectRatio="square"
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
            <span>Save Pricing CMS Live</span>
          </button>
        </div>
      </form>
    </div>
  );
}
