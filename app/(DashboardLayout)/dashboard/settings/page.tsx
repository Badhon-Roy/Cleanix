"use client";

import React, { useState } from "react";
import {
  User,
  MapPin,
  Shield,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Phone,
  Mail,
  Home,
  Building,
} from "lucide-react";

export default function CustomerSettingsPage() {
  const [name, setName] = useState("Tanvir Hasan");
  const [email, setEmail] = useState("tanvir.hasan@gmail.com");
  const [phone, setPhone] = useState("+880 1711-223344");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      tag: "Home (Primary)",
      street: "House 42, Road 11, Block D",
      area: "Gulshan-2",
      city: "Dhaka",
      zip: "1212",
      icon: Home,
    },
    {
      id: 2,
      tag: "Corporate Office",
      street: "Level 4, City Tower, Commercial Avenue",
      area: "Motijheel C/A",
      city: "Dhaka",
      zip: "1000",
      icon: Building,
    },
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <User className="w-8 h-8 text-[#007eff]" />
          Account Settings & Address Book
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
          Update personal details, manage saved cleaning delivery addresses, and set communication alerts.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Account profile and settings updated successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
          Personal Information
        </h2>

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#007eff] flex items-center justify-center font-extrabold text-xl text-white">
            TH
          </div>
          <div>
            <button
              type="button"
              className="text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors"
            >
              Upload New Photo
            </button>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">JPG, PNG or GIF up to 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#007eff]" /> Full Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#007eff]" /> Email Address:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#007eff]" /> Phone Number (SMS Alerts):
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#007eff]" /> Role & Account Status:
            </label>
            <input
              type="text"
              value="Customer VIP (Subscriber)"
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-500 cursor-not-allowed font-extrabold"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs px-6 py-3 rounded-2xl flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Saved Address Book */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#007eff]" /> Saved Service Locations
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage property locations for quick cleaner dispatching.</p>
          </div>

          <button
            onClick={() => alert("Add new address dialog")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Location</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const Icon = addr.icon;

            return (
              <div key={addr.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs relative">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#007eff] flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-[#007eff]" /> {addr.tag}
                  </span>
                  <button
                    onClick={() => setAddresses(addresses.filter((a) => a.id !== addr.id))}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-900 font-extrabold">{addr.street}</p>
                <p className="text-slate-600 font-medium">{addr.area}, {addr.city} - {addr.zip}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
