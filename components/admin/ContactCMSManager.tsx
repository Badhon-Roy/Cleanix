"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Save, Loader2, ExternalLink, Sparkles, PhoneCall, Mail, MapPin, Headphones, Clock } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import {
  defaultContactCMSData,
  ContactCMSContent,
} from "@/lib/contactCMSData";
import { fetchContactCMSAPI, updateContactCMSAPI } from "@/services/cmsService";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function ContactCMSManager() {
  const { register, handleSubmit, reset, control } = useForm<ContactCMSContent>({
    defaultValues: defaultContactCMSData,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContactCMSAPI().then((res) => {
      if (res && res.success && res.data) {
        reset({ ...defaultContactCMSData, ...res.data });
      }
    });
  }, [reset]);

  const onSubmit = async (data: ContactCMSContent) => {
    setIsSaving(true);
    try {
      const res = await updateContactCMSAPI(data);
      if (res && res.success) {
        toast.success("Contact Page CMS updated live on MongoDB database!");
      } else {
        toast.error(res?.message || "Failed to update Contact CMS");
      }
    } catch (err: any) {
      console.error("Error updating Contact CMS:", err);
      toast.error("Failed to update Contact CMS");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Action Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#11233F] flex items-center gap-2.5">
            <PhoneCall className="w-5 h-5 text-[#007eff]" /> Contact Page Dynamic CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage public Contact page (`/contact`) hero banner, inquiry form section, and bottom info cards.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin/messages"
            className="px-4 py-2 rounded-2xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-all flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4" />
            <span>Manage Customer Inquiries</span>
          </Link>

          <Link
            href="/contact"
            target="_blank"
            className="px-4 py-2 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Public View</span>
          </Link>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSubmit(onSubmit)}
            className="px-5 py-2 rounded-2xl font-bold text-xs bg-[#007eff] hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all cursor-pointer flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Saving..." : "Save All Live"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECTION 1: CONTACT HERO BANNER SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#007eff]" /> 1. Contact Hero Banner Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Main hero title, pill badge, highlight word, description, and cover background image on `/contact`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Hero Pill Badge (e.g. 24/7 CUSTOMER SUPPORT &amp; QUOTE REQUEST):
              </label>
              <input
                type="text"
                {...register("heroBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. GET IN TOUCH WITH):
              </label>
              <input
                type="text"
                {...register("heroTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word (e.g. OUR TEAM):
              </label>
              <input
                type="text"
                {...register("heroTitleHighlight")}
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
                    rows={3}
                    placeholder="Enter contact hero subtitle..."
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT FORM & FEATURE IMAGE SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#007eff]" /> 2. Contact Form &amp; Feature Image Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage form pill badge, headline, and left cleaner feature image.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Form Section Pill Badge (e.g. CONTACT REQUEST):
              </label>
              <input
                type="text"
                {...register("formBadge")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 1 (e.g. READY TO SHIP):
              </label>
              <input
                type="text"
                {...register("formTitleLine1")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 2 (e.g. SMARTER):
              </label>
              <input
                type="text"
                {...register("formTitleLine2")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Highlight Word (e.g. CONTACT):
              </label>
              <input
                type="text"
                {...register("formTitleHighlight")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-bold text-[#11233F] text-xs sm:text-sm">
                Headline Line 3 (e.g. OUR TEAM):
              </label>
              <input
                type="text"
                {...register("formTitleLine3")}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#11233F] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <Controller
                name="formCleanerImage"
                control={control}
                render={({ field }) => (
                  <ImageUploadPreview
                    label="Contact Form Left Side Cleaner Feature Image:"
                    value={field.value}
                    onChange={field.onChange}
                    recommendedSize="Recommended: 600x640px (Transparent PNG)"
                    aspectRatio="portrait"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BOTTOM 3 INFO CARDS SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-[#11233F] flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#007eff]" /> 3. Bottom 3 Info Cards Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage physical office address location, client phone hotline numbers, and operating working hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Card 1: Location */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <MapPin className="w-4 h-4 text-[#007eff]" />
                <h4 className="font-bold text-[#11233F] text-sm">Card 1: Office Address Location</h4>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Card Header Title:</label>
                <input
                  type="text"
                  {...register("locationTitle")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Address Details (Line breaks supported):</label>
                <textarea
                  rows={3}
                  {...register("locationText")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-medium text-xs focus:outline-none focus:border-[#007eff]"
                />
              </div>
            </div>

            {/* Card 2: Phone Support */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Headphones className="w-4 h-4 text-[#007eff]" />
                <h4 className="font-bold text-[#11233F] text-sm">Card 2: Client Support Hotlines</h4>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Card Header Title:</label>
                <input
                  type="text"
                  {...register("supportTitle")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Numbers (Line breaks supported):</label>
                <textarea
                  rows={3}
                  {...register("supportText")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-medium text-xs focus:outline-none focus:border-[#007eff]"
                />
              </div>
            </div>

            {/* Card 3: Opening Hours */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Clock className="w-4 h-4 text-[#007eff]" />
                <h4 className="font-bold text-[#11233F] text-sm">Card 3: Operating Working Hours</h4>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Card Header Title:</label>
                <input
                  type="text"
                  {...register("hoursTitle")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-bold text-xs focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Days &amp; Hours (Line breaks supported):</label>
                <textarea
                  rows={3}
                  {...register("hoursText")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#11233F] font-medium text-xs focus:outline-none focus:border-[#007eff]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SAVE BUTTON */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl font-bold text-sm bg-[#007eff] hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all cursor-pointer flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isSaving ? "Saving..." : "Save Contact CMS Live"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
