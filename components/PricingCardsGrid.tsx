"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { IPlan, fetchAllPlansAPI } from "@/services/planService";
import { io, Socket } from "socket.io-client";

export function PricingStarIcon() {
  return (
    <div className="w-8 h-8 text-[#007eff] flex items-center justify-center mb-4">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
      </svg>
    </div>
  );
}

export interface PricingPlan {
  id: string;
  name: string;
  subtitleBn: string;
  price: string;
  pricePeriodBn: string;
  popular?: boolean;
  popularLabel?: string;
  vipBadge?: string;
  ctaText: string;
  ctaHref?: string;
  features: string[];
}

interface PricingCardsGridProps {
  currentPlanId?: string;
  onSelectPlan?: (planId: string) => void;
  showCurrentPlanBadge?: boolean;
  initialPlans?: IPlan[];
}

export default function PricingCardsGrid({
  currentPlanId,
  onSelectPlan,
  showCurrentPlanBadge = false,
  initialPlans,
}: PricingCardsGridProps) {
  const [plans, setPlans] = useState<IPlan[]>(initialPlans || []);
  const [loading, setLoading] = useState(!initialPlans || initialPlans.length === 0);
  const socketRef = useRef<Socket | null>(null);

  const loadPlans = useCallback(async () => {
    try {
      const data = await fetchAllPlansAPI(true);
      setPlans(data);
    } catch (err) {
      console.error("Error fetching pricing cards:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("plan_updated", () => {
      loadPlans();
    });

    return () => {
      socket.off("plan_updated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loadPlans]);

  if (loading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 w-full">
        <Loader2 className="w-8 h-8 text-[#007eff] animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {plans.map((plan) => {
        const normCurrent = (currentPlanId || "").toLowerCase();
        const normPlanId = (plan.id || "").toLowerCase();
        const normPlanTitle = (plan.title || "").toLowerCase();

        const isCurrentPlan =
          normCurrent !== "" &&
          (normCurrent === normPlanId || normCurrent === normPlanTitle);
        const isPopular = plan.isPopular;

        return (
          <div
            key={plan.id || plan._id}
            className={`rounded-3xl p-7 sm:p-9 bg-white flex flex-col justify-between relative transition-all duration-300 ${
              isPopular
                ? "border-2 border-[#007eff] md:-translate-y-2 z-10"
                : "border border-slate-200/90"
            }`}
          >
            {/* Top Badges */}
            {isPopular && (
              <span className="bg-[#007eff] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full px-4 py-1.5 absolute -top-3.5 right-7 border border-blue-400">
                {plan.popularLabel || "★ MOST POPULAR"}
              </span>
            )}

            {plan.vipBadge && !isPopular && (
              <span className="border border-purple-500/60 text-purple-600 font-bold text-[10px] uppercase tracking-wider rounded-full px-4 py-1 absolute top-7 right-7 bg-purple-50">
                {plan.vipBadge}
              </span>
            )}

            {showCurrentPlanBadge && isCurrentPlan && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 font-extrabold text-[11px] uppercase tracking-wider rounded-full px-4 py-1 absolute top-7 right-7">
                ✓ YOUR ACTIVE PLAN
              </span>
            )}

            <div>
              <PricingStarIcon />

              <h3 className="text-[#001837] font-black text-2xl tracking-wide uppercase mb-1">
                {plan.title}
              </h3>

              <p
                className={`font-extrabold text-xs sm:text-sm mb-6 ${
                  isPopular ? "text-[#007eff]" : "text-slate-500"
                }`}
              >
                {plan.subtitleBn}
              </p>

              {/* Price */}
              <div className="flex items-baseline mb-6">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#001837] tracking-tight">
                  {plan.price}
                </span>
                <span className="text-slate-500 font-bold text-xs sm:text-sm ml-1">
                  {plan.pricePeriodBn || "/ মাস (Monthly)"}
                </span>
              </div>

              {/* Select Plan Action Button */}
              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-3.5 px-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-sm text-center mb-8 cursor-default flex items-center justify-center gap-2"
                >
                  <span>✓ Currently Active Plan</span>
                </button>
              ) : onSelectPlan ? (
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`font-semibold text-sm sm:text-base py-3.5 px-6 rounded-full w-full flex items-center justify-between transition-all duration-300 hover:scale-[1.02] mb-8 cursor-pointer ${
                    plan.title === "PREMIUM" || plan.id === "PREMIUM"
                      ? "bg-[#001837] hover:bg-[#0d274c] text-white border border-slate-800"
                      : "bg-[#007eff] hover:bg-[#0066ee] text-white border border-blue-400"
                  }`}
                >
                  <span>{plan.ctaText || "Select Plan"}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      plan.title === "PREMIUM" || plan.id === "PREMIUM"
                        ? "bg-[#007eff] text-white"
                        : "bg-white text-[#007eff]"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </button>
              ) : (
                <Link
                  href={`/subscribe?plan=${(plan.id || plan.title || "standard").toLowerCase()}`}
                  className={`font-semibold text-sm sm:text-base py-3.5 px-6 rounded-full w-full flex items-center justify-between transition-all duration-300 hover:scale-[1.02] mb-8 cursor-pointer ${
                    plan.title === "PREMIUM" || plan.id === "PREMIUM"
                      ? "bg-[#001837] hover:bg-[#0d274c] text-white border border-slate-800"
                      : "bg-[#007eff] hover:bg-[#0066ee] text-white border border-blue-400"
                  }`}
                >
                  <span>{plan.ctaText || "Select Plan"}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      plan.title === "PREMIUM" || plan.id === "PREMIUM"
                        ? "bg-[#007eff] text-white"
                        : "bg-white text-[#007eff]"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </Link>
              )}

              {/* Feature Checklist in Bengali */}
              <div className="space-y-3.5 border-t border-slate-100 pt-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#007eff] fill-[#007eff] text-white flex-shrink-0" />
                    <span className="text-[#001837] font-bold text-xs sm:text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
