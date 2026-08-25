"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Check } from "lucide-react";

interface ProofItem {
  id: string; bookingId: string; customerName: string; serviceName: string;
  cleaners: string[]; submittedAt: string; beforePhoto: string; afterPhoto: string;
  status: "PENDING_VERIFICATION" | "VERIFIED_APPROVED"; payoutTriggered: boolean;
}
interface Props { teamSlug: string; }

export default function TeamProofsView({ teamSlug }: Props) {
  const [proofs, setProofs] = useState<ProofItem[]>([
    { id: "POW-1001", bookingId: "CLN-2026-8890", customerName: "Anisur Rahman", serviceName: "Move-In / Move-Out Deep Clean (Navana Tower)", cleaners: ["Sajjad Hossain", "Asif Khan"], submittedAt: "Today at 12:15 PM", beforePhoto: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80", afterPhoto: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80", status: "PENDING_VERIFICATION", payoutTriggered: false },
    { id: "POW-1000", bookingId: "CLN-2026-8889", customerName: "Kazi Farhan", serviceName: "VIP Sofa & Carpet Wash (Uttara Villa)", cleaners: ["Kamrul Islam"], submittedAt: "Yesterday at 04:30 PM", beforePhoto: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80", afterPhoto: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80", status: "VERIFIED_APPROVED", payoutTriggered: true },
  ]);
  const handleVerifyQuality = (id: string) => setProofs(prev => prev.map(p => p.id === id ? { ...p, status: "VERIFIED_APPROVED", payoutTriggered: true } : p));

  return (
    <div className="space-y-8 pb-12 w-full">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">QUALITY CONTROL &amp; PROOF OF WORK</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Automated Wallet Payout Trigger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Team Proof of Work Quality Monitor</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">ক্লিনারদের আপলোড করা কাজের আগের ও শেষের (Before / After) ছবি পরীক্ষা করুন। কোয়ালিটি সঠিক থাকলে ভেরিফাই করুন, এতে পার-ভিজিট পে-আউট জমা হবে।</p>
        </div>
      </div>
      <div className="space-y-6">
        {proofs.map(proof => (
          <div key={proof.id} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-[#007eff] uppercase">JOB #{proof.bookingId} • PROOF #{proof.id}</span>
                <h3 className="font-extrabold text-slate-900 text-base mt-0.5">{proof.serviceName}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Customer: <strong>{proof.customerName}</strong> | Cleaners: <strong>{proof.cleaners.join(", ")}</strong></p>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto ${proof.status === "VERIFIED_APPROVED" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"}`}>
                {proof.status === "VERIFIED_APPROVED" ? <><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Quality Verified &amp; Payout Released</> : <><Clock className="w-4 h-4 text-amber-600" /> Pending Leader Verification</>}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">📷 Before Cleaning Photo</span>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                  <img src={proof.beforePhoto} alt="Before cleaning" className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">BEFORE</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">✨ After Cleaning Photo</span>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                  <img src={proof.afterPhoto} alt="After cleaning" className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">AFTER</span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              {proof.status === "PENDING_VERIFICATION" ? (
                <button type="button" onClick={() => handleVerifyQuality(proof.id)} className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"><Check className="w-4 h-4 stroke-[3]" /><span>Verify Quality &amp; Trigger Payout</span></button>
              ) : (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Per-visit payout successfully released to team &amp; leader wallet.</span></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
