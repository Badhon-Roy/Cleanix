"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut, X } from "lucide-react";
import { logoutUser } from "@/utils/cookie";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0">
            <LogOut className="w-6 h-6 stroke-[2.5]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-slate-900">Confirm Log Out</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Are you sure you want to log out of your Cleanix Customer Account? You will need to log back in to manage your bookings and service subscriptions.
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
              logoutUser("/login");
            }}
            className="py-3 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors flex items-center gap-1.5 border border-red-500 shadow-xs"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
