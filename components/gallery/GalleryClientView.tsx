"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Play,
  X,
} from "lucide-react";
import { GalleryItem, fetchActiveGalleryAPI } from "@/services/galleryService";
import { io } from "socket.io-client";

interface Props {
  initialItems: GalleryItem[];
}

const SkeletonCard = ({ heightClass }: { heightClass: string }) => (
  <div className="flex flex-col space-y-2 animate-pulse w-full">
    <div
      className={`w-full ${heightClass} bg-slate-200/80 rounded-lg relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
    </div>
    <div className="space-y-1.5 px-1">
      <div className="h-3.5 bg-slate-200 rounded-md w-4/5" />
      <div className="h-3 bg-slate-200/60 rounded-md w-2/5" />
    </div>
  </div>
);

const SkeletonGrid = () => {
  const heights = ["h-60", "h-72", "h-56", "h-80", "h-64", "h-76"];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 items-start w-full">
      {Array.from({ length: 6 }).map((_, colIdx) => (
        <div
          key={colIdx}
          className={`flex flex-col gap-3 sm:gap-4 ${
            colIdx === 2
              ? "hidden sm:flex"
              : colIdx === 3
              ? "hidden lg:flex"
              : colIdx === 4
              ? "hidden xl:flex"
              : colIdx === 5
              ? "hidden 2xl:flex"
              : "flex"
          }`}
        >
          <SkeletonCard heightClass={heights[colIdx % heights.length]} />
          <SkeletonCard heightClass={heights[(colIdx + 2) % heights.length]} />
        </div>
      ))}
    </div>
  );
};

// In-Memory Module Cache for persistent zero-reload client navigation
let globalGalleryMemoryCache: GalleryItem[] | null = null;

export default function GalleryClientView({ initialItems }: Props) {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    if (globalGalleryMemoryCache && globalGalleryMemoryCache.length > 0) {
      return globalGalleryMemoryCache;
    }
    return initialItems || [];
  });

  const [typeFilter, setTypeFilter] = useState<"ALL" | "IMAGE" | "VIDEO">("ALL");
  const [activeMediaModal, setActiveMediaModal] = useState<GalleryItem | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(() => {
    if (globalGalleryMemoryCache && globalGalleryMemoryCache.length > 0) {
      return false;
    }
    return !initialItems || initialItems.length === 0;
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Sync memory cache whenever items change
  useEffect(() => {
    if (items && items.length > 0) {
      globalGalleryMemoryCache = items;
    }
  }, [items]);

  // Filter items first
  const filteredItems = useMemo(() => {
    return items.filter((i) => typeFilter === "ALL" || i.type === typeFilter);
  }, [items, typeFilter]);

  // Distribute items across 6 columns with Shortest-Column height balancing
  const columnizedItems = useMemo(() => {
    const maxCols = 6;
    const cols: GalleryItem[][] = Array.from({ length: maxCols }, () => []);
    const colHeights: number[] = Array.from({ length: maxCols }, () => 0);

    filteredItems.forEach((item) => {
      let shortestColIdx = 0;
      let minHeight = colHeights[0];

      for (let i = 1; i < maxCols; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i];
          shortestColIdx = i;
        }
      }

      const weight = item.type === "VIDEO" ? 260 : 230;
      cols[shortestColIdx].push(item);
      colHeights[shortestColIdx] += weight;
    });

    return cols;
  }, [filteredItems]);

  // Load next page smoothly when scrolled to bottom
  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoadingInitial) return;
    setIsLoadingMore(true);

    const nextPage = page + 1;
    try {
      const res = await fetchActiveGalleryAPI(nextPage, 100);
      if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
        const newFetchedItems = res.data;
        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i._id));
          const uniqueNew = newFetchedItems.filter((i: any) => !existingIds.has(i._id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
        setHasMore(Boolean(res?.meta?.hasMore));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching gallery page:", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore, isLoadingInitial]);

  // Set up IntersectionObserver for infinite scrolling without background jitter loops
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoadingInitial) {
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreItems, hasMore, isLoadingMore, isLoadingInitial]);

  // Initial fetch fallback if initialItems is empty
  useEffect(() => {
    if (!initialItems || initialItems.length === 0) {
      setIsLoadingInitial(true);
      fetchActiveGalleryAPI(1, 100)
        .then((res) => {
          if (res?.success && Array.isArray(res?.data)) {
            setItems(res.data);
            setHasMore(Boolean(res?.meta?.hasMore));
          }
        })
        .finally(() => {
          setIsLoadingInitial(false);
        });
    } else {
      setIsLoadingInitial(false);
    }

    // Real-time Socket.IO listener
    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("gallery_updated", () => {
      fetchActiveGalleryAPI(1, 100).then((res) => {
        if (res?.success && Array.isArray(res?.data)) {
          setItems(res.data);
          setPage(1);
          setHasMore(Boolean(res?.meta?.hasMore));
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [initialItems]);

  const filteredCount = filteredItems.length;

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header Hero Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-[#007eff]/30 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-4 py-1 bg-blue-50/70">
            <Sparkles className="w-3.5 h-3.5 text-[#007eff]" />
            <span>WORK SHOWCASE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-tight">
            OUR CLEANING GALLERY
          </h1>
        </div>

        {/* Media Filter Tabs */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
              typeFilter === "ALL"
                ? "bg-[#007eff] text-white border-[#007eff]"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            All Showcase ({items.length})
          </button>

          <button
            onClick={() => setTypeFilter("IMAGE")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
              typeFilter === "IMAGE"
                ? "bg-[#007eff] text-white border-[#007eff]"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos ({items.filter((i) => i.type === "IMAGE").length})</span>
          </button>

          <button
            onClick={() => setTypeFilter("VIDEO")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
              typeFilter === "VIDEO"
                ? "bg-[#007eff] text-white border-[#007eff]"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos ({items.filter((i) => i.type === "VIDEO").length})</span>
          </button>
        </div>

        {/* Initial Skeleton Loader */}
        {isLoadingInitial ? (
          <SkeletonGrid />
        ) : filteredCount === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-700">No showcase items available</h3>
          </div>
        ) : (
          <>
            {/* Pure CSS Responsive Grid: Frame 0 hydration perfection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 items-start w-full">
              {columnizedItems.map((colItems, colIdx) => (
                <div
                  key={colIdx}
                  className={`flex flex-col gap-3 sm:gap-4 ${
                    colIdx === 2
                      ? "hidden sm:flex"
                      : colIdx === 3
                      ? "hidden lg:flex"
                      : colIdx === 4
                      ? "hidden xl:flex"
                      : colIdx === 5
                      ? "hidden 2xl:flex"
                      : "flex"
                  }`}
                >
                  {colItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setActiveMediaModal(item)}
                      className="cursor-pointer group flex flex-col space-y-1.5 w-full"
                    >
                      {/* Image container fits natural image aspect ratio tightly */}
                      <div className="relative w-full rounded-lg overflow-hidden bg-slate-200/60">
                        {item.type === "IMAGE" ? (
                          <img
                            src={item.url}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-auto block group-hover:scale-105 transition-transform duration-500 rounded-lg"
                          />
                        ) : (
                          <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : null}
                            <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                              <div className="w-11 h-11 rounded-full bg-[#007eff] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                                <Play className="w-5 h-5 fill-white ml-0.5" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Video Badge Overlay */}
                        {item.type === "VIDEO" && (
                          <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            <span>SHOWCASE</span>
                          </div>
                        )}
                      </div>

                      {/* Minimal Title Below Image */}
                      <div className="px-1 pt-0.5">
                        <h3 className="text-xs sm:text-sm font-bold text-[#001837] group-hover:text-[#007eff] transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Skeleton loader at the bottom when loading additional items on scroll */}
            {isLoadingMore && (
              <div className="pt-4">
                <SkeletonGrid />
              </div>
            )}
          </>
        )}

        {/* Scroll Observer Sentinel for Infinite Load */}
        <div ref={observerTarget} className="h-10 flex items-center justify-center" />
      </div>

      {/* Lightbox / Video Viewer Modal */}
      {activeMediaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveMediaModal(null)}
        >
          {/* Floating Close Button */}
          <button
            onClick={() => setActiveMediaModal(null)}
            className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg backdrop-blur-md"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Clean Borderless Image / Video Container */}
          <div
            className="relative w-full max-w-6xl h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMediaModal.type === "IMAGE" ? (
              <img
                src={activeMediaModal.url}
                alt={activeMediaModal.title}
                className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl select-none"
              />
            ) : (
              <div className="w-full h-full max-w-5xl max-h-[82vh] aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={
                    activeMediaModal.url.includes("watch?v=")
                      ? activeMediaModal.url.replace("watch?v=", "embed/")
                      : activeMediaModal.url
                  }
                  title={activeMediaModal.title}
                  className="w-full h-full border-0 rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
