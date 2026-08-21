"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  DollarSign,
  ShieldCheck,
  CreditCard,
  Eye,
} from "lucide-react";

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");

  const [customersList] = useState([
    {
      id: "CUST-8801",
      name: "Tanvir Hasan",
      email: "tanvir.hasan@gmail.com",
      phone: "+880 1711-223344",
      address: "House 42, Road 11, Block D, Gulshan-2",
      plan: "STANDARD PLAN",
      planBadgeColor: "bg-blue-50 text-[#007eff] border-blue-200",
      totalBookings: 12,
      totalSpent: "৳1,68,000",
      joinedDate: "Jan 10, 2026",
      status: "ACTIVE",
    },
    {
      id: "CUST-8802",
      name: "Sabrina Rahman",
      email: "sabrina.r@gmail.com",
      phone: "+880 1819-998877",
      address: "Level 4, City Tower, Motijheel C/A",
      plan: "PREMIUM PLAN",
      planBadgeColor: "bg-blue-50 text-[#007eff] border-blue-200",
      totalBookings: 24,
      totalSpent: "৳3,60,000",
      joinedDate: "Feb 01, 2026",
      status: "ACTIVE",
    },
    {
      id: "CUST-8803",
      name: "Mahmudul Haq",
      email: "mahmudul.haq@yahoo.com",
      phone: "+880 1722-445566",
      address: "Flat 4A, Concord Heights, Dhanmondi 27",
      plan: "BASIC PLAN",
      planBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      totalBookings: 6,
      totalSpent: "৳36,000",
      joinedDate: "Mar 15, 2026",
      status: "ACTIVE",
    },
    {
      id: "CUST-8804",
      name: "Nusrat Jahan",
      email: "nusrat.j@gmail.com",
      phone: "+880 1988-112233",
      address: "House 18, Road 4, Baridhara DOHS",
      plan: "PREMIUM PLAN",
      planBadgeColor: "bg-blue-50 text-[#007eff] border-blue-200",
      totalBookings: 18,
      totalSpent: "৳2,70,000",
      joinedDate: "Jan 22, 2026",
      status: "ACTIVE",
    },
  ]);

  const filteredCustomers = customersList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan =
      planFilter === "ALL" ? true : c.plan.includes(planFilter);

    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 stroke-[2.5]" />
              </div>
              Customer CRM & Subscription Plans
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              ⚡ 38 ACTIVE SUBSCRIPTIONS
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Manage residential & B2B commercial customer accounts, active monthly subscription plans, and lifetime spent.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Plan Filter Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Subscription Filter:</span>
            {["ALL", "BASIC", "STANDARD", "PREMIUM"].map((pf) => (
              <button
                key={pf}
                type="button"
                onClick={() => setPlanFilter(pf)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer transition-all ${
                  planFilter === pf
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {pf}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Customer Name, Email, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Primary Address</th>
                <th className="p-4">Active Plan</th>
                <th className="p-4">Total Bookings</th>
                <th className="p-4">Lifetime Spent</th>
                <th className="p-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-[#007eff]">{c.id}</td>
                  <td className="p-4">
                    <p className="font-extrabold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{c.email}</p>
                    <p className="text-[11px] text-[#007eff] font-bold">{c.phone}</p>
                  </td>
                  <td className="p-4 text-slate-700 font-semibold max-w-xs truncate">
                    {c.address}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-black px-3 py-1 rounded-full border ${c.planBadgeColor}`}>
                      {c.plan}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-slate-900">{c.totalBookings} Bookings</td>
                  <td className="p-4 font-black text-emerald-700 text-base">{c.totalSpent}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.status}
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
