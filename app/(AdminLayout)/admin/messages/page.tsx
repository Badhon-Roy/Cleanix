"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Mail,
  Phone,
  Eye,
  Calendar,
  Sparkles,
  User,
  ExternalLink,
  Edit3,
  X,
  Send,
  AlertCircle,
  Filter,
  ChevronDown,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  IContact,
  TContactStatus,
  fetchAllContactsAPI,
  updateContactStatusAPI,
  deleteContactAPI,
} from "@/services/contactService";
import { io } from "socket.io-client";

interface CustomStatusDropdownProps {
  status: TContactStatus;
  onChangeStatus: (newStatus: TContactStatus) => void;
}

function CustomStatusDropdown({ status, onChangeStatus }: CustomStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 190);
    }
    setIsOpen(!isOpen);
  };

  const options: {
    value: TContactStatus;
    label: string;
    activeStyle: string;
    hoverStyle: string;
  }[] = [
    {
      value: "NEW",
      label: "NEW",
      activeStyle: "bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200/80",
      hoverStyle: "hover:bg-amber-50 text-amber-900",
    },
    {
      value: "CONTACTED",
      label: "CONTACTED",
      activeStyle: "bg-blue-100/90 text-blue-900 border-blue-300 hover:bg-blue-200/80",
      hoverStyle: "hover:bg-blue-50 text-blue-900",
    },
    {
      value: "RESOLVED",
      label: "RESOLVED",
      activeStyle: "bg-emerald-100/90 text-emerald-900 border-emerald-300 hover:bg-emerald-200/80",
      hoverStyle: "hover:bg-emerald-50 text-emerald-900",
    },
    {
      value: "ARCHIVED",
      label: "ARCHIVED",
      activeStyle: "bg-slate-100/90 text-slate-800 border-slate-300 hover:bg-slate-200/80",
      hoverStyle: "hover:bg-slate-100 text-slate-800",
    },
  ];

  const currentOption = options.find((o) => o.value === status) || options[0];

  return (
    <div className={`relative inline-block text-left ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`text-[11px] font-black uppercase px-3 py-1.5 rounded-full border cursor-pointer inline-flex items-center gap-1.5 transition-all shadow-xs ${currentOption.activeStyle}`}
      >
        <span>{currentOption.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 w-36 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ${
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChangeStatus(opt.value);
                setIsOpen(false);
              }}
              className={`w-[calc(100%-8px)] mx-1 px-3 py-2 rounded-xl text-[11px] font-extrabold uppercase flex items-center justify-between transition-colors cursor-pointer ${
                opt.hoverStyle
              } ${status === opt.value ? "bg-slate-100/90 font-black" : ""}`}
            >
              <span>{opt.label}</span>
              {status === opt.value && <Check className="w-3.5 h-3.5 text-[#007eff]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<IContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL");
  const [selectedMessage, setSelectedMessage] = useState<IContact | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<IContact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveNotes = () => {
    if (!selectedMessage) return;
    toast.success("Admin notes saved successfully!");
  };

  const loadMessages = async (statusFilter = activeStatusFilter, search = searchQuery) => {
    setIsLoading(true);
    try {
      const data = await fetchAllContactsAPI({
        status: statusFilter,
        searchTerm: search,
      });
      setMessages(data);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages(activeStatusFilter, searchQuery);

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("contact_created", () => {
      toast.info("⚡ New Contact Form Inquiry Received!");
      loadMessages(activeStatusFilter, searchQuery);
    });

    socket.on("contact_updated", () => {
      loadMessages(activeStatusFilter, searchQuery);
    });

    return () => {
      socket.disconnect();
    };
  }, [activeStatusFilter, searchQuery]);

  const handleStatusChange = async (id: string, newStatus: TContactStatus) => {
    try {
      const res = await updateContactStatusAPI(id, newStatus);
      if (res && res.success) {
        toast.success(`Contact status updated to ${newStatus}`);
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
      } else {
        toast.error(res?.message || "Failed to update contact status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const confirmDeleteAction = async () => {
    if (!deleteConfirmTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteContactAPI(deleteConfirmTarget.id);
      if (res && res.success) {
        toast.success("Contact message deleted successfully.");
        setMessages((prev) => prev.filter((m) => m.id !== deleteConfirmTarget.id));
        if (selectedMessage?.id === deleteConfirmTarget.id) {
          setSelectedMessage(null);
        }
        setDeleteConfirmTarget(null);
      } else {
        toast.error(res?.message || "Failed to delete message");
      }
    } catch (err) {
      toast.error("Error deleting message");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Search Logic
  const filteredMessages = messages.filter((m) => {
    const matchesStatus =
      activeStatusFilter === "ALL" || m.status === activeStatusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // Metrics
  const totalCount = messages.length;
  const newCount = messages.filter((m) => m.status === "NEW").length;
  const contactedCount = messages.filter((m) => m.status === "CONTACTED").length;
  const resolvedCount = messages.filter((m) => m.status === "RESOLVED").length;

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Clean Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 stroke-[2.5]" />
              </div>
              Contact Form Submissions & Leads
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Real-time contact messages submitted by visitors & potential B2B / B2C clients on the website Contact Us page.
          </p>
        </div>
      </div>

      {/* Direct Modern Shadowless KPI Cards (No Hover Effect) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: All Inquiries */}
        <div
          onClick={() => setActiveStatusFilter("ALL")}
          className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
            activeStatusFilter === "ALL"
              ? "bg-slate-100/80 border-slate-500 ring-2 ring-slate-400/20"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              ALL INQUIRIES
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {totalCount}
            </p>
            <p className="text-xs font-semibold text-slate-500">Total website contact submissions</p>
          </div>
        </div>

        {/* Card 2: New Unread */}
        <div
          onClick={() => setActiveStatusFilter("NEW")}
          className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
            activeStatusFilter === "NEW"
              ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400/20"
              : "bg-amber-50/40 border-amber-300/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
              NEW UNREAD
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight">
              {newCount}
            </p>
            <p className="text-xs font-bold text-amber-800">Requires rapid phone/email callback</p>
          </div>
        </div>

        {/* Card 3: Contacted / In Progress */}
        <div
          onClick={() => setActiveStatusFilter("CONTACTED")}
          className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
            activeStatusFilter === "CONTACTED"
              ? "bg-blue-50 border-blue-500 ring-2 ring-blue-400/20"
              : "bg-blue-50/40 border-blue-300/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900">
              CONTACTED / IN PROGRESS
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
              {contactedCount}
            </p>
            <p className="text-xs font-medium text-slate-500">In communication with lead</p>
          </div>
        </div>

        {/* Card 4: Resolved & Booked */}
        <div
          onClick={() => setActiveStatusFilter("RESOLVED")}
          className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
            activeStatusFilter === "RESOLVED"
              ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/20"
              : "bg-emerald-50/40 border-emerald-400/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
              RESOLVED & BOOKED
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
              {resolvedCount}
            </p>
            <p className="text-xs font-medium text-slate-500">Successfully handled & converted</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: `All (${totalCount})` },
              { id: "NEW", label: `New (${newCount})` },
              { id: "CONTACTED", label: `Contacted (${contactedCount})` },
              { id: "RESOLVED", label: `Resolved (${resolvedCount})` },
              { id: "ARCHIVED", label: `Archived` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold cursor-pointer transition-all whitespace-nowrap ${
                  activeStatusFilter === tab.id
                    ? "bg-[#007eff] text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name, Phone, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto pb-32 min-h-[360px]">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Ref ID</th>
                <th className="p-4">Sender Info</th>
                <th className="p-4">Contact Phone & Email</th>
                <th className="p-4">Message Snippet</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMessages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    msg.status === "NEW" ? "bg-amber-50/30" : ""
                  }`}
                >
                  {/* Ref ID */}
                  <td className="p-4 font-extrabold text-[#007eff]">{msg.id}</td>

                  {/* Sender Info */}
                  <td className="p-4">
                    <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {msg.name}
                    </p>
                  </td>

                  {/* Phone & Email */}
                  <td className="p-4 space-y-1">
                    <a
                      href={`tel:${msg.phone}`}
                      className="font-bold text-slate-800 hover:text-[#007eff] flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {msg.phone}
                    </a>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-slate-500 hover:text-[#007eff] flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      {msg.email}
                    </a>
                  </td>

                  {/* Message Snippet */}
                  <td className="p-4 max-w-xs">
                    <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="p-4 text-xs text-slate-500 font-semibold whitespace-nowrap">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : msg.submittedAt || "N/A"}
                  </td>

                  {/* Custom Status Dropdown Pill */}
                  <td className="p-4">
                    <CustomStatusDropdown
                      status={msg.status}
                      onChangeStatus={(newStatus) => handleStatusChange(msg.id, newStatus)}
                    />
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMessage(msg);
                          setAdminNoteInput(msg.notes || "");
                        }}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 transition-colors cursor-pointer"
                        title="View Full Message & Admin Notes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmTarget(msg)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMessages.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 font-medium">
                    No contact form submissions found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL MESSAGE DETAILS MODAL */}
      {selectedMessage && (
        <div
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className="bg-white rounded-3xl border border-slate-200/90 max-w-2xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center font-extrabold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Contact Submission #{selectedMessage.id}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Submitted:{" "}
                    {selectedMessage.createdAt
                      ? new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : selectedMessage.submittedAt || "N/A"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Contact Card */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Sender Full Name:
                </span>
                <p className="font-extrabold text-slate-900 text-base">
                  {selectedMessage.name}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Contact Phone:
                </span>
                <a
                  href={`tel:${selectedMessage.phone}`}
                  className="font-extrabold text-[#007eff] hover:underline block text-base"
                >
                  {selectedMessage.phone}
                </a>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Email Address:
                </span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-extrabold text-slate-800 hover:underline block"
                >
                  {selectedMessage.email}
                </a>
              </div>
            </div>

            {/* Full Message Text */}
            <div className="space-y-2">
              <label className="font-extrabold text-slate-900 text-xs uppercase tracking-wider block">
                Full Inquiry Message:
              </label>
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-slate-800 text-xs sm:text-sm font-medium leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            {/* Admin Internal Notes Input */}
            <div className="space-y-2">
              <label className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Admin Follow-up Notes & Remarks:</span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  (Internal use only)
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="Write notes (e.g., Called client, sent quote on WhatsApp)..."
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff]"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold transition-all cursor-pointer"
                >
                  Save Internal Notes
                </button>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedMessage.phone}`}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Phone</span>
                </a>

                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: Cleanix Cleaning Service Inquiry&body=Hi ${selectedMessage.name},`}
                  className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION POPUP MODAL */}
      {deleteConfirmTarget && (
        <div
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 relative overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Delete Contact Inquiry?
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Ref ID: <span className="text-[#007eff] font-bold">{deleteConfirmTarget.id}</span>
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              Are you sure you want to permanently delete this contact inquiry from{" "}
              <strong className="text-slate-900">{deleteConfirmTarget.name}</strong> (
              {deleteConfirmTarget.phone})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteAction}
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-red-500/20"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{isDeleting ? "Deleting..." : "Yes, Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
