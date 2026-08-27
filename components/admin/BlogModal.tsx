"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  FileText,
  CheckCircle2,
  Plus,
  Trash2,
  Image as ImageIcon,
  User,
  Calendar,
  Tag,
  Layers,
  Sparkles,
  AlignLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { BlogDetail } from "@/lib/blogsData";
import { createBlogAPI, updateBlogAPI } from "@/services/blogService";
import { getAuthUser } from "@/utils/cookie";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogData?: BlogDetail | null;
  onSave: (savedBlog: BlogDetail) => void;
}

export default function BlogModal({
  isOpen,
  onClose,
  blogData,
  onSave,
}: BlogModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("HOME HYGIENE");
  const [date, setDate] = useState("");
  const [authorName, setAuthorName] = useState("Cleanix Editorial Team");
  const [authorAvatar, setAuthorAvatar] = useState(
    "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=342&height=292"
  );
  const [image, setImage] = useState("");
  const [introParagraph, setIntroParagraph] = useState("");
  const [sections, setSections] = useState<
    { title: string; paragraphs: string[] }[]
  >([
    {
      title: "Section Heading 1",
      paragraphs: ["Write detail content paragraph here..."],
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (blogData) {
      setTitle(blogData.title || "");
      setSlug(blogData.slug || "");
      setCategory(blogData.category || "HOME HYGIENE");
      setDate(blogData.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase());
      setAuthorName(blogData.author?.name || "Cleanix Editorial Team");
      setAuthorAvatar(blogData.author?.avatar || "");
      setImage(blogData.image || "");
      setIntroParagraph(blogData.introParagraph || "");
      setSections(blogData.sections && blogData.sections.length > 0 ? blogData.sections : [
        {
          title: "Section Heading 1",
          paragraphs: ["Write detail content paragraph here..."],
        },
      ]);
    } else {
      // Defaults for Add New Blog - fetch current logged in user
      const authUser = getAuthUser();
      const loggedInName =
        authUser?.name ||
        (authUser?.firstName
          ? `${authUser.firstName} ${authUser.lastName || ""}`.trim()
          : null) ||
        authUser?.email ||
        "Cleanix Editorial Team";
      const loggedInAvatar =
        authUser?.avatar ||
        authUser?.profile?.avatar ||
        authUser?.image ||
        authUser?.profileImg ||
        "";

      const defaultDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
      setTitle("");
      setSlug("");
      setCategory("HOME HYGIENE");
      setDate(defaultDate);
      setAuthorName(loggedInName);
      setAuthorAvatar(loggedInAvatar);
      setImage("https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80");
      setIntroParagraph("");
      setSections([
        {
          title: "Cleaner Air and Easier Breathing (সুস্বাস্থ্য ও নিরাপত্তা)",
          paragraphs: [
            "ঘরের পরিবেশ ঝকঝকে ও জীবাণুমুক্ত রাখতে নিয়মিত ডিপ ক্লিনিং গুরুত্বপূর্ণ ভূমিকা পালন করে।",
          ],
        },
      ]);
    }
  }, [blogData, isOpen]);

  const makeSlug = (text: string) => {
    if (!text) return `blog-post-${Date.now()}`;
    const cleaned = text
      .toLowerCase()
      .trim()
      .replace(/[?,!@#$%^&*()=+|\\[\]/;:."'`~—–<>]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");
    return cleaned || `blog-post-${Date.now()}`;
  };

  // Auto-generate slug when title changes for new post
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!blogData) {
      setSlug(makeSlug(val));
    }
  };

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      { title: `New Section ${prev.length + 1}`, paragraphs: [""] },
    ]);
  };

  const handleRemoveSection = (secIdx: number) => {
    setSections((prev) => prev.filter((_, idx) => idx !== secIdx));
  };

  const handleSectionTitleChange = (secIdx: number, val: string) => {
    setSections((prev) => {
      const next = [...prev];
      next[secIdx] = { ...next[secIdx], title: val };
      return next;
    });
  };

  const handleAddParagraph = (secIdx: number) => {
    setSections((prev) => {
      const next = [...prev];
      next[secIdx] = {
        ...next[secIdx],
        paragraphs: [...next[secIdx].paragraphs, ""],
      };
      return next;
    });
  };

  const handleRemoveParagraph = (secIdx: number, pIdx: number) => {
    setSections((prev) => {
      const next = [...prev];
      next[secIdx] = {
        ...next[secIdx],
        paragraphs: next[secIdx].paragraphs.filter((_, idx) => idx !== pIdx),
      };
      return next;
    });
  };

  const handleParagraphChange = (secIdx: number, pIdx: number, val: string) => {
    setSections((prev) => {
      const next = [...prev];
      const updatedP = [...next[secIdx].paragraphs];
      updatedP[pIdx] = val;
      next[secIdx] = { ...next[secIdx], paragraphs: updatedP };
      return next;
    });
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const finalSlug = slug.trim() ? makeSlug(slug) : makeSlug(title);

    const authUser = getAuthUser();
    const loggedInName =
      authUser?.name ||
      (authUser?.firstName
        ? `${authUser.firstName} ${authUser.lastName || ""}`.trim()
        : null) ||
      authUser?.email ||
      "Cleanix Editorial Team";
    const loggedInAvatar =
      authUser?.avatar ||
      authUser?.profile?.avatar ||
      authUser?.image ||
      authUser?.profileImg ||
      "";

    const savedBlog: BlogDetail = {
      slug: finalSlug,
      title: title.trim(),
      category: category.trim().toUpperCase(),
      date: date.trim() || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
      author: {
        name: authorName.trim() || loggedInName,
        avatar: authorAvatar.trim() || loggedInAvatar,
      },
      image: image.trim(),
      introParagraph: introParagraph.trim(),
      sections: sections.map((s) => ({
        title: s.title.trim(),
        paragraphs: s.paragraphs.filter((p) => p.trim().length > 0),
      })),
    };

    try {
      if (blogData) {
        const res = await updateBlogAPI(blogData.slug, savedBlog);
        if (res && res.success) {
          toast.success("Blog article updated live on MongoDB database!");
          onSave(res.data || savedBlog);
          onClose();
        } else {
          toast.error(res?.message || "Failed to update blog article");
        }
      } else {
        const res = await createBlogAPI(savedBlog);
        if (res && res.success) {
          toast.success("Blog article published live on MongoDB database!");
          onSave(res.data || savedBlog);
          onClose();
        } else {
          toast.error(res?.message || "Failed to publish blog article");
        }
      }
    } catch (err: any) {
      console.error("Error saving blog post:", err);
      toast.error("Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6 scroll-smooth text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 stroke-[2.5]" />
              </div>
              {blogData ? "Edit Blog Article" : "Create New Blog Article"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Add or update blog post details, featured images, and article content sections.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
          {/* Grid 1: Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <Tag className="w-4 h-4 text-[#007eff]" /> Blog Article Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. How Regular Cleaning Improves Comfort"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-bold text-sm focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <AlignLeft className="w-4 h-4 text-[#007eff]" /> URL Slug (Unique Key):
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. how-regular-cleaning-improves-comfort"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-bold text-sm focus:outline-none focus:border-[#007eff] focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Grid 2: Category, Date, Author */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-5">
            <div className="space-y-2">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#007eff]" /> Category Tag:
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. HOME HYGIENE, OFFICE WELLNESS"
                required
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-2">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#007eff]" /> Published Date:
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. MAY 2, 2025"
                required
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-2">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#007eff]" /> Author Name:
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Cleanix Editorial Team"
                required
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#007eff]"
              />
            </div>
          </div>

          {/* Grid 3: Featured Banner Image & Author Avatar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ImageUploadPreview
                label="Hero Featured Image:"
                value={image}
                onChange={(val) => setImage(val)}
                recommendedSize="Recommended 1200x630 JPG/WebP format"
                aspectRatio="banner"
              />
            </div>

            <div>
              <ImageUploadPreview
                label="Author Avatar Image:"
                value={authorAvatar}
                onChange={(val) => setAuthorAvatar(val)}
                recommendedSize="Optional JPG/PNG (leave blank for initial badge)"
                aspectRatio="square"
              />
            </div>
          </div>

          {/* Intro Paragraph */}
          <div className="w-full">
            <RichTextEditor
              label="Article Intro Paragraph:"
              value={introParagraph}
              onChange={(val) => setIntroParagraph(val)}
              rows={3}
              placeholder="Enter lead paragraph opening the article..."
            />
          </div>

          {/* Dynamic Article Sections (Headings + Paragraphs) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#007eff]" /> Dynamic Content Sections ({sections.length}):
              </label>
              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 bg-[#007eff] hover:bg-blue-600 text-white rounded-2xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Article Section
              </button>
            </div>

            <div className="space-y-6">
              {sections.map((sec, secIdx) => (
                <div
                  key={secIdx}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4 relative"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-black uppercase text-[#007eff] tracking-wider block">
                        Section #{secIdx + 1} Heading:
                      </span>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) =>
                          handleSectionTitleChange(secIdx, e.target.value)
                        }
                        placeholder="e.g. Cleaner Air and Easier Breathing"
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-[#007eff]"
                      />
                    </div>

                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(secIdx)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-xl cursor-pointer transition-colors"
                        title="Remove section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Section Paragraphs */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Paragraphs in Section #{secIdx + 1}:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddParagraph(secIdx)}
                        className="text-xs font-extrabold text-[#007eff] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Paragraph
                      </button>
                    </div>

                    {sec.paragraphs.map((pText, pIdx) => (
                      <div key={pIdx} className="bg-white border border-slate-200 rounded-2xl p-3 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-slate-600">Paragraph #{pIdx + 1}:</span>
                          {sec.paragraphs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveParagraph(secIdx, pIdx)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                              title="Remove paragraph"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <RichTextEditor
                          label=""
                          value={pText}
                          onChange={(val) =>
                            handleParagraphChange(secIdx, pIdx, val)
                          }
                          rows={2}
                          placeholder={`Enter paragraph #${pIdx + 1} content with formatting...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-[#007eff] hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>
                {isSaving
                  ? "Saving..."
                  : blogData
                  ? "Update Blog Post"
                  : "Publish Blog Post"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
