"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight, Zap, Calendar as CalendarIcon } from "lucide-react";

export default function BookingGuideBanner() {
  return (
    <div className="bg-gradient-to-r from-red-50/80 via-white to-red-50/80 border border-red-400/90 rounded p-6 sm:p-7 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              কখন New Booking এবং কখন Subscription সার্ভিস নেবেন?
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              আপনার প্রয়োজন অনুযায়ী সবচেয়ে উপযোগী ও সাশ্রয়ী অপশনটি বেছে নিতে নিচের গাইডটি সাহায্য করবে:
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/subscription"
          className="text-xs sm:text-sm font-extrabold text-white bg-[#007eff] hover:bg-[#0066ee] px-5 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto flex-shrink-0 border border-blue-400"
        >
          <span>মাসিক প্যাকেজগুলো দেখুন</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Option 1: New Booking */}
        <div className="bg-white border border-blue-300/80 p-5 rounded-lg space-y-2 flex items-center gap-4 transition-all hover:border-blue-300">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              New Booking (এককালীন / অন-ডিমান্ড)
            </h4>
            <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-1">
              হঠাৎ জরুরি প্রয়োজনে, কোনো ইভেন্টের আগে তাৎক্ষণিক ডিপ ক্লিন, বাসা শিফটিং বা অতিরিক্ত কাস্টম কাজের জন্য বুক করুন।
            </p>
          </div>
        </div>

        {/* Option 2: Subscription */}
        <div className="bg-white border border-emerald-200/80 p-5 rounded-lg space-y-2 flex items-center gap-4 transition-all hover:border-emerald-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CalendarIcon className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="ttext-base font-semibold text-slate-900 flex items-center gap-2">
              Subscription (মাসিক রুটিন প্ল্যান)
            </h4>
            <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-1">
              প্রতি সপ্তাহে বা মাসে ২-৪ বার ফিক্সড শিডিউলে বাসা বা অফিস নিয়মিত পরিষ্কার রাখতে সবচেয়ে সাশ্রয়ী মাসিক প্ল্যান বেছে নিন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
