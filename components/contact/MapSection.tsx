"use client";

import React from "react";
import { MapPin, Navigation } from "lucide-react";

export default function MapSection() {
  return (
    <section className="w-full bg-[#f4f6f9] text-[#001837] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 border border-[#007eff]/50 text-[#007eff] font-bold text-xs tracking-wider uppercase rounded-full px-5 py-2 mb-4 bg-blue-50/50">
            <Navigation className="w-3.5 h-3.5 text-[#007eff]" />
            <span>FIND US ON THE MAP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#001837] tracking-tight leading-[1.12]">
            VISIT OUR HEADQUARTERS &amp; <br />
            <span className="text-[#007eff]">REGIONAL OFFICE</span>
          </h2>
        </div>

        {/* Map Container */}
        <div className="w-full h-[420px] sm:h-[480px] rounded-lg overflow-hidden shadow-xl border border-slate-200/80 relative bg-slate-200">
          <iframe
            title="Cleanix Headquarters Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.059434861217!2d90.41251807607736!3d23.78088748805995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0f4477317%3A0xb1de15d97f5d944d!2sGulshan%202%2C%20Dhaka%201212!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[0.2] contrast-[1.05]"
          />

          {/* Floating Address Overlay Card */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-[#001837] text-white p-6 rounded-2xl shadow-2xl border border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#007eff] flex items-center justify-center text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-base uppercase text-white">
                Cleanix HQ Dhaka
              </h4>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              House 45, Road 11, Block D, Gulshan 2, Dhaka 1212, Bangladesh
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
