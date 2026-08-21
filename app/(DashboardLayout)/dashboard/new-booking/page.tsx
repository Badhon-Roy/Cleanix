"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  MapPin,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function NewBookingPage() {
  const [serviceType, setServiceType] = useState<string>("RESIDENTIAL");
  const [sqft, setSqft] = useState<number>(1200);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [scheduledDate, setScheduledDate] = useState<string>("2026-08-25");
  const [timeSlot, setTimeSlot] = useState<string>("09:00 AM - 11:00 AM");
  const [paymentMethod, setPaymentMethod] = useState<string>("BKASH");
  const [address, setAddress] = useState<string>("House 42, Road 11, Block D, Gulshan-2, Dhaka");
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Selected add-ons state
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
    sofa: false,
    oven: false,
    fridge: false,
    window: false,
    pet: false,
  });

  const addonPrices: Record<string, { label: string; price: number }> = {
    sofa: { label: "Sofa & Carpet Shampoo Wash", price: 2000 },
    oven: { label: "Kitchen Oven & Chimney Wash", price: 1200 },
    fridge: { label: "Refrigerator Deep Sanitization", price: 1000 },
    window: { label: "Interior Glass & Window Clean", price: 800 },
    pet: { label: "Pet Hygiene & Odor Treatment", price: 1500 },
  };

  const toggleAddon = (key: string) => {
    setSelectedAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamic Pricing Calculation Algorithm (From REQUIREMENTS.txt)
  // Base Service Fee (৳1,500) + (SqFt * ৳2.5) + (Bedrooms * ৳500) + (Bathrooms * ৳400) + Selected Addons
  const baseFee = 1500;
  const sqftCost = sqft * 2.5;
  const bedroomCost = bedrooms * 500;
  const bathroomCost = bathrooms * 400;

  const addonsTotal = Object.keys(selectedAddons).reduce((acc, key) => {
    if (selectedAddons[key]) {
      return acc + addonPrices[key].price;
    }
    return acc;
  }, 0);

  const totalAmount = baseFee + sqftCost + bedroomCost + bathroomCost + addonsTotal;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Calculator className="w-8 h-8 text-[#007eff]" />
          Instant Booking & Dynamic Price Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
          Customize your cleaning parameters, pick time slots, and lock instant quotes with atomic time-slot availability.
        </p>
      </div>

      {bookingSuccess ? (
        <div className="bg-white border border-emerald-300 rounded-3xl p-8 sm:p-12 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#007eff] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-bold">
              Booking Ref: #CLN-2026-9042
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Booking Confirmed & Time Slot Locked! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
              Your appointment for <strong className="text-slate-900">{scheduledDate} ({timeSlot})</strong> has been reserved. A confirmation PDF invoice has been sent to your email.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard/bookings"
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center gap-2"
            >
              <span>Track Booking Live</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setBookingSuccess(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl border border-slate-200"
            >
              Book Another Service
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Inputs (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Service Type Selector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#007eff] text-white text-xs font-extrabold flex items-center justify-center">
                  1
                </span>
                Select Service Category
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "RESIDENTIAL", label: "Residential Home" },
                  { id: "COMMERCIAL", label: "Commercial Office" },
                  { id: "MOVE_IN_OUT", label: "Move-In / Out" },
                  { id: "POST_CONSTRUCTION", label: "Post-Construction" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceType(s.id)}
                    className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all ${
                      serviceType === s.id
                        ? "border-[#007eff] bg-blue-50 text-[#007eff]"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Property Specs (SqFt Slider & Room Steppers) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#007eff] text-white text-xs font-extrabold flex items-center justify-center">
                  2
                </span>
                Property Size & Room Configuration
              </h3>

              {/* SqFt Slider */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">Total Property Area:</span>
                  <span className="text-lg font-extrabold text-[#007eff]">{sqft.toLocaleString()} SqFt</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={8000}
                  step={50}
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#007eff]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold">
                  <span>300 SqFt</span>
                  <span>4,000 SqFt</span>
                  <span>8,000 SqFt</span>
                </div>
              </div>

              {/* Bedrooms & Bathrooms Steppers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bedrooms */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Bedrooms</h4>
                    <p className="text-[11px] text-slate-500 font-medium">৳500 / Bedroom</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-800 flex items-center justify-center font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-extrabold text-slate-900 w-6 text-center">{bedrooms}</span>
                    <button
                      type="button"
                      onClick={() => setBedrooms(bedrooms + 1)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-800 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Bathrooms</h4>
                    <p className="text-[11px] text-slate-500 font-medium">৳400 / Bathroom</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-800 flex items-center justify-center font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-extrabold text-slate-900 w-6 text-center">{bathrooms}</span>
                    <button
                      type="button"
                      onClick={() => setBathrooms(bathrooms + 1)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 text-slate-800 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Add-On Services Selection */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#007eff] text-white text-xs font-extrabold flex items-center justify-center">
                  3
                </span>
                Select Service Add-Ons (Optional)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(addonPrices).map((key) => {
                  const item = addonPrices[key];
                  const isChecked = selectedAddons[key];

                  return (
                    <div
                      key={key}
                      onClick={() => toggleAddon(key)}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? "border-amber-400 bg-amber-50 text-slate-900"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                            isChecked ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      <span className="text-xs font-extrabold text-amber-700">+৳{item.price.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Date, Time Slot & Address */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#007eff] text-white text-xs font-extrabold flex items-center justify-center">
                  4
                </span>
                Schedule & Location Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Date Picker */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Select Date:</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white"
                  />
                </div>

                {/* Time Slot */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Preferred Time Slot:</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM Slot</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM Slot</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM Slot</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM Slot</option>
                  </select>
                </div>
              </div>

              {/* Service Address */}
              <div className="space-y-1.5 text-xs pt-2">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#007eff]" /> Service Location Address:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address in Dhaka..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#007eff] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Right Summary & Checkout Box (Col 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sticky top-28 space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#007eff]">
                  Instant Quote Summary
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Live Calculation</h3>
              </div>

              {/* Itemized Calculation Breakdown */}
              <div className="space-y-2.5 text-xs border-y border-slate-200 py-4 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Base Service Fee:</span>
                  <span>৳{baseFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SqFt Rate ({sqft} × ৳2.5):</span>
                  <span>৳{sqftCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Bedrooms ({bedrooms} × ৳500):</span>
                  <span>৳{bedroomCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Bathrooms ({bathrooms} × ৳400):</span>
                  <span>৳{bathroomCost.toLocaleString()}</span>
                </div>

                {addonsTotal > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Selected Add-Ons:</span>
                    <span>+৳{addonsTotal.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-extrabold text-slate-900 font-sans">
                  <span>Total Amount:</span>
                  <span className="text-[#007eff] text-xl">৳{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Time Slot Lock Notice */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-[11px] text-blue-800 flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#007eff] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>10-Min Slot Reservation Lock:</strong> Completing this booking locks your cleaner team for {scheduledDate}.
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700">Select Payment Method:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "BKASH", label: "bKash" },
                    { id: "STRIPE", label: "Card / Stripe" },
                    { id: "SSLCOMMERZ", label: "SSLCommerz" },
                    { id: "COD", label: "Cash on Delivery" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id)}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all ${
                        paymentMethod === p.id
                          ? "border-[#007eff] bg-blue-50 text-[#007eff]"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Confirm & Pay ৳{totalAmount.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
