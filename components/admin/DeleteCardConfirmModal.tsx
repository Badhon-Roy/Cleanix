"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteCardConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cardTitle?: string;
}

export default function DeleteCardConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  cardTitle = "this pricing card",
}: DeleteCardConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl text-slate-900 space-y-6 animate-in zoom-in-95 duration-200"
      >
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              Delete Plan Card?
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Action cannot be undone
            </p>
          </div>
        </div>

        {/* Warning Body */}
        <div className="bg-red-50/60 border border-red-200/80 p-4 rounded-2xl space-y-1.5">
          <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
            Are you sure you want to permanently remove <strong className="text-red-600 font-black">{cardTitle}</strong> from the catalog?
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            This plan card will no longer appear on the customer portal or pricing estimator grid.
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 px-5 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Yes, Delete</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
