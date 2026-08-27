"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  Image as ImageIcon,
  Video,
  Sparkles,
  Upload,
  Layers,
  Plus,
} from "lucide-react";
import {
  GalleryItem,
  createGalleryAPI,
  createBulkGalleryAPI,
  updateGalleryAPI,
} from "@/services/galleryService";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

import { compressImageToWebP } from "@/utils/imageCompressor";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: GalleryItem | null;
}

export default function GalleryModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: "",
    type: "IMAGE",
    url: "",
    thumbnail: "",
    status: "ACTIVE",
  });

  // Batch Multi-Upload State
  const [batchTitle, setBatchTitle] = useState("");
  const [batchItems, setBatchItems] = useState<{ title: string; url: string }[]>([]);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setIsBatchMode(false);
      setFormData({
        title: initialData.title || "",
        type: initialData.type || "IMAGE",
        url: initialData.url || "",
        thumbnail: initialData.thumbnail || "",
        status: initialData.status || "ACTIVE",
      });
    } else {
      setIsBatchMode(false);
      setFormData({
        title: "",
        type: "IMAGE",
        url: "",
        thumbnail: "",
        status: "ACTIVE",
      });
      setBatchTitle("");
      setBatchItems([]);
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleBatchFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newItems: { title: string; url: string }[] = [];

    for (const file of fileList) {
      if (file.size > 20 * 1024 * 1024) continue;
      const compressed = await compressImageToWebP(file, 900, 900, 0.72);
      if (compressed) {
        const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        newItems.push({
          title: cleanName,
          url: compressed,
        });
      }
    }

    if (newItems.length > 0) {
      setBatchItems((prev) => [...prev, ...newItems]);
    }
  };

  const handleRemoveBatchItem = (index: number) => {
    setBatchItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBatchMode) {
      if (batchItems.length === 0) {
        setError("Please select at least one photo to upload!");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const payloadArray = batchItems.map((item, idx) => ({
          title: batchTitle.trim()
            ? `${batchTitle.trim()} #${idx + 1}`
            : item.title || `Showcase Photo #${idx + 1}`,
          type: "IMAGE" as const,
          url: item.url,
          status: (formData.status || "ACTIVE") as any,
        }));

        await createBulkGalleryAPI(payloadArray);
        onSuccess();
        onClose();
      } catch (err: any) {
        setError(err?.message || "Failed to batch upload photos.");
      } finally {
        setLoading(false);
      }

      return;
    }

    // Single item submit
    if (!formData.title || !formData.url) {
      setError("Please fill in title and photo/video URL!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (initialData && initialData._id) {
        await updateGalleryAPI(initialData._id, formData);
      } else {
        await createGalleryAPI(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save gallery item.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[88vh] overflow-y-auto scroll-smooth text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {initialData
                  ? "Edit Gallery Item"
                  : isBatchMode
                  ? "Batch Multi-Photo Upload"
                  : "Add New Gallery Showcase"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isBatchMode
                  ? "Select multiple photos at once from your device"
                  : "Showcase cleaning photos & video clips"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs (Only when creating new item) */}
        {!initialData && (
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => setIsBatchMode(false)}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                !isBatchMode
                  ? "bg-white text-[#007eff] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Single Item Upload
            </button>
            <button
              type="button"
              onClick={() => setIsBatchMode(true)}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isBatchMode
                  ? "bg-[#007eff] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Batch Multi-Photo Upload</span>
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs sm:text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* BATCH MULTI-UPLOAD MODE */}
          {isBatchMode ? (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1.5">
                  Base Title / Prefix (Optional)
                </label>
                <input
                  type="text"
                  value={batchTitle}
                  onChange={(e) => setBatchTitle(e.target.value)}
                  placeholder="e.g. Gulshan Apartment Deep Reset (Auto-numbers #1, #2...)"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#007eff] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold text-slate-800 transition-all"
                />
              </div>

              {/* Multi-file Picker Box */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1.5">
                  Select Multiple Photo Files *
                </label>
                <input
                  ref={batchFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBatchFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => batchFileInputRef.current?.click()}
                  className="w-full p-5 border-2 border-dashed border-slate-300 hover:border-[#007eff] bg-slate-50 hover:bg-blue-50/50 rounded-2xl transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <Upload className="w-7 h-7 text-[#007eff] mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-extrabold text-slate-800 group-hover:text-[#007eff]">
                    Click to Select Multiple Photos
                  </span>
                  <span className="text-xs text-slate-500 font-medium mt-0.5">
                    Hold Ctrl / Shift to pick 5, 10 or more images at once
                  </span>
                </button>
              </div>

              {/* Batch Images Selected Grid */}
              {batchItems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700">
                      Selected Photos ({batchItems.length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => setBatchItems([])}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    {batchItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group"
                      >
                        <Image
                          src={item.url}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBatchItem(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity cursor-pointer z-10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded truncate">
                          {batchTitle ? `${batchTitle} #${idx + 1}` : item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* SINGLE UPLOAD MODE */
            <>
              {/* Item Title */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1.5">
                  Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Gulshan Apartment Deep Reset"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#007eff] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold text-slate-800 transition-all"
                />
              </div>

              {/* Media Type */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1.5">
                  Media Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "IMAGE" })}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.type === "IMAGE"
                        ? "bg-[#007eff] text-white border-[#007eff] shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "VIDEO" })}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.type === "VIDEO"
                        ? "bg-[#007eff] text-white border-[#007eff] shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </button>
                </div>
              </div>

              {/* Media Uploader / URL Field */}
              {formData.type === "IMAGE" ? (
                <ImageUploadPreview
                  label="Photo Image (Choose Single/Multiple Files or Paste URL) *"
                  value={formData.url || ""}
                  onChange={(newUrl) => setFormData({ ...formData, url: newUrl })}
                  onMultipleChange={(newUrls) => {
                    const newItems = newUrls.map((url, idx) => ({
                      title: `Showcase Photo #${idx + 1}`,
                      url,
                    }));
                    setBatchItems(newItems);
                    setIsBatchMode(true);
                  }}
                  multiple={!initialData}
                  recommendedSize={
                    !initialData
                      ? "Select 1 or multiple photos from file browser"
                      : "Recommended 1200x800 JPG/PNG/WebP format"
                  }
                  aspectRatio="banner"
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1.5">
                      Video Embed / MP4 Link *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://www.youtube.com/embed/... or MP4 link"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#007eff] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <ImageUploadPreview
                    label="Video Cover Thumbnail (Optional File or URL)"
                    value={formData.thumbnail || ""}
                    onChange={(newUrl) => setFormData({ ...formData, thumbnail: newUrl })}
                    recommendedSize="Optional JPG/PNG thumbnail image"
                    aspectRatio="banner"
                  />
                </div>
              )}
            </>
          )}

          {/* Status */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="block text-sm font-bold text-slate-800">
                Showcase Status
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Make visible on website gallery
              </span>
            </div>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-xs bg-white text-slate-800"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl font-bold text-xs bg-[#007eff] hover:bg-blue-600 text-white shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>
                {loading
                  ? "Processing Upload..."
                  : isBatchMode
                  ? `Upload ${batchItems.length} Photos Now`
                  : initialData
                  ? "Save Changes"
                  : "Create Showcase"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
