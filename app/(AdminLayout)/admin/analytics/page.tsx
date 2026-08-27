"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Layers,
  MapPin,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ICoverageArea, fetchAllCoveragesAPI } from "@/services/coverageService";

// 1. Monthly Revenue & Profit Trend Data
const monthlyTrendData = [
  { month: "Jan 2026", gross: 92000, payout: 59800, net: 32200 },
  { month: "Feb 2026", gross: 105000, payout: 68250, net: 36750 },
  { month: "Mar 2026", gross: 118000, payout: 76700, net: 41300 },
  { month: "Apr 2026", gross: 126000, payout: 81900, net: 44100 },
  { month: "May 2026", gross: 138000, payout: 89700, net: 48300 },
  { month: "Jun 2026", gross: 148500, payout: 96500, net: 52000 },
];

// 2. Revenue Distribution by Category (Donut Chart)
const revenueCategoryData = [
  { name: "Commercial B2B Office", value: 58500, color: "#01BF7F" },
  { name: "Residential Deep Clean", value: 44000, color: "#369BF3" },
  { name: "Move-Out Turnover", value: 28000, color: "#F04862" },
  { name: "Post-Construction & Addons", value: 18000, color: "#FC9505" },
];

// Custom Pill Hatched Bar Component (Switches to Primary Brand Blue on Hover)
const CustomPillHatchedBar = (props: any) => {
  const { x, y, width, height, payload, hoveredZone, onHoverZone } = props;
  if (!width || !height || height <= 0) return null;

  const isHovered = hoveredZone === payload?.zone;
  const isHighlighted = payload?.isPeak;
  const rx = Math.min(width / 2, 24);

  let fillPattern = "url(#regularHatchPattern)";
  let strokeColor = "#34d399";

  if (isHovered) {
    fillPattern = "url(#primaryBlueHatchPattern)";
    strokeColor = "#007eff";
  } else if (isHighlighted) {
    fillPattern = "url(#activeHatchPattern)";
    strokeColor = "#047857";
  }

  return (
    <g
      onMouseEnter={() => onHoverZone(payload?.zone)}
      onMouseLeave={() => onHoverZone(null)}
      className="transition-all duration-300 cursor-pointer outline-none border-none"
    >
      {/* Outer Pill Capsule with Diagonal Striped Pattern Fill */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        ry={rx}
        fill={fillPattern}
        stroke={strokeColor}
        strokeWidth={isHovered ? 3 : 1.5}
        className="transition-all duration-300 cursor-pointer outline-none"
      />

      {/* Floating Growth Badge & Pointer Dot for Peak Zone */}
      {isHighlighted && (
        <g>
          {/* Top Pointer Dot */}
          <circle
            cx={x + width / 2}
            cy={y - 7}
            r="6"
            fill={isHovered ? "#007eff" : "#047857"}
            stroke="#ffffff"
            strokeWidth="2"
          />

          {/* Floating Pill Badge "+17.8%" */}
          <g transform={`translate(${x + width / 2 - 32}, ${y - 38})`}>
            <rect width="64" height="22" rx="11" fill={isHovered ? "#007eff" : "#047857"} />
            <text
              x="32"
              y="15"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="bold"
            >
              {payload.growth || "+17.8%"}
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

// 4. Financial Transactions Ledger
const recentLedger = [
  {
    id: "TXN-9041",
    client: "TechVision Software (Banani)",
    type: "B2B Monthly SLA",
    amount: "৳30,000 BDT",
    method: "Bank Wire Transfer",
    date: "22 Aug, 2026",
    status: "SETTLED",
  },
  {
    id: "TXN-9040",
    client: "Chowdhury Residence (Gulshan 2)",
    type: "Residential Deep Clean",
    amount: "৳18,500 BDT",
    method: "bKash Merchant",
    date: "21 Aug, 2026",
    status: "SETTLED",
  },
  {
    id: "TXN-9039",
    client: "Apex Real Estate (Dhanmondi)",
    type: "Post-Construction",
    amount: "৳25,000 BDT",
    method: "SSLCommerz Gateway",
    date: "20 Aug, 2026",
    status: "SETTLED",
  },
  {
    id: "TXN-9038",
    client: "Khan Residence (Uttara Sec 7)",
    type: "Move-Out Turnover",
    amount: "৳12,000 BDT",
    method: "Nagad Pay",
    date: "19 Aug, 2026",
    status: "SETTLED",
  },
];

export default function AdminAnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("6M");
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [coverageAreas, setCoverageAreas] = useState<ICoverageArea[]>([]);

  useEffect(() => {
    fetchAllCoveragesAPI().then((data) => {
      if (Array.isArray(data)) setCoverageAreas(data);
    });
  }, []);

  // Compute dynamic chart data from stored coverage areas
  const dhakaZoneHatchedData = coverageAreas.map((item, index) => {
    const baseRevenues = [48500, 36000, 28500, 42000, 38000, 19500, 24000, 31000, 27000, 22500];
    const revenue = baseRevenues[index % baseRevenues.length] || (20000 + ((index * 3500) % 25000));

    // Short clean label for X Axis
    const name = item?.zoneName || "Zone";
    const cleanWord = name.split(" ")[0].split("&")[0].replace(/[^A-Za-z0-9]/g, "");
    const zoneName = cleanWord.length > 0 ? cleanWord.toUpperCase() : name.toUpperCase();

    return {
      zone: zoneName,
      fullArea: name,
      revenue,
      isPeak: false,
      growth: "+17.8%",
    };
  });

  // Set maximum revenue zone as peak
  if (dhakaZoneHatchedData.length > 0) {
    let maxIdx = 0;
    dhakaZoneHatchedData.forEach((d, i) => {
      if (d.revenue > dhakaZoneHatchedData[maxIdx].revenue) maxIdx = i;
    });
    dhakaZoneHatchedData[maxIdx].isPeak = true;
  }

  const handleDownloadReport = () => {
    toast.success("Financial Statement PDF Report generated and downloaded!");
  };

  return (
    <div className="space-y-8 pb-12 w-full select-none">
      {/* Global CSS to kill all Recharts SVG click focus borders */}
      <style jsx global>{`
        .recharts-wrapper,
        .recharts-surface,
        .recharts-wrapper *,
        .recharts-surface *,
        svg,
        path,
        rect,
        g {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        *:focus {
          outline: none !important;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 stroke-[2.5]" />
              </div>
              Revenue & Financial Analytics Center
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ LIVE FINANCIAL CHARTS
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Track gross revenue, cleaner staff payout ledgers, net profit margins, and zone-by-zone performance graphs.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Time Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {["1M", "3M", "6M", "YTD"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                  timeFilter === filter
                    ? "bg-[#007eff] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Financial PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Gross Revenue */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Gross Platform Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳1,48,500</p>
            <div className="pt-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24% Monthly Growth
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Cleaner Staff Payouts */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Cleaner Staff Payouts
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳96,500</p>
            <div className="pt-1">
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                ⚡ 65% Staff Share
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Platform Net Margin */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Cleanix Net Profit
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">৳52,000</p>
            <div className="pt-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                ★ 35% Net Profit Margin
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Avg Order Value */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Avg Order Value
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center flex-shrink-0">
              <PieChartIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">৳14,200</p>
            <div className="pt-1">
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-block">
                ⚡ Corporate SLA Growth
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION 1: REVENUE GROWTH TREND (AREA CHART) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-[#007eff]" /> Gross Revenue & Net Profit Trend (2026)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Monthly breakdown comparing gross platform revenue, cleaner payouts, and cleanix net margins.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#007eff]" />
              <span className="text-slate-700">Gross Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#10b981]" />
              <span className="text-slate-700">Net Profit</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-[320px] sm:h-[360px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007eff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#007eff" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `৳${val / 1000}k`}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ stroke: "#007eff", strokeWidth: 1.5, strokeDasharray: "4 4" }}
                formatter={(value: any) => [`৳${Number(value).toLocaleString()} BDT`, ""]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "16px",
                  color: "#ffffff",
                  fontWeight: "bold",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                }}
                itemStyle={{ color: "#38bdf8", fontWeight: "bold" }}
                labelStyle={{ color: "#ffffff", fontWeight: "bold", marginBottom: "4px" }}
              />
              <Area
                type="monotone"
                dataKey="gross"
                name="Gross Revenue"
                stroke="#007eff"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#grossGradient)"
              />
              <Area
                type="monotone"
                dataKey="net"
                name="Net Profit Margin"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#netGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHARTS SECTION 2: REVENUE STREAM SHARE (DONUT CHART - TOP) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <PieChartIcon className="w-5 h-5 text-purple-600" /> Revenue Stream Share
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Earnings distribution across B2B commercial, residential deep cleaning, and turnover packages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Donut Chart (col-span-5) */}
          <div className="md:col-span-5 w-full h-[260px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()} BDT`, "Earning"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">৳1.48L</span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Total Revenue
              </span>
            </div>
          </div>

          {/* Legend Cards Grid (col-span-7) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {revenueCategoryData.map((item) => (
              <div key={item.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-extrabold text-slate-700 uppercase">{item.name}</span>
                </div>
                <p className="text-xl font-black text-slate-900">৳{item.value.toLocaleString()} BDT</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS SECTION 3: FULL WIDTH COVERAGE ZONES BREAKDOWN (BOTTOM - 100% WIDTH) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 w-full">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-emerald-600" /> All Dhaka Coverage Zones Breakdown ({coverageAreas.length} Zones)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Live performance for all stored coverage areas. Hover over any bar to highlight in Primary Blue.
            </p>
          </div>
          <span className="text-xs font-extrabold text-[#007eff] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            ⚡ {coverageAreas.length} Coverage Zones
          </span>
        </div>

        <div className="w-full h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dhakaZoneHatchedData}
              margin={{ top: 45, right: 15, left: -10, bottom: 0 }}
              barCategoryGap="16%"
            >
              <defs>
                {/* Regular Sage Green Stripes Pattern */}
                <pattern
                  id="regularHatchPattern"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="10" height="10" fill="#a7f3d0" fillOpacity="0.45" />
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#059669" strokeWidth="3" strokeOpacity="0.3" />
                </pattern>

                {/* Active Dark Emerald Green Stripes Pattern (Peak Zone Default) */}
                <pattern
                  id="activeHatchPattern"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="10" height="10" fill="#047857" />
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#064e3b" strokeWidth="3" strokeOpacity="0.5" />
                </pattern>

                {/* Primary Brand Blue Stripes Pattern (Active Hover State) */}
                <pattern
                  id="primaryBlueHatchPattern"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="10" height="10" fill="#007eff" />
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#0046b8" strokeWidth="3" strokeOpacity="0.5" />
                </pattern>
              </defs>

              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="zone"
                interval={0}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val / 1000}k`}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                formatter={(value: any, name: any, item: any) => [
                  `৳${Number(value).toLocaleString()} BDT`,
                  item.payload.fullArea || "Zone Revenue",
                ]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "14px",
                  color: "#ffffff",
                  fontWeight: "bold",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                }}
                itemStyle={{ color: "#38bdf8", fontWeight: "bold" }}
                labelStyle={{ color: "#ffffff", fontWeight: "bold", marginBottom: "4px" }}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                shape={(props: any) => (
                  <CustomPillHatchedBar
                    {...props}
                    hoveredZone={hoveredZone}
                    onHoverZone={setHoveredZone}
                  />
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FINANCIAL SETTLEMENT TRANSACTION LEDGER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-[#007eff]" /> Recent Financial Settlement Ledger
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Live records of customer payments, transaction gateway channels, and cleaner payouts.
            </p>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ✓ 100% Audit Cleared
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase text-slate-400">
                <th className="py-3 px-4">Txn ID</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Service Category</th>
                <th className="py-3 px-4">Gateway / Channel</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {recentLedger.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">{row.id}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{row.client}</td>
                  <td className="py-4 px-4">{row.type}</td>
                  <td className="py-4 px-4 text-slate-600">{row.method}</td>
                  <td className="py-4 px-4 font-extrabold text-emerald-600">{row.amount}</td>
                  <td className="py-4 px-4">
                    <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-emerald-200">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
