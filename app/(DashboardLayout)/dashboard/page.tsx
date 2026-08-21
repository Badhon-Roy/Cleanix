import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
  FileText,
} from "lucide-react";
import LiveJobTracker from "@/components/dashboard/LiveJobTracker";

export const metadata: Metadata = {
  title: "Customer Dashboard | Cleanix Portal",
  description: "Manage your home and office cleaning bookings, track active cleaner teams in real-time, view invoices, and upgrade your subscription.",
};

export default function CustomerDashboardPage() {
  const recentBookings = [
    {
      id: "CLN-2026-8891",
      service: "Standard Home Deep Cleaning & Sanitization",
      date: "Today, 09:00 AM",
      location: "Gulshan-2, Dhaka",
      amount: "৳14,000",
      status: "EN_ROUTE",
      statusText: "En Route",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "CLN-2026-8210",
      service: "Carpet & Furniture Shampoo Wash",
      date: "14 Aug 2026",
      location: "Gulshan-2, Dhaka",
      amount: "৳3,500",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "CLN-2026-7901",
      service: "Weekly Office Sanitization",
      date: "07 Aug 2026",
      location: "Motijheel, Dhaka",
      amount: "৳14,000",
      status: "COMPLETED",
      statusText: "Completed",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d274c] to-slate-900 border border-slate-800 p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#007eff]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Customer VIP Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Tanvir Hasan! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Your next scheduled weekly visit is active today in <strong className="text-white">Gulshan-2</strong>. Cleaner Team Delta is en route.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/new-booking"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Book New Service</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards (Grid 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">12 Jobs</h3>
            <span className="text-[11px] text-emerald-600 font-bold">100% On-time completion</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#007eff] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Plan</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Standard</h3>
            <span className="text-[11px] text-blue-600 font-bold">৳14,000 / Month</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Visits Left</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">1 / 4 Visits</h3>
            <span className="text-[11px] text-amber-700 font-bold">Renews in 5 days</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Clean Area</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">4,800 SqFt</h3>
            <span className="text-[11px] text-slate-500 font-bold">Sanitized with Eco-chem</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Job Tracking Component */}
      <LiveJobTracker
        bookingNumber="CLN-2026-8891"
        serviceName="Standard Home Deep Cleaning & Anti-Bacterial Sanitization"
        address="House 42, Road 11, Block D, Gulshan-2, Dhaka"
      />

      {/* Grid: Subscription & Quick Addons (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Subscription Details (Col 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">My Active Subscription</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Standard Monthly Plan • 4 Weekly Deep Cleans</p>
            </div>
            <span className="text-lg font-extrabold text-[#007eff]">৳14,000 <span className="text-xs text-slate-400 font-normal">/mo</span></span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Monthly Usage: 3 of 4 visits used</span>
                <span className="text-[#007eff]">75% Complete</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div className="bg-gradient-to-r from-[#007eff] to-cyan-400 h-full rounded-full w-[75%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-medium">Next Scheduled Clean:</span>
                <strong className="text-slate-900 font-bold">Today at 09:00 AM</strong>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-medium">Billing Renewal:</span>
                <strong className="text-slate-900 font-bold">26 August 2026</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/dashboard/subscription"
              className="text-xs text-[#007eff] hover:underline font-extrabold flex items-center gap-1.5"
            >
              <span>Manage Subscription & Upgrade</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recommend Add-ons (Col 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Popular Add-On Upgrades
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Add these extra services to your upcoming clean at special subscriber discounts:
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors text-xs">
              <div>
                <p className="font-bold text-slate-900">Sofa & Carpet Steam Wash</p>
                <p className="text-[11px] text-slate-500 font-medium">Deep anti-allergen extraction</p>
              </div>
              <span className="font-extrabold text-amber-600">+৳1,500</span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors text-xs">
              <div>
                <p className="font-bold text-slate-900">Kitchen Oven & Chimney Care</p>
                <p className="text-[11px] text-slate-500 font-medium">Grease-free sparkling finish</p>
              </div>
              <span className="font-extrabold text-amber-600">+৳1,200</span>
            </div>
          </div>

          <Link
            href="/dashboard/new-booking"
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center border border-slate-200 transition-colors block"
          >
            Customize Service Add-Ons
          </Link>
        </div>
      </div>

      {/* Recent Bookings Table Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Recent Service History</h3>
            <p className="text-xs text-slate-500 font-medium">View past bookings, cleaner assignments, and receipts.</p>
          </div>

          <Link
            href="/dashboard/bookings"
            className="text-xs font-bold text-[#007eff] hover:underline flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="p-3.5 pl-4 font-bold">Booking Ref</th>
                <th className="p-3.5 font-bold">Service Type</th>
                <th className="p-3.5 font-bold">Date & Time</th>
                <th className="p-3.5 font-bold">Location</th>
                <th className="p-3.5 font-bold">Amount</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 text-right pr-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 pl-4 font-mono font-bold text-[#007eff]">{b.id}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">{b.service}</td>
                  <td className="p-3.5 text-slate-600 font-medium">{b.date}</td>
                  <td className="p-3.5 text-slate-600 font-medium">{b.location}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">{b.amount}</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${b.badgeClass}`}>
                      {b.statusText}
                    </span>
                  </td>
                  <td className="p-3.5 text-right pr-4 space-x-2">
                    <Link
                      href="/dashboard/invoices"
                      className="inline-flex items-center gap-1 text-[11px] text-[#007eff] hover:underline font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                    >
                      <FileText className="w-3 h-3" /> Invoice
                    </Link>
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
