"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCustomerAccountAPI } from "@/services/customerService";
import { logoutUser } from "@/services/authService";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const [mounted, setMounted] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setConfirmInput("");
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleDelete = async () => {
    if (confirmInput.trim().toUpperCase() !== "DELETE") {
      toast.error('Please type "DELETE" to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    const res = await deleteCustomerAccountAPI();
    setIsDeleting(false);

    if (res?.success) {
      toast.success(res?.message || "Your account has been deleted successfully.");
      onClose();
      await logoutUser("/login");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } else {
      toast.error(res?.message || "Failed to delete account. Please try again.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-200 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-2xl bg-red-100/80 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0 shadow-sm">
            <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Delete Your Account?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            This action is <strong className="text-red-600 font-bold">permanent and irreversible</strong>. All your active cleaning service bookings, saved addresses, and profile data will be deactivated.
          </p>
        </div>

        {/* Confirmation Input Box */}
        <div className="space-y-2 bg-red-50/60 p-4 rounded-2xl border border-red-200/80">
          <label className="block text-xs font-bold text-red-900 select-none">
            To confirm deletion, type <span className="underline decoration-red-500 font-black">DELETE</span> below:
          </label>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="Type DELETE"
            disabled={isDeleting}
            className="w-full bg-white border border-red-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 uppercase"
          />
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || confirmInput.trim().toUpperCase() !== "DELETE"}
            className="py-3 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors flex items-center gap-2 border border-red-500 shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting Account...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
                <span>Confirm Permanent Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
