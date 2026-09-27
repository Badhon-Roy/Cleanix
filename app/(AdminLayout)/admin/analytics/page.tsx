"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
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
import { fetchAdminBookingsAPI } from "@/services/bookingService";
import { fetchActiveServicesAPI } from "@/services/serviceCategoryService";

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

          {/* Floating Pill Badge */}
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

// Custom XAxis Tick for Coverage Area Names with clean 2-line rendering
const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const rawText: string = payload?.value || "";

  // Split into 2 lines if longer than 11 characters or has multiple words
  const words = rawText.split(" ");
  let line1 = rawText;
  let line2 = "";

  if (rawText.length > 11 && words.length > 1) {
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(" ");
    line2 = words.slice(mid).join(" ");
  }

  return (
    <g transform={`translate(${x},${y + 8})`}>
      <text
        x={0}
        y={0}
        textAnchor="middle"
        fill="#334155"
        fontSize={10.5}
        fontWeight={700}
        className="select-none"
      >
        <tspan x={0} dy="0">
          {line1}
        </tspan>
        {line2 && (
          <tspan x={0} dy="13" fill="#64748b" fontSize={9.5} fontWeight={600}>
            {line2}
          </tspan>
        )}
      </text>
    </g>
  );
};

export default function AdminAnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("6M");
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [coverageAreas, setCoverageAreas] = useState<ICoverageArea[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const loadAnalyticsData = useCallback(async (showToast = false) => {
    try {
      const [covData, bookData, srvData] = await Promise.all([
        fetchAllCoveragesAPI({ isActive: true }),
        fetchAdminBookingsAPI(),
        fetchActiveServicesAPI(),
      ]);

      if (Array.isArray(covData)) {
        setCoverageAreas(covData);
      }
      if (bookData?.success && Array.isArray(bookData?.data)) {
        setBookings(bookData.data);
      } else if (Array.isArray(bookData)) {
        setBookings(bookData);
      }
      if (srvData?.success && Array.isArray(srvData?.data)) {
        setServiceCategories(srvData.data);
      } else if (Array.isArray(srvData)) {
        setServiceCategories(srvData);
      }
      if (showToast) toast.success("Analytics data synced!");
    } catch (err) {
      console.error("Failed to load analytics data:", err);
      if (showToast) toast.error("Failed to load analytics data");
    }
  }, []);

  useEffect(() => {
    loadAnalyticsData(false);

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const handleRefresh = () => {
      loadAnalyticsData(false);
    };

    socket.on("booking_created", handleRefresh);
    socket.on("booking_updated", handleRefresh);
    socket.on("coverage_updated", handleRefresh);
    socket.on("team_assignment_updated", handleRefresh);
    socket.on("service_category_created", handleRefresh);
    socket.on("service_category_updated", handleRefresh);

    return () => {
      socket.off("booking_created", handleRefresh);
      socket.off("booking_updated", handleRefresh);
      socket.off("coverage_updated", handleRefresh);
      socket.off("team_assignment_updated", handleRefresh);
      socket.off("service_category_created", handleRefresh);
      socket.off("service_category_updated", handleRefresh);
      socket.disconnect();
    };
  }, [loadAnalyticsData]);

  // Active bookings (non-cancelled) filtered by selected time range
  const filteredBookings = useMemo(() => {
    const valid = bookings.filter((b: any) => b.status !== "CANCELLED" && !b.isDeleted);
    const now = new Date();

    if (timeFilter === "1M") {
      const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return valid.filter((b: any) => {
        const d = new Date(b.scheduledDate || b.createdAt || 0);
        return !isNaN(d.getTime()) && d >= past30Days;
      });
    }

    if (timeFilter === "3M") {
      const past90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return valid.filter((b: any) => {
        const d = new Date(b.scheduledDate || b.createdAt || 0);
        return !isNaN(d.getTime()) && d >= past90Days;
      });
    }

    if (timeFilter === "6M") {
      const past180Days = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      return valid.filter((b: any) => {
        const d = new Date(b.scheduledDate || b.createdAt || 0);
        return !isNaN(d.getTime()) && d >= past180Days;
      });
    }

    if (timeFilter === "YTD") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return valid.filter((b: any) => {
        const d = new Date(b.scheduledDate || b.createdAt || 0);
        return !isNaN(d.getTime()) && d >= startOfYear;
      });
    }

    return valid;
  }, [bookings, timeFilter]);

  // 1. Gross Revenue & KPIs (Dynamically calculated based on timeFilter)
  const grossRevenue = useMemo(() => {
    return filteredBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  }, [filteredBookings]);

  const cleanerPayouts = Math.round(grossRevenue * 0.65);
  const netProfit = grossRevenue - cleanerPayouts;
  const avgOrderValue =
    filteredBookings.length > 0 ? Math.round(grossRevenue / filteredBookings.length) : 0;

  // 2. Dynamic Dhaka Coverage Zones Breakdown (Consolidated Unique Zones)
  const dhakaZoneHatchedData = useMemo(() => {
    if (!coverageAreas || coverageAreas.length === 0) return [];

    const totalRev = grossRevenue;

    // Use a Map to aggregate zones by their exact coverage area zoneName
    const zoneMap = new Map<
      string,
      {
        zone: string;
        fullArea: string;
        areasIncluded: Set<string>;
        zoneIds: Set<string>;
      }
    >();

    coverageAreas.forEach((item) => {
      if (item.isActive === false || item.isDeleted) return;

      const zoneIdStr = String(item.id || item._id || "");
      const name = (item?.zoneName || "Coverage Zone").trim();
      const areasIncluded = Array.isArray(item.areasIncluded) ? item.areasIncluded : [];

      const zoneKey = name;

      if (!zoneMap.has(zoneKey)) {
        zoneMap.set(zoneKey, {
          zone: name,
          fullArea: name,
          areasIncluded: new Set(areasIncluded),
          zoneIds: new Set(zoneIdStr ? [zoneIdStr] : []),
        });
      } else {
        const existing = zoneMap.get(zoneKey)!;
        if (zoneIdStr) existing.zoneIds.add(zoneIdStr);
        areasIncluded.forEach((a) => existing.areasIncluded.add(a));
      }
    });

    // Match filtered bookings to each unique consolidated zone
    const data = Array.from(zoneMap.values()).map((z) => {
      const zoneBookings = filteredBookings.filter((b: any) => {
        const bCovId = String(b.coverageArea?._id || b.coverageArea?.id || b.coverageArea || "");
        if (bCovId && z.zoneIds.has(bCovId)) return true;

        const bAddr = String(b.address || "").toLowerCase();
        if (z.zone && bAddr.includes(z.zone.toLowerCase())) return true;
        if (z.fullArea && bAddr.includes(z.fullArea.toLowerCase())) return true;
        for (const area of z.areasIncluded) {
          if (area && bAddr.includes(area.toLowerCase())) return true;
        }
        return false;
      });

      // Sum exact booking price for this consolidated zone
      const calculatedRevenue = zoneBookings.reduce(
        (sum, b) => sum + (Number(b.totalAmount) || 0),
        0
      );

      const sharePercent =
        totalRev > 0 ? ((calculatedRevenue / totalRev) * 100).toFixed(1) : "0.0";

      const subAreasList = Array.from(z.areasIncluded);

      return {
        zone: z.zone,
        fullArea: z.fullArea,
        areasText: subAreasList.length > 0 ? subAreasList.slice(0, 3).join(", ") : z.fullArea,
        revenue: calculatedRevenue,
        bookingsCount: zoneBookings.length,
        isPeak: false,
        growth: `+${sharePercent}%`,
      };
    });

    // Mark the peak zone (highest revenue)
    if (data.length > 0) {
      let maxIdx = 0;
      data.forEach((d, i) => {
        if (d.revenue > data[maxIdx].revenue) maxIdx = i;
      });
      if (data[maxIdx].revenue > 0) {
        data[maxIdx].isPeak = true;
      }
    }

    return data;
  }, [coverageAreas, filteredBookings, grossRevenue]);

  // Helper to extract full dynamic service category name strictly from database data
  const getFullServiceName = useCallback(
    (b: any): string => {
      // 1. If populated object on booking
      if (typeof b?.serviceType === "object" && b.serviceType !== null) {
        if (b.serviceType.title) return b.serviceType.title;
        if (b.serviceType.category) return b.serviceType.category;
        if (b.serviceType.badge) return b.serviceType.badge;
      }
      // 2. If ID or slug string, lookup in dynamic database service categories
      if (typeof b?.serviceType === "string" && b.serviceType.length > 0) {
        const found = serviceCategories.find(
          (s) =>
            String(s._id) === String(b.serviceType) ||
            s.slug === b.serviceType ||
            s.category === b.serviceType
        );
        if (found?.title) return found.title;
        if (found?.category) return found.category;
        return b.serviceType;
      }
      // 3. Fallback to first available category from database if present
      if (serviceCategories.length > 0 && serviceCategories[0].title) {
        return serviceCategories[0].title;
      }
      return "General Cleaning";
    },
    [serviceCategories]
  );

  // 3. Dynamic Revenue Distribution by Category strictly based on Database Data (Donut Chart)
  const dynamicCategoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    const colors = [
      "#01BF7F",
      "#369BF3",
      "#F04862",
      "#FC9505",
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
      "#14B8A6",
      "#6366F1",
    ];

    // Seed map with all active service categories fetched from database
    serviceCategories.forEach((s: any) => {
      const name = s.title || s.category || s.badge;
      if (name) {
        categoryMap.set(name, 0);
      }
    });

    // Sum revenue from all filtered bookings in the selected time range
    filteredBookings.forEach((b: any) => {
      const catName = getFullServiceName(b);
      const current = categoryMap.get(catName) || 0;
      categoryMap.set(catName, current + (Number(b.totalAmount) || 0));
    });

    if (categoryMap.size === 0) {
      return [];
    }

    let colorIdx = 0;
    const result: { name: string; value: number; color: string }[] = [];
    categoryMap.forEach((val, key) => {
      result.push({
        name: key,
        value: val,
        color: colors[colorIdx % colors.length],
      });
      colorIdx++;
    });

    return result;
  }, [serviceCategories, filteredBookings, getFullServiceName]);

  // 4. Dynamic Time Trend Data based on timeFilter
  const dynamicMonthlyTrendData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const trendMap = new Map<string, number>();

    if (timeFilter === "1M") {
      // 4 discrete weeks of the last 30 days
      trendMap.set("Week 1", 0);
      trendMap.set("Week 2", 0);
      trendMap.set("Week 3", 0);
      trendMap.set("Week 4", 0);

      const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();
      filteredBookings.forEach((b: any) => {
        const d = new Date(b.scheduledDate || b.createdAt || 0).getTime();
        if (!isNaN(d) && d >= past30Days) {
          const diffDays = Math.floor((now.getTime() - d) / (1000 * 60 * 60 * 24));
          const weekIdx = Math.max(1, 4 - Math.min(3, Math.floor(diffDays / 7)));
          const key = `Week ${weekIdx}`;
          trendMap.set(key, (trendMap.get(key) || 0) + (Number(b.totalAmount) || 0));
        }
      });
    } else if (timeFilter === "3M") {
      // Last 3 months
      for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        trendMap.set(key, 0);
      }
      filteredBookings.forEach((b: any) => {
        const dateStr = b.scheduledDate || b.createdAt;
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            if (trendMap.has(key)) {
              trendMap.set(key, (trendMap.get(key) || 0) + (Number(b.totalAmount) || 0));
            }
          }
        }
      });
    } else if (timeFilter === "YTD") {
      // From Jan of current year to current month
      for (let m = 0; m <= now.getMonth(); m++) {
        const key = `${monthNames[m]} ${now.getFullYear()}`;
        trendMap.set(key, 0);
      }
      filteredBookings.forEach((b: any) => {
        const dateStr = b.scheduledDate || b.createdAt;
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime()) && d.getFullYear() === now.getFullYear()) {
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            if (trendMap.has(key)) {
              trendMap.set(key, (trendMap.get(key) || 0) + (Number(b.totalAmount) || 0));
            }
          }
        }
      });
    } else {
      // Default: 6M
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        trendMap.set(key, 0);
      }
      filteredBookings.forEach((b: any) => {
        const dateStr = b.scheduledDate || b.createdAt;
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            if (trendMap.has(key)) {
              trendMap.set(key, (trendMap.get(key) || 0) + (Number(b.totalAmount) || 0));
            }
          }
        }
      });
    }

    const result: { period: string; gross: number; payout: number; net: number }[] = [];
    trendMap.forEach((gross, period) => {
      const payout = Math.round(gross * 0.65);
      const net = gross - payout;
      result.push({ period, gross, payout, net });
    });

    return result;
  }, [filteredBookings, timeFilter]);

  // 5. Recent Dynamic Transactions Ledger (Filtered by time range)
  const recentDynamicLedger = useMemo(() => {
    if (filteredBookings.length === 0) return [];
    return filteredBookings.slice(0, 10).map((b: any) => {
      const ref = b.bookingRef || `#CLN-${String(b._id).slice(-4)}`;
      const clientName = b.user?.name || "Registered Customer";
      const zone = b.coverageArea?.zoneName ? ` (${b.coverageArea.zoneName.split(" ")[0]})` : "";
      const type = getFullServiceName(b);
      const amount = `৳${(Number(b.totalAmount) || 0).toLocaleString()} BDT`;
      const method = b.paymentMethod || "bKash";
      const date = b.scheduledDate
        ? new Date(b.scheduledDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Recent";
      const status = b.paymentStatus === "PAID" ? "SETTLED" : b.status === "COMPLETED" ? "SETTLED" : "PENDING";

      return {
        id: ref,
        client: `${clientName}${zone}`,
        type,
        amount,
        method,
        date,
        status,
      };
    });
  }, [filteredBookings, getFullServiceName]);

  // Workable Dynamic PDF Exporter (Vector jsPDF + autoTable)
  const handleDownloadReport = async () => {
    setIsExportingPdf(true);
    const toastId = toast.loading("Generating Cleanix Financial Statement PDF...");

    try {
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Helper to clean Bengali / Unicode symbols for jsPDF standard font rendering
      const cleanPdfText = (str: any): string => {
        if (!str) return "";
        return String(str)
          .replace(/[৳]/g, "BDT ")
          .replace(/[\u0980-\u09FF]/g, "") // Strip Bengali Unicode range so Helvetica renders clean Latin text
          .replace(/\(\s*\)/g, "") // Strip empty parentheses
          .replace(/\s{2,}/g, " ")
          .trim();
      };

      const periodLabel =
        timeFilter === "1M"
          ? "Past 1 Month (30 Days)"
          : timeFilter === "3M"
          ? "Past 3 Months (90 Days)"
          : timeFilter === "YTD"
          ? `Year-to-Date (${new Date().getFullYear()})`
          : "Past 6 Months (180 Days)";

      // Top Header Banner
      doc.setFillColor(0, 24, 55); // Brand Navy
      doc.rect(0, 0, 210, 34, "F");

      // Cleanix Logo Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("CLEANIX", 14, 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(147, 197, 253);
      doc.text("Professional Cleaning & Financial Analytics Center", 14, 26);

      // Report Sub-header meta on right
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("FINANCIAL STATEMENT REPORT", 196, 16, { align: "right" });

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(203, 213, 225);
      doc.text(`Time Filter: ${periodLabel}`, 196, 23, { align: "right" });
      doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`, 196, 29, {
        align: "right",
      });

      // Executive KPI Highlights Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 40, 182, 28, 3, 3, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("GROSS REVENUE", 20, 48);
      doc.text("STAFF PAYOUT (65%)", 66, 48);
      doc.text("NET PROFIT (35%)", 114, 48);
      doc.text("ACTIVE BOOKINGS", 158, 48);

      doc.setFontSize(12.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`BDT ${grossRevenue.toLocaleString()}`, 20, 59);
      doc.text(`BDT ${cleanerPayouts.toLocaleString()}`, 66, 59);
      doc.setTextColor(5, 150, 105);
      doc.text(`BDT ${netProfit.toLocaleString()}`, 114, 59);
      doc.setTextColor(0, 126, 255);
      doc.text(`${filteredBookings.length} Bookings`, 158, 59);

      // Section 1: Coverage Zones Breakdown Table
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 24, 55);
      doc.text("1. Dhaka Coverage Zones Revenue Breakdown", 14, 76);

      const zoneRows = dhakaZoneHatchedData.map((z, idx) => [
        `${idx + 1}`,
        cleanPdfText(z.zone),
        cleanPdfText(z.areasText) || "All Sub-areas",
        `${z.bookingsCount}`,
        `BDT ${Number(z.revenue).toLocaleString()}`,
        z.growth,
      ]);

      autoTable(doc, {
        startY: 80,
        head: [["#", "Coverage Zone", "Included Sub-areas", "Orders", "Total Revenue", "Share"]],
        body: zoneRows,
        theme: "striped",
        headStyles: {
          fillColor: [0, 24, 55],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [30, 41, 59],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { left: 14, right: 14 },
      });

      // Section 2: Recent Transactions Settlement Ledger
      const currentY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 170;

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 24, 55);
      doc.text("2. Settlement Transaction Ledger", 14, currentY);

      const txnRows = recentDynamicLedger.map((t) => [
        cleanPdfText(t.id),
        cleanPdfText(t.client),
        cleanPdfText(t.type) || "COMMERCIAL OFFICE CLEANING",
        cleanPdfText(t.method).toUpperCase(),
        `BDT ${cleanPdfText(t.amount).replace(/BDT/g, "").trim()}`,
        cleanPdfText(t.date),
        cleanPdfText(t.status),
      ]);

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Txn Ref", "Client & Zone", "Full Service Category Name", "Channel", "Amount", "Date", "Status"]],
        body: txnRows.length > 0 ? txnRows : [["-", "No transactions in this period", "-", "-", "-", "-", "-"]],
        theme: "grid",
        headStyles: {
          fillColor: [0, 126, 255],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [30, 41, 59],
        },
        margin: { left: 14, right: 14 },
      });

      // Footer with Branding & Page Numbers
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(148, 163, 184);
        doc.text(
          "Cleanix Services Bangladesh Ltd. | Official Financial & Revenue Analytics Statement | support@cleanix.com | +880 1774-500815",
          14,
          290
        );
        doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: "right" });
      }

      // Save and trigger file download
      doc.save(`Cleanix_Financial_Statement_${timeFilter}_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Financial Statement PDF downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate Financial PDF report", { id: toastId });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const trendPeriodLabel =
    timeFilter === "1M"
      ? "Past 30 Days (Weekly)"
      : timeFilter === "3M"
      ? "Past 3 Months"
      : timeFilter === "YTD"
      ? `Year-to-Date (${new Date().getFullYear()})`
      : "Past 6 Months";

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
              Revenue &amp; Financial Analytics Center
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
          <button
            type="button"
            onClick={() => loadAnalyticsData(true)}
            className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#007eff]" />
            <span>Sync</span>
          </button>

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
            disabled={isExportingPdf}
            className="px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-60"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>{isExportingPdf ? "Generating PDF..." : "Export Financial PDF"}</span>
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
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ৳{grossRevenue.toLocaleString()}
            </p>
            <div className="pt-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {filteredBookings.length} Active Bookings ({timeFilter})
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
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ৳{cleanerPayouts.toLocaleString()}
            </p>
            <div className="pt-1">
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                ⚡ 65% Staff &amp; Team Share
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
            <p className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
              ৳{netProfit.toLocaleString()}
            </p>
            <div className="pt-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                ★ 35% Net Margin
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
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ৳{avgOrderValue.toLocaleString()}
            </p>
            <div className="pt-1">
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-block">
                ⚡ Real-time Order Average
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
              <TrendingUp className="w-5 h-5 text-[#007eff]" /> Gross Revenue &amp; Net Profit Trend ({trendPeriodLabel})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Breakdown comparing gross platform revenue, cleaner payouts, and cleanix net margins for the selected {timeFilter} period.
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
            <AreaChart data={dynamicMonthlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `৳${val >= 1000 ? `${val / 1000}k` : val}`}
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
            <PieChartIcon className="w-5 h-5 text-[#007eff]" /> Revenue Distribution by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Real-time percentage contributions across core residential, commercial B2B, move-out, and addon service streams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
          {/* Donut Chart (col-span-5) */}
          <div className="md:col-span-5 h-[260px] relative flex items-center justify-center">
            {dynamicCategoryData.length === 0 ? (
              <div className="text-center text-slate-400 font-medium text-xs">
                No active service categories found in database.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      dynamicCategoryData.every((d) => d.value === 0)
                        ? dynamicCategoryData.map((d) => ({ ...d, value: 1 }))
                        : dynamicCategoryData
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {dynamicCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => [
                      `৳${Number(item?.payload?.value !== undefined && !dynamicCategoryData.every((d) => d.value === 0) ? item.payload.value : 0).toLocaleString()} BDT`,
                      "Revenue",
                    ]}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                ৳{grossRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Total Revenue
              </span>
            </div>
          </div>

          {/* Legend Cards Grid (col-span-7) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dynamicCategoryData.length === 0 ? (
              <div className="col-span-2 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-400 font-medium text-xs">
                No category records available in database.
              </div>
            ) : (
              dynamicCategoryData.map((item) => (
                <div key={item.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-extrabold text-slate-700 uppercase truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl font-black text-slate-900">৳{item.value.toLocaleString()} BDT</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CHARTS SECTION 3: FULL WIDTH COVERAGE ZONES BREAKDOWN (BOTTOM - 100% WIDTH) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 w-full">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-emerald-600" /> All Dhaka Coverage Zones Breakdown ({dhakaZoneHatchedData.length} Zones)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Live performance &amp; total booked revenue for all stored coverage areas. Hover over any bar to highlight in Primary Blue.
            </p>
          </div>
          <span className="text-xs font-extrabold text-[#007eff] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            ⚡ {dhakaZoneHatchedData.length} Coverage Zones
          </span>
        </div>

        <div className="w-full h-[390px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dhakaZoneHatchedData}
              margin={{ top: 45, right: 15, left: -10, bottom: 25 }}
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
                height={45}
                tick={<CustomXAxisTick />}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `৳${val >= 1000 ? `${val / 1000}k` : val}`}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl text-white space-y-1.5 z-50">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                            {data.zone}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                            {data.bookingsCount} {data.bookingsCount === 1 ? "Booking" : "Bookings"}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-200">
                          {data.fullArea}
                        </p>
                        {data.areasText && (
                          <p className="text-[11px] text-slate-400">
                            Sub-areas: {data.areasText}
                          </p>
                        )}
                        <p className="text-sm font-black text-emerald-400 pt-1.5 border-t border-slate-800 flex items-center justify-between gap-4">
                          <span>Total Booked:</span>
                          <span>৳{Number(data.revenue).toLocaleString()} BDT</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
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
            ✓ {recentDynamicLedger.length} Live Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase text-slate-400">
                <th className="py-3 px-4">Txn Ref</th>
                <th className="py-3 px-4">Client &amp; Zone</th>
                <th className="py-3 px-4">Full Service Category Name</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {recentDynamicLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No transaction records yet. New bookings will appear here in real time.
                  </td>
                </tr>
              ) : (
                recentDynamicLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{row.client}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 uppercase">
                          {row.type.includes("(") ? row.type.split("(")[0].trim() : row.type}
                        </span>
                        {row.type.includes("(") && (
                          <span className="text-[11px] text-[#007eff] font-medium">
                            ({row.type.split("(")[1]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-semibold uppercase">{row.method}</td>
                    <td className="py-4 px-4 font-extrabold text-emerald-600">{row.amount}</td>
                    <td className="py-4 px-4 text-slate-500 font-medium whitespace-nowrap">{row.date}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border ${
                          row.status === "SETTLED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
