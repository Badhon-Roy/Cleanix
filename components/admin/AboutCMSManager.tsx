"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Info,
  Save,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  CheckCircle2,
  X,
  UserCheck,
  Truck,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import {
  AboutContent,
  TeamMemberItem,
  getStoredAboutData,
  saveAboutData,
} from "@/lib/aboutData";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function AboutCMSManager() {
  const [formData, setFormData] = useState<AboutContent>(getStoredAboutData());
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  // Team Member Form State
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberImage, setMemberImage] = useState("");
  const [memberNidVerified, setMemberNidVerified] = useState(true);
  const [memberBio, setMemberBio] = useState("");

  useEffect(() => {
    setFormData(getStoredAboutData());

    const handleUpdate = () => {
      setFormData(getStoredAboutData());
    };

    window.addEventListener("cleanix_about_updated", handleUpdate);
    return () => {
      window.removeEventListener("cleanix_about_updated", handleUpdate);
    };
  }, []);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    saveAboutData(formData);
    toast.success("About Us Page CMS updated successfully! (Changes Live)");
  };

  const handleOpenAddTeamModal = () => {
    setEditingMemberId(null);
    setMemberName("");
    setMemberRole("SENIOR SPECIALIST");
    setMemberImage(
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
    );
    setMemberNidVerified(true);
    setMemberBio("");
    setIsTeamModalOpen(true);
  };

  const handleOpenEditTeamModal = (item: TeamMemberItem) => {
    setEditingMemberId(item.id);
    setMemberName(item.name);
    setMemberRole(item.role);
    setMemberImage(item.image);
    setMemberNidVerified(item.nidVerified);
    setMemberBio(item.bio);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberName.trim() || !memberRole.trim()) {
      toast.error("Please provide Team Member Name and Role.");
      return;
    }

    let updatedMembers: TeamMemberItem[] = [];

    if (editingMemberId) {
      updatedMembers = formData.teamMembers.map((m) =>
        m.id === editingMemberId
          ? {
              ...m,
              name: memberName,
              role: memberRole,
              image: memberImage,
              nidVerified: memberNidVerified,
              bio: memberBio,
            }
          : m
      );
      toast.success(`Team Member "${memberName}" updated.`);
    } else {
      const newMember: TeamMemberItem = {
        id: `TM-${Date.now()}`,
        name: memberName,
        role: memberRole,
        image: memberImage,
        nidVerified: memberNidVerified,
        bio: memberBio,
      };
      updatedMembers = [newMember, ...formData.teamMembers];
      toast.success(`New Team Member "${memberName}" added.`);
    }

    const newFormData = { ...formData, teamMembers: updatedMembers };
    setFormData(newFormData);
    saveAboutData(newFormData);
    setIsTeamModalOpen(false);
  };

  const handleDeleteTeamMember = (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove team member "${name}"?`
    );
    if (confirmDelete) {
      const updatedMembers = formData.teamMembers.filter((m) => m.id !== id);
      const newFormData = { ...formData, teamMembers: updatedMembers };
      setFormData(newFormData);
      saveAboutData(newFormData);
      toast.error(`Team Member "${name}" removed.`);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Action Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Info className="w-5 h-5 text-[#007eff]" /> About Us Page Dynamic CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage public About Us page headlines, company story, statistics counters, and executive team roster.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/about"
            target="_blank"
            className="px-4 py-2 rounded-2xl font-extrabold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Public View</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-2xl font-extrabold text-xs bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Live</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* SECTION 1: HERO BANNER SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#007eff]" /> 1. Hero Banner Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Main hero title, pill badge, subtitle, and cover background image on `/about`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Hero Pill Badge (e.g. ABOUT CLEANIX):
              </label>
              <input
                type="text"
                value={formData.heroBadge}
                onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Headline Line 1 (e.g. REDEFINING CLEANLINESS WITH):
              </label>
              <input
                type="text"
                value={formData.heroTitleLine1}
                onChange={(e) => setFormData({ ...formData, heroTitleLine1: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Headline Highlight Word (e.g. TECHNOLOGY):
              </label>
              <input
                type="text"
                value={formData.heroTitleHighlight}
                onChange={(e) => setFormData({ ...formData, heroTitleHighlight: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-black uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Hero Cover Image URL / Path:
              </label>
              <input
                type="text"
                value={formData.heroImage}
                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Subtitle Paragraph (Bangla / English):
              </label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPANY OVERVIEW STORY & COUNTER CARDS SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
              <Info className="w-5 h-5 text-[#007eff]" /> 2. Company Overview Story & Counter Cards Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Overview headline, description text, side images, and the 3 bottom statistic counter cards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Overview Pill Badge (e.g. COMPANY OVERVIEW):
              </label>
              <input
                type="text"
                value={formData.overviewBadge}
                onChange={(e) => setFormData({ ...formData, overviewBadge: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Headline Line 1 (e.g. PROFESSIONAL CLEANING):
              </label>
              <input
                type="text"
                value={formData.overviewTitle1}
                onChange={(e) => setFormData({ ...formData, overviewTitle1: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Headline Highlight Word (e.g. SERVICE NETWORK):
              </label>
              <input
                type="text"
                value={formData.overviewTitleHighlight}
                onChange={(e) => setFormData({ ...formData, overviewTitleHighlight: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-black uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Left Image URL / Path:
              </label>
              <input
                type="text"
                value={formData.overviewLeftImage}
                onChange={(e) => setFormData({ ...formData, overviewLeftImage: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Right Image URL / Path:
              </label>
              <input
                type="text"
                value={formData.overviewRightImage}
                onChange={(e) => setFormData({ ...formData, overviewRightImage: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-2">
              <RichTextEditor
                label="Overview Description Paragraph (Supports HTML & Formatting):"
                value={formData.overviewDesc}
                onChange={(newValue) => setFormData({ ...formData, overviewDesc: newValue })}
                placeholder="Enter company overview description..."
              />
            </div>
          </div>

          {/* Embedded Company Overview Counter Cards Block */}
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <label className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#007eff]" /> Company Overview Bottom Counter Cards (Cleanings, Clients, Rating):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Card 1: Cleanings Completed */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4 text-slate-700" />
                    <span>1. Cleanings Completed</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                    Navy Card
                  </span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Count Number / Value:</label>
                    <input
                      type="text"
                      placeholder="e.g. 16K+"
                      value={formData.stat1Count}
                      onChange={(e) => setFormData({ ...formData, stat1Count: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-black text-lg focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Label Text:</label>
                    <input
                      type="text"
                      placeholder="e.g. Cleanings Completed"
                      value={formData.stat1Label}
                      onChange={(e) => setFormData({ ...formData, stat1Label: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 font-extrabold text-xs focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Satisfied Clients */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                  <span className="text-xs font-black text-[#007eff] uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#007eff]" />
                    <span>2. Satisfied Clients</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#007eff] text-white">
                    Blue Card
                  </span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">Count Number / Value:</label>
                    <input
                      type="text"
                      placeholder="e.g. 1,200+"
                      value={formData.stat2Count}
                      onChange={(e) => setFormData({ ...formData, stat2Count: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-black text-lg focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">Label Text:</label>
                    <input
                      type="text"
                      placeholder="e.g. Satisfied Clients"
                      value={formData.stat2Label}
                      onChange={(e) => setFormData({ ...formData, stat2Label: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-extrabold text-xs focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Average Client Rating */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>3. Average Client Rating</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                    Navy Card
                  </span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Rating Score / Value:</label>
                    <input
                      type="text"
                      placeholder="e.g. 4.9 / 5"
                      value={formData.stat3Count}
                      onChange={(e) => setFormData({ ...formData, stat3Count: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-black text-lg focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Label Text:</label>
                    <input
                      type="text"
                      placeholder="e.g. Average Client Rating"
                      value={formData.stat3Label}
                      onChange={(e) => setFormData({ ...formData, stat3Label: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 font-extrabold text-xs focus:outline-none focus:border-[#007eff]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: WHO WE ARE & COMPANY MISSION SETTINGS */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#007eff]" /> 3. Who We Are &amp; Company Mission Settings
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage headlines, feature image, experience stats, who we are description paragraphs, and checklist items.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Section Pill Badge (e.g. ABOUT OUR COMPANY):
              </label>
              <input
                type="text"
                value={formData.whoWeAreBadge}
                onChange={(e) => setFormData({ ...formData, whoWeAreBadge: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Main Headline Text (3/4 width) */}
            <div className="space-y-1.5 sm:col-span-9">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Main Headline Text:
              </label>
              <input
                type="text"
                value={formData.whoWeAreTitle}
                onChange={(e) => setFormData({ ...formData, whoWeAreTitle: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            {/* Headline Highlight Word (1/4 width) */}
            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Headline Highlight Word:
              </label>
              <input
                type="text"
                value={formData.whoWeAreHighlight}
                onChange={(e) => setFormData({ ...formData, whoWeAreHighlight: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-[#007eff] font-black uppercase focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Feature Image URL / Path:
              </label>
              <input
                type="text"
                value={formData.whoWeAreFeatureImage}
                onChange={(e) => setFormData({ ...formData, whoWeAreFeatureImage: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Years of Experience Value (e.g. 10+):
              </label>
              <input
                type="text"
                value={formData.whoWeAreExpYears}
                onChange={(e) => setFormData({ ...formData, whoWeAreExpYears: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Years of Experience Label:
              </label>
              <input
                type="text"
                value={formData.whoWeAreExpLabel}
                onChange={(e) => setFormData({ ...formData, whoWeAreExpLabel: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Happy Clients Count Badge:
              </label>
              <input
                type="text"
                value={formData.whoWeAreClientsCount}
                onChange={(e) => setFormData({ ...formData, whoWeAreClientsCount: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Google Rating Score (e.g. 4.8/5.0):
              </label>
              <input
                type="text"
                value={formData.whoWeAreRatingScore}
                onChange={(e) => setFormData({ ...formData, whoWeAreRatingScore: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-12">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Subheading Title (e.g. আমরা কারা? (Who We Are)):
              </label>
              <input
                type="text"
                value={formData.whoWeAreSubheading}
                onChange={(e) => setFormData({ ...formData, whoWeAreSubheading: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-extrabold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="sm:col-span-12">
              <RichTextEditor
                label="Company Story & Description Paragraphs (Press Enter for line breaks, HTML supported):"
                value={formData.whoWeArePara1}
                onChange={(newValue) => setFormData({ ...formData, whoWeArePara1: newValue })}
                rows={6}
                placeholder="Type your description text here... Press Enter to create new line breaks or paragraphs."
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Checklist Item 1:
              </label>
              <input
                type="text"
                value={formData.whoWeAreCheck1}
                onChange={(e) => setFormData({ ...formData, whoWeAreCheck1: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Checklist Item 2:
              </label>
              <input
                type="text"
                value={formData.whoWeAreCheck2}
                onChange={(e) => setFormData({ ...formData, whoWeAreCheck2: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Checklist Item 3:
              </label>
              <input
                type="text"
                value={formData.whoWeAreCheck3}
                onChange={(e) => setFormData({ ...formData, whoWeAreCheck3: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-6">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
                Checklist Item 4:
              </label>
              <input
                type="text"
                value={formData.whoWeAreCheck4}
                onChange={(e) => setFormData({ ...formData, whoWeAreCheck4: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: TEAM MEMBERS & SPECIALISTS ROSTER */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                <Users className="w-5 h-5 text-[#007eff]" /> 4. Executive &amp; Specialist Team Roster ({formData.teamMembers.length} Members)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage team specialists, photos, roles, NID badges, and bios displayed on `/about`.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddTeamModal}
              className="px-4 py-2 rounded-2xl font-extrabold text-xs bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Team Specialist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {formData.teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between hover:border-[#007eff]/60 transition-all"
              >
                <div className="space-y-3">
                  <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {member.nidVerified && (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-emerald-700">
                        NID VERIFIED
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{member.name}</h4>
                    <p className="text-xs font-bold text-[#007eff] uppercase tracking-wider">{member.role}</p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1 line-clamp-2">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditTeamModal(member)}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-colors cursor-pointer"
                    title="Edit Team Member"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteTeamMember(member.id, member.name)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                    title="Delete Team Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {formData.teamMembers.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-500 font-medium">
                No team specialists added yet. Click &quot;Add Team Specialist&quot; to add one.
              </div>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl font-extrabold text-sm bg-[#007eff] hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save All Changes Live</span>
          </button>
        </div>
      </form>

      {/* ADD / EDIT TEAM MEMBER MODAL */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-extrabold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingMemberId ? "Edit Team Specialist" : "Add Team Specialist"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Configure staff profile for `/about`
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTeamModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamMember} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariqul Islam"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">Job Role / Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Head of Operations & Quality Audit"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">Photo Image URL:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={memberImage}
                  onChange={(e) => setMemberImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="nidVerified"
                  checked={memberNidVerified}
                  onChange={(e) => setMemberNidVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-[#007eff] focus:ring-[#007eff]"
                />
                <label htmlFor="nidVerified" className="font-extrabold text-slate-800 cursor-pointer">
                  Display &quot;NID Verified&quot; Badge
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 block">Short Bio / Description:</label>
                <textarea
                  rows={3}
                  placeholder="e.g. ১০ বছরের ফিল্ড সার্ভিস অভিজ্ঞতা সহ প্রজেক্ট ইনসপেকশন এক্সপার্ট।"
                  value={memberBio}
                  onChange={(e) => setMemberBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMemberId ? "Save Member" : "Add Member"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
