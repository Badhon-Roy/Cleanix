"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, ImageIcon, Link as LinkIcon } from "lucide-react";

import { compressImageToWebP } from "@/utils/imageCompressor";

interface ImageUploadPreviewProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  onMultipleChange?: (newValues: string[]) => void;
  recommendedSize?: string;
  aspectRatio?: "banner" | "square" | "portrait";
  multiple?: boolean;
}

export default function ImageUploadPreview({
  label,
  value,
  onChange,
  onMultipleChange,
  recommendedSize = "Recommended JPG/PNG/WebP format",
  aspectRatio = "banner",
  multiple = false,
}: ImageUploadPreviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 1 && onMultipleChange) {
      const results: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 20 * 1024 * 1024) continue;
        const compressed = await compressImageToWebP(file, 900, 900, 0.72);
        if (compressed) results.push(compressed);
      }
      if (results.length > 0) {
        onMultipleChange(results);
      }
      return;
    }

    const file = files[0];
    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds 20MB limit. Please choose a smaller image.");
      return;
    }

    const compressed = await compressImageToWebP(file, 900, 900, 0.72);
    if (compressed) {
      onChange(compressed);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAspectClass = () => {
    if (aspectRatio === "square") return "w-24 h-24 sm:w-28 sm:h-28";
    if (aspectRatio === "portrait") return "w-24 h-32 sm:w-28 sm:h-36";
    return "w-36 h-24 sm:w-44 sm:h-28"; // banner preview
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <label className="font-bold text-[#11233F] text-xs sm:text-sm">
          {label}
        </label>
        {recommendedSize && (
          <span className="text-[11px] font-semibold text-slate-400">
            {recommendedSize}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4">
        {/* PREVIEW CONTAINER (Aligned Flush Left) */}
        <div className="flex-shrink-0 flex items-center justify-start">
          {value ? (
            <div
              className={`relative ${getAspectClass()} rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group`}
            >
              <Image
                src={value}
                alt="Uploaded Preview"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 transition-transform hover:scale-105 cursor-pointer shadow-md"
                  title="Change Image"
                >
                  <Upload className="w-4 h-4 text-[#007eff]" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-red-600 transition-transform hover:scale-105 cursor-pointer shadow-md"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`${getAspectClass()} rounded-xl border-2 border-dashed border-slate-300 hover:border-[#007eff] bg-slate-50 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer group`}
            >
              <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-[#007eff] transition-colors mb-1" />
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#007eff] transition-colors">
                Click to Upload
              </span>
            </div>
          )}
        </div>

        {/* INPUT & ACTION BUTTONS */}
        <div className="flex-1 min-w-0 w-full space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Image File</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <LinkIcon className="w-3 h-3" /> Or paste Image URL directly:
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.png or data:image/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#007eff]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
