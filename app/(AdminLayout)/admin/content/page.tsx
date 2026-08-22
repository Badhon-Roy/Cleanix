"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  Layout,
  Eye,
  Sliders,
  Type,
  Link as LinkIcon,
  HelpCircle,
  ShieldCheck,
  Star,
  Plus,
  Edit3,
  Trash2,
  Search,
  ExternalLink,
  BookOpen,
  Info,
  Layers,
  FolderCheck,
  BadgePercent,
  Navigation,
  PhoneCall,
  DollarSign,
  Home as HomeIcon,
} from "lucide-react";
import { blogsData, BlogDetail } from "@/lib/blogsData";
import BlogModal from "@/components/admin/BlogModal";
import AboutCMSManager from "@/components/admin/AboutCMSManager";
import ServicesCMSManager from "@/components/admin/ServicesCMSManager";
import ProjectsCMSManager from "@/components/admin/ProjectsCMSManager";
import PricingCMSManager from "@/components/admin/PricingCMSManager";
import CoverageCMSManager from "@/components/admin/CoverageCMSManager";
import ContactCMSManager from "@/components/admin/ContactCMSManager";
import HomeCMSManager from "@/components/admin/HomeCMSManager";

export default function AdminContentCMSPage() {
  const [activeSectionTab, setActiveSectionTab] = useState("homePage");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Blog Posts State
  const [blogsList, setBlogsList] = useState<BlogDetail[]>(
    Object.values(blogsData)
  );
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [selectedBlogForEdit, setSelectedBlogForEdit] = useState<BlogDetail | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);



  const handleSaveBlog = (savedBlog: BlogDetail) => {
    setBlogsList((prev) => {
      const existsIndex = prev.findIndex((b) => b.slug === savedBlog.slug);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = savedBlog;
        return next;
      }
      return [savedBlog, ...prev];
    });

    // Sync with global blogsData Record
    blogsData[savedBlog.slug] = savedBlog;

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleDeleteBlog = (slug: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog article?");
    if (confirmDelete) {
      setBlogsList((prev) => prev.filter((b) => b.slug !== slug));
      delete blogsData[slug];
    }
  };

  const filteredBlogs = blogsList.filter(
    (b) =>
      b.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      b.shortDesc.toLowerCase().includes(blogSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 stroke-[2.5]" />
              </div>
              Dynamic Content & Blog CMS Manager
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ LIVE WEBSITE CMS
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Add or update blog posts & editorial articles, edit text content, headings, lead paragraphs, and CTA button labels dynamically.
          </p>
        </div>

        {activeSectionTab === "blogs" && (
          <button
            type="button"
            onClick={() => {
              setSelectedBlogForEdit(null);
              setIsBlogModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#007eff] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Blog Post</span>
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Modern & Professional Section Selector Tabs (Zero-Scroll Flex Wrap) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 border-b border-slate-200/60 pb-2.5">
            <span className="text-xs font-black uppercase text-[#11233F] tracking-wider flex items-center gap-2">
              <Layout className="w-4 h-4 text-[#007eff]" />
              <span>Select Page / Section CMS Manager</span>
            </span>
            <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              8 Dynamic Page Modules Available
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "homePage", label: "Home Page CMS", icon: HomeIcon },
              { id: "about", label: "About Us Page CMS", icon: Info },
              { id: "servicesPage", label: "Services Page CMS", icon: Layers },
              { id: "projectsPage", label: "Projects Page CMS", icon: FolderCheck },
              { id: "pricingPage", label: "Pricing Page CMS", icon: BadgePercent },
              { id: "coveragePage", label: "Coverage Page CMS", icon: Navigation },
              { id: "contactPage", label: "Contact Page CMS", icon: PhoneCall },
              { id: "blogs", label: "Blog Posts CMS", icon: BookOpen },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeSectionTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSectionTab(tab.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 border ${
                    isActive
                      ? "bg-[#007eff] text-white border-[#007eff] shadow-sm shadow-blue-500/25 scale-[1.02]"
                      : "bg-white text-slate-700 border-slate-200 hover:border-[#007eff]/50 hover:bg-blue-50/50"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#007eff]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-emerald-800 text-xs sm:text-sm font-extrabold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Content changes saved successfully! (Live blog & website preview updated instantly)</span>
          </div>
        )}

        {/* TAB 1: BLOG & EDITORIAL ARTICLES CMS */}
        {activeSectionTab === "blogs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-[#007eff]" /> Published Blog Posts & Articles ({filteredBlogs.length})
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Manage articles published on the public Blog page (`/blog`) and Blog Details page (`/blog/[slug]`).
                </p>
              </div>

              {/* Search Box */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Blog Title, Category..."
                  value={blogSearchQuery}
                  onChange={(e) => setBlogSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.slug}
                  className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Blog Thumbnail Image */}
                    <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        unoptimized
                        className="object-cover object-center"
                      />
                      <span className="absolute top-3 left-3 bg-[#007eff] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                        {blog.category}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#007eff] uppercase tracking-wider block">
                        {blog.date}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 pt-1">
                        {blog.shortDesc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-xs text-slate-600 font-semibold border-t border-slate-100">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
                        <Image
                          src={blog.author.avatar}
                          alt={blog.author.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="truncate">{blog.author.name}</span>
                    </div>
                  </div>

                  {/* Blog Admin Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBlogForEdit(blog);
                        setIsBlogModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] font-extrabold text-xs border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Article</span>
                    </button>

                    <Link
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Preview Live Blog Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlog(blog.slug)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredBlogs.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                  No blog articles found matching &quot;{blogSearchQuery}&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT US PAGE CMS */}
        {activeSectionTab === "about" && <AboutCMSManager />}

        {/* TAB 3: SERVICES PAGE CMS */}
        {activeSectionTab === "servicesPage" && <ServicesCMSManager />}

        {/* TAB 4: PROJECTS PAGE CMS */}
        {activeSectionTab === "projectsPage" && <ProjectsCMSManager />}

        {/* TAB 5: PRICING PAGE CMS */}
        {activeSectionTab === "pricingPage" && <PricingCMSManager />}

        {/* TAB 6: COVERAGE PAGE CMS */}
        {activeSectionTab === "coveragePage" && <CoverageCMSManager />}

        {/* TAB 7: CONTACT PAGE CMS */}
        {activeSectionTab === "contactPage" && <ContactCMSManager />}

        {/* TAB 1: HOME PAGE CMS */}
        {activeSectionTab === "homePage" && <HomeCMSManager activeTab="homePage" />}
      </div>

      {/* Render Portal Blog Modal */}
      {isBlogModalOpen && (
        <BlogModal
          isOpen={isBlogModalOpen}
          onClose={() => {
            setIsBlogModalOpen(false);
            setSelectedBlogForEdit(null);
          }}
          blogData={selectedBlogForEdit}
          onSave={handleSaveBlog}
        />
      )}
    </div>
  );
}
