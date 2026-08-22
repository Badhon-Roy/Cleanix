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
} from "lucide-react";
import { blogsData, BlogDetail } from "@/lib/blogsData";
import BlogModal from "@/components/admin/BlogModal";
import AboutCMSManager from "@/components/admin/AboutCMSManager";
import ServicesCMSManager from "@/components/admin/ServicesCMSManager";
import ProjectsCMSManager from "@/components/admin/ProjectsCMSManager";
import PricingCMSManager from "@/components/admin/PricingCMSManager";
import CoverageCMSManager from "@/components/admin/CoverageCMSManager";
import ContactCMSManager from "@/components/admin/ContactCMSManager";

export default function AdminContentCMSPage() {
  const [activeSectionTab, setActiveSectionTab] = useState("blogs");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Blog Posts State
  const [blogsList, setBlogsList] = useState<BlogDetail[]>(
    Object.values(blogsData)
  );
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [selectedBlogForEdit, setSelectedBlogForEdit] = useState<BlogDetail | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Dynamic Content State across site sections
  const [cmsContent, setCmsContent] = useState({
    hero: {
      badge: "⚡ DHAKA'S #1 PROFESSIONAL CLEANING PLATFORM",
      heading: "Spotless Cleanliness for Homes & Corporate Offices",
      subheading: "Book certified pro cleaner teams with hospital-grade sanitization, live GPS tracking, and 100% satisfaction guarantee.",
      ctaPrimaryText: "Calculate Instant Estimate",
      ctaSecondaryText: "Explore Subscription Plans",
    },
    services: {
      badge: "PRO CLEANING SERVICES",
      heading: "Tailored Cleaning Packages for Every Space",
      subheading: "From bi-weekly apartment refreshes to full corporate office sanitization and post-construction cleaning.",
    },
    pricing: {
      badge: "TRANSPARENT SUBSCRIPTION PLANS",
      heading: "Flexible Monthly Cleaning Plans for Peace of Mind",
      subheading: "No hidden charges. Upgrade, downgrade, or pause your monthly subscription anytime.",
    },
    whyUs: {
      badge: "WHY CHOOSE CLEANIX",
      heading: "Trusted by 5,000+ Happy Home & Office Owners",
      subheading: "Verified background-checked cleaners, eco-friendly hospital-grade chemicals, and dedicated supervisor oversight.",
    },
    faq: {
      badge: "CUSTOMER SUPPORT & HELP",
      heading: "Frequently Asked Questions",
      subheading: "Have questions about our cleaning staff, equipment, or payment methods? We've got answers.",
      hotlinePhone: "+880 1700-999888",
    },
  });

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

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
        {/* Section Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 pb-5">
          {[
            { id: "blogs", label: "Blog & Editorial Articles CMS" },
            { id: "about", label: "About Us Page CMS" },
            { id: "servicesPage", label: "Services Page CMS" },
            { id: "projectsPage", label: "Projects Page CMS" },
            { id: "pricingPage", label: "Pricing Page CMS" },
            { id: "coveragePage", label: "Coverage Page CMS" },
            { id: "contactPage", label: "Contact Page CMS" },
            { id: "hero", label: "Hero Banner Section" },
            { id: "services", label: "Core Services Section" },
            { id: "pricing", label: "Pricing & Plans Section" },
            { id: "whyUs", label: "Why Choose Us Section" },
            { id: "faq", label: "FAQ & Support Section" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSectionTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold cursor-pointer transition-all whitespace-nowrap ${
                activeSectionTab === tab.id
                  ? "bg-[#007eff] text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
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

        {/* TABS 8-12: OTHER PAGE CMS SECTIONS */}
        {activeSectionTab !== "blogs" &&
          activeSectionTab !== "about" &&
          activeSectionTab !== "servicesPage" &&
          activeSectionTab !== "projectsPage" &&
          activeSectionTab !== "pricingPage" &&
          activeSectionTab !== "coveragePage" &&
          activeSectionTab !== "contactPage" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Editors (7 Cols) */}
            <form onSubmit={handleSaveCMS} className="lg:col-span-7 space-y-5 text-xs sm:text-sm">
              {activeSectionTab === "hero" && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Badge Tagline Text:</label>
                    <input
                      type="text"
                      value={cmsContent.hero.badge}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          hero: { ...cmsContent.hero, badge: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Main Hero Title (H1):</label>
                    <textarea
                      rows={2}
                      value={cmsContent.hero.heading}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          hero: { ...cmsContent.hero, heading: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold text-base focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Subtitle / Lead Paragraph:</label>
                    <textarea
                      rows={3}
                      value={cmsContent.hero.subheading}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          hero: { ...cmsContent.hero, subheading: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800">Primary CTA Button Label:</label>
                      <input
                        type="text"
                        value={cmsContent.hero.ctaPrimaryText}
                        onChange={(e) =>
                          setCmsContent({
                            ...cmsContent,
                            hero: { ...cmsContent.hero, ctaPrimaryText: e.target.value },
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-extrabold text-slate-800">Secondary CTA Button Label:</label>
                      <input
                        type="text"
                        value={cmsContent.hero.ctaSecondaryText}
                        onChange={(e) =>
                          setCmsContent({
                            ...cmsContent,
                            hero: { ...cmsContent.hero, ctaSecondaryText: e.target.value },
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSectionTab === "services" && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Services Badge Text:</label>
                    <input
                      type="text"
                      value={cmsContent.services.badge}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          services: { ...cmsContent.services, badge: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Section Title (H2):</label>
                    <input
                      type="text"
                      value={cmsContent.services.heading}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          services: { ...cmsContent.services, heading: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold text-base focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Section Subtitle Paragraph:</label>
                    <textarea
                      rows={3}
                      value={cmsContent.services.subheading}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          services: { ...cmsContent.services, subheading: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </>
              )}

              {activeSectionTab === "pricing" && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Pricing Badge Tag:</label>
                    <input
                      type="text"
                      value={cmsContent.pricing.badge}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          pricing: { ...cmsContent.pricing, badge: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Section Title (H2):</label>
                    <input
                      type="text"
                      value={cmsContent.pricing.heading}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          pricing: { ...cmsContent.pricing, heading: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold text-base focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Section Subtitle Paragraph:</label>
                    <textarea
                      rows={3}
                      value={cmsContent.pricing.subheading}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          pricing: { ...cmsContent.pricing, subheading: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </>
              )}

              {activeSectionTab === "whyUs" && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Why Us Badge Text:</label>
                    <input
                      type="text"
                      value={cmsContent.whyUs.badge}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          whyUs: { ...cmsContent.whyUs, badge: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Section Title (H2):</label>
                    <input
                      type="text"
                      value={cmsContent.whyUs.heading}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          whyUs: { ...cmsContent.whyUs, heading: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold text-base focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Section Subtitle Paragraph:</label>
                    <textarea
                      rows={3}
                      value={cmsContent.whyUs.subheading}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          whyUs: { ...cmsContent.whyUs, subheading: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </>
              )}

              {activeSectionTab === "faq" && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">FAQ Badge Text:</label>
                    <input
                      type="text"
                      value={cmsContent.faq.badge}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          faq: { ...cmsContent.faq, badge: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Section Title (H2):</label>
                    <input
                      type="text"
                      value={cmsContent.faq.heading}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          faq: { ...cmsContent.faq, heading: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold text-base focus:outline-none focus:border-[#007eff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800">Support Hotline Phone Number:</label>
                    <input
                      type="text"
                      value={cmsContent.faq.hotlinePhone}
                      onChange={(e) =>
                        setCmsContent({
                          ...cmsContent,
                          faq: { ...cmsContent.faq, hotlinePhone: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-[#007eff] hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Section Changes</span>
                </button>
              </div>
            </form>

            {/* Right Column: Real-Time Preview Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#007eff]" /> Live Rendered Preview
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
                  REAL-TIME CMS
                </span>
              </div>

              <div className="bg-[#0d274c] text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800">
                {activeSectionTab === "hero" && (
                  <>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 inline-block">
                      {cmsContent.hero.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                      {cmsContent.hero.heading}
                    </h2>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {cmsContent.hero.subheading}
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <button className="px-4 py-2 rounded-xl bg-[#007eff] text-white text-xs font-bold">
                        {cmsContent.hero.ctaPrimaryText}
                      </button>
                      <button className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/20">
                        {cmsContent.hero.ctaSecondaryText}
                      </button>
                    </div>
                  </>
                )}

                {activeSectionTab === "services" && (
                  <>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 inline-block">
                      {cmsContent.services.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                      {cmsContent.services.heading}
                    </h2>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {cmsContent.services.subheading}
                    </p>
                  </>
                )}

                {activeSectionTab === "pricing" && (
                  <>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 inline-block">
                      {cmsContent.pricing.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                      {cmsContent.pricing.heading}
                    </h2>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {cmsContent.pricing.subheading}
                    </p>
                  </>
                )}

                {activeSectionTab === "whyUs" && (
                  <>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 inline-block">
                      {cmsContent.whyUs.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                      {cmsContent.whyUs.heading}
                    </h2>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {cmsContent.whyUs.subheading}
                    </p>
                  </>
                )}

                {activeSectionTab === "faq" && (
                  <>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 inline-block">
                      {cmsContent.faq.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                      {cmsContent.faq.heading}
                    </h2>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {cmsContent.faq.subheading}
                    </p>
                    <p className="text-xs text-[#007eff] font-bold pt-2">
                      Hotline: {cmsContent.faq.hotlinePhone}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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
