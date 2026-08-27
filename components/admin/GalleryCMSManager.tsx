"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Sparkles,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  Filter,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
  Loader2,
  Check,
} from "lucide-react";
import {
  GalleryItem,
  fetchAdminGalleryAPI,
  deleteGalleryAPI,
  deleteBulkGalleryAPI,
  updateGalleryAPI,
} from "@/services/galleryService";
import { toast } from "sonner";
import { io } from "socket.io-client";
import GalleryModal from "./GalleryModal";

// Persistent Client Memory Cache for instant Admin tab switching
let adminGalleryMemoryCache: GalleryItem[] | null = null;

export default function GalleryCMSManager() {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(() => adminGalleryMemoryCache || []);
  const [loading, setLoading] = useState(() => !adminGalleryMemoryCache || adminGalleryMemoryCache.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "IMAGE" | "VIDEO">("ALL");
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Multi-select & Bulk Delete State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "SINGLE" | "BULK";
    targetId?: string;
    itemTitle?: string;
  }>({
    isOpen: false,
    type: "SINGLE",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const loadGallery = async (silent = false) => {
    if (!silent && (!adminGalleryMemoryCache || adminGalleryMemoryCache.length === 0)) {
      setLoading(true);
    }
    try {
      const res = await fetchAdminGalleryAPI();
      if (res?.success && Array.isArray(res.data)) {
        setGalleryList(res.data);
        adminGalleryMemoryCache = res.data;
      }
    } catch (err) {
      console.error("Error loading admin gallery:", err);
      if (!silent) toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery(adminGalleryMemoryCache && adminGalleryMemoryCache.length > 0 ? true : false);

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("gallery_updated", () => {
      loadGallery(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredItems = galleryList.filter((item) => {
    const titleText = (item?.title || "").toLowerCase();
    const matchesSearch = titleText.includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || item?.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Checkbox selection handlers
  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => selectedIds.includes(item._id!));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Unselect all currently filtered items
      const filteredIdSet = new Set(filteredItems.map((i) => i._id!));
      setSelectedIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      // Select all currently filtered items
      const allFilteredIds = filteredItems.map((i) => i._id!);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  // Open confirmation modal for single delete
  const triggerSingleDelete = (id: string, title?: string) => {
    setConfirmModal({
      isOpen: true,
      type: "SINGLE",
      targetId: id,
      itemTitle: title,
    });
  };

  // Open confirmation modal for bulk delete
  const triggerBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmModal({
      isOpen: true,
      type: "BULK",
    });
  };

  // Confirm delete execution handler
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (confirmModal.type === "SINGLE" && confirmModal.targetId) {
        await deleteGalleryAPI(confirmModal.targetId);
        toast.success("Gallery item deleted successfully!");
        setGalleryList((prev) => {
          const next = prev.filter((item) => item._id !== confirmModal.targetId);
          adminGalleryMemoryCache = next;
          return next;
        });
        setSelectedIds((prev) => prev.filter((id) => id !== confirmModal.targetId));
      } else if (confirmModal.type === "BULK" && selectedIds.length > 0) {
        await deleteBulkGalleryAPI(selectedIds);
        toast.success(`${selectedIds.length} gallery items deleted successfully!`);
        const deleteSet = new Set(selectedIds);
        setGalleryList((prev) => {
          const next = prev.filter((item) => !deleteSet.has(item._id!));
          adminGalleryMemoryCache = next;
          return next;
        });
        setSelectedIds([]);
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err?.message || "Failed to delete item(s)");
    } finally {
      setIsDeleting(false);
      setConfirmModal({ isOpen: false, type: "SINGLE" });
    }
  };

  const handleToggleStatus = async (item: GalleryItem) => {
    const nextStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateGalleryAPI(item._id!, { status: nextStatus });
      toast.success(`Gallery item marked as ${nextStatus}!`);
      setGalleryList((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, status: nextStatus } : i))
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#007eff]" />
            <span>Our Gallery CMS Showcase Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage cleaning photos & video showcases displayed on website /gallery page.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedItemForEdit(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-[#007eff] hover:bg-blue-600 text-white shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Gallery Showcase</span>
        </button>
      </div>

      {/* Filter, Search & Select-All Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#007eff]"
            />
          </div>

          {/* Select All Checkbox Button */}
          {filteredItems.length > 0 && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 border w-full sm:w-auto justify-center ${
                isAllSelected
                  ? "bg-blue-50 border-[#007eff] text-[#007eff]"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-[#007eff]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {isAllSelected ? "Deselect All" : "Select All"} ({filteredItems.length})
              </span>
            </button>
          )}
        </div>

        {/* Media Type Filter Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto justify-start lg:justify-end">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#007eff]" />
            Type:
          </span>
          {(["ALL", "IMAGE", "VIDEO"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                typeFilter === t
                  ? "bg-[#007eff] text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {t === "ALL" ? "All Media" : t === "IMAGE" ? "📷 Photos" : "🎥 Videos"}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Bulk Actions Bar (Appears when 1 or more items are checked) */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-20 flex items-center justify-between gap-4 bg-[#001837] text-white p-4 rounded-2xl shadow-xl border border-blue-500/30 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#007eff] text-white font-black text-xs flex items-center justify-center shadow-inner">
              {selectedIds.length}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-white">
                {selectedIds.length} Showcase Item{selectedIds.length > 1 ? "s" : ""} Selected
              </p>
              <p className="text-[11px] text-blue-200/80 font-medium">
                Choose an action for selected items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Clear Selection
            </button>

            <button
              type="button"
              onClick={triggerBulkDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Gallery Showcase Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">No gallery items found matching filters!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const isSelected = selectedIds.includes(item._id!);
            return (
              <div
                key={item._id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all group flex flex-col justify-between relative ${
                  isSelected
                    ? "border-[#007eff] ring-2 ring-[#007eff]/30 shadow-md bg-blue-50/10"
                    : "border-slate-200 hover:border-[#007eff]/50 shadow-xs"
                }`}
              >
                {/* Checkbox Overlay (Top Left) */}
                <div
                  onClick={() => toggleSelectItem(item._id!)}
                  className="absolute top-3 left-3 z-10 cursor-pointer"
                  title={isSelected ? "Deselect item" : "Select item"}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all border shadow-md ${
                      isSelected
                        ? "bg-[#007eff] text-white border-[#007eff] scale-105"
                        : "bg-white/90 text-slate-400 border-slate-300 hover:border-[#007eff] hover:text-[#007eff]"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Square className="w-4 h-4 opacity-40" />
                    )}
                  </div>
                </div>

                {/* Media Preview Container */}
                <div
                  onClick={() => toggleSelectItem(item._id!)}
                  className="relative w-full h-48 bg-slate-900 overflow-hidden cursor-pointer"
                >
                  {item.type === "IMAGE" ? (
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover opacity-60"
                        />
                      ) : null}
                      <div className="relative z-10 w-12 h-12 rounded-full bg-[#007eff] text-white flex items-center justify-center shadow-lg">
                        <Video className="w-6 h-6" />
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 left-12 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500 text-white flex items-center gap-1 shadow-md">
                      {item.type === "IMAGE" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                      {item.type}
                    </span>
                  </div>

                  {/* Status Toggle Badge */}
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 backdrop-blur-xs cursor-pointer border shadow-md ${
                        item.status === "ACTIVE"
                          ? "bg-emerald-500/90 text-white border-emerald-400"
                          : "bg-rose-500/90 text-white border-rose-400"
                      }`}
                    >
                      {item.status === "ACTIVE" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{item.status}</span>
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedItemForEdit(item);
                        setIsModalOpen(true);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#007eff] border border-slate-200 transition-all cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => triggerSingleDelete(item._id!, item.title)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Create Modal */}
      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadGallery()}
        initialData={selectedItemForEdit}
      />

      {/* STYLISH CONFIRM DELETE POPUP MODAL */}
      {confirmModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => !isDeleting && setConfirmModal({ isOpen: false, type: "SINGLE" })}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              disabled={isDeleting}
              onClick={() => setConfirmModal({ isOpen: false, type: "SINGLE" })}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Warning Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
            </div>

            {/* Modal Title & Text */}
            <div className="text-center space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {confirmModal.type === "BULK"
                  ? `Delete ${selectedIds.length} Selected Showcase Item${selectedIds.length > 1 ? "s" : ""}?`
                  : "Delete Gallery Showcase Item?"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                {confirmModal.type === "BULK" ? (
                  <>
                    Are you sure you want to permanently delete{" "}
                    <span className="font-bold text-slate-900">{selectedIds.length} items</span> from the gallery? This action cannot be undone.
                  </>
                ) : (
                  <>
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-slate-900">
                      "{confirmModal.itemTitle || "this gallery item"}"
                    </span>
                    ? It will be permanently removed from the website showcase.
                  </>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmModal({ isOpen: false, type: "SINGLE" })}
                className="flex-1 py-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>
                      {confirmModal.type === "BULK"
                        ? `Yes, Delete (${selectedIds.length})`
                        : "Yes, Delete Item"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
