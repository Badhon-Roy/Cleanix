"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function AdminContentCMSPage() {
  const [activeSectionTab, setActiveSectionTab] = useState("hero");
  const [savedSuccess, setSavedSuccess] = useState(false);

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
              Dynamic Page Content CMS Manager
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ LIVE WEBSITE CMS
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Edit text content, headings, lead paragraphs, and CTA button labels dynamically for any section on the site.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Section Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 pb-5">
          {[
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
            <span>Section text content saved successfully! (Live preview updated instantly)</span>
          </div>
        )}

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
                  <p className="text-xs text-emerald-400 font-bold pt-2">
                    Hotline: {cmsContent.faq.hotlinePhone}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
