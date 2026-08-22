"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Info, Save, ExternalLink, Sparkles, Layers } from "lucide-react";
import { toast } from "sonner";
import {
  getStoredServicesCMSData,
  saveServicesCMSData,
  ServicesCMSContent,
} from "@/lib/servicesCMSData";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function ServicesCMSManager() {
  const [formData, setFormData] = useState<ServicesCMSContent>(() =>
    getStoredServicesCMSData()
  );

  useEffect(() => {
    setFormData(getStoredServicesCMSData());
  }, []);

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveServicesCMSData(formData);
    toast.success("Services Page Hero Banner updated live!");
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
            Manage public Services page (`/services`) hero banner, headlines, and cover background image.
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
            onClick={() => handleSaveAll()}
            className="px-5 py-2 rounded-2xl font-bold text-xs bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Live</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
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
                value={formData.heroBadge}
                onChange={(e) =>
                  setFormData({ ...formData, heroBadge: e.target.value })
                }
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
                value={formData.heroTitleLine1}
                onChange={(e) =>
                  setFormData({ ...formData, heroTitleLine1: e.target.value })
                }
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
                value={formData.heroTitleHighlight1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heroTitleHighlight1: e.target.value,
                  })
                }
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
                value={formData.heroTitleMiddle}
                onChange={(e) =>
                  setFormData({ ...formData, heroTitleMiddle: e.target.value })
                }
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
                value={formData.heroTitleHighlight2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heroTitleHighlight2: e.target.value,
                  })
                }
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <ImageUploadPreview
                label="Hero Cover Background Image:"
                value={formData.heroImage}
                onChange={(newUrl) =>
                  setFormData({ ...formData, heroImage: newUrl })
                }
                recommendedSize="Recommended: 1920x800px (JPG, PNG or WebP)"
                aspectRatio="banner"
              />
            </div>

            <div className="sm:col-span-12">
              <RichTextEditor
                label="Subtitle Description Paragraph (Supports HTML & Formatting):"
                value={formData.heroSubtitle}
                onChange={(newValue) =>
                  setFormData({ ...formData, heroSubtitle: newValue })
                }
                rows={4}
                placeholder="Enter services hero subtitle..."
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
            <span>Save Services CMS Live</span>
          </button>
        </div>
      </form>
    </div>
  );
}
